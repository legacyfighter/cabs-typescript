import { EntityRepository, Repository } from 'typeorm';
import { AwardedMiles } from '../entity/awarded-miles.entity';
import { Client } from '../entity/client.entity';

@EntityRepository(AwardedMiles)
export class AwardedMilesRepository extends Repository<AwardedMiles> {
  public async findAllByClient(client: Client) {
    return this.find({ where: { client } });
  }
}
