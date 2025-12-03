# Capacidades del Backend - Gestión ICER

Este documento detalla las capacidades técnicas y funcionales expuestas por el backend de Gestión ICER. El sistema está construido siguiendo una arquitectura limpia (Clean Architecture) sobre **NestJS**, garantizando modularidad, escalabilidad y mantenibilidad.

## 1. Módulos Principales

### 1.1 Autenticación y Seguridad (`Auth`)
Gestiona el acceso seguro a la plataforma mediante tokens JWT.

*   **Inicio de Sesión**: Validación de credenciales (email/password) y emisión de tokens de acceso.
    *   Endpoint: `POST /auth/login`
*   **Protección de Rutas**: Implementación de `JwtAuthGuard` para asegurar endpoints privados.

### 1.2 Gestión de Usuarios (`Users`)
Administración de los usuarios del sistema (Administradores, Team Leaders, etc.).

*   **Registro de Usuarios**: Creación de nuevas cuentas de usuario con roles definidos (Ej: Admin, Collaborator).
    *   Endpoint: `POST /users`
*   **Semilla de Datos (Testing)**: Capacidad de generar usuarios de prueba para entornos de desarrollo.
    *   Endpoint: `POST /users/seed`

### 1.3 Gestión de Colaboradores (`Collaborators`)
Módulo central para la administración de los nuevos ingresos, quienes son el foco del proceso ICER.

*   **Registro de Colaborador**: Alta de un nuevo colaborador en el sistema.
    *   Endpoint: `POST /collaborators`
*   **Listado General**: Visualización de todos los colaboradores registrados.
    *   Endpoint: `GET /collaborators`
*   **Detalle de Colaborador**: Consulta de información específica de un colaborador por su ID.
    *   Endpoint: `GET /collaborators/:id`

### 1.4 Motor de Evaluaciones (`Evaluations`)
Soporta el flujo principal del proceso ICER (Día 1, Semana 1, Mes 1).

*   **Creación de Evaluación**: Generación de una instancia de evaluación para un colaborador específico (Ej: Crear evaluación "Día 1").
    *   Endpoint: `POST /evaluations`
    *   *Soporta los tipos de evaluación definidos en las reglas de negocio.*
*   **Envío de Respuestas**: Procesamiento y guardado de las respuestas de una evaluación.
    *   Endpoint: `POST /evaluations/:id/submit`
    *   *Al enviar, se disparan los cálculos de puntaje y riesgo según las reglas de negocio.*
*   **Historial de Evaluaciones**: Consulta de todas las evaluaciones asociadas a un colaborador.
    *   Endpoint: `GET /evaluations/collaborator/:collaboratorId`

### 1.5 Planes de Acción (`Action Plans`)
Gestión de las estrategias de mitigación de riesgo (PD-30, PDF-30, SE-60).

*   **Asignación de Plan**: Asignar un plan de acción específico a un colaborador basado en su nivel de riesgo.
    *   Endpoint: `POST /action-plans/collaborator/:collaboratorId`
*   **Consulta de Planes**: Visualización de los planes de acción activos e históricos de un colaborador.
    *   Endpoint: `GET /action-plans/collaborator/:collaboratorId`

### 1.6 Reportes y Analítica (`Reports`)
Provee información consolidada para la toma de decisiones.

*   **Dashboard Principal**: Estadísticas generales del sistema (Ej: colaboradores en riesgo alto, estado de evaluaciones).
    *   Endpoint: `GET /reports/dashboard`
*   **Historial del Colaborador**: Reporte detallado de la evolución de un colaborador a través de sus hitos (Ficha resumen).
    *   Endpoint: `GET /reports/collaborator/:id`

---

## 2. Aspectos Técnicos Relevantes

*   **Arquitectura Limpia**: Separación estricta de capas (Dominio, Aplicación, Infraestructura, Presentación) para facilitar pruebas y cambios futuros.
*   **Patrón CQRS**: Uso de Comandos (Write) y Consultas (Read) para separar la lógica de modificación de datos de la de lectura.
*   **Validación de Datos**: Uso de DTOs (Data Transfer Objects) para validar rigurosamente la entrada de datos en cada endpoint.
*   **Documentación API**: Preparado para integración con Swagger (OpenAPI) para facilitar el consumo por parte del Frontend.

