/**
 * Perfil (Profile) Page
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Protected page for users to view and edit their own profile
 * Features:
 * - Display current profile information
 * - Edit name, email, phone
 * - Change password from profile
 * - Spanish interface
 * - data-testid attributes for E2E testing
 */

import { auth } from '@/lib/auth-adapter'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/auth/ProfileForm'

export const metadata = {
  title: 'Mi Perfil - GMAO HiRock/Ultra',
  description: 'Gestiona tu información de perfil',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      createdAt: true,
      lastLogin: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona tu información personal y contraseña
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm user={user} />
    </div>
  )
}
