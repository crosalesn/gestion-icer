import { Controller, Post } from '@nestjs/common';
import { SeedTemplatesUseCase } from '../../application/use-cases/seed-templates.use-case';
import { TemplateResponseDto } from '../dto/template-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedTemplatesUseCase: SeedTemplatesUseCase) {}

  @Post('templates')
  @ApiOperation({
    summary: 'Inicializar templates ICER (PÚBLICO - Solo desarrollo)',
  })
  @ApiResponse({
    status: 201,
    description: 'Templates inicializados exitosamente',
  })
  async seedTemplates() {
    const result = await this.seedTemplatesUseCase.execute();
    return {
      message: `Seed completado: ${result.created} templates creados, ${result.skipped} omitidos`,
      created: result.created,
      skipped: result.skipped,
      templates: result.templates.map((t) => TemplateResponseDto.fromDomain(t)),
    };
  }
}
