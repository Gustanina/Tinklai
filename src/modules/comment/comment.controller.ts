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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from './Dto/create-comment.dto';
import { UpdateCommentDto } from './Dto/update-comment.dto';
import { ListCommentsQueryDto } from './Dto/list-comments.query';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment for a task' })
  @ApiCreatedResponse({
    description: 'Comment created successfully.',
    type: Comment,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List comments (optional taskId filter)',
    description:
      'Returns a paginated list of comments. Provide taskId to filter comments belonging to a specific task.',
  })
  @ApiOkResponse({
    description: 'Comments returned successfully.',
    // Note: if your service returns { data, meta }, this type is indicative.
    // Keep as [Comment] for simplicity in Swagger, or introduce a wrapper DTO.
    type: [Comment],
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  list(@Query() q: ListCommentsQueryDto) {
    return this.service.list({ page: q.page, limit: q.limit }, q.taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiOkResponse({ description: 'Comment found.', type: Comment })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  getOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiOkResponse({
    description: 'Comment updated successfully.',
    type: Comment,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Comment deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
  }
}
