/**
 * Triage Column Component
 * Story 2.3: Triage de Averías y Conversión a OTs
 *
 * Server Component que muestra FailureReports nuevos en columna de triage
 * Características:
 * - Fetch FailureReports con estado "NUEVO" desde Prisma
 * - Muestra badge de contador: "Por Revisar (N)"
 * - Renderiza FailureReportCard para cada reporte
 * - Mobile First layout (single column <768px)
 * - Incluye jerarquía de equipo (Planta > Línea > Equipo)
 * - AC5: Filtros por fecha, reporter, equipo (URL search params)
 * - AC5: Ordenamiento por fecha y prioridad (URL search params)
 */

import { prisma } from '@/lib/db'
import { FailureReportCard } from './failure-report-card'
import { FiltrosOrdenamiento } from './filtros-ordenamiento'
import { TriageColumnSSE } from './triage-column-sse'

interface TriageColumnProps {
  userId: string
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function TriageColumn({ userId, searchParams }: TriageColumnProps) {
  // Leer search params de la URL
  const params = await searchParams

  const filtroFecha = params.filtro_fecha
  const filtroReporter = params.filtro_reporter
  const filtroEquipo = params.filtro_equipo
  const ordenarFecha = params.ordenar_fecha // 'asc' | 'desc' | undefined
  const ordenarPrioridad = params.ordenar_prioridad // 'alta' | 'media' | 'baja' | undefined

  // Fetch dinámico de reporters y equipos para filtros (AC5)
  const [uniqueReporters, uniqueEquipos] = await Promise.all([
    // Fetch usuarios únicos que han reportado averías
    prisma.failureReport.findMany({
      where: { estado: 'NUEVO' },
      select: {
        reportadoPor: true,
        reporter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['reportadoPor'],
    }),
    // Fetch equipos únicos con averías nuevas
    prisma.failureReport.findMany({
      where: { estado: 'NUEVO' },
      select: {
        equipoId: true,
        equipo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['equipoId'],
    }),
  ])

  // Declare failureReports variable with proper type
  type FailureReportWithRelations = {
    id: string
    numero: string
    descripcion: string
    tipo: string
    fotoUrl: string | null
    estado: string
    createdAt: Date
    equipo: {
      id: string
      name: string
      code: string
      linea: {
        id: string
        name: string
        planta: {
          id: string
          name: string
          division: string
        }
      }
    }
    reporter: {
      id: string
      name: string
      email: string
    }
  }

  let failureReports: FailureReportWithRelations[]

  // Construir where clause dinámico
  const where: {
    estado: 'NUEVO'
    createdAt?: {
      gte?: Date
      lte?: Date
    }
    reportadoPor?: string
    equipoId?: string
  } = {
    estado: 'NUEVO',
  }

  // Aplicar filtros si están presentes
  if (filtroFecha) {
    const fecha = new Date(filtroFecha as string)
    const startOfDay = new Date(fecha.setHours(0, 0, 0, 0))
    const endOfDay = new Date(fecha.setHours(23, 59, 59, 999))
    where.createdAt = {
      gte: startOfDay,
      lte: endOfDay,
    }
  }

  if (filtroReporter) {
    where.reportadoPor = filtroReporter as string
  }

  if (filtroEquipo) {
    where.equipoId = filtroEquipo as string
  }

  // Construir orderBy dinámico
  let orderBy: { createdAt: 'asc' | 'desc' } = { createdAt: 'desc' as const } // Default: más reciente primero

  if (ordenarPrioridad) {
    // Prioridad sorting logic: alta > media > baja
    // Priority calculation based on type and age:
    // - ALTA: tipo = "avería" y createdAt > 24h
    // - MEDIA: tipo = "avería" y createdAt 12-24h, o tipo = "reparación" y createdAt > 24h
    // - BAJA: tipo = "avería" y createdAt < 12h, o tipo = "reparación" y createdAt < 12h

    // PERFORMANCE NOTE (LOW): Current implementation fetches all reports to memory
    // and sorts in JavaScript. This works for current data volume (<1000 reports)
    // but may become inefficient with thousands of reports.
    //
    // Future optimization options:
    // - Add computed field "prioridad" to FailureReport model
    // - Use database view or materialized view for pre-calculated priorities
    // - Use database-specific expression index for custom sort logic
    // - Cache sorted results with Redis/CDN for frequent access
    //
    // For Story 2.3 scope, this approach is acceptable. Revisit if NFR-S7 (<1s)
    // performance requirement is violated with production data volumes.

    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)

    // Fetch all reports and sort in memory (custom priority logic)
    const allReports = await prisma.failureReport.findMany({
      where,
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true,
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Calculate priority for each report
    const reportsWithPriority = allReports.map((report) => {
      const _reportAge = now.getTime() - new Date(report.createdAt).getTime()
      const isOlderThan24h = new Date(report.createdAt) < twentyFourHoursAgo
      const isOlderThan12h = new Date(report.createdAt) < twelveHoursAgo

      let priority: 'alta' | 'media' | 'baja'
      if (report.tipo === 'avería' && isOlderThan24h) {
        priority = 'alta'
      } else if (
        (report.tipo === 'avería' && isOlderThan12h) ||
        (report.tipo === 'reparación' && isOlderThan24h)
      ) {
        priority = 'media'
      } else {
        priority = 'baja'
      }

      return { ...report, _priority: priority }
    })

    // Sort by priority (alta > media > baja), then by date desc
    const priorityOrder = { alta: 0, media: 1, baja: 2 }
    reportsWithPriority.sort((a, b) => {
      if (ordenarPrioridad === 'alta') {
        // Alta first
        const priorityDiff = priorityOrder[a._priority] - priorityOrder[b._priority]
        if (priorityDiff !== 0) return priorityDiff
        // Same priority: older first
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (ordenarPrioridad === 'media') {
        // Media first
        const priorityDiff = priorityOrder[a._priority] - priorityOrder[b._priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (ordenarPrioridad === 'baja') {
        // Baja first
        const priorityDiff = priorityOrder[b._priority] - priorityOrder[a._priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

    // Use sorted reports
    failureReports = reportsWithPriority as FailureReportWithRelations[]
  } else if (ordenarFecha === 'asc') {
    orderBy = { createdAt: 'asc' as const }

    // Fetch with date sorting
    failureReports = await prisma.failureReport.findMany({
      where,
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true,
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
    })
  } else {
    // Default: fetch with date desc sorting
    failureReports = await prisma.failureReport.findMany({
      where,
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true,
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
    })
  }

  return (
    <div data-testid="averias-triage" className="space-y-4">
      {/* SSE Real-time Sync Listener (AC5) */}
      <TriageColumnSSE />

      {/* Column Header with Count Badge */}
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-gray-900">
          Por Revisar ({failureReports.length})
        </h2>

        {/* Filtros y Ordenamiento (AC5) */}
        <FiltrosOrdenamiento
          reporters={uniqueReporters.map(r => r.reporter)}
          equipos={uniqueEquipos.map(e => e.equipo)}
        />
      </div>

      {/* Failure Report Cards */}
      {failureReports.length === 0 ? (
        // Empty state
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No hay averías pendientes de revisión
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Los nuevos reportes aparecerán aquí
          </p>
        </div>
      ) : (
        // Grid of cards (responsive: 1 column mobile, 2 columns desktop >1200px)
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {failureReports.map((report) => (
            <FailureReportCard
              key={report.id}
              report={report}
              tipo={report.tipo as 'avería' | 'reparación'} // Color coding NFR-S10
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
