import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cartController } from './controller/cart.controller';
import { CartEntity } from './entities/cart.entity';
import { cartServiceV1 } from './services/cart.servicev1';
import { User } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { cartControllerV1 } from './controller/cart.controllerV1';
import { cartService } from './services/cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, User, ProductEntity])],
  controllers: [cartController, cartControllerV1],
  providers: [cartServiceV1, cartService],
})
export class CartModule {}
