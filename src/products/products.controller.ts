import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import * as fsp from 'node:fs/promises';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  private logger = new Logger(ProductsController.name);

  constructor(private productsService: ProductsService) {}

  @Post()
  addNew(@Body() product: NewProductDto): IProduct {
    this.logger.log('About to add');
    this.logger.log(product);
    return this.productsService.createNew(product);
  }

  @Get()
  getAll(@Query('name') searchByName: string): readonly IProduct[] {
    return this.productsService.getAll(searchByName);
  }

  // @Get('test-file')
  // async getAllFromFile() {
  //   try {
  //     const fileData = await fsp.readFile('not-existing-file.txt');
  //
  //     return fileData;
  //   } catch {
  //     throw new NotFoundException(
  //       'Missing file. Cannot find not-existing-file.txt',
  //     );
  //   }
  // }

  @Get('test-file')
  async getAllFromFile() {
    const fileData = await fsp.readFile('not-existing-file.txt');

    return { fileData };
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
