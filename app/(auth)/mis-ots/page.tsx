/**
 * Mis OTs Page
 *
 * Story 3.2: Gestión de OTs Asignadas
 * AC1: Vista de "Mis OTs" filtrada por asignaciones
 *
 * Server Component que:
 * - Fetch OTs del usuario actual via getMyWorkOrders()
 * - Protege ruta con PBAC (can_view_own_ots)
 * - Pasa data a MyWorkOrdersList (Client Component)
 * - Layout responsive: Sidebar (desktop), bottom nav (mobile)
 */

import { getMyWorkOrders } from '@/app/actions/my-work-orders'
import { MyWorkOrdersList } from '@/components/my-ots/my-ots-list'
import { prisma } from '@/lib/db'

export default async function MyWorkOrdersPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  // Parse page from URL query params (default: 1)
  // Validate: must be a positive integer, NaN defaults to 1
  const rawPage = parseInt(searchParams.page || '1')
  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage)

  // getMyWorkOrders() handles authentication and capability checks internally
  // The layout also already redirects unauthenticated users
  const { workOrders, pagination } = await getMyWorkOrders(page)

  // Fetch all repuestos for the dropdown
  const allRepuestos = await prisma.repuesto.findMany({
    select: {
      id: true,
      name: true,
      stock: true,
      ubicacion_fisica: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Mis Órdenes de Trabajo
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          OTs asignadas para su gestión ({pagination.total} total)
        </p>
      </div>

      {/* Lista de OTs */}
      <MyWorkOrdersList
        initialWorkOrders={workOrders}
        initialPagination={pagination}
        allRepuestos={allRepuestos}
      />
    </div>
  )
}
