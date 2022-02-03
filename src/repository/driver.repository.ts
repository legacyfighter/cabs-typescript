import { EntityRepository, Repository } from 'typeorm';
import { Driver } from '../entity/driver.entity';

@EntityRepository(Driver)
export class DriverRepository extends Repository<Driver> {}
