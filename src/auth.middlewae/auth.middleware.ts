import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/auth.constant';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // console.log(console.log('Request...',req))
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      
      const decoded: any = jwt.verify(token, jwtConstants.secret);
      jwt.verify(token, jwtConstants.secret,function (error, decoded) {
        if (error) {
          throw new BadRequestException("Token Expired, Please login again")
        }
      })
      const user = await this.userService.findOneById(decoded.id);
      console.log("user",user)

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
      }
      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  } 
}


