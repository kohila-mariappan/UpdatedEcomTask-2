import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsNumber()
  @IsOptional()
  amount: number;
  @IsNumber()
  deliveryCharge: number;
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
  @IsString()
  @IsOptional()
  paymentStatus: string;
  @IsString()
  @IsOptional()
  orderStatus: string;
}
