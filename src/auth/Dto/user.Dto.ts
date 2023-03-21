import { IsNotEmpty, MinLength, IsEmail, IsEnum, IsString  } from 'class-validator';

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email:string;

  @IsString()
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
})
  gender: string;

  @IsString()
  @MinLength(6)
  password:string;

}
