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
import { EditTagsClient } from '../components/EditTagsClient'
import { EditCapabilitiesClient } from '../components/EditCapabilitiesClient'

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
      userCapabilities: {
        include: { capability: true },
      },
      userTags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!user || user.deleted) {
    notFound()
  }

  // Get activity logs separately
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId: id },
    orderBy: { timestamp: 'desc' },
    take: 20,
  })

  // Get all available tags for editing
  const allTags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  const _capabilities = user.userCapabilities.map((uc: { capability: { name: string; label: string } }) => uc.capability)
  const initialCapabilities = _capabilities.map((cap) => cap.name)
  const selectedTags = user.userTags.map((ut: { tag: { id: string } }) => ut.tag.id)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/usuarios"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              ← Volver a usuarios
            </Link>
            <h1 className="text-base font-semibold text-gray-900 mt-2">
              {user.name}
            </h1>
            <p className="mt-1 text-xs text-gray-600">{user.email}</p>
          </div>
          <DeleteUserButton userId={user.id} userName={user.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Info Card */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Información Personal
            </h2>
            <dl className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-xs text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-xs text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.phone || 'No especificado'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  Contraseña Temporal
                </dt>
                <dd className="mt-1 text-xs text-gray-900">
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
                <dt className="text-xs font-medium text-gray-500">
                  Miembro desde
                </dt>
                <dd className="mt-1 text-xs text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  Último acceso
                </dt>
                <dd className="mt-1 text-xs text-gray-900">
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
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Historial de Actividad
            </h2>
            <div
              className="space-y-3"
              data-testid="activity-history"
            >
              {activityLogs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Sin actividad registrada
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {activityLogs.map((log: { id: string; action: string; timestamp: Date }) => (
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

        {/* Sidebar - Capabilities, Tags and Edit Sections */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tags Card - Story 1.3 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Etiquetas ({user.userTags.length})
            </h2>

            {user.userTags.length === 0 ? (
              <p className="text-sm text-gray-500">
                Sin etiquetas asignadas
              </p>
            ) : (
              <div
                className="flex flex-wrap gap-2"
                data-testid="usuario-etiquetas"
              >
                {user.userTags.map((userTag: { tag: { id: string; name: string; color: string } }) => (
                  <span
                    key={userTag.tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: userTag.tag.color,
                    }}
                    data-testid={`usuario-tag-${userTag.tag.name}`}
                  >
                    {userTag.tag.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Las etiquetas son solo para organización visual y no afectan
              los permisos.
            </p>
          </Card>

          {/* Edit Tags Section - Story 1.3 */}
          <EditTagsClient
            userId={user.id}
            availableTags={allTags}
            initialTags={selectedTags}
          />

          {/* Edit Capabilities Section - Story 1.2 */}
          <EditCapabilitiesClient
            userId={user.id}
            initialCapabilities={initialCapabilities}
          />
        </div>
      </div>

      {/* Confirmation Modal (would be implemented with Dialog component) */}
      {/* For now, the delete button is a placeholder */}
    </div>
  )
}
