import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { CommentModule } from './modules/comment/comment.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Database - either DATABASE_URL or individual variables
        // Support both POSTGRES_* and PG* (Railway default) naming
        DATABASE_URL: Joi.string().optional(),
        // POSTGRES_* variables
        POSTGRES_USER: Joi.string().optional(),
        POSTGRES_PASSWORD: Joi.string().optional(),
        POSTGRES_HOST: Joi.string().optional(),
        POSTGRES_PORT: Joi.number().optional(),
        POSTGRES_DB: Joi.string().optional(),
        // PG* variables (Railway default)
        PGUSER: Joi.string().optional(),
        PGPASSWORD: Joi.string().optional(),
        PGHOST: Joi.string().optional(),
        PGPORT: Joi.number().optional(),
        PGDATABASE: Joi.string().optional(),
        // At least one set of database variables must be provided
      }).or('DATABASE_URL', 'POSTGRES_HOST', 'PGHOST'),
        NODE_ENV: Joi.string().default('dev'),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
      }),
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProjectModule,
    TaskModule,
    CommentModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
