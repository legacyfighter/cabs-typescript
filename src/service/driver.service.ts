import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Driver, DriverStatus, DriverType } from '../entity/driver.entity';
import { DriverDto } from '../dto/driver.dto';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { DriverRepository } from '../repository/driver.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverAttributeRepository } from '../repository/driver-attribute.repository';
import { TransitRepository } from '../repository/transit.repository';
import { DriverFeeService } from './driver-fee.service';
import dayjs from 'dayjs';

@Injectable()
export class DriverService {
  public static DRIVER_LICENSE_REGEX = '^[A-Z9]{5}\\d{6}[A-Z9]{2}\\d[A-Z]{2}$';

  constructor(
    @InjectRepository(DriverRepository)
    private driverRepository: DriverRepository,
    @InjectRepository(DriverAttributeRepository)
    private driverAttributeRepository: DriverAttributeRepository,
    @InjectRepository(DriverRepository)
    private transitRepository: TransitRepository,
    private driverFeeService: DriverFeeService,
  ) {}

  public async createDriver({
    photo,
    driverLicense,
    lastName,
    firstName,
  }: CreateDriverDto): Promise<Driver> {
    const driver = new Driver();
    if (driver.getStatus() === DriverStatus.ACTIVE) {
      if (
        !driverLicense ||
        !driverLicense.match(DriverService.DRIVER_LICENSE_REGEX)
      ) {
        throw new NotAcceptableException(
          'Illegal license no = ' + driverLicense,
        );
      }
    }
    driver.setDriverLicense(driverLicense);
    driver.setLastName(lastName);
    driver.setFirstName(firstName);
    driver.setStatus(DriverStatus.INACTIVE);
    driver.setType(DriverType.CANDIDATE);
    if (photo !== null) {
      if (Buffer.from(photo, 'base64').toString('base64') === photo) {
        driver.setPhoto(photo);
      } else {
        throw new NotAcceptableException('Illegal photo in base64');
      }
    }

    return this.driverRepository.save(driver);
  }

  public async loadDriver(driverId: string): Promise<DriverDto> {
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${driverId} does not exists.`,
      );
    }

    return new DriverDto(driver);
  }

  public async changeDriverStatus(driverId: string, status: DriverStatus) {
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${driverId} does not exists.`,
      );
    }
    if (status === DriverStatus.ACTIVE) {
      const license = driver.getDriverLicense();

      if (!license) {
        throw new ForbiddenException(
          `Status cannot be ACTIVE. Illegal license no ${license}`,
        );
      }
    }

    driver.setStatus(status);
    await this.driverRepository.update(driver.getId(), driver);
  }

  public async changeLicenseNumber(newLicense: string, driverId: string) {
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${driverId} does not exists.`,
      );
    }
    if (!newLicense || !newLicense.match(DriverService.DRIVER_LICENSE_REGEX)) {
      throw new NotAcceptableException(
        'Illegal new license no = ' + newLicense,
      );
    }

    if (!(driver.getStatus() === DriverStatus.ACTIVE)) {
      throw new NotAcceptableException(
        'Driver is not active, cannot change license',
      );
    }

    driver.setDriverLicense(newLicense);
    await this.driverRepository.save(driver);
  }

  public async changePhoto(driverId: string, photo: string) {
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${driverId} does not exists.`,
      );
    }

    if (!photo || Buffer.from(photo, 'base64').toString('base64') === photo) {
      throw new NotAcceptableException('Illegal photo in base64');
    }
    driver.setPhoto(photo);
    await this.driverRepository.save(driver);
  }

  public async calculateDriverMonthlyPayment(
    driverId: string,
    year: number,
    month: number,
  ) {
    const driver = await this.driverRepository.findOne(driverId);

    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${driverId} does not exists.`,
      );
    }

    const yearMonth = dayjs(`${year}-${month}`, 'YYYY-M');
    const from = yearMonth.startOf('month');
    const to = yearMonth.endOf('month');

    const transitsList =
      await this.transitRepository.findAllByDriverAndDateTimeBetween(
        driver,
        from.valueOf(),
        to.valueOf(),
      );

    const sum = (
      await Promise.all(
        transitsList.map((t) =>
          this.driverFeeService.calculateDriverFee(t.getId()),
        ),
      )
    ).reduce((prev, curr) => prev + curr, 0);

    return sum;
  }

  public async calculateDriverYearlyPayment(
    driverId: string,
    year: number,
  ): Promise<Map<number, number>> {
    const payments = new Map();
    const months = Array.from({ length: 5 }).map((_, i) => i);
    for (const m of months) {
      payments.set(m, this.calculateDriverMonthlyPayment(driverId, year, m));
    }
    return payments;
  }
}
