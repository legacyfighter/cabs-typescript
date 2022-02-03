import { Client, ClientType, PaymentType, Type } from '../entity/client.entity';

export class ClientDto {
  private id: string;

  private type: Type;

  private name: string;

  private lastName: string;

  private defaultPaymentType: PaymentType;

  private clientType: ClientType;

  constructor(client: Client) {
    this.id = client.getId();
    this.type = client.getType();
    this.name = client.getName();
    this.lastName = client.getLastName();
    this.defaultPaymentType = client.getDefaultPaymentType();
    this.clientType = client.getClientType();
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getLastName() {
    return this.lastName;
  }

  public setLastName(lastName: string) {
    this.lastName = lastName;
  }

  public getClientType() {
    return this.clientType;
  }

  public setClientType(clientType: ClientType) {
    this.clientType = clientType;
  }

  public getType() {
    return this.type;
  }

  public setType(type: Type) {
    this.type = type;
  }

  public getDefaultPaymentType() {
    return this.defaultPaymentType;
  }

  public setDefaultPaymentType(defaultPaymentType: PaymentType) {
    this.defaultPaymentType = defaultPaymentType;
  }

  public getId() {
    return this.id;
  }

  public setId(id: string) {
    this.id = id;
  }
}
