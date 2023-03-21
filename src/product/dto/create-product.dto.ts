import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateProductDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsNumber()
  price: number;
  
  //@IsNotEmpty()
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
