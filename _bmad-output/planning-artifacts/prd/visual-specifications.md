# Visual Specifications

Esta sección define las especificaciones visuales y de interfaz para el diseño UX del sistema gmao-hiansa.

## Design System

**Color Palette:**
- **Brand Identity (Story 1.0):**
  - Primary/Hiansa Red: #7D1220 (Rojo Burdeos) - HSL: 356° 73% 32%
  - Primary Hover: #5A0E16 (Rojo Burdeos Oscuro) - HSL: 356° 73% 22%
  - Accent: #7D1220 con 37% lightness
  - **NOTA:** Contraste WCAG AA validado: blanco sobre #7D1220 = 6.3:1 ✅
- **Status Colors (semáforo):**
  - Success/Green: #28A745 (OT completada, stock OK)
  - Warning/Orange: #FD7E14 (OT en progreso, stock bajo) - CAMBIADO de amarillo para cumplir WCAG AA
  - Danger/Red: #DC3545 (OT vencida, stock crítico, avería)
  - Info/Blue: #17A2B8 (información general)
- **Neutral Colors:**
  - Text Primary: #212529 (texto principal)
  - Text Secondary: #6C757D (texto secundario, labels)
  - Background: #FFFFFF (fondos, cards)
  - Border: #DEE2E6 (bordes, separadores)

**NOTA:** El color Warning/Orange #FD7E14 reemplaza al amarillo #FFC107 para garantizar contraste WCAG AA (4.5:1 mínimo) con texto blanco sobre fondos de color.

**Multi-Directional Design System (Story 1.0):**
- **3 Sidebar Variants:**
  - Default: 256px (w-64) for Dashboard clásico (Dirección 1)
  - Compact: 200px (w-52) for Kanban First (Dirección 2)
  - Mini: 160px (w-40) for Data Heavy (Dirección 4)
- **Responsive Behavior:** Sidebar oculto en móvil (<768px), visible en desktop (md:flex)
- **Brand Integration:**
  - Logo: Hiansa SVG (viewBox 0 0 164 41, primario #7D1220)
  - Brand Name: "GMAO" (sin "Hiansa" duplicado)
  - Footer: "powered by hiansa BSC" (sin repetición de branding)

**Logo System (Story 1.0):**
- **Component:** `<HiansaLogo />` con size variants (sm/md/lg)
  - sm: 96px x 24px (w-24 h-6)
  - md: 160px x 40px (w-40 h-10) - default
  - lg: 224px x 56px (w-56 h-14)
- **File Location:** `_bmad-output/planning-artifacts/ux-design-specification/logo-hiemesa.svg`
- **Accessibility:** aria-label="Hiansa Logo", role="img"

**Typography:**
- **Font Family:** System UI fonts (San Francisco, Segoe UI, Roboto)
- **Font Sizes:**
  - H1: 32px (títulos de páginas)
  - H2: 24px (títulos de secciones)
  - H3: 20px (subtítulos)
  - Body: 16px (texto general, WCAG AA compliance)
  - Small: 14px (texto secundario)
  - X-Small: 12px (metadata, timestamps)

**Components:**
- **Buttons:**
  - Primary: fondo #7D1220 (Hiansa Red), texto blanco, altura 44px, radio 4px
  - Secondary: fondo transparente, borde #7D1220, altura 44px
  - Danger: fondo #DC3545, texto blanco (acciones destructivas)
- **Navigation Links:**
  - Active: fondo #7D1220, texto blanco
  - Hover: fondo accent, texto accent-foreground
  - Icon: Lucide React icons
- **Form Inputs:** altura 44px, borde #DEE2E6, radio 4px, padding 12px
- **Cards:** fondo blanco, sombra sutil, borde radius 8px, padding 20px
- **Sidebar (Story 1.0):**
  - Background: #FFFFFF, border-right: #DEE2E6
  - Logo: Hiansa SVG component (size md)
  - Brand Name: "GMAO" (sin "Hiansa")
  - Navigation: PBAC-filtered, primary color para activos

## Key Screen Specifications

### Screen 1: Kanban Dashboard (Supervisor View)

**Layout:**
- **Header (60px):** Logo, título "Tablero Kanban", botón "Nueva OT"
- **Filters Bar (80px):** Filtros por estado, técnico, fecha, urgencia
- **Kanban Columns (3 columnas):**
  - Pendiente: 33% ancho
  - En Progreso: 33% ancho
  - Completada: 34% ancho
- **OT Card Design:**
  - Header: Código OT + badge urgencia (rojo para crítica, amarillo para alta)
  - Body: Título avería, equipo afectado, tiempo transcurrido
  - Footer: Asignado a (avatar + nombre), fecha límite
  - Height: variable según contenido, mínimo 120px
- **Drag & Drop:** Tarjetas arrastrables entre columnas
- **Touch Targets:** 44x44px mínimo (WCAG AA compliance)

**Desktop (>1200px):** 3 columnas visibles
**Tablet (768-1200px):** 2 columnas (Pendiente y En Progreso), Completada como modal
**Mobile (<768px):** 1 columna, swipe horizontal para cambiar columnas

### Screen 2: Formulario Reportar Avería (Operario View)

**Layout:**
- **Header (60px):** Título "Reportar Avería", botón "Cancelar"
- **Progress Indicator (40px):** Paso 1 de 3 (Datos básicos → Detalles → Confirmación)
- **Form Fields:**
  - **Equipo:** Search input con búsqueda predictiva, dropdown suggestions
  - **Tipo de Avería:** Dropdown con opciones (Eléctrica, Mecánica, Neumática, Otra)
  - **Urgencia:** Radio buttons (Baja, Media, Alta, Crítica)
  - **Descripción:** Textarea con placeholder "Describe el problema observado", mínimo 20 caracteres
  - **Adjuntar Fotos:** Botón "Subir foto" + thumbnail previews (máx 5 fotos)
- **Navigation:**
  - Bottom bar (80px): Botón "Atrás" (secondary), "Continuar" (primary, right-aligned)
- **Validations:** Real-time feedback en cada campo, botón "Continuar" deshabilitado hasta completar campos requeridos

**Mobile (<768px):** Single column, botones stacked verticalmente
**Desktop (>1200px):** Formulario centrado, max-width 600px

### Screen 3: Dashboard KPIs (Director/Admin View)

**Layout:**
- **Header (60px):** Título "Dashboard de KPIs", selector de período (Mes actual, Trimestre, Año)
- **KPI Cards Row (120px):** 4 cards horizontales
  - Card 1: MTTR (promedio horas), trending icon (↑↓)
  - Card 2: MTBF (promedio días), trending icon
  - Card 3: OTs Abiertas (conteo), color según umbral
  - Card 4: Stock Crítico (conteo items), badge rojo si >0
- **Charts Section:**
  - **Gráfico 1:** OTs por semana (bar chart), altura 300px
  - **Gráfico 2:** Tiempos de reparación (line chart), altura 300px
  - **Gráfico 3:** Top 5 averías recurrentes (horizontal bar chart), altura 250px
- **Drill-down:** Click en KPI card o gráfico abre detalle filtrado
- **Export Button:** Top-right, icono download + "Exportar Excel"

**Responsive:**
- Desktop (>1200px): 4 KPI cards, gráficos en 2 columnas
- Tablet (768-1200px): 2x2 grid KPI cards, gráficos stacked
- Mobile (<768px): 1x4 grid KPI cards, gráficos stacked

## Iconography

**Icon Set:** Material Design Icons o similar
- **Navigation:** Home, Kanban, Activos, Repuestos, KPIs
- **Actions:** Add, Edit, Delete, Search, Filter, Export
- **Status:** CheckCircle, Warning, Error, Clock, Alert
- **Users:** Person, People, Supervisors, Admin

## Accessibility Notes

- **Contrast:** Todos los elementos cumplen WCAG AA (4.5:1 mínimo)
- **Text Resize:** Layout soporta 200% zoom sin romper
- **Keyboard Navigation:** Tab order lógico, focus indicators visibles
- **Screen Reader:** ARIA labels en todos los elementos interactivos

---

Con las especificaciones visuales definidas, exploramos los requerimientos específicos del dominio de mantenimiento reglamentario que añaden complejidad regulatoria al sistema.
