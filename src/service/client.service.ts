import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../repository/client.repository';
import { Client, PaymentType, Type } from '../entity/client.entity';
import { ClientDto } from '../dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  public async registerClient(
    name: string,
    lastName: string,
    type: Type,
    paymentType: PaymentType,
  ) {
    const client = new Client();
    client.setName(name);
    client.setLastName(lastName);
    client.setType(type);
    client.setDefaultPaymentType(paymentType);
    return this.clientRepository.save(client);
  }

  public async changeDefaultPaymentType(
    clientId: string,
    paymentType: PaymentType,
  ) {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }
    client.setDefaultPaymentType(paymentType);
    await this.clientRepository.save(client);
  }

  public async upgradeToVIP(clientId: string) {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }
    client.setType(Type.VIP);
    await this.clientRepository.save(client);
  }

  public async downgradeToRegular(clientId: string) {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }
    client.setType(Type.NORMAL);
    await this.clientRepository.save(client);
  }

  public async load(id: string) {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + id);
    }
    return new ClientDto(client);
  }
}
