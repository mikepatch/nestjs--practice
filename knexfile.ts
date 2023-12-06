import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './src/database/town-store-db.sqlite3',
    },
    migrations: {
      tableName: 'migrations',
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
};

export default knexConfig;
