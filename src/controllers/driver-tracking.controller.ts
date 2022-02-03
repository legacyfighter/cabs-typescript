import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DriverTrackingService } from '../service/driver-tracking.service';
import { DriverPositionDto } from '../dto/driver-position.dto';
import { CreateDriverPositionDto } from '../dto/create-driver-position.dto';
import { DriverPosition } from '../entity/driver-position.entity';

@Controller('driverPositions')
export class DriverTrackingController {
  constructor(private readonly trackingService: DriverTrackingService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public async create(
    @Body() createDriverPositionDto: CreateDriverPositionDto,
  ): Promise<DriverPositionDto> {
    console.log('dto', createDriverPositionDto);
    const driverPosition = await this.trackingService.registerPosition(
      createDriverPositionDto.driverId,
      createDriverPositionDto.latitude,
      createDriverPositionDto.longitude,
    );

    return this.toDto(driverPosition);
  }

  @Get(':driverId/total')
  public async calculateTravelledDistance(
    @Param('driverId') driverId: string,
    @Body() params: { from: number; to: number },
  ): Promise<number> {
    return this.trackingService.calculateTravelledDistance(
      driverId,
      params.from,
      params.to,
    );
  }

  private toDto(driverPosition: DriverPosition) {
    return new DriverPositionDto(
      driverPosition.getDriver().getId(),
      driverPosition.getLatitude(),
      driverPosition.getLongitude(),
      driverPosition.getSeenAt(),
    );
  }
}
