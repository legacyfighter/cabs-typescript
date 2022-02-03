import { ForbiddenException } from '@nestjs/common';
import { BaseEntity } from '../common/base.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Driver } from './driver.entity';
import { Client, PaymentType } from './client.entity';
import { Address } from './address.entity';
import { CarClass } from './car-type.entity';

export enum Status {
  DRAFT = 'draft',
  CANCELLED = 'cancelled',
  WAITING_FOR_DRIVER_ASSIGNMENT = 'waiting_for_driver_assignment',
  DRIVER_ASSIGNMENT_FAILED = 'driver_assignment_failed',
  TRANSIT_TO_PASSENGER = 'transit_to_passenger',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
}

export enum DriverPaymentStatus {
  NOT_PAID = 'not_paid',
  PAID = 'paid',
  CLAIMED = 'claimed',
  RETURNED = 'returned',
}

export enum ClientPaymentStatus {
  NOT_PAID = 'not_paid',
  PAID = 'paid',
  RETURNED = 'returned',
}

export enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum DayOfWeek {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

@Entity()
export class Transit extends BaseEntity {
  public static readonly BASE_FEE = 8;

  @ManyToOne(() => Driver, (driver) => driver.transits, { eager: true })
  public driver: Driver | null;

  @Column({ nullable: true })
  private driverPaymentStatus: DriverPaymentStatus;

  @Column({ nullable: true })
  private clientPaymentStatus: ClientPaymentStatus;

  @Column({ nullable: true })
  private paymentType: PaymentType;

  @Column()
  private status: Status;

  @Column({ type: 'bigint', nullable: true })
  private date: number;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn()
  private from: Address;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn()
  private to: Address;

  @Column({ nullable: true, type: 'bigint' })
  public acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  public started: number | null;

  @Column({ default: 0 })
  public pickupAddressChangeCounter: number;

  @ManyToMany(() => Driver)
  public driversRejections: Driver[];

  @ManyToMany(() => Driver)
  public proposedDrivers: Driver[];

  @Column({ default: 0, type: 'integer' })
  public awaitingDriversResponses: number;

  @Column({ nullable: true, type: 'varchar' })
  public factor: number | null;

  @Column({ nullable: false, default: 0 })
  private km: number;

  // https://stackoverflow.com/questions/37107123/sould-i-store-price-as-decimal-or-integer-in-mysql
  @Column({ nullable: true, type: 'integer' })
  private price: number | null;

  @Column({ nullable: true, type: 'integer' })
  private estimatedPrice: number | null;

  @Column({ nullable: true })
  private driversFee: number;

  @Column({ type: 'bigint', nullable: true })
  public dateTime: number;

  @Column({ type: 'bigint', nullable: true })
  private published: number;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn()
  private client: Client;

  @Column()
  private carType: CarClass;

  @Column({ type: 'bigint', nullable: true })
  private completeAt: number;

  public getCarType() {
    return this.carType as CarClass;
  }

  public setCarType(carType: CarClass) {
    this.carType = carType;
  }

  public getDriver() {
    return this.driver;
  }

  public getPrice() {
    return this.price;
  }

  //just for testing
  public setPrice(price: number) {
    this.price = price;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: Status) {
    this.status = status;
  }

  public getCompleteAt() {
    return this.completeAt;
  }

  public getClient() {
    return this.client;
  }

  public setClient(client: Client) {
    this.client = client;
  }

  public setDateTime(dateTime: number) {
    this.dateTime = dateTime;
  }

  public getDateTime() {
    return this.dateTime;
  }

  public getPublished() {
    return this.published;
  }

  public setPublished(published: number) {
    this.published = published;
  }

  public setDriver(driver: Driver | null) {
    this.driver = driver;
  }

  public getKm() {
    return this.km;
  }

  public setKm(km: number) {
    this.km = km;
    this.estimateCost();
  }

  public getAwaitingDriversResponses() {
    return this.awaitingDriversResponses;
  }

  public setAwaitingDriversResponses(proposedDriversCounter: number) {
    this.awaitingDriversResponses = proposedDriversCounter;
  }

  public getDriversRejections() {
    return this.driversRejections || [];
  }

  public setDriversRejections(driversRejections: Driver[]) {
    this.driversRejections = driversRejections;
  }

  public getProposedDrivers() {
    return this.proposedDrivers || [];
  }

  public setProposedDrivers(proposedDrivers: Driver[]) {
    this.proposedDrivers = proposedDrivers;
  }

  public getAcceptedAt() {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: number) {
    this.acceptedAt = acceptedAt;
  }

  public getStarted() {
    return this.started;
  }

  public setStarted(started: number) {
    this.started = started;
  }

  public getFrom() {
    return this.from;
  }

  public setFrom(from: Address) {
    this.from = from;
  }

  public getTo() {
    return this.to;
  }

  public setTo(to: Address) {
    this.to = to;
  }

  public getPickupAddressChangeCounter() {
    return this.pickupAddressChangeCounter;
  }

  public setPickupAddressChangeCounter(pickupChanges: number) {
    this.pickupAddressChangeCounter = pickupChanges;
  }

  public setCompleteAt(when: number) {
    this.completeAt = when;
  }

  public getDriversFee() {
    return this.driversFee;
  }

  public setDriversFee(driversFee: number) {
    this.driversFee = driversFee;
  }

  public getEstimatedPrice() {
    return this.estimatedPrice;
  }

  public setEstimatedPrice(estimatedPrice: number) {
    this.estimatedPrice = estimatedPrice;
  }

  public estimateCost() {
    if (this.status === Status.COMPLETED) {
      throw new ForbiddenException(
        'Estimating cost for completed transit is forbidden, id = ' +
          this.getId(),
      );
    }

    this.estimatedPrice = this.calculateCost();

    this.price = null;

    return this.estimatedPrice;
  }

  public calculateFinalCosts(): number {
    if (this.status === Status.COMPLETED) {
      return this.calculateCost();
    } else {
      throw new ForbiddenException(
        'Cannot calculate final cost if the transit is not completed',
      );
    }
  }

  private calculateCost(): number {
    let baseFee = Transit.BASE_FEE;
    let factorToCalculate = this.factor;
    if (factorToCalculate == null) {
      factorToCalculate = 1;
    }
    let kmRate: number;
    const day = new Date();
    // wprowadzenie nowych cennikow od 1.01.2019
    if (day.getFullYear() <= 2018) {
      kmRate = 1.0;
      baseFee++;
    } else {
      if (
        (day.getMonth() == Month.DECEMBER && day.getDate() == 31) ||
        (day.getMonth() == Month.JANUARY &&
          day.getDate() == 1 &&
          day.getHours() <= 6)
      ) {
        kmRate = 3.5;
        baseFee += 3;
      } else {
        // piątek i sobota po 17 do 6 następnego dnia
        if (
          (day.getDay() == DayOfWeek.FRIDAY && day.getHours() >= 17) ||
          (day.getDay() == DayOfWeek.SATURDAY && day.getHours() <= 6) ||
          (day.getDay() == DayOfWeek.SATURDAY && day.getHours() >= 17) ||
          (day.getDay() == DayOfWeek.SUNDAY && day.getHours() <= 6)
        ) {
          kmRate = 2.5;
          baseFee += 2;
        } else {
          // pozostałe godziny weekendu
          if (
            (day.getDay() == DayOfWeek.SATURDAY &&
              day.getHours() > 6 &&
              day.getHours() < 17) ||
            (day.getDay() == DayOfWeek.SUNDAY && day.getHours() > 6)
          ) {
            kmRate = 1.5;
          } else {
            // tydzień roboczy
            kmRate = 1.0;
            baseFee++;
          }
        }
      }
    }
    const priceBigDecimal = Number(
      (this.km * kmRate * factorToCalculate + baseFee).toFixed(2),
    );
    this.price = priceBigDecimal;
    return this.price;
  }
}
