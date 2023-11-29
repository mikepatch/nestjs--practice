import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  addNew(@Body() product: NewProductDto): IProduct {
    return this.productsService.createNew(product);
  }

  @Get()
  getAll(@Query('name') searchByName: string): IProduct[] {
    return this.productsService.getAll(searchByName);
  }

  @Get(':productId')
  getOne(@Param('productId') productId: number): IProduct {
    return this.productsService.getOneById(productId);
  }

  @Patch(':productId')
  update(
    @Param('productId') productId: number,
    @Body() product: UpdateProductDto,
  ): IProduct {
    return this.productsService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('productId') productId: number) {
    return this.productsService.removeById(productId);
  }
}
