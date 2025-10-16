import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task/task.entity';

@Entity('projects')
export class Projects {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ length: 255 })
  @ApiProperty({ example: 'Reader Backend' })
  title!: string;

  @OneToMany(() => Task, (t) => t.project)
  tasks!: Task[];
}
