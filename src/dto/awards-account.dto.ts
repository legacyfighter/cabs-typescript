import { ClientDto } from './client.dto';
import { AwardsAccount } from '../entity/awards-account.entity';

export class AwardsAccountDto {
  private client: ClientDto;

  private date: number;

  private isActive: boolean;

  private transactions: number;

  constructor(account: AwardsAccount) {
    this.isActive = account.isAwardActive();
    this.client = new ClientDto(account.getClient());
    this.transactions = account.getTransactions();
    this.date = account.getDate();
  }

  public setClient(client: ClientDto) {
    this.client = client;
  }

  public getClient() {
    return this.client;
  }

  public setDate(date: number) {
    this.date = date;
  }

  public setActive(active: boolean) {
    this.isActive = active;
  }

  public getTransactions() {
    return this.transactions;
  }

  public setTransactions(transactions: number) {
    this.transactions = transactions;
  }

  public getDate() {
    return this.date;
  }

  public getActive() {
    return this.isActive;
  }
}
