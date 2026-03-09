/**
 * Mock Auth Provider para Tests
 * Story 0.3: NextAuth.js con Credentials Provider
 *
 * Provee un mock de SessionProvider de NextAuth para testing de componentes
 */

import { Session } from 'next-auth'
import { ReactNode } from 'react'
import { vi } from 'vitest'

/**
 * Crea una sesión mock para testing
 * @param user - Parámetros opcionales para sobrescribir valores default
 * @returns Objeto de sesión mock
 */
export function mockSession(user: Partial<Session['user']> = {}): Session {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      capabilities: ['can_view_kpis'],
      ...user
    },
    expires: '2099-12-31'
  }
}

/**
 * Crea una sesión mock con capabilities específicas
 * @param capabilities - Array de capabilities para el usuario mock
 * @returns Objeto de sesión mock con capabilities
 */
export function mockSessionWithCapabilities(capabilities: string[]): Session {
  return mockSession({ capabilities })
}

/**
 * Crea una sesión mock de administrador con todas las capabilities
 * @returns Objeto de sesión mock de admin
 */
export function mockAdminSession(): Session {
  const allCapabilities = [
    'can_create_failure_report',
    'can_create_manual_ot',
    'can_update_own_ot',
    'can_view_own_ots',
    'can_view_all_ots',
    'can_complete_ot',
    'can_manage_stock',
    'can_assign_technicians',
    'can_view_kpis',
    'can_manage_assets',
    'can_view_repair_history',
    'can_manage_providers',
    'can_manage_routines',
    'can_manage_users',
    'can_receive_reports'
  ]

  return mockSession({
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    capabilities: allCapabilities
  })
}

/**
 * Mock SessionProvider para tests
 * En una implementación real, esto envolvería {SessionProvider} de next-auth/react
 * Para tests, simplemente renderiza los children sin wrapper
 */
export function MockSessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * Hook mock para useSession
 * Retorna una sesión mock cuando se usa en tests
 */
export function mockUseSession(session?: Session) {
  return {
    data: session || mockSession(),
    status: 'authenticated' as const,
    update: vi.fn(),
    refresh: vi.fn()
  }
}
