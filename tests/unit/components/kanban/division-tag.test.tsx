/**
 * P1 Unit Tests for Story 3.1 - DivisionTag Component
 *
 * Tests division tag rendering with case-insensitive matching
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DivisionTag } from '@/components/ui/division-tag'
import '@testing-library/jest-dom/vitest'

describe('DivisionTag Component', () => {
  /**
   * Test: HiRock tag renders correctly
   */
  it('P1-001: renders HiRock tag with correct styles', () => {
    render(<DivisionTag division="HIROCK" />)

    const tag = screen.getByRole('status', { name: /División: HiRock/i })
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveClass('bg-yellow-400', 'text-black', 'border-yellow-500')
  })

  /**
   * Test: Ultra tag renders correctly
   */
  it('P1-002: renders Ultra tag with correct styles', () => {
    render(<DivisionTag division="ULTRA" />)

    const tag = screen.getByRole('status', { name: /División: Ultra/i })
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveClass('bg-emerald-400', 'text-black', 'border-emerald-500')
  })

  /**
   * Test: Case-insensitive matching
   */
  it('P1-003: handles case-insensitive division matching', () => {
    const { container, rerender } = render(<DivisionTag division="hirock" />)

    // Should match HIROCK config
    let tag = container.querySelector('[role="status"]')
    expect(tag).toBeInTheDocument()
    expect(tag?.textContent).toMatch(/HiRock/i)

    rerender(<DivisionTag division="HiRock" />)
    tag = container.querySelector('[role="status"]')
    expect(tag).toBeInTheDocument()
    expect(tag?.textContent).toMatch(/HiRock/i)

    rerender(<DivisionTag division="ULTRA" />)
    tag = container.querySelector('[role="status"]')
    expect(tag).toBeInTheDocument()
    expect(tag?.textContent).toMatch(/Ultra/i)
  })

  /**
   * Test: Unknown division fallback
   */
  it('P1-004: renders fallback for unknown division', () => {
    render(<DivisionTag division="UNKNOWN" />)

    const tag = screen.getByRole('status', { name: /División: UNKNOWN/i })
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveClass('bg-gray-100', 'text-gray-700', 'border-gray-300')
  })

  /**
   * Test: Null division returns null
   */
  it('P1-005: returns null for null division', () => {
    const { container } = render(<DivisionTag division={null} />)

    expect(container.firstChild).toBeNull()
  })

  /**
   * Test: Undefined division returns null
   */
  it('P1-006: returns null for undefined division', () => {
    const { container } = render(<DivisionTag division={undefined} />)

    expect(container.firstChild).toBeNull()
  })

  /**
   * Test: ShowLabel false hides text
   */
  it('P1-007: hides label when showLabel is false', () => {
    const { container } = render(<DivisionTag division="HIROCK" showLabel={false} />)

    const tag = container.querySelector('[role="status"]')
    expect(tag).toBeInTheDocument()
    expect(tag?.textContent).toBe('')
  })
})
