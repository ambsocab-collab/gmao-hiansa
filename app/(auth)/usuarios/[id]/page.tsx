/**
 * Usuario Detail Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected page for admins to view and manage individual users
 * Requires can_manage_users capability
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { DeleteUserButton } from '@/components/users/DeleteUserButton'

export const metadata = {
  title: 'Detalle de Usuario - GMAO HiRock/Ultra',
  description: 'Ver y gestionar información de usuario',
}

export default async function UsuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Check can_manage_users capability
  const hasManageUsersCapability = session.user.capabilities?.includes(
    'can_manage_users'
  )

  if (!hasManageUsersCapability) {
    redirect('/dashboard')
  }

  // Await params (Next.js 15 requirement)
  const { id } = await params

  // Get user with details
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      user_capabilities: {
        include: { capability: true },
      },
      activity_logs: {
        orderBy: { timestamp: 'desc' },
        take: 20,
      },
    },
  })

  if (!user || user.deleted) {
    notFound()
  }

  const capabilities = user.user_capabilities.map((uc: { capability: { name: string; label: string } }) => uc.capability)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/usuarios"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver a usuarios
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {user.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{user.email}</p>
          </div>
          <DeleteUserButton userId={user.id} userName={user.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información Personal
            </h2>
            <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.phone || 'No especificado'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Contraseña Temporal
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.forcePasswordReset ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sí - debe cambiarla
                    </span>
                  ) : (
                    'No'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Miembro desde
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Último acceso
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Nunca'}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Activity History Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Historial de Actividad
            </h2>
            <div
              className="space-y-4"
              data-testid="activity-history"
            >
              {user.activity_logs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Sin actividad registrada
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {user.activity_logs.map((log) => (
                    <li key={log.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {log.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* TODO: Work History Card (AC 32 - Story 1.1)
           *
           * Pending feature: Implement complete work history display
           * - OTs completadas (work orders completed by user)
           * - OTs en progreso (work orders currently assigned)
           * - MTTR (Mean Time To Repair) metric
           * - Productividad metrics (completion rate, avg completion time)
           * - Filtros por rango de fechas (date range filters)
           *
           * Requires Epic 3 (Work Orders) to be implemented first
           * Related models: WorkOrder, WorkOrderStatus
           *
           * Story task reference: línea 190, 191
           */}
        </div>

        {/* Capabilities */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Capabilities ({capabilities.length})
            </h2>
            <div className="space-y-3">
              {capabilities.map((capability: { name: string; label: string }) => (
                <div
                  key={capability.name}
                  className="flex items-start space-x-3 p-3 border rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {capability.label}
                    </p>
                    <code className="text-xs text-gray-500 block mt-1">
                      {capability.name}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal (would be implemented with Dialog component) */}
      {/* For now, the delete button is a placeholder */}
    </div>
  )
}
