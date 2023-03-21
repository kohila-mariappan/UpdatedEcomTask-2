import { Controller,Param, UseGuards, Request, Post, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';
import { CreatePaymentDto } from '../Dto/payment.Dto';
import { paymentService } from '../services/payment.service';


@Controller('payment')
export class paymentController {
    constructor(private paymentService : paymentService){}
@UseGuards(JwtAuthGuard)
@Post()
async createPayment(@Body() body:CreatePaymentDto,@Request() req):Promise<CreatePaymentDto>{
    return await this.paymentService.createPayment(body,req)
}
@UseGuards(JwtAuthGuard)
@Get('/status')
async paymentStatus(@Request() req): Promise<object> {
  return await this.paymentService.paymentStatus(req);
}
}
