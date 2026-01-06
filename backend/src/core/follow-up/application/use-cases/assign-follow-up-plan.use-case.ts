import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';
import { AssignFollowUpPlanCommand } from '../commands/assign-follow-up-plan.command';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import type { IActionPlanRepository } from '../../../action-plans/domain/repositories/action-plan.repository.interface'; // Reusing action plans for now or create separate?
import { ActionPlan } from '../../../action-plans/domain/entities/action-plan.entity';
import { ActionPlanType } from '../../../action-plans/domain/value-objects/action-plan-type.enum';

@Injectable()
export class AssignFollowUpPlanUseCase {
  private readonly logger = new Logger(AssignFollowUpPlanUseCase.name);

  constructor(
    @Inject('IFollowUpPlanTemplateRepository')
    private readonly templateRepository: IFollowUpPlanTemplateRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    // We are reusing the ActionPlans module to store the assigned plan as an Action Plan
    // Alternatively we could create a dedicated 'FollowUpPlanAssignment' entity
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(command: AssignFollowUpPlanCommand): Promise<void> {
    const { collaboratorId, riskLevel } = command;

    this.logger.log(`Assigning follow-up plan for collaborator ${collaboratorId} with risk ${riskLevel}`);

    // 1. Update Collaborator Risk Level
    const collaborator = await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new Error(`Collaborator ${collaboratorId} not found`);
    }
    collaborator.updateRiskLevel(riskLevel);
    await this.collaboratorRepository.save(collaborator); // Changed from update to save

    // 2. Find matching template
    const template = await this.templateRepository.findByRiskLevel(riskLevel);
    if (!template) {
      // IMPORTANT: According to requirements, if no template is found, we should probably warn 
      // but NOT crash the process. It's possible some risk levels (e.g. NONE) don't have plans.
      // However, if it's HIGH/MEDIUM/LOW, it's likely a configuration error.
      this.logger.warn(`No follow-up plan template configured for risk level ${riskLevel}. No plan assigned.`);
      return;
    }

    // Map template code to ActionPlanType (Temporary mapping until we fully migrate ActionPlans to be dynamic)
    // Defaulting to PD_30 if unknown, but ideally we should match codes
    let planType = ActionPlanType.PD_30;
    if (template.code === 'PD-30') planType = ActionPlanType.PD_30;
    if (template.code === 'PDF-30') planType = ActionPlanType.PDF_30;
    if (template.code === 'SE-60') planType = ActionPlanType.SE_60;


    // 3. Create Action Plan (Follow Up)
    // We adapt the FollowUpTemplate to an ActionPlan entity
    const actionPlan = ActionPlan.create(
      uuidv4(),
      collaboratorId,
      planType,
      template.description || `Plan asignado automáticamente por riesgo ${riskLevel}`,
      [], // Goals start empty for now
      new Date(Date.now() + template.durationDays * 24 * 60 * 60 * 1000), // Due Date
    );

    // TODO: Create the specific meetings based on frequency (Future enhancement)
    // For now we just create the main plan container

    await this.actionPlanRepository.save(actionPlan);
    this.logger.log(`Created Action Plan ${actionPlan.id} based on template ${template.code}`);
  }
}

