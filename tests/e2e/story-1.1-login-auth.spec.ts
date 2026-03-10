/**
 * E2E Tests: Login Authentication Flow
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * P0-E2E-001 to P0-E2E-004
 */

import { test, expect } from '@playwright/test';

test.describe('Story 1.1: Login Authentication Flow', () => {

  test('[P0-E2E-001] should display login form with required fields and testids', async ({ page }) => {
    // Given: user navigates to login page
    await page.goto('/login');

    // Then: login form is visible with correct structure
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    // And: form has mobile-friendly input height (44px minimum)
    const emailInput = page.getByTestId('login-email');
    const emailBox = await emailInput.boundingBox();
    expect(emailBox?.height).toBeGreaterThanOrEqual(44);

    const passwordInput = page.getByTestId('login-password');
    const passwordBox = await passwordInput.boundingBox();
    expect(passwordBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('[P0-E2E-002] should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    // Given: existing user in database (from seed: tecnico@hiansa.com)
    const testUser = {
      email: 'tecnico@hiansa.com',
      name: 'Carlos Tecnico',
      password: 'tecnico123',
    };

    // And: user is on login page
    await page.goto('/login');

    // When: user enters valid credentials
    await page.getByTestId('login-email').fill(testUser.email);
    await page.getByTestId('login-password').fill(testUser.password);
    await page.getByTestId('login-submit').click();

    // Then: redirected to dashboard within 3 seconds
    await page.waitForURL('/dashboard', { timeout: 3000 });

    // And: see personalized greeting in header
    await expect(page.getByText(`Hola, ${testUser.name}`)).toBeVisible();

    // And: see avatar with initials
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();

    // And: receive welcome toast/notification
    await expect(page.getByText(/Bienvenido|Welcome/i)).toBeVisible({ timeout: 2000 });
  });

  test('[P0-E2E-003] should show error message with invalid credentials', async ({ page }) => {
    // Given: user is on login page
    await page.goto('/login');

    // When: user enters invalid credentials
    await page.getByTestId('login-email').fill('nonexistent@example.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    // Then: error message displayed within 1 second
    const errorMessage = page.getByTestId('login-error');
    await expect(errorMessage).toBeVisible({ timeout: 1000 });

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

  test('[P0-E2E-004] should apply rate limiting after 5 failed login attempts', async ({ page }) => {
    const testEmail = 'ratelimit.test@example.com';

    // Given: user attempts 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.goto('/login');
      await page.getByTestId('login-email').fill(testEmail);
      await page.getByTestId('login-password').fill('wrongpassword');
      await page.getByTestId('login-submit').click();
      await expect(page.getByTestId('login-error')).toBeVisible();
    }

    // When: user attempts 6th login
    await page.getByTestId('login-email').fill(testEmail);
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    // Then: rate limit message shown
    await expect(page.getByText(/demasiados intentos|too many attempts/i)).toBeVisible();

    // And: submit button is disabled
    await expect(page.getByTestId('login-submit')).toBeDisabled();

    // And: message indicates 15-minute block duration
    await expect(page.getByText(/15 minutos|15 minutes/i)).toBeVisible();
  });
});
