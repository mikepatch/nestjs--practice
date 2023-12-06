import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrder } from './model/order.interface';
import { OrderModel } from './model/order.model';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderModel> {
    return await this.ordersService.createNew(createOrderDto);
  }

  @Get()
  async getAll(): Promise<readonly OrderModel[]> {
    return await this.ordersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<OrderModel> {
    return this.ordersService.getOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderModel> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ordersService.removeById(id);
  }
}
