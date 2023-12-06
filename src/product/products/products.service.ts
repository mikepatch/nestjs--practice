import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Logger } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    private categoriesService: CategoriesService,
    @Inject('DbConnection') private readonly knex: Knex,
  ) {}

  private async findProduct(id: number): Promise<IProduct> {
    const product = await this.knex<IProduct>('products').where({ id }).first();
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    return product;
  }

  async createNew(productDto: NewProductDto): Promise<IProduct> {
    await this.categoriesService.getOneById(productDto.categoryId);
    const [newProductId] = await this.knex<IProduct>('products').insert({
      stock: 0,
      ...productDto,
    });

    const newProduct = await this.findProduct(newProductId);

    this.logger.log(`Created product with id: ${newProduct}`);
    return newProduct;
  }

  async getAll(name: string = ''): Promise<IProduct[]> {
    const query = this.knex<IProduct>('products');
    if (name) {
      query.whereLike('name', `%${name}%`);
    }

    return query;
  }

  async checkProductOnStock(id: number, quantity: number) {
    const product = await this.findProduct(id);
    if (product.stock < quantity) {
      throw new BadRequestException(`Product: ${id} is out of stock`);
    }

    return true;
  }

  getOneById(id: number): Promise<IProduct> {
    return this.findProduct(id);
  }

  async update(
    id: number,
    partialProduct: UpdateProductDto,
  ): Promise<IProduct> {
    if (partialProduct.categoryId) {
      await this.categoriesService.getOneById(partialProduct.categoryId);
    }

    await this.knex<IProduct>('products').where({ id }).update(partialProduct);

    return this.findProduct(id);
  }

  async removeById(id: number) {
    await this.findProduct(id);
    return this.knex('products').where({ id }).del();
  }
}
