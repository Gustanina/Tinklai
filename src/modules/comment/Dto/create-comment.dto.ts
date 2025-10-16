import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Puiku, galima merginti.' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 1, description: 'Task ID' })
  @IsInt()
  @Min(1)
  taskId!: number;
}
