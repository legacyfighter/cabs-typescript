import { IsNotEmpty } from 'class-validator';

export class CreateContractAttachmentDto {
  @IsNotEmpty()
  public data: string;
}
