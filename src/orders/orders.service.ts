import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../product/products/products.service';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private productsService: ProductsService,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  private async generateNextTitle() {
    const currentYear = new Date().getFullYear();
    const allOrdersFromThisYear =
      await this.ordersRepository.getHighestOrderNumberFromYear(currentYear);

    const nextOrderNumber = allOrdersFromThisYear + 1;

    return `${nextOrderNumber}/${currentYear}`;
  }

  async createNew(orderDto: CreateOrderDto) {
    let totalPrice = 0;
    for (const { id, quantity } of orderDto.products) {
      const product = await this.productsService.checkProductOnStock(
        id,
        quantity,
      );
      totalPrice += product.price * quantity;
    }

    return this.ordersRepository.createNewWithProductList(
      {
        title: await this.generateNextTitle(),
        totalPrice,
      },
      orderDto.products,
    );
  }

  async getAll() {
    return this.ordersRepository.getAll();
  }

  getOneById(id: number) {
    return this.ordersRepository.getOneByIdWithProducts(id);
  }
}
