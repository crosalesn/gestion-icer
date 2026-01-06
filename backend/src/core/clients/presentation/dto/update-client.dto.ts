import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateClientCommand } from '../../application/commands/update-client.command';

export class UpdateClientDto {
  @ApiProperty({ description: 'Client name/description' })
  @IsString()
  @IsNotEmpty()
  name: string;

  toCommand(id: string): UpdateClientCommand {
    return new UpdateClientCommand(id, this.name);
  }
}

