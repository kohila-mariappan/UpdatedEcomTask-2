import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../Dto/user.Dto';
import { UpdateUserDto } from 'src/user/Dtos/updateUser.dto';
import { JwtAuthGuard } from '../guard/auth.gurd';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async studentSignUp(@Body() body: CreateUserDto): Promise<string> {
    // console.log(body);
    return await this.authService.create(body);
  }

  @Post('/signIn')
  async signIn(@Request() req:any)  {
    console.log("login request",req.body)
    return this.authService.signIn(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/resetPassword/:id')
  resetPassword(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.authService.resetPassword(body, id);
  }
}
