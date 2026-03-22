'use server'

/**
 * Averías Server Actions
 * Story 2.2: Formulario Reporte de Avería (Mobile First)
 *
 * Server actions for managing failure reports (averías).
 *
 * Features:
 * - Validación Zod con reporteAveriaSchema
 * - Generación de número único sequential (AV-YYYY-NNN)
 * - Creación en database con Prisma
 * - SSE notification a usuarios can_view_all_ots
 * - Performance tracking (<3s requirement)
 * - Logging estructurado con correlation ID
 */

import { prisma } from '@/lib/db'
import { ValidationError } from '@/lib/utils/errors'
import { trackPerformance } from '@/lib/observability/performance'
import { logger } from '@/lib/observability/logger'
import { reporteAveriaSchema, type ReporteAveriaInput } from '@/lib/utils/validations/averias'
import { emitSSEEvent } from '@/lib/sse/server'

/**
 * Create Failure Report
 *
 * Crea un nuevo reporte de avería con:
 * - Validación Zod (equipoId required, descripcion min 10 chars, fotoUrl optional)
 * - Número único sequential: AV-YYYY-NNN (ej: AV-2026-001, AV-2026-002)
 * - Creación en database Prisma con relaciones (equipo, reporter)
 * - SSE notification a usuarios con capability 'can_view_all_ots'
 * - Performance tracking (warning si >3s)
 *
 * Performance Requirements (NFR-S5):
 * - Confirmación con número en <3 segundos (P0-E2E-007)
 *
 * @param data - Report data validated by Zod schema
 * @returns Created failure report with relations (equipo, reporter)
 *
 * @throws {ValidationError} If validation fails (Zod errors)
 * @throws {Error} If database operation fails
 *
 * @example
 * const report = await createFailureReport({
 *   equipoId: 'clxxx',
 *   descripcion: 'Fallo en motor principal de línea 1',
 *   reportadoPor: 'user-123',
 *   fotoUrl: 'https://storage.example.com/foto.jpg' // optional
 * })
 * // Returns: { numero: 'AV-2026-001', ... }
 */
export async function createFailureReport(data: ReporteAveriaInput) {
  // Generate correlation ID for end-to-end tracking
  const correlationId = crypto.randomUUID()

  try {
    // Start performance tracking (<3s requirement)
    const perf = trackPerformance('create_failure_report', correlationId)

    // 🔴 RED PHASE: Validate input with Zod schema
    const validated = reporteAveriaSchema.parse(data)

    // 🟢 GREEN PHASE: Generate sequential number (AV-YYYY-NNN)
    // Use retry logic to handle race conditions in parallel test execution
    let report
    let retries = 0
    const maxRetries = 5

    while (retries <= maxRetries) {
      try {
        const year = new Date().getFullYear()

        // Get the latest report number for this year (more efficient than count)
        const latestReport = await prisma.failureReport.findFirst({
          where: {
            numero: {
              startsWith: `AV-${year}`,
            },
          },
          orderBy: {
            numero: 'desc',
          },
          select: {
            numero: true,
          },
        })

        // Extract sequence number from latest report or default to 0
        let nextNumber = 1
        if (latestReport?.numero) {
          // Parse "AV-2026-001" -> 001 -> 1, add 1
          const match = latestReport.numero.match(/AV-\d{4}-(\d+)/)
          if (match) {
            nextNumber = parseInt(match[1], 10) + 1 + retries
          }
        }

        const numero = `AV-${year}-${String(nextNumber).padStart(3, '0')}`

        // Create failure report in database
        report = await prisma.failureReport.create({
          data: {
            numero,
            descripcion: validated.descripcion,
            fotoUrl: validated.fotoUrl || null, // optional, default null
            equipoId: validated.equipoId,
            reportadoPor: validated.reportadoPor,
          },
          include: {
            equipo: {
              include: {
                linea: {
                  include: {
                    planta: true, // Include full hierarchy for SSE notification
                  },
                },
              },
            },
            reporter: true, // Select all reporter fields for response
          },
        })

        // Success - break out of retry loop
        break
      } catch (error: any) {
        // Check if it's a unique constraint violation on the numero field
        if (error.code === 'P2002' && error.meta?.target?.includes('numero') && retries < maxRetries) {
          // Unique constraint violation - retry with a different number
          retries++
          logger.warn('Retrying report creation due to unique constraint conflict', {
            correlationId,
            attempt: retries + 1,
          })
          continue
        }
        // Not a unique constraint error or max retries exceeded - rethrow
        throw error
      }
    }

    // Emit SSE notification to supervisors (can_view_all_ots capability)
    // NFR-S4: Notificación SSE entregada en <30s (P0-E2E-008)
    emitSSEEvent({
      type: 'failure_report_created',
      data: {
        reportId: report.id,
        numero: report.numero,
        equipo: report.equipo?.id ? {
          id: report.equipo.id,
          name: report.equipo.name,
          code: report.equipo.code,
          // Build hierarchy safely (handle incomplete mock data in tests)
          jerarquia: report.equipo.linea?.planta
            ? `${report.equipo.linea.planta.division} → ${report.equipo.linea.planta.name} → ${report.equipo.linea.name} → ${report.equipo.name}`
            : report.equipo.name,
        } : undefined,
        descripcion: report.descripcion,
        fotoUrl: report.fotoUrl,
        reporter: report.reporter?.id ? {
          id: report.reporter.id,
          name: report.reporter.name,
          email: report.reporter.email,
        } : undefined,
        createdAt: report.createdAt.toISOString(),
      },
      target: { capability: 'can_view_all_ots' },
    })

    // End performance tracking (logs warning if >3000ms)
    perf.end()

    logger.info('Failure report created', {
      reportId: report.id,
      numero: report.numero,
      equipoId: report.equipoId,
      reportadoPor: report.reportadoPor,
      correlationId,
    })

    return report
  } catch (error) {
    // Log error with correlation ID
    if (error instanceof Error) {
      logger.error(error, 'create_failure_report', correlationId)
    } else {
      // Create synthetic error for non-Error objects
      const syntheticError = new Error(String(error))
      logger.error(syntheticError, 'create_failure_report', correlationId)
    }

    // Re-throw Zod validation errors as ValidationError
    // Extract first error message for better UX
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any
      const firstIssue = zodError.issues?.[0]
      const message = firstIssue?.message || 'Error de validación en los datos del reporte'

      throw new ValidationError(message, { errors: zodError.issues }, correlationId)
    }

    // Re-throw other errors
    throw error
  }
}
