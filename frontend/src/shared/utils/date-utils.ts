import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Parsea un string de fecha de forma segura, evitando problemas de zona horaria.
 * Para fechas "solo fecha" (YYYY-MM-DD), agrega mediodía local para evitar
 * que la conversión de zona horaria cambie el día.
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr) {
    return new Date(NaN);
  }
  
  // Si la fecha ya incluye hora (tiene 'T'), usarla directamente
  if (dateStr.includes('T')) {
    return parseISO(dateStr);
  }
  
  // Para fechas solo-fecha (YYYY-MM-DD), agregar mediodía para evitar
  // problemas de zona horaria
  return parseISO(`${dateStr}T12:00:00`);
}

/**
 * Formatea una fecha para mostrar en formato dd/MM/yyyy.
 * Maneja correctamente fechas "solo fecha" y fechas con hora.
 */
export function formatDate(dateStr: string | null | undefined, formatStr = 'dd/MM/yyyy'): string {
  if (!dateStr) {
    return '-';
  }
  
  try {
    const date = parseDate(dateStr);
    return format(date, formatStr, { locale: es });
  } catch {
    return '-';
  }
}

/**
 * Calcula la diferencia en días entre una fecha y hoy.
 * Maneja correctamente fechas "solo fecha".
 */
export function getDaysFromDate(dateStr: string | null | undefined): number {
  if (!dateStr) {
    return 0;
  }
  
  try {
    const date = parseDate(dateStr);
    return differenceInDays(new Date(), date);
  } catch {
    return 0;
  }
}
