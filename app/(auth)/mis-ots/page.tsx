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

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { getMyWorkOrders } from '@/app/actions/my-work-orders'
import { MyWorkOrdersList } from '@/components/my-ots/my-ots-list'
import { prisma } from '@/lib/db'

export default async function MyWorkOrdersPage() {
  const session = await auth()

  // Verificar autenticación
  if (!session?.user) {
    redirect('/login')
  }

  // Verificar capability can_view_own_ots
  const hasCapability = session.user.capabilities.includes('can_view_own_ots')
  if (!hasCapability) {
    // Si no tiene permiso, redirect a home o mostrar error
    redirect('/')
  }

  // Fetch OTs del usuario
  const workOrders = await getMyWorkOrders()

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
          OTs asignadas para su gestión
        </p>
      </div>

      {/* Lista de OTs */}
      <MyWorkOrdersList initialWorkOrders={workOrders} allRepuestos={allRepuestos} />
    </div>
  )
}
