import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Projects } from 'src/modules/project/project.entity';
import { Task } from 'src/modules/task/task.entity';
import { Comment } from 'src/modules/comment/comment.entity';

// Load .env if not running in NestJS context
config();

const entities = [Projects, Task, Comment];

export const createTypeOrmOptions = (
  configService?: ConfigService,
): DataSourceOptions => {
  const isDev =
    (configService?.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'dev';
  const isProd =
    (configService?.get<string>('NODE_ENV') ?? process.env.NODE_ENV) ===
    'production';

  // Support DATABASE_URL (used by Railway, Render, Heroku, etc.)
  const databaseUrl =
    configService?.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;

  // If DATABASE_URL is provided, parse it (Railway provides this)
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port, 10) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      ssl: isProd
        ? {
            rejectUnauthorized: false,
          }
        : false,
      entities,
      migrations: [],
      synchronize: isDev, // false in production, but Railway can use true for simplicity
      logging: isDev,
    };
  }

  // Otherwise use individual environment variables (for local development)
  return {
    type: 'postgres',
    host:
      configService?.get<string>('POSTGRES_HOST') ?? process.env.POSTGRES_HOST,
    port: Number(
      configService?.get<number>('POSTGRES_PORT') ?? process.env.POSTGRES_PORT,
    ),
    username:
      configService?.get<string>('POSTGRES_USER') ?? process.env.POSTGRES_USER,
    password:
      configService?.get<string>('POSTGRES_PASSWORD') ??
      process.env.POSTGRES_PASSWORD,
    database:
      configService?.get<string>('POSTGRES_DB') ?? process.env.POSTGRES_DB,
    ssl: false,
    entities,
    migrations: [],
    synchronize: isDev,
    logging: isDev,
  };
};

// Create a DataSource instance for CLI & scripts
export const AppDataSource = new DataSource(createTypeOrmOptions());
