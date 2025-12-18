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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './Dto/createproject.dto';
import { UpdateProjectDto } from './Dto/updateproject.dto';
import { ListProjectsQueryDto } from './Dto/list-project.query';
import { Projects } from './project.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@ApiTags('projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  // 1) Create - requires MEMBER or ADMIN
  @Post()
  @Roles(UserRole.MEMBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ type: Projects })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  // 2) List (pagination) - accessible to all authenticated users
  @Get()
  @Roles(UserRole.GUEST, UserRole.MEMBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'List projects' })
  @ApiOkResponse()
  list(@Query() q: ListProjectsQueryDto) {
    return this.service.list(q);
  }

  // 3) Get one - accessible to all authenticated users
  @Get(':id')
  @Roles(UserRole.GUEST, UserRole.MEMBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get project by id' })
  @ApiOkResponse({ type: Projects })
  @ApiNotFoundResponse()
  getOne(@Param('id') id: string) {
    return this.service.getOne(Number(id));
  }

  // 4) Patch (update title) - requires MEMBER or ADMIN
  @Patch(':id')
  @Roles(UserRole.MEMBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update project' })
  @ApiOkResponse({ type: Projects })
  @ApiNotFoundResponse()
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(Number(id), dto);
  }

  // 5) Delete (204) - requires ADMIN only
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete project' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.service.delete(Number(id));
  }
}
