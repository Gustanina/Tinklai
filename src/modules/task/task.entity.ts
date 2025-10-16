// src/tasks/task.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Projects } from '../project/project.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ length: 255 })
  @ApiProperty({ example: 'Prepare lab demo' })
  title!: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @ManyToOne(() => Projects, { nullable: false, onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Projects })
  project!: Projects;

  @CreateDateColumn() @ApiProperty() createdAt!: Date;
  @UpdateDateColumn() @ApiProperty() updatedAt!: Date;
}
