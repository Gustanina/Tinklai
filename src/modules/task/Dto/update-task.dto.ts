// src/tasks/Dto/update-task.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Prepare final lab demo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 2, description: 'Move task to project ID' })
  @IsOptional()
  @IsInt()
  @Min(1)
  projectId?: number;
}
