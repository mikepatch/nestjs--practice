import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error', 'fatal')
    .default('info'),
});
