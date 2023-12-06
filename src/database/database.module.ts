import { Global, Logger, Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile';
import { Model } from 'objection';
import * as process from 'process';

const logger = new Logger('DbConnection');

const knexProvider = {
  provide: 'DbConnection',
  useFactory: async (): Promise<knex.Knex> => {
    const env = process.env.NODE_ENV || 'development';
    const connection = knex(knexConfig[env]);

    logger.log(`Knex connected on environment: ${env}`);
    // logger.debug(knexConfig['development']);
    Model.knex(connection);
    return connection;
  },
};

@Module({
  providers: [knexProvider],
  exports: [knexProvider],
})
@Global() // Make provider public for every part of project
export class DatabaseModule {}
