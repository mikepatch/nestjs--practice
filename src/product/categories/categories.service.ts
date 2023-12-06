import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ICategory } from './category.interface';
import { NewCategoryDto } from './dto/new-category.dto';
import { Knex } from 'knex';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(@Inject('DbConnection') private readonly knex: Knex) {}

  private async find(id: number): Promise<ICategory> {
    this.logger.debug(`Searching for category ${id}`);
    const category = await this.knex<ICategory>('categories')
      .where({ id })
      .first();
    if (!category) {
      throw new NotFoundException(`Category with id ${id} was not found`);
    }

    return category;
  }

  async createNew(categoryDto: NewCategoryDto): Promise<ICategory> {
    try {
      const [newCategoryId] = await this.knex<ICategory>('categories').insert({
        ...categoryDto,
      });

      return this.getOneById(newCategoryId);
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${categoryDto.name}" already exists`,
        );
      }
    }
  }

  getAll(): Promise<ICategory[]> {
    return this.knex<ICategory>('categories');
  }

  getOneById(id: number): Promise<ICategory> {
    return this.find(id);
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.knex('categories').where({ id }).delete();

    this.logger.log(`Removing category ${id}`);
    return { id, removed };
  }
}
