import { BaseEntity } from '../common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ContractAttachment } from './contract-attachment.entity';

export enum ContractStatus {
  NEGOTIATIONS_IN_PROGRESS = 'negotiations_in_progress',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

@Entity()
export class Contract extends BaseEntity {
  @OneToMany(
    () => ContractAttachment,
    (contractAttachment) => contractAttachment.contract,
    { eager: true },
  )
  public attachments: ContractAttachment[];

  @Column()
  private partnerName: string;

  @Column()
  private subject: string;

  @Column({ default: Date.now(), type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private rejectedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private changeDate: number | null;

  @Column({ default: ContractStatus.NEGOTIATIONS_IN_PROGRESS })
  private status: ContractStatus;

  @Column()
  private contractNo: string;

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

  public setStatus(status: ContractStatus) {
    this.status = status;
  }

  public getContractNo() {
    return this.contractNo;
  }

  public setContractNo(contractNo: string) {
    this.contractNo = contractNo;
  }

  public getAttachments() {
    return this.attachments || [];
  }

  public setAttachments(attachments: ContractAttachment[]) {
    this.attachments = attachments;
  }

  public getPartnerName() {
    return this.partnerName;
  }

  public setPartnerName(partnerName: string) {
    this.partnerName = partnerName;
  }

  public getSubject() {
    return this.subject;
  }

  public setSubject(subject: string) {
    this.subject = subject;
  }
}
