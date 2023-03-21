import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CartModule } from './cart/cart.module';
import { CartEntity } from './cart/entities/cart.entity';
import { OrderEntity } from './order/entities/order.entity';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { ProductEntity } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { CategoryEntity } from './category/entities/category.entity';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentEntity } from './payment/entity/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Kohila@96',
      database: 'ECOM',  
      entities: [User, CartEntity, OrderEntity, ProductEntity, CategoryEntity,PaymentEntity],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          password:
            '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',
        },
      },
    }),
    UserModule,
    MailerModule,
    CartModule,
    OrderModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
