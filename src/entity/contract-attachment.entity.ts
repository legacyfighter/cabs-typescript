import { BaseEntity } from '../common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';

export enum ContractAttachmentStatus {
  PROPOSED = 'proposed',
  ACCEPTED_BY_ONE_SIDE = 'accepted_by_one_side',
  ACCEPTED_BY_BOTH_SIDES = 'accepted_by_both_side',
  REJECTED = 'rejected',
}

@Entity()
export class ContractAttachment extends BaseEntity {
  @ManyToOne(() => Contract, (contract) => contract.attachments)
  @JoinColumn()
  public contract: Contract;

  @Column({ type: 'bytea' })
  private data: Buffer;

  @Column({ default: Date.now(), type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private rejectedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private changeDate: number;

  @Column({ default: ContractAttachmentStatus.PROPOSED })
  private status: ContractAttachmentStatus;

  public getData() {
    return this.data;
  }

  public setData(data: string) {
    this.data = Buffer.from(
      '\\x' + Buffer.from(data, 'base64').toString('hex'),
    );
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number) {
    this.creationDate = creationDate;
  }

  public getAcceptedAt() {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: number) {
    this.acceptedAt = acceptedAt;
  }

  public getRejectedAt() {
    return this.rejectedAt;
  }

  public setRejectedAt(rejectedAt: number) {
    this.rejectedAt = rejectedAt;
  }

  public getChangeDate() {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number) {
    this.changeDate = changeDate;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: ContractAttachmentStatus) {
    this.status = status;
  }

  public getContract() {
    return this.contract;
  }

  public setContract(contract: Contract) {
    this.contract = contract;
  }
}
