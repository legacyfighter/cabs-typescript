import { AwardsAccountDto } from '../dto/awards-account.dto';
import { AwardedMiles } from '../entity/awarded-miles.entity';
import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from '../repository/client.repository';
import { TransitRepository } from '../repository/transit.repository';
import { AppProperties } from '../config/app-properties.config';
import { AwardsAccountRepository } from '../repository/awards-account.repository';
import { AwardedMilesRepository } from '../repository/awarded-miles.repository';
import { AwardsAccount } from '../entity/awards-account.entity';
import dayjs from 'dayjs';
import { Client, Type } from '../entity/client.entity';
import orderBy from 'lodash.orderby';

export interface IAwardsService {
  findBy: (clientId: string) => Promise<AwardsAccountDto>;

  registerToProgram: (clientId: string) => Promise<void>;

  activateAccount: (clientId: string) => Promise<void>;

  deactivateAccount: (clientId: string) => Promise<void>;

  registerMiles: (
    clientId: string,
    transitId: string,
  ) => Promise<AwardedMiles | null>;

  registerSpecialMiles: (
    clientId: string,
    miles: number,
  ) => Promise<AwardedMiles>;

  removeMiles: (clientId: string, miles: number) => Promise<void>;

  calculateBalance: (clientId: string) => Promise<number>;

  transferMiles: (
    fromClientId: string,
    toClientId: string,
    miles: number,
  ) => Promise<void>;
}

@Injectable()
export class AwardsService implements IAwardsService {
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
    @InjectRepository(TransitRepository)
    private transitRepository: TransitRepository,
    @InjectRepository(AwardsAccountRepository)
    private accountRepository: AwardsAccountRepository,
    @InjectRepository(AwardedMilesRepository)
    private milesRepository: AwardedMilesRepository,
    private appProperties: AppProperties,
  ) {}

  public async findBy(clientId: string): Promise<AwardsAccountDto> {
    const account = await this.getAccountForClient(clientId);

    return new AwardsAccountDto(account);
  }

  public async registerToProgram(clientId: string) {
    const client = await this.clientRepository.findOne(clientId);

    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }

    const account = new AwardsAccount();

    account.setClient(client);
    account.setActive(false);
    account.setDate(Date.now());

    await this.accountRepository.save(account);
  }

  public async activateAccount(clientId: string) {
    const account = await this.getAccountForClient(clientId);

    account.setActive(true);

    await this.accountRepository.save(account);
  }

  public async deactivateAccount(clientId: string) {
    const account = await this.getAccountForClient(clientId);

    account.setActive(false);

    await this.accountRepository.save(account);
  }

  public async registerMiles(clientId: string, transitId: string) {
    const account = await this.getAccountForClient(clientId);
    const transit = await this.transitRepository.findOne(transitId);

    if (!transit) {
      throw new NotFoundException('transit does not exists, id = ' + transitId);
    }

    const now = Date.now();
    if (!account.isAwardActive()) {
      return null;
    } else {
      const miles = new AwardedMiles();
      miles.setTransit(transit);
      miles.setDate(Date.now());
      miles.setClient(account.getClient());
      miles.setMiles(this.appProperties.getDefaultMilesBonus());
      miles.setExpirationDate(
        dayjs(now)
          .add(this.appProperties.getMilesExpirationInDays(), 'days')
          .valueOf(),
      );
      miles.setSpecial(false);
      account.increaseTransactions();

      await this.milesRepository.save(miles);
      await this.accountRepository.save(account);
      return miles;
    }
  }

  public async registerSpecialMiles(clientId: string, miles: number) {
    const account = await this.getAccountForClient(clientId);

    const _miles = new AwardedMiles();
    _miles.setTransit(null);
    _miles.setClient(account.getClient());
    _miles.setMiles(miles);
    _miles.setDate(Date.now());
    _miles.setSpecial(true);
    account.increaseTransactions();
    await this.milesRepository.save(_miles);
    await this.accountRepository.save(account);
    return _miles;
  }

  public async removeMiles(clientId: string, miles: number) {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException(
        `Client with id ${clientId} doest not exists`,
      );
    }

    const account = await this.accountRepository.findByClient(client);

    if (!account) {
      throw new NotFoundException(
        `Awards account for client id ${clientId} doest not exists`,
      );
    } else {
      const balance = await this.calculateBalance(clientId);
      if (balance >= miles && account.isAwardActive()) {
        let milesList = await this.milesRepository.findAllByClient(client);
        const transitsCounter = (
          await this.transitRepository.findByClient(client)
        ).length;

        // TODO: verify below sorter
        if (client.getClaims().length >= 3) {
          // milesList.sort(Comparator.comparing(AwardedMiles::getExpirationDate, Comparators.nullsHigh()).reversed().thenComparing(Comparators.nullsHigh()));
          milesList = orderBy(milesList, [(item) => item.getExpirationDate()]);
        } else if (client.getType() === Type.VIP) {
          // milesList.sort(Comparator.comparing(AwardedMiles::isSpecial).thenComparing(AwardedMiles::getExpirationDate, Comparators.nullsLow()));
          milesList = orderBy(milesList, [
            (item) => item.getSpecial(),
            (item) => item.getExpirationDate(),
          ]);
        } else if (transitsCounter >= 15 && this.isSunday()) {
          // milesList.sort(Comparator.comparing(AwardedMiles::isSpecial).thenComparing(AwardedMiles::getExpirationDate, Comparators.nullsLow()));
          milesList = orderBy(milesList, [
            (item) => item.getSpecial(),
            (item) => item.getExpirationDate(),
          ]);
        } else if (transitsCounter >= 15) {
          // milesList.sort(Comparator.comparing(AwardedMiles::isSpecial).thenComparing(AwardedMiles::getDate));
          milesList = orderBy(milesList, [
            (item) => item.getSpecial(),
            (item) => item.getDate(),
          ]);
        } else {
          // milesList.sort(Comparator.comparing(AwardedMiles::getDate));
          milesList = orderBy(milesList, (item) => item.getDate());
        }
        for (const iter of milesList) {
          if (miles <= 0) {
            break;
          }
          if (
            iter.getSpecial() ||
            (iter.getExpirationDate() &&
              dayjs(iter.getExpirationDate()).isAfter(dayjs()))
          ) {
            if (iter.getMiles() <= miles) {
              miles -= iter.getMiles();
              iter.setMiles(0);
            } else {
              iter.setMiles(iter.getMiles() - miles);
              miles = 0;
            }
            await this.milesRepository.save(iter);
          }
        }
      } else {
        throw new NotAcceptableException(
          'Insufficient miles, id = ' +
            clientId +
            ', miles requested = ' +
            miles,
        );
      }
    }
  }

  public async calculateBalance(clientId: string) {
    const client = await this.clientRepository.findOne(clientId);
    if (!client) {
      throw new NotFoundException(
        `Client with id ${clientId} doest not exists`,
      );
    }
    const milesList = await this.milesRepository.findAllByClient(client);

    const sum = milesList
      .filter(
        (t) =>
          (t.getExpirationDate() != null &&
            t.getExpirationDate() &&
            dayjs(t.getExpirationDate()).isAfter(dayjs())) ||
          t.getSpecial(),
      )
      .map((t) => t.getMiles())
      .reduce((prev, curr) => prev + curr, 0);

    return sum;
  }

  public async transferMiles(
    fromClientId: string,
    toClientId: string,
    miles: number,
  ) {
    const fromClient = await this.clientRepository.findOne(fromClientId);
    if (!fromClient) {
      throw new NotFoundException(
        `Client with id ${fromClientId} doest not exists`,
      );
    }
    const accountFrom = await this.getAccountForClient(fromClient);
    const accountTo = await this.getAccountForClient(toClientId);

    const balanceFromClient = await this.calculateBalance(fromClientId);
    if (balanceFromClient >= miles && accountFrom.isAwardActive()) {
      const milesList = await this.milesRepository.findAllByClient(fromClient);

      for (const iter of milesList) {
        if (
          iter.getSpecial() ||
          dayjs(iter.getExpirationDate()).isAfter(dayjs())
        ) {
          if (iter.getMiles() <= miles) {
            iter.setClient(accountTo.getClient());
            miles -= iter.getMiles();
          } else {
            iter.setMiles(iter.getMiles() - miles);
            const _miles = new AwardedMiles();

            _miles.setClient(accountTo.getClient());
            _miles.setSpecial(iter.getSpecial() ?? false);
            _miles.setExpirationDate(iter.getExpirationDate() || Date.now());
            _miles.setMiles(miles);

            miles -= iter.getMiles();

            await this.milesRepository.save(_miles);
          }
          await this.milesRepository.save(iter);
        }
      }

      accountFrom.increaseTransactions();
      accountTo.increaseTransactions();

      await this.accountRepository.save(accountFrom);
      await this.accountRepository.save(accountTo);
    }
  }

  private isSunday() {
    return dayjs().get('day') === 0;
  }

  private async getAccountForClient(clientId: string | Client) {
    const client =
      typeof clientId === 'string'
        ? await this.clientRepository.findOne(clientId)
        : clientId;
    if (!client) {
      throw new NotFoundException(
        `Client with id ${clientId} doest not exists`,
      );
    }

    const account = await this.accountRepository.findByClient(client);

    if (!account) {
      throw new NotFoundException(
        `Awards account for client id ${clientId} doest not exists`,
      );
    }

    return account;
  }
}
