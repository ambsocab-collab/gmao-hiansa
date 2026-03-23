/**
 * Kanban Page
 * Story 3.1: Kanban de 8 Columnas con Drag & Drop
 *
 * Server Component que:
 * - Fetch WorkOrders con include: equipo, assignments
 * - Protege ruta con PBAC (can_view_all_ots)
 * - Pasa data a KanbanBoard (Client Component)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { KanbanBoard } from '@/components/kanban/kanban-board'

/**
 * Fetch WorkOrders con todas las relaciones necesarias para Kanban
 */
async function getKanbanData() {
  const workOrders = await prisma.workOrder.findMany({
    where: {
      // Solo OTs activas (no canceladas/completadas hace mucho tiempo)
      // Opcional: filtrar por fecha de creación
    },
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
          }
        }
      }
    },
    orderBy: {
      created_at: 'desc' // Más recientes primero
    }
  })

  // Normalizar datos para componentes (usar name/nombre consistentemente)
  return workOrders.map(wo => ({
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
}

export default async function KanbanPage() {
  // Verificar autenticación
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Verificar PBAC: can_view_all_ots
  const canViewAllOTs = session.user.capabilities?.includes('can_view_all_ots')

  if (!canViewAllOTs) {
    // Si no tiene permiso, redirigir a Mis OTs (Story 3.2) o mostrar error
    redirect('/?error=unauthorized')
  }

  // Fetch WorkOrders
  const workOrders = await getKanbanData()

  return (
    <div className="h-screen flex flex-col">
      <KanbanBoard initialWorkOrders={workOrders} />
    </div>
  )
}

/**
 * Metadata para SEO
 */
export const metadata = {
  title: 'Kanban de Órdenes de Trabajo | GMAO Hiansa',
  description: 'Vista Kanban de 8 columnas para gestión visual de órdenes de trabajo con drag & drop',
}
