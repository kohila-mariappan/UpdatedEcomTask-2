import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { PaymentEntity } from './entity/payment.entity';
import { paymentController } from '../payment/controller/payment.controller';
import { paymentServiceV1 } from './services/payment.servicev1';
import { paymentControllerV1 } from './controller/payment.ontrollerV1';
import { paymentService } from './services/payment.service';


@Module({
  imports: [TypeOrmModule.forFeature([CartEntity,PaymentEntity])],

  controllers: [paymentController, paymentControllerV1],
  providers: [paymentService,paymentServiceV1]
})
export class PaymentModule {}
