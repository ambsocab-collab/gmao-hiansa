import { test as base } from '@playwright/test';
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
