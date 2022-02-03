import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Transit } from './transit.entity';
import { DriverAttribute } from './driver-attribute.entity';
import { DriverFee } from './driver-fee.entity';

export enum DriverStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export enum DriverType {
  CANDIDATE = 'candidate',
  REGULAR = 'regular',
}

@Entity()
export class Driver extends BaseEntity {
  @Column()
  private status: DriverStatus;

  @Column()
  private firstName: string;

  @Column()
  private lastName: string;

  @Column()
  private driverLicense: string;

  @Column({ nullable: true, type: 'varchar' })
  private photo: string | null;

  @Column()
  private type: DriverType;

  @Column({ default: false })
  private isOccupied: boolean;

  @OneToOne(() => DriverFee, (fee) => fee.driver)
  @JoinColumn()
  public fee: DriverFee;

  public getAttributes() {
    return this.attributes || [];
  }

  public setAttributes(attributes: DriverAttribute[]) {
    this.attributes = attributes;
  }

  @OneToMany(() => DriverAttribute, (driverAttribute) => driverAttribute.driver)
  public attributes: DriverAttribute[];

  @OneToMany(() => Transit, (transit) => transit.driver)
  public transits: Transit[];

  public calculateEarningsForTransit(transit: Transit) {
    console.log(transit);
    return null;
    // zdublować kod wyliczenia kosztu przejazdu
  }

  public setLastName(lastName: string) {
    this.lastName = lastName;
  }

  public setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  public setDriverLicense(license: string) {
    this.driverLicense = license;
  }

  public setStatus(status: DriverStatus) {
    this.status = status;
  }

  public setType(type: DriverType) {
    this.type = type;
  }

  public setPhoto(photo: string) {
    this.photo = photo;
  }

  public getLastName() {
    return this.lastName;
  }

  public getFirstName() {
    return this.firstName;
  }

  public getDriverLicense() {
    return this.driverLicense;
  }

  public getStatus() {
    return this.status;
  }

  public getType() {
    return this.type;
  }

  public getPhoto() {
    return this.photo;
  }

  public getFee() {
    return this.fee;
  }

  public setFee(fee: DriverFee) {
    this.fee = fee;
  }

  public getOccupied() {
    return this.isOccupied;
  }

  public setOccupied(isOccupied: boolean) {
    this.isOccupied = isOccupied;
  }

  public getTransits() {
    return this.transits || [];
  }
}
