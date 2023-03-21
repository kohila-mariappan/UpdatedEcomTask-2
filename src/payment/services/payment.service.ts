import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CreatePaymentDto } from '../Dto/payment.Dto';
import { PaymentEntity } from '../entity/payment.entity';

@Injectable()
export class paymentService {
    constructor(@InjectRepository(CartEntity) private cartRepo:Repository<CartEntity>,
    @InjectRepository(PaymentEntity) private paymentRepo : Repository<PaymentEntity>) {}

    async createPayment(body:CreatePaymentDto,req: any):Promise<CreatePaymentDto>{
        const findCart = await this.cartRepo.findOne({where:{id:body.cartId}})
        if(findCart){
            const findCartInPayment = await this.paymentRepo.findOne({where:{cartId:body.cartId}})
        console.log(findCartInPayment)
        if(!findCartInPayment){
            const cartItems = await this.cartRepo.find({where:{userId:req.user.id}});
    console.log('cartItems',cartItems)
    const subTotal = cartItems.map(item => item.amount).reduce((acc, next) => acc + next);
    console.log(subTotal)
    const newPayment = await this.paymentRepo.create({
        userId: req.user.id,
        cartId: body.cartId,
        amount: subTotal,
        paymentStatus: body.paymentStatus
    })
    return await this.paymentRepo.save(newPayment);
}else{
    findCartInPayment.paymentStatus = body.paymentStatus;
    findCartInPayment.userId = req.user.id
   return await this.paymentRepo.save(findCartInPayment);

        }

        }else{
            throw new NotFoundException('cart id not found or cart is empty')
        }

        
    }

   async paymentStatus(req:any):Promise<PaymentEntity[]>{
    const paymentStatus = await this.paymentRepo.find({where:{userId:req.user.id}})
    if(paymentStatus){
        return paymentStatus;
    }
    else{
        throw new NotFoundException('no status from this user')
    }
   }

}
