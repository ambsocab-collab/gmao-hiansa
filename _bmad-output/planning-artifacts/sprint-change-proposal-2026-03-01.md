# Sprint Change Proposal - Auth Model Evolution (RBAC → PBAC)

**Fecha:** 2026-03-01
**Sprint:** Epic 1 (Auth) + Epic 7 (Dashboard)
**Change Scope:** Moderate
**Status:** ✅ APROBADO POR PRODUCT OWNER
**Prepared by:** John - Product Manager Agent

---

## Executive Summary

**Cambio Propuesto:** Evolucionar el modelo de autorización de **RBAC (Role-Based Access Control)** a **PBAC (Permission-Based Access Control)** con roles como etiquetas de clasificación.

**Justificación:** Simplificar onboarding, permitir excepciones flexibles por usuario, y facilitar testing basado en combinaciones de capabilities en lugar de roles rígidos.

**Impacto:** 4 stories reescritas (1.4, 1.5, 1.6, 7.4), 9 capabilities en lugar de 8, dashboard único para todos los usuarios.

**Esfuerzo:** 3 días de desarrollo

**Timeline:** +1 semana en Epic 1

---

## 1. ISSUE SUMMARY

### 1.1 Problem Statement

El modelo de autorización actual (**RBAC - Role-Based Access Control**) diseñado en el PRD y Architecture es demasiado rígido para las necesidades reales de la organización. Los roles actúan como contenedores de capabilities que los usuarios heredan automáticamente, lo que limita la flexibilidad para crear excepciones granulares por usuario.

### 1.2 Context & Discovery

**Trigger:** Epic 1 (Auth) - Stories 1.4, 1.5, 1.6 + Epic 7 Story 7.4

**Issue Type:** New requirement emerged from implementation planning

**Discovery Timeline:**
- Feb 25, 2026: PRD y Architecture aprobados con modelo RBAC
- Feb 27, 2026: Epic 1 en implementación, se identifica rigidez
- Mar 1, 2026: Propuesta de cambio a modelo PBAC híbrido

### 1.3 Evidence & User Requirements

**Usuario solicita:**

1. **Simplificar onboarding** - Todos los usuarios acceden al mismo dashboard general con KPIs de la planta

2. **Flexibilidad de excepciones** - Capabilities asignadas por usuario, no solo por rol

3. **Roles como etiquetas** - Roles predefinidos (Operario, Técnico, Supervisor) como plantillas de clasificación, NO como contenedores de autorización

4. **Admin como centro de control** - Admin otorga capabilities individualmente al registrar usuarios

**Ejemplo concreto dado:**
> *"Puede haber un user categorizado como técnico, pero quiero tener la posibilidad de crear un rol que sea 'técnico encargado de repuestos' que tendrá las capabilities del anterior y aparte la de encargado de stock de repuestos"*

**Justificación técnica:**
> *"Si testeamos el user journey de usar A con X capabilities no nos centramos en el rol si no en una configuración determinada, así si probamos todo sabemos que todas las posibilidades funcionan de una vez sin tener que cambiar de usuario. Creo que el testing es más sencillo"*

---

## 2. IMPACT ANALYSIS

### 2.1 Epic Impact

| Epic | Impact Level | Description |
|------|--------------|-------------|
| **Epic 1: Auth & Users** | 🔴 HIGH | Stories 1.4, 1.5, 1.6 reescritas completamente |
| **Epic 7: Dashboard** | 🔴 HIGH | Story 7.4 eliminada y reemplazada |
| **Epic 2-6** | 🟢 LOW | Solo middleware changes, funcionalidad core intacta |

### 2.2 Story Impact

**Stories Requiring Complete Rewrite:**

#### Story 1.4: Gestión de Roles y Capacidades por Administrador

**ANTES (RBAC):**
```gherkin
Como administrador, quiero crear roles personalizados
y asignar capacidades específicas a roles, para
controlar qué pueden hacer los usuarios
que tienen ese rol asignado.
```

**AHORA (PBAC + Role Labels):**
```gherkin
Como administrador, quiero crear roles
que actúen como etiquetas de clasificación
(sin herencia de capacidades), para organizar
usuarios por categorías (Operario, Técnico, Supervisor).
```

**Cambios en Acceptance Criteria:**
- ❌ **ELIMINADO:** "Las capacidades se asignan a roles"
- ✅ **NUEVO:** "Los roles son solo etiquetas de clasificación"
- ✅ **NUEVO:** "Un rol NO otorga capacidades automáticamente"
- ✅ **NUEVO:** "El admin puede crear roles personalizados (máx. 20)"
- ✅ **NUEVO:** "Los roles se usan solo para filtrado/organización"

---

#### Story 1.5: Registro de Usuarios y Asignación de Roles

**ANTES:**
```gherkin
Como administrador, quiero registrar nuevos usuarios
y asignarles roles, para incorporar personas
con los permisos apropiados heredados del rol.
```

**AHORA:**
```gherkin
Como administrador, quiero registrar nuevos usuarios
asignando un rol (etiqueta) y capacidades individuales,
para incorporar personas con permisos granulares.
```

**Cambios en Acceptance Criteria:**
- ❌ **ELIMINADO:** "El usuario hereda todas las capacidades del rol asignado"
- ✅ **NUEVO:** "El admin selecciona un rol del dropdown (predefinido o personalizado)"
- ✅ **NUEVO:** "El rol es solo una etiqueta, no otorga capacidades"
- ✅ **NUEVO:** "El admin marca checkboxes de 9 capacidades individuales"
- ✅ **MANTENIDO:** "Todo usuario nuevo tiene `can_create_failure_report` predeterminada"

**Nueva UX de Registro:**
```
┌─────────────────────────────────────────┐
│  Registrar Nuevo Usuario               │
├─────────────────────────────────────────┤
│  Nombre: [________________]            │
│  Email:  [________________]            │
│  Password Temporal: [______________]   │
│                                         │
│  Rol (Etiqueta): [Seleccionar ▼]       │
│    ○ Operario                          │
│    ○ Técnico de Mantenimiento          │
│    ○ Supervisor de Mantenimiento       │
│    ○ Crear Rol Personalizado...        │
│                                         │
│  Capabilities:                          │
│  ☑ can_create_failure_report (predet.) │
│  ☐ can_create_manual_ot                │
│  ☐ can_update_own_ot                   │
│  ☐ can_view_own_ots                    │ ← NUEVA
│  ☐ can_view_all_ots                    │
│  ☐ can_complete_ot                     │
│  ☐ can_manage_stock                    │
│  ☐ can_assign_technicians              │
│  ☐ can_view_kpis                       │
│                                         │
│  [Cancelar]  [Registrar Usuario]       │
└─────────────────────────────────────────┘
```

---

#### Story 1.6: Perfil de Usuario y Gestión de Credenciales

**ANTES:**
```gherkin
Como usuario, quiero acceder a mi perfil
y ver mis roles, para entender mis permisos.
```

**AHORA:**
```gherkin
Como usuario, quiero acceder a mi perfil
y ver mi rol (etiqueta) y mis capacidades individuales,
para entender qué puedo hacer en el sistema.
```

**Cambios:**
- ✅ **NUEVO:** "El usuario ve su rol actual (ej: Técnico de Mantenimiento)"
- ✅ **NUEVO:** "El usuario ve la lista completa de sus 9 capacidades"
- ✅ **NUEVO:** "Las capaciciones se muestran con nombre descriptivo (ej: 'Ver todas las OTs')"

---

#### Story 7.4: Dashboard Específico por Rol → Dashboard Común

**❌ Story ELIMINADA:**
```gherkin
Story 7.4: Dashboard Específico por Rol
Como usuario, quiero ver un dashboard específico
según mi rol al hacer login.
```

**✅ Story NUEVA:**
```gherkin
Story 7.4: Dashboard Común con Navegación por Capabilities
Como usuario, quiero ver un dashboard general
con KPIs de la planta al hacer login, y acceder
solo a los módulos para los que tengo capacidades.
```

**Cambios en User Experience:**

**ANTES (Dashboard por Rol):**
```
Login como Operario →    ┌─────────────────────┐
                         │ Avisos Recientes    │
                         │ Mis Notificaciones  │
                         └─────────────────────┘

Login como Técnico →     ┌─────────────────────┐
                         │ Mis OTs del Día     │
                         │ Rutinas Pendientes  │
                         └─────────────────────┘

Login como Admin →       ┌─────────────────────┐
                         │ MTTR, MTBF          │
                         │ OTs Abiertas        │
                         │ Stock Crítico       │
                         └─────────────────────┘
```

**AHORA (Dashboard Común):**
```
Login como CUALQUIER usuario →

┌──────────────────────────────────────────────────┐
│  🏭 Planta de Acero Perfilado - Estado General   │
├──────────────────────────────────────────────────┤
│                                                  │
│  📊 MTTR: 4.2h ⬇️ 15%   📈 MTBF: 127h ⬆️ 8%    │
│  🔧 OTs Abiertas: 12    ⚠️ Stock Crítico: 3     │
│  👷 Técnicos Activos: 5                         │
│                                                  │
├──────────────────────────────────────────────────┤
│  ACCESO RÁPIDO (según tus capacidades)           │
│                                                  │
│  [📋 Reportar Avería]    ← can_create_failure_report│
│  [🔧 Mis OTs]            ← can_view_own_ots      │
│  [🔧 Ver Kanban]         ← can_view_all_ots      │
│  [📦 Gestión Stock]      ← can_manage_stock      │
│  [📊 KPIs Avanzados]     ← can_view_kpis         │
│  [👥 Gestión Usuarios]   ← can_assign_techn      │
└──────────────────────────────────────────────────┘
```

**Diferencia entre botones:**
- **"Mis OTs"** → Vista propia del usuario (listado default, toggle a kanban)
- **"Ver Kanban"** → Vista de supervisor (todas las OTs del equipo, kanban 8 columnas)

### 2.3 Artifact Conflicts

**PRD (prd.md):**
- ✅ **FR59-FR76** - Sección "Gestión de Usuarios, Roles y Capacidades" modificada
- ✅ **FR91-FR95** - Sección "Dashboards por Rol" eliminada, reemplazada por dashboard común
- ⚠️ **Total FRs modificados:** 8 funcional requirements reescritos + 4 nuevos FRs agregados

**Architecture (architecture.md):**
- 🔴 **Schema Prisma** - Tablas `RoleCapability` eliminadas, `UserCapability` agregadas
- 🔴 **Middleware de autorización** - Simplificado de `user.roles.capabilities` a `user.capabilities`
- 🟡 **NextAuth config** - Callback de sesión modificado para incluir capabilities directas

**UX Design (ux-design-specification.md):**
- 🟡 **Wireframe Registro de Usuario** - Agregada sección de checkboxes de 9 capabilities
- 🟡 **Wireframes Dashboard** - 4 wireframes (uno por rol) → 1 wireframe común
- 🟡 **Wireframe "Mis OTs"** - Listado default con toggle a Kanban, tipo explícito (Correctivo/Preventivo)
- 🟡 **User Journeys** - Journeys de Carlos, María, Javier, Elena actualizados

**Sprint Status (sprint-status.yaml):**
- ⚠️ **Epic 1** - Status debe cambiar de "in_progress" a "redefinition_required"
- ⚠️ **Story 1.4** - Si está "in_progress", marcar como "needs_rewrite"

### 2.4 Technical Impact

**Database Schema Changes:**

```prisma
// ❌ ELIMINAR
model RoleCapability {
  role         Role       @relation(fields: [roleId], references: [id])
  capability   Capability @relation(fields: [capabilityId], references: [id])
  roleId       String
  capabilityId String
  @@id([roleId, capabilityId])
}

// ✅ NUEVO
model UserCapability {
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  capability   Capability @relation(fields: [capabilityId], references: [id], onDelete: Cascade)
  userId       String
  capabilityId String
  @@id([userId, capabilityId])
}

// ⚠️ MODIFICAR
model User {
  id           String          @id @default(cuid())
  name         String?
  email        String          @unique
  passwordHash String
  isFirstLogin Boolean         @default(true)
  roles        UserRole[]
  capabilities UserCapability[]  // ← Agregar esta relación
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}

// ⚠️ MODIFICAR
model Capability {
  id               String           @id @default(cuid())
  name             String           @unique
  description      String?
  userCapabilities UserCapability[]
  // Eliminar roleCapabilities
}

// ✅ NUEVO: WorkOrder type
model WorkOrder {
  id          String          @id @default(cuid())
  code        String          @unique
  type        WorkOrderType   // ← NUEVO CAMPO
  title       String
  status      WorkOrderStatus
  isRoutine   Boolean         @default(false)
  assignedTo  User?           @relation(...)
  // ...
}

enum WorkOrderType {
  CORRECTIVE   // Avería, reparación reactiva
  PREVENTIVE   // Rutina, mantenimiento programado
}
```

**Middleware Changes:**

```typescript
// ❌ ANTES (código a eliminar)
export async function getUserCapabilities(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          capabilities: true
        }
      }
    }
  });

  // Extraer capabilities de roles
  const capabilities = user.roles.flatMap(role =>
    role.capabilities.map(cap => cap.name)
  );

  return [...new Set(capabilities)]; // Deduplicar
}

// ✅ AHORA (nuevo código)
export async function getUserCapabilities(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      capabilities: {
        select: {
          name: true
        }
      }
    }
  });

  return user.capabilities.map(cap => cap.name);
}

// Middleware simplificado
export function hasCapability(requiredCapability: string) {
  return async (request: Request) => {
    const session = await getServerSession();
    if (!session?.user) return false;

    const userCapabilities = await getUserCapabilities(session.user.id);
    return userCapabilities.includes(requiredCapability);
  };
}
```

**Migration Required:**
- ✅ **Prisma migration:** `add_user_capability_table`, `remove_role_capability_table`, `add_workorder_type`
- ⚠️ **Data migration:** Si hay datos de prueba en `RoleCapability`, migrar a `UserCapability`

**Testing Impact:**
- 🔴 **Unit tests** - Tests de autorización reescritos (checks de 9 capabilities)
- 🔴 **E2E tests** - Tests de journeys actualizados (dashboard común)
- 🟡 **Integration tests** - Tests de API con nuevos checks de permissions

---

## 3. RECOMMENDED APPROACH

### 3.1 Selected Path: Option 1 - Direct Adjustment

**Rationale:**

1. **Mejora arquitectónica significativa** - El modelo PBAC con roles como etiquetas es superior al RBAC puro para tu caso de uso
2. **Simplificación de testing** - Como justificaste, testear combinaciones de capabilities es más predecible que roles con herencia
3. **Flexibilidad sin overhead** - Mantienes la simplicidad de roles como "plantillas rápidas" pero con control granular
4. **Alinea con tu visión real** - El sistema se adapta a TI, no tú al sistema

**Effort Estimate:**
| Tarea | Effort | Due Date |
|-------|--------|----------|
| Reescribir Stories 1.4, 1.5, 1.6, 7.4 | 2 días | Day 2 |
| Actualizar FRs en PRD | 4 horas | Day 1 |
| Actualizar Architecture schema | 3 horas | Day 1 |
| Actualizar UX wireframes (Mis OTs con toggle) | 4 horas | Day 1 |
| Crear nueva migration Prisma | 2 horas | Day 2 |
| Reescribir middleware de autorización | 4 horas | Day 2 |
| Implementar componente "Mis OTs" (listado + toggle kanban) | 1 día | Day 3 |
| Actualizar tests (unit + E2E) | 4 horas | Day 3 |
| **TOTAL** | **3.5 días** | **Day 3** |

**Risk Assessment:**
- **Technical Risk:** Medium - Cambio de schema pero bien delimitado
- **Timeline Risk:** Low - +1 semana es aceptable
- **Scope Risk:** None - MVP remains unchanged in functionality
- **Team Morale Risk:** Low - Mejora claridad y simplicidad

**Trade-offs Accepted:**
- ⚠️ **Complejidad de gestión** - Admin debe ser más disciplinado (puede crear users "mono-capability" desordenados)
- ⚠️ **Testing exhaustivo** - Más combinaciones teóricas (2^9 = 512) vs 4 roles predefinidos
- ✅ **Mitigation:** Documentar best practices de asignación de capabilities

---

## 4. DETAILED CHANGE PROPOSALS

### 4.1 Capabilities Finales (9 en total)

```typescript
// CAPABILITIES DEL SISTEMA
1.  can_create_failure_report  (PREDETERMINADA - todos los usuarios)
2.  can_create_manual_ot       (Crear OTs manuales sin aviso previo)
3.  can_update_own_ot          (Actualizar OTs propias)
4.  can_view_own_ots           ← NUEVA (Ver solo OTs asignadas)
5.  can_view_all_ots           (Ver todas las OTs del equipo)
6.  can_complete_ot            (Completar OTs)
7.  can_manage_stock           (Gestionar stock de repuestos)
8.  can_assign_technicians     (Asignar técnicos a OTs, gestionar usuarios)
9.  can_view_kpis              (Ver KPIs avanzados con drill-down)
```

**Reglas de asignación:**
- ✅ `can_create_failure_report` - **PREDETERMINADA** (siempre marcada)
- ✅ `can_view_own_ots` - **Casi todos los técnicos** (para ver sus OTs)
- ✅ `can_view_all_ots` - **Solo supervisores/admins** (vista del equipo)
- ✅ `can_assign_technicians` - **Solo supervisores/admins**

**Combinaciones típicas:**
```
Operario:
  ✅ can_create_failure_report (predet.)
  ❌ Resto = NO

Técnico de Mantenimiento:
  ✅ can_create_failure_report (predet.)
  ✅ can_create_manual_ot
  ✅ can_update_own_ot
  ✅ can_view_own_ots          ← Ve sus OTs
  ❌ can_view_all_ots
  ✅ can_complete_ot
  ❌ can_manage_stock
  ❌ can_assign_technicians
  ❌ can_view_kpis

Técnico Encargado de Repuestos:
  ✅ can_create_failure_report (predet.)
  ✅ can_create_manual_ot
  ✅ can_update_own_ot
  ✅ can_view_own_ots
  ✅ can_complete_ot
  ✅ can_manage_stock          ← Extra
  ❌ can_assign_technicians
  ❌ can_view_kpis

Supervisor de Mantenimiento:
  ✅ can_create_failure_report (predet.)
  ✅ can_create_manual_ot
  ✅ can_update_own_ot
  ✅ can_view_own_ots
  ✅ can_view_all_ots          ← Ve todas las OTs
  ✅ can_complete_ot
  ❌ can_manage_stock
  ✅ can_assign_technicians
  ✅ can_view_kpis

Administrador (Owner):
  ✅ TODAS las capabilities
```

### 4.2 PRD - Functional Requirements Changes

**Location:** `_bmad-output/planning-artifacts/prd.md`

**FRs a MODIFICAR:**

| FR | ANTES | AHORA |
|----|-------|-------|
| **FR59** | "Los administradores pueden crear roles personalizados hasta 20 roles con capacidades" | "Los administradores pueden crear roles personalizados (hasta 20) como ETIQUETAS de clasificación (sin herencia de capacidades)" |
| **FR60** | "Los administradores pueden asignar capacidades a roles mediante controles binarios" | ❌ **ELIMINADO** |
| **FR63** | "Los usuarios heredan todas las capacidades de los roles asignados" | ❌ **ELIMINADO** |
| **FR64** | "Los administradores pueden asignar roles a usuarios" | ✅ **MANTENIDO** (como etiquetas) |
| **FR67** | "Las capacidades se otorgan a través de roles, no individualmente" | "Las capacidades se otorgan directamente a usuarios individuales mediante selección manual del administrador" |
| **FR68** | "Las capacidades incluyen: crear OT manual, actualizar propias OTs..." | "Las capacidades incluyen 9 items totales: can_create_failure_report (predet.), can_create_manual_ot, can_update_own_ot, can_view_own_ots, can_view_all_ots, can_complete_ot, can_manage_stock, can_assign_technicians, can_view_kpis" |
| **FR91** | "Los usuarios ven un dashboard específico según los roles del usuario al hacer login" | "Todos los usuarios acceden al mismo dashboard general con KPIs de la planta (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login" |
| **FR92-FR95** | Dashboards específicos por rol | ❌ **TODOS ELIMINADOS** |

**FRs NUEVOS a AGREGAR:**

```markdown
- **FR67-N1:** Los administradores pueden asignar capacidades directamente a
  usuarios individuales mediante checkboxes binarios durante el registro

- **FR67-N2:** Los roles se utilizan solo como etiquetas de clasificación
  de usuarios (ej: Operario, Técnico, Supervisor) y no otorgan capacidades

- **FR67-N3:** Un mismo rol NO otorga las mismas capacidades a todos los
  usuarios que lo tienen asignado

- **FR67-N4:** Todos los usuarios nuevos tienen la capability
  `can_create_failure_report` predeterminada, independientemente de otras
  capacidades asignadas

- **FR91-N1:** Desde el dashboard general, los usuarios solo ven botones de
  acceso a módulos para los que tienen capacidades asignadas

- **FR91-N2:** Los usuarios sin capability `can_view_kpis` ven los KPIs básicos
  pero no pueden hacer drill-down o ver análisis avanzado

- **FR91-N3:** Los botones de acceso rápido se muestran/ocultan dinámicamente
  según las capabilities del usuario actual
```

### 4.3 UX - Componente "Mis OTs" Detallado

**Requisitos UX confirmados por usuario:**

1. **Vista default:** Listado simplificado (óptimo para móvil/campo)
2. **Toggle:** Usuario puede cambiar a Kanban cuando quiera
3. **Integración de rutinas:** Las rutinas generan OTs automáticas con badge/tipo explícito
4. **Tipo explícito:** Cada OT muestra "Correctivo" o "Preventivo" con distintivo visual

**Diseño del Listado (Default View):**

```
┌─────────────────────────────────────────────────────────┐
│  📋 Mis Órdenes de Trabajo                    [⇄ Kanban]│ ← Toggle
│  [Filtrar: Todas ▼ | Pendientes | En Progreso]         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OT-789 │ 🔴 Correctivo │ Prensa PH-500 │ Pendiente   │[▶️]│
│  OT-785 │ 🔴 Correctivo │ Rodillo R-202  │ En Progreso│[✅]│
│  OT-795 │ 🟢 Preventivo │ Prensa PH-500 │ Pendiente   │[▶️]│
│         │   RUTINA      │ Revisión sem.  │             │    │
│  OT-791 │ 🔴 Correctivo │ Motor M-201     │ Pend. Rep. │[▶️]│
│  OT-783 │ 🔴 Correctivo │ Bomba B-105     │ Completada  │[👁]│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Detalles visuales:**
- **🔴 Correctivo** = OT reactiva (avería, reparación)
- **🟢 Preventivo** = OT de rutina (mantenimiento programado)
- Badge "RUTINA" debajo para preventivos (additional clarity)
- Colores de estado: Pendiente (blanco), En Progreso (amarillo), Pend. Repuesto (naranja), Completada (verde)

**Toggle a Kanban:**

```
María toca [⇄ Kanban] →

┌─────────────────────────────────────────────────────────┐
│  📋 Mis Órdenes de Trabajo                    [⇄ Listado]│ ← Toggle
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PENDIENTE          EN PROGRESO          COMPLETADA    │
│  ┌──────────────┐   ┌──────────────┐    ┌───────────┐ │
│  │OT-789        │   │OT-785        │    │OT-783     │ │
│  │🔴 Correctivo │   │🔴 Correctivo │    │🔴 Correct.│ │
│  │Prensa PH-500 │   │Rodillo R-202 │    │Bomba B-105│ │
│  │[▶️ Iniciar]  │   │[Completar]   │    │✅ Complet.│ │
│  └──────────────┘   └──────────────┘    └───────────┘ │
│                                                         │
│  PENDIENTE REPUESTO                                     │
│  ┌──────────────┐                                       │
│  │OT-791        │                                       │
│  │🔴 Correctivo │                                       │
│  │Motor M-201   │                                       │
│  │Falta rodam.  │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

**Lógica del Toggle:**
- **State guardado en localStorage** - Usuario elige su preferencia
- **Default:** Listado (móvil-first)
- **Desktop:** Puede preferir Kanban (más espacio)
- **Tablet:** Usuario elige

**Componente React:**

```typescript
// components/work-orders/MyWorkOrders.tsx
"use client"

export function MyWorkOrders() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  // Cargar preferencia desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('my-ots-view-mode')
    if (saved) setViewMode(saved as 'list' | 'kanban')
  }, [])

  // Guardar preferencia al cambiar
  const toggleView = () => {
    const newMode = viewMode === 'list' ? 'kanban' : 'list'
    setViewMode(newMode)
    localStorage.setItem('my-ots-view-mode', newMode)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Mis Órdenes de Trabajo</h1>
        <button onClick={toggleView}>
          {viewMode === 'list' ? '[⇄ Kanban]' : '[⇄ Listado]'}
        </button>
      </div>

      {viewMode === 'list' ? <WorkOrdersList /> : <WorkOrdersKanban />}
    </div>
  )
}
```

**Filtrado en componente:**
```typescript
// Si user tiene can_view_all_ots → muestra todas las OTs
// Si user NO tiene can_view_all_ots → filtra solo assignedTo === currentUser.id
```

---

## 5. IMPLEMENTATION HANDOFF

### 5.1 Change Scope Classification: **MODERATE**

**Justificación:**
- ✅ Requiere reorganización de backlog (4 stories reescritas)
- ✅ Requiere coordinación PO/SM para actualizar sprint status
- ❌ No requiere replanificación fundamental (MVP intacto)
- ❌ No requiere intervención PM/Architect para nueva estrategia

### 5.2 Handoff Recipients

**Primary:** Development Team (Bernardo + AI Dev Agents)
**Secondary:** Product Owner (para actualización de sprint-status.yaml)

### 5.3 Responsibilities by Role

**Development Team:**
1. **Day 1 (4 horas):** Actualizar PRD (FRs modificados + nuevos)
2. **Day 1 (3 horas):** Actualizar Architecture (schema + middleware)
3. **Day 1 (4 horas):** Actualizar UX wireframes (Dashboard + "Mis OTs")
4. **Day 2 (1 día):** Reescribir Stories 1.4, 1.5, 1.6, 7.4 en epics.md
5. **Day 2 (2 horas):** Crear nueva migration Prisma (add UserCapability, remove RoleCapability, add WorkOrderType)
6. **Day 2 (4 horas):** Implementar nuevo middleware de autorización (getUserCapabilities, hasCapability)
7. **Day 3 (1 día):** Implementar componente "Mis OTs" (listado + toggle kanban + tipo Correctivo/Preventivo)
8. **Day 3 (4 horas):** Actualizar tests (unit + E2E)

**Product Owner:**
1. Actualizar `sprint-status.yaml` con estados:
   - Epic 1: `in_progress` → `redefinition_required`
   - Story 1.4: `in_progress` → `needs_rewrite` (si aplica)
   - Story 1.5: `pending` → `pending` (sin cambios, solo spec update)
   - Story 1.6: `pending` → `pending` (sin cambios, solo spec update)
   - Story 7.4: `pending` → `needs_rewrite`

### 5.4 Success Criteria

**Functional:**
- ✅ Users pueden registrarse con rol (etiqueta) + 9 capabilities individuales
- ✅ Todos los users acceden al mismo dashboard
- ✅ Navegación muestra solo módulos según capabilities
- ✅ "Mis OTs" funciona con listado default + toggle a kanban
- ✅ OTs muestran tipo explícito (Correctivo/Preventivo)
- ✅ Rutinas generan OTs automáticas con badge Preventivo

**Technical:**
- ✅ Migration Prasma ejecutada sin errores
- ✅ No data loss en migration (si hay datos de prueba)
- ✅ Middleware simplificado reduce complejidad ciclomática
- ✅ Componente "Mis OTs" reutiliza lógica de Kanban para "Ver Kanban"

**Quality:**
- ✅ Code review approval
- ✅ Tests unit + E2E passing (>95% coverage)
- ✅ Performance sin degradación (<200ms auth checks)
- ✅ Toggle de view mode persiste en localStorage

---

## 6. FINAL RECOMMENDATION

### 6.1 Executive Summary

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| **Path Forward** | ✅ Opción 1 - Ajuste Directo | Cambio bien delimitado, mejora arquitectura |
| **Esfuerzo** | Medium | 4 stories reescritas + schema update + componente "Mis OTs" |
| **Riesgo** | Medium | Cambio arquitectónico controlado |
| **Timeline** | +1 semana | Aceptable para mejora significativa |
| **Impacto MVP** | Mínimo | Funcionalidad core se mantiene |
| **Scope** | Moderate | Requiere backlog reorg pero no replan |

### 6.2 Benefits Realized

1. **Flexibilidad máxima** - Admin puede ajustar capabilities granularmente por usuario
2. **Onboarding simplificado** - Todos al mismo dashboard, navegación adaptada
3. **Testing predecible** - Combinaciones de capabilities vs roles heredados
4. **UX mejorada** - Listado default para técnicos, toggle a Kanban para quienes prefieren vista visual
5. **Claridad** - Tipo explícito (Correctivo/Preventivo) en todas las OTs

### 6.3 Migration Path

**Phase 1: Planning (Day 1)**
- Actualizar artifacts (PRD, Architecture, UX, Epics)
- Review y aprobación de cambios

**Phase 2: Implementation (Day 2-3)**
- Migration Prisma
- Middleware de autorización
- Componente "Mis OTs" con toggle
- Tests actualizados

**Phase 3: Validation (Day 3)**
- E2E tests pasando
- Performance validation
- User acceptance

**Phase 4: Deployment (Day 4)**
- Deploy a staging
- Validación final
- Deploy a producción

---

## 7. APPENDICES

### Appendix A: Complete List of FR Changes

**Modified FRs (8):**
- FR59: Roles creation → Roles as labels
- FR60: ❌ Deleted (role capabilities)
- FR63: ❌ Deleted (role inheritance)
- FR67: Capabilities via roles → Capabilities directly to users
- FR68: 8 capabilities → 9 capabilities
- FR91: Dashboard by role → Common dashboard
- FR92: ❌ Deleted (operario dashboard)
- FR93: ❌ Deleted (técnico dashboard)
- FR94: ❌ Deleted (supervisor dashboard)
- FR95: ❌ Deleted (admin dashboard)

**New FRs (7):**
- FR67-N1: Direct capability assignment to users
- FR67-N2: Roles as classification labels only
- FR67-N3: Same role ≠ same capabilities
- FR67-N4: can_create_failure_report predetermined
- FR91-N1: Dynamic navigation based on capabilities
- FR91-N2: can_view_kpis controls drill-down
- FR91-N3: Dynamic button visibility

### Appendix B: Database Migration Script

```sql
-- Migration: add_user_capability_table
-- Step 1: Create new UserCapability table
CREATE TABLE "UserCapability" (
  "userId" TEXT NOT NULL,
  "capabilityId" TEXT NOT NULL,
  PRIMARY KEY ("userId", "capabilityId"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE CASCADE
);

-- Step 2: Migrate existing data (if any)
INSERT INTO "UserCapability" ("userId", "capabilityId")
SELECT DISTINCT
  "UserRole"."userId",
  "RoleCapability"."capabilityId"
FROM "UserRole"
JOIN "RoleCapability" ON "UserRole"."roleId" = "RoleCapability"."roleId";

-- Step 3: Drop old RoleCapability table
DROP TABLE IF EXISTS "RoleCapability";

-- Step 4: Remove capabilities relation from Role (already done in schema)
-- Step 5: Add WorkOrder type enum
ALTER TYPE "WorkOrderType" ADD VALUE 'CORRECTIVE';
ALTER TYPE "WorkOrderType" ADD VALUE 'PREVENTIVE';
```

### Appendix C: Testing Checklist

**Unit Tests:**
- ✅ getUserCapabilities returns user's direct capabilities
- ✅ hasCapability middleware checks user capabilities correctly
- ✅ can_view_own_ots filters OTs assigned to current user
- ✅ can_view_all_ots returns all OTs without filtering
- ✅ WorkOrder type enum works correctly (CORRECTIVE vs PREVENTIVE)

**E2E Tests:**
- ✅ Admin registers user with role + 9 capabilities
- ✅ User logs in → sees common dashboard
- ✅ User with can_view_own_ots → sees "Mis OTs" button
- ✅ User without can_view_own_ots → does NOT see "Mis OTs" button
- ✅ User with can_view_all_ots → sees "Ver Kanban" button
- ✅ User opens "Mis OTs" → sees list view by default
- ✅ User toggles to Kanban → sees kanban view
- ✅ List view shows Corrective/Preventive type explicitly
- ✅ Kanban view shows Corrective/Preventive badge on cards
- ✅ Routine OTs appear with "Preventivo" type + "RUTINA" badge

**Performance Tests:**
- ✅ Auth check < 50ms (getUserCapabilities)
- ✅ "Mis OTs" list loads < 1s (filtered by assignedTo)
- ✅ Toggle List ↔ Kanban < 100ms (state change only)

---

## ✅ APPROVAL

**Producto Owner:** Bernardo
**Fecha de Aprobación:** 2026-03-01
**Status:** ✅ **APPROVED FOR IMPLEMENTATION**

**Next Steps:**
1. Dev Team actualiza artifacts (PRD, Architecture, UX, Epics)
2. Dev Team crea migration Prisma
3. Dev Team implementa middleware nuevo
4. Dev Team implementa componente "Mis OTs"
5. Dev Team actualiza tests
6. PO actualiza sprint-status.yaml
7. Dev Team continúa implementación con nuevo modelo

---

**Document Version:** 1.0
**Last Updated:** 2026-03-01
**Author:** John - Product Manager Agent
