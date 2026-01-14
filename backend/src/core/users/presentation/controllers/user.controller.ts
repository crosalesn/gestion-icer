import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { UserRole } from '../../domain/value-objects/user-role.enum';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const users = await this.findAllUsersUseCase.execute();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const command = createUserDto.toCommand();
    const user = await this.createUserUseCase.execute(command);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard)
  async createTestUser() {
    try {
      const command = new CreateUserCommand(
        'Usuario Pruebas',
        'test@icer.com',
        'password123',
        UserRole.COLLABORATOR,
      );
      const user = await this.createUserUseCase.execute(command);
      return {
        message: 'Usuario de prueba creado exitosamente',
        credentials: {
          email: 'test@icer.com',
          password: 'password123',
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        message: 'Error al crear usuario de prueba (posiblemente ya existe)',
        error: errorMessage,
        credentials: {
          email: 'test@icer.com',
          password: 'password123',
        },
      };
    }
  }
}
