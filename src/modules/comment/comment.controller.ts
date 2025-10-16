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
import { CreateCommentDto } from './Dto/create-comment.dto';
import { UpdateCommentDto } from './Dto/update-comment.dto';
import { ListCommentsQueryDto } from './Dto/list-comments.query'; // <— naujas import
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Sukurti pastabą prie užduoties' })
  @ApiCreatedResponse({ type: Comment })
  create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Gauti pastabas (pasirenkamas taskId filtras)' })
  @ApiOkResponse({ type: [Comment] })
  list(@Query() q: ListCommentsQueryDto) {
    // <— vienas DTO
    return this.service.list({ page: q.page, limit: q.limit }, q.taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gauti vieną pastabą pagal ID' })
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse()
  getOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atnaujinti pastabą' })
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse()
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ištrinti pastabą' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
  }
}
