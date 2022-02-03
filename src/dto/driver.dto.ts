import { Driver, DriverStatus, DriverType } from '../entity/driver.entity';

export class DriverDto {
  private id: string;

  private status: DriverStatus;

  private firstName: string;

  private lastName: string;

  private driverLicense: string;

  private photo: string | null;

  private type: DriverType;

  constructor(driver: Driver) {
    this.id = driver.getId();
    this.firstName = driver.getFirstName();
    this.lastName = driver.getLastName();
    this.driverLicense = driver.getDriverLicense();
    this.photo = driver.getPhoto();
    this.status = driver.getStatus();
    this.type = driver.getType();
  }
}
