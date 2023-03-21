import { Entity, Column, PrimaryGeneratedColumn,OneToMany,ManyToMany,JoinTable} from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { productControllerV1 } from 'src/product/controller/product.controllerV1';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  userId: number;
  @Column()
  amount: number;
  @Column()
  deliveryCharge: number;
  @Column()
  totalAmount: number;
  @Column()
  paymentStatus: string;
  @Column()
  orderStatus: string;
  @ManyToMany(() => ProductEntity, (product) => product, {
    cascade: true,
})
@JoinTable()
products: ProductEntity[]

  
}
