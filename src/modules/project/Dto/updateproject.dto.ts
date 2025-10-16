import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Reader Backend (updated)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
