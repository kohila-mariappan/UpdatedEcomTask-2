import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { productService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
import { PaginationParams } from '../dto/pagination-dto';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: productService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateProductDto,@Request() req): Promise<any> {
    return await this.productService.create(body,req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async ProductList(
    @Query() PaginationParams: PaginationParams,
    @Query('search') search:string){
    // PaginationParams.limit = 10
    // PaginationParams.offset = 0
    console.log('search',search,PaginationParams.limit,PaginationParams.offset)


    if(search){
      return await this.productService.searchList(search,PaginationParams.limit,PaginationParams.offset)
    }
    else{
            return await this.productService.productList(PaginationParams.limit,PaginationParams.offset)
          }

}

  @UseGuards(AuthGuard('jwt'))
  @Get('/category/:categoryId')
  async CategoryAllProducts(@Param('categoryId') categoryId:number): Promise<ProductEntity[]> {
    return await this.productService.CategoryAllProducts(categoryId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetAllProducts(@Request() req) : Promise<ProductEntity[]> {
    return await this.productService.GetAllProducts(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number,@Request() req) {
    return this.productService.findOne(id,req.user);
  }
 
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: number, @Body() updateCatDto: CreateProductDto,@Request() req) {
    return this.productService.update(id,updateCatDto,req);
  }
 

  
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: number,@Request() req) {
    return this.productService.delete(id,req);
  }
}
