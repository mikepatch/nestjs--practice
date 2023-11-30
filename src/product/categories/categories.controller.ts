import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { ICategory } from './category.interface';
import { CategoriesService } from './categories.service';
import { ApiKeyGuard } from '../../guards/api-key.guard';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  addNew(@Body() category: NewCategoryDto): ICategory {
    this.logger.log('About to add');
    this.logger.log(category);
    return this.categoriesService.createNew(category);
  }

  @Get()
  getAll(): readonly ICategory[] {
    return this.categoriesService.getAll();
  }

  @Get(':categoryId')
  getOne(@Param('categoryId', ParseIntPipe) categoryId: number): ICategory {
    return this.categoriesService.getOneById(categoryId);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.removeById(categoryId);
  }
}
