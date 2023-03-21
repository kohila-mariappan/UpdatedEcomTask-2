import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryDto } from '../Dto/category-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { PaginationParams } from '../Dto/pagination-dto';
import { PaginatedResultDto } from '../Dto/paginationResult-dto';
import { ProductEntity } from 'src/product/entities/product.entity';
import { join } from 'path';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
  ) {}

  async create(category: CategoryDto,req: any): Promise<CategoryDto> {
    const categoryName : string = category.categoryName
    const findCategory = await this.catRepository.findOne({where:{categoryName}})
    if(findCategory){
      throw new BadRequestException('category is available so go to add product')
    }
    else{
      const createdCategory = await this.catRepository.create({
        categoryName: category.categoryName,
        userId: req.user.id
      });
      return await this.catRepository.save(createdCategory);

    }
   
  }

  async update(id: number, attrs: Partial<CategoryEntity>,req: { user: { id: number; }; }){
    const updateCategory = await this.catRepository.findOne({ where: { id } });
    if (!updateCategory) {
      throw new NotFoundException('categoryId not found');
    }
    console.log('updateCategory',updateCategory);
    Object.assign(updateCategory, attrs);
    updateCategory.categoryName = attrs.categoryName
    updateCategory.userId = req.user.id
    return this.catRepository.save(updateCategory);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity>{
    const category = await this.catRepository.findOne({ where: { id } });
    if(category){
      //const poductItems = await this.catRepository.find({ relations: ['product'] });
      //console.log('poductItems',poductItems)
      return category;

    }else{
      throw new NotFoundException('CategoryId was not Found')
    }
  }


  async delete(id: number): Promise<string> {
    const category = await this.catRepository.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('invalid category id');
    } else {
      await this.catRepository.remove(category);
    }
    return 'successfully deleted';
  }

  async categoryList(limit: number,offset: number):Promise<PaginatedResultDto>{
    const [items, totalCount] = await this.catRepository.findAndCount({
      skip: offset,
      take: limit
      });
      
      console.log(items,totalCount)
      
      return {
      items,
      totalCount
      }
    
  }
  async searchList(search:string,limit:number,offset:number):Promise<PaginatedResultDto>{
    console.log('search',search,offset,limit)
    const [items, totalCount] = await this.catRepository.findAndCount({ 
      skip: offset,
      take: limit,
      where:{
        categoryName:search
      }
    });
      
      console.log(items,totalCount)
      
      return {
      items ,
      totalCount
      }


  }
}
