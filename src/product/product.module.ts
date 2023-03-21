import { Module } from '@nestjs/common';
import {  productServiceV1 } from './services/product.servicev1';
import { ProductController } from './controller/product.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { productControllerV1 } from './controller/product.controllerV1';
import { productService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity,CategoryEntity])],
  providers: [productService, productServiceV1],
  controllers: [ProductController, productControllerV1],
})
export class ProductModule {}
