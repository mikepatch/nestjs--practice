import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICategory } from './category.interface';
import { categoriesList } from './categories-list';
import { NewCategoryDto } from './dto/new-category.dto';

@Injectable()
export class CategoriesService {
  private categories: ICategory[] = categoriesList;
  private logger = new Logger(CategoriesService.name);

  private findCategory(id: number): ICategory {
    const category = this.categories.find((category) => category.id === id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} was not found`);
    }
    return category;
  }

  private generateNextId(): number {
    return Math.max(...this.categories.map((category) => category.id)) + 1;
  }

  createNew(category: NewCategoryDto): ICategory {
    const newCategory: ICategory = { id: this.generateNextId(), ...category };

    this.categories.push(newCategory);
    this.logger.log(`Created category with id: ${newCategory.id}`);
    return newCategory;
  }

  getAll(): readonly ICategory[] {
    return this.categories;
  }

  getOneById(id: number): ICategory {
    return this.findCategory(id);
  }

  removeById(id: number): { id: number; removed: boolean } {
    this.findCategory(id);
    this.categories = this.categories.filter((category) => category.id !== id);

    return { id: id, removed: true };
  }
}