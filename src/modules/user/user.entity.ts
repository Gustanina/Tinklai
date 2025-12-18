import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ unique: true, length: 255 })
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @Column({ length: 255 })
  @ApiProperty({ example: 'John Doe' })
  username!: string;

  @Column({ length: 255 })
  password!: string; // hashed

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  @ApiProperty({ enum: UserRole, default: UserRole.GUEST })
  role!: UserRole;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}

