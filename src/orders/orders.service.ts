import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../product/products/products.service';
import { IOrder } from './model/order.interface';
import { IProductInOrder } from './model/product-in-order.interface';

@Injectable()
export class OrdersService {
  private orders: IOrder[] = [
    {
      id: 1,
      title: 'test',
      madeAt: new Date(),
      status: 'OPENED',
      products: [{ id: 1, productId: 2, quantity: 5 }],
      totalPrice: 200,
    },
  ];

  constructor(private productsService: ProductsService) {}

  private findOrder(id: number): IOrder {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with id: ${id} was not found`);
    }

    return order;
  }

  private generateNextId(): number {
    return Math.max(...this.orders.map((product) => product.id)) + 1;
  }

  private validateProductIds = (products: IProductInOrder[]) =>
    products.forEach((product) =>
      this.productsService.getOneById(product.productId),
    );

  private validateProductStock = (products: IProductInOrder[]) =>
    products.forEach((product) => {
      const productToCheck = this.productsService.getOneById(product.productId);
      if (productToCheck.stock < product.quantity) {
        throw new NotFoundException(
          `Product ${productToCheck.id} is out of stock`,
        );
      }
    });

  create(order: CreateOrderDto): IOrder {
    this.validateProductIds(order.products);
    this.validateProductStock(order.products);

    const newOrder: IOrder = {
      id: this.generateNextId(),
      madeAt: new Date(),
      status: 'OPENED',
      totalPrice: order.products.reduce((acc, currValue) => {
        const currValueProduct = this.productsService.getOneById(
          currValue.productId,
        );
        const currValueProductPrice =
          currValueProduct.price * currValue.quantity;
        return acc + currValueProductPrice;
      }, 0),
      ...order,
    };

    order.products.forEach((product) => {
      const productToUpdate = this.productsService.getOneById(
        product.productId,
      );
      this.productsService.update(product.productId, {
        ...productToUpdate,
        stock: productToUpdate.stock - product.quantity,
      });
    });

    this.orders.push(newOrder);
    return newOrder;
  }

  getAll(): readonly IOrder[] {
    return this.orders;
  }

  getOneById(id: number): IOrder {
    return this.findOrder(id);
  }

  update(id: number, partialOrder: UpdateOrderDto): IOrder {
    const orderToUpdate = this.findOrder(id);
    Object.assign(orderToUpdate, partialOrder);

    return orderToUpdate;
  }

  removeById(id: number): { id: number; removed: boolean } {
    this.findOrder(id);
    this.orders = this.orders.filter((order) => order.id !== id);

    return { id, removed: true };
  }
}
