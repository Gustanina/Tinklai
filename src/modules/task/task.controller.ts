// src/task/task.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './Dto/create-task.dto';
import { UpdateStatusDto } from './Dto/update-status.dto';
import { ListTasksQueryDto } from './Dto/list-tasks.query';
import { Task } from './task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create task (attach to project)' })
  @ApiCreatedResponse({ type: Task })
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks (pagination + optional projectId)' })
  @ApiOkResponse()
  list(@Query() q: ListTasksQueryDto) {
    return this.service.list({ page: q.page, limit: q.limit }, q.projectId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: Task })
  setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.setStatus(Number(id), dto.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiOkResponse({ type: Task })
  @ApiNotFoundResponse()
  getOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.service.delete(Number(id));
  }
}
