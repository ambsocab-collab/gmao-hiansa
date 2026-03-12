/**
 * Cleanup test users from database
 * Script to remove test users before running E2E tests
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up test users...');

  // Delete test users created by E2E tests
  const deleteResult = await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'maria.gonzalez.'
      }
    }
  });

  console.log(`✅ Deleted ${deleteResult.count} test users`);

  // Also delete any test user with specific patterns
  const patterns = [
    'tecnico.avanzado@example.com',
    'test%',
    '%@example.com',
  ];

  for (const pattern of patterns) {
    const result = await prisma.user.deleteMany({
      where: {
        email: { contains: pattern }
      }
    });
    if (result.count > 0) {
      console.log(`✅ Deleted ${result.count} users matching pattern: ${pattern}`);
    }
  }

  await prisma.$disconnect();
  console.log('✅ Cleanup completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
