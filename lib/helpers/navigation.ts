/**
 * Navigation Helper
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Provides navigation items filtered by user capabilities.
 * Used to show/hide navigation links based on PBAC.
 *
 * Usage:
 * ```tsx
 * import { getNavigationItems } from '@/lib/helpers/navigation'
 *
 * const navItems = getNavigationItems(user.capabilities)
 * ```
 */

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  /** Display name (Spanish) */
  label: string
  /** Route path */
  href: string
  /** Icon name (lucide-react) */
  icon: string
  /** Required capability to see this item */
  requiredCapability: string
  /** Optional: data-testid for E2E testing */
  testId?: string
}

/**
 * All navigation items in the system
 * Each item has a label, href, icon, and required capability
 */
const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    requiredCapability: '', // No capability required - all authenticated users
    testId: 'nav-dashboard',
  },
  // Epic 2: Gestión de Averías y Reportes Rápidos
  {
    label: 'Reportar Avería',
    href: '/averias/nuevo',
    icon: 'AlertCircle',
    requiredCapability: 'can_create_failure_report', // Story 2.2: Formulario Reporte (incluye Story 2.1 búsqueda predictiva)
    testId: 'nav-create-failure-report',
  },
  {
    label: 'Triage de Averías',
    href: '/averias/triage',
    icon: 'ClipboardList',
    requiredCapability: 'can_view_all_ots', // Story 2.3: Triage y Conversión a OTs
    testId: 'nav-triage',
  },
  // Epic 3: Órdenes de Trabajo (Kanban + Mis OTs)
  {
    label: 'Mis OTs',
    href: '/mis-ots',
    icon: 'CheckSquare',
    requiredCapability: 'can_view_own_ots', // Story 3.2: Gestión de OTs Asignadas (técnicos)
    testId: 'nav-my-ots',
  },
  {
    label: 'Órdenes de Trabajo',
    href: '/work-orders',
    icon: 'Wrench',
    requiredCapability: 'can_view_all_ots',
    testId: 'nav-work-orders',
  },
  {
    label: 'Activos/Equipos',
    href: '/assets',
    icon: 'Package',
    requiredCapability: 'can_manage_assets',
    testId: 'nav-assets',
  },
  {
    label: 'Stock de Repuestos',
    href: '/stock',
    icon: 'Box',
    requiredCapability: 'can_manage_stock',
    testId: 'nav-stock',
  },
  {
    label: 'Proveedores',
    href: '/providers',
    icon: 'Building',
    requiredCapability: 'can_manage_providers',
    testId: 'nav-providers',
  },
  {
    label: 'Rutinas de Mantenimiento',
    href: '/routines',
    icon: 'Clock',
    requiredCapability: 'can_manage_routines',
    testId: 'nav-routines',
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: 'UserCog',
    requiredCapability: 'can_manage_users',
    testId: 'nav-users',
  },
  {
    label: 'Reportes e Historial',
    href: '/reports',
    icon: 'FileText',
    requiredCapability: 'can_view_repair_history',
    testId: 'nav-reports',
  },
]

/**
 * Get navigation items filtered by user capabilities
 * @param userCapabilities - Array of capability names the user has
 * @returns Array of navigation items the user can see
 *
 * Example:
 * ```ts
 * const userCapabilities = ['can_create_failure_report', 'can_view_all_ots']
 * const navItems = getNavigationItems(userCapabilities)
 * // Returns: [{ label: 'Dashboard', ... }, { label: 'Órdenes de Trabajo', ... }]
 * ```
 */
export function getNavigationItems(
  userCapabilities: string[] | undefined
): NavigationItem[] {
  // If no capabilities provided, return only dashboard (no capability required)
  if (!userCapabilities || userCapabilities.length === 0) {
    return ALL_NAVIGATION_ITEMS.filter(
      (item) => item.requiredCapability === ''
    )
  }

  // Filter navigation items based on user capabilities
  return ALL_NAVIGATION_ITEMS.filter((item) => {
    // If no capability required, show to all authenticated users
    if (item.requiredCapability === '') {
      return true
    }

    // Otherwise, check if user has the required capability
    return userCapabilities.includes(item.requiredCapability)
  })
}

/**
 * Check if user can access a specific route
 * @param href - Route path to check
 * @param userCapabilities - Array of capability names the user has
 * @returns true if user can access the route
 *
 * Example:
 * ```ts
 * const canAccess = canAccessRoute('/assets', userCapabilities)
 * // Returns true if user has 'can_manage_assets' capability
 * ```
 */
export function canAccessRoute(
  href: string,
  userCapabilities: string[] | undefined
): boolean {
  const navItems = getNavigationItems(userCapabilities)
  return navItems.some((item) => item.href === href)
}

/**
 * Get all navigation items (for admin/debugging)
 * @returns All navigation items without filtering
 */
export function getAllNavigationItems(): NavigationItem[] {
  return ALL_NAVIGATION_ITEMS
}
