# Story 1.3: Etiquetas de Clasificación y Organización

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como administrador del sistema,
quiero crear y asignar etiquetas de clasificación a usuarios (ej: Operario, Técnico, Supervisor),
para organizar visualmente a las personas sin afectar sus capacidades de acceso.

## Acceptance Criteria

**Given** que soy administrador con capability can_manage_users
**When** accedo a /usuarios/etiquetas
**Then** puedo crear hasta 20 etiquetas de clasificación personalizadas (NFR-S59)
**And** cada etiqueta tiene: nombre (ej: "Operario", "Técnico", "Supervisor"), color seleccionable, descripción opcional
**And** formulario tiene data-testid="crear-etiqueta-form"
**And** input nombre tiene data-testid="etiqueta-nombre"

**Given** que he creado etiquetas
**When** asigno etiquetas a un usuario
**Then** puedo asignar una o más etiquetas simultáneamente (NFR-S62)
**And** selecciono etiquetas con checkboxes o multi-select
**And** etiquetas mostradas en perfil de usuario como badges/tags visuales
**And** data-testid="usuario-etiquetas" presente en vista de detalle

**Given** que veo la lista de usuarios
**When** etiquetas están asignadas
**Then** puedo ver etiquetas como tags en cada usuario de la lista
**And** puedo filtrar usuarios por etiqueta
**And** puedo ordenar lista por etiqueta
**And** etiquetas sirven solo para organización visual (NFR-S67-A)

**Given** que estoy asignando capabilities
**When** asigno o removo capabilities
**Then** las etiquetas de clasificación NO otorgan ni removen capabilities (NFR-S67-A)
**And** una misma etiqueta NO otorga las mismas capacidades a todos los usuarios que la tienen (NFR-S67-B)
**And** capabilities y etiquetas son completamente independientes
**And** UI muestra mensaje clarificador: "Las etiquetas son solo para organización visual y no afectan los permisos"

**Given** que soy administrador
**When** elimino una etiqueta
**Then** confirmación modal requerida: "¿Eliminar etiqueta {nombre}? Esta acción no afecta las capabilities de los usuarios."
**And** etiqueta removida de todos los usuarios que la tenían asignada
**And** auditoría logged: "Etiqueta {id} eliminada por {adminId}"
**And** etiqueta deja de aparecer en lista de etiquetas disponibles

**Given** que estoy editando un usuario
**When** asigno o quito etiquetas
**Then** cambios aplicados inmediatamente
**And** usuario actualizado refleja nuevas etiquetas
**And** navegación por etiquetas actualizada en tiempo real
**And** no hay límite de cuántas etiquetas puede tener un usuario

**Given** que he creado 20 etiquetas
**When** intento crear una etiqueta número 21
**Then** veo mensaje de error: "Has alcanzado el máximo de 20 etiquetas personalizadas"
**And** botón de crear deshabilitado
**And** sugerencia: "Elimina etiquetas existentes antes de crear nuevas"

## Tasks / Subtasks

- [x] Implementar modelo Tag en Prisma schema (AC: 1)
  - [x] Crear model Tag con campos: id, name, color, description, createdAt
  - [x] Crear model UserTag (join table) con userId y tagId
  - [x] Agregar restricción de máximo 20 etiquetas (validación a nivel aplicación)
  - [x] Crear índices para optimizar consultas
- [x] Implementar Server Actions para gestión de etiquetas (AC: 1, 5)
  - [x] Crear createTag(name, color, description) con validación de máximo 20
  - [x] Crear deleteTag(tagId) con confirmación y cascade a usuarios
  - [x] Crear assignTagsToUser(userId, tagIds[])
  - [x] Añadir auditoría para creaciones y eliminaciones
- [ ] Implementar formulario de creación de etiquetas (AC: 1)
  - [ ] Crear componente CreateTagForm con data-testid="crear-etiqueta-form"
  - [ ] Input nombre con data-testid="etiqueta-nombre"
  - [ ] Selector de color (preset de colores WCAG AA compliant)
  - [ ] Textarea para descripción opcional
- [ ] Implementar asignación de etiquetas a usuarios (AC: 2, 6)
  - [ ] Modificar formulario de edición de usuario para incluir selección de etiquetas
  - [ ] Multi-select o checkboxes para seleccionar múltiples etiquetas
  - [ ] Mostrar etiquetas actuales como badges con data-testid="usuario-etiquetas"
  - [ ] Actualización en tiempo real al asignar/quitar etiquetas
- [ ] Implementar visualización de etiquetas en lista de usuarios (AC: 3, 4)
  - [ ] Modificar componente UserList para mostrar etiquetas como tags
  - [ ] Implementar filtro por etiqueta en lista de usuarios
  - [ ] Implementar ordenamiento por etiqueta
  - [ ] Badge/tag visual con color seleccionado
- [ ] Implementar verificación de independencia etiquetas-capabilities (AC: 4)
  - [ ] Test: Asignar misma etiqueta a usuarios con diferentes capabilities
  - [ ] Test: Verificar que cambiar capabilities no afecta etiquetas
  - [ ] Test: Verificar que cambiar etiquetas no afecta capabilities
  - [ ] Mensaje clarificador en UI: "Las etiquetas son solo para organización visual y no afectan los permisos"
- [ ] Implementar eliminación de etiquetas con cascade (AC: 5)
  - [ ] Modal de confirmación con mensaje específico
  - [ ] Eliminar etiqueta de UserTag para todos los usuarios asignados
  - [ ] Auditoría en AuditLog con acción "tag_deleted"
  - [ ] Refrescar lista de etiquetas disponibles
- [ ] Validar límite de 20 etiquetas (AC: 7)
  - [ ] Contador de etiquetas creadas en DB
  - [ ] Validación en createTag: rechazar si hay 20 existentes
  - [ ] Mensaje de error: "Has alcanzado el máximo de 20 etiquetas personalizadas"
  - [ ] Sugerencia UI: "Elimina etiquetas existentes antes de crear nuevas"
- [x] Tests de Integración de Etiquetas (Vitest)
  - [x] Test: Verificar independencia etiquetas-capabilities (P0-INT-003)
  - [x] Test: Asignar misma etiqueta a usuarios con diferentes capabilities
  - [x] Test: Verificar que cambiar capabilities no afecta etiquetas
  - [x] Test: Verificar que cambiar etiquetas no afecta capabilities
  - [x] Test: Verificar PBAC middleware ignora tags
  - [x] Test: Prevenir escalación de privilegios mediante tags
  - [x] Test: Prevenir bypass de controles de acceso
- [ ] Tests E2E de Etiquetas (Playwright)
  - [ ] Test: Admin crea etiqueta "Operario"
  - [ ] Test: Admin asigna etiqueta a usuario
  - [ ] Test: Verificar que etiqueta NO otorga capabilities
  - [ ] Test: Filtrar usuarios por etiqueta
  - [ ] Test: Asignar misma etiqueta a usuarios con diferentes capabilities

## Dev Notes

### Critical Security Requirements (Etiquetas NO otorgan Capabilities)

**🔥 CRITICAL: Las Etiquetas son SOLO VISUALES - NO AFECTAN PERMISOS**

A diferencia de los roles tradicionales, las etiquetas de clasificación en este sistema:
- **NO otorgan capabilities** - Son puramente para organización visual
- **NO heredan capabilities** - Usuarios con misma etiqueta pueden tener diferentes permisos
- **NO reemplazan PBAC** - El sistema de permisos está completamente basado en las 15 capabilities

**⚠️ VALIDACIÓN REQUERIDA:**
El sistema debe verificar y demostrar que:
1. Asignar una etiqueta NO modifica las capabilities del usuario
2. Dos usuarios con la misma etiqueta pueden tener completamente diferentes capabilities
3. Eliminar una etiqueta NO afecta las capabilities de los usuarios

### Database Models Needed

**New Models to Add (NOT in current schema):**

```prisma
// Story 1.3: Etiquetas de Clasificación (Tags)
model Tag {
  id          String   @id @default(cuid())
  name        String   @unique // "Operario", "Técnico", "Supervisor"
  color       String   // Hex color WCAG AA compliant
  description String?  // Optional description
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  userTags UserTag[]

  @@index([name])
  @@map("tags")
}

// Story 1.3: Join table para User ↔ Tag (muchos a muchos)
model UserTag {
  userId String @map("userId")
  tagId  String @map("tagId")
  assignedAt DateTime @default(now()) @map("assigned_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([userId, tagId])
  @@index([userId]) // Para buscar etiquetas de un usuario
  @@index([tagId])  // Para buscar usuarios con una etiqueta
  @@map("userTags")
}
```

**Models to Modify:**

```prisma
model User {
  // ... existing fields ...

  // Story 1.3: Add tags relation
  userTags UserTag[] // NEW

  // ... existing relations ...
}
```

### Architecture Patterns from Story 1.2 (REUSE)

**From: `_bmad-output/implementation-artifacts/1-2-sistema-pbac-con-15-capacidades.md`**

**✅ What Worked Well (Reuse These Patterns):**

1. **PBAC Middleware Implementation** (Story 1.2, 24/24 tests passing)
   - File: `middleware.ts`
   - Pattern: `ROUTE_CAPABILITIES` mapping object
   - **REUSE:** Add `/usuarios/etiquetas` to ROUTE_CAPABILITIES with `can_manage_users`

2. **Server Actions with Capability Validation** (Story 1.2)
   - File: `app/actions/users.ts`
   - Pattern: Check `can_manage_users` before admin operations
   - **REUSE:** Same pattern for createTag, deleteTag, assignTagsToUser

3. **Audit Logging Pattern** (Story 1.2)
   - Pattern: Log all admin actions with AuditLog
   - **REUSE:** Log tag creation and deletion
   ```typescript
   await prisma.auditLog.create({
     data: {
       userId: session.user.id,
       action: 'tag_created', // or 'tag_deleted'
       targetId: tagId,
       metadata: { name, color }
     }
   })
   ```

4. **Zod Schema Validation** (Story 1.2)
   - **REUSE:** Create `createTagSchema`, `assignTagsSchema` with Zod
   - Validate color format (hex, WCAG AA compliance)
   - Validate max 20 tags constraint

5. **Custom Error Classes** (Story 0.5, Reused in Story 1.2)
   - `ValidationError` for validation failures (max 20 tags reached)
   - `AuthorizationError` for capability checks

**⚠️ Critical Mistakes to Avoid (Learned from Story 1.2):**

1. **❌ Checking Capability Without Throwing Error**
   - Story 1.1 had this bug, fixed in Story 1.2
   - **Lesson:** ALWAYS throw `AuthorizationError` if capability check fails

2. **❌ Forgetting to Add Route to ROUTE_CAPABILITIES**
   - **Lesson:** Add `/usuarios/etiquetas` to middleware protection

3. **❌ Forgetting Audit Logging**
   - **Lesson:** Log all tag creation and deletion actions

4. **❌ Inconsistent Property Names (snake_case vs camelCase)**
   - Prisma returns camelCase, database is snake_case
   - **Lesson:** Always use camelCase in TypeScript code

### File Structure Requirements

**New Files to Create:**

```
app/
  (dashboard)/
    usuarios/
      etiquetas/
        page.tsx                      # Tags management page
      components/
        CreateTagForm.tsx             # Tag creation form
        TagBadge.tsx                  # Visual tag badge component
        TagMultiSelect.tsx            # Multi-select for tag assignment
      [id]/
        editar/
          page.tsx                    # MODIFICAR: Add tag selection

lib/
  schemas.ts                          # ADD: createTagSchema, assignTagsSchema

app/actions/
  tags.ts                             # NEW: createTag, deleteTag, assignTagsToUser
```

**Files to Modify:**

```
prisma/schema.prisma                  # ADD: Tag, UserTag models
prisma/seed.ts                        # ADD: Create default tags (Operario, Técnico, Supervisor)
middleware.ts                         # ADD: /usuarios/etiquetas to ROUTE_CAPABILITIES
app/(dashboard)/usuarios/page.tsx     # MODIFY: Show tags in user list, add filter
app/actions/users.ts                  # NO CHANGE: Tags are separate from capabilities
```

### Testing Standards

**From: `project-context.md` lines 293-358**

**Tests Required for Story 1.3:**

1. **Unit Tests** (`lib/schemas.test.ts` - ADD):
   - Test createTagSchema validates tag name format
   - Test createTagSchema validates hex color format
   - Test assignTagsSchema validates array of tag IDs

2. **Integration Tests** (`app/actions/tags.test.ts` - NEW):
   - Test createTag creates tag in DB
   - Test createTag rejects when 20 tags exist
   - Test deleteTag cascades to UserTag (removes from users)
   - Test assignTagsToUser assigns multiple tags
   - Test AuditLog created on tag creation/deletion
   - Test: Verify assigning tag doesn't change user capabilities

3. **E2E Tests** (`tests/e2e/tags.spec.ts` - NEW):
   - Test admin creates tag "Operario" with color
   - Test admin assigns tag to user
   - Test tag appears as badge in user profile
   - Test filter users by tag
   - Test delete tag removes from all users
   - Test: User with tag "Operario" but without can_manage_assets cannot access /activos
   - Test: Two users with same tag have different capabilities

**Test Coverage Expectations:**
- Server Actions (tags.ts): Aim for >80%
- UI Components (TagBadge, TagMultiSelect): Aim for >60%
- Integration tests: Cover all tag lifecycle (create, assign, delete)

### Project Structure Notes

**Alignment with Unified Project Structure:**

This story follows the feature-based organization pattern:

- **User tags** is part of user management feature domain
- **Tag management UI** lives in `app/(dashboard)/usuarios/etiquetas/`
- **Server Actions** live in `app/actions/tags.ts`
- **UI components** live in `app/(dashboard)/usuarios/components/`

**No Conflicts Detected:**
- Tags are a NEW feature (no existing implementation)
- Prisma schema needs new models (Tag, UserTag)
- Middleware pattern from Story 1.2 is extensible
- Audit logging pattern from Story 1.2 is reusable

### Validation Requirements

**🔍 CRITICAL: Verificar Independencia Etiquetas-Capabilities**

El sistema debe DEMOSTRAR que las etiquetas NO otorgan capabilities:

**Test 1: Asignar etiqueta NO modifica capabilities**
```typescript
// Given: Usuario con 2 capabilities
const user = await getUser(userId)
expect(user.capabilities).toHaveLength(2)

// When: Asignar etiqueta "Operario"
await assignTagsToUser(userId, ['tagId'])

// Then: Capabilities se mantienen iguales
const updated = await getUser(userId)
expect(updated.capabilities).toHaveLength(2)
expect(updated.tags).toContain('Operario')
```

**Test 2: Misma etiqueta, diferentes capabilities**
```typescript
// Given: Dos usuarios con etiqueta "Operario"
const user1 = await createUser({ tags: ['Operario'], capabilities: ['can_create_failure_report'] })
const user2 = await createUser({ tags: ['Operario'], capabilities: ['can_view_all_ots', 'can_manage_users'] })

// Then: Capabilities son diferentes
expect(user1.capabilities).not.toEqual(user2.capabilities)

// When: Eliminar etiqueta "Operario" de user1
await removeTagFromUser(user1.id, 'Operario')

// Then: user2 mantiene sus capabilities
const user2After = await getUser(user2.id)
expect(user2After.capabilities).toEqual(user2.capabilities)
```

**Test 3: Etiqueta NO otorga acceso a rutas protegidas**
```typescript
// Given: Usuario con etiqueta "Supervisor" pero sin can_view_kpis
const user = await createUser({
  tags: ['Supervisor'],
  capabilities: ['can_create_failure_report'] // NO tiene can_view_kpis
})

// When: Intenta acceder a /kpis
const response = await fetch('/kpis', { session: user })

// Then: Access denied (etiqueta "Supervisor" no otorga acceso)
expect(response.status).toBe(403)
expect(response.body).toContain('No tienes permiso para ver KPIs')
```

### Previous Story Intelligence

**From: Story 1.2 - Sistema PBAC con 15 Capacidades**

**Learnings to Apply:**

1. **Middleware Protection is Critical**
   - Story 1.2 successfully implemented ROUTE_CAPABILITIES mapping
   - **Apply:** Add `/usuarios/etiquetas` with `can_manage_users` requirement

2. **Audit Logging for Admin Actions**
   - Story 1.2 logged all capability changes
   - **Apply:** Log tag creation and deletion in AuditLog

3. **Zod Schema Validation Prevents Bugs**
   - Story 1.2 used Zod for all inputs
   - **Apply:** Validate tag name (not empty, max length), color (hex format), max 20 tags

4. **Test Coverage Prevents Regressions**
   - Story 1.2 had 86/86 tests passing
   - **Apply:** Aim for similar coverage in Story 1.3

5. **PBAC is Independent of User Attributes**
   - Story 1.2 demonstrated that capabilities are NOT tied to roles
   - **Apply:** Tags are another independent attribute - completely separate from capabilities

### Git Intelligence Summary

**Recent Work Patterns (from last 10 commits):**

1. **Story 1.2 (PBAC) Implementation**
   - Commit: `feat(pbac): Implement Story 1.2 PBAC system with 15 capabilities`
   - Pattern: Server Actions → Tests → E2E → Validation
   - Result: 86/86 tests passing, Gate PASS

2. **Code Review Process**
   - Multiple rounds of review (7 rounds for Story 1.1)
   - Pattern: Fix CRITICAL security issues → Re-test → Validate
   - **Apply:** Expect 3-5 code review rounds for Story 1.3

3. **E2E Test Stability**
   - Fixed flaky tests in Stories 1.1 and 1.2
   - Pattern: Use stable data-testid selectors, avoid timing-dependent assertions
   - **Apply:** Use data-testid="crear-etiqueta-form", "etiqueta-nombre", "usuario-etiquetas"

4. **Branch Naming Convention**
   - Pattern: `story-1.3-etiquetas` for feature branch
   - Commits: `feat(story-1.3): crear modelo Tag en Prisma`, etc.

5. **CI/CD Integration**
   - All tests must pass before merge
   - E2E tests run on Chromium only
   - **Apply:** Ensure new tag tests are included in CI

### References

**Primary Sources:**
- [Source: _bmad-output/planning-artifacts/epics.md#story-13-etiquetas-de-clasificacion-y-organizacion](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\epics.md)
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#5-gestion-de-usuarios-roles-y-capacidades](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\prd\functional-requirements.md)
- [Source: prisma/schema.prisma#lines-18-98](C:\Users\ambso\dev\gmao-hiansa\prisma\schema.prisma)

**Supporting Sources:**
- [Source: _bmad-output/implementation-artifacts/1-2-sistema-pbac-con-15-capacidades.md](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\implementation-artifacts\1-2-sistema-pbac-con-15-capacidades.md)
- [Source: _bmad-output/project-context.md#error-handling-patterns-story-05](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\project-context.md)
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md](C:\Users\ambso\dev\gmao-hiansa\_bmad-output\planning-artifacts\architecture\implementation-patterns-consistency-rules.md)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- 2026-03-14: Sesión 1 - Inicio implementación Story 1.3
- Epic 1 status: in-progress (Story 1.1 done, Story 1.2 done, Story 1.3 in-progress)
- Previous learnings: Story 1.2 (PBAC) completed with 86/86 tests passing

### Completion Notes List

**Backend Implementation (Phase 1-3 COMPLETED):**

✅ **Prisma Schema Models:**
- Added `Tag` model with fields: id, name (unique), color, description, createdAt
- Added `UserTag` join table with userId, tagId, assignedAt (many-to-many relation)
- Modified `User` model to include `userTags` relation
- Added indexes: Tag.name, UserTag.userId, UserTag.tagId
- Database schema pushed successfully to Neon PostgreSQL

✅ **Server Actions (app/actions/tags.ts):**
- `createTag(name, color, description)` - Validates max 20 tags constraint
- `deleteTag(tagId)` - Cascades delete to UserTag, confirms deletion
- `assignTagsToUser(userId, tagIds[])` - CRITICAL: Verifies capabilities NOT modified
- `getTags()` - Returns all tags with user count
- `getUserTags(userId)` - Returns tags for specific user
- All actions include: capability checks (can_manage_users), audit logging, error handling, performance tracking

✅ **Middleware Protection:**
- Added `/usuarios/etiquetas` to ROUTE_CAPABILITIES mapping
- Requires `can_manage_users` capability for tag management routes

✅ **Zod Schemas (lib/schemas.ts):**
- `createTagSchema` - Validates name, hex color, optional description
- `assignTagsSchema` - Validates userId and tagIds array
- `deleteTagSchema` - Validates tagId and confirmation
- `updateTagSchema` - Validates optional tag updates

✅ **Integration Tests (tests/integration/story-1.3-tags-pbac.test.ts):**
- 13/13 tests passing (P0-INT-003: Tags PBAC Independence Verification)
- Verified: Tags do NOT grant route access
- Verified: Same tag can have different capabilities
- Verified: Changing capabilities doesn't affect tags
- Verified: Changing tags doesn't affect capabilities
- Verified: PBAC middleware ignores tags
- Verified: Privilege escalation prevention via tag assignment
- Verified: Access bypass prevention via tag manipulation

**Pending Implementation (Phase 4-6):**

🔄 **UI Components (NOT IMPLEMENTED):**
- `CreateTagForm.tsx` - Tag creation form with color picker
- `TagBadge.tsx` - Visual tag component with color
- `TagMultiSelect.tsx` - Multi-select for tag assignment
- `/usuarios/etiquetas/page.tsx` - Tags management page
- Modify `/usuarios/[id]/editar/page.tsx` - Add tag selection
- Modify `/usuarios/page.tsx` - Show tags in list, add filter/sort
- Clarifier message: "Las etiquetas son solo para organización visual y no afectan los permisos"

🔄 **E2E Tests (NOT CREATED):**
- P0-E2E-001: Etiquetas NO otorgan capabilities
- P0-E2E-002: Misma etiqueta, diferentes capabilities
- P1-E2E-001: Crear etiqueta "Operario"
- P1-E2E-003: Asignar múltiples etiquetas a usuario
- P1-E2E-004: Etiquetas visibles en perfil
- P1-E2E-005: Filtrar usuarios por etiqueta
- P1-E2E-006: Eliminar etiqueta con cascade
- P1-E2E-007: Mensaje clarificador

### File List

**Modified Files:**
- `prisma/schema.prisma` - Added Tag and UserTag models, modified User model
- `middleware.ts` - Added /usuarios/etiquetas route protection
- `lib/schemas.ts` - Added tag-related Zod schemas (already existed)

**Created Files:**
- `app/actions/tags.ts` - Server Actions for tag management (5 actions)

**Test Files:**
- `tests/integration/story-1.3-tags-pbac.test.ts` - PBAC independence tests (13 tests, all passing)

**Summary:**
- 3 files modified
- 1 file created (Server Actions)
- 1 test file modified (fixed bugs, all tests passing)
- Total: 5 files

## Change Log

**2026-03-14 - Backend Implementation (Phase 1-3 COMPLETED)**

**Database Schema:**
- Created Tag model in Prisma schema with fields: id, name (unique), color, description, createdAt
- Created UserTag join table for many-to-many User-Tag relation
- Modified User model to include userTags relation
- Added indexes for query optimization
- Pushed schema to Neon PostgreSQL successfully

**Server Actions (app/actions/tags.ts):**
- Implemented createTag with max 20 tags validation
- Implemented deleteTag with cascade delete confirmation
- Implemented assignTagsToUser with critical capability preservation check
- Implemented getTags for listing all tags with user counts
- Implemented getUserTags for retrieving user's tags
- All actions include: PBAC capability checks, audit logging, error handling, performance tracking

**Middleware:**
- Added /usuarios/etiquetas route to ROUTE_CAPABILITIES requiring can_manage_users

**Integration Tests:**
- Fixed 2 bugs in tests (duplicate code, undefined variable)
- Changed capabilities in test to match ROUTE_CAPABILITIES requirements
- All 13 PBAC independence tests passing
- Verified tags do NOT grant capabilities or route access
- Verified same tag can have different capabilities
- Verified privilege escalation prevention

**API Endpoints Created:**
- POST /api/v1/tags - Create tag (for E2E tests)
- GET /api/v1/users/[userId]/tags - Get user's tags
- PUT /api/v1/users/[userId]/tags - Assign tags to user
- Modified GET /api/v1/users/[id] to include tags in response

**UI Components Created:**
- app/(auth)/usuarios/etiquetas/page.tsx - Tags management page
- app/(auth)/usuarios/components/CreateTagForm.tsx - Tag creation form
- app/(auth)/usuarios/components/TagList.tsx - Tags list with delete
- Modified app/(auth)/usuarios/page.tsx to display tags in user list

**E2E Tests Status:**
- Fixed request → page.request for authenticated API calls
- Tests P0 unskipped but failing due to:
  1. Login timeout issues
  2. userId undefined (API endpoint authentication issues)
  3. Tag selection UI not implemented in user edit page

**Testing Results:**
- Integration Tests: 13/13 PASS ✅
- Backend functionality: COMPLETE ✅
- Basic UI Components: COMPLETE ✅
- E2E Tests P0: 3/3 FAIL (login/UI issues) ❌
- E2E Tests P1: 10 SKIPPED (not implemented yet) ⏸️

**Known Issues:**
1. Login helper in tests failing with timeout
2. User edit page doesn't have tag selection UI (RegisterForm needs extension)
3. E2E tests expecting tag-select component that doesn't exist
