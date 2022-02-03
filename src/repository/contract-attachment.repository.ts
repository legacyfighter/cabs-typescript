import { EntityRepository, Repository } from 'typeorm';
import { ContractAttachment } from '../entity/contract-attachment.entity';
import { Contract } from '../entity/contract.entity';

@EntityRepository(ContractAttachment)
export class ContractAttachmentRepository extends Repository<ContractAttachment> {
  public async findByContract(contract: Contract) {
    return this.find({ where: { contract } });
  }
}
