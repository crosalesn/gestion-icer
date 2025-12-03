import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
      throw new Error('User already exists'); // Should use a DomainException
    }

    const passwordHash = await bcrypt.hash(command.password, 12);
    const id = uuidv4();

    const user = User.create(
      id,
      command.name,
      command.email,
      passwordHash,
      command.role,
    );

    await this.userRepository.save(user);
    return user;
  }
}

