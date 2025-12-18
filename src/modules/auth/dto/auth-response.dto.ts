import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/user.entity';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken!: string;

  @ApiProperty()
  user!: {
    id: number;
    email: string;
    username: string;
    role: UserRole;
  };
}

