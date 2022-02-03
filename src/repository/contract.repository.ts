import { EntityRepository, Repository } from 'typeorm';
import { Contract } from '../entity/contract.entity';

@EntityRepository(Contract)
export class ContractRepository extends Repository<Contract> {
  public async findByPartnerName(partnerName: string) {
    return this.find({ where: { partnerName } });
  }
}
