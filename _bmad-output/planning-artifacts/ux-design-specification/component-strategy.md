# Component Strategy

## Design System Components (shadcn/ui)

**Componentes Disponibles de shadcn/ui:**

shadcn/ui provee componentes accesibles basados en Radix UI y Tailwind CSS. Para gmao-hiansa utilizaremos:

**Foundation Components:**
- Button, Input, Textarea, Select: Para formularios (reportar avería, actualizaciones)
- Checkbox, Radio, Switch: Para filtros y configuraciones
- Label: Para accesibilidad en formularios

**Layout Components:**
- Card: Para agrupar contenido (KPIs, alertas)
- Separator: Para separación visual
- Tabs: Para navegación dentro de páginas
- Collapsible, Accordion: Para contenido expansible

**Navigation Components:**
- Navigation Menu: Para navegación principal
- Sidebar: Para navegación lateral (desktop)
- Breadcrumb: Para navegación jerárquica

**Feedback Components:**
- Toast: Para confirmaciones de acciones (✓/✗)
- Alert: Para alertas de stock crítico, errores
- Dialog/Modal: Para modales y confirmaciones
- Tooltip: Para información contextual
- Progress: Para loading states

**Data Display Components:**
- Table, Data Table: Para listas de OTs, stock, activos
- Badge: Para etiquetas de estado
- Avatar: Para usuarios con iniciales
- Calendar: Para fechas (rutinas, reportes)

**Form Components:**
- Form: Manejo de formularios con validación
- FormField: Para inputs con labels y errores

---

## Custom Components

### 1. OTCard (Tarjeta de Orden de Trabajo)

**Purpose:** Tarjeta compacta que muestra información esencial de una OT en el Kanban, permitiendo identificación rápida y acceso a detalles.

**Usage:** Kanban board de 8 columnas, dashboard de OTs asignadas

**States:**
- Default: Estado normal de la tarjeta
- Hover: Elevation shadow + cursor pointer
- Dragging: Opacidad reducida + shadow elevation
- Selected: Borde rojo burdeos sólido 2px
- Disabled: Opacidad 50% + cursor not-allowed

**Variants:**
- Compact: Para mobile (altura 80px)
- Default: Para tablet/desktop (altura 120px)
- Detailed: Para view de lista (altura 160px con más info)

**Accessibility:**
- role="button" + tabindex="0" para keyboard navigation
- aria-label: "OT #789: Prensa PH-500 no arranca, estado: En Progreso"
- Enter/Space para activar

**Interaction Behavior:**
- Click/tap: Abrir Modal ℹ️ con detalles completos
- Drag: Mover a otra columna (desktop)
- Long press: Mostrar menú de acciones rápidas (mobile)

---

### 2. KanbanBoard (Tablero Kanban)

**Purpose:** Tablero de 8 columnas para visualizar y gestionar OTs por estado con drag & drop.

**Usage:** Vista principal de Javier (supervisor), dashboard de María (técnica)

**States:**
- Default: Columnas visibles con OT cards
- Dragging: Columna destino destacada con borde punteado
- Filtered: Solo OTs que coinciden con filtros visibles
- Loading: Skeleton loaders en columnas

**Variants:**
- Desktop: 8 columnas completas
- Tablet: 2-3 columnas visibles con swipe horizontal
- Mobile: 1 columna con swipe + indicador "1/8"

**Accessibility:**
- role="region" + aria-label="Kanban de Órdenes de Trabajo"
- Columnas: role="listbox" + aria-label="[Estado]: [N] OTs"
- Keyboard: Arrow keys para navegar, Enter para seleccionar

**Interaction Behavior:**
- Drag & drop: Arrastrar OT card entre columnas
- Click columna: Filtrar para ver solo esa columna
- Click OT card: Abrir Modal ℹ️

---

### 3. AssetSearch (Búsqueda Predictiva de Activos)

**Purpose:** Autocomplete jerárquico para buscar activos con suggest inteligente y debouncing.

**Usage:** Reportar avería (Paso 1), buscar activos en gestión

**States:**
- Idle: Input vacío, placeholder visible
- Typing: Usuario escribe, spinner de loading
- Results: Lista de suggestions desplegada
- NoResults: "No se encontraron equipos"
- Selected: Suggestion seleccionada con highlight

**Variants:**
- Default: Con jerarquía completa
- Compact: Sin jerarquía (para mobile)

**Accessibility:**
- role="combobox" + aria-expanded
- aria-autocomplete="list"
- Arrow keys para navegar suggestions
- Enter para seleccionar, Esc para cerrar

**Interaction Behavior:**
- Debouncing: 300ms después del último keystroke
- Click suggestion: Autocompletar input + cerrar dropdown
- Enter: Seleccionar primera suggestion

---

### 4. KPICard (Tarjeta de KPI)

**Purpose:** Tarjeta compacta para mostrar KPI principal con trend indicator comparativo.

**Usage:** Dashboards de Elena (admin), Javier (supervisor)

**States:**
- Positive: Trend verde (mejora)
- Negative: Trend rojo (empeora)
- Neutral: Trend gris (sin cambio)
- Loading: Skeleton loader

**Variants:**
- Default: Con trend + meta
- Compact: Solo valor + trend (mobile)
- Detailed: Con sparkline mini-gráfico

**Accessibility:**
- role="figure" + aria-label="Mean Time To Repair: 4.2 horas, 15% mejor que el mes anterior"
- Trend icon con aria-label: "Disminución del 15%"

---

### 5. StatusBadge (Badge de Estado)

**Purpose:** Badge redundante con icono + color + texto para identificar estado de OT (WCAG AA compliance).

**Usage:** OT cards, listas de OTs, detalles de OT

**States (8 estados OT):**
- Por Revisar: Gray + icono ojo
- Por Aprobar: Amber + icono reloj
- Aprobada: Blue + icono check
- En Progreso: Purple + icono wrench
- Pausada: Pink + icono pause
- Completada: Green + icono check-double
- Cerrada: Gray + icono archive
- Cancelada: Red + icono x

**Variants:**
- Default: Icono + color + texto completo
- Compact: Icono + primera palabra (mobile)
- Dot: Solo círculo de color (para indicadores visuales)

**Accessibility:**
- role="status" + aria-label="Estado: En Progreso"
- Icono decorativo: aria-hidden="true"
- Contraste WCAG AA: 4.5:1 mínimo

---

### 6. ModalInfo (Modal ℹ️ de Detalles)

**Purpose:** Modal con detalles completos de OT sin perder contexto de la vista principal.

**Usage:** Kanban, listas de OTs, dashboard

**States:**
- Opening: Animation fade-in + scale
- Open: Contenido visible
- Loading: Skeleton loader mientras carga data
- Closing: Animation fade-out

**Accessibility:**
- role="dialog" + aria-modal="true"
- aria-labelledby: Título del modal
- Focus trap: Tab permanece dentro del modal
- Escape para cerrar

**Interaction Behavior:**
- Click fuera: Cerrar modal
- Escape: Cerrar modal
- Click [X]: Cerrar modal
- Click actions: Ejecutar acción sin cerrar

---

### 7. StockAlert (Alerta de Stock Crítico)

**Purpose:** Alerta prominente para ítems de stock por debajo del mínimo.

**Usage:** Dashboard de Pedro, notificaciones push

**States:**
- Critical: 🔴 Rojo (stock < mínimo)
- Warning: 🟡 Amarillo (stock cercano al mínimo, < 120%)
- Resolved: 🟢 Verde (reposición solicitada)

**Variants:**
- Card: Para dashboard
- Toast: Para notificación temporal
- Banner: Para alerta persistente en header

**Accessibility:**
- role="alert" + aria-live="polite"
- Icono con aria-label: "Alerta de stock crítico"

---

### 8. DivisionTag (Tag de División)

**Purpose:** Tag con color específico para identificar división (HiRock / Ultra).

**Usage:** OT cards, búsqueda de activos, listas

**States:**
- HiRock: Fondo amarillo/dorado (#FFD700), texto negro
- Ultra: Fondo verde salvia (#8FBC8F), texto negro
- Unknown: Fondo gris, texto negro

**Variants:**
- Default: Texto completo
- Compact: Iniciales (HR / UL)

**Accessibility:**
- role="status" + aria-label="División HiRock"
- Contraste WCAG AA: 4.5:1 mínimo

---

## Component Implementation Strategy

**Foundation Components (from shadcn/ui):**

Utilizamos componentes de shadcn/ui como base:
- Button, Input, Textarea, Select
- Card, Dialog, Toast, Alert
- Table, Badge, Avatar, Tabs
- Navigation Menu, Sidebar

**Custom Components Strategy:**

1. **Build on shadcn/ui primitives**: Usar Radix UI primitives como base
2. **Use design tokens**: Colores, tipografía, espaciado del sistema de diseño
3. **Follow shadcn/ui patterns**: Estructura de componentes, props, naming conventions
4. **Ensure accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Create reusable patterns**: Patrones consistentes para variantes, states, sizes

---

## Implementation Roadmap

**Phase 1 - Core Components (MVP Sprint 1-2):**

Componentes críticos para journeys más importantes:

1. **StatusBadge** - Necesario para todos los listados de OTs
2. **OTCard (Compact)** - Necesario para Kanban de 8 columnas
3. **AssetSearch** - Necesario para "Reportar avería en 30 segundos"
4. **KPICard (Default)** - Necesario para dashboards de Elena/Javier

**Target**: Soportar journeys de Carlos (reportar avería) y Javier (ver Kanban)

---

**Phase 2 - Supporting Components (MVP Sprint 3-4):**

Componentes que mejoran la experiencia:

5. **KanbanBoard (Desktop + Tablet)** - Necesario para control visual de Javier
6. **ModalInfo** - Necesario para detalles de OTs
7. **DivisionTag** - Necesario para identificación visual de activos
8. **StockAlert (Card + Toast)** - Necesario para gestión de stock de Pedro

**Target**: Soportar journeys completos de María, Javier, Pedro

---

**Phase 3 - Enhancement Components (Post-MVP):**

Componentes que optimizan UX:

9. **KPICard (Detailed with sparkline)** - Para análisis avanzado de Elena
10. **OTCard (Detailed variant)** - Para view de lista
11. **KanbanBoard (Mobile)** - Versión mobile-optimized con swipe
12. **AssetSearch (Compact)** - Para mobile

**Target**: Optimizar experiencias para todos los usuarios

