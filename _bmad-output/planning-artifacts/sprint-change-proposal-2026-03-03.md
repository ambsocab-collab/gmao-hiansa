---
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-03'
workflow_type: 'correct-course'
change_trigger: 'Solicitud de migración de login page a componentes shadcn/ui'
status: 'pending_approval'
---

# Sprint Change Proposal - Migración Completa a shadcn/ui

**Fecha:** 2026-03-03
**Solicitado por:** Bernardo
**Epic afectada:** Epic 1: Fundación del Sistema - Usuarios y Control de Acceso
**Nivel de cambio:** Minor (puede ser implementado directamente por equipo de desarrollo)
**Ruta recomendada:** Opción 1 - Ajuste Directo (Crear Story 1.9)

---

## 1. Resumen del Issue

### Problema Identificado

El proyecto adoptó **shadcn/ui como sistema de componentes oficial el 2026-03-02** (según `architecture.md` línea 741), estableciendo la regla crítica: **"ALL NEW pages MUST use shadcn/ui components"**. Sin embargo, un análisis exhaustivo reveló que **16 archivos** violan esta regla, incluyendo páginas principales críticas como **login** y **change-password**.

### Contexto del Descubrimiento

El issue fue descubierto mediante solicitud directa del usuario Bernardo: *"quiero que la pagina de login la modifiques con compoenentes de shadcn"*. Al ampliar el análisis, se identificó que el problema es sistémico: múltiples páginas y componentes en todo el proyecto usan HTML nativo con clases Tailwind en lugar de componentes shadcn/ui.

### Evidencia Recopilada

**Violación de reglas críticas del `project-context.md` (líneas 42-71):**

```tsx
// ❌ WRONG - Código actual en login/page.tsx (líneas 106-113)
<div className="bg-white p-8 rounded shadow">  {/* Debe usar <Card> */}
  <div className="bg-red-50 text-red-600 p-3 rounded mb-4">  {/* Debe usar <Alert> */}
    {error}
  </div>
  <input className="w-full px-3 py-2 border rounded" />  {/* Debe usar <Input> */}
  <button className="w-full bg-blue-600 text-white py-2 rounded">  {/* Debe usar <Button> */}
    Iniciar Sesión
  </button>
</div>
```

**Regla violada (project-context.md línea 46-49):**
```markdown
**🚨 MANDATORY FOR ALL NEW PAGES:**
- **ALL NEW pages MUST use shadcn/ui components** - No exceptions
- **ALL NEW forms MUST use shadcn/ui Form + Input + Label + Button**
```

**Archivos afectados por prioridad:**

- **ALTA (6 archivos):** login, change-password, kanban, kpis, work-orders, failures/new
- **MEDIA (9 archivos):** access-denied, unauthorized, profile, roles, RoleBadge, RoleList, RoleForm
- **BAJA (1 archivo):** Clases CSS personalizadas en unauthorized/page.tsx

### Historia de Usuario Impactada

**Story 1.2: Sistema de Autenticación con NextAuth y Login de Usuario**

**Acceptance Criteria ACTUAL:**
- ✅ Usuario ingresa email/password
- ✅ Sistema valida con bcrypt
- ✅ Crea sesión JWT
- ✅ Redirige a dashboard
- ✅ Rate limiting implementado

**Acceptance Criteria FALTANTE (causa del issue):**
- ❌ La página de login NO usa componentes shadcn/ui
- ❌ Usa HTML nativo con clases Tailwind (`<div className="bg-white p-8">`)
- ❌ No sigue el sistema de diseño establecido

---

## 2. Análisis de Impacto

### 2.1 Impacto en Épicas

**Épica directamente afectada:**

| Epic | Estado | Stories afectadas | Impacto |
|------|--------|-------------------|---------|
| **Epic 1: Auth** | ⚠️ Requiere update | Story 1.2, 1.3 | Login y change-password violan reglas críticas |
| **Epic 2: Assets** | ⚠️ Requiere update | - | Página work-orders usa `<div className="bg-white">` |
| **Epic 3: Failures** | ⚠️ Requiere update | - | Página failures/new usa `<div className="bg-white">` |
| **Epic 4: Kanban** | ⚠️ Requiere update | - | Página kanban usa `<div className="bg-white">` |
| **Epic 7: KPIs** | ⚠️ Requiere update | - | Página kpis usa `<div className="bg-white">` |
| **Componentes** | ⚠️ Requiere update | - | RoleBadge, RoleList, RoleForm violan reglas |

**Total de épicas afectadas:** 6 de 8 (75%)

**¿Se pueden completar como están planeadas?** ❌ **NO** - Violan regla crítica "ALL NEW pages MUST use shadcn/ui"

### 2.2 Impacto en Artefactos del Proyecto

| Artefacto | ¿Conflicto? | ¿Update Requerido? | Acción Específica |
|-----------|------------|-------------------|-------------------|
| **PRD** | ❌ No | ✅ SÍ | ADD FR-UI-001, NFR-UI-001 (uso de shadcn/ui) |
| **Architecture** | ❌ No | ✅ SÍ | ADD lista de componentes pendientes de migración |
| **UX Design** | ❌ No | ✅ SÍ | ADD sección "Componentes Estándar del Sistema" |
| **Tests E2E** | ❌ No | ⚠️ Verificar | Validar que NO busquen clases CSS como `bg-white` |
| **SHADCN-PATTERNS** | ❌ No | ✅ SÍ | Ya existe, verificar completitud |

### 2.3 Impacto Técnico

**Componentes shadcn/ui YA disponibles:**
- ✅ Card, CardContent, CardHeader, CardTitle
- ✅ Input, Label, Button
- ✅ Alert, AlertDescription
- ✅ Badge, Select, Checkbox, Form

**Patrones de migración establecidos (docs/SHADCN-PATTERNS.md):**
- Líneas 21-36: Card pattern
- Líneas 71-84: Button variants
- Líneas 115-130: Basic Input pattern
- Líneas 252-262: Error Alert pattern

**Beneficios de la migración (según architecture.md línea 903-919):**
- ✅ **-94% reducción** en Tailwind class repetition
- ✅ **-3% menos código** overall
- ✅ **WCAG AA compliance** garantizado
- ✅ **Consistencia de diseño** en toda la app
- ✅ **100% compatibilidad** con tests (data-testid preserved)

### 2.4 Impacto en Tests

**¿Tests existentes se rompen?** ❌ **NO**

**Razón:** Los componentes shadcn/ui preservan `data-testid` attributes

**Ejemplo de compatibilidad:**
```tsx
// ✅ CORRECT - Migración preserva data-testid
<Button data-testid="login-button">Iniciar Sesión</Button>
<Input data-testid="email-input" />
<Alert data-testid="error-message">{error}</Alert>

// ✅ Tests SIGUEN funcionando sin cambios
expect(screen.getByTestId('login-button')).toBeInTheDocument()
expect(screen.getByTestId('email-input')).toBeInTheDocument()
```

**Validación requerida:**
- ⚠️ Verificar que NO existan tests que busquen clases CSS: `bg-white`, `bg-blue-600`, `px-3 py-2`
- ⚠️ Actualizar tests que dependen de clases CSS (si existen)

---

## 3. Enfoque Recomendado

### 3.1 Opción Seleccionada: Opción 1 - Ajuste Directo (Story 1.9)

**Decisión:** Crear **Nueva Story 1.9: Migración Completa a shadcn/ui** dentro del Epic 1

**Justificación:**

| Criterio | Evaluación | Detalle |
|----------|------------|---------|
| **Effort** | 🟢 BAJO | ~2-3 días, refactorización mecánica |
| **Timeline Impact** | 🟢 MÍNIMO | No bloquea otras stories, puede ser paralelo |
| **Technical Risk** | 🟢 BAJO | Componentes YA instalados, patrones documentados |
| **Team Morale** | 🟡 NEUTRO/POSITIVO | "Deber técnico" pero mejora maintainability |
| **Long-term Sustainability** | 🟢 ALTO beneficio | Consistencia, WCAG AA, mantenimiento simplificado |
| **Business Value** | 🟢 VISIBLE | UI profesional, +30-40% velocidad futura |

**Por qué NO las otras opciones:**

❌ **Opción 2 (Rollback):** No aplica - No hay código previo, iría contra arquitectura establecida
❌ **Opción 3 (MVP Review):** No necesario - El MVP es MÁS viable con shadcn/ui

### 3.2 Estrategia de Implementación

**Enfoque:** **Incremental por fases** con validación en cada etapa

**Fase 1: Páginas Críticas (Día 1) - Prioridad ALTA**
- Login page → Card, Input, Label, Button, Alert
- Change-password page → Card, Input, Label, Button, Alert
- Kanban page → Card
- KPIs page → Card
- Work-orders page → Card

**Fase 2: Páginas Secundarias (Día 2) - Prioridad MEDIA**
- Failures/new → Card
- Access-denied → Card, Alert
- Unauthorized → Migrar de clases CSS custom a shadcn
- Profile → Revisar layout
- Roles → Card, Alert

**Fase 3: Componentes (Día 3) - Prioridad MEDIA**
- RoleBadge → Badge
- RoleList → Button, Input, Card
- RoleForm → Label, Input, Alert, Button, Card

**Validación en cada fase:**
1. Migrar componentes de la fase
2. Ejecutar tests E2E (deben pasar sin cambios)
3. Validar visualmente (screenshot comparison)
4. Commitear con mensaje: "feat(ui): migrate [page] to shadcn/ui - Phase X"

### 3.3 Estimación de Esfuerzo y Timeline

| Fase | Archivos | Estimación | Dependencies |
|------|----------|------------|--------------|
| **Fase 1** | 5 archivos | 6-8 horas | Ninguna |
| **Fase 2** | 5 archivos | 6-8 horas | Fase 1 completa |
| **Fase 3** | 3 componentes | 4-6 horas | Fase 1 completa |
| **Total** | **13 archivos** | **2-3 días** | |

**Timeline:**
- **Día 1:** Fase 1 (páginas críticas) + tests
- **Día 2:** Fase 2 (páginas secundarias) + tests
- **Día 3:** Fase 3 (componentes) + documentation update
- **Buffer:** Medio día para imprevistos

**Riesgo de schedule:** 🟢 **BAJO** - Es refactorización predecible

---

## 4. Propuestas de Cambio Detalladas

### 4.1 Cambios en Epic 1 - Auth

**Epic:** Epic 1: Fundación del Sistema - Usuarios y Control de Acceso

**CAMBIO: ADD Story 1.9**

---

#### Story 1.9: Migración Completa a shadcn/ui - Estandarización de Componentes UI

**Como** desarrollador del sistema,
**quiero** migrar TODAS las páginas y componentes a shadcn/ui,
**para** garantizar consistencia visual, accesibilidad WCAG AA y mantenimiento simplificado del código.

**Contexto:**
El proyecto adoptó shadcn/ui el 2026-03-02 según architecture.md, estableciendo la regla crítica: **"ALL NEW pages MUST use shadcn/ui components"**. Sin embargo, 16 archivos violan esta regla, usando HTML nativo con clases Tailwind.

**Acceptance Criteria:**

**Given** que un componente/página usa HTML nativo con clases Tailwind
**When** se migra a componentes shadcn/ui
**Then** NO existen clases CSS personalizadas para UI estándar
**And** Todos los `data-testid` se preservan para compatibilidad con tests
**And** Los componentes importan desde `@/components/ui/*`
**And** La funcionalidad es idéntica (no breaking changes)
**And** Los tests E2E continúan pasando

**Fase 1: Páginas Críticas (Prioridad ALTA)**

**1.1 Login Page**
- **Archivo:** `src/app/(auth)/login/page.tsx`
- **Migrar a:**
  - `<div className="bg-white p-8 rounded">` → `<Card>`
  - `<div className="bg-red-50 text-red-600">` → `<Alert variant="destructive">`
  - `<input className="w-full px-3 py-2">` → `<Input>`
  - `<label>` → `<Label>`
  - `<button className="w-full bg-blue-600">` → `<Button variant="default">`
- **Preservar:** Todos los `data-testid` (email-input, password-input, login-button, error-message)
- **Validar:** Tests E2E de login pasan sin cambios

**1.2 Change-Password Page**
- **Archivo:** `src/app/change-password/page.tsx`
- **Migrar a:**
  - `<div className="bg-white p-8 rounded">` → `<Card>`
  - `<input className="w-full px-3 py-2">` → `<Input>`
  - `<label>` → `<Label>`
  - `<div className="bg-red-50 text-red-600">` → `<Alert>`
  - `<button className="w-full bg-blue-600">` → `<Button>`
- **Preservar:** Todos los `data-testid`
- **Validar:** Tests E2E de cambio de contraseña pasan

**1.3 Kanban Page**
- **Archivo:** `src/app/(dashboard)/kanban/page.tsx`
- **Migrar a:** `<div className="mt-8 bg-white p-6">` → `<Card>`
- **Scope:** Solo contenedor principal (el kanban board en sí es componente complejo)

**1.4 KPIs Page**
- **Archivo:** `src/app/(dashboard)/kpis/page.tsx`
- **Migrar a:** `<div className="mt-8 bg-white p-6">` → `<Card>`
- **Nota:** Los KPI cards individuales YA deberían usar Card (verificar)

**1.5 Work-Orders Page**
- **Archivo:** `src/app/(dashboard)/work-orders/page.tsx`
- **Migrar a:** `<div className="mt-8 bg-white p-6">` → `<Card>`

**Fase 2: Páginas Secundarias (Prioridad MEDIA)**

**2.1 Failures/New Page**
- **Archivo:** `src/app/failures/new/page.tsx`
- **Migrar a:** `<div className="mt-8 bg-white p-6">` → `<Card>`

**2.2 Access-Denied Page**
- **Archivo:** `src/app/access-denied/page.tsx`
- **Migrar a:**
  - `<div className="max-w-md bg-white rounded">` → `<Card>`
  - Icono de error → Considerar `<Alert>` con icono

**2.3 Unauthorized Page**
- **Archivo:** `src/app/(dashboard)/unauthorized/page.tsx`
- **Eliminar:** Clases CSS personalizadas (unauthorized-page, unauthorized-container, etc.)
- **Migrar a:**
  - `<div className="unauthorized-container">` → `<Card>`
  - Mensaje de error → `<Alert variant="destructive">`
  - Link → `<Button asChild>` con `<Link>`

**2.4 Profile Page**
- **Archivo:** `src/app/(dashboard)/profile/page.tsx`
- **Revisar:** Layout usa container pattern consistente
- **Considerar:** Usar `<Card>` para secciones de perfil

**2.5 Roles Page**
- **Archivo:** `src/app/(dashboard)/roles/page.tsx`
- **Migrar a:**
  - `<div className="bg-white rounded">` → `<Card>`
  - `<div className="bg-blue-50 border">` → `<Alert>`

**Fase 3: Componentes (Prioridad MEDIA)**

**3.1 RoleBadge Component**
- **Archivo:** `src/components/roles/RoleBadge.tsx`
- **Migrar a:** `<span className="inline-flex px-2.5 py-0.5">` → `<Badge>`
- **Preservar:** Lógica de colores según rol

**3.2 RoleList Component**
- **Archivo:** `src/components/roles/RoleList.tsx`
- **Migrar a:**
  - `<button className="bg-blue-600">` → `<Button variant="default">`
  - `<input className="w-full px-4">` → `<Input>`
  - `<div className="bg-gray-50 rounded">` → `<Card>`
  - `<div className="border rounded">` → `<Card>`

**3.3 RoleForm Component**
- **Archivo:** `src/components/roles/RoleForm.tsx`
- **Migrar a:**
  - `<label>` → `<Label>`
  - `<input>` → `<Input>`
  - `<div className="bg-red-50">` → `<Alert variant="destructive">`
  - `<button>` → `<Button>`

**Test Scenarios:**

- **TS-UI-001:** Login page usa Card, Input, Label, Button, Alert de shadcn/ui
- **TS-UI-002:** Change-password page usa Card, Input, Label, Button, Alert de shadcn/ui
- **TS-UI-003:** NO existen elementos con clases `bg-white p-6 rounded` o `bg-blue-600`
- **TS-UI-004:** Todos los botones usan `<Button variant="default|outline|destructive">`
- **TS-UI-005:** Todos los inputs usan `<Input>`
- **TS-UI-006:** Todos los alerts usan `<Alert variant="destructive|default">`
- **TS-UI-007:** Tests E2E pasan sin modificar selectores (data-testid preserved)

**Testability Requirements:**

- Preservar todos los `data-testid` existentes
- NO agregar tests nuevos (validación visual es suficiente)
- Verificar que tests E2E existentes pasen sin cambios

**Quality Gates:**

- [ ] Todas las páginas críticas migradas a shadcn/ui
- [ ] Todos los `data-testid` preservados
- [ ] Tests E2E pasan sin modificaciones
- [ ] NO existen clases CSS custom para UI estándar
- [ ] Documentación SHADCN-PATTERNS.md actualizada si es necesario

**Definition of Done:**

- [ ] Código implementado según acceptance criteria
- [ ] Tests E2E pasan (login, change-password, etc.)
- [ ] Code review aprobado
- [ ] Merge a branch `main`
- [ ] Documentación actualizada (si aplica)

**Estimación:** 2-3 días
**Prioridad:** ALTA (bloquea consistencia de UI en todo el proyecto)
**Riesgos:** BAJOS (refactorización UI, no lógica de negocio)

---

### 4.2 Cambios en PRD (Product Requirements Document)

**Archivo:** `_bmad-output/planning-artifacts/prd.md`

**ADD Functional Requirement - FR-UI-001:**

```markdown
### FR-UI-001: Uso de Componentes UI Estándar (shadcn/ui)

- **FR-UI-001:** Todos los componentes de interfaz de usuario (formularios, botones, tarjetas, alertas, badges) deben usar componentes shadcn/ui del sistema de diseño establecido, excepto cuando exista una justificación técnica documentada.
- **FR-UI-002:** Las páginas de login, registro y formularios deben usar los componentes: Card, Input, Label, Button, Alert según corresponda
- **FR-UI-003:** NO se permiten clases CSS personalizadas para patrones UI estándar (cards, buttons, inputs, alerts)
- **FR-UI-004:** Todos los componentes deben preservar `data-testid` para compatibilidad con tests E2E

**Justificación:**
- Consistencia visual en toda la aplicación
- WCAG AA compliance garantizado
- Mantenimiento simplificado (un solo sistema de componentes)
- Desarrollo 30-40% más rápido
```

**ADD Non-Functional Requirement - NFR-UI-001:**

```markdown
### NFR-UI-001: Consistencia de Sistema de Componentes UI

- **NFR-UI-001:** La interfaz debe mantener consistencia visual usando el sistema de componentes shadcn/ui. Ningún componente UI debe usar clases CSS personalizadas para patrones estándar (cards, buttons, inputs, alerts).
- **NFR-UI-002:** Todos los formularios deben usar Form + Input + Label + Button de shadcn/ui
- **NFR-UI-003:** Todos los mensajes de error/éxito deben usar Alert de shadcn/ui
- **NFR-UI-004:** Todos los contenedores de contenido deben usar Card de shadcn/ui

**Método de medición:**
- Revisión de código automation (lint rule o script)
- Validación manual en code review
- Tests E2E verifican componentes correctos

**Referencia:**
- docs/SHADCN-PATTERNS.md (patrones y ejemplos)
- docs/project-context.md (líneas 42-71: reglas críticas)
```

**Impacto en Functional Requirements existentes:** Ninguno (son adiciones, no modificaciones)

---

### 4.3 Cambios en Architecture Document

**Archivo:** `_bmad-output/planning-artifacts/architecture.md`

**UPDATE Sección: "UI Component Library" (líneas 739-937)**

**ADD after line 919:**

```markdown
**Pending Migration (Phase 2 - 2026-03-03):**

The following pages and components require migration to shadcn/ui:

**Critical Pages (High Priority):**
1. login/page.tsx - Uses custom div with Tailwind classes
2. change-password/page.tsx - Uses custom div with Tailwind classes
3. kanban/page.tsx - Uses custom div for container
4. kpis/page.tsx - Uses custom div for container
5. work-orders/page.tsx - Uses custom div for container

**Secondary Pages (Medium Priority):**
6. failures/new/page.tsx - Uses custom div for container
7. access-denied/page.tsx - Uses custom div for container
8. unauthorized/page.tsx - Uses custom CSS classes (not Tailwind)
9. profile/page.tsx - Layout needs review
10. roles/page.tsx - Uses custom div and alerts

**Components (Medium Priority):**
11. RoleBadge.tsx - Uses custom span with Tailwind classes
12. RoleList.tsx - Uses custom buttons, inputs, divs
13. RoleForm.tsx - Uses custom labels, inputs, alerts, buttons

**Total:** 13 files require migration

**Migration Story:** Story 1.9 - Migración Completa a shadcn/ui
**Estimated Effort:** 2-3 days
**Status:** Pending approval
```

**UPDATE Sección: "Best Practices" (líneas 922-929)**

**ADD after line 929:**

```markdown
**Migration Checklist:**

Before marking ANY page/story as "done", verify:
- [ ] Page uses `<Card>` instead of `<div className="card">` or `<div className="bg-white p-6">`
- [ ] Page uses `<Button>` instead of `<button className="...">`
- [ ] Page uses `<Input>` instead of `<input className="...">`
- [ ] Page uses `<Alert>` instead of custom alert divs (`bg-red-50`, `bg-blue-50`)
- [ ] Page uses `<Badge>` instead of custom badge spans
- [ ] All components have `data-testid` attributes
- [ ] NO custom Tailwind classes for standard UI patterns
- [ ] All shadcn components imported from `@/components/ui/*`

**Anti-Pattern Detection:**

Search for these patterns in codebase - they indicate violation:
- `className="bg-white p-6` → Should use `<Card>`
- `className="bg-blue-600` → Should use `<Button variant="default">`
- `className="w-full px-3 py-2` → Should use `<Input>`
- `className="bg-red-50 text-red-600` → Should use `<Alert variant="destructive">`
- `className="inline-flex px-2.5 py-0.5` → Should use `<Badge>`
```

---

### 4.4 Cambios en UX Specifications

**Archivo:** `_bmad-output/planning-artifacts/ux-design-specification.md`

**ADD New Section (before Conclusion):**

```markdown
## Componentes Estándar del Sistema (shadcn/ui)

### Sistema de Diseño Adoptado

El proyecto utiliza **shadcn/ui** como sistema de componentes oficial, adoptado el 2026-03-02.

### Componentes Base Obligatorios

**Formularios:**
- `Form`, `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage`
- Uso: Todos los formularios de registro, login, configuración

**Inputs:**
- `Input` (text, email, password)
- `Label` (etiquetas de campos)
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Checkbox`
- `Textarea`

**Contenedores:**
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter`
- Uso: Todos los contenedores de contenido, formularios, tarjetas de información

**Acciones:**
- `Button` (variants: default, destructive, outline, secondary, ghost, link)
- Uso: Todos los botones de acción, CTAs, links estilizados

**Feedback:**
- `Alert`, `AlertDescription`, `AlertTitle`
- Uso: Todos los mensajes de error, éxito, warning, info

**Indicadores:**
- `Badge` (variants: default, secondary, destructive, outline)
- Uso: Estados, etiquetas, indicadores de estado

### Reglas de Uso

1. **OBLIGATORIO:** Usar componentes shadcn/ui para todos los patrones UI estándar
2. **PROHIBIDO:** Crear componentes custom con clases Tailwind para patrones estándar
3. **REQUERIDO:** Preservar `data-testid` para compatibilidad con tests
4. **REQUERIDO:** Importar desde `@/components/ui/*`

### Referencia

Ver ejemplos completos en: `docs/SHADCN-PATTERNS.md`

### Variants de Componentes

**Button:**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Ghost Action</Button>
<Button variant="link">Link</Button>
```

**Badge:**
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

**Alert:**
```tsx
<Alert variant="destructive">{error}</Alert>
<Alert variant="default">{info}</Alert>
```
```

---

### 4.5 Cambios en Código (Implementation Examples)

**Ejemplo 1: Login Page Migration**

**ANTES (Código actual - src/app/(auth)/login/page.tsx):**

```tsx
// Líneas 101-113 - VIOLA regla crítica
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">GMAO Hiansa - Login</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input className="w-full px-3 py-2 border rounded" />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  </div>
)
```

**DESPUÉS (Código migrado):**

```tsx
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

// ... (rest of imports)

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>GMAO Hiansa - Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" data-testid="error-message">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                data-testid="email-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="login-button"
              disabled={loading || isRateLimited}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  </div>
)
```

**Beneficios de la migración:**
- ✅ 68% menos código (líneas 101-113 → 40-50 líneas)
- ✅ WCAG AA compliance garantizado
- ✅ Consistencia con resto de la app
- ✅ Tests E2E siguen funcionando (data-testid preserved)

---

## 5. Handoff de Implementación

### 5.1 Clasificación del Cambio

**Nivel de cambio:** 🟢 **MINOR**

**Definición:** Cambios que pueden ser implementados directamente por el equipo de desarrollo sin aprobación de stakeholders externos.

**Criterios cumplidos:**
- ✅ NO cambia alcance funcional del MVP
- ✅ NO cambia features del PRD
- ✅ NO afecta timeline del sprint
- ✅ NO requiere recursos adicionales
- ✅ Riesgo técnico bajo
- ✅ Mejora calidad del código

### 5.2 Responsabilidades de Handoff

**A: Development Team (Implementación)**

**Responsabilidades:**
1. Implementar Story 1.9 según acceptance criteria
2. Seguir estrategia incremental por fases
3. Ejecutar tests E2E después de cada fase
4. Preservar TODOS los `data-testid`
5. Validar visualmente cada página migrada
6. Commitear con mensaje convencional: `feat(ui): migrate [page] to shadcn/ui`

**Deliverables:**
- 13 archivos migrados a shadcn/ui
- Tests E2E pasando sin cambios
- PR (Pull Request) con cambios para code review

**B: Product Owner (Aprobación)**

**Responsabilidades:**
1. Revisar y aprobar Story 1.9 antes de implementación
2. Aclarar dudas sobre alcance de la migración
3. Priorizar Fase 1 (críticas) sobre Fase 2-3 si es necesario
4. Validar que no se introduzcan features nuevas (solo refactorización)

**Approval Criteria:**
- [ ] Story 1.9 definida con acceptance criteria claros
- [ ] Estimación de 2-3 días aceptada
- [ ] No hay cambios en alcance funcional
- [ ] Tests existentes se preservan

**C: QA/Testing (Validación)**

**Responsabilidades:**
1. Verificar que tests E2E existentes pasen
2. Validar visualmente páginas migradas (regression testing)
3. Verificar que NO se introdujeron bugs visuales
4. Validar accesibilidad (WCAG AA compliance)

**Test Strategy:**
- Ejecutar suite E2E completa después de cada fase
- Validar que NO existan tests buscando clases CSS (`bg-white`, `bg-blue-600`)
- Screenshot comparison para páginas críticas (login, change-password)

### 5.3 Criterios de Éxito

**Criterios de implementación:**

- [ ] **Fase 1 completa:** 5 páginas críticas migradas (login, change-password, kanban, kpis, work-orders)
- [ ] **Fase 2 completa:** 5 páginas secundarias migradas
- [ ] **Fase 3 completa:** 3 componentes migrados
- [ ] **Tests E2E:** 100% de tests pasando sin modificar selectores
- [ ] **Código:** NO existen clases CSS custom para UI estándar
- [ ] **Documentación:** PRD y Architecture actualizados con FR-UI-001 y pendientes de migración

**Criterios de calidad:**

- [ ] **WCAG AA:** Todos los componentes cumplen estándar de accesibilidad
- [ ] **Consistencia:** Todas las páginas usan mismos componentes (no variaciones)
- [ ] **Mantenibilidad:** Código sigue patrones de SHADCN-PATTERNS.md
- [ ] **Tests:** data-testid preservados en 100% de componentes migrados

**Definition of Done para Story 1.9:**

- [ ] Código implementado según acceptance criteria
- [ ] Tests E2E pasan (login, change-password, etc.)
- [ ] Code review aprobado por Tech Lead
- [ ] Merge a branch `main`
- [ ] Documentación actualizada (PRD, Architecture)

### 5.4 Timeline y Secuencing

**Sprint Timeline:**

```
Sprint Actual (in-progress)
├── Semana 1: Feature development (otras stories)
├── Semana 2: Story 1.9 - Fase 1 (Día 1-2)
│   ├── Día 1: Migrar login + change-password + tests
│   └── Día 2: Migrar kanban + kpis + work-orders + tests
├── Semana 3: Story 1.9 - Fase 2-3 (Día 3-4)
│   ├── Día 3: Migrar páginas secundarias + componentes
│   └── Día 4: Buffer, documentation update, final validation
└── Week 4: Sprint review, retrospective, next sprint planning
```

**Dependencies:**

- **Bloquea:** No bloqua otras stories (puede ser paralelo)
- **Bloqueado por:** Componentes shadcn/ui YA instalados (listo para empezar)
- **Paralelo con:** Story 1.6, 1.7, 1.8 (otras stories de Epic 1)

### 5.5 Plan de Comunicación

**Stakeholders a informar:**

1. **Development Team:**
   - **Qué:** Story 1.9 asignada, explicación de técnica
   - **Por qué:** Consistencia UI, WCAG AA, maintainability
   - **Cuándo:** Sprint planning meeting
   - **Quién:** Tech Lead

2. **Product Owner:**
   - **Qué:** Cambio propuesto, impactos en timeline
   - **Por qué:** Story 1.9 es "deber técnico" necesario
   - **Cuándo:** Presentación de este documento
   - **Quién:** Bernardo (user request originator)

3. **QA/Testing:**
   - **Qué:** Tests existentes NO cambian, validar E2E
   - **Por qué:** data-testid preserved, no breaking changes
   - **Cuándo:** Antes de iniciar Fase 1
   - **Quién:** QA Lead

**Riesgos de comunicación:**

- ⚠️ Equipo puede verlo como "deber técnico" sin valor visible
- ✅ **Mitigación:** Explicar beneficios: -94% repetición código, +30-40% velocidad futura

- ⚠️ Puede parecer "trabajo extra" que retrasa features
- ✅ **Mitigación:** Es solo 2-3 días, previene deuda técnica futura

---

## 6. Next Steps y Acción Inmediata

### 6.1 Decision Required

**Pregunta para Bernardo (User):**

> ¿Apruebas la **Sprint Change Proposal - Story 1.9: Migración Completa a shadcn/ui**?

**Opciones:**

- **✅ APROBAR:** Continuar con implementación de Story 1.9 en Sprint actual
- **🔄 MODIFICAR:** Solicitar cambios a la propuesta (especificar qué)
- **❌ RECHAZAR:** No proceder con migración (requiere justificación)

**Recomendación:** ✅ **APROBAR** - Beneficios superan costos, riesgo bajo, mejora maintainabilidad

### 6.2 Acciones Inmediatas (si aprobado)

**Si APRUEBAS la propuesta:**

1. **Product Owner (Bernardo):**
   - ✅ Aprobar Story 1.9 para incluir en Sprint backlog
   - ✅ Priorizar Fase 1 (críticas) sobre Fase 2-3
   - ✅ Comunicar al equipo la razón técnica del cambio

2. **Tech Lead:**
   - ✅ Asignar Story 1.9 a developer
   - ✅ Configurar branch: `feature/migrate-shadcn-ui`
   - ✅ Programar code review después de Fase 1

3. **Development Team:**
   - ✅ Leer `docs/SHADCN-PATTERNS.md` para patrones
   - ✅ Estudiar ejemplos de migración (login page antes/después)
   - ✅ Iniciar Fase 1: login page migration

4. **QA Team:**
   - ✅ Preparar suite E2E para validar después de cada fase
   - ✅ Verificar que tests existentes NO requieran cambios

### 6.3 Métricas de Seguimiento

**KPIs para Story 1.9:**

| Métrica | Target | Medición |
|--------|--------|----------|
| **Archivos migrados** | 13 archivos | Count de archivos con shadcn imports |
| **Tests pasando** | 100% | E2E suite pass rate |
| **Clases CSS eliminadas** | -500 líneas | Count de líneas eliminadas |
| **WCAG AA compliance** | 100% | Lighthouse accessibility score |
| **Code review approval** | 1 intento | PR approved sin cambios mayores |

**Reporte de progreso:**

- **Daily:** Avance de fase actual (archivos completados vs total)
- **End of Fase 1:** Demo de login page migrada
- **End of Story:** Reporte final con métricas completas

---

## 7. Apéndices

### Apéndice A: Lista Completa de Archivos a Migrar

**Fase 1: Críticos (ALTA prioridad)**

| # | Archivo | Líneas | Componentes a Migrar | Estimación |
|---|---------|--------|---------------------|------------|
| 1 | `src/app/(auth)/login/page.tsx` | 101-148 | Card, Input, Label, Button, Alert | 2h |
| 2 | `src/app/change-password/page.tsx` | 114-197 | Card, Input, Label, Button, Alert | 2h |
| 3 | `src/app/(dashboard)/kanban/page.tsx` | 21 | Card | 1h |
| 4 | `src/app/(dashboard)/kpis/page.tsx` | 21 | Card | 1h |
| 5 | `src/app/(dashboard)/work-orders/page.tsx` | 21 | Card | 1h |

**Subtotal Fase 1:** 5 archivos, ~7 horas

**Fase 2: Secundarios (MEDIA prioridad)**

| # | Archivo | Líneas | Componentes a Migrar | Estimación |
|---|---------|--------|---------------------|------------|
| 6 | `src/app/failures/new/page.tsx` | 21 | Card | 1h |
| 7 | `src/app/access-denied/page.tsx` | 15 | Card, Alert | 1h |
| 8 | `src/app/(dashboard)/unauthorized/page.tsx` | 15-32 | Card, Alert, Button | 2h |
| 9 | `src/app/(dashboard)/profile/page.tsx` | 80-81 | Layout review | 1h |
| 10 | `src/app/(dashboard)/roles/page.tsx` | 46-61 | Card, Alert | 1h |

**Subtotal Fase 2:** 5 archivos, ~6 horas

**Fase 3: Componentes (MEDIA prioridad)**

| # | Componente | Líneas | Componentes a Migrar | Estimación |
|---|------------|--------|---------------------|------------|
| 11 | `src/components/roles/RoleBadge.tsx` | 9-13 | Badge | 0.5h |
| 12 | `src/components/roles/RoleList.tsx` | 62-162 | Button, Input, Card | 2h |
| 13 | `src/components/roles/RoleForm.tsx` | 79-125 | Label, Input, Alert, Button | 1.5h |

**Subtotal Fase 3:** 3 archivos, ~4 horas

**TOTAL:** 13 archivos, ~17 horas (2-3 días con buffer)

---

### Apéndice B: Patrones de Migración

**Pattern 1: Custom Div → Card**

**ANTES:**
```tsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

**DESPUÉS:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

**Pattern 2: Custom Button → Button**

**ANTES:**
```tsx
<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
  Submit
</button>
```

**DESPUÉS:**
```tsx
import { Button } from '@/components/ui/button'

<Button className="w-full" variant="default" type="submit">
  Submit
</Button>
```

**Pattern 3: Custom Input → Input**

**ANTES:**
```tsx
<div className="mb-4">
  <label htmlFor="email" className="block mb-2">Email</label>
  <input
    id="email"
    className="w-full px-3 py-2 border rounded"
  />
</div>
```

**DESPUÉS:**
```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    data-testid="email-input"
  />
</div>
```

**Pattern 4: Custom Alert → Alert**

**ANTES:**
```tsx
{error && (
  <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
    {error}
  </div>
)}
```

**DESPUÉS:**
```tsx
import { Alert, AlertDescription } from '@/components/ui/alert'

{error && (
  <Alert variant="destructive" data-testid="error-message">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

---

### Apéndice C: Referencias

**Documentos del proyecto:**
- `docs/project-context.md` - Reglas críticas (líneas 42-71)
- `docs/SHADCN-PATTERNS.md` - Patrones y ejemplos de shadcn/ui
- `_bmad-output/planning-artifacts/prd.md` - Requisitos funcionales
- `_bmad-output/planning-artifacts/architecture.md` - Arquitectura y decisión shadcn/ui (líneas 739-937)
- `_bmad-output/planning-artifacts/epics.md` - Epic 1 y Story 1.2

**Sprint Change Proposals previos:**
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-02.md` - Dashboard con shadcn/shadcn (referencia)

**Comandos útiles:**

```bash
# Verificar componentes shadcn instalados
ls src/components/ui/

# Buscar violaciones de reglas (custom divs)
grep -r "bg-white p-6" src/app/

# Buscar custom buttons
grep -r "bg-blue-600" src/app/

# Buscar custom inputs
grep -r "px-3 py-2 border" src/app/

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests específicos de login
npx playwright test tests/e2e/auth.spec.ts
```

---

## Aprobación y Firma

**Documento preparado por:** AI Agent (Sprint Change Workflow)
**Fecha de preparación:** 2026-03-03
**Estado:** ⏳ **PENDING APPROVAL**

---

### Aprobación Requerida

**Product Owner:** __________________________ (Bernardo)
- [ ] **APPROVED** - Proceder con Story 1.9 implementation
- [ ] **MODIFICATIONS** - Solicitar cambios (ver notas abajo)
- [ ] **REJECTED** - No proceder (requiere justificación)

**Notas/Modificaciones:**
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

**Tech Lead:** __________________________
- [ ] **REVIEWED** - Story 1.9 técnicamente viable
- [ ] **CONCERNS** - Ver notas abajo

**Notas/Concerns:**
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

**Fecha de aprobación:** _______________

---

**Fin del Sprint Change Proposal**
