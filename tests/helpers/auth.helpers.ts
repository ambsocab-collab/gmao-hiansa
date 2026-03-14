/**
 * Authentication Helpers for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Helper functions to eliminate code duplication in E2E authentication tests
 */

import { Page } from '@playwright/test';

/**
 * Get base URL from environment or use default
 */
function getBaseURL(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

/**
 * Login helper - performs login action and waits for navigation to complete
 *
 * @param page - Playwright Page object
 * @param email - User email
 * @param password - User password
 */
export async function loginAs(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  const baseURL = getBaseURL();
  await page.goto(`${baseURL}/login`);
  await page.getByTestId('login-email').waitFor({ state: 'visible' });
  await page.getByTestId('login-email').clear();
  await page.getByTestId('login-password').clear();
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);

  // Click submit and wait for navigation to complete
  // Wait for URL to change from /login (handles redirects to dashboard, /cambiar-password, etc.)
  // Increased timeout for parallel test execution (server may be under load)
  await Promise.all([
    page.waitForURL((url) => url.pathname !== '/login', { timeout: 10000 }),
    page.getByTestId('login-submit').click(),
  ]);
}

/**
 * Login as admin user (admin@hiansa.com / admin123)
 *
 * @param page - Playwright Page object
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await loginAs(page, 'admin@hiansa.com', 'admin123');
}

/**
 * Login as tecnico user (tecnico@hiansa.com / tecnico123)
 *
 * @param page - Playwright Page object
 */
export async function loginAsTecnico(page: Page): Promise<void> {
  await loginAs(page, 'tecnico@hiansa.com', 'tecnico123');
}

/**
 * Login as new user with forced password reset
 * (new.user@example.com / tempPassword123)
 * After login, user will be redirected to '/cambiar-password' automatically
 *
 * @param page - Playwright Page object
 */
export async function loginAsNewUser(page: Page): Promise<void> {
  await loginAs(page, 'new.user@example.com', 'tempPassword123');
}

/**
 * Logout helper
 *
 * @param page - Playwright Page object
 */
export async function logout(page: Page): Promise<void> {
  await page.getByTestId('logout-button').click();
}
