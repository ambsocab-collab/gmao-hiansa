# UX Consistency Patterns

## Button Hierarchy

**When to Use:**
- **Primary Buttons**: Acciones principales y destructivas (ej: "Reportar Avería", "Eliminar")
- **Secondary Buttons**: Acciones alternativas (ej: "Cancelar", "Ver más")
- **Ghost Buttons**: Acciones terciarias y links (ej: "Cerrar", "Omitir")

**Visual Design:**

Primary (Rojo Burdeos #7D1220):
- Text: White, 16px Semibold
- Padding: 12px (top/bottom), 16px (left/right)
- Height: 44px minimum (touch target)
- Radius: 8px (rounded-lg)

Secondary (Outline Gris):
- Text: Gray-900, 16px Semibold
- Border: 2px solid Gray-300
- Background: White
- Height: 44px minimum

Ghost (Sin fondo):
- Text: Maroon #7D1220, 16px Medium
- Hover: Subrayado

**Behavior:**
- **Primary**: Click → Ejecuta acción, muestra loading state si es async
- **Secondary**: Click → Acción alternativa o cancelar operación
- **Ghost**: Click → Navegación o acción no-destructiva

**Accessibility:**
- `role="button"` + `tabindex="0"` para elementos no-button
- Focus visible: 2px solid #7D1220, offset 2px
- ARIA labels si el texto no es descriptivo
- Enter/Space para activar

**Mobile Considerations:**
- Mínimo 44x44px para touch targets
- Mayor padding en mobile (16px top/bottom)
- Botones full-width en formularios móviles

**Variants:**
- **Primary Disabled**: Opacidad 50%, cursor not-allowed
- **Primary Loading**: Spinner reemplaza texto o se muestra a la derecha
- **Danger**: Primary button con rojo #EF4444 para acciones destructivas
- **Icon Button**: Solo icono para acciones comunes (ej: ℹ️, ⋯, ✕)

---

## Feedback Patterns

**When to Use:**
- **Success**: Confirmación de acción completada exitosamente
- **Error**: Acción falló
- **Warning**: Requiere atención pero no bloquea
- **Info**: Información contextual

**Visual Design:**

**Toast (Temporal, 5 segundos):**

Success (Verde):
- Background: Green-50
- Border-left: 4px solid Green-500
- Icon: ✓ Green-600
- Text: Green-900

Error (Rojo):
- Background: Red-50
- Border-left: 4px solid Red-500
- Icon: ✗ Red-600
- Text: Red-900

Warning (Ámbar):
- Background: Amber-50
- Border-left: 4px solid Amber-500
- Icon: ⚠️ Amber-600
- Text: Amber-900

**Alert (Persistente hasta dismiss):**
- Full-width banner
- Background: Red-100
- Dismissible con botón

**Behavior:**
- **Toast**: Auto-dismiss después de 5 segundos, click en ✕ para cerrar manual
- **Alert**: Persistente hasta que usuario toma acción o descarta
- **Stacking**: Múltiples toasts se apilan verticalmente (máximo 3 visibles)

**Accessibility:**
- Toast: `role="status"` + `aria-live="polite"`
- Alert: `role="alert"` + `aria-live="assertive"`
- Iconos decorativos: `aria-hidden="true"`
- Focus management: Toast no roba focus

**Mobile Considerations:**
- Toast: Full-width en mobile con padding reducido
- Alert: Stack horizontal si son múltiples (swipeable)
- Touch target mínimo 44x44px para botones de acción

---

## Form Patterns

**When to Use:**
- **Crear/Editar**: Formularios para crear/editar entidades
- **Buscar**: Inputs de búsqueda con autocomplete
- **Filtrar**: Controles de filtro en listas

**Visual Design:**

**Form Layout:**
- Title: "Reportar Avería"
- Separator: Divisor visual
- Required fields: Asterisco (*)

**Validation States:**

Valid (Default):
- Border: Gray-300
- ✓ Icon right (optional)

Invalid:
- Border: Red-500
- Error message below
- ✗ Icon

Validating:
- Spinner icon
- Border: Blue-500

**Behavior:**
- **Validation On Blur**: Validar cuando usuario sale del campo
- **Inline Errors**: Mostrar errores debajo del campo afectado
- **Success Indicators**: ✓ opcional cuando campo es válido
- **Required Fields**: Asterisco (*) + mensaje "Todos los campos con * son obligatorios"

**Accessibility:**
- `aria-required="true"` para campos requeridos
- `aria-invalid="true"` + `aria-describedby` para errores
- Labels asociados con `for` attribute
- Error messages: `role="alert"`
- Focus en primer campo al cargar formulario

**Mobile Considerations:**
- Inputs con height 44px mínimo
- Labels encima de inputs (no a la izquierda)
- Numeric inputs con tipo="tel"
- Select con native pickers

---

## Navigation Patterns

**When to Use:**
- **Principal (Desktop)**: Sidebar con navegación principal
- **Principal (Mobile)**: Bottom tabs para acceso rápido
- **Contextual**: Breadcrumbs para navegación jerárquica
- **Filters**: Tabs para filtros en listas

**Visual Design:**

**Desktop Sidebar:**
- Logo + title en header
- Active item: Maroon bg, white text
- Icons + labels para cada item

**Mobile Bottom Tabs:**
- 4 tabs máximo, icons + labels
- Active: Maroon text
- Fixed position bottom

**Breadcrumbs:**
- Format: "Dashboard > Kanban > OT #789"
- Click en cualquier breadcrumb → Navegar a ese nivel

**Behavior:**
- **Active State**: Item actual destacado visualmente
- **Collapse**: Sidebar colapsable a icon-only
- **Hamburger**: Menú hamburguesa en mobile

**Accessibility:**
- `role="navigation"` + `aria-label="Navegación principal"`
- Links: `aria-current="page"` para página actual
- Toggle button con `aria-expanded`

**Mobile Considerations:**
- Bottom tabs: 4 tabs máximo
- Hamburger menu: Para secondary navigation
- Back button: Navigation bar para back

---

## Modal and Overlay Patterns

**When to Use:**
- **Modal ℹ️**: Detalles de OT sin perder contexto
- **Confirm Dialog**: Confirmar acciones destructivas
- **Form Modal**: Formularios contextuales

**Visual Design:**

**Modal ℹ️ (Detalles de OT):**
- Header: [✕] + título + [⋯] (actions)
- Content: Scrollable con timeline, info equipo, repuestos
- Footer: Actions (opcional)
- Backdrop overlay (click outside → close)

**Confirm Dialog:**
- Warning icon + título claro
- Mensaje explicativo
- Warning text (opcional)
- Secondary + Danger buttons

**Behavior:**
- **Open**: Animation fade-in + scale (200-300ms)
- **Close**: Animation fade-out (200-300ms)
- **Focus Trap**: Tab permanece dentro del modal
- **Escape Key**: Cierra modal (no confirm dialogs)
- **Click Outside**: Cierra modal (excepto confirm dialogs)

**Accessibility:**
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby`: ID del título
- Focus en primer elemento al abrir
- Return focus al trigger al cerrar
- `aria-hidden="true"` en backdrop

**Mobile Considerations:**
- Modal width: 95% en mobile (vs 600px max-width desktop)
- Bottom sheet: Slide-up para formularios
- Full-screen: Modales complejos en mobile

---

## Empty States and Loading States

**When to Use:**
- **Empty State**: Lista o dashboard sin contenido
- **Loading State**: Cargando contenido asíncrono
- **Error State**: Error al cargar contenido

**Visual Design:**

**Empty State:**
- Large icon (64px)
- Headline claro
- Description explicativa
- Action button (opcional)

**Loading State (Skeleton):**
- Skeleton cards con shimmer animation
- Minimum 500ms para evitar flicker

**Error State:**
- Error icon
- Headline descriptivo
- Explanation del error
- Action buttons (Reintentar, Volver)

**Behavior:**
- **Empty State**: Mostrar cuando lista está vacía
- **Loading State**: Mostrar skeleton mientras carga
- **Error State**: Mostrar cuando load falla

**Accessibility:**
- `role="status"` para empty/loading states
- `aria-live="polite"` para error states
- `aria-busy="true"` para loading containers

**Mobile Considerations:**
- Empty state: Icon más pequeño (48px) en mobile
- Error state: Botones full-width en mobile

---

## Search and Filtering Patterns

**When to Use:**
- **Search**: Búsqueda global o en lista específica
- **Filter**: Filtrar resultados por atributos
- **Sort**: Ordenar resultados

**Visual Design:**

**Search Bar:**
- Icon + input con placeholder
- Autocomplete dropdown con suggestions

**Filter Bar:**
- Select dropdowns para filtros
- "Limpiar" button para reset
- Count de resultados

**Active Filters (Chips):**
- Chips horizontales con [✕] para remover
- "Limpiar todo" button

**Behavior:**
- **Search**: Debouncing de 300ms
- **Autocomplete**: Mostrar después de 2 caracteres
- **Filter**: Aplicar en tiempo real
- **Sort**: Selector dropdown

**Accessibility:**
- Search: `role="search"` + `aria-label`
- Filters: `aria-label="Filtrar por [atributo]"`
- Active filters: `aria-label="[Filtro] - Click para remover"`

**Mobile Considerations:**
- Search: Input siempre visible
- Filters: Bottom sheet con swipe-up
- Active filters: Chips horizontal scrollable

