import { EvaluationType } from '../types/evaluation.types';

export interface Question {
  id: string;
  text: string;
  type: 'rating' | 'text';
  category?: string; // I, C, E, R dimensions
}

export const EVALUATION_QUESTIONS: Record<EvaluationType, Question[]> = {
  [EvaluationType.DAY_1]: [
    { id: 'd1_i1', text: 'Accesos habilitados (correo, herramientas, plataformas)', type: 'rating', category: 'Integración' },
    { id: 'd1_i2', text: 'Configuración inicial del equipo / ambiente técnico', type: 'rating', category: 'Integración' },
    { id: 'd1_i3', text: 'Información inicial entregada y comprendida', type: 'rating', category: 'Integración' },
    { id: 'd1_c1', text: 'Claridad de las funciones principales', type: 'rating', category: 'Comprensión del Rol' },
    { id: 'd1_c2', text: 'Comprensión del proyecto y de los objetivos iniciales', type: 'rating', category: 'Comprensión del Rol' },
    { id: 'd1_r1', text: 'Bienvenida recibida por el equipo o TL', type: 'rating', category: 'Relación y Cultura' },
    { id: 'd1_r2', text: 'Percepción de soporte y canales de comunicación disponibles', type: 'rating', category: 'Relación y Cultura' },
  ],
  [EvaluationType.WEEK_1_COLLABORATOR]: [
    { id: 'w1c_i1', text: '¿Te sientes integrado al equipo?', type: 'rating', category: 'Integración' },
    { id: 'w1c_i2', text: '¿Cómo ha sido la interacción con tus compañeros?', type: 'rating', category: 'Integración' },
    { id: 'w1c_i3', text: '¿Te sientes cómodo compartiendo tus ideas con el equipo?', type: 'rating', category: 'Integración' },
    { id: 'w1c_c1', text: '¿Ya conoces la metodología de trabajo del equipo?', type: 'rating', category: 'Conocimiento y Adaptación' },
    { id: 'w1c_c2', text: '¿Lograste levantar tu ambiente de trabajo / setup técnico inicial?', type: 'rating', category: 'Conocimiento y Adaptación' },
    { id: 'w1c_c3', text: '¿Has podido realizar tus primeras contribuciones al código?', type: 'rating', category: 'Conocimiento y Adaptación' },
    { id: 'w1c_e1', text: '¿Cómo percibes la carga de trabajo asignada?', type: 'rating', category: 'Ejecución y Autonomía' },
    { id: 'w1c_e2', text: '¿Crees que necesitarás aprender algo adicional para desempeñarte mejor?', type: 'rating', category: 'Ejecución y Autonomía' },
    { id: 'w1c_e3', text: '¿Cómo evalúas tu desempeño en esta primera semana?', type: 'rating', category: 'Ejecución y Autonomía' },
  ],
  [EvaluationType.WEEK_1_LEADER]: [
    { id: 'w1l_i1', text: '¿Cómo sientes que ha sido la integración del colaborador con el equipo en estos primeros días?', type: 'rating', category: 'Integración' },
    { id: 'w1l_c1', text: '¿Ha mostrado interés y comunicación fluida con el equipo y contigo? ¿Algún ejemplo?', type: 'rating', category: 'Comunicación' },
    { id: 'w1l_e1', text: '¿Cómo ha sido su adaptación a la metodología de trabajo del equipo y sus responsabilidades iniciales?', type: 'rating', category: 'Entendimiento del Rol' },
    { id: 'w1l_r1', text: '¿Identificas alguna brecha o necesidad de soporte técnico o funcional en esta etapa?', type: 'rating', category: 'Rendimiento' },
    { id: 'w1l_r2', text: '¿El colaborador logró realizar su primera contribución al código o tareas asignadas?', type: 'rating', category: 'Rendimiento' },
  ],
  [EvaluationType.MONTH_1_COLLABORATOR]: [
    { id: 'm1c_i1', text: '¿Qué tan integrado te sientes dentro del equipo?', type: 'rating', category: 'Integración' },
    { id: 'm1c_c1', text: '¿Te sientes cómodo compartiendo tus ideas en reuniones o discusiones técnicas?', type: 'rating', category: 'Comunicación' },
    { id: 'm1c_e1', text: '¿Cómo describirías tu nivel de comprensión sobre los objetivos del proyecto y tu rol en el equipo?', type: 'rating', category: 'Entendimiento del Rol' },
    { id: 'm1c_r1', text: '¿Cómo ha sido tu experiencia en el proyecto hasta ahora?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1c_r2', text: 'Nivel de satisfacción con los aspectos que más te han gustado del proyecto o del equipo', type: 'rating', category: 'Rendimiento' },
    { id: 'm1c_r3', text: 'Nivel de incomodidad con los aspectos que menos te han gustado del proyecto o del equipo', type: 'rating', category: 'Rendimiento' },
    { id: 'm1c_r4', text: '¿La experiencia en el trabajo ha cumplido tus expectativas iniciales?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1c_e2', text: '¿Qué es lo que más te ha llamado la atención durante este mes?', type: 'rating', category: 'Entendimiento del Rol' },
    { id: 'm1c_r5', text: '¿Sientes que tu carga de trabajo es equilibrada y acorde a tus capacidades?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1c_e3', text: '¿Has tenido que aprender o mejorar alguna habilidad técnica en estas semanas?', type: 'rating', category: 'Entendimiento del Rol' },
  ],
  [EvaluationType.MONTH_1_LEADER]: [
    { id: 'm1l_i1', text: '¿Cómo describirías la relación del colaborador con el equipo después de este primer mes?', type: 'rating', category: 'Integración' },
    { id: 'm1l_c1', text: '¿Se muestra proactivo al participar y proponer ideas en reuniones con el equipo?', type: 'rating', category: 'Comunicación' },
    { id: 'm1l_r1', text: '¿Cómo percibes su nivel de motivación y compromiso con el proyecto?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1l_r2', text: '¿Notas algún cambio respecto a su satisfacción desde la primera semana?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1l_r3', text: '¿Cómo ha evolucionado su desempeño técnico y funcional en este primer mes?', type: 'rating', category: 'Rendimiento' },
    { id: 'm1l_e1', text: '¿Ha logrado asumir responsabilidades o tareas más complejas del negocio?', type: 'rating', category: 'Entendimiento del Rol' },
    { id: 'm1l_e2', text: '¿Qué tan bien entiende los objetivos del proyecto y la lógica del negocio?', type: 'rating', category: 'Entendimiento del Rol' },
  ],
};
