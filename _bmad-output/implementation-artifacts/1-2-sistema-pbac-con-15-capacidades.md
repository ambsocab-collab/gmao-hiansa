# Story 1.2: Sistema PBAC con 15 Capacidades

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como administrador del sistema,
quiero asignar capacidades granulares a cada usuario,
para controlar exactamente qué puede y qué no puede hacer cada persona en el sistema.

## Acceptance Criteria

**Given** que estoy creando o editando un usuario
**When** veo el formulario de capabilities
**Then** las 15 capacidades se muestran como checkboxes con etiquetas en castellano (NFR-S68-UI)
**And** checkbox group tiene data-testid="capabilities-checkbox-group"
**And** cada capability tiene data-testid="capability-{name}" (ej: capability-can_view_kpis)
**And** labels legibles son:
  - ✅ Reportar averías (can_create_failure_report)
  - Crear OTs manuales (can_create_manual_ot)
  - Actualizar OTs propias (can_update_own_ot)
  - Ver OTs asignadas (can_view_own_ots)
  - Ver todas las OTs (can_view_all_ots)
  - Completar OTs (can_complete_ot)
  - Gestionar stock (can_manage_stock)
  - Asignar técnicos a OTs (can_assign_technicians)
  - Ver KPIs avanzados (can_view_kpis)
  - Gestionar activos (can_manage_assets)
  - Ver historial reparaciones (can_view_repair_history)
  - Gestionar proveedores (can_manage_providers)
  - Gestionar rutinas (can_manage_routines)
  - Gestionar usuarios (can_manage_users)
  - Recibir reportes automáticos (can_receive_reports)

**Given** formulario de capabilities visible
**When** creo un nuevo usuario
**Then** usuario nuevo tiene ÚNICAMENTE can_create_failure_report seleccionado por defecto (NFR-S66)
**And** las otras 14 capabilities están desmarcadas por defecto
**And** solo usuarios con can_manage_users pueden ver y modificar capabilities

**Given** que estoy editando un usuario
**When** asigno o removo capabilities
**Then** cambios aplicados inmediatamente en próxima sesión del usuario
**And** auditoría logged: "Capabilities actualizadas para usuario {id} por {adminId}"
**And** sesión actual del usuario actualizada si el usuario se está editando a sí mismo (con restricciones)

**Given** usuario sin capability can_manage_assets
**When** intenta acceder a /activos
**Then** acceso denegado con mensaje: "No tienes permiso para gestionar activos" (NFR-S76)
**And** modo solo lectura activado si tiene capability de consulta
**And** no puede crear, editar ni eliminar equipos
**And** auditoría logged: "Access denied a /activos para usuario {id}"

**Given** usuario sin capability can_view_repair_history
**When** intenta acceder al historial de reparaciones de un equipo
**Then** acceso denegado con mensaje explicativo (NFR-S68-B)
**And** no ve OTs completadas, patrones de fallas, métricas de confiabilidad
**And** auditoría logged: "Access denied a historial reparaciones para usuario {id}"

**Given** que soy el administrador inicial (primer usuario creado)
**When** consulto mis capabilities
**Then** tengo las 15 capabilities del sistema asignadas por defecto (NFR-S68-C)
**And** soy el único usuario con capabilities preasignadas además de can_create_failure_report
**And** ningún otro usuario creado posteriormente tiene capabilities preasignadas

**Given** que estoy en el dashboard
**When** navego por la aplicación
**Then** solo veo módulos en navegación para los que tengo capabilities asignadas (NFR-S74)
**And** módulos sin capabilities no aparecen en navigation
**And** si intento acceder por URL directa a módulo no autorizado, recibo access denied (NFR-S75)

## Tasks / Subtasks

- [ ] Implementar 15 checkboxes de capabilities con labels en castellano (AC: 1)
  - [ ] Crear constante CAPABILITIES array con 15 capacidades (name, label, description)
  - [ ] Implementar componente CapabilityCheckboxGroup con shadcn/ui Checkbox
  - [ ] Agregar data-testid="capabilities-checkbox-group" al contenedor
  - [ ] Agregar data-testid="capability-{name}" a cada checkbox
- [ ] Configurar capability por defecto para nuevos usuarios (AC: 2)
  - [ ] Modificar server action createUser para asignar solo can_create_failure_report
  - [ ] Implementar validación: solo usuarios con can_manage_users pueden modificar capabilities
  - [ ] Agregar AuthorizationError si usuario sin permiso intenta modificar capabilities
- [ ] Implementar actualización de capabilities con auditoría (AC: 3)
  - [ ] Crear server action updateUserCapabilities(userId, capabilities[])
  - [ ] Implementar lógica de actualización en UserCapability join table
  - [ ] Agregar entrada en AuditLog con acción "capability_changed"
  - [ ] Actualizar sesión del usuario si se está editando a sí mismo
- [ ] Implementar access denied con mensajes personalizados (AC: 4, 5, 6, 8, 9)
  - [ ] Agregar validaciones de capabilities en middleware para rutas protegidas
  - [ ] Implementar mensajes en castellano específicos por capability
  - [ ] Registrar access denied en AuditLog
  - [ ] Mostrar modo solo lectura si usuario tiene capability de consulta
- [ ] Configurar administrador inicial con 15 capabilities (AC: 7)
  - [ ] Crear seed script que verifica si es el primer usuario
  - [ ] Asignar todas las 15 capabilities al primer usuario (admin inicial)
  - [ ] Documentar que solo el admin inicial tiene capabilities preasignadas
- [ ] Adaptar navegación basada en capabilities del usuario (AC: 9)
  - [ ] Crear helper getNavigationItems(userCapabilities) que retorna rutas visibles
  - [ ] Actualizar componente Navigation para ocultar rutas sin capabilities
  - [ ] Implementar access denied en middleware para rutas no autorizadas por URL directa
- [ ] Tests E2E de PBAC con 15 capabilities (AC: 1, 2, 3, 4, 5, 6, 7, 8, 9)
  - [ ] Test: Admin crea usuario con solo can_create_failure_report por defecto
  - [ ] Test: Admin asigna capabilities múltiples a usuario
  - [ ] Test: Usuario sin can_manage_assets recibe access denied
  - [ ] Test: Usuario sin can_view_repair_history no ve historial
  - [ ] Test: Navegación muestra solo módulos con capabilities asignadas
  - [ ] Test: Access denied al acceder por URL directa a módulo no autorizado
  - [ ] Test: Auditoría registra cambios de capabilities

## Dev Notes

### Critical Security Requirements (PBAC System)

**🔥 CRITICAL: Defense in Depth - 3 Layers of Protection**

The PBAC (Permission-Based Access Control) system requires 3 layers of security validation:

1. **Middleware Layer** (`middleware.ts`)
   - Protects entire routes based on capabilities
   - Validates `ROUTE_CAPABILITIES` mapping
   - Redirects to access denied page with specific messages

2. **Server Actions Layer** (`app/actions/users.ts`)
   - Validates capabilities before executing any action
   - Throws `AuthorizationError` if user lacks required capability
   - Checks `can_manage_users` for user management operations

3. **UI Adaptation Layer** (Components)
   - Hides/shows UI elements based on user capabilities
   - Provides better UX (doesn't show buttons user can't use)
   - NOT a security layer, just UX improvement

**⚠️ SECURITY VULNERABILITY FROM STORY 1.1:**
Story 1.1 had a CRITICAL security bug where the code checked capability but didn't throw error. This was fixed in Code Review Round 7.

**DO NOT REPEAT THIS MISTAKE:**
```typescript
// ❌ WRONG - Checks capability but allows action
if (!hasCapability(user, 'can_manage_users')) {
  console.log('User lacks capability'); // Just logs, doesn't stop!
}
deleteUser(id) // Still executes!

// ✅ CORRECT - Checks and throws error
if (!hasCapability(user, 'can_manage_users')) {
  throw new AuthorizationError('No tienes permiso para eliminar usuarios');
}
deleteUser(id) // Never executes if capability missing
```

### The 15 PBAC Capabilities

**From: `prisma/schema.prisma` lines 43-67**

```typescript
// Define this constant in lib/capabilities.ts
export const CAPABILITIES = [
  {
    name: 'can_create_failure_report',
    label: 'Reportar averías',
    description: 'Permite crear reportes de avería en el sistema'
  },
  {
    name: 'can_create_manual_ot',
    label: 'Crear OTs manuales',
    description: 'Permite crear órdenes de trabajo manualmente'
  },
  {
    name: 'can_update_own_ot',
    label: 'Actualizar OTs propias',
    description: 'Permite actualizar las OTs asignadas al usuario'
  },
  {
    name: 'can_view_own_ots',
    label: 'Ver OTs asignadas',
    description: 'Permite ver las OTs asignadas al usuario'
  },
  {
    name: 'can_view_all_ots',
    label: 'Ver todas las OTs',
    description: 'Permite ver todas las OTs del sistema'
  },
  {
    name: 'can_complete_ot',
    label: 'Completar OTs',
    description: 'Permite completar OTs y marcarlas como finalizadas'
  },
  {
    name: 'can_manage_stock',
    label: 'Gestionar stock',
    description: 'Permite gestionar stock de repuestos'
  },
  {
    name: 'can_assign_technicians',
    label: 'Asignar técnicos a OTs',
    description: 'Permite asignar técnicos a órdenes de trabajo'
  },
  {
    name: 'can_view_kpis',
    label: 'Ver KPIs avanzados',
    description: 'Permite ver dashboard con KPIs y métricas'
  },
  {
    name: 'can_manage_assets',
    label: 'Gestionar activos',
    description: 'Permite crear, editar y eliminar activos/equipos'
  },
  {
    name: 'can_view_repair_history',
    label: 'Ver historial reparaciones',
    description: 'Permite ver historial de reparaciones de equipos'
  },
  {
    name: 'can_manage_providers',
    label: 'Gestionar proveedores',
    description: 'Permite gestionar catálogo de proveedores'
  },
  {
    name: 'can_manage_routines',
    label: 'Gestionar rutinas',
    description: 'Permite gestionar rutinas de mantenimiento preventivo'
  },
  {
    name: 'can_manage_users',
    label: 'Gestionar usuarios',
    description: 'Permite crear, editar y eliminar usuarios del sistema'
  },
  {
    name: 'can_receive_reports',
    label: 'Recibir reportes automáticos',
    description: 'Permite recibir reportes automáticos por email'
  }
] as const
```

### Database Models Involved

**From: `prisma/schema.prisma` lines 18-67**

```prisma
model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  passwordHash       String
  name               String
  phone              String?
  forcePasswordReset Boolean   @default(false)
  deleted            Boolean   @default(false)

  // PBAC Relations
  userCapabilities UserCapability[]

  // Audit/Activity Relations
  activityLogs ActivityLog[]
  auditLogs    AuditLog[]
}

model Capability {
  id          String  @id @default(cuid())
  name        String  @unique // enum inglés: can_create_failure_report
  label       String  // castellano: "Reportar averías"
  description String?

  userCapabilities UserCapability[]
}

model UserCapability {
  userId       String
  capabilityId String
  createdAt    DateTime @default(now())

  // Relations
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  capability Capability @relation(fields: [capabilityId], references: [id], onDelete: Cascade)

  @@id([userId, capabilityId])
  @@index([userId])
}

model ActivityLog {
  id        String   @id @default(cuid())
  userId    String
  action    String // login, profile_update, password_change, capability_changed
  metadata  Json?
  timestamp DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, timestamp])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String   // Admin who performed the action
  action    String // user_created, user_deleted, capability_changed
  targetId  String?
  metadata  Json?
  timestamp DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, timestamp])
}
```

### Architecture Patterns from Story 1.1

**From: `_bmad-output/implementation-artifacts/1-1-login-registro-y-perfil-de-usuario.md`**

**✅ What Worked Well (Reuse These Patterns):**

1. **PBAC Middleware Implementation** (Story 1.1, 24/24 tests passing)
   - File: `middleware.ts`
   - Pattern: `ROUTE_CAPABILITIES` mapping object
   - Validation: Checks user session capabilities before allowing access
   - Tests: All 24 middleware tests passing
   - **REUSE:** Extend ROUTE_CAPABILITIES with new protected routes

2. **AuthorizationError Custom Class** (Story 1.1, Critical Fix in Round 7)
   - File: `lib/utils/errors.ts`
   - Usage: `throw new AuthorizationError('No tienes permiso para gestionar activos')`
   - Critical: MUST throw error, not just check capability
   - **REUSE:** Use same pattern for all capability checks

3. **Server Actions with Capability Validation** (Story 1.1, 33/33 tests passing)
   - File: `app/actions/users.ts`
   - Pattern:
     ```typescript
     'use server'
     import { auth } from '@/lib/auth'
     import { AuthorizationError } from '@/lib/utils/errors'

     export async function deleteUser(userId: string) {
       const session = await auth()
       if (!session?.user?.capabilities?.includes('can_manage_users')) {
         throw new AuthorizationError('No tienes permiso para eliminar usuarios')
       }
       // ... rest of logic
     }
     ```
   - **REUSE:** Same pattern for updateUserCapabilities

4. **Audit Logging Pattern** (Story 1.1, Working Implementation)
   - File: `app/actions/users.ts`
   - Pattern:
     ```typescript
     await prisma.auditLog.create({
       data: {
         userId: session.user.id,
         action: 'capability_changed',
         targetId: targetUserId,
         metadata: { oldCapabilities, newCapabilities }
       }
     })
     ```
   - **REUSE:** Log all capability changes with AuditLog

5. **Zod Schema Validation** (Story 1.1, Fixed in Round 7)
   - File: `lib/schemas.ts`
   - Pattern: Validate with Zod before processing
   - **REUSE:** Create `updateCapabilitiesSchema` with Zod

**⚠️ Critical Mistakes to Avoid (Learned from Story 1.1):**

1. **❌ Checking Capability Without Throwing Error**
   - Story 1.1 had this bug: checked capability but didn't throw `AuthorizationError`
   - Fixed in Code Review Round 7
   - **Lesson:** ALWAYS throw error if capability check fails

2. **❌ Forgetting to Add Capability to ROUTE_CAPABILITIES**
   - Middleware can't protect route if not in mapping
   - **Lesson:** Add all protected routes to ROUTE_CAPABILITIES

3. **❌ Inconsistent Property Names (snake_case vs camelCase)**
   - Story 1.1 tests failed due to: `password_hash` vs `passwordHash`
   - Prisma returns camelCase, database is snake_case
   - **Lesson:** Always use camelCase in TypeScript code

4. **❌ Missing Audit Logging**
   - Story 1.1 initially forgot to log user deletions
   - Fixed in later rounds
   - **Lesson:** ALWAYS log critical actions (capability changes)

### File Structure Requirements

**New Files to Create:**

```
lib/
  capabilities.ts                    # Define CAPABILITIES constant with 15 capabilities
  helpers/
    navigation.ts                    # getNavigationItems(userCapabilities) helper

app/
  (dashboard)/
    usuarios/
      [id]/
        editar/
          page.tsx                   # User edit page with capabilities checkboxes
    components/
      CapabilityCheckboxGroup.tsx    # Checkbox group component with 15 capabilities

app/actions/
  users.ts                           # Add updateUserCapabilities action
```

**Files to Modify:**

```
middleware.ts                        # Add new routes to ROUTE_CAPABILITIES
app/components/Navigation.tsx        # Use getNavigationItems() to filter routes
lib/auth-adapter.ts                  # Ensure capabilities loaded in session
prisma/schema.prisma                 # Already has UserCapability models (no changes needed)
prisma/seed.ts                       # Assign all 15 capabilities to first user (admin)
```

### Testing Standards

**From: `project-context.md` lines 293-358**

**Test Coverage Expectations:**
- Critical paths: Server Actions, business logic (aim for >80%)
- UI components: Components with forms and validation (aim for >60%)
- Utilities: Helper functions, validation schemas (aim for >90%)

**Test Organization:**
- Colocate tests with code: `{ComponentName}.test.tsx` next to component
- Integration tests: `tests/integration/` or `__tests__/` for cross-feature tests
- E2E tests: `tests/e2e/` folder (using Playwright)

**Testing Framework Configuration:**
- Unit/Integration: Vitest 1.0.0 with jsdom environment
- E2E: Playwright 1.48.0 (Chromium only, 4 workers)

**Tests Required for Story 1.2:**

1. **Unit Tests** (`lib/capabilities.test.ts`):
   - Test CAPABILITIES constant has 15 items
   - Test each capability has required fields (name, label, description)
   - Test getNavigationItems() filters correctly

2. **Integration Tests** (`app/actions/users.test.ts`):
   - Test updateUserCapabilities assigns capabilities correctly
   - Test only users with can_manage_users can update capabilities
   - Test AuditLog created on capability change
   - Test default capability (can_create_failure_report) for new users

3. **E2E Tests** (`tests/e2e/pbac.spec.ts`):
   - Test admin creates user with only default capability
   - Test admin assigns multiple capabilities to user
   - Test user without can_manage_assets receives access denied
   - Test navigation shows only modules with user's capabilities
   - Test access denied when accessing URL directly without capability
   - Test audit log records capability changes

### Project Structure Notes

**Alignment with Unified Project Structure:**

This story follows the feature-based organization pattern defined in `architecture/project-structure-boundaries.md`:

- **User management** is a distinct feature domain
- **PBAC system** is cross-cutting (affects all features)
- **Authorization logic** lives in `middleware.ts` (app-level)
- **Server Actions** live in `app/actions/users.ts`
- **UI components** live in `app/components/`

**No Conflicts Detected:**
- All patterns align with Story 1.1 implementation
- Prisma schema already supports UserCapability relationships
- Middleware pattern from Story 1.1 is extensible

### References

**Primary Sources:**
- [Source: _bmad-output/planning-artifacts/epics.md#story-12-sistema-pbac-con-15-capacidades](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\epics.md)
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#authentication-security](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\architecture\core-architectural-decisions.md)
- [Source: _bmad-output/implementation-artifacts/1-1-login-registro-y-perfil-de-usuario.md](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\implementation-artifacts\1-1-login-registro-y-perfil-de-usuario.md)
- [Source: prisma/schema.prisma#lines-18-98](C:\Users\ambso\dev\gmao-hiansa\prisma\schema.prisma)

**Supporting Sources:**
- [Source: _bmad-output/project-context.md#error-handling-patterns-story-05](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\project-context.md)
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\architecture\implementation-patterns-consistency-rules.md)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None (story not yet implemented)

### Completion Notes List

*Story created with comprehensive context from:*
- Epic 1 requirements and acceptance criteria (epics.md lines 1059-1132)
- Prisma schema with UserCapability models (schema.prisma lines 18-98)
- Story 1.1 patterns and lessons learned (1-1-login-registro-y-perfil-de-usuario.md)
- Architecture decisions for PBAC system (core-architectural-decisions.md)
- Project context and testing standards (project-context.md)

### File List

*Planned files to create:*
- lib/capabilities.ts - CAPABILITIES constant definition
- lib/helpers/navigation.ts - getNavigationItems() helper
- app/(dashboard)/usuarios/[id]/editar/page.tsx - User edit page with capabilities
- app/components/CapabilityCheckboxGroup.tsx - Checkbox group component
- tests/e2e/pbac.spec.ts - E2E tests for PBAC system

*Planned files to modify:*
- middleware.ts - Add new routes to ROUTE_CAPABILITIES mapping
- app/components/Navigation.tsx - Filter navigation by capabilities
- lib/auth-adapter.ts - Ensure capabilities in session
- prisma/seed.ts - Assign all 15 capabilities to first user
- app/actions/users.ts - Add updateUserCapabilities server action
