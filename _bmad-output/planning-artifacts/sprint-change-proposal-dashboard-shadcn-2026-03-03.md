---
proposal_type: "implementation-requirement"
change_scope: "minor"
impact_level: "quality-improvement"
date: "2026-03-03"
user_name: "Bernardo"
project_name: "gmao-hiansa"
workflow: "correct-course"
status: "approved"
related_proposal: "sprint-change-proposal-2026-03-02.md"
---

# Sprint Change Proposal: Dashboard - Usar Componentes shadcn/ui

**Author:** Bernardo (con asistencia de AI Agent)
**Date:** 2026-03-03
**Proposal Type:** Requerimiento de Implementación - Calidad de Código
**Change Scope:** 🟢 MINOR (Direct implementation por development team)
**Status:** ✅ APPROVED

---

## 📌 Executive Summary

**Problema Identificado:** El archivo actual del dashboard (`src/app/(dashboard)/dashboard/page.tsx`) usa `divs` con clases CSS personalizadas en lugar de componentes **shadcn/ui**, violando los estándares del proyecto adoptados el 2026-03-02.

**Contexto Crítico:**
- ✅ shadcn/ui fue **APROBADO** el 2026-03-02 (Sprint Change Proposal previo)
- ✅ Componentes shadcn/ui ya están **INSTALADOS** en el proyecto
- ✅ `project-context.md` establece: "**ALWAYS** use shadcn/ui components for forms, buttons, cards, alerts"
- ⚠️ **PERO** el dashboard actual (placeholder) NO los usa

**Historia Afectada:**
- **Epic 7:** Dashboard de KPIs y Análisis de Mantenimiento
- **Story 7-4:** Dashboard común con navegación por capacidades
- **Estado Actual:** `ready-for-dev` (aún NO implementada formalmente)

**Solución Propuesta:** Cuando se implemente la Story 7-4, **DEBE** usar componentes shadcn/ui (Card, Button, Badge) según los estándares del proyecto.

---

## Section 1: Issue Summary

### 1.1 Problem Statement

**Trigger:** Observación directa del código del dashboard por el usuario

**Archivo Afectado:** `src/app/(dashboard)/dashboard/page.tsx:1-64`

**Problema Preciso:**

El dashboard actual implementa componentes UI con clases CSS personalizadas:

```tsx
// ❌ ACTUAL - Código placeholder incorrecto
<div className="dashboard-page">
  <a href="/kpis" className="button">Ver KPIs Avanzados</a>
  <div className="kpi-cards">
    <div className="kpi-card">
      <h3>MTTR (Tiempo Medio de Reparación)</h3>
      <p className="kpi-value">--</p>
    </div>
  </div>
</div>
```

**Debería ser:**

```tsx
// ✅ CORRECTO - Usando componentes shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

<div className="dashboard-page">
  <Button href="/kpis">Ver KPIs Avanzados</Button>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle>MTTR</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">--</p>
      </CardContent>
    </Card>
  </div>
</div>
```

### 1.2 Evidence

**Regla del project-context.md:44-49** (violada):

```markdown
**⚠️ CRITICAL UI RULES:**
- **ALWAYS** use shadcn/ui components for forms, buttons, cards, alerts
- **NEVER** create custom styled components when shadcn/ui provides one
- **ALWAYS** import from `@/components/ui/*` for shadcn components
- **PRESERVE** `data-testid` attributes for E2E tests in all components
```

**Componentes shadcn/ui disponibles** (confirmado):
- ✅ `src/components/ui/button.tsx`
- ✅ `src/components/ui/card.tsx`
- ✅ `src/components/ui/badge.tsx`
- ✅ `src/components/ui/alert.tsx`
- ✅ `src/components/ui/input.tsx`
- ✅ `src/components/ui/label.tsx`
- ✅ `src/components/ui/select.tsx`
- ✅ `src/components/ui/checkbox.tsx`
- ✅ `src/components/ui/form.tsx`
- ✅ `src/components/ui/dialog.tsx`
- ✅ `src/components/ui/dropdown-menu.tsx`

---

## Section 2: Impact Analysis

### 2.1 Epic Impact

**Epic 7: Dashboard de KPIs y Análisis de Mantenimiento**

| Story ID | Story Name | Impact Status | Action Required |
|----------|------------|---------------|-----------------|
| **7-4** | Dashboard común con navegación por capacidades | ⚠️ **AFFECTED** | DEBE usar shadcn/ui en implementación |
| 7-1 | Cálculo de MTTR y MTBF en tiempo real | ✅ No afectado | Componentes UI pueden usar shadcn/ui |
| 7-2 | Drill-down de KPIs en 4 niveles | ✅ No afectado | Componentes UI pueden usar shadcn/ui |
| 7-3 | Métricas adicionales y alertas accionables | ✅ No afectado | Componentes UI pueden usar shadcn/ui |
| 7-5 | Exportación de reportes a Excel | ✅ No afectado | N/A (backend feature) |

**Conclusión:** Solo Story 7-4 requiere acción específica. El resto pueden usar shadcn/ui pero no es obligatorio (pueden ser puro backend).

### 2.2 Artifact Conflicts

#### ✅ PRD
- **¿Conflictúa?** ❌ NO - Story 7-4 ya define el dashboard
- **¿Requiere cambios?** ❌ NO - Los requisitos funcionales son los mismos

#### ✅ Architecture
- **¿Conflictúa?** ❌ NO - shadcn/ui YA está documentado en architecture.md
- **¿Requiere cambios?** ❌ NO - Ya se agregó la sección "UI Component Library" el 2026-03-02

#### ✅ UX Design
- **¿Conflictúa?** ❌ NO - El UX Design define Cards para KPIs
- **¿Mejora?** ✅ SÍ - Los componentes shadcn/ui CUMPLEN las especificaciones UX

#### ✅ Testing
- **¿Conflictúa?** ❌ NO - Tests usan data-testid
- **¿Requiere cambios?** ❌ NO - Tests existentes seguirán funcionando

---

## Section 3: Recommended Approach

### 3.1 Path Forward

✅ **Option 1: Direct Adjustment** (RECOMENDADO)

**Descripción:**
Cuando se implemente la Story 7-4, usar componentes shadcn/ui desde el inicio.

**Effort Estimate:** 🟢 **BAJO** (Sin overhead adicional)
- Es el mismo esfuerzo implementar con shadcn/ui que con clases personalizadas
- De hecho, es MENOS código (menos caracteres de Tailwind)

**Risk Level:** 🟢 **MUY BAJO**
- Componentes ya están instalados y probados
- Patrones de uso ya están documentados en project-context.md

**Timeline Impact:** ✅ **NULO**
- No retrasa la implementación de Story 7-4
- Puede acelerarla (menos código que escribir)

### 3.2 Selected Approach: Option 1

**Justification:**

| Factor | Assessment |
|--------|------------|
| **Overhead de implementación** | 🟢 NULO - Es lo mismo usar shadcn/ui que divs |
| **Calidad de código** | ✅ MEJORA - Cumple estándares del proyecto |
| **Consistencia** | ✅ MEJORA - Todos los componentes usan shadcn/ui |
| **Mantenibilidad** | ✅ MEJORA - Componentes reutilizables vs custom |
| **Testing** | ✅ IGUAL - data-testid se preserva |
| **Documentación** | ✅ COMPLETA - Patrones ya documentados |

---

## Section 4: Detailed Change Proposals

### 4.1 Story Implementation Requirements

**Story ID:** 7-4
**Story Name:** Dashboard común con navegación por capacidades
**Estado Actual:** `ready-for-dev`
**Requerimiento:** DEBE usar componentes shadcn/ui

#### Componentes a Usar:

**1. Cards para KPIs:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>MTTR (Tiempo Medio de Reparación)</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">4.2h</p>
    <Badge variant="secondary">↓ 15%</Badge>
  </CardContent>
</Card>
```

**2. Buttons para navegación:**
```tsx
import { Button } from "@/components/ui/button"

<Button href="/kpis" variant="default">Ver KPIs Avanzados</Button>
<Button href="/work-orders/kanban" variant="outline">Ver Kanban</Button>
```

**3. Badges para estados:**
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="destructive">🔴 Correctivo</Badge>
<Badge variant="default">🟢 Preventivo</Badge>
```

**4. Alert para mensajes:**
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"

{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

#### Layout con Grid System:

```tsx
// ✅ Dashboard layout usando Tailwind grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>...</Card> {/* MTTR */}
  <Card>...</Card> {/* MTBF */}
  <Card>...</Card> {/* OTs Abiertas */}
  <Card>...</Card> {/* Stock Crítico */}
</div>
```

#### Navegación Condicional por Capacidades:

```tsx
// ✅ Usando shadcn Button + lógica de capacidades
<div className="flex gap-2">
  {capabilities.includes('can_view_kpis') && (
    <Button href="/kpis" variant="default">
      Ver KPIs Avanzados
    </Button>
  )}
  {capabilities.includes('can_view_all_ots') && (
    <Button href="/work-orders/kanban" variant="outline">
      Ver Kanban
    </Button>
  )}
  {capabilities.includes('can_view_own_ots') && (
    <Button href="/work-orders/my-ots" variant="secondary">
      Mis OTs
    </Button>
  )}
</div>
```

#### Preservar data-testid para Tests:

```tsx
// ✅ Todos los componentes deben tener data-testid
<Card data-testid="kpi-card-mttr">
  <CardHeader>
    <CardTitle>MTTR</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold" data-testid="mttr-value">4.2h</p>
  </CardContent>
</Card>

<Button data-testid="kpis-button">Ver KPIs Avanzados</Button>
```

---

### 4.2 Implementation Checklist

**Antes de implementar Story 7-4:**

- [ ] Revisar `project-context.md:39-219` (UI Component Library rules)
- [ ] Revisar `architecture.md` (sección UI Component Library)
- [ ] Confirmar que componentes shadcn/ui están instalados en `src/components/ui/`

**Durante implementación de Story 7-4:**

- [ ] Usar `<Card>` para KPI cards (NO `<div className="kpi-card">`)
- [ ] Usar `<Button>` para navegación (NO `<a className="button">`)
- [ ] Usar `<Badge>` para estados/indicadores
- [ ] Usar `<Alert>` para mensajes de error
- [ ] Preservar `data-testid` en todos los componentes interactivos
- [ ] Usar Tailwind grid para layout (NO clases CSS custom)

**Después de implementar Story 7-4:**

- [ ] Verificar que NO hay clases CSS custom en dashboard
- [ ] Ejecutar `npm run test` - todos los tests deben pasar
- [ ] Ejecutar `npm run test:e2e` - E2E tests deben pasar
- [ ] Revisión visual en navegador (Chrome y Edge)
- [ ] Verificar que no hay errores en consola del navegador

---

## Section 5: Implementation Handoff

### 5.1 Change Scope Classification

**🟢 MINOR** - Direct implementation por development team

**Categorization:**
- **Technical Change:** ❌ No (cambio de implementación, no de tecnología)
- **Quality Change:** ✅ Sí - Cumple estándares del proyecto
- **Functional Change:** ❌ No - Misma funcionalidad, mejor implementación
- **Documentation Change:** ❌ No - Ya está documentado

### 5.2 Handoff Plan

#### **Responsable:** Development Team (AI Agent + Usuario)

**Actions:**
1. **Story Creation:** Crear archivo de historia 7-4 con requisitos claros
2. **Implementation:** Implementar dashboard usando componentes shadcn/ui
3. **Testing:** Ejecutar tests (unit + E2E) para verificar funcionalidad
4. **Code Review:** Revisar que cumpla estándares de shadcn/ui

**Deliverables:**
- ✅ Story 7-4 implementada con componentes shadcn/ui
- ✅ Tests passing (unit + E2E)
- ✅ Código sin clases CSS custom
- ✅ data-testid preservados

**Success Criteria:**
- ✅ Dashboard usa `<Card>`, `<Button>`, `<Badge>`, `<Alert>` de shadcn/ui
- ✅ 0 clases CSS custom (`.button`, `.kpi-card`, etc.)
- ✅ Todos los tests pasan sin modificaciones
- ✅ Usuario aprueba visualmente

### 5.3 Responsibilities Matrix

| Fase | Responsable | Tiempo Estimate | Dependencies |
|------|-------------|-----------------|--------------|
| **Story Creation** | SM Agent | 30 min | None |
| **Implementation** | Dev Agent | 2-3 horas | Story creada |
| **Testing** | Usuario | 30 min | Implementación completa |
| **Code Review** | Dev Agent (segundo pass) | 30 min | Testing aprobado |
| **TOTAL** | - | **3.5-4 horas** | - |

---

## Section 6: Approval and Next Steps

### 6.1 Proposal Status

**Status:** ✅ **APPROVED**

**Approved By:** Bernardo
**Date:** 2026-03-03
**Approval Method:** Direct user confirmation ("a")

### 6.2 Next Steps

1. **Inmediato (hoy):**
   - ✅ Sprint Change Proposal aprobado
   - 📝 Actualizar este documento con approval final

2. **Próximos días:**
   - 📋 SM Agent crea Story 7-4 con requisitos de shadcn/ui
   - 💻 Dev Agent implementa dashboard con componentes shadcn/ui
   - 🧪 Usuario ejecuta tests
   - 👀 Dev Agent hace code review

3. **Seguimiento:**
   - Verificar que Story 7-4 usa componentes shadcn/ui
   - Marcar Story 7-4 como `done` cuando cumpla acceptance criteria

---

## Conclusion

**Resumen Ejecutivo:**

Este Sprint Change Proposal establece que la **Story 7-4 (Dashboard)** **DEBE** usar componentes shadcn/ui (`<Card>`, `<Button>`, `<Badge>`, `<Alert>`) según los estándares del proyecto adoptados el 2026-03-02.

**Impacto:**
- ✅ **Sin overhead adicional** - Es lo mismo implementar con shadcn/ui que sin él
- ✅ **Mejora calidad** - Cumple estándares del proyecto
- ✅ **Consistencia** - Todos los componentes usan shadcn/ui
- ✅ **Mantenibilidad** - Componentes reutilizables vs custom

**Recomendación Final:** ✅ **PROCEED WITH STORY 7-4 IMPLEMENTATION USING SHADCN/UI**

---

**End of Sprint Change Proposal**

_Document generated via Correct Course Workflow_
_Date: 2026-03-03_
_Project: gmao-hiansa_
_Author: Bernardo (with AI Agent assistance)_
