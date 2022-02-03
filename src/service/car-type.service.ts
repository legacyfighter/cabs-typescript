import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarTypeRepository } from '../repository/car-type.repository';
import { AppProperties } from '../config/app-properties.config';
import { CarClass, CarStatus, CarType } from '../entity/car-type.entity';
import { CreateCarTypeDto } from '../dto/create-car-type.dto';
import { CarTypeDto } from '../dto/car-type.dto';

@Injectable()
export class CarTypeService {
  constructor(
    @InjectRepository(CarTypeRepository)
    private carTypeRepository: CarTypeRepository,
    private readonly appProperties: AppProperties,
  ) {}

  public async load(id: string) {
    const carType = await this.carTypeRepository.findOne(id);
    if (!carType) {
      throw new NotFoundException('Cannot find car type');
    }
    return carType;
  }

  public async loadDto(id: string): Promise<CarTypeDto> {
    const carType = await this.load(id);
    return new CarTypeDto(carType);
  }

  public async create(carTypeDTO: CreateCarTypeDto): Promise<CarType> {
    try {
      const byCarClass = await this.carTypeRepository.findByCarClass(
        carTypeDTO.carClass,
      );
      byCarClass.setDescription(carTypeDTO.description);
      return this.carTypeRepository.save(byCarClass);
    } catch {
      const carType = new CarType(
        carTypeDTO.carClass,
        carTypeDTO.description,
        this.getMinNumberOfCars(carTypeDTO.carClass),
      );

      return this.carTypeRepository.save(carType);
    }
  }

  public async activate(id: string) {
    const carType = await this.load(id);

    carType.activate();

    await this.carTypeRepository.save(carType);
  }

  public async deactivate(id: string) {
    const carType = await this.load(id);

    carType.deactivate();

    await this.carTypeRepository.save(carType);
  }

  public async registerCar(carClass: CarClass) {
    const carType = await this.carTypeRepository.findByCarClass(carClass);

    carType.registerCar();

    await this.carTypeRepository.save(carType);
  }

  public async unregisterCar(carClass: CarClass) {
    const carType = await this.carTypeRepository.findByCarClass(carClass);

    carType.unregisterCar();

    await this.carTypeRepository.save(carType);
  }

  public async registerActiveCar(carClass: CarClass) {
    const carType = await this.carTypeRepository.findByCarClass(carClass);

    carType.registerActiveCar();

    await this.carTypeRepository.save(carType);
  }

  public async unregisterActiveCar(carClass: CarClass) {
    const carType = await this.carTypeRepository.findByCarClass(carClass);

    carType.unregisterActiveCar();

    await this.carTypeRepository.save(carType);
  }

  public async findActiveCarClasses() {
    const cars = await this.carTypeRepository.findByStatus(CarStatus.ACTIVE);
    return cars.map((car) => car.getCarClass());
  }

  public async removeCarType(carClass: CarClass) {
    const carType = await this.carTypeRepository.findByCarClass(carClass);
    if (carType) {
      await this.carTypeRepository.delete(carType);
    }
  }

  private async findByCarClass(carClass: CarClass) {
    const byCarClass = this.carTypeRepository.findByCarClass(carClass);
    if (!byCarClass) {
      throw new NotFoundException(`Car class does not exist: ${carClass}`);
    }
    return byCarClass;
  }

  private getMinNumberOfCars(carClass: CarClass) {
    if (carClass === CarClass.ECO) {
      return this.appProperties.getMinNoOfCarsForEcoClass();
    } else {
      return 10;
    }
  }
}
