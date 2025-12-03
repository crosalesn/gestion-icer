import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { Question } from '../../domain/entities/question.entity';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { CreateTemplateUseCase } from './create-template.use-case';

@Injectable()
export class SeedTemplatesUseCase {
  private readonly logger = new Logger(SeedTemplatesUseCase.name);

  constructor(
    private readonly createTemplateUseCase: CreateTemplateUseCase,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
  ) {}

  async execute(): Promise<{ created: number; skipped: number; templates: EvaluationTemplate[] }> {
    this.logger.log('Starting template seed process');

    const templates: EvaluationTemplate[] = [];
    let created = 0;
    let skipped = 0;

    // Day 1 - Collaborator Template
    const day1ColTemplate = await this.seedDay1CollaboratorTemplate();
    if (day1ColTemplate) {
      templates.push(day1ColTemplate);
      created++;
    } else {
      skipped++;
    }

    // Week 1 - Collaborator Template
    const week1ColTemplate = await this.seedWeek1CollaboratorTemplate();
    if (week1ColTemplate) {
      templates.push(week1ColTemplate);
      created++;
    } else {
      skipped++;
    }

    // Week 1 - Team Leader Template
    const week1TLTemplate = await this.seedWeek1TeamLeaderTemplate();
    if (week1TLTemplate) {
      templates.push(week1TLTemplate);
      created++;
    } else {
      skipped++;
    }

    // Month 1 - Collaborator Template
    const month1ColTemplate = await this.seedMonth1CollaboratorTemplate();
    if (month1ColTemplate) {
      templates.push(month1ColTemplate);
      created++;
    } else {
      skipped++;
    }

    // Month 1 - Team Leader Template
    const month1TLTemplate = await this.seedMonth1TeamLeaderTemplate();
    if (month1TLTemplate) {
      templates.push(month1TLTemplate);
      created++;
    } else {
      skipped++;
    }

    this.logger.log(`Seed completed: ${created} created, ${skipped} skipped`);
    return { created, skipped, templates };
  }

  private async seedDay1CollaboratorTemplate(): Promise<EvaluationTemplate | null> {
    const existing = await this.templateRepository.findActiveByMilestoneAndRole(
      EvaluationMilestone.DAY_1,
      TargetRole.COLLABORATOR,
    );

    if (existing) {
      this.logger.log('Day 1 Collaborator template already exists, skipping');
      return null;
    }

    const command = {
      milestone: EvaluationMilestone.DAY_1,
      targetRole: TargetRole.COLLABORATOR,
      title: 'Evaluación ICER - Día 1',
      description: 'Evaluación inicial del colaborador en su primer día',
      questions: [
        {
          text: 'Accesos habilitados (correo, herramientas, plataformas)',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 1,
          required: true,
        },
        {
          text: 'Configuración inicial del equipo / ambiente técnico',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 2,
          required: true,
        },
        {
          text: 'Información inicial entregada y comprendida',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 3,
          required: true,
        },
        {
          text: 'Claridad de las funciones principales',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 4,
          required: true,
        },
        {
          text: 'Comprensión del proyecto y de los objetivos iniciales',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 5,
          required: true,
        },
        {
          text: 'Bienvenida recibida por el equipo o TL',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 6,
          required: true,
        },
        {
          text: 'Percepción de soporte y canales de comunicación disponibles',
          dimension: QuestionDimension.COMMUNICATION,
          type: QuestionType.SCALE_1_4,
          order: 7,
          required: true,
        },
        {
          text: 'Comentarios adicionales',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.OPEN_TEXT,
          order: 8,
          required: false,
        },
      ],
    };

    return this.createTemplateUseCase.execute(command);
  }

  private async seedWeek1CollaboratorTemplate(): Promise<EvaluationTemplate | null> {
    const existing = await this.templateRepository.findActiveByMilestoneAndRole(
      EvaluationMilestone.WEEK_1,
      TargetRole.COLLABORATOR,
    );

    if (existing) {
      this.logger.log('Week 1 Collaborator template already exists, skipping');
      return null;
    }

    const command = {
      milestone: EvaluationMilestone.WEEK_1,
      targetRole: TargetRole.COLLABORATOR,
      title: 'Evaluación ICER - Semana 1 (Colaborador)',
      description: 'Autoevaluación del colaborador después de su primera semana',
      questions: [
        {
          text: '¿Te sientes integrado al equipo?',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 1,
          required: true,
        },
        {
          text: '¿Cómo ha sido la interacción con tus compañeros?',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 2,
          required: true,
        },
        {
          text: '¿Te sientes cómodo compartiendo tus ideas con el equipo?',
          dimension: QuestionDimension.COMMUNICATION,
          type: QuestionType.SCALE_1_4,
          order: 3,
          required: true,
        },
        {
          text: '¿Ya conoces la metodología de trabajo del equipo?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 4,
          required: true,
        },
        {
          text: '¿Lograste levantar tu ambiente de trabajo / setup técnico inicial?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 5,
          required: true,
        },
        {
          text: '¿Has podido realizar tus primeras contribuciones al código?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 6,
          required: true,
        },
        {
          text: '¿Cómo percibes la carga de trabajo asignada?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 7,
          required: true,
        },
        {
          text: '¿Crees que necesitarás aprender algo adicional para desempeñarte mejor?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 8,
          required: true,
        },
        {
          text: '¿Cómo evalúas tu desempeño en esta primera semana?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 9,
          required: true,
        },
        {
          text: 'Comentarios adicionales',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.OPEN_TEXT,
          order: 10,
          required: false,
        },
      ],
    };

    return this.createTemplateUseCase.execute(command);
  }

  private async seedWeek1TeamLeaderTemplate(): Promise<EvaluationTemplate | null> {
    const existing = await this.templateRepository.findActiveByMilestoneAndRole(
      EvaluationMilestone.WEEK_1,
      TargetRole.TEAM_LEADER,
    );

    if (existing) {
      this.logger.log('Week 1 Team Leader template already exists, skipping');
      return null;
    }

    const command = {
      milestone: EvaluationMilestone.WEEK_1,
      targetRole: TargetRole.TEAM_LEADER,
      title: 'Evaluación ICER - Semana 1 (Team Leader)',
      description: 'Evaluación del Team Leader sobre el colaborador en su primera semana',
      questions: [
        {
          text: '¿Cómo sientes que ha sido la integración del colaborador con el equipo en estos primeros días?',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 1,
          required: true,
        },
        {
          text: '¿Ha mostrado interés y comunicación fluida con el equipo y contigo? ¿Algún ejemplo?',
          dimension: QuestionDimension.COMMUNICATION,
          type: QuestionType.SCALE_1_4,
          order: 2,
          required: true,
        },
        {
          text: '¿Cómo ha sido su adaptación a la metodología de trabajo del equipo y sus responsabilidades iniciales?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 3,
          required: true,
        },
        {
          text: '¿Identificas alguna brecha o necesidad de soporte técnico o funcional en esta etapa?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 4,
          required: true,
        },
        {
          text: '¿El colaborador logró realizar su primera contribución al código o tareas asignadas?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 5,
          required: true,
        },
      ],
    };

    return this.createTemplateUseCase.execute(command);
  }

  private async seedMonth1CollaboratorTemplate(): Promise<EvaluationTemplate | null> {
    const existing = await this.templateRepository.findActiveByMilestoneAndRole(
      EvaluationMilestone.MONTH_1,
      TargetRole.COLLABORATOR,
    );

    if (existing) {
      this.logger.log('Month 1 Collaborator template already exists, skipping');
      return null;
    }

    const command = {
      milestone: EvaluationMilestone.MONTH_1,
      targetRole: TargetRole.COLLABORATOR,
      title: 'Evaluación ICER - Mes 1 (Colaborador)',
      description: 'Autoevaluación del colaborador después de su primer mes',
      questions: [
        {
          text: '¿Qué tan integrado te sientes dentro del equipo?',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 1,
          required: true,
        },
        {
          text: '¿Te sientes cómodo compartiendo tus ideas en reuniones o discusiones técnicas?',
          dimension: QuestionDimension.COMMUNICATION,
          type: QuestionType.SCALE_1_4,
          order: 2,
          required: true,
        },
        {
          text: '¿Cómo describirías tu nivel de comprensión sobre los objetivos del proyecto y tu rol en el equipo?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 3,
          required: true,
        },
        {
          text: '¿Cómo ha sido tu experiencia en el proyecto hasta ahora?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 4,
          required: true,
        },
        {
          text: 'Nivel de satisfacción con los aspectos que más te han gustado del proyecto o del equipo',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 5,
          required: true,
        },
        {
          text: 'Nivel de incomodidad con los aspectos que menos te han gustado del proyecto o del equipo',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 6,
          required: true,
        },
        {
          text: '¿La experiencia en el trabajo ha cumplido tus expectativas iniciales? (Independiente del por qué)',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 7,
          required: true,
        },
        {
          text: '¿Qué es lo que más te ha llamado la atención durante este mes? (Nivel de apreciación general)',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 8,
          required: true,
        },
        {
          text: '¿Sientes que tu carga de trabajo es equilibrada y acorde a tus capacidades?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 9,
          required: true,
        },
        {
          text: '¿Has tenido que aprender o mejorar alguna habilidad técnica en estas semanas? (Nivel de dominio y crecimiento)',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 10,
          required: true,
        },
        {
          text: 'Comentarios adicionales',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.OPEN_TEXT,
          order: 11,
          required: false,
        },
      ],
    };

    return this.createTemplateUseCase.execute(command);
  }

  private async seedMonth1TeamLeaderTemplate(): Promise<EvaluationTemplate | null> {
    const existing = await this.templateRepository.findActiveByMilestoneAndRole(
      EvaluationMilestone.MONTH_1,
      TargetRole.TEAM_LEADER,
    );

    if (existing) {
      this.logger.log('Month 1 Team Leader template already exists, skipping');
      return null;
    }

    const command = {
      milestone: EvaluationMilestone.MONTH_1,
      targetRole: TargetRole.TEAM_LEADER,
      title: 'Evaluación ICER - Mes 1 (Team Leader)',
      description: 'Evaluación del Team Leader sobre el colaborador después de su primer mes',
      questions: [
        {
          text: '¿Cómo describirías la relación del colaborador con el equipo después de este primer mes?',
          dimension: QuestionDimension.INTEGRATION,
          type: QuestionType.SCALE_1_4,
          order: 1,
          required: true,
        },
        {
          text: '¿Se muestra proactivo al participar y proponer ideas en reuniones con el equipo?',
          dimension: QuestionDimension.COMMUNICATION,
          type: QuestionType.SCALE_1_4,
          order: 2,
          required: true,
        },
        {
          text: '¿Cómo percibes su nivel de motivación y compromiso con el proyecto?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 3,
          required: true,
        },
        {
          text: '¿Notas algún cambio respecto a su satisfacción desde la primera semana?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 4,
          required: true,
        },
        {
          text: '¿Cómo ha evolucionado su desempeño técnico y funcional en este primer mes?',
          dimension: QuestionDimension.PERFORMANCE,
          type: QuestionType.SCALE_1_4,
          order: 5,
          required: true,
        },
        {
          text: '¿Ha logrado asumir responsabilidades o tareas más complejas del negocio?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 6,
          required: true,
        },
        {
          text: '¿Qué tan bien entiende los objetivos del proyecto y la lógica del negocio?',
          dimension: QuestionDimension.ROLE_UNDERSTANDING,
          type: QuestionType.SCALE_1_4,
          order: 7,
          required: true,
        },
      ],
    };

    return this.createTemplateUseCase.execute(command);
  }
}



