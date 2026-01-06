/**
 * @deprecated Este enum se mantiene solo como referencia de los códigos de dimensión.
 * Las dimensiones ahora son entidades en la base de datos y se manejan a través de
 * la tabla 'dimensions'. Use el repositorio IDimensionRepository para acceder a las dimensiones.
 *
 * Los códigos disponibles son:
 * - INTEGRATION: Integración
 * - COMMUNICATION: Comunicación
 * - ROLE_UNDERSTANDING: Comprensión del Rol
 * - PERFORMANCE: Desempeño
 */
export enum QuestionDimensionCode {
  INTEGRATION = 'INTEGRATION',
  COMMUNICATION = 'COMMUNICATION',
  ROLE_UNDERSTANDING = 'ROLE_UNDERSTANDING',
  PERFORMANCE = 'PERFORMANCE',
}
