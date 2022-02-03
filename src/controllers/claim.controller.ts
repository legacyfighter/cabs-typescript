import { ClaimService } from '../service/claim.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClaimDto } from '../dto/claim.dto';
import { Claim, ClaimStatus } from '../entity/claim.entity';
import { CreateClaimDto } from '../dto/create-claim.dto';

@Controller('claims')
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @Post('createDraft')
  public async create(@Body() createClaimDto: CreateClaimDto) {
    const created = await this.claimService.create(
      new ClaimDto(createClaimDto),
    );
    return this.toDto(created);
  }

  @Post('send')
  public async sendNew(@Body() createClaimDto: CreateClaimDto) {
    const claimDto = new ClaimDto(createClaimDto);
    claimDto.setDraft(false);
    const claim = await this.claimService.create(claimDto);
    return this.toDto(claim);
  }

  @Post(':claimId/markInProcess')
  public async markAsInProcess(@Param('claimId') claimId: string) {
    const claim = await this.claimService.setStatus(
      ClaimStatus.IN_PROCESS,
      claimId,
    );
    return this.toDto(claim);
  }

  @Get(':claimId')
  public async find(@Param('claimId') claimId: string) {
    const claim = await this.claimService.find(claimId);
    const dto = this.toDto(claim);
    return dto;
  }

  @Post('/claims/:claimId')
  public async tryToAutomaticallyResolve(@Param('claimId') claimId: string) {
    const claim = await this.claimService.tryToResolveAutomatically(claimId);
    return this.toDto(claim);
  }

  private toDto(claim: Claim) {
    return new ClaimDto(claim);
  }
}
