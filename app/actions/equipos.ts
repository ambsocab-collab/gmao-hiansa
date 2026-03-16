'use server'

/**
 * Equipos Server Actions
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Server actions for managing equipment search
 */

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth-adapter'
import { ValidationError } from '@/lib/utils/errors'
import { trackPerformance } from '@/lib/observability/performance'
import { logger } from '@/lib/observability/logger'
import { z } from 'zod'

/**
 * Zod schema for search query validation
 * Enforces minimum 3 characters for search
 */
const searchEquiposSchema = z.object({
  query: z.string().trim().min(3, 'La búsqueda debe tener al menos 3 caracteres'),
})

/**
 * Search equipos with predictive search
 * Performance requirement: <200ms P95 with 10K+ equipos (R-001)
 *
 * Features:
 * - Case-insensitive search (PostgreSQL ILIKE)
 * - Minimum 3 characters validation
 * - Includes linea and planta relations for hierarchy
 * - LIMIT 10 for performance optimization
 * - Uses database index on `name` field (schema.prisma:196)
 * - Performance tracking with correlation ID
 *
 * @param query - Search query (minimum 3 characters)
 * @returns Array of equipos with hierarchy (linea.planta.division)
 *
 * @throws {ValidationError} If query has less than 3 characters
 *
 * @example
 * const equipos = await searchEquipos('pren')
 * // Returns: [
 * //   {
 * //     id: 'clxxx',
 * //     name: 'Prensa PH-500',
 * //     code: 'PH-500',
 * //     linea: {
 * //       name: 'Línea 1',
 * //       planta: {
 * //         name: 'HiRock',
 * //         division: 'HIROCK'
 * //       }
 * //     }
 * //   }
 * // ]
 */
export async function searchEquipos(query: string) {
  // Generate correlation ID for tracking
  const correlationId = crypto.randomUUID()

  try {
    // Validate input with Zod
    const validatedData = searchEquiposSchema.parse({ query })

    // Start performance tracking
    const perf = trackPerformance('search_equipos', correlationId)

    // Execute optimized search query
    const equipos = await prisma.equipo.findMany({
      where: {
        name: {
          contains: validatedData.query,
          mode: 'insensitive', // PostgreSQL ILIKE for case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
        linea: {
          select: {
            name: true,
            planta: {
              select: {
                name: true,
                division: true,
              },
            },
          },
        },
      },
      take: 10, // LIMIT 10 for performance optimization (R-001)
    })

    // End performance tracking (logs warning if >200ms per R-001 requirement)
    perf.end(200)

    logger.info(
      undefined,
      `search_equipos: Found ${equipos.length} equipos for query "${validatedData.query}"`,
      correlationId,
      { query: validatedData.query, count: equipos.length }
    )

    return equipos
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      logger.warn(
        undefined,
        `search_equipos: Validation failed - ${error.errors[0].message}`,
        correlationId,
        { validationErrors: error.errors }
      )
      throw new ValidationError(error.errors[0].message, undefined, correlationId)
    }

    // Handle other errors
    // Ensure error is an Error object for logger
    const errorObj = error instanceof Error ? error : new Error(String(error))
    logger.error(
      errorObj,
      `search_equipos: Error searching equipos for query "${query}"`,
      correlationId
    )
    throw error
  }
}
