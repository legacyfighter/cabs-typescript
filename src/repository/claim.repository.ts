import { EntityRepository, Repository } from 'typeorm';
import { Claim } from '../entity/claim.entity';
import { Client } from '../entity/client.entity';
import { Transit } from '../entity/transit.entity';

@EntityRepository(Claim)
export class ClaimRepository extends Repository<Claim> {
  public async findByOwner(owner: Client) {
    return this.find({ where: { owner } });
  }

  public async findByOwnerAndTransit(owner: Client, transit: Transit) {
    return this.find({ where: { owner, transit } });
  }
}
