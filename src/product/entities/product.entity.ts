import { Entity, Column, PrimaryGeneratedColumn ,JoinColumn, OneToMany,ManyToMany} from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column()
  price: number;
  
  @Column()
  userId: number;

  @Column()
  categoryId: number;

  // @OneToMany(type => CartEntity, cart => cart.id)
  //  @JoinColumn()
  //  cart: CartEntity[]

  @ManyToMany(() => OrderEntity, (orders) => orders)
  orders: OrderEntity[]

  //  @ManyToOne(type => User, user => user.id)
  // @JoinColumn()
  // user: User
}
