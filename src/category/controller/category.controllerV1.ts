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
  import { categoryServiceV1 } from '../services/category.servicev1';
  import { CategoryDto } from '../Dto/category-dto';
  import { AuthGuard } from '@nestjs/passport';
  import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
  import { PaginationParams } from '../Dto/pagination-dto';
  
  @Controller('category/v1')
  export class categoryControllerV1 {
    constructor(private readonly catService: categoryServiceV1) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() categoryDto: CategoryDto,@Request() req) : Promise<string> {
      return await this.catService.create(categoryDto,req);
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
    @Get()
    async findAll(): Promise<CategoryEntity[]> {
      return this.catService.findAll();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number) {
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
  