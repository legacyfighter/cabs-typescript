import { NotAcceptableException } from '@nestjs/common';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

export enum CarClass {
  ECO = 'eco',
  REGULAR = 'regular',
  VAN = 'van',
  PREMIUM = 'premium',
}

export enum CarStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

@Entity()
export class CarType extends BaseEntity {
  @Column({ enum: CarClass, type: 'enum' })
  private carClass: CarClass;

  @Column({ nullable: true, type: 'varchar' })
  private description: string | null;

  @Column({ default: CarStatus.INACTIVE })
  private status: CarStatus;

  @Column({ type: 'int', default: 0 })
  private carsCounter: number;

  @Column({ type: 'int', default: 0 })
  private minNoOfCarsToActivateClass: number;

  @Column({ type: 'int', default: 0 })
  private activeCarsCounter: number;

  constructor(
    carClass: CarClass,
    description: string,
    minNoOfCarsToActivateClass: number,
  ) {
    super();
    this.carClass = carClass;
    this.description = description;
    this.minNoOfCarsToActivateClass = minNoOfCarsToActivateClass;
  }

  public registerActiveCar() {
    this.activeCarsCounter++;
  }

  public unregisterActiveCar() {
    this.activeCarsCounter--;
  }

  public registerCar() {
    this.carsCounter++;
  }

  public unregisterCar() {
    this.carsCounter--;
    if (this.carsCounter < 0) {
      throw new NotAcceptableException('Cars counter can not be below 0');
    }
  }

  public activate() {
    if (this.carsCounter < this.minNoOfCarsToActivateClass) {
      throw new NotAcceptableException(
        `Cannot activate car class when less than ${this.minNoOfCarsToActivateClass} cars in the fleet`,
      );
    }
    this.status = CarStatus.ACTIVE;
  }

  public deactivate() {
    this.status = CarStatus.INACTIVE;
  }

  public getCarClass() {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass) {
    this.carClass = carClass;
  }

  public getDescription() {
    return this.description;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public getStatus() {
    return this.status;
  }

  public getCarsCounter() {
    return this.carsCounter;
  }

  public getActiveCarsCounter() {
    return this.activeCarsCounter;
  }

  public getMinNoOfCarsToActivateClass() {
    return this.minNoOfCarsToActivateClass;
  }
}
