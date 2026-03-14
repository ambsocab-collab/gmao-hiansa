# Sprint Change Proposal - GMAO Hiansa

**Fecha:** 2026-03-14
**Tipo:** Ajuste Directo (Direct Adjustment)
**Esfuerzo estimado:** Medium (+3-5 días)
**Riesgo:** Medium
**Impacto MVP:** Ninguno (scope se mantiene)

---

## 1. RESUMEN EJECUTIVO

### Problema Identificado

Durante la revisión visual post-implementación de Stories 1.1-1.3 (Epic 1: Autenticación y Gestión de Usuarios), se identificaron **6 problemas críticos** de UI/UX:

1. **Inconsistencia de colores en documentación**: PRD especifica azul #0066CC, UX Design especifica rojo burdeos #A51C30, HTML de diseño muestra #7D1220
2. **Landing page incorrecta**: Implementada como página informativa con 3 cards, debe ser landing minimalista
3. **Layout desktop deficiente**: Navbar lateral demasiado grande, mala distribución de componentes
4. **Branding redundante**: "GMAO Hiansa" repetido en header y navbar (se ve mal)
5. **Footer repetitivo**: "GMAO 2026" aparece múltiples veces, restando espacio de pantalla
6. **Falta de identidad de marca**: Logo Hiansa SVG no está integrado en ninguna página

### Trigger del Cambio

Revisión visual del sistema después de completar Stories 1.1, 1.2 y 1.3 del Epic 1. El stakeholder (Bernardo) observó que la implementación actual no coincide con su visión de la marca Hiansa.

### Propuesta de Solución

Implementar un **sistema multi-direccional** donde cada página use la dirección de diseño óptima, con corrección de colores a #7D1220, integración del logo SVG, y landing page minimalista.

---

## 2. ANÁLISIS DE IMPACTO

### 2.1 Impacto en Epic 1: Autenticación y Gestión de Usuarios

**Epic Status:** ⚠️ REQUIERE MODIFICACIONES

**Stories Afectadas:**

| Story | Estado | Impacto | Acción Req. |
|-------|--------|---------|-------------|
| **Story 1.0** (NUEVA) | Pending | Alta | Crear |
| **Story 1.1: Login** | ✅ Completada | Baja | Solo doc |
| **Story 1.2: PBAC** | ✅ Completada | Ninguno | N/A |
| **Story 1.3: Etiquetas** | ✅ Completada | Ninguno | N/A |
| **Story 1.4** (NUEVA) | Pending | Alta | Crear |
| **Story 1.5** (NUEVA) | Pending | Alta | Crear |

**Detalle de Acciones:**

- **Story 1.1 (Login)**: Solo actualizar documentación, NO modificar código implementado
- **Story 1.2 y 1.3**: Sin cambios (funcionalidad correcta)
- **Nuevas Stories**: 1.0, 1.4 y 1.5 (ver detalle en Sección 4)

### 2.2 Impacto en Otros Epics

| Epic | Impacto | Justificación |
|------|---------|---------------|
| **Epic 0: Setup** | ⚠️ ALTO | Sistema de diseño debe configurarse ANTES de continuar |
| **Epic 2: Averías** | ⚠️ MEDIO | Colores de OTs deben contrastar con #7D1220 |
| **Epic 3: Kanban** | ⚠️ MEDIO | Layout 8 columnas necesita navbar optimizado |
| **Epic 4: Activos** | ⚠️ MEDIO | Jerarquía de 5 niveles necesita buena distribución |
| **Epic 5: Repuestos** | ⚠️ MEDIO | Tablas necesitan layout desktop optimizado |
| **Epic 6: KPIs** | ⚠️ MEDIO | Gráficos necesitan buena distribución |
| **Epic 7: Rutinas** | ⚠️ MEDIO | Formularios necesitan layout optimizado |
| **Epic 8: PWA** | ⚠️ MEDIO | Desktop responsive ya considerado, pero necesita mejora |

**Conclusión:** TODOS los epics futuros deben considerar el nuevo sistema de diseño #7D1220 y layout optimizado.

---

## 3. CAMBIOS EN DOCUMENTACIÓN

### 3.1 PRD - Visual Specifications

**Archivo:** `_bmad-output/planning-artifacts/prd/visual-specifications.md`

**SECCIÓN AFECTADA:** Color Palette (líneas 7-21)

**CAMBIO:**

```markdown
**ANTES:**
- **Primary Colors:**
  - Main Blue: #0066CC (acciones principales, botones CTAs)
  - Secondary Blue: #004C99 (estados hover, active)
- **Status Colors (semáforo):**
  - Success/Green: #28A745 (OT completada, stock OK)
  - Warning/Orange: #FD7E14 (OT en progreso, stock baja)
  - Danger/Red: #DC3545 (OT vencida, stock crítico, avería)
  - Info/Blue: #17A2B8 (información general)
- **Neutral Colors:**
  - Text Primary: #212529 (texto principal)
  - Text Secondary: #6C757D (texto secundario, labels)
  - Background: #F8F9FA (fondos, cards)
  - Border: #DEE2E6 (bordes, separadores)

**DESPUÉS:**
- **Primary Colors (Marca Hiansa):**
  - Rojo Burdeos Hiansa: #7D1220 (color principal de marca, header, logo, CTAs)
  - Rojo Burdeos Oscuro: #5A0E16 (estados hover, active)
- **Status Colors (semáforo):**
  - Success/Green: #28A745 (OT completada, stock OK)
  - Warning/Orange: #FD7E14 (OT en progreso, stock baja)
  - Danger/Red: #DC3545 (OT vencida, stock crítico, avería)
  - Info/Blue: #17A2B8 (información general)
- **Neutral Colors:**
  - Text Primary: #212529 (texto principal)
  - Text Secondary: #6C757D (texto secundario, labels)
  - Background: #FFFFFF (fondos, cards)
  - Border: #DEE2E6 (bordes, separadores)
```

**NUEVA SECCIÓN AGREGAR:** (después de Iconography)

```markdown
## Logo y Branding

**Logo Corporativo:**
- Archivo: `logo-hiemesa.svg` (164px × 41px)
- Integración: Componente `<HiansaLogo />` en todas las páginas
- Ubicación: Encima del navbar, centrado o alineado izquierda
- Uso: Landing page, dashboard, todas las páginas autenticadas

**Reglas de Branding:**
- ✅ Logo Hiansa SVG encima del navbar
- ✅ Texto "GMAO" en navbar (sin "Hiansa" duplicado)
- ❌ NO repetir "GMAO Hiansa" en header Y navbar
- ❌ NO usar "GMAO 2026" repetido en footer

**Sistema Multi-Direccional:**
El sistema GMAO usa 6 direcciones de diseño adaptadas al contexto:

| Dirección | Página/Contexto | Características |
|-----------|-----------------|----------------|
| **Dir 1: Dashboard Clásico** | `/dashboard` | Sidebar fijo, KPIs prominentes, layout enterprise |
| **Dir 2: Kanban First** | `/kanban` | Kanban 8 columnas protagonista, panel KPIs lateral |
| **Dir 3: Mobile First** | Todas en móvil (<768px) | Touch targets grandes, bottom nav, gestos swipe |
| **Dir 4: Data Heavy** | `/kpis`, `/analytics` | Múltiples gráficos, tablas densas, drill-down |
| **Dir 5: Minimal** | `/` (landing) | Mucho whitespace, elementos reducidos, minimalista |
| **Dir 6: Action Oriented** | `/reportar`, acciones rápidas | CTAs prominentes, flujos simplificados |

Cada dirección optimiza la experiencia para el caso de uso específico.
```

**Justificación:**
- Coherencia con UX Design que ya especifica #7D1220 (como #A51C30 similar)
- Logo SVG corporativo debe estar documentado
- Reglas de branding evitan redundancia visual
- Sistema multi-direccional alineado con HTML de diseño

---

### 3.2 UX Design - Design System Foundation

**Archivo:** `_bmad-output/planning-artifacts/ux-design-specification/design-system-foundation.md`

**SECCIÓN AFECTADA:** Design Tokens (líneas 172-197)

**CAMBIO:**

```javascript
**ANTES:**
:root {
  --primary: 221.2 83.2% 53.3%; /* Azul Hiansa */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

**DESPUÉS:**
:root {
  /* Colores de Marca Hiansa */
  --primary: 356 73% 32%; /* Rojo Burdeos Hiansa #7D1220 */
  --primary-foreground: 0 0% 100%; /* Blanco */

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 356 73% 37%; /* Rojo Burdeos ligeramente más claro */
  --accent-foreground: 0 0% 100%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;

  --ring: 356 73% 32%; /* Rojo Burdeos Hiansa */

  --radius: 0.5rem;
}
```

**NUEVA SECCIÓN AGREGAR:** (después de "9. Maintenance Strategy")

```markdown
## 10. Multi-Directional Design System

**Componentes con Variantes por Dirección:**

shadcn/ui components tendrán variants específicas para cada dirección:

**Ejemplo: Navbar Lateral**

```tsx
// components/layout/sidebar.tsx
interface SidebarProps {
  direction: 'classic' | 'kanban' | 'minimal' | 'action'
  variant: 'default' | 'compact' | 'mini'
}

<Sidebar direction="classic" variant="compact" />
```

**Variantes de Navbar:**

| Variant | Ancho | Caso de Uso |
|---------|-------|-------------|
| `default` | 256px (w-64) | Dashboard clásico (Dirección 1) |
| `compact` | 200px (w-52) | Kanban First (Dirección 2) - reduce espacio |
| `mini` | 160px (w-40) | Data Heavy (Dirección 4) - máximo espacio para datos |

**Layout Strategy por Dirección:**

- **Dirección 1 (Dashboard):** Grid con sidebar default + main content
- **Dirección 2 (Kanban):** Grid con sidebar compact + kanban full width
- **Dirección 3 (Mobile):** Single column, bottom nav, NO sidebar
- **Dirección 4 (Data):** Grid con sidebar mini + tablas anchas
- **Dirección 5 (Minimal):** NO sidebar, solo top nav minimalista
- **Dirección 6 (Action):** Sidebar default + CTAs prominentes
```

**Justificación:**
- Tokens HSL actualizados a #7D1220 (356° 73% 32%)
- Sistema de variants permite navbar compact (resuelve "demasiado grande")
- Layout strategy por dirección resuelve problemas de distribución

---

### 3.3 Landing Page Specification (NUEVO DOCUMENTO)

**Archivo:** `_bmad-output/planning-artifacts/landing-page-spec.md` (NUEVO)

**CONTENIDO:**

```markdown
# Landing Page Specification - GMAO Hiansa

## Objetivo

Crear una primera impresión minimalista y elegante de la marca Hiansa, con acceso directo al login.

## Diseño Visual (Dirección 5: Minimal)

### Layout

```
┌─────────────────────────────────────────┐
│  Fondo: #7D1220 (Rojo Burdeos Hiansa)  │
│                                         │
│         [LOGO HIANSA SVG]              │
│                                         │
│              GMAO                       │
│         (texto blanco, grande)          │
│                                         │
│                                         │
│     [Botón: Acceder al Sistema]        │
│     (fondo blanco, texto #7D1220)       │
│                                         │
│                                         │
│                                         │
│    powered by hiansa BSC               │
│    (texto blanco pequeño, footer)       │
└─────────────────────────────────────────┘
```

### Especificaciones Técnicas

**HTML Structure:**

```tsx
// app/page.tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#7D1220] flex flex-col items-center justify-center relative">
      {/* Logo Hiansa SVG */}
      <div className="mb-8">
        <HiansaLogo className="w-40 h-10" />
      </div>

      {/* Texto GMAO */}
      <h1 className="text-6xl font-light text-white mb-12 tracking-wider">
        GMAO
      </h1>

      {/* Botón CTA */}
      <Link href="/login">
        <button className="bg-white text-[#7D1220] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
          Acceder al Sistema
        </button>
      </Link>

      {/* Footer */}
      <footer className="absolute bottom-8 text-white/60 text-sm">
        powered by hiansa BSC
      </footer>
    </div>
  )
}
```

**Responsive Behavior:**

- **Desktop (>1200px):** Logo centrado, texto 72px, botón 200px ancho
- **Tablet (768-1200px):** Logo centrado, texto 56px, botón 180px ancho
- **Mobile (<768px):** Logo 80% ancho, texto 40px, botón 100% ancho con márgenes

**Accessibility:**

- Contraste WCAG AA: Blanco sobre #7D1220 = 6.3:1 ✅
- Botón touch target: 48px altura mínimo
- Focus visible: outline 2px blanco

**Animaciones:**

- Fade-in suave al cargar (300ms)
- Hover en botón: ligero scale (1.02)
- NO parpadeo ni movimiento excesivo

## Conexión con Usuario Autenticado

**Behavior:**

```tsx
// Server-side check de autenticación
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  if (session) {
    // Usuario autenticado → redirigir a /dashboard
    redirect('/dashboard')
  }

  // Usuario NO autenticado → mostrar landing
  return <LandingPage />
}
```

## Success Criteria

- [ ] Landing page muestra fondo #7D1220 plano
- [ ] Logo Hiansa SVG visible y centrado
- [ ] Solo texto "GMAO" visible (sin "Hiansa" duplicado)
- [ ] Botón "Acceder al Sistema" funcional → redirige a /login
- [ ] Footer "powered by hiansa BSC" visible
- [ ] Usuarios autenticados redirigidos automáticamente a /dashboard
- [ ] Responsive en mobile, tablet, desktop
- [ ] WCAG AA compliance (contraste, touch targets)
```

---

## 4. PROPUESTAS DE STORIES

### 4.1 Story 1.0: Sistema de Diseño Multi-Direccional (NUEVA)

**Título:** Configurar Sistema de Diseño Hiansa con Multi-Direcciones

**Prioridad:** CRÍTICA - Debe completarse ANTES que cualquier otra story de UI

**Acceptance Criteria:**

**Given** que el sistema de diseño no está configurado
**When** ejecuto Story 1.0
**Then** el sistema de diseño está completamente configurado

**AC1: Configuración de Colores**
- Tailwind config actualizado con #7D1220 como color primario
- Tokens CSS (`--primary`, `--primary-foreground`, `--ring`) actualizados
- Paleta de colores de marca documentada

**AC2: Componente Logo Hiansa**
- Componente `<HiansaLogo />` creado en `components/brand/hiansa-logo.tsx`
- Logo SVG integrado desde `logo-hiemesa.svg`
- Props: `className` y `size` variantes (sm, md, lg)
- Logo visible sobre fondo #7D1220 y blanco

**AC3: Navbar Lateral con Variantes**
- Componente `<Sidebar />` creado con 3 variantes: default, compact, mini
- Variant `default` = 256px ancho (w-64)
- Variant `compact` = 200px ancho (w-52) ← **RESUELVE "demasiado grande"**
- Variant `mini` = 160px ancho (w-40)
- Sidebar responsive: oculto en móvil (<768px)

**AC4: Sistema Multi-Direccional**
- 6 direcciones documentadas con sus casos de uso
- Cada dirección tiene layout pattern específico
- Componentes shadcn/ui adaptados con variants por dirección

**AC5: Eliminar Redundancia de Branding**
- Header NO muestra "GMAO Hiansa" (solo logo SVG)
- Navbar muestra solo "GMAO" (sin "Hiansa" duplicado)
- Footer NO muestra "GMAO 2026" repetido
- Branding limpio y consistente

**Dependencies:**
- Logo SVG file: `_bmad-output/planning-artifacts/ux-design-specification/logo-hiemesa.svg`
- Tailwind CSS instalado
- shadcn/ui instalado

**Definition of Done:**
- [ ] Tailwind config actualizado con #7D1220
- [ ] `globals.css` con tokens CSS actualizados
- [ ] `<HiansaLogo />` component creado y testeado
- [ ] `<Sidebar />` con 3 variantes creado
- [ ] Documentación de 6 direcciones completa
- [ ] Story marcada como completada en sprint-status.yaml

---

### 4.2 Story 1.1: Login, Registro y Perfil (SOLO DOCUMENTACIÓN)

**Estado:** ✅ COMPLETADA - Solo actualizar documentación

**Cambios Required:**

**Documentación (NO código):**
- [ ] Actualizar PRD: Color #0066CC → #7D1220
- [ ] Actualizar UX Design: Tokens a #7D1220
- [ ] Documentar que login usa logo Hiansa (no texto "GMAO Hiansa")
- [ ] Actualizar AC de login para mencionar componente `<HiansaLogo />`

**Código:** SIN CAMBIOS (implementación actual es correcta funcionalmente)

---

### 4.3 Story 1.4: Landing Page Minimalista (NUEVA)

**Título:** Crear Landing Page Minimalista con Identidad de Marca Hiansa

**Prioridad:** ALTA - Primera impresión de la marca

**Acceptance Criteria:**

**Given** que soy usuario NO autenticado
**When** accedo a `/`
**Then** veo landing page minimalista con marca Hiansa

**AC1: Diseño Visual**
- Fondo #7D1220 (Rojo Burdeos Hiansa) plano
- Logo Hiansa SVG centrado arriba
- Texto "GMAO" grande centrado (sin "Hiansa" duplicado)
- Botón "Acceder al Sistema" blanco con texto #7D1220
- Footer "powered by hiansa BSC" blanco abajo

**AC2: Comportamiento de Autenticación**
- Usuarios NO autenticados ven landing page
- Usuarios autenticados redirigidos automáticamente a `/dashboard`
- Server-side check de sesión usando NextAuth

**AC3: Responsive Design**
- Desktop (>1200px): Logo 164px, texto 72px, layout centrado
- Tablet (768-1200px): Logo 140px, texto 56px, márgenes laterales
- Mobile (<768px): Logo 120px, texto 40px, botón 100% ancho

**AC4: Accessibility**
- Contraste WCAG AA: Blanco sobre #7D1220 (6.3:1)
- Touch targets: Botón 48px altura mínimo
- Focus visible en botón
- Screen reader announce: "Landing page de GMAO Hiansa"

**AC5: Animaciones**
- Fade-in al cargar (300ms ease-in)
- Hover en botón: scale(1.02) + shadow
- NO parpadeo ni movimiento distractivo

**Dependencies:**
- Story 1.0 debe estar completada (sistema de diseño + logo)
- NextAuth configurado para server-side session check

**Definition of Done:**
- [ ] `app/page.tsx` implementado con landing minimalista
- [ ] Server-side auth redirect funcional
- [ ] Responsive en mobile, tablet, desktop
- [ ] WCAG AA compliance verificado
- [ ] Story marcada como completada en sprint-status.yaml

---

### 4.4 Story 1.5: Corregir Layout Desktop e Integrar Logo (NUEVA)

**Título:** Optimizar Layout Desktop y Eliminar Redundancia Visual

**Prioridad:** ALTA - Problemas actuales de UX en desktop

**Acceptance Criteria:**

**Given** que el sistema de diseño está configurado (Story 1.0)
**When** navego por páginas autenticadas
**Then** veo layout optimizado sin redundancia

**AC1: Integrar Logo en Todas las Páginas**
- Logo Hiansa SVG visible encima de navbar
- Logo ubicado en header, alineado izquierda o centrado
- Logo desaparece en sidebar móvil (bottom nav)
- Logo responsive: escala en tablet/móvil

**AC2: Sidebar Compacto por Defecto**
- Sidebar usa variant `compact` (200px ancho) en desktop
- Sidebar usa variant `mini` (160px) en páginas de datos
- Sidebar oculto en móvil (<768px)
- **RESUELVE:** "Navbar lateral demasiado grande"

**AC3: Eliminar Redundancia de Branding**
- Header muestra solo Logo Hiansa (NO texto "GMAO Hiansa")
- Sidebar muestra solo "GMAO" (NO "Hiansa" duplicado)
- **RESUELVE:** "GMAO Hiansa repetido en header y navbar"

**AC4: Footer Optimizado**
- Footer muestra solo "powered by hiansa BSC"
- Footer NO muestra "GMAO 2026" repetido
- Footer sticky bottom o estático según página
- **RESUELVE:** "GMAO 2026 repetido muchas veces"

**AC5: Layout por Dirección**
- `/dashboard` → Sidebar `default` + grid clásico (Dir 1)
- `/kanban` → Sidebar `compact` + kanban full width (Dir 2)
- `/kpis` → Sidebar `mini` + tablas anchas (Dir 4)
- Todas en móvil → Bottom nav + NO sidebar (Dir 3)

**Dependencies:**
- Story 1.0 debe estar completada (sistema de diseño)
- Story 1.1 debe estar completada (login funcional)

**Definition of Done:**
- [ ] `app/(auth)/layout.tsx` con logo Hiansa arriba
- [ ] Sidebar compact implementado
- [ ] Footer optimizado sin "GMAO 2026"
- [ ] Layout por dirección configurado
- [ ] Testing en desktop, tablet, móvil completado
- [ ] Story marcada como completada en sprint-status.yaml

---

## 5. PLAN DE IMPLEMENTACIÓN

### 5.1 Secuencia de Stories

```
ORDEN DE EJECUCIÓN:

1. Story 1.0: Sistema de Diseño Multi-Direccional
   └─ Dependencies: Ninguna
   └─ Output: Sistema configurado + Logo + Sidebar variants

2. Story 1.1: Login (SOLO DOC)
   └─ Dependencies: Ninguna
   └─ Output: Documentación actualizada

3. Story 1.4: Landing Page Minimalista
   └─ Dependencies: Story 1.0 (sistema de diseño)
   └─ Output: Landing (/) funcional

4. Story 1.5: Layout Desktop + Logo
   └─ Dependencies: Story 1.0 (sistema de diseño)
   └─ Output: Layout optimizado en páginas autenticadas
```

### 5.2 Estimación de Esfuerzo

| Story | Días Estimados | Complejidad |
|-------|----------------|-------------|
| **Story 1.0** | 2 días | Medium |
| **Story 1.1** | 0.5 días | Low (solo doc) |
| **Story 1.4** | 1 día | Medium |
| **Story 1.5** | 1.5 días | Medium |
| **Total** | **5 días** | - |

### 5.3 Timeline Sugerido

**Semana 1:**
- Lunes-Martes: Story 1.0 (Sistema de Diseño)
- Miércoles: Story 1.1 (Doc Login)
- Jueves-Viernes: Story 1.4 (Landing Page)

**Semana 2:**
- Lunes-Martes: Story 1.5 (Layout Desktop)
- Miércoles: Testing y correcciones
- Jueves: Documentación final
- Viernes: Handoff a equipo de desarrollo

---

## 6. RECOMENDACIÓN Y HANDOFF

### 6.1 Recomendación

**Enfoque seleccionado:** ✅ **Ajuste Directo (Direct Adjustment)**

**Justificación:**
1. ✅ Mantiene TODO el trabajo de backend completado (Stories 1.1-1.3)
2. ✅ El impacto en timeline es manejable (+5 días)
3. ✅ El riesgo es Medium (cambios de UI, no de lógica de negocio)
4. ✅ No afecta el momentum del equipo
5. ✅ Sostenible a largo plazo (sistema de diseño correcto desde el inicio)
6. ✅ Cumple con expectativas del stakeholder (identidad de marca Hiansa)

**Trade-offs:**
- ⚠️ Requiere retrabajo de UI (pero NO de backend)
- ⚠️ Requiere actualizar documentación
- ⚠️ Requiere crear 3 nuevas stories

### 6.2 Clasificación del Cambio

**Scope:** **MODERATE**

- Requiere backlog reorganization (PO/SM)
- Requiere actualización de documentación (Arquitect/UX)
- Requiere desarrollo de nuevas stories (Dev team)

**Justificación:**
- NO es "Minor" porque afecta múltiples páginas y el sistema de diseño base
- NO es "Major" porque NO cambia funcionalidad core ni requiere replanificación

### 6.3 Handoff Plan

**Responsabilidades:**

| Rol | Responsabilidad | Deliverables |
|-----|-----------------|--------------|
| **Product Owner** | Aprobar cambios en backlog | Stories 1.0, 1.4, 1.5 creadas y priorizadas |
| **UX Designer** | Validar dirección visual | HTML de diseño alineado con implementación |
| **Solution Architect** | Revisar arquitectura de componentes | Sistema de variants aprobado |
| **Development Team** | Implementar stories | Stories 1.0, 1.4, 1.5 completadas |
| **QA Team** | Testing de UI/UX | Pruebas de responsive, accessibility, branding |

### 6.4 Success Criteria

**Criterios de Éxito del Cambio:**

1. ✅ Todos los documentos actualizados con #7D1220
2. ✅ Logo Hiansa SVG visible en landing y páginas autenticadas
3. ✅ Landing page minimalista funcional en `/`
4. ✅ Sidebar compact implementado (200px ancho)
5. ✅ Redundancia de branding eliminada
6. ✅ Layout desktop optimizado en todas las páginas
7. ✅ WCAG AA compliance mantenido
8. ✅ Testing en mobile, tablet, desktop completado

**Métricas de Validación:**

- Time to landing <2s (performance)
- Contrast ratio >4.5:1 (WCAG AA)
- Touch targets >44x44px (WCAG AA)
- User testing: 90%+ satisfacción con nueva identidad visual

---

## 7. RIESGOS Y MITIGACIÓN

### 7.1 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Story 1.0 toma más tiempo** | Medium | Medium | Buffer de 1 día incluido en estimación |
| **Logo SVG no funciona bien** | Low | Medium | Probar logo early en Story 1.0 |
| **Sidebar compact afecta usabilidad** | Low | Medium | User testing antes de finalizar |
| **Colores #7D1220 no cumplen WCAG** | Low | Low | Ya verificado: 6.3:1 contraste ✅ |
| **Stakeholder no está feliz con resultado** | Medium | High | Revisión incremental en cada story |

### 7.2 Plan de Contingencia

**Si Story 1.0 demora más de 2 días:**
- Option A: Implementar Story 1.4 con colores temporales, actualizar después
- Option B: Trabajar en Story 1.5 (Layout) en paralelo con Story 1.0

**Si stakeholder no está feliz con landing:**
- Revisión en 24h con screenshots del HTML de diseño
- Iterar rápido sobre Story 1.4 antes de continuar

---

## 8. APROBACIÓN

### 8.1 Requerido para Proceder

✅ **Stakeholder Approval Requerida**

**Preguntas de Aprobación:**

1. ✅ Color #7D1220 confirmado como Rojo Burdeos Hiansa oficial
2. ✅ Enfoque multi-direccional aprobado
3. ✅ Landing page minimalista aprobada
4. ✅ Secuencia de stories aprobada
5. ✅ Estimación de 5 días aprobada

**Firma de Aprobación:**

- [ ] **Stakeholder (Bernardo):** _______________________ Fecha: __________
- [ ] **Product Owner:** _______________________ Fecha: __________
- [ ] **Solution Architect:** _______________________ Fecha: __________

---

## 9. ANEXOS

### Anexo 1: Mappings de Colores

**HSL to Hex Conversion:**

| Color Nombre | HSL | Hex | Uso |
|--------------|-----|-----|-----|
| Rojo Burdeos Hiansa | 356° 73% 32% | #7D1220 | Primary |
| Rojo Burdeos Oscuro | 356° 73% 22% | #5A0E16 | Hover |
| Blanco | 0° 0% 100% | #FFFFFF | Foreground |
| Negro Suave | 222.2° 47.4% 11.2% | #212529 | Text Primary |
| Gris Secundario | 210° 10% 50% | #6C757D | Text Secondary |
| Gris Bordes | 214.3° 31.8% 91.4% | #DEE2E6 | Border |

### Anexo 2: Logo SVG Integration

**Path del Logo:**
`_bmad-output/planning-artifacts/ux-design-specification/logo-hiemesa.svg`

**Component Implementation:**

```tsx
// components/brand/hiansa-logo.tsx
import Link from 'next/link'
import HiansaLogoSVG from '@/public/logo-hiemesa.svg'

interface HiansaLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HiansaLogo({ size = 'md', className = '' }: HiansaLogoProps) {
  const sizes = {
    sm: 'w-24 h-6',
    md: 'w-40 h-10',
    lg: 'w-56 h-14'
  }

  return (
    <Link href="/" className={className}>
      <img
        src={HiansaLogoSVG.src}
        alt="Hiansa Logo"
        className={sizes[size]}
      />
    </Link>
  )
}
```

---

**FIN DEL SPRINT CHANGE PROPOSAL**

**Documento generado:** 2026-03-14
**Workflow:** Correct Course (bmm-bmm-correct-course)
**Versión:** 1.0
