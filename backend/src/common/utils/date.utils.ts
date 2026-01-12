/**
 * Parsea un string de fecha "solo fecha" (YYYY-MM-DD) de forma segura,
 * evitando problemas de zona horaria.
 *
 * El problema: new Date("2023-02-07") interpreta la fecha como medianoche UTC,
 * lo que puede causar que se muestre el día anterior en zonas horarias negativas.
 *
 * La solución: Agregar mediodía (12:00:00) para que cualquier conversión de
 * zona horaria no afecte el día.
 */
export function parseDateOnly(dateString: string): Date {
  if (!dateString) {
    return new Date(NaN);
  }

  // Si ya incluye hora, parsearlo directamente
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  // Para fechas "solo fecha", agregar mediodía para evitar problemas de TZ
  return new Date(`${dateString}T12:00:00`);
}

/**
 * Formatea un Date a string "solo fecha" (YYYY-MM-DD) de forma segura.
 * Usa los métodos locales para evitar problemas de zona horaria.
 */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
