import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Task } from '../task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Task])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
