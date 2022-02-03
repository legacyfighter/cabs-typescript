import { IsEnum, IsNotEmpty } from 'class-validator';
import { CarClass } from '../entity/car-type.entity';

export class CreateDriverSessionDto {
  @IsNotEmpty()
  public carBrand: string;

  @IsNotEmpty()
  public platesNumber: string;

  @IsEnum(CarClass)
  public carClass: CarClass;
}
