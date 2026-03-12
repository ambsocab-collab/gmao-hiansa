/**
 * Zod Validation Schemas
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Reusable validation schemas for user-related operations
 */

import { z } from 'zod'

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional().or(z.literal('')),
  roleLabel: z.string().optional(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  capabilities: z.array(z.string()).min(1, 'Debe seleccionar al menos una capability'),
}).refine((data) => {
  console.log('[createUserSchema] Validating data:', JSON.stringify(data, null, 2))
  return true
})
