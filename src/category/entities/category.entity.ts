import { Entity, Column, PrimaryGeneratedColumn, OneToMany ,JoinColumn, ManyToOne} from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column()
  userId: number;
  
  // @OneToMany(type => ProductEntity, product => product.category)
  // //@JoinColumn()
  //  products: ProductEntity[];




}
