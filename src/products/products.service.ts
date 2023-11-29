import { Injectable, NotFoundException } from '@nestjs/common';
import { productList } from './product-list';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private productId: number = productList.length;
  private products: IProduct[] = productList;

  private findProduct(id: number): IProduct {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }
    return product;
  }

  createNew(product: NewProductDto): IProduct {
    const newProduct: IProduct = { id: ++this.productId, stock: 0, ...product };
    this.products.push(newProduct);

    return newProduct;
  }

  getAll(name: string = ''): IProduct[] {
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  getOneById(id: number) {
    return this.findProduct(id);
  }

  update(id: number, partialProduct: UpdateProductDto) {
    const productToUpdate = this.findProduct(id);
    Object.assign(productToUpdate, partialProduct);

    return productToUpdate;
  }

  removeById(id: number): void {
    this.findProduct(id);
    this.products = this.products.filter((product) => product.id !== id);
  }
}
