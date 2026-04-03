/**
 * Unit Tests for Story 3.1 - Work Order State Machine
 *
 * Pure business logic tests for state transitions
 * No database dependencies - fast execution
 */

import { describe, it, expect } from 'vitest';

// Types (would be imported from @prisma/client in production)
enum WorkOrderEstado {
  PENDIENTE = 'PENDIENTE',
  ASIGNADA = 'ASIGNADA',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

// State machine configuration
const VALID_TRANSITIONS: Record<WorkOrderEstado, WorkOrderEstado[]> = {
  [WorkOrderEstado.PENDIENTE]: [WorkOrderEstado.ASIGNADA, WorkOrderEstado.CANCELADA],
  [WorkOrderEstado.ASIGNADA]: [WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.PENDIENTE, WorkOrderEstado.CANCELADA],
  [WorkOrderEstado.EN_PROGRESO]: [WorkOrderEstado.COMPLETADA, WorkOrderEstado.ASIGNADA, WorkOrderEstado.CANCELADA],
  [WorkOrderEstado.COMPLETADA]: [], // Terminal state
  [WorkOrderEstado.CANCELADA]: [] // Terminal state
};

// Business logic functions to test
function isValidTransition(from: WorkOrderEstado, to: WorkOrderEstado): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function getValidNextStates(current: WorkOrderEstado): WorkOrderEstado[] {
  return VALID_TRANSITIONS[current] ?? [];
}

function isTerminalState(state: WorkOrderEstado): boolean {
  return VALID_TRANSITIONS[state]?.length === 0;
}

function canAssignTechnician(state: WorkOrderEstado): boolean {
  return state === WorkOrderEstado.PENDIENTE;
}

function canStartWork(state: WorkOrderEstado): boolean {
  return state === WorkOrderEstado.ASIGNADA;
}

function canCompleteWork(state: WorkOrderEstado): boolean {
  return state === WorkOrderEstado.EN_PROGRESO;
}

function canCancelWork(state: WorkOrderEstado): boolean {
  return !isTerminalState(state);
}

describe('Story 3.1 - Unit: Work Order State Machine', () => {
  describe('State Transitions', () => {
    /**
     * U1-STATE-001: PENDIENTE → ASIGNADA (valid)
     */
    it('[U1-STATE-001] should allow PENDIENTE → ASIGNADA transition', () => {
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA)).toBe(true);
    });

    /**
     * U1-STATE-002: PENDIENTE → EN_PROGRESO (invalid)
     */
    it('[U1-STATE-002] should NOT allow PENDIENTE → EN_PROGRESO transition', () => {
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.EN_PROGRESO)).toBe(false);
    });

    /**
     * U1-STATE-003: ASIGNADA → EN_PROGRESO (valid)
     */
    it('[U1-STATE-003] should allow ASIGNADA → EN_PROGRESO transition', () => {
      expect(isValidTransition(WorkOrderEstado.ASIGNADA, WorkOrderEstado.EN_PROGRESO)).toBe(true);
    });

    /**
     * U1-STATE-004: EN_PROGRESO → COMPLETADA (valid)
     */
    it('[U1-STATE-004] should allow EN_PROGRESO → COMPLETADA transition', () => {
      expect(isValidTransition(WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.COMPLETADA)).toBe(true);
    });

    /**
     * U1-STATE-005: COMPLETADA → any (invalid - terminal)
     */
    it('[U1-STATE-005] should NOT allow transitions from COMPLETADA (terminal)', () => {
      expect(isValidTransition(WorkOrderEstado.COMPLETADA, WorkOrderEstado.PENDIENTE)).toBe(false);
      expect(isValidTransition(WorkOrderEstado.COMPLETADA, WorkOrderEstado.ASIGNADA)).toBe(false);
      expect(isValidTransition(WorkOrderEstado.COMPLETADA, WorkOrderEstado.EN_PROGRESO)).toBe(false);
    });

    /**
     * U1-STATE-006: CANCELADA → any (invalid - terminal)
     */
    it('[U1-STATE-006] should NOT allow transitions from CANCELADA (terminal)', () => {
      expect(isValidTransition(WorkOrderEstado.CANCELADA, WorkOrderEstado.PENDIENTE)).toBe(false);
      expect(isValidTransition(WorkOrderEstado.CANCELADA, WorkOrderEstado.ASIGNADA)).toBe(false);
    });

    /**
     * U1-STATE-007: Any → CANCELADA (except terminal states)
     */
    it('[U1-STATE-007] should allow cancellation from non-terminal states', () => {
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.CANCELADA)).toBe(true);
      expect(isValidTransition(WorkOrderEstado.ASIGNADA, WorkOrderEstado.CANCELADA)).toBe(true);
      expect(isValidTransition(WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.CANCELADA)).toBe(true);
    });

    /**
     * U1-STATE-008: Reversión ASIGNADA → PENDIENTE
     */
    it('[U1-STATE-008] should allow ASIGNADA → PENDIENTE reversal', () => {
      expect(isValidTransition(WorkOrderEstado.ASIGNADA, WorkOrderEstado.PENDIENTE)).toBe(true);
    });

    /**
     * U1-STATE-009: Reversión EN_PROGRESO → ASIGNADA
     */
    it('[U1-STATE-009] should allow EN_PROGRESO → ASIGNADA reversal', () => {
      expect(isValidTransition(WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.ASIGNADA)).toBe(true);
    });
  });

  describe('Valid Next States', () => {
    /**
     * U1-NEXT-001: Get valid next states for PENDIENTE
     */
    it('[U1-NEXT-001] should return correct next states for PENDIENTE', () => {
      const nextStates = getValidNextStates(WorkOrderEstado.PENDIENTE);
      expect(nextStates).toEqual([WorkOrderEstado.ASIGNADA, WorkOrderEstado.CANCELADA]);
    });

    /**
     * U1-NEXT-002: Get valid next states for ASIGNADA
     */
    it('[U1-NEXT-002] should return correct next states for ASIGNADA', () => {
      const nextStates = getValidNextStates(WorkOrderEstado.ASIGNADA);
      expect(nextStates).toHaveLength(3);
      expect(nextStates).toContain(WorkOrderEstado.EN_PROGRESO);
      expect(nextStates).toContain(WorkOrderEstado.PENDIENTE);
      expect(nextStates).toContain(WorkOrderEstado.CANCELADA);
    });

    /**
     * U1-NEXT-003: Terminal states have no next states
     */
    it('[U1-NEXT-003] should return empty array for terminal states', () => {
      expect(getValidNextStates(WorkOrderEstado.COMPLETADA)).toEqual([]);
      expect(getValidNextStates(WorkOrderEstado.CANCELADA)).toEqual([]);
    });
  });

  describe('Terminal States', () => {
    /**
     * U1-TERM-001: COMPLETADA is terminal
     */
    it('[U1-TERM-001] should identify COMPLETADA as terminal', () => {
      expect(isTerminalState(WorkOrderEstado.COMPLETADA)).toBe(true);
    });

    /**
     * U1-TERM-002: CANCELADA is terminal
     */
    it('[U1-TERM-002] should identify CANCELADA as terminal', () => {
      expect(isTerminalState(WorkOrderEstado.CANCELADA)).toBe(true);
    });

    /**
     * U1-TERM-003: Non-terminal states
     */
    it('[U1-TERM-003] should identify non-terminal states', () => {
      expect(isTerminalState(WorkOrderEstado.PENDIENTE)).toBe(false);
      expect(isTerminalState(WorkOrderEstado.ASIGNADA)).toBe(false);
      expect(isTerminalState(WorkOrderEstado.EN_PROGRESO)).toBe(false);
    });
  });

  describe('Business Rules', () => {
    /**
     * U1-RULE-001: Can assign technician only from PENDIENTE
     */
    it('[U1-RULE-001] should allow technician assignment only from PENDIENTE', () => {
      expect(canAssignTechnician(WorkOrderEstado.PENDIENTE)).toBe(true);
      expect(canAssignTechnician(WorkOrderEstado.ASIGNADA)).toBe(false);
      expect(canAssignTechnician(WorkOrderEstado.EN_PROGRESO)).toBe(false);
      expect(canAssignTechnician(WorkOrderEstado.COMPLETADA)).toBe(false);
    });

    /**
     * U1-RULE-002: Can start work only from ASIGNADA
     */
    it('[U1-RULE-002] should allow start work only from ASIGNADA', () => {
      expect(canStartWork(WorkOrderEstado.ASIGNADA)).toBe(true);
      expect(canStartWork(WorkOrderEstado.PENDIENTE)).toBe(false);
      expect(canStartWork(WorkOrderEstado.EN_PROGRESO)).toBe(false);
      expect(canStartWork(WorkOrderEstado.COMPLETADA)).toBe(false);
    });

    /**
     * U1-RULE-003: Can complete work only from EN_PROGRESO
     */
    it('[U1-RULE-003] should allow complete work only from EN_PROGRESO', () => {
      expect(canCompleteWork(WorkOrderEstado.EN_PROGRESO)).toBe(true);
      expect(canCompleteWork(WorkOrderEstado.PENDIENTE)).toBe(false);
      expect(canCompleteWork(WorkOrderEstado.ASIGNADA)).toBe(false);
      expect(canCompleteWork(WorkOrderEstado.COMPLETADA)).toBe(false);
    });

    /**
     * U1-RULE-004: Can cancel from any non-terminal state
     */
    it('[U1-RULE-004] should allow cancel from any non-terminal state', () => {
      expect(canCancelWork(WorkOrderEstado.PENDIENTE)).toBe(true);
      expect(canCancelWork(WorkOrderEstado.ASIGNADA)).toBe(true);
      expect(canCancelWork(WorkOrderEstado.EN_PROGRESO)).toBe(true);
      expect(canCancelWork(WorkOrderEstado.COMPLETADA)).toBe(false);
      expect(canCancelWork(WorkOrderEstado.CANCELADA)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    /**
     * U1-EDGE-001: Same state transition (no-op)
     */
    it('[U1-EDGE-001] should NOT allow same state transition', () => {
      // Transition to same state is typically not allowed
      Object.values(WorkOrderEstado).forEach((estado) => {
        const nextStates = getValidNextStates(estado);
        expect(nextStates).not.toContain(estado);
      });
    });

    /**
     * U1-EDGE-002: Full happy path
     */
    it('[U1-EDGE-002] should validate full happy path', () => {
      // PENDIENTE → ASIGNADA → EN_PROGRESO → COMPLETADA
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.ASIGNADA)).toBe(true);
      expect(isValidTransition(WorkOrderEstado.ASIGNADA, WorkOrderEstado.EN_PROGRESO)).toBe(true);
      expect(isValidTransition(WorkOrderEstado.EN_PROGRESO, WorkOrderEstado.COMPLETADA)).toBe(true);
    });

    /**
     * U1-EDGE-003: Invalid jump over states
     */
    it('[U1-EDGE-003] should NOT allow jumping over states', () => {
      // PENDIENTE → EN_PROGRESO (skip ASIGNADA) - invalid
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.EN_PROGRESO)).toBe(false);

      // PENDIENTE → COMPLETADA (skip all) - invalid
      expect(isValidTransition(WorkOrderEstado.PENDIENTE, WorkOrderEstado.COMPLETADA)).toBe(false);

      // ASIGNADA → COMPLETADA (skip EN_PROGRESO) - invalid
      expect(isValidTransition(WorkOrderEstado.ASIGNADA, WorkOrderEstado.COMPLETADA)).toBe(false);
    });
  });
});
