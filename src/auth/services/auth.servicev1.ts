import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/Dtos/updateUser.dto';
import { CreateUserDto } from '../Dto/user.Dto';

@Injectable()
export class AuthServiceV1 {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async create(body: CreateUserDto): Promise<string> {
    const email: string = body.email;
    // const newUser = await this.repo.findOne({ where: { email } });
    const newUser = await this.repo
    .createQueryBuilder("user")
    .select('user.email')
    .where('user.email=:email',{email : email})
    .getOne()
    console.log('newUser',newUser);
    if (newUser) {
      throw new BadRequestException('User already registered');
    } else {
      const password = await this.passwordEncryption(body.password);
      // const newUser =  this.repo.create({
      //   firstName: body.firstName,
      //   lastName: body.lastName,
      //   email: body.email,
      //   gender: body.gender,
      //   password: password,
      // });
      // await this.repo.save(newUser)
      await this.repo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
          { firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              gender: body.gender,
              password: password,}
      ])
      .execute()
      return 'user added Successfully';  
    }
  }

  //allpromises checking remained
  async validateUser(email: string, password: string): Promise<User> {
    //console.log(email,password)
    // const user = await this.repo.findOne({ where: { email } });
    const user = await this.repo
    .createQueryBuilder("user")
    .select()
    .where('user.email=:email',{email : email})
    .getOne()
    console.log('newUser',user);
    //console.log('vuser',user)
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return user;
      } else {
        throw new BadRequestException('incorrect password');
      }
    } else {
      throw new BadRequestException('invalid email');
    }
  }

  async signIn(user:any) {
    const users = await this.validateUser(user.email, user.password);
    console.log(users)                                         
    if (users) {
      const payload = {
        userId:users.id,
        email: users.email, 
      };
      const token = this.jwt.sign(payload);
      console.log('token', token);
      const data = {
        token,users
      }
      console.log('data',data)
      return data
  
    } else {
      throw new BadRequestException('error');
    }
  }
  async resetPassword(body: UpdateUserDto, id: number): Promise<string> {
    // const user = await this.repo.findOne({ where: { id } });
    const user = await this.repo
    .createQueryBuilder("user")
    .select('user.id')
    .where('user.id=:id',{id : id})
    .getOne()
    // console.log('newUser',user);
    if (!user) {
      throw new BadRequestException('invalid user email');
    } else {
      const password: string = await this.passwordEncryption(body.password);
      user.password = password;
      await this.repo.save(user);
      return 'password reset sucessfully'
    }
  }
  async passwordEncryption(password: string): Promise<string> {
    const hash : string= await bcrypt.hash(password, 10);
    return hash;
  }

  async validation(userId:number, email:string):Promise<string | User>{
    console.log(userId,email)
    // const user = await this.repo.findOne({where : {id:userId}});
    const user = await this.repo
    .createQueryBuilder("user")
    .select()
    .where('user.id=:id',{id : userId})
    .getOne()
    // console.log('userval',user)
    if(user.email===email){
      return user
    }
    else{
      return 'invalid email'
    }
  }
}
