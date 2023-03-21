import { Controller,Param, UseGuards, Request, Post, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
import { CreatePaymentDto } from '../Dto/payment.Dto';
import {  paymentServiceV1 } from '../services/payment.servicev1';


@Controller('payment/v1')
export class paymentControllerV1 {
    constructor(private paymentService : paymentServiceV1){}
@UseGuards(JwtAuthGuard)
@Post()
async createPayment(@Body() body:CreatePaymentDto,@Request() req):Promise<string>{
    return await this.paymentService.createPayment(body,req)
}
@UseGuards(JwtAuthGuard)
@Get('/status')
async paymentStatus(@Request() req): Promise<object> {
  return await this.paymentService.paymentStatus(req);
}
    

}
