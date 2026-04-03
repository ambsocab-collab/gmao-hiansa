/**
 * Unit Tests for Story 3.3 - Skill Validator
 *
 * Pure business logic tests for skill validation and assignment rules
 * No database dependencies - fast execution
 */

import { describe, it, expect } from 'vitest';

// Types
interface Skill {
  id: string;
  name: string;
  category?: string;
}

interface User {
  id: string;
  name: string;
  role: 'TECNICO' | 'SUPERVISOR' | 'ADMIN' | 'PROVEEDOR';
  skills: Skill[];
  activeAssignments: number;
}

interface WorkOrder {
  id: string;
  tipo: 'CORRECTIVO' | 'PREVENTIVO' | 'PREDICTIVO';
  requiredSkills: string[];
  prioridad: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';
}

// Business logic functions to test
function hasRequiredSkill(user: User, skillName: string): boolean {
  return user.skills.some(skill => skill.name === skillName);
}

function hasAllRequiredSkills(user: User, requiredSkills: string[]): boolean {
  return requiredSkills.every(skill => hasRequiredSkill(user, skill));
}

function getMissingSkills(user: User, requiredSkills: string[]): string[] {
  return requiredSkills.filter(skill => !hasRequiredSkill(user, skill));
}

function canAssignToUser(user: User, workOrder: WorkOrder): { canAssign: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check skills
  const missingSkills = getMissingSkills(user, workOrder.requiredSkills);
  if (missingSkills.length > 0) {
    reasons.push(`Skills faltantes: ${missingSkills.join(', ')}`);
  }

  // Check overload
  const maxAssignments = getMaxAssignments(user.role);
  if (user.activeAssignments >= maxAssignments) {
    reasons.push(`Usuario sobrecargado (${user.activeAssignments}/${maxAssignments} asignaciones)`);
  }

  // Check role
  if (user.role === 'PROVEEDOR') {
    reasons.push('Proveedores externos no pueden ser asignados directamente');
  }

  return {
    canAssign: reasons.length === 0,
    reasons
  };
}

function getMaxAssignments(role: User['role']): number {
  const limits: Record<User['role'], number> = {
    TECNICO: 5,
    SUPERVISOR: 3,
    ADMIN: 10,
    PROVEEDOR: 0
  };
  return limits[role];
}

function isUserOverloaded(user: User): boolean {
  return user.activeAssignments >= getMaxAssignments(user.role);
}

function getWorkloadPercentage(user: User): number {
  const max = getMaxAssignments(user.role);
  if (max === 0) return 100;
  return Math.min(100, (user.activeAssignments / max) * 100);
}

function suggestBestTechnician(
  users: User[],
  workOrder: WorkOrder
): { user: User | null; score: number; reasons: string[] } {
  const candidates = users
    .filter(u => u.role === 'TECNICO' || u.role === 'SUPERVISOR')
    .map(user => {
      let score = 100;
      const reasons: string[] = [];

      // Skills match
      const missingSkills = getMissingSkills(user, workOrder.requiredSkills);
      if (missingSkills.length > 0) {
        score -= 50 * missingSkills.length;
        reasons.push(`Faltan ${missingSkills.length} skills`);
      }

      // Workload
      const workload = getWorkloadPercentage(user);
      score -= workload * 0.5; // Lower score for higher workload
      reasons.push(`Carga de trabajo: ${workload}%`);

      return { user, score: Math.max(0, score), reasons };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0] || { user: null, score: 0, reasons: ['No hay candidatos disponibles'] };
}

describe('Story 3.3 - Unit: Skill Validator', () => {
  // Test fixtures
  const createSkill = (name: string, category?: string): Skill => ({
    id: `skill-${name.toLowerCase()}`,
    name,
    category
  });

  const createUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-001',
    name: 'Juan Técnico',
    role: 'TECNICO',
    skills: [createSkill('ELECTRICIDAD'), createSkill('MECANICA')],
    activeAssignments: 2,
    ...overrides
  });

  const createWorkOrder = (overrides: Partial<WorkOrder> = {}): WorkOrder => ({
    id: 'wo-001',
    tipo: 'CORRECTIVO',
    requiredSkills: ['ELECTRICIDAD'],
    prioridad: 'MEDIA',
    ...overrides
  });

  describe('Skill Matching', () => {
    /**
     * U3-SKILL-001: User has required skill
     */
    it('[U3-SKILL-001] should detect user has required skill', () => {
      const user = createUser();
      expect(hasRequiredSkill(user, 'ELECTRICIDAD')).toBe(true);
    });

    /**
     * U3-SKILL-002: User does NOT have required skill
     */
    it('[U3-SKILL-002] should detect user does NOT have required skill', () => {
      const user = createUser();
      expect(hasRequiredSkill(user, 'HIDRAULICA')).toBe(false);
    });

    /**
     * U3-SKILL-003: Case sensitive skill matching
     */
    it('[U3-SKILL-003] should match skills case sensitively', () => {
      const user = createUser();
      expect(hasRequiredSkill(user, 'electricidad')).toBe(false);
      expect(hasRequiredSkill(user, 'ELECTRICIDAD')).toBe(true);
    });

    /**
     * U3-SKILL-004: User has all required skills
     */
    it('[U3-SKILL-004] should detect user has all required skills', () => {
      const user = createUser();
      expect(hasAllRequiredSkills(user, ['ELECTRICIDAD', 'MECANICA'])).toBe(true);
    });

    /**
     * U3-SKILL-005: User missing some required skills
     */
    it('[U3-SKILL-005] should detect user missing some required skills', () => {
      const user = createUser();
      expect(hasAllRequiredSkills(user, ['ELECTRICIDAD', 'HIDRAULICA'])).toBe(false);
    });

    /**
     * U3-SKILL-006: Empty required skills always matches
     */
    it('[U3-SKILL-006] should match when no skills required', () => {
      const user = createUser({ skills: [] });
      expect(hasAllRequiredSkills(user, [])).toBe(true);
    });
  });

  describe('Missing Skills Detection', () => {
    /**
     * U3-MISS-001: Get missing skills list
     */
    it('[U3-MISS-001] should return list of missing skills', () => {
      const user = createUser();
      const missing = getMissingSkills(user, ['ELECTRICIDAD', 'HIDRAULICA', 'NEUMATICA']);
      expect(missing).toEqual(['HIDRAULICA', 'NEUMATICA']);
    });

    /**
     * U3-MISS-002: No missing skills when all present
     */
    it('[U3-MISS-002] should return empty array when no missing skills', () => {
      const user = createUser();
      const missing = getMissingSkills(user, ['ELECTRICIDAD']);
      expect(missing).toEqual([]);
    });

    /**
     * U3-MISS-003: All skills missing when user has none
     */
    it('[U3-MISS-003] should return all skills as missing when user has none', () => {
      const user = createUser({ skills: [] });
      const missing = getMissingSkills(user, ['ELECTRICIDAD', 'MECANICA']);
      expect(missing).toEqual(['ELECTRICIDAD', 'MECANICA']);
    });
  });

  describe('Assignment Validation', () => {
    /**
     * U3-ASSIGN-001: Can assign when all requirements met
     */
    it('[U3-ASSIGN-001] should allow assignment when all requirements met', () => {
      const user = createUser({ activeAssignments: 2 });
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });
      const result = canAssignToUser(user, wo);
      expect(result.canAssign).toBe(true);
      expect(result.reasons).toHaveLength(0);
    });

    /**
     * U3-ASSIGN-002: Cannot assign with missing skills
     */
    it('[U3-ASSIGN-002] should NOT allow assignment with missing skills', () => {
      const user = createUser({ skills: [createSkill('MECANICA')] });
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });
      const result = canAssignToUser(user, wo);
      expect(result.canAssign).toBe(false);
      expect(result.reasons[0]).toContain('Skills faltantes');
    });

    /**
     * U3-ASSIGN-003: Cannot assign overloaded user
     */
    it('[U3-ASSIGN-003] should NOT allow assignment when user overloaded', () => {
      const user = createUser({ activeAssignments: 5 }); // Max for TECNICO
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });
      const result = canAssignToUser(user, wo);
      expect(result.canAssign).toBe(false);
      expect(result.reasons[0]).toContain('sobrecargado');
    });

    /**
     * U3-ASSIGN-004: Cannot assign PROVEEDOR
     */
    it('[U3-ASSIGN-004] should NOT allow assignment of PROVEEDOR', () => {
      const user = createUser({ role: 'PROVEEDOR' });
      const wo = createWorkOrder({ requiredSkills: [] });
      const result = canAssignToUser(user, wo);
      expect(result.canAssign).toBe(false);
      expect(result.reasons).toContain('Proveedores externos no pueden ser asignados directamente');
    });

    /**
     * U3-ASSIGN-005: Multiple rejection reasons
     */
    it('[U3-ASSIGN-005] should return multiple rejection reasons', () => {
      const user = createUser({
        skills: [],
        activeAssignments: 5,
        role: 'TECNICO'
      });
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });
      const result = canAssignToUser(user, wo);
      expect(result.canAssign).toBe(false);
      expect(result.reasons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Workload Management', () => {
    /**
     * U3-WORK-001: Detect overloaded technician
     */
    it('[U3-WORK-001] should detect overloaded technician', () => {
      const user = createUser({ activeAssignments: 5 });
      expect(isUserOverloaded(user)).toBe(true);
    });

    /**
     * U3-WORK-002: Not overloaded when below limit
     */
    it('[U3-WORK-002] should NOT detect overload when below limit', () => {
      const user = createUser({ activeAssignments: 3 });
      expect(isUserOverloaded(user)).toBe(false);
    });

    /**
     * U3-WORK-003: Calculate workload percentage
     */
    it('[U3-WORK-003] should calculate workload percentage', () => {
      const user = createUser({ activeAssignments: 2 }); // 2/5 = 40%
      expect(getWorkloadPercentage(user)).toBe(40);
    });

    /**
     * U3-WORK-004: Workload capped at 100%
     */
    it('[U3-WORK-004] should cap workload at 100%', () => {
      const user = createUser({ activeAssignments: 10 });
      expect(getWorkloadPercentage(user)).toBe(100);
    });

    /**
     * U3-WORK-005: Different limits by role
     */
    it('[U3-WORK-005] should have different limits by role', () => {
      expect(getMaxAssignments('TECNICO')).toBe(5);
      expect(getMaxAssignments('SUPERVISOR')).toBe(3);
      expect(getMaxAssignments('ADMIN')).toBe(10);
      expect(getMaxAssignments('PROVEEDOR')).toBe(0);
    });
  });

  describe('Technician Suggestion', () => {
    /**
     * U3-SUGGEST-001: Suggest best available technician
     */
    it('[U3-SUGGEST-001] should suggest best available technician', () => {
      const users = [
        createUser({ id: 'u1', name: 'Técnico 1', skills: [createSkill('ELECTRICIDAD')], activeAssignments: 4 }),
        createUser({ id: 'u2', name: 'Técnico 2', skills: [createSkill('ELECTRICIDAD')], activeAssignments: 1 })
      ];
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });

      const result = suggestBestTechnician(users, wo);
      expect(result.user?.name).toBe('Técnico 2'); // Lower workload
    });

    /**
     * U3-SUGGEST-002: Prefer technician with skills over lower workload
     */
    it('[U3-SUGGEST-002] should prefer skills over lower workload', () => {
      const users = [
        createUser({ id: 'u1', name: 'Sin Skills', skills: [], activeAssignments: 0 }),
        createUser({ id: 'u2', name: 'Con Skills', skills: [createSkill('ELECTRICIDAD')], activeAssignments: 4 })
      ];
      const wo = createWorkOrder({ requiredSkills: ['ELECTRICIDAD'] });

      const result = suggestBestTechnician(users, wo);
      expect(result.user?.name).toBe('Con Skills');
    });

    /**
     * U3-SUGGEST-003: No candidates available
     */
    it('[U3-SUGGEST-003] should return null when no candidates', () => {
      const users: User[] = [];
      const wo = createWorkOrder();

      const result = suggestBestTechnician(users, wo);
      expect(result.user).toBeNull();
      expect(result.reasons).toContain('No hay candidatos disponibles');
    });

    /**
     * U3-SUGGEST-004: Exclude PROVEEDOR from suggestions
     */
    it('[U3-SUGGEST-004] should exclude PROVEEDOR from suggestions', () => {
      const users = [
        createUser({ id: 'u1', role: 'PROVEEDOR', name: 'Proveedor' })
      ];
      const wo = createWorkOrder({ requiredSkills: [] });

      const result = suggestBestTechnician(users, wo);
      expect(result.user).toBeNull();
    });
  });
});
