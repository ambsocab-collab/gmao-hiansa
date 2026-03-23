/**
 * P1 Unit Tests for Story 3.1 - OTCard Component
 *
 * Tests OT card rendering with different variants and data
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OTCard } from '@/components/kanban/ot-card'
import { WorkOrder, WorkOrderEstado, WorkOrderTipo } from '@prisma/client'
import '@testing-library/jest-dom/vitest'

// Mock @dnd-kit for testing
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    setNodeRef: vi.fn(),
    attributes: {},
    listeners: {},
    isDragging: false,
    transform: null,
    transition: null,
  }),
}))

describe('OTCard Component', () => {
  const mockWorkOrder: WorkOrder = {
    id: 'ot-123',
    numero: 'OT-2024-001',
    tipo: WorkOrderTipo.PREVENTIVO,
    estado: WorkOrderEstado.EN_PROGRESO,
    prioridad: 'MEDIA',
    descripcion: 'Mantenimiento preventivo de equipo',
    equipo_id: 'eq-123',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-02'),
    completed_at: null,
    failure_report_id: null,
    parent_work_order_id: null,
    equipo: {
      id: 'eq-123',
      name: 'Compresor Principal',
      code: 'CP-001',
      linea_id: 'line-123',
      estado: 'OPERATIVO',
      linea: {
        id: 'line-123',
        name: 'Línea 1',
        code: 'L1',
        planta_id: 'plant-123',
        planta: {
          id: 'plant-123',
          name: 'Planta Central',
          code: 'PC',
          division: 'HIROCK',
        },
      },
    },
    assignments: [],
    failure_report: null,
    child_work_orders: [],
    parent_work_order: null,
  }

  /**
   * Test: Renders card with basic data
   */
  it('P1-017: renders card with basic work order data', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    expect(container.textContent).toContain('OT-2024-001')
    expect(container.textContent).toMatch(/Mantenimiento preventivo/i)
  })

  /**
   * Test: Shows equipment name
   */
  it('P1-018: displays equipment name', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    expect(container.textContent).toContain('Compresor Principal')
  })

  /**
   * Test: Shows Preventivo type label
   */
  it('P1-019: shows Preventivo label for preventive work orders', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    const typeLabel = Array.from(container.querySelectorAll('span, div')).find(
      el => el.textContent === 'Preventivo'
    )
    expect(typeLabel).toBeInTheDocument()
    expect(typeLabel?.classList).toContain('bg-green-100')
  })

  /**
   * Test: Shows Correctivo type label
   */
  it('P1-020: shows Correctivo label for corrective work orders', () => {
    const correctiveWO = { ...mockWorkOrder, tipo: WorkOrderTipo.CORRECTIVO }

    const { container } = render(<OTCard workOrder={correctiveWO} />)

    const typeLabel = Array.from(container.querySelectorAll('span, div')).find(
      el => el.textContent === 'Correctivo'
    )
    expect(typeLabel).toBeInTheDocument()
    expect(typeLabel?.classList).toContain('bg-red-100')
  })

  /**
   * Test: Displays division tag
   */
  it('P1-021: displays division tag', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    const divisionTag = container.querySelector('[role="status"][aria-label*="HiRock"]')
    expect(divisionTag).toBeInTheDocument()
  })

  /**
   * Test: Has correct data-testid
   */
  it('P1-022: has correct data-testid attribute', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    const card = container.querySelector('[data-testid="ot-card-ot-123"]')
    expect(card).toBeInTheDocument()
  })

  /**
   * Test: Shows assigned technicians
   */
  it('P1-023: displays assigned technicians', () => {
    const woWithAssignments = {
      ...mockWorkOrder,
      assignments: [
        {
          work_order_id: 'ot-123',
          userId: 'user-1',
          role: 'TECNICO',
          created_at: new Date(),
          user: {
            id: 'user-1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
          },
        },
      ],
    }

    const { container } = render(<OTCard workOrder={woWithAssignments} />)

    expect(container.textContent).toContain('Juan Pérez')
  })

  /**
   * Test: Compact variant on mobile
   */
  it('P1-024: renders compact variant when isCompact is true', () => {
    const { container } = render(
      <OTCard workOrder={mockWorkOrder} isCompact={true} />
    )

    const card = container.querySelector('[data-testid="ot-card-ot-123"]')
    expect(card).toBeInTheDocument()
    // Compact variant should have left border
    expect(card?.getAttribute('style')).toContain('border-left')
  })

  /**
   * Test: Default variant (desktop)
   */
  it('P1-025: renders default variant when isCompact is false', () => {
    const { container } = render(
      <OTCard workOrder={mockWorkOrder} isCompact={false} />
    )

    const card = container.firstChild as HTMLElement
    expect(card).toBeInTheDocument()
    expect(card.classList).toContain('cursor-grab')
  })

  /**
   * Test: Click handler is called
   */
  it('P1-026: calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    const { container } = render(<OTCard workOrder={mockWorkOrder} onClick={onClick} />)

    const card = container.querySelector('[data-testid="ot-card-ot-123"]') as HTMLElement
    await user.click(card)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  /**
   * Test: Has left border colored by status
   */
  it('P1-027: has left border with color matching status', () => {
    const { container } = render(<OTCard workOrder={mockWorkOrder} />)

    const card = container.querySelector('[data-testid="ot-card-ot-123"]') as HTMLElement
    expect(card).toBeInTheDocument()
    // Verificar que tiene estilo de borde izquierdo
    expect(card.style.borderLeftWidth).toBe('4px')
    expect(card.style.borderLeftStyle).toBe('solid')
  })
})
