# Vercel CI/CD Setup Guide
# Story 0.5: Error Handling, Observability y CI/CD

## Overview

Esta guía documenta los pasos para configurar el pipeline de CI/CD con Vercel para el proyecto GMAO Hiansa.

## Prerequisites

- Cuenta de Vercel (https://vercel.com)
- Repositorio de GitHub con el código del proyecto
- Cuenta de Neon PostgreSQL (base de datos)

## Step 1: Conectar GitHub Repository a Vercel

1. Ir a https://vercel.com/dashboard
2. Click en "Add New Project"
3. Seleccionar "Import Git Repository"
4. Conectar cuenta de GitHub si no está conectada
5. Seleccionar el repositorio `gmao-hiansa`
6. Click en "Import"

## Step 2: Configurar Build Settings

Vercel detectará automáticamente que es un proyecto Next.js y configurará:

```json
{
  "buildCommand": "prisma generate && npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Nota:** El archivo `vercel.json` ya incluye esta configuración.

## Step 3: Configurar Environment Variables

En Vercel Dashboard → Settings → Environment Variables, agregar:

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret para NextAuth sessions | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de la aplicación | `https://your-app.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `LOG_LEVEL` | Logging level | `info` |
| `PERFORMANCE_THRESHOLD_MS` | Performance tracking threshold | `1000` |

### Generando NEXTAUTH_SECRET

```bash
# En terminal:
openssl rand -base64 32
```

Copiar el output y pegarlo en la variable `NEXTAUTH_SECRET` en Vercel.

## Step 4: Configurar Preview Deployments

Vercel automáticamente configura preview deployments para cada pull request.

**Settings:**
- Preview deployments: ✅ Enabled (automático)
- Deploy previews on: ✅ All branches
- Auto-assign custom domains: ❌ Disabled (default)

## Step 5: Configurar Production Deployments

**Automatic Deployments:**

Vercel hará deploy automático a producción cuando:
- ✅ Pull request es mergeado a `main`
- ✅ Push directo a `main` (si está habilitado)

**Para configurar:**

1. Ir a: Settings → Git
2. Seleccionar "Branches"
3. Configurar:
   - Production Branch: `main`
   - Automatic Deployments: ✅ Enabled
   - GitHub Checks: ⚠️ Optional (requiere GitHub Actions workflow separado)

**Nota sobre GitHub Checks:**
- Para usar GitHub Checks, necesitas configurar un GitHub Actions workflow que ejecute los tests
- Esto es opcional y requiere configuración adicional en `.github/workflows/`
- Si no configuras GitHub Actions, Vercel hará deploy sin esperar checks externos

## Step 6: Verificar Rollback Capability

Vercel tiene **rollback 1-click** habilitado por defecto.

**Para hacer rollback:**

1. Ir a: Deployments tab
2. Encontrar el deployment previo exitoso
3. Click en "..." menu
4. Seleccionar "Promote to Production"
5. Confirmar

**Nota:** Los anteriores deployments quedan disponibles para rollback instantáneo.

## Step 7: Configurar Custom Domain (Optional)

**Para configurar dominio personalizado:**

1. Ir a: Settings → Domains
2. Click en "Add Domain"
3. Ingresar el dominio (ej: `gmao.miempresa.com`)
4. Configurar DNS según instrucciones de Vercel:
   ```
   Type: CNAME
   Name: gmao
   Value: cname.vercel-dns.com
   ```
5. Esperar validación de DNS

## Step 8: Configurar Database (Neon PostgreSQL)

**Si usas Neon PostgreSQL:**

1. Ir a https://console.neon.tech
2. Crear nuevo proyecto o usar existente
3. Copiar connection string
4. Pegar en variable `DATABASE_URL` en Vercel

**Connection String Format:**
```
postgresql://user:password@ep-cool-region.aws.neon.tech/dbname?sslmode=require
```

**Importante:** Usar `?sslmode=require` para conexiones seguras.

## Step 9: Verificar Deployment

**Después del primer deployment:**

1. Ir a: Deployments tab
2. Verificar que el deployment esté "Ready"
3. Click en la URL del deployment
4. Verificar health check: `https://your-app.vercel.app/api/v1/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-09T...",
  "services": {
    "database": "up",
    "version": "0.1.0"
  }
}
```

## Step 10: Configurar Vercel Analytics (Optional)

**Para habilitar analytics:**

1. Ir a: Analytics tab
2. Click en "Enable Analytics"
3. Configurar:
   - Web Vitals: ✅ Enabled
   - Pageviews: ✅ Enabled
   - Sessions: ✅ Enabled

## CI/CD Pipeline Summary

```
Developer pushes to branch
        ↓
GitHub sends webhook to Vercel
        ↓
Vercel runs: prisma generate && npm run build
        ↓
Run tests (si configurado)
        ↓
Create Preview Deployment
        ↓
Wait for PR approval
        ↓
PR merged to main
        ↓
Vercel triggers Production Deployment
        ↓
Zero-downtime deploy to production
        ↓
New version live at production URL
```

## Troubleshooting

### Build Failures

**Error: `prisma generate` fails**
```
Solution: Verificar que DATABASE_URL esté configurada correctamente
```

**Error: `Cannot find module`**
```
Solution: Verificar que node_modules esté instalado correctamente
```

### Deployment Failures

**Error: `Database connection failed`**
```
Solution: Verificar que DATABASE_URL incluye ?sslmode=require
```

**Error: `NEXTAUTH_SECRET not set`**
```
Solution: Generar secret con openssl y configurar en environment variables
```

### Runtime Errors

**Error: `Health check returning 503`**
```
Solution: Verificar conexión a base de datos
Check: /api/v1/health endpoint
```

## Monitoring

### Vercel Dashboard

**Key Metrics to Monitor:**
- Build time
- Deployment frequency
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- Throughput (requests/second)

### Logs

**Para ver logs en tiempo real:**

1. Ir a: Deployment tab
2. Click en deployment activo
3. Ver "Realtime Logs"
4. Filtrar por:
   - Level: error, warn
   - Path: /api/v1/*
   - Status code: 500, 503

### Performance

**Para monitorear performance:**

1. Ir a: Analytics tab
2. Ver Web Vitals:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)
3. Verifica que cumpla con Core Web Vitals thresholds

## Security Best Practices

1. **Environment Variables:** Nunca commitear .env.local a git
2. **Secrets:** Usar Vercel environment variables para secrets
3. **HTTPS:** Vercel usa HTTPS por defecto
4. **Headers:** Configurar security headers en next.config.js
5. **Rate Limiting:** Ya implementado en SSE (aplicar a otros endpoints según needed)

## Next Steps

1. ✅ Conectar repo a Vercel
2. ✅ Configurar environment variables
3. ✅ Verificar preview deployments funcionan
4. ✅ Hacer primer deployment a producción
5. ✅ Verificar health check endpoint
6. ✅ Configurar dominio custom (opcional)
7. ✅ Set up monitoring y alertas

## References

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Neon PostgreSQL: https://neon.tech/docs
- NextAuth.js Deployment: https://next-auth.js.org/deployment
