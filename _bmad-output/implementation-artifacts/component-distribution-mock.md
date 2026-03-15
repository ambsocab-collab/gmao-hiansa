# Mock de Distribución de Componentes - GMAO Hiansa

**Fecha:** 2026-03-14
**Propósito:** Documentar la distribución actual de componentes en desktop para luego ser rediseñada

---

## 1. ESTRUCTURA GENERAL DE LA PÁGINA (DESKTOP)

### Layout Desktop (>768px) - Vista Global

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ VIEWPORT DESKTOP (1920px × 1080px - Full HD)                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────────────────────────────────────────────────────────────────┐
│              │                                                                          │
│   SIDEBAR    │                         MAIN CONTENT AREA                                │
│              │                                                                         │
│   (Variable  │  ┌─────────────────────────────────────────────────────────────────┐    │
│    width)    │  │                        HEADER                                     │    │
│              │  │  (Height: 64px | Sticky: top-0 | Z-index: 10)                   │    │
│   160px      │  └─────────────────────────────────────────────────────────────────┘    │
│    200px     │                                                                         │
│    256px     │  ┌─────────────────────────────────────────────────────────────────┐    │
│              │  │                                                                     │    │
│              │  │                        PAGE CONTENT                               │    │
│              │  │                                                                     │    │
│              │  │  (Scrollable | Padding: 32px all sides)                           │    │
│              │  │                                                                     │    │
│              │  │                                                                     │    │
│              │  │                                                                     │    │
│              │  │                                                                     │    │
│              │  │                                                                     │    │
│              │  └─────────────────────────────────────────────────────────────────┘    │
│              │                                                                         │
│              │  ┌─────────────────────────────────────────────────────────────────┐    │
│              │  │                        FOOTER                                    │    │
│              │  │  (Height: ~80px | Border-top)                                   │    │
│              │  └─────────────────────────────────────────────────────────────────┘    │
│              │                                                                         │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DETALLE DE COMPONENTES - SIDEBAR

### Sidebar Lateral (Izquierda)

**Variantes de Ancho (Story 1.5):**

| Variant | Clase Tailwind | Ancho Real | Caso de Uso |
|---------|---------------|------------|-------------|
| `mini` | `w-40` | 160px | Data Heavy (Dirección 4) |
| `compact` | `w-52` | 200px | Kanban First (Dirección 2) - **DEFAULT** |
| `default` | `w-64` | 256px | Dashboard Clásico (Dirección 1) |

**Composición del Sidebar:**

```
┌─────────────────────┐  ← ANCHO VARIABLE (160/200/256px)
│ SIDEBAR             │  ← Sticky: top-0 | Height: 100vh (h-screen)
│                     │  ← Hidden en mobile (<768px)
├─────────────────────┤
│                     │
│  [BRANDING]         │  ← Componente: <div> con texto "GMAO"
│                     │  ← Padding: p-6 (24px) vertical, pb-4 (16px) bottom
│     GMAO            │  ← Altura estimada: ~60px
│                     │
├─────────────────────┤
│                     │
│  [NAVIGATION]       │  ← Componente: <Navigation />
│                     │  ← Padding: px-4 (16px) horizontal
│  • Dashboard        │  ← Flex-1 (ocupa espacio restante)
│  • Kanban OTs       │
│  • Reportar Avería  │
│  • KPIs             │
│  • Activos          │
│  • Stock            │
│  • Usuarios         │  ← Solo si can_manage_users
│  • Etiquetas        │  ← Solo si can_manage_users
│                     │
│  (Scrollable si     │
│   contenido largo)  │
│                     │
└─────────────────────┘
```

**Elementos del Sidebar:**

| Elemento | Nombre Componente | Descripción |
|----------|-------------------|-------------|
| Branding | `div > h2` | Texto "GMAO" (sin "Hiansa") |
| Navigation | `Navigation` | Links de navegación filtrados por PBAC |

**Dimensiones Actuales:**

- **Padding vertical branding:** 24px top, 16px bottom
- **Padding navigation:** 16px horizontal
- **Altura branding:** ~60px
- **Altura navigation:** Variable (flex-1)

---

## 3. DETALLE DE COMPONENTES - HEADER

### Header (Parte superior del Main Content)

**Estructura del Header:**

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
│ Height: 64px (h-16) | Sticky: top-0 | Z-index: 10 | Border-bottom                         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────┐  ┌─────────────────────────────────────────────────────────────┐      │
│  │   [LOGO]       │  │                           [USER AREA]                       │      │
│  │                │  │                                                               │      │
│  │  HiansaLogo    │  │  "Hola, {nombre}"    [Avatar]    [Botón Cerrar Sesión]        │      │
│  │  164px × 41px  │  │  (Text)            (Circle)    (Button outline sm)          │      │
│  └────────────────┘  └─────────────────────────────────────────────────────────────┘      │
│                                                                                            │
│  ← Max-width: 1280px (max-w-7xl) centrado horizontalmente                                  │
│  ← Padding horizontal: px-4 (16px) sm:px-6 (24px) lg:px-8 (32px)                           │
│  ← Flex: items-center justify-between                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Elementos del Header:**

| Elemento | Nombre Componente | Dimensiones | Descripción |
|----------|-------------------|-------------|-------------|
| Logo | `HiansaLogo` | 164px × 41px (w-40 h-10) | Logo SVG Hiansa |
| Saludo | `span` | Auto | "Hola, {nombre}" |
| Avatar | `div` | 32px × 32px (w-8 h-8) | Circle con iniciales |
| Botón Logout | `Button` | Auto | "Cerrar Sesión" |

**Espaciado del Header:**

- **Altura total:** 64px (h-16)
- **Padding horizontal container:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Gap entre elementos user area:** 12px (gap-3)
- **Max-width container:** 1280px (max-w-7xl)

---

## 4. DETALLE DE COMPONENTES - PAGE CONTENT

### Contenido Principal (Dashboard como ejemplo)

**Estructura del Page Content:**

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ PAGE CONTENT                                                                              │
│ Padding: 32px all sides (p-8) | Max-width: 1280px (max-w-7xl)                            │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [PAGE HEADER]                                                                          │ │
│  │                                                                                        │ │
│  │  Usuarios                                                        [Botones Actions] │ │
│  │  Gestiona los usuarios del sistema      [Gestionar Etiquetas] [Crear Usuario]       │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [FILTERS BAR]                                                                          │ │
│  │                                                                                        │ │
│  │  [Search Input]  [Filter Tags Dropdown]  [Sort Dropdown]                             │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [DATA TABLE]                                                                            │ │
│  │                                                                                        │ │
│  │  ┌──────┬──────────┬────────────┬────────────┬──────────┬─────────────┐              │ │
│  │  │ Nombre│ Email    │ Teléfono    │ Etiquetas  │ Actions  │             │              │ │
│  │  ├──────┼──────────┼────────────┼────────────┼──────────┼─────────────┤              │ │
│  │  │ ...  │ ...      │ ...         │ ...        │ ...      │ ...         │              │ │
│  │  │ ...  │ ...      │ ...         │ ...        │ ...      │ ...         │              │ │
│  │  └──────┴──────────┴────────────┴────────────┴──────────┴─────────────┘              │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│  (Scrollable verticalmente)                                                                │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Elementos del Page Content (ejemplo Usuarios):**

| Elemento | Nombre Componente | Dimensiones | Descripción |
|----------|-------------------|-------------|-------------|
| Page Header | `div` | Auto | Título + descripción + botones |
| Filters Bar | `div` | Auto | Buscador + filtros + ordenamiento |
| Data Table | `table` | Auto | Tabla con datos de usuarios |

**Espaciado del Page Content:**

- **Padding:** 32px (p-8)
- **Max-width:** 1280px (max-w-7xl)
- **Margin-bottom header:** 32px (mb-8)

---

## 5. DETALLE DE COMPONENTES - FOOTER

### Footer (Parte inferior del Main Content)

**Estructura del Footer:**

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                                    │
│ Height: ~80px | Border-top | Margin-top: 48px (mt-12)                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│           powered by hiansa BSC                                                           │
│                                                                                            │
│  ← Max-width: 1280px (max-w-7xl) centrado horizontalmente                                  │
│  ← Padding: 24px vertical (py-6), 16/24/32px horizontal                                   │
│  ← Text-align: center                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Elementos del Footer:**

| Elemento | Texto | Estilo |
|----------|-------|--------|
| Branding | "powered by hiansa BSC" | Text-sm, text-muted-foreground |

**Espaciado del Footer:**

- **Padding vertical:** 24px (py-6)
- **Padding horizontal:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Margin-top:** 48px (mt-12)
- **Max-width:** 1280px (max-w-7xl)

---

## 6. RESUMEN DE ESPACIOS OCUPADOS

### Ancho de Pantalla (Desktop > 768px)

| Sección | Ancho (px) | Porcentaje | Descripción |
|---------|-----------|------------|-------------|
| **Sidebar (mini)** | 160px | 8.3% | Data Heavy |
| **Sidebar (compact)** | 200px | 10.4% | Kanban First - **DEFAULT** |
| **Sidebar (default)** | 256px | 13.3% | Dashboard Clásico |
| **Main Content (mini)** | 1760px | 91.7% | Con sidebar mini |
| **Main Content (compact)** | 1720px | 89.6% | Con sidebar compact - **ACTUAL** |
| **Main Content (default)** | 1664px | 86.7% | Con sidebar default |

### Alturas de Componentes (Fijos)

| Componente | Altura (px) | Sticky | Descripción |
|------------|-------------|--------|-------------|
| **Header** | 64px | ✅ top-0 | Siempre visible |
| **Footer** | ~80px | ❌ | Se desplaza con contenido |
| **Sidebar** | 100vh | ✅ top-0 | Altura completa de ventana |

### Espaciados (Padding/Margins)

| Contexto | Valor (px) | Clase Tailwind | Descripción |
|----------|-----------|----------------|-------------|
| **Page Content padding** | 32px | p-8 | Márgenes internos del contenido |
| **Header padding horizontal** | 16/24/32px | px-4/6/8 | Responsive padding |
| **Sidebar padding navigation** | 16px | px-4 | Padding horizontal de navegación |
| **Footer margin-top** | 48px | mt-12 | Espacio sobre footer |

---

## 7. PROBLEMAS IDENTIFICADOS POR EL USUARIO

### Problemas Actuales de Distribución:

1. **"Navbar lateral demasiado grande"**
   - Actualmente usa variant `compact` (200px)
   - El usuario aún lo ve demasiado grande
   - ¿Necesita variante más pequeña (120-140px)?

2. **"GMAO Hiansa repetido en header y navbar"**
   - ✅ CORREGIDO: Header solo tiene Logo SVG
   - ✅ CORREGIDO: Sidebar solo dice "GMAO"
   - ⚠️ PERO: ¿El logo SVG es suficientemente visible?

3. **"GMAO 2026 repetido muchas veces"**
   - ✅ CORREGIDO: Footer ahora dice solo "powered by hiansa BSC"
   - ¿Queda algún otro lugar con repetición?

4. **"La distribución de componentes no es buena en vista desktop"**
   - ¿Qué específicamente está mal?
   - ¿Demasiado espacio en blanco?
   - ¿Componentes muy separados?
   - ¿Header/Footer ocupan demasiado espacio?
   - ¿Sidebar roba demasiado ancho?

---

## 8. DISTRIBUCIÓN RESPONSIVE (Mobile)

### Mobile (<768px) - Sidebar Oculto

```
┌────────────────────────────┐
│ HEADER (64px)              │
│ Logo + User Info           │
├────────────────────────────┤
│                            │
│  PAGE CONTENT              │
│  (Padding: 32px)           │
│                            │
│  (NO SIDEBAR)              │
│  (Hidden en móvil)         │
│                            │
├────────────────────────────┤
│ FOOTER (~80px)             │
│ "powered by hiansa BSC"    │
└────────────────────────────┘
```

**En móvil:**
- Sidebar: `hidden` (no visible)
- Main Content: 100% ancho (sin margin-left)
- Header y Footer: mismos estilos que desktop

---

## 9. COMPONENTES SHADCN/UI UTILIZADOS

### Librería de Componentes:

| Componente | Path | Uso Actual |
|------------|------|------------|
| `Button` | `components/ui/button.tsx` | Header logout, page actions |
| `Toaster` | `components/ui/toaster.tsx` | Notificaciones toast |
| `Navigation` | `components/users/Navigation.tsx` | Links de navegación en sidebar |
| `HiansaLogo` | `components/brand/hiansa-logo.tsx` | Logo SVG en header |
| `Sidebar` | `components/layout/sidebar.tsx` | Sidebar lateral con 3 variants |
| `UsersClient` | `app/(auth)/usuarios/components/UsersClient.tsx` | Tabla de usuarios client-side |

---

## 10. MAPA DE ARCHIVOS DE LAYOUT

### Archivos que Definen el Layout:

```
app/
├── layout.tsx                          → Layout raíz (HTML, body)
├── page.tsx                            → Landing page (future Story 1.4)
│
├── (auth)/
│   ├── layout.tsx                      → ✅ LAYOUT PRINCIPAL AUTENTICADO
│   │   ├── <Sidebar />                 → Sidebar con variantes
│   │   ├── <Header />                  → Header con logo + user
│   │   ├── <main>children</main>       → Page content
│   │   └── <Footer />                  → Footer "powered by hiansa BSC"
│   │
│   ├── dashboard/page.tsx              → Dashboard (Story 1.1)
│   ├── usuarios/page.tsx               → Usuarios list (Story 1.3)
│   └── ...
│
components/
├── layout/
│   └── sidebar.tsx                     → Sidebar component (3 variants)
│
├── brand/
│   └── hiansa-logo.tsx                 → Logo SVG component
│
└── users/
    └── Navigation.tsx                  → Navigation links (PBAC filtered)
```

---

## FIN DEL MOCK DE DISTRIBUCIÓN

**Próximo Paso:** Bernardo definirá cómo quiere redistribuir estos componentes.

**Preguntas para Bernardo:**
1. ¿Qué ancho de sidebar prefieres? (Actual: 200px compact)
2. ¿El header de 64px es correcto o debe ser más pequeño?
3. ¿El padding de 32px en page content es correcto?
4. ¿Hay algún componente que quieras eliminar o mover?
5. ¿Prefieres un layout sin sidebar para alguna página?
