import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../product/products/products.service';
import { IProductInOrder } from './model/product-in-order.interface';
import { OrderModel } from './model/order.model';
import { ModelClass } from 'objection';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);

  constructor(
    private productsService: ProductsService,
    @Inject('OrderModel') private readonly orderModel: ModelClass<OrderModel>,
  ) {}

  private async findOrder(id: number): Promise<OrderModel> {
    return this.orderModel
      .query()
      .findById(id)
      .withGraphFetched('products')
      .throwIfNotFound(`Order with id: ${id} was not found`);
  }

  private async generateNextTitle() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const allOrdersFromThisYear = await this.orderModel
      .query()
      .whereBetween('madeAt', [
        `${currentYear}-01-01 00:00:00`,
        `${nextYear}-01-01 00:00:00`,
      ])
      .resultSize();

    const nextOrderNumber = allOrdersFromThisYear + 1;

    return `${nextOrderNumber}/${currentYear}`;
  }

  private validateProductIds = (products: IProductInOrder[]) =>
    products.forEach((product) =>
      this.productsService.getOneById(product.productId),
    );

  private validateProductStock = (products: IProductInOrder[]) =>
    products.forEach(async (product) => {
      return await this.productsService.checkProductOnStock(
        product.productId,
        product.quantity,
      );
    });

  async createNew(orderDto: CreateOrderDto): Promise<OrderModel> {
    let totalPrice = 0;
    for (const { id, quantity } of orderDto.products) {
      const product = await this.productsService.checkProductOnStock(
        id,
        quantity,
      );
      totalPrice += product.price * quantity;
    }

    const order = await this.orderModel.query().insert({
      title: await this.generateNextTitle(),
      totalPrice,
    });

    for (const product of orderDto.products) {
      await order.$relatedQuery('products').relate(product);
    }

    return order;
  }

  async getAll(): Promise<readonly OrderModel[]> {
    return this.orderModel.query().withGraphFetched('products');
  }

  getOneById(id: number): Promise<OrderModel> {
    return this.findOrder(id);
  }

  async update(id: number, partialOrder: UpdateOrderDto): Promise<OrderModel> {
    if (partialOrder.products) {
      this.validateProductIds(partialOrder.products);
      this.validateProductStock(partialOrder.products);
    }
    const orderToUpdate = await this.orderModel.query().findById(id);
    return orderToUpdate.$query().updateAndFetch(partialOrder);
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.orderModel.query().deleteById(id);

    this.logger.log(`Removing category ${id}`);
    return { id, removed };
  }
}
