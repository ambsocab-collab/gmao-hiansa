/**
 * Sidebar Variant Configuration by Route
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * Defines which sidebar variant to use for each route based on
 * the multi-directional design system (Story 1.0 + Story 1.5).
 *
 * Sidebar Variants:
 * - default: 256px (w-64) - Dashboard clásico, páginas estándar
 * - compact: 200px (w-52) - Kanban First, páginas con mucho contenido horizontal
 * - mini: 160px (w-40) - Data Heavy, páginas con tablas anchas y gráficos
 *
 * @see Story 1.0 AC5: Sistema Multi-Direccional
 * @see Story 1.5 AC5: Layout por Dirección
 */

import { headers } from 'next/headers'

export type SidebarVariant = 'default' | 'compact' | 'mini'

/**
 * Pathname header name injected by middleware (Story 1.5)
 * Used by getSidebarVariant() to determine current route
 */
export const PATHNAME_HEADER = 'x-pathname'

/**
 * Route to sidebar variant mapping
 * Based on multi-directional design patterns from Story 1.0
 */
const ROUTE_VARIANTS: Record<string, SidebarVariant> = {
  // Dirección 1: Dashboard Clásico (256px)
  '/dashboard': 'default',

  // Dirección 2: Kanban First (200px)
  '/kanban': 'compact',

  // Dirección 4: Data Heavy (160px)
  '/kpis': 'mini',
  '/analytics': 'mini',

  // Default: Compact (200px) - Story 1.5 default
  // This includes: /assets, /usuarios, /reports, /perfil, /cambiar-password
}

/**
 * Get the sidebar variant for the current route
 * Uses pathname from headers to determine which variant to use
 *
 * SERVER-ONLY: This function uses Next.js headers() which only works server-side
 * Client components should receive the variant as a prop from server components
 *
 * Architecture:
 * - Middleware injects x-pathname header for all requests (see middleware.ts)
 * - Layout calls getSidebarVariant() to get variant for current route
 * - Variant determined by ROUTE_VARIANTS configuration or fallback to 'compact'
 *
 * Handles:
 * - Query parameters (e.g., /dashboard?date=2026-03-15) → stripped before matching
 * - Sub-paths (e.g., /assets/123) → uses parent route variant or 'compact' fallback
 * - Trailing slashes (e.g., /dashboard/) → normalized before matching
 * - Missing x-pathname header → returns 'compact' fallback (defensive programming)
 *
 * @returns SidebarVariant - The variant to use for the current route
 *
 * @example
 * ```tsx
 * // ✅ CORRECT: In Server Component (layout.tsx, page.tsx)
 * const variant = getSidebarVariant() // 'default' for /dashboard, 'compact' for /kanban
 * <Sidebar variant={variant} />
 *
 * // ❌ INCORRECT: In Client Component ('use client')
 * // This will throw: "headers() only works in Server Components"
 * // Instead, pass variant as prop from parent server component
 * ```
 */
export function getSidebarVariant(): SidebarVariant {
  try {
    // Get current pathname from headers (server-side)
    // Header is injected by middleware.ts:PATHNAME_HEADER
    const headersList = headers()
    const pathname = headersList.get(PATHNAME_HEADER) || '/dashboard'

    // Remove query parameters if present
    const pathWithoutQuery = pathname.split('?')[0]

    // Remove trailing slash for consistent matching
    const normalizedPath = pathWithoutQuery.endsWith('/')
      ? pathWithoutQuery.slice(0, -1)
      : pathWithoutQuery

    // Check for exact match first
    if (ROUTE_VARIANTS[normalizedPath]) {
      return ROUTE_VARIANTS[normalizedPath]
    }

    // Check for partial match (sub-paths)
    // Find the longest matching route prefix
    const matchingRoute = Object.keys(ROUTE_VARIANTS)
      .filter(route => normalizedPath.startsWith(route + '/'))
      .sort((a, b) => b.length - a.length)[0] // Longest match first

    if (matchingRoute) {
      return ROUTE_VARIANTS[matchingRoute]
    }

    // Fallback to 'compact' (Story 1.5 default for unconfigured routes)
    return 'compact'
  } catch {
    // Defensive fallback to 'compact' if headers are not available
    // This can happen during build time or in unexpected error conditions
    // Note: Next.js throws error if headers() called from client component
    return 'compact'
  }
}

/**
 * Get all configured routes for a specific variant
 * Useful for debugging and documentation
 *
 * @param variant - The variant to get routes for
 * @returns Array of route paths that use this variant
 *
 * @example
 * ```tsx
 * const compactRoutes = getRoutesForVariant('compact')
 * // ['/kanban', '/assets', '/usuarios', ...]
 * ```
 */
export function getRoutesForVariant(variant: SidebarVariant): string[] {
  return Object.entries(ROUTE_VARIANTS)
    .filter(([_, v]) => v === variant)
    .map(([route, _]) => route)
}

/**
 * Get the sidebar variant for a specific route
 * Useful for testing and documentation
 *
 * @param pathname - The route path to get variant for
 * @returns SidebarVariant or undefined if not configured
 *
 * @example
 * ```tsx
 * const variant = getVariantForRoute('/dashboard')
 * // 'default'
 * ```
 */
export function getVariantForRoute(pathname: string): SidebarVariant | undefined {
  return ROUTE_VARIANTS[pathname]
}
