import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFollowUpPlanTemplateUseCase } from '../../application/use-cases/create-follow-up-plan-template.use-case';
import { GetAllFollowUpPlanTemplatesUseCase } from '../../application/use-cases/get-all-follow-up-plan-templates.use-case';
import { UpdateFollowUpPlanTemplateUseCase } from '../../application/use-cases/update-follow-up-plan-template.use-case';
import { DeleteFollowUpPlanTemplateUseCase } from '../../application/use-cases/delete-follow-up-plan-template.use-case';
import { CreateFollowUpPlanTemplateDto } from '../../application/dto/create-follow-up-plan-template.dto';
import { UpdateFollowUpPlanTemplateDto } from '../../application/dto/update-follow-up-plan-template.dto';
// Assuming we want to protect these routes, import JwtAuthGuard
// import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Follow-Up Plans')
@Controller('follow-up-plans/templates')
// @UseGuards(JwtAuthGuard) // Uncomment when ready to protect
export class FollowUpPlanTemplateController {
  constructor(
    private readonly createUseCase: CreateFollowUpPlanTemplateUseCase,
    private readonly getAllUseCase: GetAllFollowUpPlanTemplatesUseCase,
    private readonly updateUseCase: UpdateFollowUpPlanTemplateUseCase,
    private readonly deleteUseCase: DeleteFollowUpPlanTemplateUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateFollowUpPlanTemplateDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getAllUseCase.execute();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFollowUpPlanTemplateDto) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}

