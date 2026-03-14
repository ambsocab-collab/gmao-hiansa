/**
 * Authentication Helpers for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Helper functions to eliminate code duplication in E2E authentication tests
 */

import { Page, APIRequestContext } from '@playwright/test';

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
  // Increased timeout to 30s for parallel test execution (server may be under load)
  await Promise.all([
    page.waitForURL((url) => url.pathname !== '/login', { timeout: 30000 }),
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

/**
 * Create an authenticated API request context
 *
 * Extracts cookies from the browser session and creates an APIRequestContext
 * that includes the session cookies for authenticated API calls.
 *
 * @param page - Playwright Page object (must be logged in)
 * @returns APIRequestContext with session cookies
 */
export async function createAuthenticatedAPIRequest(page: Page): Promise<APIRequestContext> {
  const baseURL = getBaseURL();

  // Get all cookies from the browser context
  const cookies = await page.context().cookies();

  // Create a new APIRequestContext with the cookies
  const request = await page.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    // Pass the cookies to include the session
    storageState: {
      cookies: cookies,
      origins: []
    }
  });

  return request;
}

/**
 * Helper to make authenticated API calls using page.request
 *
 * This helper automatically includes the session cookies from the browser
 * to ensure API calls are authenticated.
 *
 * @param page - Playwright Page object (must be logged in)
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param url - API endpoint URL
 * @param data - Request body for POST/PUT requests
 * @returns Response from the API call
 */
export async function authenticatedAPICall(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
) {
  const baseURL = getBaseURL();
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  // Get cookies from the browser context
  const cookies = await page.context().cookies();

  // Convert cookies to Cookie header format
  const cookieHeader = cookies
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  // Make the API call with cookies
  // Note: Playwright automatically handles JSON serialization for 'data' parameter
  const response = await page.request.fetch(fullUrl, {
    method,
    headers: {
      'Cookie': cookieHeader,
    },
    data: method !== 'GET' ? data : undefined,
  });

  return response;
}
