import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
    Request
  } from '@nestjs/common';
  import { AuthServiceV1 } from '../services/auth.servicev1';
  import { CreateUserDto } from '../Dto/user.Dto';
  import { UpdateUserDto } from 'src/user/Dtos/updateUser.dto';
  import { JwtAuthGuard } from '../guard/auth.gurd';
import { User } from 'src/user/entities/user.entity';
  
  @Controller('auth/v1')
  export class AuthControllerV1 {
    constructor(private authService: AuthServiceV1) {}
  
    @Post('/signUp')
    async studentSignUp(@Body() body: CreateUserDto): Promise<string> {
      // console.log(body);
      return await this.authService.create(body);
    }
  
    @Post('/signIn')
    async signIn(@Request() req:any) :Promise<object> {
      console.log("login request",req.body)
      return this.authService.signIn(req.body);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch('/resetPassword/:id')
    resetPassword(@Param('id') id: number, @Body() body: UpdateUserDto) {
      return this.authService.resetPassword(body, id);
    }
  }
  