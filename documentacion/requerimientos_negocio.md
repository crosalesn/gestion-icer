# Requerimientos de Negocio - Gestión ICER

## 1. Objetivo del Proyecto
Construir un sistema centralizado para la gestión de fichas ICER (Integración, Comunicación, Entendimiento del Rol, Rendimiento) de nuevos colaboradores en WiTI. El sistema permitirá realizar diagnósticos, calcular niveles de riesgo automáticamente y gestionar planes de acción para asegurar una correcta inserción laboral.

## 2. Actores del Sistema
1.  **Colaborador (Nuevo Ingreso)**: Completa sus autoevaluaciones en los hitos definidos.
2.  **Team Leader (TL)**: Realiza evaluaciones sobre el colaborador a su cargo.
3.  **Especialista de Crecimiento Profesional (Administrador/Gestor)**:
    - Configura ingresos.
    - Monitorea resultados.
    - Define y asigna planes de acción.
    - Realiza seguimiento de brechas.

## 3. Flujo del Proceso ICER
El sistema debe soportar los siguientes hitos temporales para cada colaborador:

### 3.1. Día 1 - Evaluación Inicial
- **Responsable**: Colaborador.
- **Dimensiones**: Integración Operativa, Comprensión del Rol, Relación y Cultura.
- **Resultado**: Cálculo de puntaje y determinación de Riesgo Inicial.

### 3.2. Semana 1 - Evaluación de Seguimiento
- **Responsables**:
    - Colaborador (Autoevaluación).
    - Team Leader (Evaluación externa).
- **Cálculo de Indicador**: `(ICER Colaborador * 0.6) + (ICER TL * 0.4)`.
- **Resultado**: Nivel de riesgo consolidado de la semana 1.

### 3.3. Mes 1 - Evaluación de Confirmación
- **Responsables**:
    - Colaborador (Autoevaluación profunda).
    - Team Leader (Evaluación de desempeño y adaptación).
- **Cálculo de Indicador**: `(ICER Colaborador * 0.4) + (ICER TL * 0.6)`.
- **Resultado**: Nivel de riesgo final del periodo de prueba inicial.

## 4. Funcionalidades Principales

### 4.1. Gestión de Colaboradores
- Registro de nuevos colaboradores con datos clave:
    - Nombre, Fecha de ingreso, Cliente/Proyecto, Team Leader, Rol.
- Estado del proceso (Ej: Pendiente Día 1, En Semana 1, Finalizado).

### 4.2. Sistema de Evaluaciones
- **Formularios Personalizables**: Capacidad de configurar y modificar las preguntas de las evaluaciones para cada hito (Día 1, Semana 1, Mes 1) sin necesidad de cambios en el código (backend dinámico).
- Escala de evaluación estandarizada: 1 (Insuficiente) a 4 (Sobresaliente).
- Capacidad de ingresar comentarios cualitativos en cada dimensión.

### 4.3. Motor de Cálculo y Riesgos
- **Cálculo Automático**: Aplicación de las fórmulas ponderadas para Semana 1 y Mes 1.
- **Clasificación de Riesgo**:
    - 🟥 **Riesgo Alto (1.0 - 1.9)**: Alertas inmediatas.
    - 🟧 **Riesgo Medio (2.0 - 2.9)**: Alertas de seguimiento.
    - 🟩 **Riesgo Bajo (3.0 - 4.0)**: Flujo estándar.
- **Visualización**: Dashboard que resalte los casos en riesgo alto/medio.

### 4.4. Gestión de Planes de Acción
- Asignación de planes según el riesgo detectado:
    - **PD-30**: Plan de Desarrollo 30 días (Riesgo Alto).
    - **PDF-30**: Mini Plan de Fortalecimiento (Riesgo Medio).
    - **SE-60**: Seguimiento Estándar (Riesgo Bajo).
- Registro de acciones específicas (Brechas a abordar y Fortalezas).
- Seguimiento de cumplimiento de acciones (To-Do list de acciones por colaborador).

## 5. Reglas de Negocio Críticas
1.  **Ponderación Dinámica**: La opinión del colaborador pesa más en la Semana 1 (60%), mientras que la visión del TL pesa más en el Mes 1 (60%).
2.  **Alertas**: El sistema debe notificar al Especialista si un colaborador cae en Riesgo Alto o Medio.
3.  **Confidencialidad**: El sistema debe manejar permisos para que cada rol vea solo lo que le corresponde (ej: el colaborador no edita la evaluación del TL).

## 6. Entregables de Información (Reportes)
- Ficha resumen del colaborador con el historial de sus 3 evaluaciones.
- Gráfica de evolución de puntajes (Día 1 -> Semana 1 -> Mes 1).
- Estado actual de los planes de acción activos.

---
*Este documento sirve como base funcional para el desarrollo del backend y frontend de la plataforma Gestión ICER.*

