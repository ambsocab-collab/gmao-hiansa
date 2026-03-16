# Divisiones Hiansa: HiRock y Ultra

## 📚 ¿Qué son HiRock y Ultra?

**HiRock** y **Ultra** son las dos **divisiones de negocio de la empresa Hiansa**. Son como dos grandes áreas o departamentos dentro de la organización.

## 🏢 Estructura Organizacional

```
HIANSA (Empresa Matriz)
├── División HiRock
│   ├── Planta HiRock Madrid
│   │   ├── Línea de Producción A
│   │   │   ├── Equipo: Prensa Hidraulica PH-01
│   │   │   └── Equipo: Torno CNC TC-01
│   │   ├── Línea de Producción B
│   │   └── Línea de Ensamblaje
│   └── (Más plantas HiRock...)
│
└── División Ultra
    ├── Planta Ultra Barcelona
    │   ├── Línea de Procesamiento X
    │   │   ├── Equipo: Mezcladora MZ-01
    │   │   └── Equipo: Horno HR-01
    │   └── Línea de Procesamiento Y
    └── (Más plantas Ultra...)
```

## 🎨 Identidad Visual de cada División

### División HiRock
- **Color:** Dorado/Gold (`#FFD700`)
- **Propósito:** Plantas de procesamiento de roca/materiales duros
- **Tags en UI:** Se muestran con fondo dorado
- **Ejemplo de equipo:** Prensa Hidraulica PH-01

### División Ultra
- **Color:** Verde mar/Dark Sea Green (`#8FBC8F`)
- **Propósito:** Plantas de procesamiento ultra/fino
- **Tags en UI:** Se muestran con fondo verde
- **Ejemplo de equipo:** Mezcladora MZ-01

## 📋 En la Base de Datos

```prisma
model Planta {
  id          String    @id @default(cuid())
  name        String
  code        String    @unique
  division    Division  // HIROCK o ULTRA
  // ...
}

enum Division {
  HIROCK
  ULTRA
}
```

Cada planta pertenece a una división específica (no puede ser ambas).

## 🔍 En la Búsqueda Predictiva (Story 2.1)

Cuando un usuario busca un equipo, los resultados muestran:

1. **Nombre del equipo** (ej: "Prensa Hidraulica PH-01")
2. **Tag de división** con color:
   - HiRock = dorado (#FFD700)
   - Ultra = verde (#8FBC8F)
3. **Jerarquía completa:** División → Planta → Línea → Equipo

### Ejemplo de Resultado de Búsqueda:

```
┌─────────────────────────────────────────────────┐
│ Prensa Hidraulica PH-01          [HIROCK]      │ ← Tag dorado
│ HiRock → Planta HiRock Madrid → Línea A → PH-01│ ← Jerarquía
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Mezcladora MZ-01                 [ULTRA]       │ ← Tag verde
│ Ultra → Planta Ultra Barcelona → Línea X → MZ-01│ ← Jerarquía
└─────────────────────────────────────────────────┘
```

## ⚠️ Problema Actual Identificado

### Issue: Tags de División No Tienen Color

**Test que falla:** P0-E2E-003
```typescript
await expect(hiRockTag).toHaveCSS('background-color', 'rgb(255, 215, 0)');
// Expected: "rgb(255, 215, 0)" (#FFD700 - dorado)
// Received: "rgba(0, 0, 0, 0)" (transparente)
```

**Causa Raíz:**
El componente `EquipoSearch` usa **clases CSS de Tailwind** para el color:
```tsx
className={cn(
  'px-2 py-0.5 rounded text-xs font-medium',
  equipo.linea.planta.division === 'HIROCK'
    ? 'bg-[#FFD700] text-foreground' // HiRock gold
    : 'bg-[#8FBC8F] text-foreground' // Ultra dark sea green
)}
```

**El problema:** Tailwind usa **clases CSS**, no estilos inline. El test E2E está buscando un estilo inline `background-color` pero Tailwind compila las clases a CSS rules en el stylesheet.

## 🎯 Solución Recomendada

### Opción 1: Corregir el Test (Recomendado)
El test debe verificar la **clase CSS** en lugar del estilo inline:
```typescript
// Verificar que el tag tiene la clase correcta
await expect(hiRockTag).toHaveClass(/bg-\[#FFD700\]/);
```

### Opción 2: Usar Estilos Inline (No Recomendado)
Cambiar el componente para usar estilos inline (menos mantenible):
```tsx
<span style={{
  backgroundColor: equipo.linea.planta.division === 'HIROCK' ? '#FFD700' : '#8FBC8F'
}}>
```

## 📊 Estado Actual

- ✅ Hay **10 equipos** en la base de datos (seed funcionando)
- ✅ Equipos tienen jerarquía completa (Planta → Línea → Equipo)
- ✅ Hay equipos de AMBAS divisiones (HiRock y Ultra)
- ❌ **Tags no tienen color visible** (CSS issue)
- ⚠️ Tests E2E fallan por este problema

## 🔧 Próximos Pasos

1. **Corregir test P0-E2E-003** para verificar clases CSS en lugar de estilos inline
2. **Investigar por qué otros tests fallan** (P0-E2E-001, 002, etc.)
3. **Verificar que el Componente Command** de shadcn/ui esté renderizando los resultados correctamente

---

**Fecha:** 2026-03-16
**Story:** 2.1 - Búsqueda Predictiva de Equipos
**Tests afectados:** P0-E2E-003 (colores CSS), P0-E2E-001 through 007 (resultados no se muestran)
