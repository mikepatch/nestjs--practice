import { Injectable } from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  createNew(categoryDto: NewCategoryDto) {
    return this.categoriesRepository.createNew(categoryDto);
  }

  getAll(name: string = '') {
    return this.categoriesRepository.getAll(name);
  }

  getOneById(id: number) {
    return this.categoriesRepository.getOneById(id);
  }

  removeById(id: number): Promise<{ id: number; removed: number }> {
    return this.categoriesRepository.removeById(id);
  }
}
