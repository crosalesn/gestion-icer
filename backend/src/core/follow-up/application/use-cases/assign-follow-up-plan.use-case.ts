import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';
import { AssignFollowUpPlanCommand } from '../commands/assign-follow-up-plan.command';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import type { IActionPlanRepository } from '../../../action-plans/domain/repositories/action-plan.repository.interface';
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
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(command: AssignFollowUpPlanCommand): Promise<void> {
    const { collaboratorId, riskLevel } = command;

    this.logger.log(
      `Assigning follow-up plan for collaborator ${collaboratorId} with risk ${riskLevel}`,
    );

    // 1. Update Collaborator Risk Level
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new Error(`Collaborator ${collaboratorId} not found`);
    }
    collaborator.updateRiskLevel(riskLevel);
    await this.collaboratorRepository.save(collaborator);

    // 2. Find matching template
    const template = await this.templateRepository.findByRiskLevel(riskLevel);
    if (!template) {
      this.logger.warn(
        `No follow-up plan template configured for risk level ${riskLevel}. No plan assigned.`,
      );
      return;
    }

    // Map template code to ActionPlanType
    let planType = ActionPlanType.PD_30;
    if (template.code === 'PD-30') planType = ActionPlanType.PD_30;
    if (template.code === 'PDF-30') planType = ActionPlanType.PDF_30;
    if (template.code === 'SE-60') planType = ActionPlanType.SE_60;

    // 3. Create Action Plan (Follow Up)
    const actionPlan = ActionPlan.create(
      collaboratorId,
      planType,
      template.description ||
        `Plan asignado automáticamente por riesgo ${riskLevel}`,
      [],
      new Date(Date.now() + template.durationDays * 24 * 60 * 60 * 1000),
    );

    const savedPlan = await this.actionPlanRepository.save(actionPlan);
    this.logger.log(
      `Created Action Plan ${savedPlan.id} based on template ${template.code}`,
    );
  }
}
