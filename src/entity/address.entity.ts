import { BaseEntity } from '../common/base.entity';
import { Column, Entity } from 'typeorm';
import * as objectHash from 'object-hash';

@Entity()
export class Address extends BaseEntity {
  @Column()
  private country: string;

  @Column({ nullable: true, type: 'varchar' })
  private district: string | null;

  @Column()
  private city: string;

  @Column()
  private street: string;

  @Column()
  private buildingNumber: number;

  @Column({ nullable: true, type: 'integer' })
  private additionalNumber: number | null;

  @Column()
  private postalCode: string;

  @Column()
  private name: string;

  @Column({ unique: true })
  private hash: string;

  constructor(
    country: string,
    city: string,
    street: string,
    buildingNumber: number,
  ) {
    super();
    this.country = country;
    this.city = city;
    this.street = street;
    this.buildingNumber = buildingNumber;
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

  public setAdditionalNumber(additionalNumber: number | null) {
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

  public setHash() {
    this.hash = objectHash({
      country: this.country,
      district: this.district,
      city: this.city,
      street: this.street,
      buildingNumber: this.buildingNumber,
      additionalNumber: this.additionalNumber,
      postalCode: this.postalCode,
      name: this.name,
    });
  }

  public getHash() {
    this.setHash();
    return this.hash;
  }

  public toString() {
    return (
      'Address{' +
      "id='" +
      this.getId() +
      "'" +
      ", country='" +
      this.country +
      "'" +
      ", district='" +
      this.district +
      "'" +
      ", city='" +
      this.city +
      "'" +
      ", street='" +
      this.street +
      "'" +
      ', buildingNumber=' +
      this.buildingNumber +
      ', additionalNumber=' +
      this.additionalNumber +
      ", postalCode='" +
      this.postalCode +
      "'" +
      ", name='" +
      this.name +
      "'" +
      '}'
    );
  }
}
