import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Atnaujinta pastaba.' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
