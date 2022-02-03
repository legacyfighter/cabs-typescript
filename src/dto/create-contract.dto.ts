import { IsNotEmpty } from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty()
  public subject: string;

  @IsNotEmpty()
  public partnerName: string;
}
