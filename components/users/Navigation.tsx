'use client'

/**
 * Navigation Component
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Main navigation component that filters links based on user capabilities.
 * Shows only navigation items that the user has permission to access.
 *
 * Features:
 * - Filters navigation by user PBAC capabilities
 * - Active link highlighting
 * - Responsive mobile menu
 * - data-testid attributes for E2E testing
 *
 * Usage:
 * ```tsx
 * <Navigation userCapabilities={['can_create_failure_report', 'can_view_all_ots']} />
 * ```
 */

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getNavigationItems, type NavigationItem } from '@/lib/helpers/navigation'
import {
  LayoutDashboard,
  Wrench,
  Package,
  Box,
  Users,
  Clock,
  UserCog,
  FileText,
} from 'lucide-react'

interface NavigationProps {
  /**
   * Array of capability names the user has
   */
  userCapabilities?: string[]

  /**
   * Additional CSS classes for the container
   */
  className?: string
}

/**
 * Icon component mapping
 * Maps icon names to lucide-react components
 */
const iconMap = {
  LayoutDashboard,
  Wrench,
  Package,
  Box,
  Users,
  Clock,
  UserCog,
  FileText,
}

/**
 * Render a single navigation item
 * Story 1.0: Updated to use primary color (#7D1220) for active state
 */
function NavItem({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  const IconComponent = iconMap[item.icon as keyof typeof iconMap]

  return (
    <Link
      href={item.href}
      data-testid={item.testId}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-foreground'
      )}
    >
      {IconComponent && <IconComponent className="h-5 w-5" />}
      <span>{item.label}</span>
    </Link>
  )
}

/**
 * Navigation Component
 */
export function Navigation({ userCapabilities, className }: NavigationProps) {
  const pathname = usePathname()

  // Get navigation items filtered by user capabilities
  const navItems = getNavigationItems(userCapabilities)

  return (
    <nav className={cn('bg-white border-r', className)} aria-label="Main navigation" data-testid="main-navigation">
      <div className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}

        {/* Show message if user has no capabilities (shouldn't happen) */}
        {navItems.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500">
            No tienes permisos para acceder a ninguna página.
          </div>
        )}
      </div>
    </nav>
  )
}
