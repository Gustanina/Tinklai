import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiOkResponse({ type: [User] })
  @ApiForbiddenResponse({ description: 'Only ADMIN can access this endpoint' })
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get('me')
  @Roles(UserRole.GUEST, UserRole.MEMBER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: User })
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    const fullUser = await this.userService.findById(user.userId);
    if (!fullUser) {
      throw new NotFoundException('User not found');
    }
    // Remove password from response
    const { password, ...userWithoutPassword } = fullUser;
    return userWithoutPassword;
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can change user roles' })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const user = await this.userService.updateRole(Number(id), dto.role);
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can delete users' })
  async delete(@Param('id') id: string) {
    await this.userService.delete(Number(id));
  }
}

