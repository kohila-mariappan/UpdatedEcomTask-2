import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Request
} from '@nestjs/common';
//import { CreateUserDto } from '../auth/Dto/user.Dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
import { User } from './entities/user.entity';
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private MailerServices: MailerService,
  ) {}

 
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserDetail(@Request()req:any):Promise<User> {
    return this.userService.findOne(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getUserList() {
    return this.userService.findAll();
  }


  // @Patch('/resetPassword/:id')
  // resetPassword(@Param('id') id: number, @Body() body: UpdateUserDto) {
  //   this.AuthServices.resetPassword(body, id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) :Promise<UpdateUserDto>{
    return this.userService.updateUser(id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/remove/:id')
  removedUser(@Param('id') id:number):Promise<string> {
    return this.userService.removeUser(id);
  }
}
