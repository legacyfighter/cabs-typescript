import { DriverService } from '../service/driver.service';
import { DriverRepository } from '../repository/driver.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimRepository } from '../repository/claim.repository';
import { DriverSessionRepository } from '../repository/driver-session.repository';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DriverReport } from '../dto/driver-report.dto';
import { DriverAttributeName } from '../entity/driver-attribute.entity';
import { DriverAttributeDto } from '../dto/driver-attribute.dto';
import * as dayjs from 'dayjs';
import { DriverSessionDto } from '../dto/driver-session.dto';
import { TransitDto } from '../dto/transit.dto';
import { Status, Transit } from '../entity/transit.entity';
import { ClaimDto } from '../dto/claim.dto';

@Controller('driverreport')
export class DriverReportController {
  constructor(
    private driverService: DriverService,
    @InjectRepository(DriverRepository)
    private driverRepository: DriverRepository,
    @InjectRepository(ClaimRepository)
    private claimRepository: ClaimRepository,
    @InjectRepository(DriverSessionRepository)
    private driverSessionRepository: DriverSessionRepository,
  ) {}

  @Get(':driverId')
  public async loadReportForDriver(
    @Param('driverId') driverId: string,
    @Body() body: { lastDays: number },
  ): Promise<DriverReport> {
    const driverReport = new DriverReport();
    const driverDto = await this.driverService.loadDriver(driverId);

    driverReport.setDriverDTO(driverDto);
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(`Driver with id ${driverId} not exists`);
    }

    driver
      .getAttributes()
      .filter(
        (attr) =>
          attr.getName() !== DriverAttributeName.MEDICAL_EXAMINATION_REMARKS,
      )
      .forEach((attr) =>
        driverReport.getAttributes().push(new DriverAttributeDto(attr)),
      );

    const beggingOfToday = dayjs().startOf('day');
    const since = beggingOfToday.subtract(body.lastDays, 'days');
    const allByDriverAndLoggedAtAfter =
      await this.driverSessionRepository.findAllByDriverAndLoggedAtAfter(
        driver,
        since.valueOf(),
      );
    const sessionsWithTransits: Map<DriverSessionDto, TransitDto[]> = new Map();
    for (const session of allByDriverAndLoggedAtAfter) {
      const dto = new DriverSessionDto(session);
      const transitsInSession: Transit[] = Array.from(
        driver?.getTransits(),
      ).filter(
        (t) =>
          t.getStatus() === Status.COMPLETED &&
          !dayjs(t.getCompleteAt()).isBefore(session.getLoggedAt()) &&
          !dayjs(t.getCompleteAt()).isAfter(session.getLoggedOutAt()),
      );

      const transitsDtosInSession: TransitDto[] = [];
      for (const t of transitsInSession) {
        const transitDTO = new TransitDto(t);
        const byOwnerAndTransit =
          await this.claimRepository.findByOwnerAndTransit(t.getClient(), t);
        if (byOwnerAndTransit.length) {
          const claim = new ClaimDto(byOwnerAndTransit[0]);
          transitDTO.setClaimDTO(claim);
        }
        transitsDtosInSession.push(transitDTO);
      }
      sessionsWithTransits.set(dto, transitsDtosInSession);
    }
    driverReport.setSessions(sessionsWithTransits);
    return driverReport;
  }
}
