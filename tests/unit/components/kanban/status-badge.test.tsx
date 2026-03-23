/**
 * P1 Unit Tests for Story 3.1 - StatusBadge Component
 *
 * Tests status badge rendering for all 8 WorkOrder states
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StatusBadge } from '@/components/ui/status-badge'
import { WorkOrderEstado } from '@prisma/client'
import '@testing-library/jest-dom/vitest'

describe('StatusBadge Component', () => {
  /**
   * Test: PENDIENTE badge
   */
  it('P1-008: renders PENDIENTE badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.PENDIENTE} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Pendiente')
  })

  /**
   * Test: ASIGNADA badge
   */
  it('P1-009: renders ASIGNADA badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.ASIGNADA} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Asignada')
  })

  /**
   * Test: EN_PROGRESO badge
   */
  it('P1-010: renders EN_PROGRESO badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.EN_PROGRESO} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('En Progreso')
  })

  /**
   * Test: COMPLETADA badge
   */
  it('P1-011: renders COMPLETADA badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.COMPLETADA} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Completada')
  })

  /**
   * Test: DESCARTADA badge
   */
  it('P1-012: renders DESCARTADA badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.DESCARTADA} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Cancelada')
  })

  /**
   * Test: PENDIENTE_REPUESTO badge
   */
  it('P1-013: renders PENDIENTE_REPUESTO badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.PENDIENTE_REPUESTO} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Pendiente Repuesto')
  })

  /**
   * Test: PENDIENTE_PARADA badge
   */
  it('P1-014: renders PENDIENTE_PARADA badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.PENDIENTE_PARADA} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Pendiente Parada')
  })

  /**
   * Test: REPARACION_EXTERNA badge
   */
  it('P1-015: renders REPARACION_EXTERNA badge correctly', () => {
    const { container } = render(<StatusBadge estado={WorkOrderEstado.REPARACION_EXTERNA} />)

    const badge = container.querySelector('[data-testid="status-badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Reparación Externa')
  })

  /**
   * Test: All badges have aria-label
   */
  it('P1-016: all badges have accessibility labels', () => {
    const estados = Object.values(WorkOrderEstado)

    estados.forEach(estado => {
      const { unmount, container } = render(<StatusBadge estado={estado} />)

      const badge = container.querySelector('[role="status"]')
      expect(badge).toHaveAttribute('aria-label')

      unmount()
    })
  })
})
