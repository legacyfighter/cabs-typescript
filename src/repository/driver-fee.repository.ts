import { EntityRepository, Repository } from 'typeorm';
import { DriverFee } from '../entity/driver-fee.entity';
import { Driver } from '../entity/driver.entity';

@EntityRepository(DriverFee)
export class DriverFeeRepository extends Repository<DriverFee> {
  public async findByDriver(driver: Driver) {
    return this.findOne({ driver });
  }
}
