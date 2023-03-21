import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './controller/auth.controller';
import { AuthServiceV1 } from './services/auth.servicev1';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import {JwtAuthGuard} from './guard/auth.gurd'
import { AuthControllerV1 } from './controller/auth.controllerV1';
import { AuthService } from './services/auth.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5mins' },
    }),
    PassportModule,
  ],
  controllers: [AuthController, AuthControllerV1],
  providers: [AuthServiceV1, JwtStrategy, LocalStrategy, JwtAuthGuard, AuthService],
})
export class AuthModule {}
