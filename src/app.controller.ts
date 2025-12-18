import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ description: 'API is running' })
  getHello() {
    return {
      message: 'Reader Backend API is running',
      version: '1.0',
      endpoints: {
        auth: '/auth/register, /auth/login, /auth/refresh',
        projects: '/projects',
        tasks: '/tasks',
        comments: '/comments',
        docs: '/api',
      },
    };
  }
}
