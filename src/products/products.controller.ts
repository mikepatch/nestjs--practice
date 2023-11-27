import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IProduct } from './product.interface';
import { productList } from './product-list';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  private productId: number = productList.length;
  private products: IProduct[] = productList;

  findProduct(id: number): IProduct {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    return product;
  }

  @Post()
  addNew(@Body() product: NewProductDto): IProduct {
    const newProduct: IProduct = { id: this.productId++, stock: 0, ...product };
    this.products.push(newProduct);

    return newProduct;
  }

  @Get()
  getAll(@Query('name') searchByName: string = ''): IProduct[] {
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(searchByName.toLowerCase()),
    );
  }

  @Get(':productId')
  getOne(@Param('productId') productId: number): IProduct {
    return this.findProduct(productId);
  }

  @Patch(':productId')
  updateOne(
    @Param('productId') productId: number,
    @Body() product: UpdateProductDto,
  ) {
    const productToUpdate = this.findProduct(productId);
    Object.assign(productToUpdate, product);

    return productToUpdate;
  }

  @Delete(':productId')
  remove(@Param('productId') productId: number) {
    this.findProduct(productId);
    this.products = this.products.filter((product) => product.id !== productId);

    return {
      message: 'Item removed',
      id: productId,
    };
  }
}
