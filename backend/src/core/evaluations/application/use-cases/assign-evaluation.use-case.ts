import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AssignEvaluationCommand } from '../commands/assign-evaluation.command';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';

@Injectable()
export class AssignEvaluationUseCase {
  private readonly logger = new Logger(AssignEvaluationUseCase.name);

  constructor(
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(command: AssignEvaluationCommand): Promise<EvaluationAssignment[]> {
    this.logger.log(
      `Assigning evaluation for collaborator ${command.collaboratorId}, milestone ${command.milestone}`,
    );

    const collaborator = await this.collaboratorRepository.findById(
      command.collaboratorId,
    );
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    // Check if assignment already exists for this milestone
    const existingAssignments = await this.assignmentRepository.findByCollaboratorAndMilestone(
      command.collaboratorId,
      command.milestone,
    );

    if (existingAssignments.length > 0) {
      this.logger.warn(
        `Evaluation for milestone ${command.milestone} already assigned to collaborator ${command.collaboratorId}`,
      );
      return existingAssignments;
    }

    const assignments: EvaluationAssignment[] = [];

    // SIMPLIFIED SYSTEM: Always create only ONE evaluation per milestone
    // Try to get COLLABORATOR template first, fallback to any template for this milestone
    let template = await this.templateRepository.findActiveByMilestoneAndRole(
      command.milestone,
      TargetRole.COLLABORATOR,
    );

    // If no COLLABORATOR template, try to get any active template for this milestone
    if (!template) {
      const allTemplates = await this.templateRepository.findAll();
      template = allTemplates.find(
        (t) => t.milestone === command.milestone && t.isActive,
      ) || null;
    }

    if (!template) {
      throw new Error(`No active template found for milestone ${command.milestone}`);
    }

    // SIMPLIFIED SYSTEM: No evaluator assignment - any user can complete any evaluation
    const dueDate = this.calculateDueDate(command.milestone, collaborator.admissionDate);

    const assignment = EvaluationAssignment.create(
      uuidv4(),
      collaborator.id,
      template.id,
      command.milestone,
      dueDate,
      null, // No specific evaluator - any user can complete this
    );

    await this.assignmentRepository.save(assignment);
    assignments.push(assignment);

    this.logger.log(`Created ${assignments.length} assignment(s) for milestone ${command.milestone}`);
    return assignments;
  }

  private calculateDueDate(milestone: EvaluationMilestone, admissionDate: Date): Date {
    const dueDate = new Date(admissionDate);
    switch (milestone) {
      case EvaluationMilestone.DAY_1:
        dueDate.setDate(dueDate.getDate() + 1);
        break;
      case EvaluationMilestone.WEEK_1:
        dueDate.setDate(dueDate.getDate() + 7);
        break;
      case EvaluationMilestone.MONTH_1:
        dueDate.setMonth(dueDate.getMonth() + 1);
        break;
    }
    return dueDate;
  }
}

