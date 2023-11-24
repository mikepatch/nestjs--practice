import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { ICategory } from './category.interface';
import { categoriesList } from './categories-list';

@Controller('categories')
export class CategoriesController {
  private categories: ICategory[] = categoriesList;
  private nextId = 8;

  @Get()
  getAll(): ICategory[] {
    return this.categories;
  }

  @Get(':id')
  getSingleCategory(@Param('id', ParseIntPipe) categoryId: number) {
    const category = this.findCategory(categoryId);

    if (!category) {
      throw new NotFoundException(`Category with id: ${categoryId} not found`);
    }

    return category;
  }

  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    const category: ICategory = { id: this.nextId++, ...payload };

    this.categories.push(category);
    return category;
  }

  @Delete(':id')
  removeCategory(@Param('id', ParseIntPipe) categoryId: number) {
    const isCategoryInArr = this.findCategory(categoryId);
    if (!isCategoryInArr) {
      throw new NotFoundException(`Category with id: ${categoryId} not found`);
    }

    this.categories = this.categories.filter(
      (category) => category.id !== categoryId,
    );

    return { message: 'Category deleted', id: categoryId };
  }

  findCategory(categoryId: number) {
    return this.categories.find((category) => category.id === categoryId);
  }
}
