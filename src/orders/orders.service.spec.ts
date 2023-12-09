import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ProductsService } from '../product/products/products.service';
import { OrdersRepository } from './orders.repository';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ProductsService, useValue: {} },
        { provide: OrdersRepository, useValue: {} },
        OrdersService,
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
