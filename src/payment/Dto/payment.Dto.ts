import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()

  cartId: number;
  @IsNumber()
  @IsOptional()

  userId: number;
  @IsNotEmpty()
  @IsString()
  paymentStatus : string
  @IsNumber()
  @IsOptional()
  amount : number
}
