import { EntityRepository, Repository } from 'typeorm';
import { Address } from '../entity/address.entity';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {
  // FIX ME: To replace with getOrCreate method instead of that?
  // Actual workaround for address uniqueness problem: assign result from repo.save to variable for later usage
  //@ts-expect-error to avoid params error
  public async save(address: Address) {
    if (!address.getId()) {
      const existingAddress = await this.findOne({
        where: { hash: address.getHash() },
      });
      if (existingAddress) {
        return existingAddress;
      }
    }

    return super.save(address);
  }

  public async findByHash(hash: string) {
    return this.findOne({
      where: { hash },
    });
  }
}
