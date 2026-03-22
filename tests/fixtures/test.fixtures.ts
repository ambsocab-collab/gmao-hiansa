import { test as base } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Playwright Test Fixtures for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * NOTE: All tests currently use admin auth state (from playwright.config.ts)
 * The loginAs fixture is a no-op for now - tests will run as admin user
 *
 * Future improvement: Create auth files for different roles (operario, tecnico, etc.)
 */

// Types for fixtures
export type UserRole = 'operario' | 'tecnico' | 'supervisor' | 'admin' | 'stock_manager';

interface AuthFixtures {
  loginAs: (role: UserRole) => Promise<void>;
}

// Extend base test with custom fixtures
export const test = base.extend<AuthFixtures>({
  // Login as specific role (currently a no-op - all tests use admin)
  loginAs: async ({ page }, use) => {
    const loginAsRole = async (role: UserRole) => {
      // TODO: Load different auth files based on role
      // For now, all tests use admin auth state from playwright.config.ts
      console.log(`[NOTE] Test would run as ${role}, but currently using admin auth state`);
    };

    await use(loginAsRole);
  },
});

export { test, expect };
