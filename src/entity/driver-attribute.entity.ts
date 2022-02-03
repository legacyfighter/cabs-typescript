import { BaseEntity } from '../common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Driver } from './driver.entity';

export enum DriverAttributeName {
  PENALTY_POINTS = 'penalty_points',
  NATIONALITY = 'nationality',
  YEARS_OF_EXPERIENCE = 'years_of_experience',
  MEDICAL_EXAMINATION_EXPIRATION_DATE = 'medial_examination_expiration_date',
  MEDICAL_EXAMINATION_REMARKS = 'medical_examination_remarks',
  EMAIL = 'email',
  BIRTHPLACE = 'birthplace',
  COMPANY_NAME = 'companyName',
}

@Entity()
export class DriverAttribute extends BaseEntity {
  @Column()
  private name: DriverAttributeName;

  @Column()
  private value: string;

  @ManyToOne(() => Driver, (driver) => driver)
  @JoinColumn({ name: 'DRIVER_ID' })
  public driver: Driver;

  constructor(driver: Driver, attr: DriverAttributeName, value: string) {
    super();
    this.driver = driver;
    this.name = attr;
    this.value = value;
  }

  public getName() {
    return this.name;
  }

  public setName(name: DriverAttributeName) {
    this.name = name;
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: string) {
    this.value = value;
  }

  public getDriver() {
    return this.driver;
  }

  public setDriver(driver: Driver) {
    this.driver = driver;
  }
}
