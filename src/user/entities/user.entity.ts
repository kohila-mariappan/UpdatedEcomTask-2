import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  BeforeRemove,
  OneToMany,
} from 'typeorm';
//import { CartEntity } from 'src/cart/entities/cart.entity';
//import { ProductEntity } from 'src/product/entities/product.entity';

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other" 
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  gender: string;
  @Column()
  password: string;

  // @OneToMany(type => CartEntity, cart => cart.id)
  //  cart: CartEntity[];

  // @OneToMany(type => ProductEntity, product => product.id)
  //  product: ProductEntity[];
   
  


  @BeforeRemove()
  beforelogRemove() {
    console.log('before Removed this User', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed this User', this.id);
  }
}


