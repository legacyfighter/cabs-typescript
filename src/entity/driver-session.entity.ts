import { BaseEntity } from '../common/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Driver } from './driver.entity';
import { CarClass } from './car-type.entity';

@Entity()
export class DriverSession extends BaseEntity {
  @Column({ nullable: true, type: 'bigint' })
  public loggedAt: number;

  @Column({ nullable: true, type: 'bigint' })
  private loggedOutAt: number | null;

  @ManyToOne(() => Driver)
  private driver: Driver;

  @Column()
  private platesNumber: string;

  @Column()
  private carClass: CarClass;

  @Column()
  private carBrand: string;

  public getLoggedAt() {
    return this.loggedAt;
  }

  public getCarBrand() {
    return this.carBrand;
  }

  public setCarBrand(carBrand: string) {
    this.carBrand = carBrand;
  }

  public setLoggedAt(loggedAt: number) {
    this.loggedAt = loggedAt;
  }

  public getLoggedOutAt() {
    return this.loggedOutAt;
  }

  public setLoggedOutAt(loggedOutAt: number) {
    this.loggedOutAt = loggedOutAt;
  }

  public getDriver() {
    return this.driver;
  }

  public setDriver(driver: Driver) {
    this.driver = driver;
  }

  public getPlatesNumber() {
    return this.platesNumber;
  }

  public setPlatesNumber(platesNumber: string) {
    this.platesNumber = platesNumber;
  }

  public getCarClass() {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass) {
    this.carClass = carClass;
  }
}
