import { EntityRepository, Repository } from 'typeorm';
import { CarClass, CarStatus, CarType } from '../entity/car-type.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(CarType)
export class CarTypeRepository extends Repository<CarType> {
  public async findByCarClass(carClass: CarClass): Promise<CarType> {
    const carType = await this.findOne({ where: { carClass } });

    if (!carType) {
      throw new NotFoundException('Cannot find car type');
    }
    return carType;
  }

  public async findByStatus(status: CarStatus): Promise<CarType[]> {
    return this.find({ where: { status } });
  }
}
