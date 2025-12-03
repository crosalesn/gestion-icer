import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';
import { SubmitEvaluationCommand } from '../commands/submit-evaluation.command';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';
import { EvaluationType } from '../../domain/value-objects/evaluation-type.enum';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';

@Injectable()
export class SubmitEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(command: SubmitEvaluationCommand): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findById(
      command.evaluationId,
    );

    if (!evaluation) {
      throw new NotFoundException(
        `Evaluation with ID ${command.evaluationId} not found`,
      );
    }

    if (evaluation.status === EvaluationStatus.COMPLETED) {
      throw new Error('Evaluation is already completed');
    }

    // 1. Calculate Score based on answers
    // Requirement: Answers are 1-4.
    // We assume answers are provided as "questionId": score (number) for quantitative questions.
    // Qualitative answers (strings) are ignored for score calculation.

    const scores: number[] = Object.values(command.answers)
      .filter((val) => typeof val === 'number')
      .map((val) => val as number);

    if (scores.length === 0) {
      throw new Error('No numeric scores provided for calculation');
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const averageScore = sum / scores.length;
    // Round to 1 decimal place
    const finalScore = Math.round(averageScore * 10) / 10;

    // 2. Update Evaluation
    evaluation.complete(command.answers, finalScore);
    await this.evaluationRepository.save(evaluation);

    // 3. Update Collaborator Risk Level
    await this.updateCollaboratorRisk(evaluation);

    return evaluation;
  }

  private async updateCollaboratorRisk(evaluation: Evaluation): Promise<void> {
    const collaborator = await this.collaboratorRepository.findById(
      evaluation.collaboratorId,
    );
    if (!collaborator) return;

    let finalScore: number | null = null;

    if (evaluation.type === EvaluationType.DAY_1) {
      finalScore = evaluation.score;
    } else {
      // Logic for Week 1 and Month 1 (Weighted Scores)
      const isWeek1 =
        evaluation.type === EvaluationType.WEEK_1_COLLABORATOR ||
        evaluation.type === EvaluationType.WEEK_1_LEADER;
      const isMonth1 =
        evaluation.type === EvaluationType.MONTH_1_COLLABORATOR ||
        evaluation.type === EvaluationType.MONTH_1_LEADER;

      if (isWeek1 || isMonth1) {
        const otherType = this.getCounterpartType(evaluation.type);
        if (!otherType) return;

        const otherEvaluation =
          await this.evaluationRepository.findByCollaboratorAndType(
            evaluation.collaboratorId,
            otherType,
          );

        if (
          otherEvaluation &&
          otherEvaluation.status === EvaluationStatus.COMPLETED &&
          otherEvaluation.score !== null &&
          evaluation.score !== null
        ) {
          // Calculate weighted score
          let colScore = 0;
          let tlScore = 0;

          if (
            evaluation.type === EvaluationType.WEEK_1_COLLABORATOR ||
            evaluation.type === EvaluationType.MONTH_1_COLLABORATOR
          ) {
            colScore = evaluation.score;
            tlScore = otherEvaluation.score;
          } else {
            colScore = otherEvaluation.score;
            tlScore = evaluation.score;
          }

          if (isWeek1) {
            // Week 1: Col 60%, TL 40%
            finalScore = colScore * 0.6 + tlScore * 0.4;
          } else {
            // Month 1: Col 40%, TL 60%
            finalScore = colScore * 0.4 + tlScore * 0.6;
          }
        } else {
          // Counterpart not ready, can't calculate consolidated risk yet.
          // Optionally, we could calculate a provisional risk, but business rules usually wait for both.
          // We return here to avoid updating risk with partial data.
          return; 
        }
      }
    }

    if (finalScore !== null) {
      // Round to 1 decimal place
      finalScore = Math.round(finalScore * 10) / 10;
      const riskLevel = this.calculateRiskFromScore(finalScore);
      collaborator.updateRiskLevel(riskLevel);
      await this.collaboratorRepository.save(collaborator);
    }
  }

  private getCounterpartType(type: EvaluationType): EvaluationType | null {
    switch (type) {
      case EvaluationType.WEEK_1_COLLABORATOR:
        return EvaluationType.WEEK_1_LEADER;
      case EvaluationType.WEEK_1_LEADER:
        return EvaluationType.WEEK_1_COLLABORATOR;
      case EvaluationType.MONTH_1_COLLABORATOR:
        return EvaluationType.MONTH_1_LEADER;
      case EvaluationType.MONTH_1_LEADER:
        return EvaluationType.MONTH_1_COLLABORATOR;
      default:
        return null;
    }
  }

  private calculateRiskFromScore(score: number): RiskLevel {
    if (score >= 1.0 && score <= 1.9) return RiskLevel.HIGH;
    if (score >= 2.0 && score <= 2.9) return RiskLevel.MEDIUM;
    if (score >= 3.0 && score <= 4.0) return RiskLevel.LOW;
    return RiskLevel.NONE;
  }
}

