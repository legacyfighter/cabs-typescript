import { EntityRepository, MoreThan, Repository, IsNull } from 'typeorm';
import { DriverSession } from '../entity/driver-session.entity';
import { CarClass } from '../entity/car-type.entity';
import { Driver } from '../entity/driver.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(DriverSession)
export class DriverSessionRepository extends Repository<DriverSession> {
  public async findAllByLoggedOutAtNullAndDriverInAndCarClassIn(
    drivers: Driver[],
    carClasses: CarClass[],
  ): Promise<DriverSession[]> {
    console.log('To implement...', drivers, carClasses);
    return [];
  }

  public async findTopByDriverAndLoggedOutAtIsNullOrderByLoggedAtDesc(
    driver: Driver,
  ): Promise<DriverSession> {
    const session = await this.findOne({
      where: { driver, loggedOutAt: IsNull() },
      order: {
        loggedAt: 'DESC',
      },
    });

    if (!session) {
      throw new NotFoundException(`Session for ${driver.getId()} not exists`);
    }
    return session;
  }

  public async findAllByDriverAndLoggedAtAfter(
    driver: Driver,
    since: number,
  ): Promise<DriverSession[]> {
    return this.find({
      where: {
        driver,
        loggedAt: MoreThan(since),
      },
    });
  }

  public async findByDriver(driver: Driver): Promise<DriverSession[]> {
    return this.find({ where: { driver } });
  }
}
