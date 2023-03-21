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
export class cartServiceV1 {
  constructor(
    @InjectRepository(CartEntity) private Cartrepo: Repository<CartEntity>,
    @InjectRepository(ProductEntity) private ProdRepo: Repository<ProductEntity>,
    @InjectRepository(User) private UserRepo: Repository<User>,
  ) { }

  async addNewCart(body: CreateCartDto, req: any): Promise<string> {
    const cartItems = await this.Cartrepo.find({ relations: ['user'] });

    //  const authUser = await this.UserRepo.findOne({where :{id:req.user.id}})
    const authUser = await this.UserRepo
      .createQueryBuilder("user")
      .select()
      .where('user.id=:id', { id: req.user.id })
      .getOne()
    console.log('newUser', authUser)

    //Confirm the user exists.
    if (authUser) {
      // const product = await this.ProdRepo.findOne({where :{id:body.productId}});
      const product = await this.ProdRepo
        .createQueryBuilder("product")
        .select()
        .where('product.id=:id', { id: body.productId })
        .getOne()
      console.log("product", product)
      //Confirm the product exist
      if (product) {
        //  const cart = await this.Cartrepo.findOne({where :{productId:product.id}})
        const cart = await this.Cartrepo
          .createQueryBuilder("cart")
          .select()
          .where('cart.productId=:productId', { productId: product.id })
          .getOne()
        console.log("cart", cart)
        if (!cart) {
          // const newCart = await this.Cartrepo.create({
          //     productId: body.productId,
          //     userId:req.user.id,
          //     quantity:body.quantity,
          //     amount: body.quantity * product.price,
          //   });
          const newCart = await this.Cartrepo
            .createQueryBuilder()
            .insert()
            .into(CartEntity)
            .values([
              {
                productId: body.productId,
                userId: req.user.id,
                quantity: body.quantity,
                amount: body.quantity * product.price,
              }
            ])
            .execute()
          console.log('newcart', newCart);
          return 'Cart added Successfully';
          // const savedCart = await this.Cartrepo.save(newCart);
          // return savedCart

        } else {
          // //Update the item quantity
          // const quantity = body.quantity + cart.quantity;
          // const amount = (body.quantity * product.price) + cart.amount
          // cart.quantity = quantity;
          // cart.amount = amount;
          // cart.userId = req.user.id;
          // const updateCart = await this.Cartrepo.save(cart)
          // return updateCart;
          const updatedProduct = await this.Cartrepo
            .createQueryBuilder()
            .update(CartEntity)
            .set({
              quantity : body.quantity + cart.quantity,
              amount : (body.quantity * product.price) + cart.amount,
              // quantity: quantity,
              // amount: amount,
              userId: req.user.id,
            })
            .where("id = :id", { id: cart.id })
            .execute()
          console.log("updatedcategory", updatedProduct)
          return 'updated cart Successfully'
        }

      } else {
        throw new NotFoundException('Product not available please add other products')
      }
    }
    else {
      throw new BadRequestException('invalid user')
    }
  }

  async updateCart(id: number, attrs: Partial<UpdateCartDto>, req: any) {
    // const user = await this.Cartrepo.findOne({ where: { userId: req.user.id } })
    const user = await this.Cartrepo
          .createQueryBuilder("cart")
          .select()
          .where('cart.userId=:userId', { userId: req.user.id })
          .getOne()
    if (user) {
      // const cart = await this.Cartrepo.findOne({ where: { id } });
      const cart = await this.Cartrepo
          .createQueryBuilder("cart")
          .select()
          .where('cart.id=:id', { id: id })
          .getOne()
      console.log('upCart', cart)
      if (cart == null) {
        throw new NotFoundException('cart not found');
      } else {
        // const product = await this.ProdRepo.findOne({ where: { id: cart.productId } })
        const product = await this.ProdRepo
          .createQueryBuilder("product")
          .select()
          .where('product.id=:id', { id: cart.productId })
          .getOne()
        // const quantity = attrs.quantity + cart.quantity;
        // const amount = (attrs.quantity * product.price) + cart.amount
        // attrs.quantity = quantity;
        // attrs.amount = amount;
        // attrs.userId = req.user.id
        // const updateCart: object = Object.assign(cart, attrs);
        // return this.Cartrepo.save(updateCart);
        const updateCart = await this.Cartrepo
        .createQueryBuilder()
        .update(CartEntity)
        .set({
          quantity : attrs.quantity + cart.quantity,
          amount : (attrs.quantity * product.price) + cart.amount,
          // quantity: quantity,
          // amount: amount,
          userId: req.user.id,
        })
        .where("id = :id", { id: cart.id})
        .execute()
      console.log("updatedcategory", updateCart)
      return 'updated cart Successfully'

      }

    } else {
      throw new UnauthorizedException('unauthorized edit');
    }
  }

  async removeCart(id: number, req: any): Promise < string > {
      // const cart = await this.Cartrepo.findOne({ where: { id } });
      const cart = await this.Cartrepo
          .createQueryBuilder("cart")
          .select()
          .where('cart.id=:id', { id: id })
          .getOne()
          console.log("id",id,"req.user.id",req.user.id)
      
      if (!cart) {
        throw new BadRequestException('invalid cart id');
      } else {
        // await this.Cartrepo.remove(cart);
        if(req.user.id == cart.userId){
        await this.Cartrepo
        .createQueryBuilder('cart')
        .delete()
        .from(CartEntity)
        .where("id = :id", { id: cart.id })
        .execute()
        return 'successfully deleted';
      }
    else {
      throw new UnauthorizedException('UnAuthorized user')
    }
  }
}
    

  async allCartItems(req: any): Promise < CreateCartDto > {
      // const carts = await this.Cartrepo.find({ where: { userId: req.user.id } });
      const carts = await this.Cartrepo
          .createQueryBuilder("cart")
          .select()
          .where('cart.userId=:userId', { userId: req.user.id })
          .getOne()
      if(carts) {
        return carts;

      }else{
        throw new BadRequestException('no cart items from this user')
      }
    }

  }