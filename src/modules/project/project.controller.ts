import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './Dto/createproject.dto';
import { UpdateProjectDto } from './Dto/updateproject.dto';
import { ListProjectsQueryDto } from './Dto/list-project.query';
import { Projects } from './project.entity';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  // 1) Create
  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ type: Projects })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  // 2) List (pagination)
  @Get()
  @ApiOperation({ summary: 'List projects' })
  @ApiOkResponse()
  list(@Query() q: ListProjectsQueryDto) {
    return this.service.list(q);
  }

  // 3) Get one
  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiOkResponse({ type: Projects })
  @ApiNotFoundResponse()
  getOne(@Param('id') id: string) {
    return this.service.getOne(Number(id));
  }

  // 4) Patch (update title)
  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiOkResponse({ type: Projects })
  @ApiNotFoundResponse()
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(Number(id), dto);
  }

  // 5) Delete (204)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.service.delete(Number(id));
  }
}
