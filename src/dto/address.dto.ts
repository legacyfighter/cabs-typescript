import { Address } from '../entity/address.entity';

export class AddressDto {
  public country: string;

  public district: string | null;

  public city: string;

  public street: string;

  public buildingNumber: number;

  public additionalNumber: number | null;

  public postalCode: string;

  public name: string;

  public constructor(
    a:
      | Address
      | {
          country: string;
          city: string;
          street: string;
          buildingNumber: number;
          postalCode: string;
        },
  ) {
    if (a instanceof Address) {
      this.country = a.getCountry();
      this.district = a.getDistrict();
      this.city = a.getCity();
      this.street = a.getStreet();
      this.buildingNumber = a.getBuildingNumber();
      this.additionalNumber = a.getAdditionalNumber();
      this.postalCode = a.getPostalCode();
      this.name = a.getName();
    } else {
      this.country = a.country;
      this.city = a.city;
      this.street = a.street;
      this.buildingNumber = a.buildingNumber;
      this.postalCode = a.postalCode;
    }
  }
  public getCountry() {
    return this.country;
  }

  public setCountry(country: string) {
    this.country = country;
  }

  public getDistrict() {
    return this.district;
  }

  public setDistrict(district: string | null) {
    this.district = district;
  }

  public getCity() {
    return this.city;
  }

  public setCity(city: string) {
    this.city = city;
  }

  public getStreet() {
    return this.street;
  }

  public setStreet(street: string) {
    this.street = street;
  }

  public getBuildingNumber() {
    return this.buildingNumber;
  }

  public setBuildingNumber(buildingNumber: number) {
    this.buildingNumber = buildingNumber;
  }

  public getAdditionalNumber() {
    return this.additionalNumber;
  }

  public setAdditionalNumber(additionalNumber: number) {
    this.additionalNumber = additionalNumber;
  }

  public getPostalCode() {
    return this.postalCode;
  }

  public setPostalCode(postalCode: string) {
    this.postalCode = postalCode;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public toAddressEntity() {
    const address = new Address(
      this.getCountry(),
      this.getCity(),
      this.getStreet(),
      this.getBuildingNumber(),
    );
    address.setAdditionalNumber(this.getAdditionalNumber());
    address.setName(this.getName() ?? '');
    address.setPostalCode(this.getPostalCode());
    address.setDistrict(this.getDistrict());
    address.setHash();
    return address;
  }
}
