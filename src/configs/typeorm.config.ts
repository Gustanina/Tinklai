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
  console.log(
    'password',
    configService?.get<string>('POSTGRES_PASSWORD') ??
      process.env.POSTGRES_PASSWORD,
  );
  console.log(
    'user',
    configService?.get<string>('POSTGRES_USER') ?? process.env.POSTGRES_USER,
  );
  console.log(
    'host',
    configService?.get<string>('POSTGRES_HOST') ?? process.env.POSTGRES_HOST,
  );
  console.log(
    'port',
    configService?.get<number>('POSTGRES_PORT') ?? process.env.POSTGRES_PORT,
  );
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
    migrations: [], // isDev ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'], // something is bugging out here not sure how to fix
    synchronize: isDev,
    logging: isDev,
  };
};

// Create a DataSource instance for CLI & scripts
export const AppDataSource = new DataSource(createTypeOrmOptions());
