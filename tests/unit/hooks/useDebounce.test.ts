/**
 * Unit Tests: useDebounce Hook
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Tests the debounce hook used to prevent excessive server calls
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDebounce } from '@/components/equipos/equipo-search'

describe('useDebounce Hook', () => {
  vi.useRealTimers()

  it('should return initial value immediately', () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' }
    })

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', { timeout: 1000 }, async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' }
    })

    // Change value immediately
    rerender({ value: 'updated' })

    // Should still have old value (debounced)
    expect(result.current).toBe('initial')

    // Wait for debounce period
    await new Promise(resolve => setTimeout(resolve, 150))

    // Now should have updated value
    expect(result.current).toBe('updated')
  })

  it('should handle multiple rapid changes correctly', { timeout: 1000 }, async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' }
    })

    // Rapid changes
    rerender({ value: 'a' })
    await new Promise(resolve => setTimeout(resolve, 50))

    rerender({ value: 'ab' })
    await new Promise(resolve => setTimeout(resolve, 50))

    rerender({ value: 'abc' })
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should still have initial value or debouncing in progress
    // Wait for debounce period from last change
    await new Promise(resolve => setTimeout(resolve, 150))

    // Should have final value
    expect(result.current).toBe('abc')
  })

  it('should use custom delay', { timeout: 1000 }, async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'updated' })

    // Wait less than delay
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(result.current).toBe('initial')

    // Wait for full delay
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(result.current).toBe('updated')
  })

  it('should handle empty string', { timeout: 1000 }, async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: '' })
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(result.current).toBe('')
  })

  it('should handle undefined values', () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: undefined as string | undefined }
    })

    expect(result.current).toBe(undefined)
  })
})
