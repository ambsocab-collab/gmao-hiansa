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
    /* Colores según PRD Design System */
    --background: 0 0% 100%; /* Blanco */
    --foreground: 222.2 84% 4.9%; /* Negro suave */

    --primary: 221.2 83.2% 53.3%; /* Azul Hiansa */
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%; /* Gris claro */
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%; /* Gris muy claro */
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%; /* Acento sutil */
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%; /* Rojo error */
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%; /* Borde sutil */
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem; /* 8px border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... modo oscuro si es necesario */
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
│       ├── app-header.tsx
│       ├── bottom-nav.tsx    # Móvil
│       ├── sidebar.tsx       # Desktop
│       └── main-content.tsx
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

**1. Customización de Colores (Según PRD Design System)**

**Colores Semánticos:**
- 🟢 Verde (#16a34a) - OT completada, stock OK
- 🟠 Naranja (#ea580c) - OT en progreso, stock bajo
- 🔴 Rojo (#dc2626) - OT vencida, stock crítico, error
- 🔵 Azul (#2563eb) - Accent principal (Hiansa blue)
- 🟣 Púrpura (#9333ea) - Mantenimiento reglamentario (Phase 1.5)

**Implementación en Tailwind:**

```javascript
// tailwind.config.js - extend colors
colors: {
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

**Ejemplo de Wrapper:**

```tsx
// components/button-variants.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PrimaryButton({ children, className, ...props }) {
  return (
    <Button
      className={cn("bg-blue-600 hover:bg-blue-700", className)}
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

**5.1 Kanban Board**
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

**10. Timeline Estimado**

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
