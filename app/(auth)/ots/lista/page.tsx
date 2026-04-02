/**
 * OT List Page
 * Story 3.4: Vista de Listado de OTs con Filtros y Sync Real-time
 *
 * Server Component que:
 * - Fetch WorkOrders paginadas con include: equipo, assignments
 * - Protege ruta con PBAC (can_view_all_ots)
 * - Soporta filtros por 5 criterios: estado, técnico, fecha, tipo, equipo (AC2)
 * - Soporta ordenamiento por cualquier columna (AC3)
 * - Pasa data a OTListClient (Client Component)
 * - Paginación server-side: 100 OTs por página (NFR-SC4)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { OTListClient } from '@/components/ot-list/ot-list-client'
import { Prisma, WorkOrderEstado, WorkOrderTipo } from '@prisma/client'

import type { WorkOrder } from '@prisma/client'

interface OTListPageProps {
  searchParams: Promise<{
    page?: string
    // AC2: Filter params
    estado?: string
    tecnico?: string
    fechaInicio?: string
    fechaFin?: string
    tipo?: string
    equipo?: string
    // AC3: Sort params
    sortBy?: string
    sortOrder?: string
  }>
}

interface PaginationMetadata {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface FilterOption {
  id: string
  name: string
}

interface WorkOrderWithRelations extends WorkOrder {
  equipo: {
    id: string
    name: string
    code: string
    linea?: {
      id: string
      name: string
      code: string
      planta?: {
        id: string
        name: string
        code: string
        division: string
      }
    }
  }
  assignments: Array<{
    id: string
    role: string
    userId: string | null
    providerId: string | null
    user?: {
      id: string
      name: string
      email: string
    } | null
    provider?: {
      id: string
      name: string
    } | null
  }>
}

// Map URL sort param to Prisma field
const SORT_FIELD_MAP: Record<string, string> = {
  numero: 'numero',
  equipo: 'equipoId',
  estado: 'estado',
  tipo: 'tipo',
  asignados: 'assignments', // Special handling needed
  fecha: 'created_at',
}

/**
 * Fetch WorkOrders paginadas con filtros y sorting
 */
async function getListData(
  page: number = 1,
  pageSize: number = 100,
  filters: {
    estado?: string
    tecnico?: string
    fechaInicio?: string
    fechaFin?: string
    tipo?: string
    equipo?: string
  },
  sorting: {
    sortBy?: string
    sortOrder?: string
  }
): Promise<{
  workOrders: WorkOrderWithRelations[]
  pagination: PaginationMetadata
}> {
  const skip = (page - 1) * pageSize

  // Build WHERE clause for filters (AC2)
  const where: Prisma.WorkOrderWhereInput = {}

  // Estado filter
  if (filters.estado && filters.estado !== 'all') {
    where.estado = filters.estado as WorkOrderEstado
  }

  // Tipo filter
  if (filters.tipo && filters.tipo !== 'all') {
    where.tipo = filters.tipo as WorkOrderTipo
  }

  // Equipo filter
  if (filters.equipo) {
    where.equipo_id = filters.equipo
  }

  // Técnico filter
  if (filters.tecnico) {
    where.assignments = {
      some: {
        userId: filters.tecnico
      }
    }
  }

  // Fecha range filter
  if (filters.fechaInicio || filters.fechaFin) {
    where.created_at = {}
    if (filters.fechaInicio) {
      where.created_at.gte = new Date(filters.fechaInicio)
    }
    if (filters.fechaFin) {
      // Add 1 day to include the end date
      const endDate = new Date(filters.fechaFin)
      endDate.setDate(endDate.getDate() + 1)
      where.created_at.lt = endDate
    }
  }

  // Build ORDER BY clause (AC3)
  let orderBy: Prisma.WorkOrderOrderByWithRelationInput = { created_at: 'desc' }

  if (sorting.sortBy && sorting.sortOrder) {
    const sortField = SORT_FIELD_MAP[sorting.sortBy]
    if (sortField && sortField !== 'assignments') {
      orderBy = { [sortField]: sorting.sortOrder as 'asc' | 'desc' }
    } else if (sorting.sortBy === 'asignados') {
      // For assignments count sorting, we'll sort client-side or use a different approach
      // For now, use default sorting
      orderBy = { created_at: 'desc' }
    }
  }

  const [workOrders, total] = await Promise.all([
    prisma.workOrder.findMany({
      skip,
      take: pageSize,
      where,
      include: {
        equipo: {
          include: {
            linea: {
              include: {
                planta: true
              }
            }
          }
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            provider: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy
    }),
    prisma.workOrder.count({ where })
  ])

  const totalPages = Math.ceil(total / pageSize)

  // Sort by assignments count if requested (client-side sorting for this field)
  let sortedWorkOrders = workOrders.map(wo => ({
    ...wo,
    equipo: wo.equipo ? {
      ...wo.equipo,
      name: wo.equipo.name || (wo.equipo as Record<string, unknown>).nombre,
      linea: wo.equipo.linea ? {
        ...wo.equipo.linea,
        name: wo.equipo.linea.name || (wo.equipo.linea as Record<string, unknown>).nombre,
        planta: wo.equipo.linea.planta ? {
          ...wo.equipo.linea.planta,
          name: wo.equipo.linea.planta.name || (wo.equipo.linea.planta as Record<string, unknown>).nombre,
          division: wo.equipo.linea.planta.division
        } : null
      } : null
    } : null
  })) as unknown as typeof workOrders

  // Client-side sorting for assignments count
  if (sorting.sortBy === 'asignados' && sorting.sortOrder) {
    sortedWorkOrders = sortedWorkOrders.sort((a, b) => {
      const aCount = a.assignments?.length || 0
      const bCount = b.assignments?.length || 0
      return sorting.sortOrder === 'asc' ? aCount - bCount : bCount - aCount
    })
  }

  return {
    workOrders: sortedWorkOrders,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Fetch filter options for técnicos and equipos
 */
async function getFilterOptions(): Promise<{
  tecnicos: FilterOption[]
  equipos: FilterOption[]
}> {
  const [tecnicos, equipos] = await Promise.all([
    // Fetch técnicos (users with can_update_own_ot capability)
    prisma.user.findMany({
      where: {
        userCapabilities: {
          some: {
            capability: {
              name: 'can_update_own_ot'
            }
          }
        }
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    }),
    // Fetch equipos
    prisma.equipo.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  ])

  return {
    tecnicos: tecnicos.map(t => ({ id: t.id, name: t.name })),
    equipos: equipos.map(e => ({ id: e.id, name: e.name || (e as Record<string, unknown>).nombre as string }))
  }
}

export default async function OTListPage({ searchParams }: OTListPageProps) {
  // Verificar autenticación
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Verificar PBAC: can_view_all_ots
  const canViewAllOTs = session.user.capabilities?.includes('can_view_all_ots')

  if (!canViewAllOTs) {
    redirect('/?error=unauthorized')
  }

  // Check assignment capability
  const canAssign = session.user.capabilities?.includes('can_assign_technicians')

  // Obtener params de URL (Next.js 15: searchParams is a Promise)
  const resolvedSearchParams = await searchParams

  // Pagination params
  const currentPage = Math.max(1, parseInt(resolvedSearchParams?.page || '1', 10))
  const pageSize = 100 // NFR-SC4: 100 OTs por página

  // Filter params (AC2)
  const filters = {
    estado: resolvedSearchParams?.estado,
    tecnico: resolvedSearchParams?.tecnico,
    fechaInicio: resolvedSearchParams?.fechaInicio,
    fechaFin: resolvedSearchParams?.fechaFin,
    tipo: resolvedSearchParams?.tipo,
    equipo: resolvedSearchParams?.equipo,
  }

  // Sort params (AC3) - map URL param to component param
  // URL uses 'created_at', component uses 'fecha'
  const urlSortBy = resolvedSearchParams?.sortBy
  const componentSortBy = urlSortBy === 'created_at' ? 'fecha' : urlSortBy
  const sorting = {
    sortBy: componentSortBy,
    sortOrder: resolvedSearchParams?.sortOrder,
  }

  // Fetch data in parallel
  const [listData, filterOptions] = await Promise.all([
    getListData(currentPage, pageSize, filters, sorting),
    getFilterOptions()
  ])

  return (
    <div className="h-screen flex flex-col">
      <OTListClient
        workOrders={listData.workOrders}
        canAssignTechnicians={canAssign || false}
        pagination={listData.pagination}
        filterOptions={filterOptions}
      />
    </div>
  )
}

/**
 * Metadata para SEO
 */
export const metadata = {
  title: 'Lista de Órdenes de Trabajo | GMAO Hiansa',
  description: 'Vista de listado de órdenes de trabajo con filtros y asignaciones',
}
