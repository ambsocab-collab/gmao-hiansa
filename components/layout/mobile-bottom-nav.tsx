'use client'

/**
 * Mobile Bottom Navigation Component
 * Story 3.2: Gestión de OTs Asignadas (Mis OTs)
 *
 * Mobile-first bottom navigation bar for technicians.
 * Shows primary navigation tabs at the bottom of the screen on mobile devices.
 * Hidden on desktop (where sidebar is used instead).
 *
 * Features:
 * - Touch targets ≥44px (NFR-A3: Apple HIG compliance)
 * - Active tab highlighting with primary color
 * - PBAC capability filtering via useSession()
 * - data-testid attributes for E2E testing
 *
 * @component
 */

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getNavigationItems } from '@/lib/helpers/navigation'
import {
  LayoutDashboard,
  AlertCircle,
  CheckSquare,
  Wrench,
} from 'lucide-react'

/**
 * Icon component mapping for bottom nav
 * Uses larger icons for mobile touch targets
 */
const iconMap = {
  LayoutDashboard,
  AlertCircle,
  CheckSquare,
  Wrench,
}

/**
 * Render a single bottom nav tab
 * Touch target: ≥44px height (NFR-A3)
 */
function NavTab({
  item,
  isActive
}: {
  item: { label: string; href: string; icon: string }
  isActive: boolean
}) {
  const IconComponent = iconMap[item.icon as keyof typeof iconMap]

  return (
    <Link
      href={item.href}
      className={cn(
        // Flex layout for centering
        'flex flex-col items-center justify-center gap-1',
        // Touch target ≥44px (NFR-A3)
        'min-h-[44px] px-3 py-2',
        // Transition
        'transition-colors duration-200',
        // Colors
        isActive
          ? 'text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground'
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      data-testid={`nav-tab${item.href === '/mis-ots' ? '-mis-ots' : ''}`}
    >
      {IconComponent && (
        <IconComponent className="h-5 w-5" strokeWidth={2} />
      )}
      <span className="text-[10px] leading-tight">{item.label}</span>
    </Link>
  )
}

/**
 * Mobile Bottom Navigation Component
 *
 * Shows primary navigation items as bottom tabs on mobile devices.
 * Hidden on desktop (md breakpoint and above).
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Get user capabilities from session
  const userCapabilities = session?.user?.capabilities as string[] | undefined

  // Get navigation items filtered by user capabilities
  const allNavItems = getNavigationItems(userCapabilities)

  // Only show primary items in bottom nav (Dashboard, Reportar Avería, Mis OTs, Órdenes de Trabajo)
  const bottomNavItems = allNavItems.filter((item) =>
    ['/dashboard', '/averias/nuevo', '/mis-ots', '/ots/kanban'].includes(
      item.href
    )
  )

  // Don't render if no items to show
  if (bottomNavItems.length === 0) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Navegación móvil"
      data-testid="mobile-bottom-nav"
    >
      {/* Bottom navigation bar */}
      <div className="bg-background border-t border-border">
        <div className="grid grid-cols-4 gap-0">
          {bottomNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/') ||
              ('activePrefix' in item && item.activePrefix != null && pathname.startsWith(item.activePrefix + '/'))

            return (
              <NavTab
                key={item.href}
                item={item}
                isActive={isActive}
              />
            )
          })}
        </div>
      </div>

      {/* Safe area for iOS devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  )
}

/**
 * Export default component
 */
export default MobileBottomNav
