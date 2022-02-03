import { Controller, Get, Param } from '@nestjs/common';
import { TransitAnalyzerService } from '../service/transit-analyzer.service';
import { AnalyzedAddressesDto } from '../dto/analyzed-addresses.dto';
import { AddressDto } from '../dto/address.dto';

@Controller('transitAnalyze')
export class TransitAnalyzerController {
  constructor(private readonly transitAnalyzer: TransitAnalyzerService) {}

  @Get(':clientId/:addressId')
  public async analyze(
    @Param('clientId') clientId: string,
    @Param('addressId') addressId: string,
  ): Promise<AnalyzedAddressesDto> {
    const addresses = await this.transitAnalyzer.analyze(clientId, addressId);
    const addressDtos = addresses.map((a) => new AddressDto(a));

    return new AnalyzedAddressesDto(addressDtos);
  }
}
