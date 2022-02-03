import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DriverSessionService } from '../service/driver-session.service';
import { DriverSession } from '../entity/driver-session.entity';
import { CreateDriverSessionDto } from '../dto/create-driver-session.dto';

@Controller('drivers')
export class DriverSessionController {
  constructor(private readonly driverSessionService: DriverSessionService) {}

  @Post(':driverId/driverSessions/login')
  public async logIn(
    @Param('driverId') driverId: string,
    @Body() createSessionDto: CreateDriverSessionDto,
  ): Promise<void> {
    await this.driverSessionService.logIn(
      driverId,
      createSessionDto.platesNumber,
      createSessionDto.carClass,
      createSessionDto.carBrand,
    );
  }

  @Delete(':driverId/driverSessions/:sessionId')
  public async logOut(
    @Param('driverId') driverId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<void> {
    await this.driverSessionService.logOut(sessionId);
  }

  @Delete(':driverId/driverSessions')
  public async logOutCurrent(
    @Param('driverId') driverId: string,
  ): Promise<void> {
    await this.driverSessionService.logOutCurrentSession(driverId);
  }

  @Get(':driverId/driverSessions')
  public async list(
    @Param('driverId') driverId: string,
  ): Promise<DriverSession[]> {
    return this.driverSessionService.findByDriver(driverId);
  }
}
