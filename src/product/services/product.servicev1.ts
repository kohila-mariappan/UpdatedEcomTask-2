import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FilterProductDTO } from '../dto/filter-product';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
//import { UsersEmail } from '../auth/entities/email.entity';
import { User } from '../../user/entities/user.entity';
import { CreateProductDto } from '../dto/create-product.dto'
import { CategoryEntity } from 'src/category/entities/category.entity';
import { PaginatedResultDto } from '../dto/paginationResult-dto';

@Injectable()
export class productServiceV1 {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity) private catRepo :Repository<CategoryEntity>
  ) {}
   
  // addproduct
  // create a new product and add to the database
async create(body: CreateProductDto,req: any): Promise < string > {
  // const findCategory = await this.catRepo.findOne({where:{id:body.categoryId}})
  // const productName = await this.productRepository.findOne({where:{name:body.name}})
  const findCategory = await this.catRepo
    .createQueryBuilder("category")
    .select()
    .where('category.id=:id',{id : body.categoryId})
    .getOne()
    const productName = await this.productRepository
    .createQueryBuilder("product")
    .select()
    .where('product.name=:name',{name : body.name})
    .getOne()
if(findCategory){
  if(!productName){
    // const createdProduct = await this.productRepository.create({
    //   name: body.name,
    //   description: body.description,
    //   image: body.image ,
    //   price: body.price,
    //   userId: req.user.id,
    //   categoryId: body.categoryId
    // });
    // console.log("createdProduct", createdProduct)
    // return await this.productRepository.save(createdProduct);
    const createdProduct = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(ProductEntity)
      .values([
          { name : body.name,
            description: body.description,
            image: body.image ,
            price: body.price,
            userId: req.user.id,
            categoryId: body.categoryId}
      ])
      .execute()
      return 'product was created Successfully';
  }else{
    throw new BadRequestException("product is already added go to add cart")

  }
 }else{
  throw new NotFoundException('Category was not available so please add category')
}
  
}

  //getallproduct
  async CategoryAllProducts(categoryId:number): Promise<ProductEntity[]> {
    // const findCategory = await this.catRepo.findOne({where:{id:categoryId}})
    const findCategory = await this.catRepo
    .createQueryBuilder("category")
    .select()
    .where('category.id=:id',{id : categoryId})
    .getOne()
    if(findCategory){
      // const products = await this.productRepository.find({where:{categoryId:categoryId}});
      const products = await this.productRepository
      .createQueryBuilder("product")
      .select()
      .where('product.categoryId=:categoryId',{categoryId : categoryId})
      .getMany()
      if(products){
        return products;
      }
      else{
        throw new NotFoundException('no products in this category')
      }    

    }else{
      throw new NotFoundException('invalid category id')
    }
  }


  async findOne(id: number,req: any): Promise<ProductEntity> {
  // const userProducts = await this.productRepository.findOne({where:{userId:req.id}})
        // const products = await this.productRepository.find({where:{id:id}})
        const products = await this.productRepository
        .createQueryBuilder("product")
        .select()
        .where('product.id=:id',{id : id})
        .getOne()    
        console.log("products",products)
        if(products){
          if(products.userId == id){
          return products
        }else{
          throw new NotFoundException('invalid user')
        }
      }else{
        throw new NotFoundException('invalid product id')
        }
      }
      
  
  //find all
  async GetAllProducts(req:any): Promise<ProductEntity[]> {
    // console.log(req.id)
    // const products = await this.productRepository.find({where:{userId:req.id}})
    const products = await this.productRepository
    .createQueryBuilder("product")
    .select()
    .where('product.userId=:userId',{userId : req.id})
    .getMany()
    if(products){
      return products;
    }
    else{
      throw new UnauthorizedException('no products from this user')
    }
  } 

  //update
  async update(id: number, attrs: Partial<ProductEntity>,req: { user: { id: number; }; }){
    // const findProduct = await this.productRepository.findOne({ where: { id } });
    const findProduct = await this.productRepository
    .createQueryBuilder("product")
    .select()
    .where('product.id=:id',{id : id})
    .getOne()
    console.log(findProduct)
    if(findProduct){
      // const category = await this.catRepo.findOne({where:{id:attrs.categoryId}})
      const category = await this.catRepo
    .createQueryBuilder("category")
    .select()
    .where('category.id=:id',{id : attrs.categoryId})
    .getOne()
      // if(category){
      //   findProduct.name=attrs.name
      //   findProduct.description = attrs.description
      //   findProduct.image=attrs.image
      //   findProduct.price=attrs.price
      //   findProduct.userId = req.user.id

      //   Object.assign(findProduct, attrs);
      //   return this.productRepository.save(findProduct);
      // }
    if(category){
        const updatedProduct = await this.productRepository
    .createQueryBuilder()
    .update(ProductEntity)
    .set({ 
        name:attrs.name,
        description : attrs.description,
        image:attrs.image,
        price:attrs.price,
        userId : req.user.id
    })
    .where("id = :id", { id: id })
    .execute()
    // console.log("id",id,"attrs.id",id)
    console.log("updatedcategory",updatedProduct)
    return 'updated product Successfully'
      }
      else{
        throw new BadRequestException('The particular product is not avaliable for this category ')
      }
    }else{
      throw new BadRequestException('product is not avliable')
    }
    }
    
  //delete
  async delete(id: number,req): Promise<string> {
    // const product = await this.productRepository.findOne({ where: { id } });
    const product = await this.productRepository
    .createQueryBuilder("product")
    .select()
    .where('product.id=:id',{id : id})
    .getOne()
    // if(req.user.id === product.userId){
      if (!product) {
        throw new BadRequestException('invalid product id');
      } else {
    if(req.user.id === product.userId){
        // await this.productRepository.remove(product);
        await this.productRepository
        .createQueryBuilder('product')
        .delete()
        .from(ProductEntity)
        .where("id = :id", { id: product.id })
        .execute()
        return 'successfully deleted';
      }else{
        throw new BadRequestException('unauthorized user');
    }
    }
  }
  async productList(limit: number,offset: number):Promise<PaginatedResultDto>{
    // const [items, totalCount] = await this.productRepository.findAndCount({
    //   skip: offset,
    //   take: limit
    //   });
      
    //   console.log(items,totalCount)
      
    //   return {
    //   items,
    //   totalCount
    //   }
    const totalCount = await this.productRepository.count()
      const items = await this.productRepository.createQueryBuilder()
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
    // const [items, totalCount] = await this.productRepository.findAndCount({ 
    //   skip: offset,
    //   take: limit,
    //   where:{
    //     name:search 
    //   }
    // });
      
    //   console.log(items,totalCount)
      
    //   return {
    //   items ,
    //   totalCount
    //   }
    const totalCount = await this.productRepository.createQueryBuilder('product')
    .where('product.name=:name',{name:search})
    .getCount()      
    const items = await this.productRepository.createQueryBuilder('product')
      .offset(offset)
      .limit(limit)
      .where('product.name=:name',{name:search})
      .getMany()

        
        console.log(items,totalCount)
        
        return {
        items,
        totalCount
        }


  }     
}

