import objectHash from 'object-hash';
import {
  DriverAttribute,
  DriverAttributeName,
} from '../entity/driver-attribute.entity';

export class DriverAttributeDto {
  public name: DriverAttributeName;

  public value: string;

  constructor(driverAttribute: DriverAttribute) {
    this.name = driverAttribute.getName();
    this.value = driverAttribute.getValue();
  }

  public createDriverAttribute(name: DriverAttributeName, value: string) {
    this.name = name;
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

  public hashCode() {
    return objectHash({ name: this.name, value: this.value });
  }
}
