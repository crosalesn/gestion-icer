import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { PostgresUserRepository } from './infrastructure/persistence/user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindAllUsersUseCase,
    {
      provide: 'IUserRepository',
      useClass: PostgresUserRepository,
    },
  ],
  exports: [
    'IUserRepository',
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
  ],
})
export class UsersModule {}

