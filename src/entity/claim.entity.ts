import { BaseEntity } from '../common/base.entity';
import { Client } from './client.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Transit } from './transit.entity';

export enum ClaimStatus {
  DRAFT = 'draft',
  NEW = 'new',
  IN_PROCESS = 'in_process',
  REFUNDED = 'refunded',
  ESCALATED = 'escalated',
  REJECTED = 'rejected',
}

export enum CompletionMode {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
}

@Entity()
export class Claim extends BaseEntity {
  @ManyToOne(() => Client, (client) => client.claims)
  public owner: Client;

  @OneToOne(() => Transit)
  @JoinColumn()
  private transit: Transit;

  @Column({ type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'bigint' })
  private completionDate: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private changeDate: number | null;

  @Column()
  private reason: string;

  @Column({ nullable: true, type: 'varchar' })
  private incidentDescription: string | null;

  @Column({ nullable: true, enum: CompletionMode, type: 'enum', default: null })
  private completionMode: CompletionMode | null;

  @Column()
  private status: ClaimStatus;

  @Column()
  private claimNo: string;

  public getClaimNo() {
    return this.claimNo;
  }

  public setClaimNo(claimNo: string) {
    this.claimNo = claimNo;
  }

  public getOwner() {
    return this.owner;
  }

  public setOwner(owner: Client) {
    this.owner = owner;
  }

  public getTransit() {
    return this.transit;
  }

  public setTransit(transit: Transit) {
    this.transit = transit;
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number) {
    this.creationDate = creationDate;
  }

  public getCompletionDate() {
    return this.completionDate;
  }

  public setCompletionDate(completionDate: number) {
    this.completionDate = completionDate;
  }

  public getIncidentDescription() {
    return this.incidentDescription;
  }

  public setIncidentDescription(incidentDescription: string | null) {
    this.incidentDescription = incidentDescription;
  }

  public getCompletionMode() {
    return this.completionMode;
  }

  public setCompletionMode(completionMode: CompletionMode) {
    this.completionMode = completionMode;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: ClaimStatus) {
    this.status = status;
  }

  public getChangeDate() {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number) {
    this.changeDate = changeDate;
  }

  public getReason() {
    return this.reason;
  }

  public setReason(reason: string) {
    this.reason = reason;
  }
}
