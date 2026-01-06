# Requerimiento: Cálculo de Riesgo ICER y Gestión de Planes de Seguimiento

## 1. Contexto y Objetivo
Al finalizar el proceso de evaluación del **Primer Mes** (Evaluación 360°: Autoevaluación + Evaluación del Líder), el sistema debe calcular automáticamente el **Nivel de Riesgo ICER** del colaborador. Basado en este nivel de riesgo, se debe asignar un **Plan de Seguimiento** específico.

El objetivo es automatizar la transición entre la etapa de evaluación y la etapa de acompañamiento/desarrollo, asegurando que cada colaborador reciba la intensidad de seguimiento adecuada a su desempeño inicial.

## 2. Definiciones

### 2.1. Nivel de Riesgo ICER
Es una clasificación derivada del Puntaje Final de la evaluación del Mes 1.
Los niveles se definen según la siguiente tabla (basada en la Ficha ICER):

| Rango de Puntaje | Nivel de Riesgo | Código | Interpretación |
| :--- | :--- | :--- | :--- |
| **1.0 - 1.9** | **ALTO** | `RISK_HIGH` | Desempeño insuficiente. Requiere intervención inmediata. |
| **2.0 - 2.9** | **MEDIO** | `RISK_MEDIUM` | Adaptación parcial con brechas. Requiere apoyo guiado. |
| **3.0 - 4.0** | **BAJO** | `RISK_LOW` | Adaptación adecuada. Seguimiento estándar. |

### 2.2. Plan de Seguimiento (Plantilla)
Es una entidad que define la estructura del acompañamiento. El sistema debe permitir gestionar estos planes (CRUD) para que los administradores puedan ajustar la estrategia sin tocar código.
Un Plan de Seguimiento se compone de:
*   **Nombre:** (Ej: "Plan de Desarrollo 30 días", "Seguimiento Estándar").
*   **Código:** (Ej: "PD-30", "SE-60").
*   **Riesgo Asociado:** El nivel de riesgo para el cual este plan es el predeterminado (ALTO, MEDIO, BAJO).
*   **Duración:** Tiempo total del plan (ej: 30 días, 60 días).
*   **Frecuencia de Reuniones:** Cada cuánto tiempo se debe agendar una reunión (ej: Semanal, Quincenal, Mensual).
*   **Cantidad de Reuniones:** Número total de sesiones esperadas.

### 2.3. Asignación de Plan (Instancia)
Es la vinculación concreta entre un **Colaborador** y un **Plan de Seguimiento**.
*   Se crea automáticamente al cerrar la evaluación del Mes 1.
*   Debe permitir edición manual posterior (ej: si un gestor decide cambiar el plan asignado por defecto).
*   Debe generar (o permitir la gestión de) las **Reuniones de Seguimiento** asociadas.

---

## 3. Requerimientos Funcionales

### 3.1. Cálculo de Riesgo Automático
*   **Trigger:** Al completarse el cálculo del puntaje del Mes 1 (`Month1CalculationStrategy`).
*   **Lógica:**
    1.  Obtener el puntaje final (ej: 2.4).
    2.  Comparar con la tabla de riesgos.
    3.  Determinar el Nivel (ej: MEDIO).
    4.  Persistir este resultado asociado a la evaluación o al perfil del colaborador.

### 3.2. Gestión de Planes de Seguimiento (Backoffice)
El sistema debe contar con endpoints/servicios para:
*   **Crear/Editar Planes:** Definir nuevos tipos de planes (ej: si se crea un "Plan de Emergencia 15 días").
*   **Configurar Parámetros:** Establecer cuántas reuniones y con qué frecuencia corresponden a cada plan.

*Ejemplo de Datos Semilla (basado en Ficha ICER):*
1.  **PD-30 (Riesgo ALTO):** 4 reuniones (1 semanal), duración 30 días.
2.  **PDF-30 (Riesgo MEDIO):** 2 reuniones (1 quincenal), duración 30 días.
3.  **SE-60 (Riesgo BAJO):** 1 reunión (a los 60 días), duración 60 días.

### 3.3. Asignación Automática
*   Una vez calculado el riesgo, el sistema debe buscar el **Plan de Seguimiento Activo** asociado a ese nivel de riesgo.
*   Crear una "Asignación de Plan" para el colaborador.
*   *Opcional (Fase 2):* Generar los registros de las reuniones futuras en estado "Pendiente" basadas en la frecuencia del plan.

### 3.4. Gestión de la Asignación Individual
*   Permitir a un administrador (Gestor de Crecimiento) ver el plan asignado a un colaborador.
*   Permitir cambiar el plan manualmente (ej: El sistema asignó "Medio", pero el gestor decide aplicar el plan de "Alto Riesgo").
*   Visualizar el estado del plan (En curso, Completado, Cancelado).

---

## 4. Impacto en Base de Datos (Propuesta Modelo)

Se requieren nuevas entidades en el módulo `action-plans` (o un nuevo módulo `follow-up-plans` si se desea separar):

1.  **`follow_up_plan_templates`**: Catálogo de planes.
    *   `id`, `name`, `code`, `target_risk_level`, `duration_days`, `meeting_frequency_days`, `meeting_count`.
2.  **`collaborator_follow_up_plans`**: La asignación real.
    *   `id`, `collaborator_id`, `template_id`, `start_date`, `end_date`, `status`, `assigned_at_risk_level`.
3.  **`follow_up_meetings`**: Las reuniones individuales.
    *   `id`, `collaborator_plan_id`, `scheduled_date`, `status` (pending, done), `notes`.

## 5. Flujo de Usuario

1.  **Evaluación:** Colaborador y TL terminan encuesta Mes 1.
2.  **Procesamiento:** Sistema calcula nota (ej: 1.8) -> Determina Riesgo ALTO.
3.  **Acción Sistema:** Sistema busca plantilla "PD-30" y la asigna al colaborador.
4.  **Visualización:** En el perfil del colaborador, aparece "Riesgo Detectado: ALTO" y "Plan Activo: PD-30".
5.  **Gestión:** El gestor ve que se deben realizar 4 reuniones. Puede ir marcando cuando se realicen (Check de asistencia).

