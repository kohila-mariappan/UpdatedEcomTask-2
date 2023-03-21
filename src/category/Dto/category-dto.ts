import { IsNumber, IsNotEmpty, IsString, IsOptional  } from 'class-validator';

export class CategoryDto {
  
  @IsString()
  categoryName: string;
  @IsNumber()
  @IsOptional()
  userId: number;
}
