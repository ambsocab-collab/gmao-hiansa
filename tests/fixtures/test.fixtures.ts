import { test as base } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Playwright Test Fixtures for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Fixtures provide:
 * - Auth session management
 * - API request helpers
 * - Test data factories
 * - Auto-cleanup hooks
 *
 * Usage:
 * ```ts
 * test('P0-001: Operario reporta avería', async ({ page, apiRequest, loginAs }) => {
 *   await loginAs('operario');
 *   // Test implementation...
 * });
 * ```
 */

// Types for fixtures
export type UserRole = 'operario' | 'tecnico' | 'supervisor' | 'admin' | 'stock_manager';

interface AuthFixtures {
  loginAs: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  getUserSession: () => Promise<{ email: string; capabilities: string[] }>;
}

// Extend base test with custom fixtures
export const test = base.extend<AuthFixtures>({
  // Login as specific role
  loginAs: async ({ page, apiRequest }, use, role: UserRole) => {
    const roleCredentials = {
      operario: { email: 'operario@example.com', password: 'password123' },
      tecnico: { email: 'tecnico@example.com', password: 'password123' },
      supervisor: { email: 'supervisor@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' },
      stock_manager: { email: 'stock@example.com', password: 'password123' },
    };

    const credentials = roleCredentials[role];

    // Login via API (faster than UI)
    await apiRequest.post('/api/v1/auth/login', {
      data: credentials,
    });

    // Set auth token in cookies
    const loginResponse = await apiRequest.post('/api/v1/auth/login', {
      data: credentials,
    });

    const token = (await loginResponse.json()).token;

    await page.addInitScript(({ authToken }) => {
      localStorage.setItem('auth-token', authToken);
    }, { authToken: token });

    await use();
  },

  // Logout
  logout: async ({ page }, use) => {
    await page.goto('/api/v1/auth/logout');
    await use();
  },

  // Get current user session
  getUserSession: async ({ apiRequest }, use) => {
    const getSession = async () => {
      const response = await apiRequest.get('/api/v1/auth/session');
      return await response.json();
    };

    await use(getSession);
  },
});

/**
 * Auto-cleanup fixture for test data isolation
 */
export const testWithCleanup = test.extend({
  cleanupTestData: async ({ apiRequest }, use) => {
    // Store data to cleanup
    const createdResources: string[] = [];

    await use(async () => {
      // Register cleanup
      const cleanup = async () => {
        for (const resource of createdResources) {
          await apiRequest.delete(resource);
        }
      };

      // Auto-cleanup after test
      await cleanup();
    });
  },
});

export { test, expect };
