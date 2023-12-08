import { Logger, Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile';
import { Model } from 'objection';
import * as process from 'process';

const logger = new Logger('DbConnection');
const env = process.env.NODE_ENV || 'development';

@Module({
  providers: [
    {
      provide: 'DbConnection',
      useFactory: async (): Promise<knex.Knex> => {
        const connection = knex(knexConfig[env]);

        logger.log('Knex connected');
        Model.knex(connection);

        return connection;
      },
    },
  ],
})
export class DatabaseModule {}
