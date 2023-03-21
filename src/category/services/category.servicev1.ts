import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryDto } from '../Dto/category-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { PaginatedResultDto } from '../Dto/paginationResult-dto';

@Injectable()
export class categoryServiceV1 {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
  ) {}

  async create(category: CategoryDto,req: any): Promise<string> {
    const categoryName : string = category.categoryName
    // const findCategory = await this.catRepository.findOne({where:{categoryName}})
    const findCategory = await this.catRepository
    .createQueryBuilder("category")
    .select()
    .where('category.categoryName=:categoryName',{categoryName : categoryName})
    .getOne()
    console.log('findCategory',findCategory);
    if(findCategory){
      throw new BadRequestException('category is available so go to add product')
    }
    // else{
    //   const createdCategory = await this.catRepository.create({
    //     categoryName: category.categoryName,
    //     userId: req.user.id
    //   });
    {
      const createdCategory = await this.catRepository
      .createQueryBuilder()
      .insert()
      .into(CategoryEntity)
      .values([
          { categoryName : category.categoryName, userId: req.user.id },
      ])
      .execute()
      return 'Category was created Successfully';
    }
      // return await this.catRepository.save(createdCategory);
     
    }
   
  

  async update(id: number, attrs: Partial<CategoryEntity>,req: { user: { id: number; }; }){
    // const updateCategory = await this.catRepository.findOne({ where: { id } });
    const updateCategory = await this.catRepository
    .createQueryBuilder("category")
    .select()
    .where('category.id=:id',{id : id})
    .getOne()
    console.log("updateCategory", updateCategory)
    if (!updateCategory) {
      throw new NotFoundException('categoryId not found');
    }
    // console.log('updateCategory',updateCategory);
    // Object.assign(updateCategory, attrs);
    // updateCategory.categoryName = attrs.categoryName
    // updateCategory.userId = req.user.id
    // return this.catRepository.save(updateCategory);
    const updatedCategory = await this.catRepository
    .createQueryBuilder()
    .update(CategoryEntity)
    .set({ categoryName:attrs.categoryName , userId: req.user.id })
    .where("id = :id", { id:updateCategory.id })
    .execute()
    console.log("updatedcategory",updatedCategory)
    return 'updated Category Successfully'
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    // const category = await this.catRepository.findOne({ where: { id } });
    const category = await this.catRepository
    .createQueryBuilder("category")
    .select()
    .where('category.id=:id',{id : id})
    .getOne()
    console.log('newUser',category);
    if(category){
      const items = this.catRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect("category.products",'product')
        .getMany()
        console.log('items',items)

      return category;

    }else{
      throw new NotFoundException('CategoryId was not Found')
    }
  }


  async delete(id: number): Promise<string> {
    // const category = await this.catRepository.findOne({ where: { id } })
    const category = await this.catRepository
    .createQueryBuilder("category")
    .select('category.id')
    .where('category.id=:id',{id : id})
    .getOne()
    console.log("updateCategory", category)
    if (!category) {
      throw new BadRequestException('invalid category id');
    } else {
      // await this.catRepository.remove(category);
    const deleteCategory = await this.catRepository
    .createQueryBuilder('category')
    .delete()
    .from(CategoryEntity)
    .where("id = :id", { id: category.id })
    .execute()
    }
    return 'successfully deleted';
  }
  async categoryList(limit: number,offset: number):Promise<PaginatedResultDto>{
    const totalCount = await this.catRepository.count()
    const items = await this.catRepository.createQueryBuilder('product')
    .offset(offset)
    .limit(limit)
    .getMany()

      
      console.log(items,totalCount)
      
      return {
      items,
      totalCount
      }
  }
  async searchList(search:string,limit:number,offset:number):Promise<PaginatedResultDto>{
    console.log('search',search,offset,limit)
    const totalCount = await this.catRepository.createQueryBuilder('category')
    .where('category.categoryName=:name',{name:search})
    .getCount()

    const items = await this.catRepository.createQueryBuilder('category')
      .offset(offset)
      .limit(limit)
      .where('category.categoryName=:name',{name:search})
      .getMany()

        
        console.log(items,totalCount)
        
        return {
        items,
        totalCount
        }



  }
}
