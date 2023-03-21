import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch, Query, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { orderService } from '../services/order.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard} from 'src/auth/guard/auth.gurd';
import { PaginationParams } from '../dto/pagination-dto';
@Controller('order')
export class orderController {
  constructor(private orderService: orderService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async createOrder(@Body() body: CreateOrderDto,@Request() req): Promise<object> {
    return await this.orderService.createOrder(body,req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async myOrders(@Request() req:any,
  @Query() PaginationParams: PaginationParams,
  @Query('search') search:number){
    console.log('search',req.user.id,PaginationParams.limit,PaginationParams.offset)
    if(search){
      return await this.orderService.searchList(search,PaginationParams.limit,PaginationParams.offset,req)


    }else{
      return await this.orderService.myOrders(PaginationParams.limit,PaginationParams.offset,req)
    }
     
  }
 
  
  @UseGuards(JwtAuthGuard)
  @Get('/orderStatus/:id')
  async orderStatus(@Param('id') id: number): Promise<object> {
    console.log('orderId',id)
    return await this.orderService.orderStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/cancel/:id')
  async orderCancel(@Param('id') id: number,@Request() req,@Body() body): Promise<string> {
    console.log('orderId',req.user.id)
    return await this.orderService.orderCancel(id,body,req);
  }

  

}
