import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Projects } from 'src/modules/project/project.entity';
import { Task } from 'src/modules/task/task.entity';
import { Comment } from 'src/modules/comment/comment.entity';
import { User } from 'src/modules/user/user.entity';

// Load .env if not running in NestJS context
config();

const entities = [Projects, Task, Comment, User];

export const createTypeOrmOptions = (
  configService?: ConfigService,
): DataSourceOptions => {
  const isDev =
    (configService?.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'dev';
  
  // Support DATABASE_URL (Railway, Heroku style)
  const databaseUrl = configService?.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse DATABASE_URL: postgres://user:password@host:port/database
    const url = new URL(databaseUrl);
    return {
      type: 'postgres',
      host: url.hostname,
      port: Number(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      ssl: { rejectUnauthorized: false }, // Required for Railway/Heroku
      entities,
      migrations: [],
      synchronize: isDev,
      logging: isDev,
    };
  }
  
  // Fallback to individual environment variables
  // Support both POSTGRES_* and PG* (Railway default) naming
  const host =
    configService?.get<string>('POSTGRES_HOST') ??
    process.env.POSTGRES_HOST ??
    configService?.get<string>('PGHOST') ??
    process.env.PGHOST;
  
  const port = Number(
    configService?.get<number>('POSTGRES_PORT') ??
    process.env.POSTGRES_PORT ??
    configService?.get<number>('PGPORT') ??
    process.env.PGPORT ??
    5432,
  );
  
  const username =
    configService?.get<string>('POSTGRES_USER') ??
    process.env.POSTGRES_USER ??
    configService?.get<string>('PGUSER') ??
    process.env.PGUSER;
  
  const password =
    configService?.get<string>('POSTGRES_PASSWORD') ??
    process.env.POSTGRES_PASSWORD ??
    configService?.get<string>('PGPASSWORD') ??
    process.env.PGPASSWORD;
  
  const database =
    configService?.get<string>('POSTGRES_DB') ??
    process.env.POSTGRES_DB ??
    configService?.get<string>('PGDATABASE') ??
    process.env.PGDATABASE;

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    ssl: isDev ? false : { rejectUnauthorized: false },
    entities,
    migrations: [],
    synchronize: isDev,
    logging: isDev,
  };
};

// Create a DataSource instance for CLI & scripts
export const AppDataSource = new DataSource(createTypeOrmOptions());
