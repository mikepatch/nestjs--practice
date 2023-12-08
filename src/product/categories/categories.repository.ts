import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoriesRepository {
  private logger = new Logger(CategoriesRepository.name);
  constructor(
    @Inject('CategoryModel')
    private readonly categoryModel: ModelClass<CategoryModel>,
  ) {}

  async createNew(categoryDto: Pick<CategoryModel, 'name'>) {
    this.logger.log(`Adding ${categoryDto.name} category`);

    try {
      const newCategory = await this.categoryModel
        .query()
        .insert({ ...categoryDto });

      this.logger.log(`Success!`);
      return newCategory;
    } catch (error) {
      this.logger.error(
        `There was a problem with adding the new category: ${error}`,
      );

      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${categoryDto.name}" already exists`,
        );
      }

      throw error;
    }
  }

  async getAll(name: string) {
    return this.categoryModel.query().whereLike('name', `%${name}`);
  }

  async getOneById(id: number) {
    this.logger.log(`Searching for category with id: ${id}`);

    return this.categoryModel
      .query()
      .findById(id)
      .throwIfNotFound(`Category with id: ${id} was not found`);
  }

  async removeById(id: number) {
    this.logger.log(`Removing category with id ${id}`);

    await this.getOneById(id);
    const removed = await this.categoryModel.query().deleteById(id);

    return { id, removed };
  }
}
