import { PartialType } from '@nestjs/swagger';
import { CreateFollowUpPlanTemplateDto } from './create-follow-up-plan-template.dto';

export class UpdateFollowUpPlanTemplateDto extends PartialType(CreateFollowUpPlanTemplateDto) {}

