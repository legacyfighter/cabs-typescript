import { PaymentType, Type } from '../entity/client.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public lastName: string;

  @IsEnum(Type)
  public type: Type;

  @IsEnum(PaymentType)
  public defaultPaymentType: PaymentType;
}
