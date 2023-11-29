import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { ICategory } from './category.interface';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    return this.categoriesService.createNew(payload);
  }

  @Get()
  getAll(): readonly ICategory[] {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getSingleCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoriesService.getOneById(categoryId);
  }

  @Delete(':id')
  removeCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoriesService.removeById(categoryId);
  }
}
