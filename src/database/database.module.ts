import { Global, Logger, Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile';

const logger = new Logger('DbConnection');

const knexProvider = {
  provide: 'DbConnection',
  useFactory: async (): Promise<knex.Knex> => {
    const connection = knex(knexConfig['development']);

    logger.log('Knex connected');
    // logger.debug(knexConfig['development']);
    return connection;
  },
};

@Module({
  providers: [knexProvider],
  exports: [knexProvider],
})
@Global() // Make provider public for every part of project
export class DatabaseModule {}
