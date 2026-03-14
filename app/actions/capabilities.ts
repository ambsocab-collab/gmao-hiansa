'use server'

/**
 * Capabilities Server Actions
 * Story 1.2: Sistema PBAC con 15 Capacidades
 *
 * Server actions for managing user capabilities
 */

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth-adapter'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const assignCapabilitiesSchema = z.object({
  userId: z.string().cuid(),
  capabilities: z.array(z.string()).min(1, 'Al menos una capability es requerida'),
})

/**
 * Assign capabilities to a user
 * Replaces all existing capabilities with the new set
 *
 * @param userId - User ID
 * @param capabilityNames - Array of capability names to assign
 * @returns Result object with success/error information
 */
export async function assignCapabilitiesToUser(
  userId: string,
  capabilityNames: string[]
) {
  try {
    // Verify authentication
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        message: 'No autenticado',
      }
    }

    // Verify can_manage_users capability
    const hasManageUsersCapability = session.user.capabilities?.includes(
      'can_manage_users'
    )

    if (!hasManageUsersCapability) {
      return {
        success: false,
        message: 'No tienes permiso para gestionar usuarios',
      }
    }

    // Validate input
    const validatedData = assignCapabilitiesSchema.parse({
      userId,
      capabilities: capabilityNames,
    })

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado',
      }
    }

    // Get all capability IDs for the provided names
    const capabilities = await prisma.capability.findMany({
      where: {
        name: {
          in: validatedData.capabilities,
        },
      },
    })

    if (capabilities.length !== validatedData.capabilities.length) {
      return {
        success: false,
        message: 'Algunas capabilities no existen',
      }
    }

    // Delete existing user capabilities
    await prisma.userCapability.deleteMany({
      where: { userId: validatedData.userId },
    })

    // Create new user capabilities
    await prisma.userCapability.createMany({
      data: capabilities.map((capability) => ({
        userId: validatedData.userId,
        capabilityId: capability.id,
      })),
    })

    // Revalidate paths
    revalidatePath('/usuarios')
    revalidatePath(`/usuarios/${userId}`)

    return {
      success: true,
      message: 'Capabilities actualizadas exitosamente',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Datos inválidos',
        errors: error.errors,
      }
    }

    console.error('Error assigning capabilities:', error)

    return {
      success: false,
      message: 'Error al actualizar capabilities',
    }
  }
}
