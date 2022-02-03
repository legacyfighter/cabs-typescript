import { IsNotEmpty } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  public driverLicense: string;

  public photo: string;
}
