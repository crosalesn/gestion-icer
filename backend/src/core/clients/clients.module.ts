import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './presentation/controllers/client.controller';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { FindAllClientsUseCase } from './application/use-cases/find-all-clients.use-case';
import { FindClientByIdUseCase } from './application/use-cases/find-client-by-id.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';
import { PostgresClientRepository } from './infrastructure/persistence/client.repository';
import { ClientOrmEntity } from './infrastructure/persistence/client.orm-entity';
import { IClientRepository } from './domain/repositories/client.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientController],
  providers: [
    CreateClientUseCase,
    FindAllClientsUseCase,
    FindClientByIdUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    {
      provide: IClientRepository,
      useClass: PostgresClientRepository,
    },
  ],
  exports: [IClientRepository], // Export if other modules need it
})
export class ClientsModule {}
