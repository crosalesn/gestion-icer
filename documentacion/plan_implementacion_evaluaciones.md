# Plan de Implementación Técnica: Sistema de Evaluaciones ICER

Este documento define la arquitectura, modelos de datos y hoja de ruta para implementar el módulo de evaluaciones del proyecto Gestión ICER. Está diseñado para ser utilizado como referencia técnica por agentes de IA y desarrolladores.

## 1. Visión General de la Arquitectura

El sistema de evaluaciones debe soportar **formularios dinámicos** (definidos por datos, no hardcodeados) y **cálculo de riesgos complejo** (ponderación entre múltiples evaluadores).

Se propone una arquitectura modular basada en tres dominios lógicos:

1.  **Configuración (Configuration)**: Definición de qué se pregunta (Templates, Questions).
2.  **Ejecución (Execution)**: Gestión del ciclo de vida de las respuestas (Assignments, Answers).
3.  **Análisis (Analysis)**: Motor de cálculo de puntajes, ponderaciones y determinación de riesgos.

## 2. Modelo de Dominio y Estructuras de Datos

A continuación se definen las interfaces TypeScript que modelan el dominio.

### 2.1. Subdominio de Configuración

```typescript
// Enum para los hitos temporales del proceso
enum EvaluationMilestone {
  DAY_1 = 'DAY_1',
  WEEK_1 = 'WEEK_1',
  MONTH_1 = 'MONTH_1'
}

// Enum para definir quién responde
enum TargetRole {
  COLLABORATOR = 'COLLABORATOR',
  TEAM_LEADER = 'TEAM_LEADER'
}

// Definición de una Pregunta
interface Question {
  id: string;
  text: string; // Ej: "¿Te sientes integrado al equipo?"
  dimension: 'INTEGRATION' | 'COMMUNICATION' | 'ROLE_UNDERSTANDING' | 'PERFORMANCE';
  type: 'SCALE_1_4' | 'OPEN_TEXT'; 
  order: number;
  required: boolean;
}

// Definición del Template (Formulario)
interface EvaluationTemplate {
  id: string;
  milestone: EvaluationMilestone;
  targetRole: TargetRole; // Quién debe responder este template
  title: string;
  description?: string;
  questions: Question[];
  isActive: boolean;
  version: number; // Para manejar cambios históricos en las preguntas
}
```

### 2.2. Subdominio de Ejecución

```typescript
enum EvaluationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// La asignación de una evaluación a una persona específica
interface EvaluationAssignment {
  id: string;
  collaboratorId: string; // El colaborador que está siendo evaluado (sujeto)
  evaluatorUserId: string; // El usuario que debe responder (puede ser el mismo colaborador o su TL)
  templateId: string; // Referencia al Template usado
  milestone: EvaluationMilestone;
  status: EvaluationStatus;
  dueDate: Date;
  completedAt?: Date;
  answers: EvaluationAnswer[];
  score?: number; // Puntaje directo de esta evaluación individual (promedio simple)
}

interface EvaluationAnswer {
  questionId: string;
  value: number | string; // 1-4 para escala, string para texto
}
```

### 2.3. Subdominio de Análisis (Resultados Consolidados)

```typescript
enum RiskLevel {
  HIGH = 'HIGH',     // 1.0 - 1.9
  MEDIUM = 'MEDIUM', // 2.0 - 2.9
  LOW = 'LOW'        // 3.0 - 4.0
}

// Resultado consolidado del Hito (ej: Resultado final de la Semana 1)
interface MilestoneResult {
  id: string;
  collaboratorId: string;
  milestone: EvaluationMilestone;
  
  // Referencias a las evaluaciones individuales usadas para el cálculo
  collaboratorAssignmentId?: string;
  teamLeaderAssignmentId?: string;
  
  finalScore: number; // Puntaje ponderado calculado
  riskLevel: RiskLevel;
  calculatedAt: Date;
  
  // Metadatos para auditoría
  calculationFormula: string; // Ej: "(Colab * 0.6) + (TL * 0.4)"
}
```

## 3. Reglas de Negocio y Algoritmos

### 3.1. Fórmulas de Cálculo

1.  **Día 1 (Day 1)**
    *   **Fuente**: Solo Colaborador.
    *   **Fórmula**: `Promedio simple de respuestas (escala 1-4)`.
    
2.  **Semana 1 (Week 1)**
    *   **Fuente**: Colaborador (Autoevaluación) + Team Leader.
    *   **Fórmula**: `(Score_Colaborador * 0.6) + (Score_TL * 0.4)`.
    *   *Nota*: Requiere ambas evaluaciones completadas para calcular el final.

3.  **Mes 1 (Month 1)**
    *   **Fuente**: Colaborador + Team Leader.
    *   **Fórmula**: `(Score_Colaborador * 0.4) + (Score_TL * 0.6)`.

### 3.2. Clasificación de Riesgo

| Rango Puntaje | Nivel de Riesgo | Acción Automática |
| :--- | :--- | :--- |
| **1.0 - 1.9** | 🟥 **HIGH** | Generar alerta crítica. Sugerir Plan PD-30. |
| **2.0 - 2.9** | 🟧 **MEDIUM** | Generar alerta de seguimiento. Sugerir Plan PDF-30. |
| **3.0 - 4.0** | 🟩 **LOW** | Registrar métrica. Sugerir Seguimiento Estándar SE-60. |

## 4. Especificación de API (Endpoints Clave)

### A. Configuración (Admin / System)
*   `POST /evaluations/templates`: Crear/Actualizar un template de evaluación.
*   `GET /evaluations/templates`: Listar templates disponibles.

### B. Ejecución (Frontend Colaborador / TL)
*   `GET /evaluations/my-pending`: Obtener evaluaciones asignadas al usuario logueado pendientes de respuesta.
    *   *Response*: Lista de `EvaluationAssignment` con la estructura del template embebida (preguntas).
*   `POST /evaluations/:assignmentId/submit`: Enviar respuestas.
    *   *Validación*: Verificar que todas las preguntas `required` tengan respuesta.
    *   *Side Effect*: Calcular puntaje individual y verificar si se gatilla el cálculo consolidado.

### C. Análisis (Dashboard / Admin)
*   `GET /evaluations/results/:collaboratorId`: Historial de puntajes y riesgos por hito.

## 5. Hoja de Ruta de Implementación

### Fase 1: Infraestructura y Modelos (Backend)
1.  Crear las entidades ORM (TypeORM/Prisma) para `EvaluationTemplate`, `Question`, `EvaluationAssignment`, `MilestoneResult`.
2.  Crear Seeds de base de datos con las preguntas definidas en `ficha_icer.md`.

### Fase 2: Lógica de Asignación y Respuesta
1.  Implementar `EvaluationService.assignEvaluation(collaboratorId, milestone)`: Crea los registros `EvaluationAssignment` vacíos.
2.  Implementar `EvaluationController.getPending()`: Endpoint para que el frontend recupere sus tareas.
3.  Implementar `EvaluationService.submitResponse()`: Guardado de respuestas y cálculo de puntaje simple.

### Fase 3: Motor de Cálculo (Strategy Pattern)
1.  Crear `ScoreCalculatorFactory`: Devuelve la estrategia de cálculo según el Hito.
2.  Implementar estrategias: `Day1CalculationStrategy`, `Week1CalculationStrategy`, `Month1CalculationStrategy`.
3.  Implementar Trigger: Al recibir un `submitResponse`, verificar si el hito está completo (ambas partes) y ejecutar el cálculo consolidado.

### Fase 4: Integración de Planes de Acción
1.  Implementar Evento de Dominio `MilestoneCalculatedEvent`.
2.  Crear Listener en el módulo `ActionPlans` que escuche este evento.
3.  Si `riskLevel` es HIGH o MEDIUM, crear automáticamente la sugerencia de plan correspondiente.

### Fase 5: Frontend
1.  Crear componente `DynamicEvaluationForm`: Recibe un array de `Question` y renderiza los inputs.
2.  Implementar vista de `MyEvaluations`: Lista de pendientes.
3.  Implementar vista de Resultados para el Administrador.

