/**
 * Nuevo Usuario (New User) Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected page for admins to create new users
 * Requires can_manage_users capability
 * Features:
 * - Create user with default capability can_create_failure_report
 * - Assign 15 PBAC capabilities via checkboxes
 * - Set forcePasswordReset=true for new users
 * - Spanish interface
 * - data-testid attributes for E2E testing
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Nuevo Usuario - GMAO HiRock/Ultra',
  description: 'Registrar nuevo usuario en el sistema',
}

export default async function NuevoUsuarioPage() {
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

  // Get all available capabilities
  const capabilities = await prisma.capability.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registrar Usuario</h1>
        <p className="mt-2 text-sm text-gray-600">
          Crea un nuevo usuario en el sistema
        </p>
      </div>

      {/* Registration Form */}
      <RegisterForm capabilities={capabilities} />
    </div>
  )
}
