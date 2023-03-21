import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { orderController } from './controller/order.controller';
import { OrderEntity } from './entities/order.entity';
import { orderService } from './services/order.service';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { PaymentEntity } from 'src/payment/entity/payment.entity';
import { orderControllerV1 } from './controller/order.controllerV1';
import { orderServiceV1 } from './services/order.serviceV1';
@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity,CartEntity,PaymentEntity,ProductEntity])],
  controllers: [orderController,orderControllerV1],
  providers: [orderService,orderServiceV1],
})
export class OrderModule {}
