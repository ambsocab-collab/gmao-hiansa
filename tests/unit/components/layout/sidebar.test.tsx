/**
 * Sidebar Component Tests
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * Tests for sidebar variants and layout optimization
 */

import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Sidebar from '@/components/layout/sidebar'

// Mock HiansaLogo to avoid SVG complexity in tests
vi.mock('@/components/brand/hiansa-logo', () => ({
  default: ({ size, className }: { size: string; className: string }) => (
    <div data-testid="hiansa-logo" data-size={size} className={className}>
      Hiansa Logo
    </div>
  ),
}))

// Mock Navigation component
vi.mock('@/components/users/Navigation', () => ({
  Navigation: ({ userCapabilities, className }: { userCapabilities?: string[]; className?: string }) => (
    <nav data-testid="navigation" data-capabilities={userCapabilities?.join(',')} className={className}>
      Navigation Links
    </nav>
  ),
}))

describe('Sidebar - Story 1.5 AC1-AC5', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('AC1: Logo Integration', () => {
    it('should NOT have Hiansa logo in sidebar (moved to header)', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      // Logo should NOT be in sidebar after Story 1.5 changes
      expect(screen.queryByTestId('hiansa-logo')).toBeNull()
    })
  })

  describe('AC2: Sidebar Compact by Default', () => {
    it('renders with compact variant (200px) when no variant specified', () => {
      render(<Sidebar userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (jsdom doesn't implement layout engine for offsetWidth)
      // E2E tests verify actual rendering in browser
      expect(sidebar.className).toContain('w-52') // 200px className
    })

    it('renders with compact variant (200px) when explicitly set', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width)
      expect(sidebar.className).toContain('w-52') // 200px className
    })

    it('renders with default variant (256px) for dashboard', () => {
      render(<Sidebar variant="default" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width)
      expect(sidebar.className).toContain('w-64') // 256px className
    })

    it('renders with mini variant (160px) for KPIs/analytics pages', () => {
      render(<Sidebar variant="mini" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width)
      expect(sidebar.className).toContain('w-40') // 160px className
    })

    it('is hidden on mobile (<768px)', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()
      expect(sidebar.className).toContain('hidden')
      expect(sidebar.className).toContain('md:flex')
    })
  })

  describe('AC3: Branding Consistency - No Redundancy', () => {
    it('shows only "GMAO" text without "Hiansa" duplicated', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      const brandText = screen.getByText('GMAO')
      expect(brandText).toBeTruthy()

      // Should NOT have "Hiansa" text in sidebar
      expect(screen.queryByText('GMAO Hiansa')).toBeNull()
      expect(screen.queryByText('Hiansa')).toBeNull()
    })

    it('does not have logo in sidebar to avoid duplication', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      // Logo should NOT be in sidebar after Story 1.5
      expect(screen.queryByTestId('hiansa-logo')).toBeNull()
    })
  })

  describe('AC4: Footer Optimization', () => {
    it('should NOT have footer in sidebar (redundant with main footer)', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      // Sidebar should NOT have "powered by hiansa BSC" text
      expect(screen.queryByText('powered by hiansa BSC')).toBeNull()
    })
  })

  describe('AC5: Layout by Direction', () => {
    it('supports default variant for dashboard (256px)', () => {
      render(<Sidebar variant="default" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width in browser)
      expect(sidebar.className).toContain('w-64') // 256px className
    })

    it('supports compact variant for kanban (200px)', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_kanban']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width in browser)
      expect(sidebar.className).toContain('w-52') // 200px className
    })

    it('supports mini variant for KPIs/analytics (160px)', () => {
      render(<Sidebar variant="mini" userCapabilities={['can_view_kpis']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()

      // HIGH Issue 4: Verify className (E2E tests verify actual pixel width in browser)
      expect(sidebar.className).toContain('w-40') // 160px className
    })

    it('passes userCapabilities to Navigation component', () => {
      const capabilities = ['can_view_dashboard', 'can_create_ot', 'can_view_users']
      render(<Sidebar variant="compact" userCapabilities={capabilities} />)

      const navigation = screen.getByTestId('navigation')
      expect(navigation).toBeTruthy()
      expect(navigation.getAttribute('data-capabilities')).toBe(capabilities.join(','))
    })
  })

  describe('Responsive Behavior', () => {
    it('applies hidden on mobile and flex on md breakpoint', () => {
      render(<Sidebar variant="compact" userCapabilities={['can_view_dashboard']} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toBeTruthy()
      expect(sidebar.className).toContain('hidden')
      expect(sidebar.className).toContain('md:flex')
    })
  })
})
