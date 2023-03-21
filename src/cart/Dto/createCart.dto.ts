import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()

  productId: number;
  @IsNumber()
  @IsOptional()

  userId: number;
  @IsNotEmpty()
  @IsNumber()

  quantity: number;
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  amount: number;
}
