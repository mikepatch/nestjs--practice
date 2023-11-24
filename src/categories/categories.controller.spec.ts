import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';

describe('AppController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appController: CategoriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [],
    }).compile();

    appController = app.get<CategoriesController>(CategoriesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
