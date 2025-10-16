import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Reader Backend' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;
}
