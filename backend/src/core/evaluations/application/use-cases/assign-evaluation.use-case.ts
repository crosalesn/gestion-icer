import { Injectable, Inject, Logger } from '@nestjs/common';
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

  async execute(
    command: AssignEvaluationCommand,
  ): Promise<EvaluationAssignment[]> {
    this.logger.log(
      `Assigning evaluation for collaborator ${command.collaboratorId}, milestone ${command.milestone}`,
    );

    const collaborator = await this.collaboratorRepository.findById(
      command.collaboratorId,
    );
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    // Determine required roles based on milestone
    const requiredRoles = this.getRequiredRolesForMilestone(command.milestone);

    // Fetch existing assignments
    const existingAssignments =
      await this.assignmentRepository.findByCollaboratorAndMilestone(
        command.collaboratorId,
        command.milestone,
      );

    const newAssignments: EvaluationAssignment[] = [];
    const allAssignments = [...existingAssignments];

    for (const role of requiredRoles) {
      // Find active template for this milestone and role
      const template =
        await this.templateRepository.findActiveByMilestoneAndRole(
          command.milestone,
          role,
        );

      if (!template) {
        this.logger.error(
          `No active template found for milestone ${command.milestone} and role ${role}. This role will be skipped, which may cause incomplete evaluation cycles.`,
        );
        continue;
      }

      // Check if assignment already exists for this template
      const alreadyAssigned = existingAssignments.some(
        (a) => a.templateId === template.id,
      );

      if (alreadyAssigned) {
        this.logger.debug(
          `Evaluation for milestone ${command.milestone} and role ${role} already assigned`,
        );
        continue;
      }

      // Create new assignment
      const dueDate = this.calculateDueDate(
        command.milestone,
        collaborator.admissionDate,
      );

      const assignment = EvaluationAssignment.create(
        command.collaboratorId,
        template.id!,
        command.milestone,
        dueDate,
        null, // No specific evaluator - any user can complete this (or role based)
      );

      const savedAssignment = await this.assignmentRepository.save(assignment);
      newAssignments.push(savedAssignment);
      allAssignments.push(savedAssignment);
    }

    this.logger.log(
      `Created ${newAssignments.length} new assignment(s) for milestone ${command.milestone}. Total: ${allAssignments.length}`,
    );
    return allAssignments;
  }

  private getRequiredRolesForMilestone(
    milestone: EvaluationMilestone,
  ): TargetRole[] {
    switch (milestone) {
      case EvaluationMilestone.DAY_1:
        return [TargetRole.COLLABORATOR];
      case EvaluationMilestone.WEEK_1:
      case EvaluationMilestone.MONTH_1:
        return [TargetRole.COLLABORATOR, TargetRole.TEAM_LEADER];
      default:
        return [];
    }
  }

  private calculateDueDate(
    milestone: EvaluationMilestone,
    admissionDate: Date,
  ): Date {
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
