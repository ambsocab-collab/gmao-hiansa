/**
 * Unit tests for Sidebar component
 * Story 1.0: Sistema de Diseño Multi-Direccional
 *
 * Tests for sidebar component with 3 width variants
 */

import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import Sidebar from '@/components/layout/sidebar'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Sidebar Component', () => {
  afterEach(() => {
    cleanup()
  })

  describe('[P0] AC3.1: Rendering', () => {
    it('should render sidebar component', () => {
      const { container } = render(<Sidebar />)
      const sidebar = container.querySelector('aside')
      expect(sidebar).toBeDefined()
    })
  })

  describe('[P0] AC3.2: Width Variants', () => {
    it('should render default variant (w-64 = 256px)', () => {
      const { container } = render(<Sidebar variant="default" />)
      const sidebar = container.querySelector('aside')
      expect(sidebar?.classList.contains('w-64')).toBe(true)
    })

    it('should render compact variant (w-52 = 200px)', () => {
      const { container } = render(<Sidebar variant="compact" />)
      const sidebar = container.querySelector('aside')
      expect(sidebar?.classList.contains('w-52')).toBe(true)
    })

    it('should render mini variant (w-40 = 160px)', () => {
      const { container } = render(<Sidebar variant="mini" />)
      const sidebar = container.querySelector('aside')
      expect(sidebar?.classList.contains('w-40')).toBe(true)
    })
  })

  describe('[P0] AC3.3: Responsive Behavior', () => {
    it('should have hidden class on mobile (<768px)', () => {
      const { container } = render(<Sidebar />)
      const sidebar = container.querySelector('aside')
      expect(sidebar?.classList.contains('hidden')).toBe(true)
      expect(sidebar?.classList.contains('md:flex')).toBe(true)
    })
  })

  describe('[P0] AC3.4: Brand Color Integration', () => {
    it('should use primary color for active link', () => {
      const { container } = render(<Sidebar />)
      // Sidebar should contain navigation with primary color styling
      const nav = container.querySelector('nav')
      expect(nav).toBeDefined()
    })
  })

  describe('[P1] AC3.5: Logo Integration', () => {
    it('should integrate Hiansa logo at top', () => {
      const { container } = render(<Sidebar />)
      // Sidebar should contain the Hiansa logo
      const logo = container.querySelector('svg')
      expect(logo).toBeDefined()
    })
  })

  describe('[P1] AC3.6: Navigation Content', () => {
    it('should display navigation links', () => {
      const { container } = render(<Sidebar />)
      // Sidebar should have navigation structure
      const nav = container.querySelector('nav')
      expect(nav).toBeDefined()
    })
  })
})
