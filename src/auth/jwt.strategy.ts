import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './auth.constant';
import { AuthServiceV1 } from './services/auth.servicev1';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService:AuthServiceV1) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  
  }

  async validate(payload){
    const user = await this.authService.validation(payload.userId, payload.email);
    //console.log('jwtStrategyuser',user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
  }

  

