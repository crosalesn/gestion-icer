import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClientUseCase } from '../../application/use-cases/create-client.use-case';
import { FindAllClientsUseCase } from '../../application/use-cases/find-all-clients.use-case';
import { FindClientByIdUseCase } from '../../application/use-cases/find-client-by-id.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../../application/use-cases/delete-client.use-case';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { DeleteClientCommand } from '../../application/commands/delete-client.command';
import { ClientResponseDto } from '../dto/client-response.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findAllClientsUseCase: FindAllClientsUseCase,
    private readonly findClientByIdUseCase: FindClientByIdUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientDto): Promise<ClientResponseDto> {
    const result = await this.createClientUseCase.execute(dto.toCommand());
    return ClientResponseDto.fromDomain(result);
  }

  @Get()
  async findAll(): Promise<ClientResponseDto[]> {
    const result = await this.findAllClientsUseCase.execute();
    return result.map((c) => ClientResponseDto.fromDomain(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    const result = await this.findClientByIdUseCase.execute(id);
    return ClientResponseDto.fromDomain(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const result = await this.updateClientUseCase.execute(dto.toCommand(id));
    return ClientResponseDto.fromDomain(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const command = new DeleteClientCommand(id);
    await this.deleteClientUseCase.execute(command);
  }
}

