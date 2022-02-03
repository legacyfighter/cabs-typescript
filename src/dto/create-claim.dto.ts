import { IsNotEmpty } from 'class-validator';

export class CreateClaimDto {
  @IsNotEmpty()
  public reason: string;

  @IsNotEmpty()
  public transitId: string;

  @IsNotEmpty()
  public clientId: string;

  @IsNotEmpty()
  public incidentDescription: string;
}
