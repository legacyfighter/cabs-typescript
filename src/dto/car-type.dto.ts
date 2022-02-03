import { CarClass, CarStatus, CarType } from '../entity/car-type.entity';

export class CarTypeDto {
  private id: string;
  private carClass: CarClass;

  private description: string | null;

  private status: CarStatus;

  private carsCounter: number;

  private minNoOfCarsToActivateClass: number;

  private activeCarsCounter: number;

  constructor(carType: CarType) {
    this.id = carType.getId();
    this.carClass = carType.getCarClass();
    this.status = carType.getStatus();
    this.description = carType.getDescription();
    this.carsCounter = carType.getCarsCounter();
    this.minNoOfCarsToActivateClass = carType.getMinNoOfCarsToActivateClass();
    this.activeCarsCounter = carType.getActiveCarsCounter();
  }
}
