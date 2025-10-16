import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './project.entity';
import { CreateProjectDto } from './Dto/createproject.dto';
import { UpdateProjectDto } from './Dto/updateproject.dto';
import { ListProjectsQueryDto } from './Dto/list-project.query';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(Projects) private repo: Repository<Projects>) {}

  create(dto: CreateProjectDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async list(q: ListProjectsQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 10);

    const [data, total] = await this.repo.findAndCount({
      order: { id: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, meta: { total, page, limit } };
  }

  async getOne(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Project ${id} not found`);
    return entity;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException(`Project ${id} not found`);
    this.repo.merge(existing, dto);
    return this.repo.save(existing);
  }

  async delete(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Project ${id} not found`);
  }
}
