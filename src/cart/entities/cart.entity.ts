import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  userId: number;
  @Column()
  quantity :number
  @Column()
  amount: number;

  // @ManyToOne(type => User, user => user.id)
  // @JoinColumn()
  // user: User

  // @ManyToOne(type => ProductEntity, product => product.id)
  //  @JoinColumn()
  //  product: ProductEntity

  
  
}
