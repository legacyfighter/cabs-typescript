import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  public country: string;

  public district: string | null;

  @IsNotEmpty()
  public city: string;

  @IsNotEmpty()
  public street: string;

  @IsNotEmpty()
  public buildingNumber: number;

  @IsNotEmpty()
  public additionalNumber: number | null;

  @IsNotEmpty()
  public postalCode: string;

  public name: string;
}
