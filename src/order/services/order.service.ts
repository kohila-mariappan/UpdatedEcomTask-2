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
export class orderService {
  constructor(
    @InjectRepository(OrderEntity) private repo: Repository<OrderEntity>,
    @InjectRepository(CartEntity) private cartRepo:Repository<CartEntity>,
    @InjectRepository(PaymentEntity) private paymentRepo :Repository<PaymentEntity>,
    @InjectRepository(ProductEntity) private prodRepo:Repository<ProductEntity>
  ) {}

  async createOrder(body:CreateOrderDto,req:any): Promise<object>{
    const product = await this.prodRepo.findOne({where:{id:body.productId}})
    console.log(product);
    if(product){
      const cart = await this.cartRepo.findOne({where:{productId:product.id}})
      console.log(cart.id)
      const payment = await this.paymentRepo.findOne({where:{cartId:cart.id}})
      console.log(payment)
      if(payment){
        if(payment.paymentStatus === "Sucess"){
          console.log(req.user.id)
          const newOrder :object = await this.repo.create({
            userId:req.user.id,
            productId:body.productId,
            amount:payment.amount,
            deliveryCharge:body.deliveryCharge,
            totalAmount:payment.amount+body.deliveryCharge,
            paymentStatus:payment.paymentStatus,
            orderStatus:"Placed"

          })
          console.log('neworder',newOrder)
          return await this.repo.save(newOrder);
        }else{
          const mesg = 'only payment sucess then order will be placed'
          throw new BadRequestException('payment was'+payment.paymentStatus, mesg)
          
        }   

      }else{
        throw new BadRequestException('payment not initiated')
      }
          
    

    }else{
      throw new NotFoundException('out of stock ')
    }
    

  }
 
  async myOrders(limit:number,offset:number,req:any): Promise<PaginatedResultDto> {
    console.log(limit,offset)
    const userOrder = await this.repo.findOne({where:{userId:req.user.id}});
    console.log('id',userOrder)
    const poductItems = await this.repo.find({
      relations: {
          products: true,
      }});
    console.log('poductItems',poductItems)
    if(userOrder){
      const [orders, totalCount] = await this.repo.findAndCount({
        skip: offset,
        take: limit
        });
        
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
    const userOrder = await this.repo.find({where:{userId:req.user.id}});
    const poductItems = await this.repo.find({ relations: ['products'] });
    console.log('poductItems',poductItems)

    if(userOrder){
    const [orders, totalCount] = await this.repo.findAndCount({ 
      skip: offset,
      take: limit,
      where:{
        id:search 
      }
    });
      
      console.log(orders,totalCount)
      
      return {
      orders ,
      totalCount
      }
    }
    else{
      throw new BadRequestException('no orders for this user')
    }


  } 
  async orderStatus(id: number): Promise<object> {
    console.log(id)
    const orders = await this.repo.findOne({where:{id:id}})
    console.log('orders',orders)
    if(orders != null){
      // if (orders.paymentStatus === 'Sucess') {
      //   orders.orderStatus = 'Placed';
      // } else if (orders.paymentStatus === 'Pending') {
      //   orders.orderStatus = 'Pending';
      // } 
      // else if(orders.paymentStatus === 'Failed'){
      //   orders.orderStatus = 'Failed'
      // }
      // else {
      //   orders.orderStatus = 'Cancelled';
      // }
      //return await this.repo.save(orders);
      return orders;
      }else{
      throw new NotFoundException('orderid not found')
    }
  }
  async orderCancel(id:number,body: { orderStatus: string; },req:any):Promise<string>{
    const user = await this.repo.findOne({where:{userId:req.user.id}})
    if(user){
      const order = await this.repo.findOne({where:{id:id}})
    if(order)
    {
      order.orderStatus=body.orderStatus;
      await this.repo.save(order)
      return 'order was cancelled'

    }
    else{
      throw new NotFoundException('order id not found')
    }

    }else{
      throw new UnauthorizedException('no orders from this user')
    }
    
  }
 
  
    
 
}
