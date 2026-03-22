/**
 * Generate Playwright Storage States for Different User Roles
 *
 * This script logs in as different users and saves their authentication state
 * to be used in E2E tests. This allows testing PBAC (Permission-Based Access Control).
 *
 * Usage:
 *   node tests/scripts/generate-auth-states.js
 *
 * Requirements:
 *   - Dev server running on http://localhost:3000
 *   - Database seeded with test users
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const AUTH_DIR = path.join(__dirname, '../../playwright/.auth');

// Ensure auth directory exists
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

/**
 * User configurations with their expected capabilities
 */
const USERS = [
  {
    name: 'admin',
    email: 'admin@hiansa.com',
    password: 'admin123',
    capabilities: 'All 15 capabilities',
    storageFile: 'admin.json'
  },
  {
    name: 'operario',
    email: 'bsoto@hiansa.com',
    password: '1112BSC08',
    capabilities: 'can_create_failure_report',
    storageFile: 'operario.json'
  },
  {
    name: 'tecnico',
    email: 'tecnico@hiansa.com',
    password: 'tecnico123',
    capabilities: 'can_view_own_ots, can_complete_ot',
    storageFile: 'tecnico.json'
  },
  {
    name: 'supervisor',
    email: 'supervisor@hiansa.com',
    password: 'supervisor123',
    capabilities: 'can_view_all_ots, can_receive_reports',
    storageFile: 'supervisor.json'
  }
];

/**
 * Login and save storage state for a user
 */
async function loginAndSaveState(user) {
  console.log(`\n🔐 Logging in as ${user.name}...`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Capabilities: ${user.capabilities}`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill login form with correct data-testid selectors
    await page.fill('[data-testid="login-email"]', user.email);
    await page.fill('[data-testid="login-password"]', user.password);
    await page.click('[data-testid="login-submit"]');

    // Wait for redirect to dashboard (successful login)
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log(`   ✅ Login successful!`);

    // Verify we're actually logged in
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      console.log(`   ✅ Verified: Redirected to dashboard`);
    } else {
      console.log(`   ⚠️  Warning: Current URL is ${currentUrl}`);
    }

    // Save storage state
    const storagePath = path.join(AUTH_DIR, user.storageFile);
    await context.storageState({ path: storagePath });
    console.log(`   💾 Saved: ${storagePath}`);

    // Verify file was created
    if (fs.existsSync(storagePath)) {
      const stats = fs.statSync(storagePath);
      console.log(`   ✅ File size: ${stats.size} bytes`);
    } else {
      console.log(`   ❌ Error: File not created!`);
    }

  } catch (error) {
    console.error(`   ❌ Error logging in as ${user.name}:`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🎭 Playwright Storage State Generator');
  console.log('===================================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Auth directory: ${AUTH_DIR}`);

  // Check if server is running
  console.log('\n🔍 Checking if dev server is running...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { timeout: 30000 });
    console.log('✅ Dev server is running!');
  } catch (error) {
    console.error('❌ Error: Dev server is not running!');
    console.error('Please start the dev server first:');
    console.error('  npm run dev');
    process.exit(1);
  } finally {
    await browser.close();
  }

  // Generate storage states for all users
  console.log('\n📝 Generating storage states...\n');

  for (const user of USERS) {
    try {
      await loginAndSaveState(user);
    } catch (error) {
      console.error(`\n❌ Failed to generate state for ${user.name}`);
      console.error('Continuing with next user...\n');
    }
  }

  console.log('\n✅ All storage states generated!');
  console.log('\n📋 Summary:');
  USERS.forEach(user => {
    const storagePath = path.join(AUTH_DIR, user.storageFile);
    const exists = fs.existsSync(storagePath) ? '✅' : '❌';
    console.log(`   ${exists} ${user.storageFile} (${user.name})`);
  });

  console.log('\n💡 You can now use these states in tests:');
  console.log('   test.use({ storageState: \'playwright/.auth/operario.json\' });');
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
