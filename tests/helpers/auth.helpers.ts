/**
 * Authentication Helpers for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Helper functions to eliminate code duplication in E2E authentication tests
 */

import { Page } from '@playwright/test';

/**
 * Login helper - performs login action without waiting for redirect
 * Tests should wait for expected UI elements after calling this helper
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
  await page.goto('/login');
  await page.getByTestId('login-email').waitFor({ state: 'visible' });
  await page.getByTestId('login-email').clear();
  await page.getByTestId('login-password').clear();
  await page.getByTestId('login-email').type(email, { delay: 10 });
  await page.getByTestId('login-password').type(password, { delay: 10 });
  await page.getByTestId('login-submit').click();
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
 * After login, test should wait for '/cambiar-password' URL
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
