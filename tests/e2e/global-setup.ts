/**
 * E2E Global Setup
 *
 * Automatically verifies and seeds the database before running E2E tests
 * This ensures tests always have the required test data
 *
 * Also performs authentication and saves session state for reuse across tests
 * This eliminates the need to login in every test (30+ second savings)
 */

import { FullConfig, chromium } from '@playwright/test';
import path from 'path';

// Helper to extract cookies from set-cookie header
// Works with both fetch Headers and Playwright APIResponse
function parseCookies(headers: Headers | any): string {
  const cookies: string[] = [];

  // Handle Playwright APIResponse headers
  if (headers.headers) {
    // Playwright APIResponse
    const setCookieHeaders = headers.headers()['set-cookie'];
    if (Array.isArray(setCookieHeaders)) {
      setCookieHeaders.forEach(cookie => {
        cookies.push(cookie.split(';')[0].trim());
      });
    } else if (setCookieHeaders) {
      // Single set-cookie header
      setCookieHeaders.split('\n').forEach(c => {
        cookies.push(c.split(';')[0].trim());
      });
    }
  } else if (typeof headers.forEach === 'function') {
    // Standard fetch Headers
    headers.forEach((value: string, key: string) => {
      if (key === 'set-cookie') {
        const cookieValues = value.split('\n').map(c => c.split(';')[0].trim());
        cookies.push(...cookieValues);
      }
    });
  }

  return cookies.join('; ');
}

async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const maxRetries = 30;
  const retryDelay = 2000; // 2 seconds

  console.log('\n🔧 E2E Global Setup: Checking database seed...\n');

  // Wait for server to be ready
  let serverReady = false;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${baseURL}/api/v1/health`, {
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const health = await response.json();
        if (health.services?.database === 'up') {
          serverReady = true;
          console.log('✅ Server is ready and database is up\n');
          break;
        }
      }
    } catch {
      // Server not ready yet, will retry
    }

    console.log(`⏳ Waiting for server... (${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }

  if (!serverReady) {
    throw new Error('❌ Server failed to start after maximum retries');
  }

  // Verify seed users exist
  const requiredUsers = [
    'admin@hiansa.com',
    'tecnico@hiansa.com',
    'supervisor@hiansa.com',
    'new.user@example.com'
  ];

  let allUsersFound = true;
  const missingUsers: string[] = [];

  for (const email of requiredUsers) {
    try {
      const response = await fetch(`${baseURL}/api/v1/test/check-user?email=${email}`, {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        allUsersFound = false;
        missingUsers.push(email);
      } else {
        console.log(`✅ User ${email} found`);
      }
    } catch {
      allUsersFound = false;
      missingUsers.push(email);
    }
  }

  // If any users are missing, run seed automatically
  if (!allUsersFound) {
    console.log('\n⚠️  Missing users:', missingUsers);
    console.log('🌱 Running database seed...\n');

    try {
      // Call the seed endpoint
      const seedResponse = await fetch(`${baseURL}/api/v1/test/seed`, {
        method: 'POST',
        headers: {
          'x-playwright-test': '1'
        },
        signal: AbortSignal.timeout(120000) // 2 minutes timeout
      });

      if (!seedResponse.ok) {
        const errorText = await seedResponse.text();
        throw new Error(`Seed failed (${seedResponse.status}): ${errorText}`);
      }

      const result = await seedResponse.json();
      console.log('✅ Database seeded successfully\n');
      console.log('📊 Seed summary:', result.summary || 'Complete');
    } catch (error) {
      console.error('❌ Failed to seed database:', error);
      throw new Error(`Database seed failed: ${error}`);
    }
  } else {
    console.log('\n✅ All required users found - seed is up to date\n');
  }

  // Verificar cuántos equipos hay (siempre, no solo después del seed)
  try {
    const countResponse = await fetch(`${baseURL}/api/v1/test/count-equipos`, {
      signal: AbortSignal.timeout(5000)
    });

    if (countResponse.ok) {
      const countData = await countResponse.json();
      console.log('📊 Equipos en DB:', countData.count || 0);

      if ((countData.count || 0) === 0) {
        console.warn('⚠️  WARNING: No equipos found in database - tests will fail!');
        console.warn('   Run: npm run db:seed');
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not verify equipos count:', error);
  }

  console.log('🎯 E2E Global Setup complete\n');

  // ============================================================================
  // AUTHENTICATION SETUP - Save admin session for reuse across tests
  // Uses direct API calls to avoid React form issues in Playwright
  // ============================================================================

  console.log('🔐 Setting up authenticated session via API...\n');

  const authFile = path.join(__dirname, '..', '..', 'playwright', '.auth', 'admin.json');

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  });

  const page = await context.newPage();

  try {
    // Store cookies to maintain session
    let cookieStore = '';

    // Step 1: Get CSRF token
    console.log('[STEP 1] Getting CSRF token...');
    const csrfResponse = await fetch(`${baseURL}/api/auth/csrf`);
    const csrfData = await csrfResponse.json() as { csrfToken: string };
    console.log('[DEBUG] CSRF token:', csrfData?.csrfToken?.substring(0, 20) + '...');

    // Extract cookies from CSRF response
    const csrfCookies = parseCookies(csrfResponse.headers);
    cookieStore = csrfCookies;
    console.log('[DEBUG] Cookies after CSRF:', cookieStore.substring(0, 100) + '...');

    // Step 2: Make login request with cookies
    console.log('[STEP 2] Making login request...');

    // Use fetch from node for API calls
    const loginResponse = await fetch(`${baseURL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieStore
      },
      body: new URLSearchParams({
        csrfToken: csrfData!.csrfToken,
        email: 'admin@hiansa.com',
        password: 'admin123',
        redirect: 'false',
        json: 'true'
      }),
      redirect: 'manual'
    });

    console.log('[DEBUG] Login response status:', loginResponse.status);
    const loginBody = await loginResponse.text();
    console.log('[DEBUG] Login response body:', loginBody);

    if (loginResponse.status !== 200 && !loginBody.includes('http')) {
      throw new Error(`Login failed with status ${loginResponse.status}: ${loginBody}`);
    }

    // Extract new cookies from login response
    const loginCookies = parseCookies(loginResponse.headers);
    if (loginCookies) {
      cookieStore = loginCookies;
      console.log('[DEBUG] Cookies after login:', cookieStore.substring(0, 100) + '...');
    }

    // Step 3: Navigate to a page to establish browser session
    console.log('[STEP 3] Establishing browser session...');

    // Set cookies in browser context
    const cookies = cookieStore.split('; ').map(cookieStr => {
      const [name, value] = cookieStr.split('=');
      return { name, value, domain: 'localhost', path: '/' };
    });

    await context.addCookies(cookies);

    // Navigate to dashboard to confirm session
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('domcontentloaded');

    console.log('[DEBUG] Current URL after login:', page.url());

    // Verify we're not on login page
    if (page.url().includes('/login')) {
      throw new Error('Login failed - redirected to login page');
    }

    // Save authentication state to file
    await context.storageState({ path: authFile });

    console.log('✅ Admin session saved to:', authFile);
    console.log('💡 Tests will reuse this session - no login overhead!\n');
  } catch (error) {
    console.error('❌ Failed to setup authenticated session:', error);
    throw new Error(`Authentication setup failed: ${error}`);
  } finally {
    await browser.close();
  }

  console.log('🎯 E2E Global Setup complete (with auth)\n');
}

export default globalSetup;
