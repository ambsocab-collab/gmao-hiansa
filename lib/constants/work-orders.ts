/**
 * Work Order State Transition Constants
 *
 * Defines valid state transitions for WorkOrders
 * Shared between Server Actions and Client Components
 */

import { WorkOrderEstado } from '@prisma/client'

/**
 * Valid state transitions for WorkOrders
 * Defines which states are reachable from the current state
 */
export const VALID_TRANSITIONS: Record<WorkOrderEstado, WorkOrderEstado[]> = {
  PENDIENTE: ['ASIGNADA', 'EN_PROGRESO', 'DESCARTADA'],
  ASIGNADA: ['EN_PROGRESO', 'PENDIENTE_REPUESTO', 'DESCARTADA'],
  EN_PROGRESO: ['COMPLETADA', 'PENDIENTE_PARADA', 'PENDIENTE_REPUESTO', 'DESCARTADA'],
  PENDIENTE_PARADA: ['EN_PROGRESO', 'COMPLETADA', 'DESCARTADA'],
  PENDIENTE_REPUESTO: ['EN_PROGRESO', 'DESCARTADA'],
  REPARACION_EXTERNA: ['COMPLETADA', 'DESCARTADA'],
  COMPLETADA: [], // Estado terminal
  DESCARTADA: [], // Estado terminal
}

/**
 * Action buttons for mobile modal
 * Maps states to available action buttons
 */
export const ACTION_BUTTONS: Record<WorkOrderEstado, Array<{ label: string; estado: WorkOrderEstado; variant: 'default' | 'destructive' }>> = {
  PENDIENTE: [
    { label: 'Asignar', estado: 'ASIGNADA', variant: 'default' },
    { label: 'Iniciar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  ASIGNADA: [
    { label: 'Iniciar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  EN_PROGRESO: [
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
    { label: 'Pausar', estado: 'PENDIENTE_PARADA', variant: 'default' },
  ],
  PENDIENTE_PARADA: [
    { label: 'Reanudar', estado: 'EN_PROGRESO', variant: 'default' },
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
  ],
  PENDIENTE_REPUESTO: [
    { label: 'Reanudar', estado: 'EN_PROGRESO', variant: 'default' },
  ],
  REPARACION_EXTERNA: [
    { label: 'Completar', estado: 'COMPLETADA', variant: 'default' },
  ],
  COMPLETADA: [],
  DESCARTADA: [
    { label: 'Reactivar', estado: 'PENDIENTE', variant: 'default' },
  ],
}
