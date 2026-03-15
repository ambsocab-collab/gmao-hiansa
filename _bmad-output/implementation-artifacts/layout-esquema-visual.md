# Esquema Visual de Distribución - GMAO Hiansa (Layout Actual)

**Fecha:** 2026-03-14
**Viewport:** Desktop 1920px × 1080px (Full HD)

---

## 🔲 ESQUEMA 1: VISTA GENERAL DE LA PÁGINA

```
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║ VIEWPORT: 1920px (ancho) × 1080px (alto)                                                  ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝

┌──────┬──────────────────────────────────────────────────────────────────────────────────────┐
│      │                                         MAX-WIDTH: 1280px (Centrado)                 │
│  200px│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│      │  │                                                                                │ │
│  S   │  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│  I   │  │  │  HEADER                                                                   │  │ │
│  D   │  │  │  Altura: 64px | Sticky: top | Z-index: 10                                 │  │ │
│  E   │  │  │  ┌─────────────────┐  ┌──────────────────────────────────────────────────┐ │  │ │
│  B   │  │  │  │ Logo Hiansa     │  │ "Hola, nombre"    [Avatar]    [Cerrar Sesión]    │ │  │ │
│  A   │  │  │  │ 164px × 41px    │  │                                              │ │  │ │
│  R   │  │  │  └─────────────────┘  └──────────────────────────────────────────────────┘ │  │ │
│      │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│  10.4%  │  │                                                                                │ │
│      │  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│      │  │  │                                                                                │ │
│      │  │  │  PAGE CONTENT                                                                │  │ │
│      │  │  │  Padding: 32px todos los lados                                             │  │ │
│      │  │  │                                                                                │ │
│      │  │  │  ┌──────────────────────────────────────────────────────────────────────┐  │  │ │
│      │  │  │  │ [Page Header]                                                           │  │  │ │
│      │  │  │  │ Título + Descripción + Botones de Acción                               │  │  │ │
│      │  │  │  └──────────────────────────────────────────────────────────────────────┘  │  │ │
│      │  │  │                                                                                │ │
│      │  │  │  ┌──────────────────────────────────────────────────────────────────────┐  │  │ │
│      │  │  │  │ [Filters Bar]                                                          │  │  │ │
│      │  │  │  │ Search + Filter Tags + Sort                                           │  │  │ │
│      │  │  │  └──────────────────────────────────────────────────────────────────────┘  │  │ │
│      │  │  │                                                                                │ │
│      │  │  │  ┌──────────────────────────────────────────────────────────────────────┐  │  │ │
│      │  │  │  │                                                                        │  │  │ │
│      │  │  │  │  [Data Table / Cards / Content]                                       │  │  │ │
│      │  │  │  │                                                                        │  │  │ │
│      │  │  │  │  ← Scrollable verticalmente                                           │  │  │ │
│      │  │  │  │                                                                        │  │  │ │
│      │  │  │  │                                                                        │  │  │ │
│      │  │  │  └──────────────────────────────────────────────────────────────────────┘  │  │ │
│      │  │  │                                                                                │ │
│      │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│      │  │                                                                                │ │
│      │  │  ┌──────────────────────────────────────────────────────────────────────────┐  │ │
│      │  │  │  FOOTER                                                                  │  │ │
│      │  │  │  Altura: ~80px | Border-top                                              │  │ │
│      │  │  │              "powered by hiansa BSC"                                      │  │ │
│      │  │  └──────────────────────────────────────────────────────────────────────────┘  │ │
│      │  │                                                                                │ │
└──────┴──┴────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔲 ESQUEMA 2: DETALLE DEL SIDEBAR (200px ancho actual)

```
┌─────────────────────┐
│ SIDEBAR             │ ← Ancho: 200px (10.4% de viewport)
│ Altura: 100vh       │ ← Sticky: top-0
│ Hidden: mobile      │ ← Visible: desktop (>768px)
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │   BRANDING      │ │ ← Padding: 24px top, 16px bottom
│ │                 │ │
│ │     GMAO        │ │ ← Font-size: 20px (text-xl), Bold
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │  NAVIGATION     │ │ ← Padding: 16px horizontal
│ │                 │ │
│ │ • Dashboard     │ │ ← Links filtrados por PBAC
│ │ • Kanban OTs    │ │
│ │ • Reportar...   │ │
│ │ • KPIs          │ │
│ │ • Activos       │ │
│ │ • Stock         │ │
│ │ • Usuarios      │ │ ← Solo si can_manage_users
│ │ • Etiquetas     │ │ ← Solo si can_manage_users
│ │                 │ │
│ │  [Scrollable]   │ │ ← Flex-1 (espacio restante)
│ │                 │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

**COMPOSICIÓN DEL SIDEBAR:**
- **Ancho total:** 200px
- **Padding branding:** 24px vertical
- **Padding navigation:** 16px horizontal
- **Altura branding:** ~60px
- **Altura navigation:** Variable (resto de pantalla)

---

## 🔲 ESQUEMA 3: DETALLE DEL HEADER

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
│ Altura: 64px | Sticky: top-0 | Z-index: 10 | Border-bottom                                │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌────────────────────┐                        ┌─────────────────────────────────────────┐  │
│  │                    │                        │                                         │  │
│  │   Logo Hiansa      │                        │  "Hola, Bernardo"                       │  │
│  │                    │                        │                                         │  │
│  │   (SVG 164×41)     │      ← Gap: Auto →    │  [Avatar: BM]      [Cerrar Sesión]       │  │
│  │                    │                        │  (32×32px)         (Button outline)       │  │
│  │                    │                        │                                         │  │
│  └────────────────────┘                        └─────────────────────────────────────────┘  │
│                                                                                            │
│  ← Ancho: 164px →     ← Flex: 1 →          ← Gap: 12px entre elementos →              │
│                                                                                            │
│  ← Max-width container: 1280px (centrado en viewport de 1920px)                            │
│  ← Padding horizontal: 32px (desktop)                                                      │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**COMPOSICIÓN DEL HEADER:**
- **Altura total:** 64px
- **Logo:** 164px × 41px
- **Avatar:** 32px × 32px (círculo)
- **Gap user elements:** 12px
- **Padding container:** 32px horizontal (desktop)

---

## 🔲 ESQUEMA 4: DETALLE DEL PAGE CONTENT

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ PAGE CONTENT                                                                              │
│ Padding: 32px todos los lados | Max-width: 1280px                                         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [PAGE HEADER]                                                                          │ │
│  │                                                                                        │ │
│  │  Usuarios                                                   [Gestionar Etiquetas]   │ │
│  │  Gestiona los usuarios del sistema                          [Crear Usuario]           │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│  ← Margin-bottom: 32px                                                                     │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [FILTERS BAR]                                                                          │ │
│  │                                                                                        │ │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐                         │ │
│  │  │ 🔍 Search   │  │ Filter Tags ▼   │  │ Sort by ▼       │                         │ │
│  │  └─────────────┘  └──────────────────┘  └──────────────────┘                         │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│  ← Margin-bottom: 24px                                                                     │
│                                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [DATA TABLE]                                                                            │ │
│  │                                                                                        │ │
│  │  ┌────────┬──────────┬────────────┬────────────┬──────────┬────────────┐              │ │
│  │  │ Nombre │ Email    │ Teléfono    │ Etiquetas  │ Actions  │             │              │ │
│  │  ├────────┼──────────┼────────────┼────────────┼──────────┼────────────┤              │ │
│  │  │ BM     │ bm@...   │ +569...     │ [Téc]      │ [Edit]   │ [Delete]   │              │ │
│  │  │        │          │             │ [Superv]   │          │             │              │ │
│  │  ├────────┼──────────┼────────────┼────────────┼──────────┼────────────┤              │ │
│  │  │ JP     │ jp@...   │ +569...     │ [Oper]     │ [Edit]   │ [Delete]   │              │ │
│  │  │        │          │             │             │          │             │              │ │
│  │  └────────┴──────────┴────────────┴────────────┴──────────┴────────────┘              │ │
│  │                                                                                        │ │
│  │  ← Scrollable verticalmente si hay muchos usuarios                                     │ │
│  │                                                                                        │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│  ← Espacio disponible: 1720px × ~900px (con sidebar 200px)                                │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**COMPOSICIÓN DEL PAGE CONTENT:**
- **Padding:** 32px todos los lados
- **Max-width:** 1280px
- **Ancho usable:** 1216px (1280 - 64px padding)
- **Margin-between sections:** 24-32px

---

## 🔲 ESQUEMA 5: DETALLE DEL FOOTER

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                                    │
│ Altura: ~80px | Border-top | Margin-top: 48px                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│                               powered by hiansa BSC                                        │
│                                                                                            │
│  ← Max-width: 1280px (centrado)                                                           │
│  ← Padding: 24px vertical, 32px horizontal                                                │
│  ← Text-align: center                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**COMPOSICIÓN DEL FOOTER:**
- **Altura:** ~80px
- **Padding vertical:** 24px
- **Padding horizontal:** 32px (desktop)
- **Margin-top:** 48px
- **Max-width:** 1280px

---

## 🔲 ESQUEMA 6: DIMENSIONES TOTALES (Desktop)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                            │
│  ┌────────┐                                                                              │
│  │ 200px  │   ← SIDEBAR (10.4%)                                                          │
│  │        │                                                                              │
│  │ S I   │   ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ D     │   │                                                                          │   │
│  │ E     │   │   MAIN CONTENT: 1720px (89.6%)                                          │   │
│  │ B     │   │                                                                          │   │
│  │ A     │   │   ┌────────────────────────────────────────────────────────────────┐   │   │
│  │ R     │   │   │ HEADER: 64px alto                                               │   │   │
│  │       │   │   │ Max-width: 1280px (centrado)                                    │   │   │
│  │       │   │   └────────────────────────────────────────────────────────────────┘   │   │
│  │       │   │                                                                          │   │
│  │       │   │   ┌────────────────────────────────────────────────────────────────┐   │   │
│  │       │   │   │                                                                  │   │   │
│  │       │   │   │   PAGE CONTENT: Variable (~800-900px)                           │   │   │
│  │       │   │   │   Max-width: 1280px                                             │   │   │
│  │       │   │   │   Padding: 32px                                                 │   │   │
│  │       │   │   │                                                                  │   │   │
│  │       │   │   │   Contenido principal scrollable                                │   │   │
│  │       │   │   │                                                                  │   │   │
│  │       │   │   └────────────────────────────────────────────────────────────────┘   │   │
│  │       │   │                                                                          │   │
│  │       │   │   ┌────────────────────────────────────────────────────────────────┐   │   │
│  │       │   │   │ FOOTER: ~80px alto                                              │   │   │
│  │       │   │   │ Max-width: 1280px (centrado)                                    │   │   │
│  │       │   │   └────────────────────────────────────────────────────────────────┘   │   │
│  │       │   │                                                                          │   │
│  └────────┘   └──────────────────────────────────────────────────────────────────────┘   │
│                                                                                            │
│  TOTAL: 1920px × 1080px                                                                   │
│  Sidebar: 200px × 1080px                                                                  │
│  Main Content: 1720px × 1080px                                                            │
│  Container centrado: 1280px de ancho útil                                                 │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔲 ESQUEMA 7: ESPACIOS PERDIDOS (Análisis)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ANÁLISIS DE ESPACIOS                                                                      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  Viewport Total: 1920px                                                                   │
│  ──────────────────────────────────────────────────────────────────────────────────────  │
│                                                                                            │
│  ❌ SIDEBAR:           200px  (10.4%)                                                      │
│  ❌ Márgenes laterales:  320px  (16.7%) ← (1920 - 1280) / 2                               │
│  ✅ Container útil:     1216px  (63.3%) ← 1280 - 64px padding                            │
│  ❌ Padding container:    64px  ( 3.3%) ← 32px × 2                                       │
│  ❌ Espacio vacío:      120px  ( 6.3%) dentro del container                               │
│  ──────────────────────────────────────────────────────────────────────────────────────  │
│  TOTAL:                  1920px  (100%)                                                  │
│                                                                                            │
│  ⚠️ PROBLEMA: Solo 63.3% del ancho de pantalla es contenido útil                         │
│  ⚠️ PROBLEMA: 36.7% del espacio se pierde en sidebar + márgenes                           │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔲 ESQUEMA 8: COMPARATIVA DE VARIANTES DE SIDEBAR

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ VARIANTES DE ANCHO DE SIDEBAR                                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  MINI (160px):        ┌────┐                                                               │
│                       │    │  160px × 1080px (8.3%)                                        │
│                       │    │  Main content: 1760px (91.7%)                                 │
│                       │    │                                                               │
│                       └────┘                                                               │
│                                                                                            │
│  COMPACT (200px):     ┌──────┐     ← ACTUAL DEFAULT                                       │
│                       │      │  200px × 1080px (10.4%)                                      │
│                       │      │  Main content: 1720px (89.6%)                               │
│                       │      │                                                               │
│                       └──────┘                                                             │
│                                                                                            │
│  DEFAULT (256px):     ┌─────────┐                                                         │
│                       │         │  256px × 1080px (13.3%)                                   │
│                       │         │  Main content: 1664px (86.7%)                            │
│                       │         │                                                         │
│                       └─────────┘                                                       │
│                                                                                            │
│  ULTRA-COMPACT ?:     ┌──┐     ← ¿Propuesta?                                             │
│                       │  │     120-140px                                                  │
│                       │  │     Main content: 1780-1800px (92-93%)                         │
│                       └──┘                                                                 │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔲 ESQUEMA 9: LAYOUT RESPONSIVE (Mobile)

```
┌────────────────────────────┐
│ VIEWPORT MOBILE: 375-768px │
├────────────────────────────┤
│                            │
│  ┌──────────────────────┐  │
│  │ HEADER (64px)        │  │
│  │ Logo + User Info     │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │                      │  │
│  │ PAGE CONTENT         │  │
│  │ (Scrollable)         │  │
│  │ Padding: 32px        │  │
│  │ Ancho: 100%          │  │
│  │                      │  │
│  │ ❌ NO SIDEBAR        │  │
│  │ (Hidden en móvil)    │  │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │ FOOTER (~80px)       │  │
│  │ "powered by..."      │  │
│  └──────────────────────┘  │
│                            │
└────────────────────────────┘

EN MÓVIL:
- Sidebar: OCULTO (hidden md:flex)
- Main Content: 100% ancho
- Márgenes: Solo 32px padding
- Espacio útil: ~90% del viewport
```

---

## 🎯 PREGUNTAS PARA REDISEÑAR

Bernardo, basándote en estos esquemas visuales, ahora puedes decirme:

### 1. ¿Ancho del Sidebar?
- [ ] Mantener 200px (compact)
- [ ] Reducir a 160px (mini)
- [ ] Reducir a 120-140px (ultra-compact ¿?)
- [ ] Aumentar a 256px (default)
- [ ] Eliminar sidebar completamente

### 2. ¿Altura del Header?
- [ ] Mantener 64px
- [ ] Reducir a 56px
- [ ] Reducir a 48px
- [ ] Eliminar header (integrar en sidebar)

### 3. ¿Padding del Page Content?
- [ ] Mantener 32px (p-8)
- [ ] Reducir a 24px (p-6)
- [ ] Reducir a 16px (p-4)

### 4. ¿Max-width del Container?
- [ ] Mantener 1280px (max-w-7xl)
- [ ] Aumentar a 1536px (max-w-8xl)
- [ ] Eliminar max-width (100% viewport)

### 5. ¿Footer?
- [ ] Mantener actual
- [ ] Hacer más pequeño (40-50px)
- [ ] Eliminar footer

**¿Qué cambios quieres hacer?** 🎨
