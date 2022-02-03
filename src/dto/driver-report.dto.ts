import { DriverDto } from './driver.dto';
import { DriverAttributeDto } from './driver-attribute.dto';
import { DriverSessionDto } from './driver-session.dto';
import { TransitDto } from './transit.dto';

export class DriverReport {
  public driverDto: DriverDto;

  public attributes: DriverAttributeDto[] = [];

  public sessions: Map<DriverSessionDto, TransitDto[]> = new Map();

  public getDriverDto() {
    return this.driverDto;
  }

  public setDriverDTO(driverDto: DriverDto) {
    this.driverDto = driverDto;
  }

  public getAttributes() {
    return this.attributes;
  }

  public setAttributes(attributes: DriverAttributeDto[]) {
    this.attributes = attributes;
  }

  public getSessions() {
    return this.sessions;
  }

  public setSessions(sessions: Map<DriverSessionDto, TransitDto[]>) {
    this.sessions = sessions;
  }
}
