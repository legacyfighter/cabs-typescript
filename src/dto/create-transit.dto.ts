import { IsEnum, IsNotEmpty } from 'class-validator';
import { CarClass } from '../entity/car-type.entity';

export interface Address {
  country: string;
  district?: string | null;
  city: string;
  street: string;
  buildingNumber: number;
  additionalNumber: number | null;
  postalCode: string;
  name?: string;
}

export class CreateTransitDto {
  @IsNotEmpty()
  public clientId: string;

  public from: Address;

  public to: Address;

  @IsEnum(CarClass)
  public carClass: CarClass;
}
