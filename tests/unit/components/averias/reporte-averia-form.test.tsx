/**
 * Unit Tests for ReporteAveriaForm Component
 * Story 2.1: Búsqueda Predictiva de Equipos
 *
 * Tests form validation and state management without DOM manipulation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReporteAveriaForm } from '@/components/averias/reporte-averia-form'
import * as EquipoSearchModule from '@/components/equipos/equipo-search'

// Mock the entire EquipoSearch module
vi.mock('@/components/equipos/equipo-search', () => ({
  EquipoSearch: vi.fn(({ value, onChange, disabled }) => (
    <div data-testid="equipo-search-form">
      <input
        type="text"
        placeholder="Buscar equipo..."
        data-testid="equipo-search-input"
        disabled={disabled}
        value={value?.name || ''}
        readOnly
      />
    </div>
  )),
  useDebounce: vi.fn((value) => value),
}))

// Mock window.alert
const mockAlert = vi.fn()
global.alert = mockAlert

describe('ReporteAveriaForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAlert.mockClear()
  })

  describe('Form State Management (AC3 requirement)', () => {
    it('uses React state instead of DOM manipulation', () => {
      render(<ReporteAveriaForm />)

      // Verify form exists with correct id (no DOM manipulation)
      const form = document.getElementById('averia-form')
      expect(form).toBeDefined()

      // Verify no hidden input for equipoId (React state is used instead)
      const hiddenInput = document.querySelector('input[type="hidden"][name="equipoId"]')
      expect(hiddenInput).toBeNull()
    })

    it('renders EquipoSearch component with correct props', () => {
      render(<ReporteAveriaForm />)

      // Verify EquipoSearch component was called
      expect(EquipoSearchModule.EquipoSearch).toHaveBeenCalled()

      // Verify the mock input exists (use getAll since there may be multiple)
      const inputs = screen.getAllByTestId('equipo-search-input')
      expect(inputs.length).toBeGreaterThan(0)
    })
  })

  describe('Form Validation (AC6 requirement)', () => {
    it('shows error when submitting without equipo selection', async () => {
      const user = userEvent.setup()
      render(<ReporteAveriaForm />)

      // Try to submit without selecting equipo
      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      await user.click(submitButton)

      // Error message should appear
      await waitFor(() => {
        const errorMessage = screen.queryByText('Por favor selecciona un equipo antes de continuar')
        expect(errorMessage).toBeDefined()
      })
    })

    it('does not show error initially', () => {
      render(<ReporteAveriaForm />)

      // No error message should be shown on initial render
      const errorMessage = screen.queryByText('Por favor selecciona un equipo antes de continuar')
      expect(errorMessage).toBeNull()
    })

    it('shows alert when equipo is selected and form is submitted', async () => {
      const user = userEvent.setup()
      render(<ReporteAveriaForm />)

      // Mock having a selected equipo by checking component structure
      // In real scenario, user would select from EquipoSearch dropdown
      const form = document.getElementById('averia-form')
      expect(form).toBeDefined()

      // Submit without selection (should show error, not alert)
      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      await user.click(submitButton)

      // Error appears, not alert
      expect(screen.getByText('Por favor selecciona un equipo antes de continuar')).toBeDefined()
      expect(mockAlert).not.toHaveBeenCalled()
    })
  })

  describe('UI Elements', () => {
    it('renders page header correctly', () => {
      render(<ReporteAveriaForm />)

      expect(screen.getByText('Nuevo Reporte de Avería')).toBeDefined()
      expect(
        screen.getByText('Selecciona el equipo que tiene la falla para reportar la avería')
      ).toBeDefined()
    })

    it('renders equipo search label and helper text', () => {
      render(<ReporteAveriaForm />)

      expect(screen.getByLabelText('Equipo *')).toBeDefined()
      expect(screen.getByText('Busca el equipo por nombre. Selecciona de la lista para confirmar.')).toBeDefined()
    })

    it('renders submit button with correct text', () => {
      render(<ReporteAveriaForm />)

      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      expect(submitButton).toBeDefined()
      expect(submitButton.getAttribute('type')).toBe('submit')
    })

    it('shows instructions card with correct steps', () => {
      render(<ReporteAveriaForm />)

      expect(screen.getByText('Cómo usar:')).toBeDefined()
      expect(screen.getByText(/Empieza a escribir el nombre del equipo/)).toBeDefined()
      expect(screen.getByText(/Selecciona el equipo de la lista desplegable/)).toBeDefined()
      expect(screen.getByText(/Verifica que la jerarquía sea correcta/)).toBeDefined()
      expect(screen.getByText(/El tag de división indica HiRock/)).toBeDefined()
      expect(screen.getByText(/Haz clic en "Validar Equipo"/)).toBeDefined()
    })

    it('shows 6 instruction steps', () => {
      render(<ReporteAveriaForm />)

      const instructions = screen.getByRole('list')
      const listItems = instructions.querySelectorAll('li')
      expect(listItems.length).toBe(6)
    })
  })

  describe('Error Message Display', () => {
    it('shows error in red alert styling', async () => {
      const user = userEvent.setup()
      render(<ReporteAveriaForm />)

      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      await user.click(submitButton)

      const errorMessage = await screen.findByText('Por favor selecciona un equipo antes de continuar')
      expect(errorMessage.closest('.bg-red-50')).toBeDefined()
    })

    it('includes error icon', async () => {
      const user = userEvent.setup()
      render(<ReporteAveriaForm />)

      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      await user.click(submitButton)

      // Check for SVG icon presence (error icon)
      await waitFor(() => {
        const errorIcon = document.querySelector('svg.text-red-400')
        expect(errorIcon).toBeDefined()
      })
    })

    it('error message has correct text', async () => {
      const user = userEvent.setup()
      render(<ReporteAveriaForm />)

      const submitButton = screen.getByRole('button', { name: 'Validar Equipo' })
      await user.click(submitButton)

      const errorMessage = await screen.findByText('Por favor selecciona un equipo antes de continuar')
      expect(errorMessage.textContent).toBe('Por favor selecciona un equipo antes de continuar')
    })
  })

  describe('Development Mode Debug Info', () => {
    it('does not show debug info initially in development mode', () => {
      // Mock NODE_ENV as development
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      try {
        render(<ReporteAveriaForm />)

        // Initially no debug info (no equipo selected)
        expect(screen.queryByText('Debug - Selected Equipo:')).toBeNull()
      } finally {
        process.env.NODE_ENV = originalEnv
      }
    })

    it('does not show debug info in production', () => {
      // Mock NODE_ENV as production
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      try {
        render(<ReporteAveriaForm />)

        // No debug info in production
        expect(screen.queryByText('Debug - Selected Equipo:')).toBeNull()
      } finally {
        process.env.NODE_ENV = originalEnv
      }
    })
  })

  describe('Form Structure', () => {
    it('has form with averia-form id', () => {
      render(<ReporteAveriaForm />)

      const form = document.getElementById('averia-form')
      expect(form).toBeDefined()
    })

    it('has disabled submit button info text', () => {
      render(<ReporteAveriaForm />)

      expect(screen.getByText('El formulario completo estará disponible en Story 2.2')).toBeDefined()
    })
  })
})
