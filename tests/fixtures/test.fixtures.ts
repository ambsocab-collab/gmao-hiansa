import { test as base, Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Playwright Test Fixtures for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Supports multiple user roles with different capabilities for PBAC testing:
 * - admin: All 15 capabilities
 * - operario: can_create_failure_report
 * - tecnico: can_view_own_ots, can_complete_ot
 * - supervisor: can_view_all_ots, can_receive_reports
 */

// Types for fixtures
export type UserRole = 'operario' | 'tecnico' | 'supervisor' | 'admin' | 'stock_manager';

interface AuthFixtures {
  loginAs: (role: UserRole) => Promise<void>;
}

// Storage state files for different roles
const STORAGE_STATES = {
  admin: 'playwright/.auth/admin.json',
  operario: 'playwright/.auth/operario.json',
  tecnico: 'playwright/.auth/tecnico.json',
  supervisor: 'playwright/.auth/supervisor.json',
  stock_manager: 'playwright/.auth/admin.json', // Use admin for now
};

/**
 * Helper: Find an OT card with available assignment slots
 *
 * Assignment rules: max 3 total (technicians + provider)
 * - "Sin asignar" = 0 slots used
 * - "1 técnico" = 1 slot used, 2 available
 * - "2 técnicos" = 2 slots used, 1 available
 * - "2 técnicos / 1 proveedor" = 3 slots used, 0 available (FULL)
 *
 * @param page - Playwright page object
 * @param minSlotsNeeded - Minimum slots needed (default: 1)
 * @returns Locator for an OT card with available slots, or null if none found
 */
export async function findOTCardWithAvailableSlots(
  page: Page,
  minSlotsNeeded: number = 1
): Promise<Locator | null> {
  // Support both Kanban cards (ot-card-) and List rows (ot-row-)
  const otCards = page.locator('[data-testid^="ot-card-"], [data-testid^="ot-row-"]');
  const count = await otCards.count();

  for (let i = 0; i < count; i++) {
    const card = otCards.nth(i);
    const assignmentBadge = card.locator('[data-testid^="asignaciones-badge-"]');

    if (await assignmentBadge.count() === 0) continue;

    const badgeText = await assignmentBadge.textContent() || '';

    // Count current assignments
    let currentAssignments = 0;

    if (badgeText.includes('Sin asignar')) {
      currentAssignments = 0;
    } else {
      // Extract numbers from badge text like "2 técnicos / 1 proveedor"
      const tecnicoMatch = badgeText.match(/(\d+)\s*técnico/i);
      const proveedorMatch = badgeText.match(/(\d+)\s*proveedor/i);

      const tecnicos = tecnicoMatch ? parseInt(tecnicoMatch[1]) : 0;
      const proveedores = proveedorMatch ? parseInt(proveedorMatch[1]) : 0;
      currentAssignments = tecnicos + proveedores;
    }

    // Check if this card has enough slots available
    const availableSlots = 3 - currentAssignments;
    if (availableSlots >= minSlotsNeeded) {
      return card;
    }
  }

  return null;
}

/**
 * Helper: Get assignment count from badge text
 */
export function parseAssignmentCount(badgeText: string): { technicians: number; providers: number; total: number } {
  if (badgeText.includes('Sin asignar')) {
    return { technicians: 0, providers: 0, total: 0 };
  }

  const tecnicoMatch = badgeText.match(/(\d+)\s*técnico/i);
  const proveedorMatch = badgeText.match(/(\d+)\s*proveedor/i);

  const technicians = tecnicoMatch ? parseInt(tecnicoMatch[1]) : 0;
  const providers = proveedorMatch ? parseInt(proveedorMatch[1]) : 0;

  return { technicians, providers, total: technicians + providers };
}

// Extend base test with custom fixtures
export const test = base.extend<AuthFixtures>({
  // Login as specific role using storage states
  // Note: This fixture is a NO-OP - tests should use test.use() with storageState instead
  // The loginAs fixture is kept for backward compatibility but doesn't do anything
  loginAs: async ({ page }, use) => {
    const loginAsRole = async (role: UserRole) => {
      // NO-OP: Tests should use test.use() with storageState at the test/describe level
      // Example:
      // test.use({ storageState: 'playwright/.auth/operario.json' });
      // test('my test', async ({ page }) => { ... });
      console.log(`[NOTE] loginAs('${role}') called - but test should use test.use() with storageState`);
    };

    await use(loginAsRole);
  },
});

export { expect };
