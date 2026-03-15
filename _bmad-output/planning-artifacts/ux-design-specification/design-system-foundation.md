# Design System Foundation

## Design System Choice

**shadcn/ui + Tailwind CSS** ⭐

Para **gmao-hiansa**, hemos seleccionado **shadcn/ui + Tailwind CSS** como base del sistema de diseño.

**Shadcn/ui** es una colección de componentes reutilizables construidos con Radix UI y Tailwind CSS, diseñados para ser copiados y pegados directamente en tu proyecto (no es una dependencia npm tradicional).

**Tailwind CSS** es un framework de utility-first CSS que permite construir interfaces personalizadas rapidamente sin abandonar tu HTML.

---

## Rationale for Selection

**1. Velocidad de Desarrollo**

**Problema:** gmao-hiansa necesita MVP rápido para transformar departamento reactivo a proactivo

**Solución:**
- shadcn/ui proporciona 50+ componentes pre-construidos (Button, Input, Card, Dialog, Dropdown Menu, etc.)
- Copiar/pegar código = No requiere configuración compleja
- Desarrollo de componentes directamente en tu codebase = Full control

**Resultado:** Timeline de desarrollo reducido en 40-60% vs construir componentes desde cero

---

**2. Profesionalismo sin "Look Genérico"**

**Problema:** gmao-hiansa no puede parecer "otro template más"

**Solución:**
- shadcn/ui no tiene "look" predeterminado, son componentes base
- Tailwind CSS permite diseño visual único con utility classes
- Customización total de colores, tipografía, espaciado, bordes, sombras

**Resultado:** gmao-hiansa tendrá identidad visual única sin parecer "shadcn/ui default"

---

**3. WCAG AA Compliance Out-of-the-Box**

**Problema:** Ambiente industrial con iluminación variable requiere accesibilidad no-negotiable

**Solución:**
- Radix UI primitives (base de shadcn/ui) = WCAG 2.1 AA compliant por defecto
- Keyboard navigation (Tab, Enter, Esc) en todos los componentes interactivos
- ARIA attributes incluidos en todos los componentes
- Focus management automático

**Resultado:** gmao-hiansa será accesible sin inversión adicional en testing de accesibilidad

---

**4. React-First y Moderno**

**Problema:** gmao-hiansa es una PWA moderna en React

**Solución:**
- shadcn/ui construido específicamente para React (hooks, context, composition)
- Server Components compatible (Next.js 13+)
- TypeScript support incluido
- Integración perfecta con React ecosystem (React Hook Form, Zod, etc.)

**Resultado:** Desarrollo moderno con mejores prácticas de React

---

**5. Comunidad Activa y Documentación Excelente**

**Problema:** Equipo pequeño necesita soporte y recursos

**Solución:**
- Documentación clara con ejemplos de código
- Comunidad creciendo rápidamente (50K+ GitHub stars, 2024)
- Integraciones probadas con React ecosystem (TanStack Table, React Hook Form, etc.)
- Actualizaciones frecuentes con nuevas funcionalidades

**Resultado:** Soporte garantizado a largo plazo

---

**6. Performance Optimizado**

**Problema:** gmao-hiansa requiere carga <2s en dashboard KPIs

**Solución:**
- Tailwind CSS = CSS optimizado con PurgeCSS automático (solo CSS usado en producción)
- Shadcn/ui components = No runtime overhead (copiados a tu codebase)
- Tree-shaking friendly = Bundle size mínimo
- Lazy loading compatible = Carga bajo demanda

**Resultado:** gmao-hiansa cargará rápido incluso en conexiones industriales

---

## Implementation Approach

**Fase 1: Setup Inicial (1-2 días)**

**1.1 Instalación de Dependencias**

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Instalar shadcn/ui CLI
npx shadcn-ui@latest init

# Instalar dependencias de shadcn/ui
npm install class-variance-authority clsx tailwind-merge
```

**1.2 Configuración de Tailwind CSS**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... más colores según PRD design system
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**1.3 Configuración de Design Tokens**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colores según Story 1.0: Sistema de Diseño Multi-Direccional */
    --background: 0 0% 100%; /* Blanco */
    --foreground: 222.2 84% 4.9%; /* Negro suave */

    --primary: 356 73% 32%; /* #7D1220 Rojo Burdeos Hiansa (Story 1.0) */
    --primary-foreground: 0 0% 100%; /* Blanco */

    --secondary: 210 40% 96.1%; /* Gris claro */
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%; /* Gris muy claro */
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 356 73% 37%; /* Rojo Burdeos ligeramente más claro */
    --accent-foreground: 0 0% 100%; /* Blanco */

    --destructive: 0 84.2% 60.2%; /* Rojo error */
    --destructive-foreground: 210 40% 98%;

    --border: 210 8% 89%; /* Borde #DEE2E6 */
    --input: 214.3 31.8% 91.4%;
    --ring: 356 73% 32%; /* #7D1220 para focus states */

    --radius: 0.5rem; /* 8px border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 356 73% 32%; /* #7D1220 también en dark mode */
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... resto de modo oscuro */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

**Fase 2: Componentes Base (3-5 días)**

**2.1 Instalar Componentes shadcn/ui Necesarios**

```bash
# Componentes core
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
```

**2.2 Estructura de Componentes**

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui (copiados)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── kanban/               # Componentes custom de Kanban
│   │   ├── kanban-board.tsx
│   │   ├── kanban-column.tsx
│   │   ├── kanban-card.tsx
│   │   └── kanban-drag-drop.tsx
│   ├── search/               # Componentes de búsqueda predictiva
│   │   ├── search-predictive.tsx
│   │   ├── search-suggestions.tsx
│   │   └── search-highlighting.tsx
│   ├── dashboard/            # Componentes de dashboard KPIs
│   │   ├── dashboard-kpi-card.tsx
│   │   ├── dashboard-chart.tsx
│   │   └── dashboard-drill-down.tsx
│   └── layout/               # Componentes de layout
│       ├── sidebar.tsx       # Desktop - 3 variantes (default/compact/mini)
│       ├── app-header.tsx
│       ├── bottom-nav.tsx    # Móvil
│       └── main-content.tsx
│   └── brand/                # Story 1.0: Componentes de marca
│       └── hiansa-logo.tsx   # Logo SVG con size variants (sm/md/lg)
```

---

**Fase 3: Custom Components (5-10 días)**

**3.1 Kanban Board Custom**

- **Basado en:** @dnd-kit/core (drag-and-drop)
- **Componentes shadcn/ui utilizados:** Card, Button, Badge, Avatar, Dialog
- **Customización:**
  - 8 columnas responsive (Desktop 8, Tablet 2, Móvil 1)
  - Drag-and-drop con visual feedback
  - Swipe gestures para móvil
  - Código de colores según tipo de OT

**3.2 Search Predictive Custom**

- **Basado en:** CMDK (command palette) + Debounce
- **Componentes shadcn/ui utilizados:** Input, Popover, Command
- **Customización:**
  - Autocomplete jerárquico (Planta → Línea → Equipo)
  - Highlighting de término buscado
  - Suggestions con contexto (ubicación, estado, historial)
  - Debouncing 300ms + caché

**3.3 Dashboard KPIs Custom**

- **Basado en:** Recharts (gráficos) + TanStack Table (tablas)
- **Componentes shadcn/ui utilizados:** Card, Button, Select, Badge
- **Customización:**
  - KPIs con trending icons (⬆️ verde, ⬇️ rojo)
  - Drill-down interactivo (Global → Planta → Línea → Equipo)
  - Exportar a Excel
  - Actualización real-time (WebSockets)

---

## Customization Strategy

**1. Customización de Colores (Story 1.0 + PRD Design System)**

**Colores de Marca (Story 1.0):**
- 🔴 Rojo Burdeos Hiansa (#7D1220) - Color primario, HSL: 356° 73% 32%
- 🎨 Accent (#7D1220 con 37% lightness) - Para hover states
- ✅ WCAG AA Compliance: Blanco sobre #7D1220 = 6.3:1

**Colores Semánticos (PRD):**
- 🟢 Verde (#16a34a) - OT completada, stock OK
- 🟠 Naranja (#ea580c) - OT en progreso, stock bajo
- 🔴 Rojo (#dc2626) - OT vencida, stock crítico, error
- 🟣 Púrpura (#9333ea) - Mantenimiento reglamentario (Phase 1.5)

**Implementación en Tailwind (Story 1.0):**

```javascript
// tailwind.config.js - extend colors
colors: {
  primary: {
    DEFAULT: '#7D1220',      // Rojo Burdeos Hiansa
    hover: '#5A0E16',        // Rojo Burdeos Oscuro
    foreground: '#FFFFFF',   // Blanco
  },
  accent: {
    DEFAULT: 'hsl(356, 73%, 37%)', // Rojo Burdeos ligeramente más claro
    foreground: '#FFFFFF',
  },
  ot: {
    completed: '#16a34a',    // Verde
    inProgress: '#ea580c',   // Naranja
    overdue: '#dc2626',      // Rojo
    preventive: '#22c55e',   // Verde claro
    corrective: '#dc2626',   // Rojo oscuro
    external: '#2563eb',     // Azul
    internal: '#f97316',     // Naranja oscuro
    reglamentary: '#9333ea', // Púrpura
  }
}
```

---

**2. Customización de Tipografía**

**Tipografía Base (según PRD):**
- Font family: Inter (Google Fonts)
- Font size base: 16px (desktop), 14px (tablet), 16px (móvil)
- Line height: 1.5 (WCAG AA compliance)
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Implementación en Tailwind:**

```javascript
// tailwind.config.js - extend fontFamily
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'], // Para datos técnicos
}
```

---

**3. Customización de Espaciado**

**Espaciado Base (8px grid system):**
- 4px = 0.25rem (muy pequeño)
- 8px = 0.5rem (pequeño)
- 12px = 0.75rem (medio-pequeño)
- 16px = 1rem (medio - default)
- 24px = 1.5rem (grande)
- 32px = 2rem (muy grande)

**Implementación:**
- Tailwind ya incluye spacing scale basado en 4px
- No requiere customización

---

**4. Customización de Componentes Shadcn/UI**

**Estrategia:**
- No modificar componentes `src/components/ui/*` directamente
- Crear wrapper components con variantes específicas de gmao-hiansa
- Ejemplo: `Button` de shadcn/ui → `PrimaryButton`, `SecondaryButton`, `DestructiveButton`

**Ejemplo de Wrapper (Story 1.0: Hiansa Red):**

```tsx
// components/button-variants.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PrimaryButton({ children, className, ...props }) {
  return (
    <Button
      className={cn("bg-primary hover:bg-primary-hover text-primary-foreground", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export function DestructiveButton({ children, className, ...props }) {
  return (
    <Button
      variant="destructive"
      className={cn("bg-red-600 hover:bg-red-700", className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

---

**5. Componentes 100% Custom (No en shadcn/ui)**

**5.1 HiansaLogo (Story 1.0: Sistema de Diseño Multi-Direccional)**
- Razón: Logo SVG oficial de Hiansa con identidad de marca #7D1220
- Stack: SVG inline + React component
- Customización: 3 size variants (sm: 96x24px, md: 160x40px, lg: 224x56px)
- Ubicación: `_bmad-output/planning-artifacts/ux-design-specification/logo-hiemesa.svg`
- Accessibility: aria-label="Hiansa Logo", role="img", viewBox="0 0 164 41"

**5.2 Sidebar con 3 Variantes (Story 1.0: Sistema Multi-Direccional)**
- Razón: Diseño adaptativo para 3 direcciones UX de GMAO
- Stack: React component + Tailwind CSS + Navigation PBAC (Story 1.2)
- Variantes:
  - Default: 256px (w-64) for Dashboard clásico (Dirección 1)
  - Compact: 200px (w-52) for Kanban First (Dirección 2)
  - Mini: 160px (w-40) for Data Heavy (Dirección 4)
- Branding: Logo Hiansa + texto "GMAO" (sin "Hiansa" duplicado)
- Footer: "powered by hiansa BSC" (sin repetición)
- Responsive: Hidden en móvil (<768px), visible en desktop (md:flex)

**5.3 Kanban Board**
- Razón: Requerimiento crítico de gmao-hiansa, no existe en shadcn/ui
- Stack: @dnd-kit/core + shadcn/ui Card + Badge + Avatar
- Customización: 8 columnas, código de colores, drag-and-drop, swipe gestures

**5.2 Search Predictive**
- Razón: Búsqueda <200ms con autocomplete jerárquico es crítico
- Stack: CMDK + Debounce + shadcn/ui Input + Popover
- Customización: Suggestions con contexto, highlighting, caché

**5.3 Timeline de OT**
- Razón: Componente específico de gmao-hiansa para modal ℹ️
- Stack: shadcn/ui Card + Badge + Avatar
- Customización: Timeline vertical con iconos de estado, fechas, usuarios

**5.4 Bottom Navigation (Móvil)**
- Razón: shadcn/ui tiene Navigation Menu pero no Bottom Nav específico
- Stack: shadcn/ui Button + Badge
- Customización: 5 items, touch targets 44x44px, badges de notificaciones

---

**6. Responsiveness Strategy**

**Breakpoints (según PRD):**
- Móvil: <768px (1 columna Kanban, bottom nav)
- Tablet: 768-1200px (2 columnas Kanban, nav simplificada)
- Desktop: >1200px (8 columnas Kanban, nav lateral)

**Implementación en Tailwind:**

```tsx
// Ejemplo de componente responsive
<div className="
  grid grid-cols-1                    /* Móvil: 1 columna */
  md:grid-cols-2                     /* Tablet: 2 columnas */
  lg:grid-cols-4 xl:grid-cols-8      /* Desktop: 8 columnas */
  gap-4                              /* Espaciado entre columnas */
">
  {/* Kanban columns */}
</div>
```

---

**7. Accessibility Strategy**

**WCAG AA Compliance (no-negotiable):**

- **Contraste mínimo 4.5:1** (texto normal sobre fondo)
  - Shadcn/ui + Radix UI = Cumple por defecto
  - Validar con: axe DevTools + Lighthouse

- **Touch targets mínimos 44x44px** (WCAG AA)
  - Shadcn/ui Button = Cumple por defecto
  - Custom components = Aplicar `min-h-[44px] min-w-[44px]`

- **Keyboard navigation (Tab, Enter, Esc)**
  - Shadcn/ui + Radix UI = Cumple por defecto
  - Testing: Navegar toda la app sin mouse

- **Semantic HTML**
  - Shadcn/ui usa elementos semánticos (`<button>`, `<input>`, etc.)
  - Validar con: WAVE browser extension

---

**8. Performance Optimization**

**Estrategia:**

- **PurgeCSS automático** (Tailwind CSS)
  - Solo CSS usado en producción
  - Bundle size reducido de 200KB+ a ~10KB

- **Tree-shaking** (shadcn/ui)
  - Solo componentes utilizados en bundle
  - No overhead de librería completa

- **Code splitting**
  - Carga de componentes bajo demanda (React.lazy)
  - Ejemplo: Dashboard KPIs solo se carga cuando se accede

- **Lazy loading de imágenes**
  - `next/image` (si Next.js) o `lqip` (low quality image placeholder)
  - Placeholder borroso → Imagen completa

---

**9. Maintenance Strategy**

**Actualizaciones:**

- **Shadcn/ui:** Copiar nuevos componentes cuando se necesiten
- **Tailwind CSS:** Actualizar vía npm (breaking changes raros)
- **Custom components:** Mantener en `src/components/` con tests

**Documentación:**

- Storybook para documentar componentes custom (Kanban, Search, Timeline)
- Componentes shadcn/ui = Documentación oficial
- Tailwind CSS = Documentación oficial

---

**10. Multi-Directional Design System (Story 1.0)**

**Concepto:**

GMAO Hiansa implementa un sistema de diseño multi-direccional que permite a cada página usar el layout óptimo según su caso de uso específico. En lugar de un layout único para toda la aplicación, cada dirección (página/contexto) utiliza la variante de sidebar y patrón de layout más apropiado.

**6 Direcciones de Diseño:**

| Dirección | Página/Contexto | Características | Sidebar Variant | Layout Pattern |
|-----------|-----------------|----------------|-----------------|----------------|
| **Dir 1: Dashboard Clásico** | `/dashboard` | Sidebar fijo, KPIs prominentes, layout enterprise | `default` (256px) | Sidebar + main content con ml-64 |
| **Dir 2: Kanban First** | `/kanban` | Kanban 8 columnas protagonista, panel KPIs lateral | `compact` (200px) | Sidebar compact + kanban ancho |
| **Dir 3: Mobile First** | Todas en móvil (<768px) | Touch targets grandes, bottom nav, gestos swipe | `none` (bottom nav) | Bottom navigation + contenido full width |
| **Dir 4: Data Heavy** | `/kpis`, `/analytics` | Múltiples gráficos, tablas densas, drill-down | `mini` (160px) | Sidebar mini + contenido muy ancho |
| **Dir 5: Minimal** | `/` (landing) | Mucho whitespace, elementos reducidos, minimalista | `none` (top nav) | Top nav minimal + contenido centrado |
| **Dir 6: Action Oriented** | `/reportar`, acciones rápidas | CTAs prominentes, flujos simplificados | `default` (256px) | Sidebar + form centrado |

**Sistema de Variants para Sidebar:**

```typescript
// Component: components/layout/sidebar.tsx
interface SidebarProps {
  variant?: 'default' | 'compact' | 'mini'
  userCapabilities?: string[]
  className?: string
}

const variantWidths = {
  default: 'w-64',   // 256px - Dashboard clásico
  compact: 'w-52',   // 200px - Kanban First
  mini: 'w-40'       // 160px - Data Heavy
}
```

**Ejemplos de Implementación por Dirección:**

```typescript
// Dirección 1: Dashboard Clásico
<Sidebar variant="default" direction="classic" userCapabilities={userCapabilities} />
<main className="ml-64"> {/* 256px sidebar */}
  {/* KPIs, charts, etc */}
</main>

// Dirección 2: Kanban First
<Sidebar variant="compact" direction="kanban" userCapabilities={userCapabilities} />
<main className="ml-52"> {/* 200px sidebar */}
  <KanbanBoard columns={8} />
</main>

// Dirección 3: Mobile First (bottom nav)
<BottomNav /> {/* NO sidebar */}
<main className="pb-16"> {/* Padding for bottom nav */}
  {/* Mobile-optimized content */}
</main>

// Dirección 4: Data Heavy
<Sidebar variant="mini" direction="data" userCapabilities={userCapabilities} />
<main className="ml-40"> {/* 160px sidebar */}
  <DataTable dense />
  <AnalyticsCharts />
</main>

// Dirección 5: Minimal
<TopNav minimal /> {/* NO sidebar */}
<main className="max-w-7xl mx-auto">
  {/* Landing page content */}
</main>

// Dirección 6: Action Oriented
<Sidebar variant="default" direction="action" userCapabilities={userCapabilities} />
<main className="ml-64 flex items-center justify-center">
  <ReportFailureForm />
</main>
```

**Responsive Behavior:**

```typescript
// Sidebar component: hidden en móvil, visible en desktop
<aside className={`
  ${widthClass}
  hidden      /* <768px: oculto */
  md:flex     /* ≥768px: visible */
  flex-col
  bg-background
  h-screen
  sticky top-0
`}>
```

**Componentes Shadcn/UI con Variants por Dirección:**

La mayoría de componentes shadcn/ui funcionan sin modificaciones mediante el uso de tokens CSS:

- `Button` - Usa color `primary` (#7D1220) automáticamente
- `Input`, `Select` - Usa `ring` color para focus states
- `Card` - Adaptable a cualquier layout width
- `Badge` - Útil para estados OT en Kanban
- `Avatar` - User profiles en sidebar

**Layout Strategy por Dirección:**

1. **Dashboard Clásico (Dir 1):** Grid 3 columnas para KPIs, charts ancho completo
2. **Kanban First (Dir 2):** Grid 8 columnas horizontal scroll, cards drag-drop
3. **Mobile First (Dir 3):** Single column stack, bottom nav fixed, touch targets ≥44px
4. **Data Heavy (Dir 4):** Tables densas con sorting/filtering, gráficos interactivos
5. **Minimal (Dir 5):** Centered max-width container, generous whitespace
6. **Action Oriented (Dir 6):** Form centrado, CTAs prominentes, validación en tiempo real

**Brand Integration:**

Todas las direcciones comparten:
- Logo Hiansa SVG (#7D1220) en sidebar/top nav
- Brand name "GMAO" (sin "Hiansa" duplicado)
- Footer: "powered by hiansa BSC"
- Primary color: #7D1220 (Rojo Burdeos)
- Font: Inter (system UI stack)

---

**11. Timeline Estimado**

- **Fase 1: Setup Inicial:** 1-2 días
- **Fase 2: Componentes Base:** 3-5 días
- **Fase 3: Custom Components:** 5-10 días
- **Fase 4: Testing y Refinamiento:** 3-5 días

**Total:** 12-22 días (3-4 semanas) para sistema de diseño completo + componentes MVP

---

**Conclusión:**

shadcn/ui + Tailwind CSS proporciona el balance perfecto entre **velocidad de desarrollo** y **profesionalismo visual** para gmao-hiansa.

**Ventajas clave:**
- WCAG AA compliance out-of-the-box (crítico para ambiente industrial)
- Customización total (no look genérico)
- Comunidad activa (soporte garantizado)
- Performance optimizado (carga <2s en dashboard KPIs)

**Próximo paso:**
Definir la experiencia core (user flows, información arquitectura, wireframes)
