import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as fsp from 'node:fs/promises';
import { IProduct } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ClientLanguage } from '../../middlewares/client-language.decorator';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { SupportedLanguages } from '../../shared/language/language.service';

@Controller('products')
export class ProductsController {
  private logger = new Logger(ProductsController.name);

  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  async addNew(@Body() product: NewProductDto): Promise<IProduct> {
    this.logger.log('About to add');
    this.logger.log(product);
    return await this.productsService.createNew(product);
  }

  @Get()
  async getAll(): Promise<readonly IProduct[]> {
    return await this.productsService.getAll();
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

  @Get('sample-error')
  async getSampleError(@ClientLanguage() lang: SupportedLanguages) {
    throw new BadRequestException(
      lang === 'pl'
        ? 'Błąd z przykładową wiadomością'
        : 'Error with sample message',
    );
  }

  @Get(':productId')
  async getOne(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<IProduct> {
    return await this.productsService.getOneById(productId);
  }

  @Patch(':productId')
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() product: UpdateProductDto,
  ): Promise<IProduct> {
    return await this.productsService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.removeById(productId);
  }
}
