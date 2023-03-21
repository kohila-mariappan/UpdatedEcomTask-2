import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { UsersEmail } from '../auth/entities/email.entity';
import { CreateProductDto } from '../dto/create-product.dto'
import { CategoryEntity } from 'src/category/entities/category.entity';
import { PaginatedResultDto } from '../dto/paginationResult-dto';

@Injectable()
export class productService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity) private catRepo :Repository<CategoryEntity>
  ) {}
   
  // addproduct
  // create a new product and add to the database
async create(body: CreateProductDto,req: any): Promise < CreateProductDto > {
  const findCategory = await this.catRepo.findOne({where:{id:body.categoryId}})
  const productName = await this.productRepository.findOne({where:{name:body.name}})
if(findCategory){
  if(!productName){
    const createdProduct = await this.productRepository.create({
      name: body.name,
      description: body.description,
      image: body.image ,
      price: body.price,
      userId: req.user.id,
      categoryId: body.categoryId
    });
    console.log("createdProduct", createdProduct)
    return await this.productRepository.save(createdProduct);

  }else{
    throw new BadRequestException("product is already added go to add cart")

  }
 }else{
  throw new NotFoundException('Category was not available so please add category')
}
  
}

  //getallproduct
  async CategoryAllProducts(categoryId:number): Promise<ProductEntity[]> {
    const findCategory = await this.catRepo.findOne({where:{id:categoryId}})
    if(findCategory){
      const products = await this.productRepository.find({where:{categoryId:categoryId}});
      //const poductItems = await this.catRepo.find({ relations: ['category'] });
      console.log('productItems',products)

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

  async findOne(id: number,req: any): Promise<ProductEntity[]> {
  const userProducts = await this.productRepository.findOne({where:{userId:req.id}})
  console.log(userProducts)
  if(userProducts !== null)  {
    if(userProducts.id === id){
        const products = await this.productRepository.find({where:{id:id}})
        
        console.log(products)
        if(products){
          return products;
        }else{
          throw new NotFoundException('product id not found from this user')
        }
      }
      else{
        throw new NotFoundException('does not matching userId and corresponding product Id')
      }
  }
  else{
    throw new UnauthorizedException('no products from this user')

  }
 
  } 
  

  //find all
  async GetAllProducts(req:any): Promise<ProductEntity[]> {
    console.log(req.id)
    const products = await this.productRepository.find({where:{userId:req.id}})
    if(products){
      return products;
    }
    else{
      throw new UnauthorizedException('no products from this user')
    }
  } 

  //update
  async update(id: number, attrs: Partial<ProductEntity>,req: { user: { id: number; }; }){
    const findProduct = await this.productRepository.findOne({ where: { id } });
    console.log(findProduct)
    if(findProduct){
      const category = await this.catRepo.findOne({where:{id:attrs.categoryId}})
      if(category){
        findProduct.name=attrs.name
        findProduct.description = attrs.description
        findProduct.image=attrs.image
        findProduct.price=attrs.price
        findProduct.userId = req.user.id

        Object.assign(findProduct, attrs);
        return this.productRepository.save(findProduct);
      }else{
        throw new BadRequestException('product is not availble in this category')
      }

    }
    else{
      throw new NotFoundException('product is not available')
    }

   
   
  }

  //delete
  async delete(id: number,req): Promise<string> {
    const product = await this.productRepository.findOne({ where: { id } });
    if(req.user.id === product.userId){
      if (!product) {
        throw new BadRequestException('invalid product id');
      } else {
        await this.productRepository.remove(product);
        return 'successfully deleted';
      }
    }else{
      throw new UnauthorizedException('unauthorized user')
    }

    }
    async productList(limit: number,offset: number):Promise<PaginatedResultDto>{
      const [items, totalCount] = await this.productRepository.findAndCount({
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
      const [items, totalCount] = await this.productRepository.findAndCount({ 
        skip: offset,
        take: limit,
        where:{
          name:search 
        }
      });
        
        console.log(items,totalCount)
        
        return {
        items ,
        totalCount
        }
  
  
    }  
}

