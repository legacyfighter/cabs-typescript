import { IsNotEmpty } from 'class-validator';

export class CreateDriverPositionDto {
  public latitude: number;

  public longitude: number;

  @IsNotEmpty()
  public driverId: string;
}
