import { AllErrorsFilter } from './all-errors.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

describe.only('AllErrorsFilter', () => {
  let errorsFilter: AllErrorsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: {} }, AllErrorsFilter],
    }).compile();

    errorsFilter = module.get(AllErrorsFilter);
  });
  it('should be defined', () => {
    expect(errorsFilter).toBeDefined();
  });
});
