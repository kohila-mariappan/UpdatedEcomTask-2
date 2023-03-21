import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/Dto/user.Dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async createUser(body:CreateUserDto): Promise <CreateUserDto>{
    const user = await this.repo.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      gender: body.gender,
      password: body.password,
    });
   return  this.repo.save(user);
  }
  async findUser(email: string):Promise<object> {
    const user : object = await this.repo.findOne({ where: { email } });
    const poductItems = await this.repo.find({ relations: ['product'] });
    console.log('poductItems',poductItems)

    return user;
  }
  async findOne(req:any):Promise<any> {
    const user = await this.repo.findOne({ where: { id :req.user.id} });
    console.log('user', user);
    return user;
  }
  async findAll():Promise<User[]>{
    const userList = await this.repo.find()
    return userList;
  }

  async updateUser(id: number, attrs: Partial<User>) :Promise<UpdateUserDto>{
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async removeUser(id: number) :Promise<string> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.repo.remove(user);
    return 'user removed'
  }
}
