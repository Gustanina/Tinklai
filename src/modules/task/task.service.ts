// src/tasks/task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from '../project/project.entity';
import { PaginationDto } from './Dto/pagination.dto';
import { CreateTaskDto } from './Dto/create-task.dto';
import { Task, TaskStatus } from './task.entity';
import { UpdateTaskDto } from './Dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Projects) private projRepo: Repository<Projects>,
  ) {}

  async create(dto: CreateTaskDto) {
    const project = await this.projRepo.findOne({
      where: { id: dto.projectId },
    });
    if (!project)
      throw new NotFoundException(`Project ${dto.projectId} not found`);
    const task = this.taskRepo.create({
      title: dto.title,
      status: dto.status ?? TaskStatus.TODO,
      project,
    });
    return this.taskRepo.save(task);
  }

  async list(p: PaginationDto, projectId?: number) {
    const page = Number(p.page ?? 1);
    const limit = Number(p.limit ?? 10);

    const [data, total] = await this.taskRepo.findAndCount({
      where: projectId ? { project: { id: projectId } } : {},
      relations: { project: true },
      order: { id: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, meta: { total, page, limit } };
  }

  async setStatus(id: number, status: TaskStatus) {
    const t = await this.taskRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Task ${id} not found`);
    t.status = status;
    return this.taskRepo.save(t);
  }

  // NEW: get one by id
  async findOne(id: number) {
    const t = await this.taskRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!t) throw new NotFoundException(`Task ${id} not found`);
    return t;
  }

  // NEW: delete (hard delete; switch to softDelete if you add DeleteDateColumn)
  async delete(id: number) {
    const res = await this.taskRepo.delete(id);
    if (!res.affected) throw new NotFoundException(`Task ${id} not found`);
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);

    if (dto.title !== undefined) {
      task.title = dto.title.trim();
    }
    if (dto.status !== undefined) {
      task.status = dto.status;
    }
    if (dto.projectId !== undefined && dto.projectId !== task.project.id) {
      const project = await this.projRepo.findOne({
        where: { id: dto.projectId },
      });
      if (!project)
        throw new NotFoundException(`Project ${dto.projectId} not found`);
      task.project = project;
    }

    return this.taskRepo.save(task);
  }
}
