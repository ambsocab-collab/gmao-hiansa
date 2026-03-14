/**
 * E2E Tests: Login Authentication Flow
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * P0-E2E-001 to P0-E2E-003
 *
 * Tests verify:
 * - Login form displays correctly
 * - Authentication works with valid credentials
 * - Error messages display for invalid credentials
 * - Database is properly seeded before tests run
 */

import { test, expect } from '@playwright/test';
import { verifyDatabaseSeed } from './test-setup';
import { loginAsTecnico } from '../helpers/auth.helpers';

// Helper to get base URL
function getBaseURL(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

// Verify database seed before running any tests
test.beforeAll(async ({ request }) => {
  await verifyDatabaseSeed(request);
});

test.describe('Story 1.1: Login Authentication Flow', () => {
  // Ensure clean session before each test
  test.beforeEach(async ({ page }) => {
    // Clear cookies to ensure clean session state
    await page.context().clearCookies()
  })

  test('[P0-E2E-001] should display login form with required fields and testids', async ({ page }) => {
    // Given: user navigates to login page
    await page.goto(`${getBaseURL()}/login`);

    // Then: login form is visible with correct structure
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    // And: form has mobile-friendly input height (44px minimum)
    const emailInput = page.getByTestId('login-email');
    const emailBox = await emailInput.boundingBox();
    expect(emailBox?.height).toBeCloseTo(44, 0);

    const passwordInput = page.getByTestId('login-password');
    const passwordBox = await passwordInput.boundingBox();
    expect(passwordBox?.height).toBeCloseTo(44, 0);
  });

  test('[P0-E2E-002] should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    // Given: existing user in database (from seed: tecnico@hiansa.com)
    const testUser = {
      email: 'tecnico@hiansa.com',
      name: 'Carlos Tecnico',
      password: 'tecnico123',
    };

    // When: user enters valid credentials using auth helper
    await loginAsTecnico(page);

    // Then: redirected to dashboard - see dashboard content
    await expect(page.getByText(/Hola, /).first()).toBeVisible();

    // And: see avatar with initials
    await expect(page.locator('[data-testid="user-avatar"]').first()).toBeVisible();
  });

  test('[P0-E2E-003] should show error message with invalid credentials', async ({ page }) => {
    // Given: user is on login page
    await page.goto(`${getBaseURL()}/login`);

    // When: user enters invalid credentials
    await page.getByTestId('login-email').fill('nonexistent@example.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    // Then: error message displayed (Playwright auto-waits for assertion)
    const errorMessage = page.getByTestId('login-error');
    await expect(errorMessage).toBeVisible();

    // And: error message is user-friendly (Spanish)
    await expect(errorMessage).toContainText('Email o contraseña incorrectos');

    // And: error has red color (#EF4444)
    const errorColor = await errorMessage.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    expect(errorColor).toBe('rgb(239, 68, 68)'); // #EF4444

    // And: user remains on login page
    expect(page.url()).toContain('/login');
  });
});
