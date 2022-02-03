import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  protected id: string;

  public getId(): string {
    return this.id;
  }
}
