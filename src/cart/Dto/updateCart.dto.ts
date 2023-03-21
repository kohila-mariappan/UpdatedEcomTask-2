import { IsNumber, IsOptional } from 'class-validator';
export class UpdateCartDto {
  @IsNumber()
  @IsOptional()
  productId: number;
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsNumber()
  @IsOptional()
  quantity: number;
  @IsNumber()
  @IsOptional()
  amount: number;
}
