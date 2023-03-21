import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateCartDto } from '../Dto/createCart.dto';
import { UpdateCartDto } from '../Dto/updateCart.dto';

@Injectable()
export class cartService {
  constructor(
    @InjectRepository(CartEntity) private Cartrepo: Repository<CartEntity>,
    @InjectRepository(ProductEntity) private ProdRepo :Repository<ProductEntity>,
    @InjectRepository(User) private UserRepo: Repository<User>,
  ) {}
  
  async addNewCart(body: CreateCartDto,req: any): Promise<CreateCartDto> {
    const cartItems = await this.Cartrepo.find({ relations: ['user'] });
    console.log('cartItems',cartItems);

       const authUser = await this.UserRepo.findOne({where :{id:req.user.id}})
       console.log(authUser)

       //Confirm the user exists.
       if(authUser){
        const product = await this.ProdRepo.findOne({where :{id:body.productId}});
       console.log(product)
       //Confirm the product exist
        if (product) {
         const cart = await this.Cartrepo.findOne({where :{productId:product.id}})
          console.log(cart)
          if (!cart) {
            const newCart = await this.Cartrepo.create({
                productId: body.productId,
                userId:req.user.id,
                quantity:body.quantity,
                amount: body.quantity * product.price,
              });
              console.log('newcart', newCart);
              const savedCart = await this.Cartrepo.save(newCart);
              return savedCart

          } else {
              // //Update the item quantity
              const quantity = body.quantity+cart.quantity;
              const amount = (body.quantity * product.price) + cart.amount
              cart.quantity = quantity;
              cart.amount = amount;
              cart.userId = req.user.id;
              const updateCart = await this.Cartrepo.save(cart)
              return updateCart;

          }
      }else{
        throw new NotFoundException('Product not available please add other products')
      }
       }
       else{
        throw new BadRequestException('invalid user')
       } 
  }

  async updateCart(id: number, attrs: Partial<UpdateCartDto>,req: any) {
    const user = await this.Cartrepo.findOne({where:{userId:req.user.id}})
    if(user){
      const cart = await this.Cartrepo.findOne({ where: { id } });
      console.log('upCart',cart)
      if (cart == null) {
        throw new NotFoundException('cart not found');
      }else{
        const product = await this.ProdRepo.findOne({where:{id:cart.productId}})
  
      const quantity = attrs.quantity+cart.quantity;
      const amount = (attrs.quantity * product.price) + cart.amount
      attrs.quantity = quantity;
      attrs.amount = amount;
      attrs.userId = req.user.id
      const updateCart:object = Object.assign(cart, attrs);
      return this.Cartrepo.save(updateCart);
  
      }
    }else{
      throw new UnauthorizedException('unauthorized edit');
    }
   
    
  }

  async removeCart(id: number,req:any): Promise<string> {
    const cart = await this.Cartrepo.findOne({ where: { id } });
    if(req.user.id === cart.userId){
      if (!cart) {
        throw new BadRequestException('invalid cart id');
      } else {
        await this.Cartrepo.remove(cart);
      }
      return 'successfully deleted';

    }else{
      throw new UnauthorizedException('UnAuthorized user')
    }
  }

  async allCartItems(req: any ): Promise<CreateCartDto[]> {
    const carts = await this.Cartrepo.find({where:{userId:req.user.id}});
    if(carts){
      return carts;

    }else{
      throw new BadRequestException('no cart items from this user')
    }
  }
}
