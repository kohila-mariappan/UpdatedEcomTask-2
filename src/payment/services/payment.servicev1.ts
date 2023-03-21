import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CreatePaymentDto } from '../Dto/payment.Dto';
import { PaymentEntity } from '../entity/payment.entity';

@Injectable()
export class paymentServiceV1 {
    constructor(@InjectRepository(CartEntity) private cartRepo: Repository<CartEntity>,
        @InjectRepository(PaymentEntity) private paymentRepo: Repository<PaymentEntity>) { }
    async createPayment(body: CreatePaymentDto, req: any): Promise<string> {
        const findCart = await this.cartRepo.
            createQueryBuilder("cart")
            .select()
            .where('cart.Id=:id', { id: body.cartId })
            .getOne()
        console.log('upCart', findCart)
        //if(findCart.userId == req.user.id){
        if (findCart) {
            if (findCart.userId == req.user.id) {
                const findCartInPayment = await this.paymentRepo
                    .createQueryBuilder('payment')
                    .select()
                    .where('payment.id=:id', { id: body.cartId })
                    .getOne()
                console.log("findCartInPayment",findCartInPayment)
                if (!findCartInPayment) {
                    const cartItems = await this.cartRepo
                        .createQueryBuilder("cart")
                        .select()
                        .where('cart.userId=:id', { id: req.user.id })
                        .getMany()
                    console.log('cartItems', cartItems)
                    const subTotal = cartItems.map(item => item.amount).reduce((acc, next) => acc + next);
                    console.log(subTotal)
                    console.log("cartItems", cartItems)
                    if (cartItems) {
                        const newPayment = await this.paymentRepo
                            .createQueryBuilder()
                            .insert()
                            .into(PaymentEntity)
                            .values([{
                                userId: req.user.id,
                                cartId: body.cartId,
                                amount: subTotal,
                                paymentStatus: body.paymentStatus
                            }])
                            .execute()
                            console.log("newPayment", newPayment)
                        return 'payment was ' + body.paymentStatus
                            
                    }
                    else {
                        throw new BadRequestException('no cart from this user')
                    }

                } else {
                    const update = await this.paymentRepo
                        .createQueryBuilder()
                        .update(PaymentEntity)
                        .set({
                            paymentStatus: body.paymentStatus,
                            userId: req.user.id
                        })
                        .where('cartId=:id', { id: body.cartId })
                        .execute()
                    return 'payment was ' + body.paymentStatus
                }

            }
            else {
                throw new UnauthorizedException('invalid user')
            }
        } else {
            throw new NotFoundException('cart id not found or cart is empty')
        }

    }


    async paymentStatus(req: any): Promise<PaymentEntity> {
        const paymentStatus = await this.paymentRepo
            .createQueryBuilder("payment")
            .select()
            .where('payment.userId=:id', { id: req.user.id })
            .getOne()
        console.log('paymentStatus', paymentStatus)
        if (paymentStatus !== null) {
            return paymentStatus;
        }
        else {
            throw new NotFoundException('No Payment from this user')
        }
    }
}
