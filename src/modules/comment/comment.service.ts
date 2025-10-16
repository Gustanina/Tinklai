// src/comments/comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from './Dto/pagination.dto';
import { Task } from '../task/task.entity';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './Dto/create-comment.dto';
import { UpdateCommentDto } from './Dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateCommentDto) {
    const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException(`Task ${dto.taskId} not found`);

    const entity = this.repo.create({ content: dto.content, task });
    const saved = await this.repo.save(entity);

    // reload with nested relations so response includes task.project
    return this.repo.findOne({
      where: { id: saved.id },
      relations: { task: { project: true } },
    });
  }

  async list(p: PaginationDto, taskId?: number) {
    const page = Number(p.page ?? 1);
    const limit = Number(p.limit ?? 10);

    const [data, total] = await this.repo.findAndCount({
      where: taskId ? { task: { id: taskId } } : {},
      relations: { task: { project: true } }, // <- include project
      order: { id: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, meta: { total, page, limit } };
  }

  async findOne(id: number) {
    const comment = await this.repo.findOne({
      where: { id },
      relations: { task: { project: true } }, // <- include project
    });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);
    return comment;
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment ${id} not found`);

    if (dto.content !== undefined) comment.content = dto.content;
    await this.repo.save(comment);

    // return updated with nested relations
    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Comment ${id} not found`);
  }
}
