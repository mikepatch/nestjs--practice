import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { CategoriesService } from './categories.service';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { CategoryModel } from './category.model';

@Controller('categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  addNew(@Body() category: NewCategoryDto): Promise<CategoryModel> {
    this.logger.log('About to add');
    this.logger.log(category);
    return this.categoriesService.createNew(category);
  }

  @Get()
  getAll(@Query('name') searchByName: string): Promise<CategoryModel[]> {
    return this.categoriesService.getAll(searchByName);
  }

  @Get(':categoryId')
  getOne(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryModel> {
    return this.categoriesService.getOneById(categoryId);
  }

  @Delete(':categoryId')
  @UseGuards(ApiKeyGuard)
  remove(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.removeById(categoryId);
  }
}
