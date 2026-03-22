/**
 * Check user capabilities in database
 * Used to verify PBAC setup for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking user capabilities in database...\n');

  // Get all users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['bsoto@hiansa.com', 'admin@hiansa.com', 'supervisor@hiansa.com']
      }
    },
    include: {
      userCapabilities: {
        include: {
          capability: true
        }
      }
    }
  });

  for (const user of users) {
    console.log(`\n👤 User: ${user.name} (${user.email})`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Capabilities (${user.userCapabilities.length}):`);

    for (const uc of user.userCapabilities) {
      console.log(`      ✅ ${uc.capability.name}`);
    }

    if (user.userCapabilities.length === 0) {
      console.log(`      ⚠️  No capabilities assigned`);
    }
  }

  console.log('\n✅ Done');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
