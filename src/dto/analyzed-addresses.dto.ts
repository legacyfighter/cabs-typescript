import { AddressDto } from './address.dto';

export class AnalyzedAddressesDto {
  public addresses: AddressDto[];

  constructor(addresses: AddressDto[]) {
    this.addresses = addresses;
  }

  public getAddresses() {
    return this.addresses;
  }

  public setAddresses(addresses: AddressDto[]) {
    this.addresses = addresses;
  }
}
