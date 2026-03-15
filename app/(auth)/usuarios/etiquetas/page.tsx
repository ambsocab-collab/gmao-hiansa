/**
 * Tags Management Page
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Protected page for admins to manage classification tags
 * Requires can_manage_users capability
 *
 * Features:
 * - Create up to 20 tags (NFR-S59)
 * - View all tags with user count
 * - Delete tags with cascade confirmation
 * - WCAG AA compliant color selection
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import CreateTagForm from '../components/CreateTagForm'
import { TagList } from '../components/TagList'

export const metadata = {
  title: 'Etiquetas - GMAO HiRock/Ultra',
  description: 'Gestión de etiquetas de clasificación',
}

export default async function TagsManagementPage() {
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

  // Get all tags with user count
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          userTags: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Check if maximum 20 tags reached
  const canCreateMoreTags = tags.length < 20

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            Etiquetas de Clasificación
          </h1>
          <p className="mt-1 text-xs text-gray-600">
            Gestiona las etiquetas para organizar visualmente a los usuarios
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {tags.length} / 20 etiquetas creadas
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          size="sm"
          disabled={!canCreateMoreTags}
        >
          <a href="/usuarios">Volver a Usuarios</a>
        </Button>
      </div>

      {/* Warning message about max tags */}
      {!canCreateMoreTags && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Has alcanzado el máximo de 20 etiquetas personalizadas.</strong>{' '}
                Elimina etiquetas existentes antes de crear nuevas.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Tag Form */}
        <div className="lg:col-span-1">
          <CreateTagForm canCreateMore={canCreateMoreTags} />
        </div>

        {/* Tags List */}
        <div className="lg:col-span-2">
          <TagList tags={tags} />
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Importante:</strong> Las etiquetas son solo para organización visual
              y no afectan los permisos. Los usuarios con la misma etiqueta pueden tener
              diferentes capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
