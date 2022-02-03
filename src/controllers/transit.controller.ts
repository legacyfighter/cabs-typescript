import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransitService } from '../service/transit.service';
import { TransitDto } from '../dto/transit.dto';
import { CreateAddressDto } from '../dto/create-address.dto';
import { AddressDto } from '../dto/address.dto';
import { CreateTransitDto } from '../dto/create-transit.dto';

@Controller('transits')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @Get(':transitId')
  public async getTransit(
    @Param('transitId') transitId: string,
  ): Promise<TransitDto> {
    return this.transitService.loadTransit(transitId);
  }

  @Post()
  public async createTransit(
    @Body() createTransitDto: CreateTransitDto,
  ): Promise<TransitDto> {
    const transit = await this.transitService.createTransit(createTransitDto);
    return this.transitService.loadTransit(transit.getId());
  }

  @Post(':transitId/changeAddressTo')
  public async changeAddressTo(
    @Param('transitId') transitId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<TransitDto> {
    await this.transitService.changeTransitAddressTo(
      transitId,
      new AddressDto(createAddressDto),
    );
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/changeAddressFrom')
  public async changeAddressFrom(
    @Param('transitId') transitId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<TransitDto> {
    await this.transitService.changeTransitAddressFrom(
      transitId,
      new AddressDto(createAddressDto),
    );
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/cancel')
  public async cancel(
    @Param('transitId') transitId: string,
  ): Promise<TransitDto> {
    await this.transitService.cancelTransit(transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/publish')
  public async publishTransit(
    @Param('transitId') transitId: string,
  ): Promise<TransitDto> {
    await this.transitService.publishTransit(transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/findDrivers')
  public async findDriversForTransit(
    @Param('transitId') transitId: string,
  ): Promise<TransitDto> {
    await this.transitService.findDriversForTransit(transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/accept/:driverId')
  public async acceptTransit(
    @Param('transitId') transitId: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDto> {
    await this.transitService.acceptTransit(driverId, transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/start/:driverId')
  public async start(
    @Param('transitId') transitId: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDto> {
    await this.transitService.startTransit(driverId, transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/reject/:driverId')
  public async reject(
    @Param('transitId') transitId: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDto> {
    await this.transitService.rejectTransit(driverId, transitId);
    return this.transitService.loadTransit(transitId);
  }

  @Post(':transitId/complete/:driverId')
  public async complete(
    @Param('transitId') transitId: string,
    @Param('driverId') driverId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<TransitDto> {
    await this.transitService.completeTransitFromDto(
      driverId,
      transitId,
      new AddressDto(createAddressDto),
    );
    return this.transitService.loadTransit(transitId);
  }
}
