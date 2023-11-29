import { Injectable, NotFoundException } from '@nestjs/common';
import { productList } from './product-list';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private productId: number = productList.length;
  private products: IProduct[] = productList;
  private logger = new Logger(ProductsService.name);

  constructor(private categoriesService: CategoriesService) {}

  private findProduct(id: number): IProduct {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    return product;
  }

  private generateNextId() {
    return Math.max(...this.products.map((product) => product.id)) + 1;
  }

  createNew(product: NewProductDto): IProduct {
    this.categoriesService.getOneById(product.categoryId);
    const newProduct: IProduct = {
      id: this.generateNextId(),
      stock: 0,
      ...product,
    };

    this.products.push(newProduct);
    this.logger.log(`Created product with id: ${newProduct.id}`);
    return newProduct;
  }

  getAll(name: string = ''): readonly IProduct[] {
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  getOneById(id: number): IProduct {
    this.logger.verbose(`Read product id: ${id}`);
    this.logger.debug(`Read product id: ${id}`);
    this.logger.log(`Read product id: ${id}`);
    this.logger.warn(`Read product id: ${id}`);
    this.logger.error(`Read product id: ${id}`);
    this.logger.fatal(`Read product id: ${id}`);
    return this.findProduct(id);
  }

  update(id: number, partialProduct: UpdateProductDto): IProduct {
    this.categoriesService.getOneById(partialProduct.categoryId);
    const productToUpdate = this.findProduct(id);
    Object.assign(productToUpdate, partialProduct);

    return productToUpdate;
  }

  removeById(id: number): void {
    this.findProduct(id);
    this.products = this.products.filter((product) => product.id !== id);
  }
}
