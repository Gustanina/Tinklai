// src/tasks/dto/create-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Prepare lab demo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: 1, description: 'Project ID' })
  @IsInt()
  @Min(1)
  projectId!: number;
}
