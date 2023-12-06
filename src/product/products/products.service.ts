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
    try {
      const [newProductId] = await this.knex<IProduct>('products').insert({
        ...productDto,
      });

      return this.getOneById(newProductId);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(`Something went wrong. Please check logs.`);
    }
  }

  getAll(): Promise<IProduct[]> {
    try {
      return this.knex<IProduct>('products');
    } catch (error) {
      throw new BadRequestException(`Something went wrong`);
    }
  }

  getOneById(id: number): Promise<IProduct> {
    return this.findProduct(id);
  }

  async update(
    id: number,
    partialProduct: UpdateProductDto,
  ): Promise<IProduct> {
    this.logger.log(`Updating category ${id}`);
    // this.categoriesService.getOneById(partialProduct.categoryId);
    // const productToUpdate = this.findProduct(id);
    // Object.assign(productToUpdate, partialProduct);

    return this.knex('products')
      .where({ id })
      .update({ ...partialProduct });

    // return this.getOneById(productToUpdateId);
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.knex('products').where({ id }).delete();

    this.logger.log(`Removing category ${id}`);
    return { id, removed };
  }
}
