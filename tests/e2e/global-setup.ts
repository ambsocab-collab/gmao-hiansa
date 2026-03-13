/**
 * E2E Global Setup
 *
 * Automatically verifies and seeds the database before running E2E tests
 * This ensures tests always have the required test data
 */

import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
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
    } catch (error) {
      // Server not ready yet, retry
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
    } catch (error) {
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

  console.log('🎯 E2E Global Setup complete\n');
}

export default globalSetup;
