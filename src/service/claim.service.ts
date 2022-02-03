import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from '../repository/client.repository';
import { TransitRepository } from '../repository/transit.repository';
import { AppProperties } from '../config/app-properties.config';
import { ClaimRepository } from '../repository/claim.repository';
import { ClaimNumberGenerator } from './claim-number-generator.service';
import { AwardsService } from './awards.service';
import { ClientNotificationService } from './client-notification.service';
import { DriverNotificationService } from './driver-notification.service';
import { ClaimDto } from '../dto/claim.dto';
import { Claim, ClaimStatus, CompletionMode } from '../entity/claim.entity';
import { Type } from '../entity/client.entity';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
    @InjectRepository(TransitRepository)
    private transitRepository: TransitRepository,
    @InjectRepository(ClaimRepository)
    private claimRepository: ClaimRepository,
    private claimNumberGenerator: ClaimNumberGenerator,
    private awardsService: AwardsService,
    private clientNotificationService: ClientNotificationService,
    private driverNotificationService: DriverNotificationService,
    private appProperties: AppProperties,
  ) {}

  public async create(claimDTO: ClaimDto): Promise<Claim> {
    let claim = new Claim();
    claim.setCreationDate(Date.now());
    claim.setClaimNo(await this.claimNumberGenerator.generate(claim));
    claim = await this.update(claimDTO, claim);
    return claim;
  }

  public async find(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne(id);
    if (!claim) {
      throw new NotFoundException('Claim does not exists');
    }
    return claim;
  }

  public async update(claimDTO: ClaimDto, claim: Claim) {
    const client = await this.clientRepository.findOne(claimDTO.getClientId());
    const transit = await this.transitRepository.findOne(
      claimDTO.getTransitId(),
    );
    if (client == null) {
      throw new NotFoundException('Client does not exists');
    }
    if (transit == null) {
      throw new NotFoundException('Transit does not exists');
    }
    if (claimDTO.isDraft()) {
      claim.setStatus(ClaimStatus.DRAFT);
    } else {
      claim.setStatus(ClaimStatus.NEW);
    }
    claim.setOwner(client);
    claim.setTransit(transit);
    claim.setCreationDate(Date.now());
    claim.setReason(claimDTO.getReason());
    claim.setIncidentDescription(claimDTO.getIncidentDescription());
    return this.claimRepository.save(claim);
  }

  public async setStatus(newStatus: ClaimStatus, id: string) {
    const claim = await this.find(id);
    claim.setStatus(newStatus);
    await this.claimRepository.save(claim);
    return claim;
  }

  public async tryToResolveAutomatically(id: string): Promise<Claim> {
    const claim = await this.find(id);
    if (
      (
        await this.claimRepository.findByOwnerAndTransit(
          claim.getOwner(),
          claim.getTransit(),
        )
      ).length > 1
    ) {
      claim.setStatus(ClaimStatus.ESCALATED);
      claim.setCompletionDate(Date.now());
      claim.setChangeDate(Date.now());
      claim.setCompletionMode(CompletionMode.MANUAL);
      return claim;
    }
    if (
      (await this.claimRepository.findByOwner(claim.getOwner())).length <= 3
    ) {
      claim.setStatus(ClaimStatus.REFUNDED);
      claim.setCompletionDate(Date.now());
      claim.setChangeDate(Date.now());
      claim.setCompletionMode(CompletionMode.AUTOMATIC);
      await this.clientNotificationService.notifyClientAboutRefund(
        claim.getClaimNo(),
        claim.getOwner().getId(),
      );
      return claim;
    }
    if (claim.getOwner().getType() === Type.VIP) {
      if (
        (claim.getTransit().getPrice() ?? 0) <
        this.appProperties.getAutomaticRefundForVipThreshold()
      ) {
        claim.setStatus(ClaimStatus.REFUNDED);
        claim.setCompletionDate(Date.now());
        claim.setChangeDate(Date.now());
        claim.setCompletionMode(CompletionMode.AUTOMATIC);
        await this.clientNotificationService.notifyClientAboutRefund(
          claim.getClaimNo(),
          claim.getOwner().getId(),
        );
        await this.awardsService.registerSpecialMiles(
          claim.getOwner().getId(),
          10,
        );
      } else {
        claim.setStatus(ClaimStatus.ESCALATED);
        claim.setCompletionDate(Date.now());
        claim.setChangeDate(Date.now());
        claim.setCompletionMode(CompletionMode.MANUAL);
        const driver = claim.getTransit().getDriver();
        if (driver) {
          await this.driverNotificationService.askDriverForDetailsAboutClaim(
            claim.getClaimNo(),
            driver.getId(),
          );
        }
      }
    } else {
      if (
        (await this.transitRepository.findByClient(claim.getOwner())).length >=
        this.appProperties.getNoOfTransitsForClaimAutomaticRefund()
      ) {
        if (
          (claim.getTransit().getPrice() ?? 0) <
          this.appProperties.getAutomaticRefundForVipThreshold()
        ) {
          claim.setStatus(ClaimStatus.REFUNDED);
          claim.setCompletionDate(Date.now());
          claim.setChangeDate(Date.now());
          claim.setCompletionMode(CompletionMode.AUTOMATIC);
          await this.clientNotificationService.notifyClientAboutRefund(
            claim.getClaimNo(),
            claim.getOwner().getId(),
          );
        } else {
          claim.setStatus(ClaimStatus.ESCALATED);
          claim.setCompletionDate(Date.now());
          claim.setChangeDate(Date.now());
          claim.setCompletionMode(CompletionMode.MANUAL);
          await this.clientNotificationService.askForMoreInformation(
            claim.getClaimNo(),
            claim.getOwner().getId(),
          );
        }
      } else {
        claim.setStatus(ClaimStatus.ESCALATED);
        claim.setCompletionDate(Date.now());
        claim.setChangeDate(Date.now());
        claim.setCompletionMode(CompletionMode.MANUAL);
        await this.driverNotificationService.askDriverForDetailsAboutClaim(
          claim.getClaimNo(),
          claim.getOwner().getId(),
        );
      }
    }

    return claim;
  }
}
