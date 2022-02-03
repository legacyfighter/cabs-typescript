import { Driver } from '../entity/driver.entity';

export class DriverPositionV2Dto {
  private driver: Driver;

  private latitude: number;

  private longitude: number;

  private seenAt: number;

  constructor(
    driver: Driver,
    latitude: number,
    longitude: number,
    seenAt: number,
  ) {
    this.driver = driver;
    this.latitude = latitude;
    this.longitude = longitude;
    this.seenAt = seenAt;
  }

  public getDriver() {
    return this.driver;
  }

  public setDriver(driver: Driver) {
    this.driver = driver;
  }

  public getLatitude() {
    return this.latitude;
  }

  public setLatitude(latitude: number) {
    this.latitude = latitude;
  }

  public getLongitude() {
    return this.longitude;
  }

  public setLongitude(longitude: number) {
    this.longitude = longitude;
  }

  public getSeenAt() {
    return this.seenAt;
  }

  public setSeenAt(seenAt: number) {
    this.seenAt = seenAt;
  }
}
