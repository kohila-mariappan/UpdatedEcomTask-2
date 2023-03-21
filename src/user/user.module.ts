import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { MaileService } from './mailer.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import {  AuthServiceV1 } from '../auth/services/auth.servicev1';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, MaileService, JwtStrategy, JwtService,AuthServiceV1],
})
export class UserModule {}
