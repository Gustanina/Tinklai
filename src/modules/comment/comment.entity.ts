import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../task/task.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ type: 'text' })
  @ApiProperty({ example: 'Ši užduotis atrodo gerai.' })
  content!: string;

  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Task })
  task!: Task;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
