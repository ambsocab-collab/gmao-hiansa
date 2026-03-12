/**
 * E2E Test Setup Helper
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Provides utilities for verifying database seed before running tests
 */

/**
 * Verifies that the database has been seeded with required test data
 * Throws an error if seed is missing or incomplete
 */
export async function verifyDatabaseSeed(request: any) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  try {
    // Check if health endpoint responds
    const healthResponse = await request.get(`${baseURL}/api/v1/health`);
    if (!healthResponse.ok()) {
      throw new Error(`Health check failed: ${healthResponse.status()}`);
    }

    const health = await healthResponse.json();
    if (health.services?.database !== 'up') {
      throw new Error('Database is not available');
    }

    console.log('✅ Database is available and healthy');

    // Verify required test users exist
    const users = ['tecnico@hiansa.com', 'new.user@example.com'];

    for (const email of users) {
      const userResponse = await request.get(`${baseURL}/api/v1/test/check-user?email=${email}`);
      if (!userResponse.ok()) {
        throw new Error(`Test user ${email} not found in database. Please run: npx prisma db seed`);
      }
      console.log(`✅ Test user ${email} verified`);
    }
  } catch (error: any) {
    throw new Error(`Database verification failed: ${error.message}`);
  }
}
