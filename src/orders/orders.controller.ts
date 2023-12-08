import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createNew(createOrderDto);
  }

  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.ordersService.getOneById(id);
  }
}
