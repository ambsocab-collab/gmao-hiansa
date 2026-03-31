import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Framework: Next.js 15.0.3 (App Router)
 * Stack: TypeScript, Prisma, NextAuth.js, SSE
 *
 * Testing Strategy:
 * - E2E tests: Critical user journeys
 * - API tests: Next.js API routes
 * - Visual regression: UI components
 *
 * Parallelism: 4 workers (fixed)
 * Timeouts: Action 15s, Navigation 30s, Test 60s
 * Browsers: Chromium only
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Fully parallel mode - all tests run in parallel
  fullyParallel: true,

  // Timeout configuration
  timeout: 60 * 1000, // 60 seconds per test
  expect: {
    timeout: 15 * 1000, // 15 seconds per assertion
  },

  // Retry on CI and locally (for flaky tests in parallel mode)
  // Enabled: 2 retries for flaky test recovery (SSE timing, DB race conditions)
  retries: 2,

  // Parallel workers - Fixed to 4 workers
  workers: 4,

  // Reporter configuration
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'junit-results.xml' }],
    ['list'],
  ],

  // Shared settings for all tests
  use: {
    // Reuse authenticated session (saved in global-setup)
    // This eliminates 30+ seconds of login overhead per test suite
    storageState: 'playwright/.auth/admin.json',

    // Base URL from environment or default
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Trace on failure
    trace: 'retain-on-failure',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Action navigation timeout
    actionTimeout: 15 * 1000,

    // Navigation timeout
    navigationTimeout: 30 * 1000,

    // Test data attributes
    testIdAttribute: 'data-testid',

    // Extra environment variables for server-side code
    extraHTTPHeaders: {
      'x-playwright-test': '1',
    },
  },

  // Global setup to verify database seed before running tests
  globalSetup: require.resolve('./tests/e2e/global-setup'),

  // Environment variables that should be available to tests
  // These are passed to the browser context, NOT to the server
  // To set server-side env vars, use webServer.env
  webServer: {
    command: 'npm run dev:e2e',
    port: 3000,
    timeout: 240 * 1000, // Increased from 120s to 240s for slower builds
    reuseExistingServer: !process.env.CI,
  },

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Output directory
  outputDir: 'test-results',
});
