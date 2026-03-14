/**
 * Unit Tests for Zod Schemas
 * Story 1.1: User Management Schemas
 * Story 1.3: Tag Management Schemas
 *
 * Test coverage:
 * - Story 1.1: changePasswordSchema, updateProfileSchema, createUserSchema
 * - Story 1.3: createTagSchema, assignTagsSchema, updateTagSchema, deleteTagSchema
 *
 * Low effort, high value tests that catch validation bugs early
 */

import { describe, it, expect } from 'vitest'
import {
  changePasswordSchema,
  updateProfileSchema,
  createUserSchema,
  createTagSchema,
  assignTagsSchema,
  updateTagSchema,
  deleteTagSchema,
} from '@/lib/schemas'

describe('Story 1.1: User Management Schemas', () => {
  describe('changePasswordSchema', () => {
    const validPasswordData = {
      currentPassword: 'OldPass123',
      newPassword: 'NewPass456',
      confirmPassword: 'NewPass456',
    }

    it('should accept valid password change', () => {
      const result = changePasswordSchema.safeParse(validPasswordData)
      expect(result.success).toBe(true)
    })

    it('should reject missing current password', () => {
      const result = changePasswordSchema.safeParse({
        ...validPasswordData,
        currentPassword: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Contraseña actual requerida')
      }
    })

    it('should reject new password with less than 8 characters', () => {
      const result = changePasswordSchema.safeParse({
        ...validPasswordData,
        newPassword: 'Short1',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mínimo 8 caracteres')
      }
    })

    it('should reject new password without uppercase letter', () => {
      const result = changePasswordSchema.safeParse({
        ...validPasswordData,
        newPassword: 'nouppercase1',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes('mayúscula'))).toBe(true)
      }
    })

    it('should reject new password without number', () => {
      const result = changePasswordSchema.safeParse({
        ...validPasswordData,
        newPassword: 'NoNumberHere',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes('número'))).toBe(true)
      }
    })

    it('should reject mismatched password confirmation', () => {
      const result = changePasswordSchema.safeParse({
        ...validPasswordData,
        confirmPassword: 'DifferentPass456',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Las contraseñas no coinciden')
      }
    })
  })

  describe('updateProfileSchema', () => {
    it('should accept valid profile update', () => {
      const result = updateProfileSchema.safeParse({
        name: 'Juan Pérez',
        phone: '+34612345678',
      })
      expect(result.success).toBe(true)
    })

    it('should reject missing name', () => {
      const result = updateProfileSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nombre requerido')
      }
    })

    it('should accept profile without phone', () => {
      const result = updateProfileSchema.safeParse({
        name: 'Juan Pérez',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone format', () => {
      const result = updateProfileSchema.safeParse({
        name: 'Juan Pérez',
        phone: 'invalid-phone',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de teléfono inválido')
      }
    })

    it('should accept valid phone with country code', () => {
      const result = updateProfileSchema.safeParse({
        name: 'Juan Pérez',
        phone: '+1234567890',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createUserSchema', () => {
    const validUserData = {
      name: 'María García',
      email: 'maria@example.com',
      phone: '+34612345678',
      password: 'SecurePass123',
      capabilities: ['can_create_failure_report'],
    }

    it('should accept valid user creation', () => {
      const result = createUserSchema.safeParse(validUserData)
      expect(result.success).toBe(true)
    })

    it('should reject missing name', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        name: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nombre requerido')
      }
    })

    it('should reject invalid email format', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('should reject weak password (less than 8 characters)', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        password: 'Short1',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        password: 'nouppercase123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        password: 'NoNumberHere',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty capabilities array', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        capabilities: [],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Debe seleccionar al menos una capability')
      }
    })

    it('should accept user without phone', () => {
      const result = createUserSchema.safeParse({
        name: 'María García',
        email: 'maria@example.com',
        password: 'SecurePass123',
        capabilities: ['can_create_failure_report'],
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty string as phone number', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        phone: '',
      })
      expect(result.success).toBe(true)
    })

    it('should accept null as phone number', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        phone: null,
      })
      expect(result.success).toBe(true)
    })

    it('should accept roleLabel (for tags)', () => {
      const result = createUserSchema.safeParse({
        ...validUserData,
        roleLabel: 'Operario',
      })
      expect(result.success).toBe(true)
    })
  })
})

describe('Story 1.3: Tag Management Schemas', () => {
  describe('createTagSchema', () => {
    const validTagData = {
      name: 'Operario',
      color: '#FF5733',
      description: 'Personal de operaciones',
    }

    it('should accept valid tag creation', () => {
      const result = createTagSchema.safeParse(validTagData)
      expect(result.success).toBe(true)
    })

    it('should accept valid tag without description', () => {
      const result = createTagSchema.safeParse({
        name: 'Técnico',
        color: '#33FF57',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty tag name', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nombre de etiqueta requerido')
      }
    })

    it('should reject tag name exceeding 50 characters', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: 'A'.repeat(51), // 51 characters
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo 50 caracteres')
      }
    })

    it('should accept tag name with exactly 50 characters', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: 'A'.repeat(50), // 50 characters
      })
      expect(result.success).toBe(true)
    })

    it('should reject tag name with special characters (only letters, numbers, spaces, hyphens, underscores allowed)', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: 'Operario@#$',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('solo puede contener letras')
      }
    })

    it('should accept tag name with Spanish characters', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: 'Técnico Jefe',
      })
      expect(result.success).toBe(true)
    })

    it('should accept tag name with hyphens and underscores', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: 'Técnico_Jefe-Planta',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid hex color format (missing #)', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        color: 'FF5733',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('hex válido')
      }
    })

    it('should reject invalid hex color format (wrong length)', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        color: '#F53',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('hex válido')
      }
    })

    it('should reject invalid hex color format (invalid characters)', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        color: '#GGGGGG',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('hex válido')
      }
    })

    it('should accept valid 6-digit hex color', () => {
      const validColors = ['#FF5733', '#00FF00', '#0000FF', '#FFFFFF', '#000000']
      validColors.forEach((color) => {
        const result = createTagSchema.safeParse({
          ...validTagData,
          color,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should accept lowercase hex color', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        color: '#ff5733',
      })
      expect(result.success).toBe(true)
    })

    it('should accept mixed case hex color', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        color: '#Ff5733',
      })
      expect(result.success).toBe(true)
    })

    it('should reject description exceeding 200 characters', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        description: 'A'.repeat(201), // 201 characters
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo 200 caracteres')
      }
    })

    it('should accept description with exactly 200 characters', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        description: 'A'.repeat(200), // 200 characters
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty string as tag name', () => {
      const result = createTagSchema.safeParse({
        ...validTagData,
        name: '   ', // Only spaces
      })
      expect(result.success).toBe(false)
    })
  })

  describe('assignTagsSchema', () => {
    const validAssignData = {
      userId: 'user-123',
      tagIds: ['tag-1', 'tag-2', 'tag-3'],
    }

    it('should accept valid tag assignment', () => {
      const result = assignTagsSchema.safeParse(validAssignData)
      expect(result.success).toBe(true)
    })

    it('should accept assigning 0 tags (remove all tags)', () => {
      const result = assignTagsSchema.safeParse({
        userId: 'user-123',
        tagIds: [],
      })
      expect(result.success).toBe(true)
    })

    it('should accept assigning 20 tags (maximum allowed)', () => {
      const result = assignTagsSchema.safeParse({
        userId: 'user-123',
        tagIds: Array.from({ length: 20 }, (_, i) => `tag-${i}`),
      })
      expect(result.success).toBe(true)
    })

    it('should reject assigning more than 20 tags', () => {
      const result = assignTagsSchema.safeParse({
        userId: 'user-123',
        tagIds: Array.from({ length: 21 }, (_, i) => `tag-${i}`),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo 20 etiquetas')
      }
    })

    it('should reject missing userId', () => {
      const result = assignTagsSchema.safeParse({
        userId: '',
        tagIds: ['tag-1'],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID de usuario requerido')
      }
    })

    it('should reject empty string userId', () => {
      const result = assignTagsSchema.safeParse({
        userId: '   ',
        tagIds: ['tag-1'],
      })
      expect(result.success).toBe(false)
    })

    it('should accept single tag assignment', () => {
      const result = assignTagsSchema.safeParse({
        userId: 'user-123',
        tagIds: ['tag-1'],
      })
      expect(result.success).toBe(true)
    })
  })

  describe('updateTagSchema', () => {
    const validUpdateData = {
      name: 'Técnico Senior',
      color: '#00FF00',
      description: 'Personal técnico con experiencia',
    }

    it('should accept valid tag update with all fields', () => {
      const result = updateTagSchema.safeParse(validUpdateData)
      expect(result.success).toBe(true)
    })

    it('should accept partial update (only name)', () => {
      const result = updateTagSchema.safeParse({
        name: 'Técnico Junior',
      })
      expect(result.success).toBe(true)
    })

    it('should accept partial update (only color)', () => {
      const result = updateTagSchema.safeParse({
        color: '#FF0000',
      })
      expect(result.success).toBe(true)
    })

    it('should accept partial update (only description)', () => {
      const result = updateTagSchema.safeParse({
        description: 'Updated description',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty update (all fields optional)', () => {
      const result = updateTagSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should reject name exceeding 50 characters', () => {
      const result = updateTagSchema.safeParse({
        name: 'A'.repeat(51),
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid hex color format', () => {
      const result = updateTagSchema.safeParse({
        color: 'invalid',
      })
      expect(result.success).toBe(false)
    })

    it('should reject description exceeding 200 characters', () => {
      const result = updateTagSchema.safeParse({
        description: 'A'.repeat(201),
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty name string', () => {
      const result = updateTagSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('deleteTagSchema', () => {
    it('should accept valid tag deletion with confirmation', () => {
      const result = deleteTagSchema.safeParse({
        tagId: 'tag-123',
        confirm: true,
      })
      expect(result.success).toBe(true)
    })

    it('should reject deletion without confirmation', () => {
      const result = deleteTagSchema.safeParse({
        tagId: 'tag-123',
        confirm: false,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Debe confirmar la eliminación')
      }
    })

    it('should reject missing tagId', () => {
      const result = deleteTagSchema.safeParse({
        tagId: '',
        confirm: true,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID de etiqueta requerido')
      }
    })

    it('should reject missing confirm field', () => {
      const result = deleteTagSchema.safeParse({
        tagId: 'tag-123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty string tagId even with confirmation', () => {
      const result = deleteTagSchema.safeParse({
        tagId: '   ',
        confirm: true,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Tag Schema Edge Cases', () => {
    it('should handle special Spanish characters in tag name', () => {
      const spanishNames = [
        'Técnico Especializado',
        'Jefe de Planta',
        'Operario de Máquina',
        'Encargado de Turno',
        'Supervisor General',
      ]

      spanishNames.forEach((name) => {
        const result = createTagSchema.safeParse({
          name,
          color: '#FF5733',
        })
        expect(result.success).toBe(true)
      })
    })

    it('should handle concurrent tag creation validation (schema level only)', () => {
      // Note: This is a schema-level test - it validates the input format
      // The actual "max 20 tags in database" check must be done at the application level
      // because Zod schemas don't have access to the database

      const validTags = Array.from({ length: 5 }, (_, i) => ({
        name: `Tag-${i}`,
        color: '#FF5733',
      }))

      validTags.forEach((tag) => {
        const result = createTagSchema.safeParse(tag)
        expect(result.success).toBe(true)
      })

      // The 20-tag limit must be enforced in the server action:
      // app/actions/tags.ts -> createTag()
      // 1. Query database for current tag count
      // 2. If count >= 20, throw ValidationError
      // 3. Otherwise, create tag
    })
  })
})

describe('Schema Integration Tests', () => {
  it('should validate user creation with roleLabel (tag)', () => {
    // Integration: User schema accepting tag/roleLabel
    const result = createUserSchema.safeParse({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'SecurePass123',
      capabilities: ['can_create_failure_report'],
      roleLabel: 'Operario', // Tag assignment during user creation
    })
    expect(result.success).toBe(true)
  })

  it('should validate user creation with multiple capabilities and tag', () => {
    const result = createUserSchema.safeParse({
      name: 'María García',
      email: 'maria@example.com',
      password: 'SecurePass123',
      capabilities: [
        'can_create_failure_report',
        'can_view_work_orders',
        'can_complete_work_orders',
      ],
      roleLabel: 'Técnico',
    })
    expect(result.success).toBe(true)
  })

  it('should handle tag assignment to existing user', () => {
    const userCreation = createUserSchema.safeParse({
      name: 'Pedro López',
      email: 'pedro@example.com',
      password: 'SecurePass123',
      capabilities: ['can_create_failure_report'],
    })

    expect(userCreation.success).toBe(true)

    // After user creation, assign tags
    const tagAssignment = assignTagsSchema.safeParse({
      userId: 'pedro-user-id',
      tagIds: ['tag-operario', 'tag-turno-mañana'],
    })

    expect(tagAssignment.success).toBe(true)
  })
})
