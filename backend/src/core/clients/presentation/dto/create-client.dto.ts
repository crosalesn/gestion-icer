import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClientCommand } from '../../application/commands/create-client.command';

export class CreateClientDto {
  @ApiProperty({ description: 'Client name/description' })
  @IsString()
  @IsNotEmpty()
  name: string;

  toCommand(): CreateClientCommand {
    return new CreateClientCommand(this.name);
  }
}
