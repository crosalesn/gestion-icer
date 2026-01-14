import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserCommand } from '../commands/create-user.command';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(command.password, 12);

    const user = User.create(
      command.name,
      command.email,
      passwordHash,
      command.role,
    );

    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
