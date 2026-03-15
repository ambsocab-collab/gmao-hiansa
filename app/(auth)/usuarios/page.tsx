/**
 * Usuarios List Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Protected page for admins to view and manage users
 * Requires can_manage_users capability
 *
 * Features:
 * - View all users with tags
 * - Filter users by tag (AC3)
 * - Sort users by tag (AC3)
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { UsersClient } from './components/UsersClient'

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

  // Get all tags for filtering
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-xs text-gray-600">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/usuarios/etiquetas">
            <Button variant="outline" size="sm">Gestionar Etiquetas</Button>
          </Link>
          <Link href="/usuarios/nuevo">
            <Button size="sm">Crear Usuario</Button>
          </Link>
        </div>
      </div>

      {/* Users Client Component with filtering and sorting */}
      <UsersClient users={users} tags={tags} />
    </div>
  )
}
