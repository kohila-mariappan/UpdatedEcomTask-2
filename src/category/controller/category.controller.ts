import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { CategoryDto } from '../Dto/category-dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
import { PaginationParams } from '../Dto/pagination-dto';
import { PaginatedResultDto } from '../Dto/paginationResult-dto';
import { query } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly catService: CategoryService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() categoryDto: CategoryDto,@Request() req) : Promise<CategoryDto> {
    // const userId = req.user.id
    // categoryDto.userId = userId;
    return await this.catService.create(categoryDto,req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.catService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/listCategory')
  async categoryList(
    @Query() PaginationParams: PaginationParams,
    @Query('search') search:string){
    // console.log('list request',PaginationParams.limit ,PaginationParams.offset)
    // PaginationParams.limit = 10
    // PaginationParams.offset = 0
    // console.log('list request',PaginationParams.limit ,PaginationParams.offset)

    if(search){
      //console.log('list request',PaginationParams.limit ,PaginationParams.offset)
      return await this.catService.searchList(search,PaginationParams.limit,PaginationParams.offset)
    }
    else{
      //console.log('list request',PaginationParams.limit ,PaginationParams.offset)

            return await this.catService.categoryList(PaginationParams.limit,PaginationParams.offset)
          }

}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log('findOne request')
    return this.catService.findOne(id);
  }

  


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateCatDto: CategoryDto,@Request() req) {
    return this.catService.update(id,updateCatDto,req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: number) {
    return this.catService.delete(id);
  }

 

}
