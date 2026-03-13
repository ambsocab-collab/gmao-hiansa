# E2E Tests - Configuración Automática de Seed

## Overview

Los tests E2E ahora verifican **automáticamente** que la base de datos tenga los datos de prueba (seed) antes de ejecutarse. Si detecta que faltan datos, ejecuta el seed automáticamente.

## ¿Cómo funciona?

### 1. Global Setup (`tests/e2e/global-setup.ts`)

Antes de ejecutar cualquier test E2E, el setup global:

1. **Espera a que el servidor esté listo**
   - Verifica el endpoint `/api/v1/health`
   - Reintenta hasta 30 veces con 2 segundos de espera entre cada intento

2. **Verifica que los usuarios de prueba existan**
   - Comprueba la existencia de los usuarios requeridos:
     - `admin@hiansa.com`
     - `tecnico@hiansa.com`
     - `supervisor@hiansa.com`
     - `new.user@example.com`

3. **Ejecuta seed automáticamente si faltan usuarios**
   - Llama al endpoint `/api/v1/test/seed` (POST)
   - Espera a que termine (máximo 2 minutos)
   - Confirma que el seed se completó exitosamente

### 2. API Endpoint de Seed (`app/api/v1/test/seed/route.ts`)

Endpoint **SOLO disponible en desarrollo/testing**:

```typescript
// POST - Ejecuta el seed de la base de datos
POST /api/v1/test/seed
Headers: x-playwright-test: 1
Response: {
  success: true,
  summary: {
    users: 3,
    capabilities: 15,
    message: "Database seeded successfully"
  }
}

// GET - Verifica si el seed es necesario
GET /api/v1/test/seed
Response: {
  seeded: true,
  missingUsers: [],
  existingUsers: ["admin@hiansa.com", ...]
}
```

**Medidas de seguridad:**
- ❌ NO disponible en producción (NODE_ENV=production)
- ✅ Requiere header `x-playwright-test: 1` en testing
- ✅ Disponible sin header en desarrollo

## Scripts Disponibles

```bash
# Ejecutar todos los tests E2E (con verificación automática de seed)
npm run test:e2e

# Ejecutar solo tests de Story 1.1
npm run test:e2e:story-1.1

# Ejecutar tests de Story 1.1 con reporte HTML
npm run test:e2e:story-1.1:reporter

# Ejecutar solo tests P0 (críticos)
npm run test:e2e:p0
```

## Usuarios de Prueba (Seed)

| Email | Password | Rol | Capabilities |
|-------|----------|-----|--------------|
| admin@hiansa.com | admin123 | Admin | Todas (15) |
| tecnico@hiansa.com | tecnico123 | Técnico | Básicas |
| supervisor@hiansa.com | supervisor123 | Supervisor | Intermedias |
| new.user@example.com | tempPassword123 | Nuevo | forcePasswordReset=true |

## Solución de Problemas

### Error: "Test user not found in database"

**Causa:** El seed no se ha ejecutado o faltan usuarios.

**Solución automática:** El global setup ejecutará el seed automáticamente.

**Solución manual:**
```bash
npx prisma db seed
```

### Error: "Server failed to start"

**Causa:** El servidor Next.js no está respondiendo.

**Solución:**
1. Verifica que el servidor esté corriendo: `npm run dev:e2e`
2. Revisa los logs del servidor
3. Verifica que la base de datos esté accessible

### Error: "Seed endpoint not available in production"

**Causa:** Intentando ejecutar seed en producción.

**Solución:** El seed endpoint está bloqueado en producción por seguridad. En CI/CD, usa migraciones en lugar de seed.

## CI/CD Considerations

En entornos de CI/CD:

1. **El global setup se ejecuta automáticamente** antes de los tests
2. **El servidor se reutiliza** si ya está corriendo (`reuseExistingServer: !process.env.CI`)
3. **Timeout extendido** a 240 segundos para iniciar el servidor

## Arquitectura

```
playwright.config.ts
    ↓ (configura globalSetup)
tests/e2e/global-setup.ts
    ↓ (verifica usuarios)
app/api/v1/test/seed/route.ts
    ↓ (ejecuta seed)
prisma/seed.ts
    ↓ (inserta datos)
Database (PostgreSQL)
```

## Archivos Modificados

1. **`playwright.config.ts`** - Agrega `globalSetup`
2. **`tests/e2e/global-setup.ts`** - Nuevo archivo de setup global
3. **`app/api/v1/test/seed/route.ts`** - Nuevo endpoint de seed
4. **`package.json`** - Scripts adicionales para Story 1.1

## Benefits

✅ **Cero configuración manual** - Los tests siempre tienen los datos que necesitan
✅ **Tests más confiables** - No fallan por falta de datos de prueba
✅ **Faster feedback** - Seed automático solo cuando es necesario
✅ **Seguro** - Endpoint protegido en producción
✅ **CI/CD friendly** - Funciona automáticamente en pipelines
