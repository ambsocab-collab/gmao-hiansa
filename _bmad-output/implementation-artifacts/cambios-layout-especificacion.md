# Especificación de Cambios de Layout - Sin Padding + Header Estrecho

**Fecha:** 2026-03-14
**Objetivo:** Eliminar padding, header más estrecho, sin avatares repetidos, logo arriba izquierda

---

## 📋 ARCHIVO 1: `app/(auth)/layout.tsx`

### Cambio 1.1: Reducir Altura del Header

**Línea 66 - ANTES:**
```tsx
<header className="bg-background shadow-sm border-b border-border sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
```

**Línea 66 - DESPUÉS:**
```tsx
<header className="bg-background shadow-sm border-b border-border sticky top-0 z-10">
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-12">  ← h-12 = 48px (era h-16 = 64px)
```

### Cambio 1.2: Eliminar Max-Width (Usar Todo el Ancho)

**Línea 67 - ANTES:**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Línea 67 - DESPUÉS:**
```tsx
<div className="w-full px-4 sm:px-6 lg:px-8">
```

### Cambio 1.3: Eliminar Padding del Main

**Línea 101 - ANTES:**
```tsx
<main className="p-8">{children}</main>
```

**Línea 101 - DESPUÉS:**
```tsx
<main className="px-4 sm:px-6 lg:px-8">{children}</main>
```

### Cambio 1.4: Alinear Logo a la Izquierda

**Líneas 69-72 - ANTES:**
```tsx
<div className="flex-shrink-0">
  <HiansaLogo size="md" className="w-40 h-10" data-testid="header-logo" />
</div>
```

**Líneas 69-72 - DESPUÉS:**
```tsx
<div className="flex-shrink-0">
  <HiansaLogo size="sm" className="w-32 h-8" data-testid="header-logo" />
  {/* Logo más pequeño: 128px × 32px en lugar de 164px × 41px */}
</div>
```

---

## 📋 ARCHIVO 2: `components/layout/sidebar.tsx`

### Cambio 2.1: Cambiar Variant a 'mini' (160px)

**Línea 56 - ANTES:**
```tsx
export default function Sidebar({ variant = 'compact', userCapabilities, className = '' }: SidebarProps) {
```

**Línea 56 - DESPUÉS:**
```tsx
export default function Sidebar({ variant = 'mini', userCapabilities, className = '' }: SidebarProps) {
```

### Cambio 2.2: Eliminar "GMAO" del Sidebar

**Líneas 75-78 - ANTES:**
```tsx
{/* Brand Name - Only "GMAO" without "Hiansa" (Story 1.0 AC5, Story 1.5 AC3) */}
<div className="p-6 pb-4">
  <h2 className="text-xl font-bold text-foreground">GMAO</h2>
</div>

{/* Navigation - Uses PBAC-filtered Navigation component (Story 1.2) */}
<div className="flex-1 px-4">
```

**Líneas 75-82 - DESPUÉS:**
```tsx
{/* Navigation - Uses PBAC-filtered Navigation component (Story 1.2) */}
<div className="flex-1 px-2 py-4">
  {/* Reducir padding: px-2 (8px) en lugar de px-4 (16px) */}
  {/* Agregar py-4 (16px) de espacio arriba */}
```

---

## 📋 ARCHIVO 3: `app/(auth)/dashboard/page.tsx`

### Cambio 3.1: Eliminar Header Redundante Completo

**Líneas 32-56 - ANTES:**
```tsx
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header with user info */}
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Hola, {session.user.name}
            </p>
          </div>

          {/* User Avatar with initials */}
          <div
            data-testid="user-avatar"
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
```

**Líneas 32-58 - DESPUÉS:**
```tsx
return (
  <>
    {/* Page Header - Solo título, sin avatar repetido */}
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">
        Bienvenido al Sistema de Gestión de Mantenimiento
      </p>
    </div>

    {/* Welcome Card */}
    <div className="bg-white rounded-lg shadow p-4">
```

### Cambio 3.2: Eliminar Wrapper y Main

**Línea 59 - ANTES:**
```tsx
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
```

**Línea 59 - DESPUÉS:**
```tsx
{/* Eliminar wrapper <main> porque layout.tsx ya provee <main> */}
```

### Cambio 3.3: Reducir Tamaños de Fuente

**Línea 39 - ANTES:**
```tsx
<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
```

**Línea 39 - DESPUÉS:**
```tsx
<h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
```

**Línea 61 - ANTES:**
```tsx
<h2 className="text-lg font-semibold text-gray-900 mb-4">
```

**Línea 61 - DESPUÉS:**
```tsx
<h2 className="text-base font-semibold text-gray-900 mb-4">
```

---

## 📋 ARCHIVO 4: `app/(auth)/usuarios/page.tsx`

### Cambio 4.1: Eliminar Max-Width y Padding Excesivo

**Línea 72 - ANTES:**
```tsx
return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
```

**Línea 72 - DESPUÉS:**
```tsx
return (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
  {/* w-full = usa todo el ancho disponible */}
  {/* py-4 = 16px padding vertical (era py-8 = 32px) */}
```

### Cambio 4.2: Reducir Tamaños de Fuente

**Línea 76 - ANTES:**
```tsx
<h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
```

**Línea 76 - DESPUÉS:**
```tsx
<h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
```

---

## 🎨 RESULTADO VISUAL ESPERADO

### Layout Desktop Después de Cambios:

```
┌─────┬──────────────────────────────────────────────────────────────────┐
│160px│ HEADER: 48px alto (era 64px)                                     │
│     │ ┌────┐  "Hola, Bernardo"  [Avatar BM]  [Cerrar Sesión]            │
│ S I │ │Logo│                                                          │
│ I D │ │Hiansa│  ← Logo arriba izquierda, más pequeño (128×32px)         │
│ E B │ │     │                                                          │
│ B A │ └────┘                                                          │
│ A R │                                                                  │
│     │ ┌──────────────────────────────────────────────────────────────┐ │
│     │ │ PAGE CONTENT (SIN padding vertical excesivo)                  │ │
│     │ │                                                              │ │
│     │ │ Título "Dashboard" (text-xl, no repetir nombre/avatar)        │ │
│     │ │                                                              │ │
│     │ │ ┌──────────────────────────────────────────────────────┐     │ │
│     │ │ │ Card: Bienvenido al Sistema...                        │     │ │
│     │ │ │                                                      │     │ │
│     │ │ └──────────────────────────────────────────────────────┘     │ │
│     │ │                                                              │ │
│     │ │ ┌──────────────────────────────────────────────────────┐     │ │
│     │ │ │ Card: Información de Usuario                          │     │ │
│     │ │ │                                                      │     │ │
│     │ │ └──────────────────────────────────────────────────────┘     │ │
│     │ │                                                              │ │
│     │ └──────────────────────────────────────────────────────────────┘ │
│     │                                                                  │
│     │ ┌──────────────────────────────────────────────────────────────┐ │
│     │ │ FOOTER: "powered by hiansa BSC"                            │ │
│     │ └──────────────────────────────────────────────────────────────┘ │
└─────┴──────────────────────────────────────────────────────────────────┘

GANANCIAS:
- Header: 48px (era 64px) = -25% altura
- Contenido: 1760px útiles (era 1216px) = +45% ancho
- Sin avatares repetidos
- Logo más pequeño y alineado a izquierda
```

---

## ✅ RESUMEN DE CAMBIOS

| Archivo | Línea | Cambio | Valor Antes | Valor Después |
|---------|-------|--------|-------------|---------------|
| `layout.tsx` | 66 | Header altura | `h-16` (64px) | `h-12` (48px) |
| `layout.tsx` | 67 | Container ancho | `max-w-7xl` | `w-full` |
| `layout.tsx` | 101 | Main padding | `p-8` | `px-4 sm:px-6 lg:px-8` |
| `layout.tsx` | 71 | Logo tamaño | `w-40 h-10` | `w-32 h-8` |
| `sidebar.tsx` | 56 | Sidebar variant | `compact` (200px) | `mini` (160px) |
| `sidebar.tsx` | 75-78 | Eliminar "GMAO" | Div con texto | Eliminar |
| `sidebar.tsx` | 81 | Nav padding | `px-4` | `px-2 py-4` |
| `dashboard/page.tsx` | 34-56 | Eliminar header | Header completo | Eliminar |
| `dashboard/page.tsx` | 39 | Título tamaño | `text-2xl` | `text-xl` |
| `usuarios/page.tsx` | 72 | Container | `max-w-7xl py-8` | `w-full py-4` |
| `usuarios/page.tsx` | 76 | Título tamaño | `text-3xl` | `text-xl` |

---

## 🚀 PRÓXIMO PASO

Bernardo, confirma estos cambios y procederé a:

1. ✅ Modificar los 4 archivos con los cambios especificados
2. ✅ Aplicar todas las modificaciones exactamente
3. ✅ Verificar que no haya avatares repetidos
4. ✅ Asegurar que el header esté más estrecho (48px)
5. ✅ Confirmar que el logo está arriba izquierda

**¿Confirmas que aplique estos cambios?** 🎯
