import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(
    email: string,
    username: string,
    password: string,
    role: UserRole = UserRole.GUEST,
  ): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt'],
      order: { id: 'ASC' },
    });
  }

  async getUserCount(): Promise<number> {
    return this.userRepo.count();
  }

  async updateRole(userId: number, newRole: UserRole): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.role = newRole;
    return this.userRepo.save(user);
  }

  async delete(userId: number): Promise<void> {
    const result = await this.userRepo.delete(userId);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}

