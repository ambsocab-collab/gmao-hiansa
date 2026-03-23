/**
 * Zod Validation Schemas: Story 2.2 - Formulario Reporte de Avería
 *
 * Schemas para validar la creación de reportes de avería
 * siguiendo los Acceptance Criteria de la Story 2.2
 *
 * AC3: Equipo es REQUERIDO
 * AC4: Descripción es REQUERIDA (mínimo 10 caracteres)
 * AC5: Foto es opcional
 */

import { z } from 'zod';

/**
 * Schema de validación para crear un reporte de avería
 *
 * Validaciones:
 * - equipoId: Requerido, string no vacío
 * - descripcion: Requerida, mínimo 10 caracteres
 * - reportadoPor: Requerido (userId del usuario autenticado)
 * - fotoUrl: Opcional, debe ser URL válida si está presente
 */
export const reporteAveriaSchema = z.object({
  equipoId: z.string().min(1, 'El equipo es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  reportadoPor: z.string().min(1, 'El reportado por es requerido'),
  fotoUrl: z.string().url('La foto debe ser una URL válida').nullable().optional(),
});

/**
 * Tipo TypeScript inferido del schema Zod
 * Útil para tipar Server Actions y componentes React
 */
export type ReporteAveriaInput = z.infer<typeof reporteAveriaSchema>;
