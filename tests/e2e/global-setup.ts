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

  // ============================================
  // ALWAYS RUN SEED FOR E2E TESTS
  // This ensures fresh test data for every test run
  // and prevents conflicts between parallel tests
  // ============================================
  console.log('\n🌱 Running database seed for E2E tests (always fresh data)...\n');

  // IMPORTANT: Delete old auth sessions before seeding
  // The seed recreates users with new IDs, so old sessions become invalid
  const authDir = path.join(__dirname, '..', '..', 'playwright', '.auth');
  const fs = await import('fs');
  if (fs.existsSync(authDir)) {
    const authFiles = fs.readdirSync(authDir);
    console.log(`🗑️  Deleting ${authFiles.length} old auth session(s) before seed...`);
    authFiles.forEach(file => {
      const filePath = path.join(authDir, file);
      fs.unlinkSync(filePath);
    });
    console.log('✅ Old auth sessions deleted\n');
  }

  try {
    // Run seed command directly using spawn (more reliable than API endpoint)
    const { spawn } = require('child_process');

    const seedProcess = spawn('npx', ['prisma', 'db', 'seed'], {
      env: process.env,
      shell: true,
      stdio: 'inherit' // Direct output to console
    });

    // Wait for seed to complete
    await new Promise<void>((resolve, reject) => {
      seedProcess.on('close', (code: number) => {
        if (code === 0) {
          console.log('✅ Database seeded successfully\n');
          resolve();
        } else {
          reject(new Error(`Seed failed with exit code ${code}`));
        }
      });

      seedProcess.on('error', (err: Error) => {
        reject(new Error(`Seed process error: ${err.message}`));
      });
    });
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw new Error(`Database seed failed: ${error}`);
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
  // AUTHENTICATION SETUP - Save sessions for all roles for reuse across tests
  // Uses direct API calls to avoid React form issues in Playwright
  // Regenerates auth files older than 3 hours
  // ============================================================================

  console.log('🔐 Setting up authenticated sessions via API...\n');

  // Note: authDir and fs are already declared above (before seed section)

  // Define all users that need authenticated sessions
  const usersToAuthenticate = [
    { email: 'admin@hiansa.com', password: 'admin123', fileName: 'admin.json', displayName: 'Admin' },
    { email: 'tecnico@hiansa.com', password: 'tecnico123', fileName: 'tecnico.json', displayName: 'Técnico' },
    { email: 'supervisor@hiansa.com', password: 'supervisor123', fileName: 'supervisor.json', displayName: 'Supervisor' },
    // NOTE: operario@hiansa.com doesn't exist in seed - removed from auth list
    // If operario auth is needed, add user to seed.ts first
  ];

  // Helper: Check if auth file is older than 3 hours
  function isAuthFileOlderThan(filePath: string, hours: number): boolean {
    if (!fs.existsSync(filePath)) {
      return true; // File doesn't exist, should regenerate
    }

    const stats = fs.statSync(filePath);
    const fileAge = Date.now() - stats.mtimeMs;
    const maxAge = hours * 60 * 60 * 1000;

    return fileAge > maxAge;
  }

  // Helper: Format file age for logging
  function formatFileAge(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      return 'N/A (no existe)';
    }

    const stats = fs.statSync(filePath);
    const fileAge = Date.now() - stats.mtimeMs;
    const hours = Math.floor(fileAge / (60 * 60 * 1000));
    const minutes = Math.floor((fileAge % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Check which auth files need to be regenerated
  const usersNeedingAuth: typeof usersToAuthenticate = [];

  for (const user of usersToAuthenticate) {
    const authFile = path.join(authDir, user.fileName);

    if (fs.existsSync(authFile)) {
      const fileAge = formatFileAge(authFile);
      console.log(`📁 ${user.displayName} session found (antigüedad: ${fileAge})`);

      if (isAuthFileOlderThan(authFile, 3)) {
        console.log(`⚠️  ${user.displayName} session is older than 3 hours - will regenerate`);
        usersNeedingAuth.push(user);
      } else {
        console.log(`✅ ${user.displayName} session is fresh - reusing existing session`);
      }
    } else {
      console.log(`⚠️  ${user.displayName} session not found - will generate`);
      usersNeedingAuth.push(user);
    }
  }

  // If all sessions are fresh, skip auth generation
  if (usersNeedingAuth.length === 0) {
    console.log('\n✅ All authenticated sessions are fresh - reusing existing sessions');
    console.log('💡 Tests will reuse existing sessions - no login overhead!\n');
    console.log('🎯 E2E Global Setup complete\n');
    return;
  }

  console.log(`\n🔐 Generating ${usersNeedingAuth.length} authenticated session(s)...\n`);

  // Count total sessions (existing + new)
  const totalExistingSessions = usersToAuthenticate.length - usersNeedingAuth.length;

  // Helper function to authenticate a user and save session
  async function authenticateUser(email: string, password: string, authFile: string, displayName: string): Promise<void> {
    console.log(`\n[${displayName}] Starting authentication...`);

    // Remove old auth file if it exists
    if (fs.existsSync(authFile)) {
      try {
        fs.unlinkSync(authFile);
        console.log(`[${displayName}] 🗑️  Removed old session file`);
      } catch (error) {
        console.warn(`[${displayName}] ⚠️  Could not remove old auth file:`, error);
      }
    }

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
      console.log(`[${displayName}] [STEP 1] Getting CSRF token...`);
      const csrfResponse = await fetch(`${baseURL}/api/auth/csrf`);
      const csrfData = await csrfResponse.json() as { csrfToken: string };

      // Extract cookies from CSRF response
      const csrfCookies = parseCookies(csrfResponse.headers);
      cookieStore = csrfCookies;

      // Step 2: Make login request with cookies
      console.log(`[${displayName}] [STEP 2] Making login request...`);

      const loginResponse = await fetch(`${baseURL}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookieStore
        },
        body: new URLSearchParams({
          csrfToken: csrfData!.csrfToken,
          email: email,
          password: password,
          redirect: 'false',
          json: 'true'
        }),
        redirect: 'manual'
      });

      const loginBody = await loginResponse.text();

      if (loginResponse.status !== 200 && !loginBody.includes('http')) {
        throw new Error(`Login failed with status ${loginResponse.status}: ${loginBody}`);
      }

      // Extract new cookies from login response
      const loginCookies = parseCookies(loginResponse.headers);
      if (loginCookies) {
        cookieStore = loginCookies;
      }

      // Step 3: Navigate to a page to establish browser session
      console.log(`[${displayName}] [STEP 3] Establishing browser session...`);

      // Set cookies in browser context
      const cookies = cookieStore.split('; ').map(cookieStr => {
        const [name, value] = cookieStr.split('=');
        return { name, value, domain: 'localhost', path: '/' };
      });

      await context.addCookies(cookies);

      // Navigate to dashboard to confirm session
      await page.goto(`${baseURL}/dashboard`);
      await page.waitForLoadState('domcontentloaded');

      // Verify we're not on login page
      if (page.url().includes('/login')) {
        throw new Error('Login failed - redirected to login page');
      }

      // Save authentication state to file
      await context.storageState({ path: authFile });

      console.log(`[${displayName}] ✅ Session saved to:`, authFile);
    } catch (error) {
      console.error(`[${displayName}] ❌ Failed to setup authenticated session:`, error);
      throw new Error(`${displayName} authentication setup failed: ${error}`);
    } finally {
      await browser.close();
    }
  }

  // Authenticate all users that need it
  let successCount = totalExistingSessions; // Start with existing sessions
  let failCount = 0;

  for (const user of usersNeedingAuth) {
    const authFile = path.join(authDir, user.fileName);
    try {
      await authenticateUser(user.email, user.password, authFile, user.displayName);
      successCount++;
    } catch (error) {
      console.error(`\n⚠️  WARNING: Failed to authenticate ${user.displayName}:`, error);
      console.log(`   Skipping ${user.displayName} session - tests that require this role may fail\n`);
      failCount++;
    }
  }

  if (successCount === 0) {
    throw new Error('❌ CRITICAL: All authentication attempts failed - cannot run E2E tests');
  }

  console.log(`\n✅ Authenticated sessions ready: ${successCount} successful, ${failCount} skipped`);
  console.log('💡 Tests will reuse these sessions - no login overhead!\n');
  console.log('🎯 E2E Global Setup complete (with auth)\n');
}

export default globalSetup;
