import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Role } from '../../../common/enums/role.enum';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: { name: string; email: string; password: string; role: Role }) {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findPublicById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toPublic(user);
  }

  toPublic(user: User) {
    // Remove sensitive fields from API responses.
    const { password, ...rest } = user;
    void password;
    return rest;
  }
}
