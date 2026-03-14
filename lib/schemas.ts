/**
 * Zod Validation Schemas
 * Story 1.1: Login, Registro y Perfil de Usuario
 * Story 1.3: Etiquetas de Clasificación y Organización
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
  confirmPassword: z.string().min(1, 'Confirmación de contraseña requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido').optional().or(z.literal('')).nullable(),
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

/**
 * Story 1.3: Tag Management Schemas
 *
 * Validation schemas for tag creation and assignment
 * NFR-S59: Maximum 20 tags per system
 * NFR-S62: Support for multiple tag assignment
 */

// Helper: Hex color validation
// NOTE: WCAG AA compliance is enforced at UI level in CreateTagForm component
// The UI only offers a preset of WCAG AA compliant colors (contrast ratio >= 4.5:1)
// This schema validates the hex format, but color selection is limited by the UI component
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'Color debe ser formato hex válido (ej: #FF5733)',
})

// Schema for creating a new tag
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Nombre de etiqueta requerido')
    .max(50, 'Nombre debe tener máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\-_]+$/, {
      message: 'Nombre solo puede contener letras, números, espacios, guiones y guiones bajos',
    }),
  color: hexColorSchema,
  description: z
    .string()
    .max(200, 'Descripción debe tener máximo 200 caracteres')
    .optional(),
})

// Schema for assigning tags to a user
export const assignTagsSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  tagIds: z
    .array(z.string())
    .min(0, 'Puede tener 0 o más etiquetas')
    .max(20, 'Un usuario puede tener máximo 20 etiquetas'),
})

// Schema for updating an existing tag
export const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Nombre de etiqueta requerido')
    .max(50, 'Nombre debe tener máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\-_]+$/, {
      message: 'Nombre solo puede contener letras, números, espacios, guiones y guiones bajos',
    })
    .optional(),
  color: hexColorSchema.optional(),
  description: z
    .string()
    .max(200, 'Descripción debe tener máximo 200 caracteres')
    .optional(),
})

// Schema for deleting a tag (requires confirmation)
export const deleteTagSchema = z.object({
  tagId: z.string().min(1, 'ID de etiqueta requerido'),
  confirm: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debe confirmar la eliminación de etiqueta',
    }),
})
