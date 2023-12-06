import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { ModelClass } from 'objection';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(
    @Inject('CategoryModel')
    private readonly categoryModel: ModelClass<CategoryModel>,
  ) {}

  private async findCategory(id: number): Promise<CategoryModel> {
    this.logger.debug(`Searching for category ${id}`);
    return this.categoryModel
      .query()
      .findById(id)
      .throwIfNotFound(`Category with id: ${id} was not found`);
  }

  async createNew(categoryDto: NewCategoryDto) {
    try {
      return await this.categoryModel.query().insert({ ...categoryDto });
    } catch (error) {
      this.logger.log(`Created category with id: ${error.constructor.name}`);

      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${categoryDto.name}" already exists`,
        );
      }

      throw error;
    }
  }

  async getAll(name: string = ''): Promise<CategoryModel[]> {
    return this.categoryModel.query().whereLike('name', `%${name}%`);
  }

  getOneById(id: number): Promise<CategoryModel> {
    return this.findCategory(id);
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.categoryModel.query().deleteById(id);

    this.logger.log(`Removing category ${id}`);
    return { id, removed };
  }
}
