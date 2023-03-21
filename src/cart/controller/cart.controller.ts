import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  Request
} from '@nestjs/common';
import { cartService } from '../services/cart.service';
import { CreateCartDto } from '../Dto/createCart.dto';
import { UpdateCartDto } from '../Dto/updateCart.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.gurd';

@Controller('cart')
export class cartController {
  constructor(private cartService: cartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addCart(@Body() body: CreateCartDto,@Request() req): Promise<CreateCartDto> {
    return await this.cartService.addNewCart(body,req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:id')
  async updateCart(@Param('id') id: number, @Body() body: UpdateCartDto,@Request() req): Promise<any> {
    return await this.cartService.updateCart(id, body,req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/remove/:id')
  async removeCart(@Param('id') id: number,@Request() req): Promise<string> {
    return await this.cartService.removeCart(id,req);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  async allCartItems(@Request() req): Promise<CreateCartDto[]> {
    return await this.cartService.allCartItems(req);
  }
  
}
