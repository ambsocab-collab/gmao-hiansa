/**
 * Usuarios List Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected page for admins to view and manage users
 * Requires can_manage_users capability
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

export const metadata = {
  title: 'Usuarios - GMAO HiRock/Ultra',
  description: 'Gestión de usuarios del sistema',
}

export default async function UsuariosListPage() {
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

  // Get all users (excluding soft-deleted) with tags
  const users = await prisma.user.findMany({
    where: { deleted: false },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      forcePasswordReset: true,
      createdAt: true,
      lastLogin: true,
      userCapabilities: {
        include: { capability: true },
      },
      userTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/usuarios/etiquetas">
            <Button variant="outline">Gestionar Etiquetas</Button>
          </Link>
          <Link href="/usuarios/nuevo">
            <Button>Crear Usuario</Button>
          </Link>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200" role="list" data-testid="user-list">
          {users.map((user) => {
            const capabilities = user.userCapabilities.map(
              (uc) => uc.capability.label
            )

            return (
              <li key={user.id}>
                <Link
                  href={`/usuarios/${user.id}`}
                  className="block hover:bg-gray-50 transition"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {user.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {user.phone}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-2">
                        {/* Tags */}
                        {user.userTags.length > 0 && (
                          <div
                            className="flex flex-wrap gap-1 justify-end"
                            data-testid="usuario-etiquetas"
                          >
                            {user.userTags.map((userTag) => (
                              <span
                                key={userTag.tag.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: userTag.tag.color }}
                              >
                                {userTag.tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Capabilities count */}
                        <p className="text-xs text-gray-500">
                          {capabilities.length} capabilities
                        </p>

                        {/* Force password reset badge */}
                        {user.forcePasswordReset && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Contraseña temporal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
