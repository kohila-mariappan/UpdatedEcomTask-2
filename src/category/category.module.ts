import { Module } from '@nestjs/common';
import { categoryServiceV1 } from './services/category.servicev1';
import { CategoryController } from './controller/category.controller';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryControllerV1 } from './controller/category.controllerV1';
import { CategoryService } from './services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [categoryServiceV1,CategoryService],
  controllers: [CategoryController, categoryControllerV1],
  exports: [categoryServiceV1],
})
export class CategoryModule {}
