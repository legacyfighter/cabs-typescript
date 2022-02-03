import { DayOfWeek, Status, Transit } from '../entity/transit.entity';
import { DriverDto } from './driver.dto';
import { ClaimDto } from './claim.dto';
import { AddressDto } from './address.dto';
import { CarClass } from '../entity/car-type.entity';
import { ClientDto } from './client.dto';
import * as dayjs from 'dayjs';
import * as dayOfYear from 'dayjs/plugin/dayOfYear';
import { NotAcceptableException } from '@nestjs/common';

dayjs.extend(dayOfYear);

export class TransitDto {
  public id: string;

  public tariff: string;

  public status: Status;

  public driver: DriverDto;

  public factor: number | null;

  public distance: number;

  public distanceUnit: string;

  public kmRate: number;

  public price: number;

  public driverFee: number;

  public estimatedPrice: number;

  public baseFee: number;

  public date: number;

  public dateTime: number;

  public published: number;

  public acceptedAt: number | null;

  public started: number | null;

  public completeAt: number | null;

  public claimDto: ClaimDto;

  public proposedDrivers: DriverDto[] = [];

  public to: AddressDto;

  public from: AddressDto;

  public carClass: CarClass;

  public clientDto: ClientDto;

  constructor(transit: Transit) {
    this.id = transit.getId();
    this.distance = transit.getKm();
    this.factor = transit.factor;
    const price = transit.getPrice();
    if (price) {
      this.price = price;
    }
    this.date = transit.getDateTime();
    this.status = transit.getStatus();
    this.setTariff();
    for (const d of transit.getProposedDrivers()) {
      this.proposedDrivers.push(new DriverDto(d));
    }
    this.to = new AddressDto(transit.getTo());
    this.from = new AddressDto(transit.getFrom());
    this.carClass = transit.getCarType();
    this.clientDto = new ClientDto(transit.getClient());
    if (transit.getDriversFee() != null) {
      this.driverFee = transit.getDriversFee();
    }
    const estimatedPrice = transit.getEstimatedPrice();
    if (estimatedPrice) {
      this.estimatedPrice = estimatedPrice;
    }
    this.dateTime = transit.getDateTime();
    this.published = transit.getPublished();
    this.acceptedAt = transit.getAcceptedAt();
    this.started = transit.getStarted();
    this.completeAt = transit.getCompleteAt();
  }

  public getKmRate() {
    return this.kmRate;
  }

  public setTariff() {
    const day = dayjs();

    // wprowadzenie nowych cennikow od 1.01.2019
    if (day.get('year') <= 2018) {
      this.kmRate = 1.0;
      this.tariff = 'Standard';
      return;
    }

    const year = day.get('year');
    const leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

    if (
      (leap && day.dayOfYear() == 366) ||
      (!leap && day.dayOfYear() == 365) ||
      (day.dayOfYear() == 1 && day.get('hour') <= 6)
    ) {
      this.tariff = 'Sylwester';
      this.kmRate = 3.5;
    } else {
      switch (day.get('day')) {
        case DayOfWeek.MONDAY:
        case DayOfWeek.TUESDAY:
        case DayOfWeek.WEDNESDAY:
        case DayOfWeek.THURSDAY:
          this.kmRate = 1.0;
          this.tariff = 'Standard';
          break;
        case DayOfWeek.FRIDAY:
          if (day.get('hour') < 17) {
            this.tariff = 'Standard';
            this.kmRate = 1.0;
          } else {
            this.tariff = 'Weekend+';
            this.kmRate = 2.5;
          }
          break;
        case DayOfWeek.SATURDAY:
          if (day.get('hour') < 6 || day.get('hour') >= 17) {
            this.kmRate = 2.5;
            this.tariff = 'Weekend+';
          } else if (day.get('hour') < 17) {
            this.kmRate = 1.5;
            this.tariff = 'Weekend';
          }
          break;
        case DayOfWeek.SUNDAY:
          if (day.get('hour') < 6) {
            this.kmRate = 2.5;
            this.tariff = 'Weekend+';
          } else {
            this.kmRate = 1.5;
            this.tariff = 'Weekend';
          }
          break;
      }
    }
  }

  public getTariff() {
    return this.tariff;
  }

  public getDistance(unit: string) {
    this.distanceUnit = unit;
    if (unit === 'km') {
      if (this.distance == Math.ceil(this.distance)) {
        return new Intl.NumberFormat('en-US', {
          style: 'unit',
          unit: 'length-kilometer',
        }).format(Math.round(this.distance));
      }
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'length-kilometer',
      }).format(this.distance);
    }
    if (unit === 'miles') {
      const distance = this.distance / 1.609344;
      if (distance == Math.ceil(distance)) {
        return new Intl.NumberFormat('en-US', {
          style: 'unit',
          unit: 'length-mile',
        }).format(Math.round(this.distance));
      }
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'length-mile',
      }).format(this.distance);
    }
    if (unit === 'm') {
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'length-meter',
      }).format(Math.round(this.distance * 1000));
    }
    throw new NotAcceptableException('Invalid unit ' + unit);
  }

  public getProposedDrivers() {
    return this.proposedDrivers;
  }

  public setProposedDrivers(proposedDrivers: DriverDto[]) {
    this.proposedDrivers = proposedDrivers;
  }

  public getClaimDTO() {
    return this.claimDto;
  }

  public setClaimDTO(claimDto: ClaimDto) {
    this.claimDto = claimDto;
  }

  public getTo() {
    return this.to;
  }

  public setTo(to: AddressDto) {
    this.to = to;
  }

  public getFrom() {
    return this.from;
  }

  public setFrom(from: AddressDto) {
    this.from = from;
  }

  public getCarClass() {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass) {
    this.carClass = carClass;
  }

  public getClientDto() {
    return this.clientDto;
  }

  public setClientDTO(clientDto: ClientDto) {
    this.clientDto = clientDto;
  }

  public getId() {
    return this.id;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: Status) {
    this.status = status;
  }

  public getPrice() {
    return this.price;
  }

  public getDriverFee() {
    return this.driverFee;
  }

  public setDriverFee(driverFee: number) {
    this.driverFee = driverFee;
  }

  public getDateTime() {
    return this.dateTime;
  }

  public setDateTime(dateTime: number) {
    this.dateTime = dateTime;
  }

  public getPublished() {
    return this.published;
  }

  public setPublished(published: number) {
    this.published = published;
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

  public getCompleteAt() {
    return this.completeAt;
  }

  public setCompleteAt(completeAt: number) {
    this.completeAt = completeAt;
  }

  public getEstimatedPrice() {
    return this.estimatedPrice;
  }

  public setEstimatedPrice(estimatedPrice: number) {
    this.estimatedPrice = estimatedPrice;
  }
}
