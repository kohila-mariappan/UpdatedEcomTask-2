import { BadRequestException, Body, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { PaymentEntity } from 'src/payment/entity/payment.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { PaginatedResultDto } from '../dto/paginationResult-dto';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class orderServiceV1 {
  constructor(
    @InjectRepository(OrderEntity) private repo: Repository<OrderEntity>,
    @InjectRepository(CartEntity) private cartRepo: Repository<CartEntity>,
    @InjectRepository(PaymentEntity) private paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(ProductEntity) private prodRepo: Repository<ProductEntity>
  ) { }

  async createOrder(body: { cartId: number, deliveryCharge: number }, req: any): Promise<string> {
    //const product = await this.prodRepo.findOne({where:{id:body.productId}})
    // const product = await this.prodRepo
    // .createQueryBuilder()
    // .select()
    // .where('id=:id',{id : body.productId})
    // .getOne()
    // console.log(product)
    // if(product){
    //const cart = await this.cartRepo.findOne({where:{productId:product.id}})
    // console.log('cartid', body.cartId)
    const cart = await this.cartRepo
      .createQueryBuilder()
      .select()
      .where('id=:id', { id: body.cartId })
      .getOne()
    console.log("cart", cart)
    if (cart) {
      if(cart.userId == req.user.id){
      const product = await this.prodRepo
        .createQueryBuilder()
        .select()
        .where('id=:id', { id: cart.productId })
        .getOne()
      console.log(product)
      if (product) {
        const payment = await this.paymentRepo
          .createQueryBuilder('payment')
          .select()
          .where('payment.cartId=:id', { id: cart.id })
          .getOne()
        console.log(payment)
        if (payment) {
          if (payment.paymentStatus == "sucess"||"Sucess") {
            console.log(req.user.id)
            const newOrder = await this.repo
              .createQueryBuilder()
              .insert()
              .into(OrderEntity)
              .values([{
                userId: req.user.id,
                productId: product.id,
                amount: payment.amount,
                deliveryCharge: body.deliveryCharge,
                totalAmount: payment.amount + body.deliveryCharge,
                paymentStatus: payment.paymentStatus,
                orderStatus: "Placed"

              }])
              .execute()
            return 'order was placed'
          } else {
            throw new BadRequestException('payment was' + payment.paymentStatus)
          }
        } else {
          throw new BadRequestException('payment was' + payment.paymentStatus + 'in tnis status')
        }
      } else {
        throw new BadRequestException('no stock')
      }
        }else{
          throw new BadRequestException("invalid user")
        }
    } else {
      throw new NotFoundException(" cart not found")
    }
  }

  async myOrders(limit:number,offset:number,req:any): Promise<PaginatedResultDto> {
    console.log(limit,offset)
    const userOrder = await this.repo
    .createQueryBuilder('order')
    .select()
    .where('order.userId=:id', { id:req.user.id })
    .getMany()
    if(userOrder){
      
      const totalCount = await this.repo.count()
      const orders = await this.repo.createQueryBuilder()
      .offset(offset)
      .limit(limit)
      .getMany()

        
        console.log(orders,totalCount)
        
        return {
        orders,
        totalCount
        }

    }else{
      throw new BadRequestException('no orders for this user')
    }
  }
  async searchList(search:number,limit:number,offset:number,req:any):Promise<PaginatedResultDto>{
    console.log('search',search,offset,limit)
    const userOrder = await this.repo
    .createQueryBuilder('order')
    .select()
    .where('order.userId=:id', { id:req.user.id })
    .getMany()
    if(userOrder){

      const totalCount = await this.repo.createQueryBuilder('order')
      .where('order.id=:id',{id:search})
      .getCount()        
      const orders = await this.repo.createQueryBuilder('order')
      .offset(offset)
      .limit(limit)
      .where('order.id=:id',{id:search})
      .getMany()

        
        console.log(orders,totalCount)
        
        return {
        orders,
        totalCount
        }
    }
    else{
      throw new BadRequestException('no orders for this user')
    }
  }

  async orderStatus(id: number, req:any): Promise<OrderEntity> {
    console.log(id)
    //const orders = await this.repo.findOne({where:{id:id}})
    const orders = await this.repo
      .createQueryBuilder('order')
      .select()
      .where('order.id=:id', { id: id })
      .getOne()
    console.log('orders', orders)
    if (orders != null) {
      if(orders.userId == req.user.id){
      return orders;
    } else {
      throw new NotFoundException('user invalid')
    }}else{
      throw new NotFoundException('order id not found')
    }
  }


  async orderCancel(id: number, body: { orderStatus: string; }, req: any): Promise<string> {
    //const user = await this.repo.findOne({where:{userId:req.user.id}})
    const user = await this.repo
      .createQueryBuilder('order')
      .select()
      .where('order.userId=:id', { id: req.user.id })
      .getOne()
    if (user) {
      //const order = await this.repo.findOne({where:{id:id}})
      const order = await this.repo
        .createQueryBuilder('order')
        .select()
        .where('order.id=:id', { id: id })
        .getOne()
      if (order) {
           await this.repo
          .createQueryBuilder()
          .update(order)
          .set({
            orderStatus: body.orderStatus
          })
          .where('id=:id', { id: id })
          .execute()
        //await this.repo.save(order)
        return 'order was ' + body.orderStatus

      }
      else {
        throw new NotFoundException('order id not found')
      }
    } else {
      throw new UnauthorizedException('no orders from this user')
    }
  }
}
