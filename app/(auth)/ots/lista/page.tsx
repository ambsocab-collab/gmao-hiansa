/**
 * OT List Page
 * Story 3.3: Vista de listado de OTs
 *
 * Server Component que:
 * - Fetch WorkOrders con include: equipo, assignments
 * - Protege ruta con PBAC (can_view_all_ots)
 * - Pasa data a OTListClient (Client Component)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { OTListClient } from '@/components/ot-list/ot-list-client'

/**
 * Fetch WorkOrders con todas las relaciones necesarias para listado
 */
async function getListData() {
  const workOrders = await prisma.workOrder.findMany({
    where: {},
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
    orderBy: {
      created_at: 'desc'
    }
  })

  // Normalizar datos
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

export default async function OTListPage() {
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

  // Fetch WorkOrders
  const workOrders = await getListData()

  return (
    <div className="h-screen flex flex-col">
      <OTListClient
        workOrders={workOrders}
        canAssignTechnicians={canAssign || false}
      />
    </div>
  )
}

/**
 * Metadata para SEO
 */
export const metadata = {
  title: 'Lista de Órdenes de Trabajo | GMAO Hiansa',
  description: 'Vista de listado de órdenes de trabajo con asignaciones',
}
