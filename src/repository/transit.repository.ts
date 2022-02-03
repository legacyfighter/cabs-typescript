import { Between, EntityRepository, Repository } from 'typeorm';
import { Status, Transit } from '../entity/transit.entity';
import { Driver } from '../entity/driver.entity';
import { Client } from '../entity/client.entity';
import { Address } from '../entity/address.entity';

@EntityRepository(Transit)
export class TransitRepository extends Repository<Transit> {
  public async findAllByDriverAndDateTimeBetween(
    driver: Driver,
    from: number,
    to: number,
  ): Promise<Transit[]> {
    return await this.find({
      where: {
        driver,
        dateTime: Between(from, to),
      },
    });
  }

  public async findAllByClientAndFromAndStatusOrderByDateTimeDesc(
    client: Client,
    from: Address,
    status: Status,
  ): Promise<Transit[]> {
    return await this.find({
      where: {
        client,
        from,
        status,
      },
      order: {
        dateTime: 'DESC',
      },
    });
  }

  public async findAllByClientAndFromAndPublishedAfterAndStatusOrderByDateTimeDesc(
    client: Client,
    from: Address,
    when: number,
    status: Status,
  ): Promise<Transit[]> {
    return this.find({
      where: {
        client,
        from,
        status,
        published: when,
      },
      order: {
        dateTime: 'DESC',
      },
    });
  }

  public async findByClient(client: Client): Promise<Transit[]> {
    return this.find({
      where: {
        client,
      },
    });
  }
}
