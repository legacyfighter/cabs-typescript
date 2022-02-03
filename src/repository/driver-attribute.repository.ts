import { EntityRepository, Repository } from 'typeorm';
import { DriverAttribute } from '../entity/driver-attribute.entity';

@EntityRepository(DriverAttribute)
export class DriverAttributeRepository extends Repository<DriverAttribute> {}
