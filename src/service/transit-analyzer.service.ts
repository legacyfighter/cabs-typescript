import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from '../repository/client.repository';
import { TransitRepository } from '../repository/transit.repository';
import { AddressRepository } from '../repository/address.repository';
import { Address } from '../entity/address.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Status, Transit } from '../entity/transit.entity';
import { Client } from '../entity/client.entity';
import dayjs from 'dayjs';

@Injectable()
export class TransitAnalyzerService {
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
    @InjectRepository(TransitRepository)
    private transitRepository: TransitRepository,
    @InjectRepository(AddressRepository)
    private addressRepository: AddressRepository,
  ) {}

  public async analyze(
    clientId: string,
    addressId: string,
  ): Promise<Address[]> {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }
    const address = await this.addressRepository.findOne(addressId);
    if (!address) {
      throw new NotFoundException('Address does not exists, id = ' + addressId);
    }
    return this._analyze(client, address, null);
  }

  // Brace yourself, deadline is coming... They made me to do it this way.
  // Tested!
  private async _analyze(
    client: Client,
    from: Address,
    t: Transit | null,
  ): Promise<Address[]> {
    let ts: Transit[] = [];

    if (!t) {
      ts =
        await this.transitRepository.findAllByClientAndFromAndStatusOrderByDateTimeDesc(
          client,
          from,
          Status.COMPLETED,
        );
    } else {
      ts =
        await this.transitRepository.findAllByClientAndFromAndPublishedAfterAndStatusOrderByDateTimeDesc(
          client,
          from,
          t.getPublished(),
          Status.COMPLETED,
        );
    }

    // Workaround for performance reasons.
    if (ts.length > 1000 && client.getId() == '666') {
      // No one will see a difference for this customer ;)
      ts = ts.slice(0, 1000);
    }

    //        if (ts.isEmpty()) {
    //            return List.of(t.getTo());
    //        }

    if (t) {
      ts = ts.filter((_t) =>
        dayjs(t.getCompleteAt()).add(15, 'minutes').isAfter(_t.getStarted()),
      );
      // Before 2018-01-01:
      //.filter(t -> t.getCompleteAt().plus(15, ChronoUnit.MINUTES).isAfter(t.getPublished()))
    }

    if (!ts.length && t) {
      return [t.getTo()];
    }

    const mappedTs: Address[][] = [];

    for (const _t of ts) {
      const result = [];
      result.push(_t.getFrom());
      result.push(...(await this._analyze(client, _t.getTo(), _t)));
      mappedTs.push(result);
    }

    function compare(a: Address[], b: Address[]) {
      if (a.length > b.length) return -1;
      if (a.length < b.length) return 1;
      return 0;
    }

    mappedTs.sort(compare);

    return mappedTs[0]?.length ? mappedTs[0] : [];
  }
}
