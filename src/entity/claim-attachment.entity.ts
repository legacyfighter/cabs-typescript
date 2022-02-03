import { BaseEntity } from '../common/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Claim } from './claim.entity';

@Entity()
export class ClaimAttachment extends BaseEntity {
  @ManyToOne(() => Claim)
  private claim: Claim;

  @Column({ type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'varchar' })
  private description: string | null;

  @Column({ type: 'bytea' })
  private data: Buffer;

  public getClient() {
    return this.claim.getOwner();
  }

  public getClaim() {
    return this.claim;
  }

  public setClaim(claim: Claim) {
    this.claim = claim;
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number) {
    this.creationDate = creationDate;
  }

  public getDescription() {
    return this.description;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public getData() {
    return this.data;
  }

  public setData(data: string) {
    this.data = Buffer.from(
      '\\x' + Buffer.from(data, 'base64').toString('hex'),
    );
  }
}
