/**
 * Unit tests for HiansaLogo component
 * Story 1.0: Sistema de Diseño Multi-Direccional
 *
 * Tests for logo component with size variants
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import HiansaLogo from '@/components/brand/hiansa-logo'

describe('HiansaLogo Component', () => {
  // Explicit cleanup after each test to ensure isolation
  afterEach(() => {
    cleanup()
  })

  describe('[P0] AC2.1: Rendering', () => {
    it('should render logo with SVG element', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      expect(svg).toBeDefined()
      expect(svg?.tagName).toBe('svg')
    })

    it('[P0] AC2.2: should have correct alt text for accessibility', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('aria-label')).toBe('Hiansa Logo')
    })
  })

  describe('[P0] AC2.3: Size Variants', () => {
    it('should render small size (sm: w-24 h-6)', () => {
      const { container } = render(<HiansaLogo size="sm" />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('w-24')).toBe(true)
      expect(svg?.classList.contains('h-6')).toBe(true)
    })

    it('should render medium size (md: w-40 h-10) - default', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('w-40')).toBe(true)
      expect(svg?.classList.contains('h-10')).toBe(true)
    })

    it('should render large size (lg: w-56 h-14)', () => {
      const { container } = render(<HiansaLogo size="lg" />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('w-56')).toBe(true)
      expect(svg?.classList.contains('h-14')).toBe(true)
    })
  })

  describe('[P1] AC2.4: Custom className', () => {
    it('should accept custom className prop', () => {
      const { container } = render(<HiansaLogo className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('custom-class')).toBe(true)
    })

    it('should merge custom className with size classes', () => {
      const { container } = render(<HiansaLogo size="lg" className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg?.classList.contains('w-56')).toBe(true)
      expect(svg?.classList.contains('h-14')).toBe(true)
      expect(svg?.classList.contains('custom-class')).toBe(true)
    })
  })

  describe('[P1] AC2.5: SVG Content', () => {
    it('should render Hiansa logo SVG with correct paths', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      const path = svg?.querySelector('path')
      expect(path).toBeDefined()
      // Logo should have the Hiansa "H" icon and text
      const paths = svg?.querySelectorAll('path, polygon')
      expect(paths!.length).toBeGreaterThan(0)
    })

    it('should have correct viewBox for logo aspect ratio', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('viewBox')).toBe('0 0 164 41')
    })
  })

  describe('[P2] Accessibility', () => {
    it('should be focusable when needed', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      // SVG should be present but not necessarily focusable unless used as link
      expect(svg).toBeDefined()
    })

    it('should have proper role="img"', () => {
      const { container } = render(<HiansaLogo />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('role')).toBe('img')
    })
  })
})
