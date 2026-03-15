// Script para crear usuario bsoto@hiansa.com
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createBsotoUser() {
  console.log('👤 Creating user bsoto@hiansa.com...')

  try {
    // Hash de la contraseña
    const passwordHash = await bcrypt.hash('1112BSC08', 10)
    console.log('✅ Password hashed')

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'bsoto@hiansa.com' }
    })

    if (existingUser) {
      console.log('⚠️  User bsoto@hiansa.com already exists. Updating password...')

      // Actualizar contraseña si el usuario ya existe
      await prisma.user.update({
        where: { email: 'bsoto@hiansa.com' },
        data: {
          passwordHash: passwordHash,
        }
      })

      console.log('✅ Password updated for existing user')
    } else {
      // Crear el usuario
      const user = await prisma.user.create({
        data: {
          email: 'bsoto@hiansa.com',
          passwordHash: passwordHash,
          name: 'Bernardo Soto',
          phone: '+34 600 000 005',
          forcePasswordReset: false, // No forzar cambio de contraseña
        }
      })

      console.log('✅ User created:', user.email, '| Name:', user.name)

      // Obtener la capability por defecto (can_create_failure_report)
      const defaultCapability = await prisma.capability.findUnique({
        where: { name: 'can_create_failure_report' }
      })

      if (defaultCapability) {
        // Asignar la capability por defecto (NFR-S66)
        await prisma.userCapability.create({
          data: {
            userId: user.id,
            capabilityId: defaultCapability.id
          }
        })
        console.log('✅ Default capability assigned: can_create_failure_report')
      } else {
        console.log('⚠️  Warning: Default capability not found. User will have no capabilities.')
      }

      // Asignar la etiqueta "Técnico" si existe
      const tecnicoTag = await prisma.tag.findFirst({
        where: { name: 'Técnico' }
      })

      if (tecnicoTag) {
        await prisma.userTag.create({
          data: {
            userId: user.id,
            tagId: tecnicoTag.id
          }
        })
        console.log('✅ Tag "Técnico" assigned to user')
      } else {
        console.log('⚠️  Warning: Tag "Técnico" not found')
      }
    }

    console.log('\n🎉 User bsoto@hiansa.com ready!')
    console.log('\n🔐 Credentials:')
    console.log('   Email: bsoto@hiansa.com')
    console.log('   Password: 1112BSC08')
    console.log('   Capability: can_create_failure_report')
    console.log('   Tag: Técnico')

  } catch (error) {
    console.error('❌ Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createBsotoUser()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
