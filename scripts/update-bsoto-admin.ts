// Script para actualizar usuario bsoto@hiansa.com como ADMIN con todas las capabilities
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBsotoAsAdmin() {
  console.log('👑 Updating bsoto@hiansa.com as ADMIN with all capabilities...')

  try {
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: 'bsoto@hiansa.com' },
      include: {
        userCapabilities: true
      }
    })

    if (!user) {
      console.log('❌ User bsoto@hiansa.com not found')
      return
    }

    console.log('✅ User found:', user.email, '| Name:', user.name)

    // Obtener TODAS las capabilities
    const allCapabilities = await prisma.capability.findMany()
    console.log('✅ Found', allCapabilities.length, 'capabilities')

    // Eliminar capabilities existentes del usuario
    await prisma.userCapability.deleteMany({
      where: { userId: user.id }
    })
    console.log('✅ Deleted existing user capabilities')

    // Asignar TODAS las capabilities al usuario
    await prisma.userCapability.createMany({
      data: allCapabilities.map((cap) => ({
        userId: user.id,
        capabilityId: cap.id,
      })),
      skipDuplicates: true,
    })

    console.log('✅ Assigned all', allCapabilities.length, 'capabilities to user')

    // Listar todas las capabilities asignadas
    console.log('\n📋 Capabilities assigned:')
    allCapabilities.forEach((cap) => {
      console.log('   -', cap.label, `(${cap.name})`)
    })

    console.log('\n🎉 User bsoto@hiansa.com is now ADMIN with all capabilities!')
    console.log('\n🔐 Credentials:')
    console.log('   Email: bsoto@hiansa.com')
    console.log('   Password: 1112BSC08')
    console.log('   Role: ADMIN')
    console.log('   Capabilities: ALL (', allCapabilities.length, ')')

  } catch (error) {
    console.error('❌ Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBsotoAsAdmin()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
