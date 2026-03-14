/**
 * Edit User Page - Edit user capabilities
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Protected page for admins to edit user capabilities
 * Requires can_manage_users capability
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Editar Usuario - GMAO HiRock/Ultra',
  description: 'Editar capacidades de usuario',
}

interface Props {
  params: {
    id: string
  }
}

export default async function EditarUsuarioPage({ params }: Props) {
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

  // Get user to edit
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      userCapabilities: {
        include: { capability: true },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Get all available capabilities
  const capabilities = await prisma.capability.findMany({
    orderBy: { name: 'asc' },
  })

  // Get user's current capabilities
  const selectedCapabilities = user.userCapabilities.map(uc => uc.capability.name)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
        <p className="mt-2 text-sm text-gray-600">
          Editando capacidades de: {user.name}
        </p>
      </div>

      {/* Edit Form - Note: This reuses RegisterForm for simplicity */}
      {/* In a real implementation, you'd create a separate EditUserForm */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Esta página usa el mismo formulario que registro.
          Para una implementación completa, crear un EditUserForm dedicado.
        </p>
      </div>

      <RegisterForm
        capabilities={capabilities}
        userId={user.id}
        initialCapabilities={selectedCapabilities}
      />
    </div>
  )
}
