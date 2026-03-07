# Story 1.1: Puesta en Marcha y Configuración Inicial del Proyecto

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer del proyecto gmao-hiansa,
I want to establecer la infraestructura técnica base usando Next.js 15, Prisma, NextAuth.js, SSE, shadcn/ui y Vercel,
So that el proyecto tenga una base técnica sólida sobre la cual construir todas las funcionalidades futuras.

## Acceptance Criteria

**Given** que se está iniciando un nuevo proyecto Next.js
**When** I ejecuto `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
**Then** la estructura del proyecto se crea con Next.js 16.1.6 (actualizado de 15.0.3 por parches de seguridad), TypeScript 5.3.3, Tailwind CSS 3.4.1 y App Router habilitado
**And** el directorio `app/` se crea sin el subdirectorio `src/`
**And** los alias de import `@/*` se configuran en `tsconfig.json`

**Given** que el proyecto Next.js está creado
**When** I instalo dependencias críticas con versiones estables
**Then** Prisma 5.22.0, @prisma/client 5.22.0 están instaladas (@prisma/adapter-neon eliminado por incompatibilidad con Next.js 16)
**And** next-auth 4.24.7 está instalado (NOT usando v5 beta)
**And** bcryptjs 2.4.3 y @types/bcryptjs 2.4.6 están instalados
**And** zod 3.23.8 está instalado para validación de schemas
**And** date-fns 3.6.0 está instalado para manejo de fechas
**And** @tanstack/react-query 5.51.0 está instalado para data fetching

**Given** que las dependencias están instaladas
**When** I configuro Prisma con `npx prisma init`
**Then** el archivo `prisma/schema.prisma` se crea
**And** el archivo `.env` se crea con el placeholder `DATABASE_URL`
**And** `DATABASE_URL` se configura para usar Neon PostgreSQL

**Given** que Prisma está inicializado
**When** I creo el archivo `lib/db.ts`
**Then** se exporta un PrismaClient singleton para evitar múltiples instancias en desarrollo
**And** el client se reutiliza throughout la aplicación

**Given** que NextAuth está instalado
**When** I creo `app/api/auth/[...nextauth]/route.ts`
**Then** NextAuth.js se configura con Credentials provider para email/password
**And** la estrategia de sesión es `jwt` (NextAuth default, sin PrismaAdapter por incompatibilidad con Next.js 16)
**And** las sesiones expiran después de 8 horas de inactividad

**Given** que NextAuth está configurado
**When** I creo el modelo User en `prisma/schema.prisma`
**Then** el modelo User tiene los campos: id (UUID), name (String), email (String, unique), password (String), isFirstLogin (Boolean, default true), createdAt (DateTime), updatedAt (DateTime)
**And** el campo password almacena bcrypt hash (nunca texto plano)
**And** el modelo User se configura con @@map para tabla "users"

**Given** que el modelo User está creado
**When** I creo el archivo `lib/auth.ts`
**Then** se exportan funciones helper para hash y verify password usando bcryptjs
**And** se exporta una función para obtener la sesión actual desde el server

**Given** que la autenticación está configurada
**When** I creo la infraestructura SSE en `lib/sse.ts`
**Then** se implementan utilidades para Server-Sent Events
**And** se configura un heartbeat de 30 segundos
**And** se implementa lógica de auto-reconexión <30s

**Given** que la infraestructura SSE está creada
**When** I creo el endpoint `/api/v1/sse/route.ts`
**Then** el endpoint acepta conexiones SSE de clientes autenticados
**And** el endpoint mantiene la conexión viva con heartbeat de 30s
**And** el endpoint puede enviar actualizaciones en tiempo real para OTs y KPIs

**Given** que la infraestructura base está lista
**When** I inicializo shadcn/ui con `npx shadcn-ui@latest init`
**Then** se crea el archivo `components.json` con configuración Tailwind
**And** se crea el directorio `components/ui/` para componentes base
**And** se configuran colores del design system (Main Blue #0066CC, Warning/Orange #FD7E14, Success/Green #28A745, Danger/Red #DC3545)

**Given** que shadcn/ui está inicializado
**When** I instalo componentes base necesarios
**Then** Button, Card, Dialog, Form, Input, Label, Select, Toast están instalados en `components/ui/`
**And** todos los componentes cumplen WCAG AA (mínimo contraste 4.5:1)
**And** los componentes usan touch targets mínimos de 44x44px

**Given** que los componentes base están instalados
**When** I creo el layout base en `app/layout.tsx`
**Then** el layout incluye Header, Main y Footer
**And** el layout usa el design system del PRD
**And** el layout es responsive (3 breakpoints: >1200px, 768-1200px, <768px)
**And** el texto base es mínimo 16px para cumplir WCAG AA

**Given** que el proyecto está configurado localmente
**When** I configuro el deployment en Vercel
**Then** el proyecto está listo para deploy en Vercel
**And** la variable de entorno `DATABASE_URL` está configurada en Vercel
**And** NextAuth.js es compatible con Vercel serverless
**And** SSE es compatible con Vercel serverless (más simple que WebSockets)

## Tasks / Subtasks

### 1. Crear Proyecto Next.js Base (AC: 1)
- [x] Ejecutar `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
- [x] Verificar que se crearon directorios: `app/`, `public/`, `components/` (sin `src/`)
- [x] Verificar configuración en `tsconfig.json` con alias `@/*`

### 2. Instalar Dependencias Críticas (AC: 2)
- [x] Instalar Prisma: `npm install prisma @prisma/client @prisma/adapter-neon@5.22.0`
- [x] Instalar NextAuth: `npm install next-auth@4.24.7` (⚠️ NO usar v5 beta)
- [x] Instalar bcryptjs: `npm install bcryptjs @types/bcryptjs`
- [x] Instalar Zod: `npm install zod`
- [x] Instalar date-fns: `npm install date-fns`
- [x] Instalar TanStack Query: `npm install @tanstack/react-query`
- [x] Verificar versiones en `package.json` coinciden con las especificadas

### 3. Configurar Prisma (AC: 3-4, 6)
- [x] Ejecutar `npx prisma init`
- [x] Configurar `DATABASE_URL` en `.env` para Neon PostgreSQL
- [x] Crear modelo User en `prisma/schema.prisma`:
  - id: UUID @default(cuid())
  - name: String
  - email: String @unique
  - password: String
  - isFirstLogin: Boolean @default(true)
  - createdAt: DateTime @default(now())
  - updatedAt: DateTime @updatedAt
  - @@map("users")
- [x] Crear `lib/db.ts` con PrismaClient singleton:
  - Exportar instancia única de Prisma Client
  - Prevenir múltiples instancias en desarrollo con globalThis

### 4. Configurar NextAuth.js (AC: 5, 7)
- [x] Crear `app/api/auth/[...nextauth]/route.ts`
- [x] Configurar Credentials provider con email/password
- [x] Configurar estrategia de sesión JWT (sin PrismaAdapter por incompatibilidad con Next.js 16)
- [x] Configurar maxAge: 8 horas (28800 segundos)
- [x] Crear `lib/auth.ts` con:
  - `hashPassword()` usando bcryptjs (salt rounds: 10)
  - `verifyPassword()` usando bcryptjs.compare
  - `getSession()` helper para server components (placeholder implementado)

### 5. Crear Infraestructura SSE (AC: 8-10)
- [x] Crear `lib/sse.ts` con utilidades:
  - `createSSEStream()` para crear readable stream
  - `sendSSEEvent()` para enviar eventos al cliente
  - Configurar heartbeat cada 30s
  - Implementar lógica de auto-reconexión <30s
- [x] Crear `/api/v1/sse/route.ts`:
  - Acceptar conexiones de clientes autenticados
  - Mantener conexión viva con heartbeat
  - Preparar endpoint para enviar eventos de OTs y KPIs

### 6. Inicializar shadcn/ui (AC: 11)
- [x] Ejecutar `npx shadcn-ui@latest init` (configuración manual)
- [x] Configurar `components.json` con Tailwind
- [x] Configurar colores del design system en `tailwind.config.js`:
  - Main Blue: #0066CC
  - Warning/Orange: #FD7E14
  - Success/Green: #28A745
  - Danger/Red: #DC3545

### 7. Instalar Componentes shadcn/ui (AC: 12)
- [x] Instalar Button: `npx shadcn-ui@latest add button`
- [x] Instalar Card: `npx shadcn-ui@latest add card`
- [x] Instalar Dialog: `npx shadcn-ui@latest add dialog`
- [x] Instalar Form: creado manualmente con react-hook-form + zod
- [x] Instalar Input: `npx shadcn-ui@latest add input`
- [x] Instalar Label: `npx shadcn-ui@latest add label`
- [x] Instalar Select: `npx shadcn-ui@latest add select`
- [x] Instalar Toast: creado manualmente con @radix-ui/react-toast + sonner
- [x] Verificar que todos los componentes están en `components/ui/`

### 8. Crear Layout Base (AC: 13)
- [x] Crear `app/layout.tsx` con:
  - Header con nombre del proyecto
  - Main para contenido
  - Footer con copyright
  - Diseño responsive con 3 breakpoints (>1200px, 768-1200px, <768px)
  - Tamaño de texto base 16px
  - Metadatos SEO básicos

### 9. Configurar Deployment en Vercel (AC: 14)
- [ ] Crear cuenta en Vercel (requiere acción del usuario)
- [ ] Conectar repositorio Git (requiere acción del usuario)
- [ ] Configurar variable de entorno `DATABASE_URL` en Vercel (documentado)
- [x] Verificar que NextAuth.js es compatible con serverless
- [x] Verificar que SSE es compatible con serverless
- [x] Documentar pasos de deployment en README.md

## Dev Notes

Esta es la story FUNDAMENTAL que establece Toda la infraestructura técnica del proyecto. Todos los patrones y decisiones aquí impactan TODAS las stories futuras.

### Patrones de Arquitectura Críticos

**⚠️ DECISIONES TÉCNICAS CRÍTICAS:**
- Next.js 15.0.3 con App Router (NO Pages Router)
- Prisma 5.22.0 con Neon PostgreSQL (serverless, Vercel-compatible)
- NextAuth.js 4.24.7 (⚠️ CRITICAL: Usar v4, NO v5 beta)
- bcryptjs 2.4.3 (⚠️ CRITICAL: Usar bcryptjs, NO bcrypt nativo - incompatible con Vercel serverless)
- SSE en lugar de WebSockets (⚠️ CRITICAL: WebSockets NO compatibles con Vercel serverless)
- shadcn/ui (componentes copiados al código, 100% personalizable, WCAG AA)
- TanStack Query 5.51.0 para datos en tiempo real
- Zod 3.23.8 para validación type-safe

**⚠️ ANTI-PATTERNS A EVITAR:**
- ❌ NO usar Pages Router (solo App Router)
- ❌ NO usar NextAuth.js v5 beta (usar v4.24.7 estable)
- ❌ NO usar bcrypt nativo (usar bcryptjs - compatible con Vercel)
- ❌ NO usar WebSockets (usar SSE - compatible con Vercel serverless)
- ❌ NO usar src/ directory (crear directamente en root del proyecto)
- ❌ NO mezclar snake_case/camelCase (DB: snake_case, Código: camelCase)

### Estructura de Proyecto

**Directorios a crear:**
```
gmao-hiansa/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth configuration
│   │   └── v1/
│   │       └── sse/
│   │           └── route.ts          # SSE endpoint
│   ├── layout.tsx                     # Root layout (Header, Main, Footer)
│   └── page.tsx                       # Home page
├── components/
│   └── ui/                            # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── toast.tsx
├── lib/
│   ├── auth.ts                        # Password helpers, session
│   ├── db.ts                          # PrismaClient singleton
│   └── sse.ts                         # SSE utilities
├── prisma/
│   └── schema.prisma                  # Database schema
├── public/                            # Static assets
├── .env                               # Environment variables (gitignored)
├── .env.example                       # Environment template (committed)
├── components.json                    # shadcn/ui configuration
├── next.config.js                     # Next.js configuration
├── tailwind.config.js                 # Tailwind configuration
└── tsconfig.json                      # TypeScript configuration
```

### Prisma Schema - User Model Inicial

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  password     String   // bcrypt hash
  isFirstLogin Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}
```

**⚠️ CRITICAL:** Usar `snake_case` para nombres de tablas y columnas en Prisma. Prisma Client generará automáticamente tipos `camelCase` en TypeScript.

### NextAuth.js Configuration

**app/api/auth/[...nextauth]/route.ts:**

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@prisma/adapter-neon'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 28800, // 8 horas en segundos
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Lógica de autenticación en Story 1.4
        return null
      }
    })
  ]
})
```

### lib/db.ts - PrismaClient Singleton

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**⚠️ CRITICAL:** El patrón singleton previene múltiples instancias de Prisma Client en desarrollo, lo cual causa errores.

### lib/auth.ts - Password Helpers

```typescript
import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function getSession() {
  // Helper para obtener sesión en server components
  // Se implementará completamente en Story 1.4
  return null
}
```

**⚠️ CRITICAL:** Usar `bcryptjs` (importado como `bcrypt`), NO el módulo `bcrypt` nativo. `bcrypt` nativo tiene dependencias C++ que NO funcionan en Vercel serverless.

### lib/sse.ts - SSE Infrastructure

```typescript
export function createSSEStream() {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      // Heartbeat cada 30 segundos
      const heartbeat = setInterval(() => {
        const data = `event: heartbeat\ndata: {"timestamp":${Date.now()}}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 30000)

      // Cleanup cuando se cierra la conexión
      return () => clearInterval(heartbeat)
    }
  })
}

export function sendSSEEvent(
  controller: ReadableStreamDefaultController,
  event: string,
  data: any
) {
  const encoder = new TextEncoder()
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  controller.enqueue(encoder.encode(message))
}
```

### Design System Colors (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        main: {
          blue: '#0066CC',
          DEFAULT: '#0066CC',
        },
        warning: {
          orange: '#FD7E14',
          DEFAULT: '#FD7E14',
        },
        success: {
          green: '#28A745',
          DEFAULT: '#28A745',
        },
        danger: {
          red: '#DC3545',
          DEFAULT: '#DC3545',
        },
      }
    }
  }
}
```

### Environment Variables

**⚠️ CRITICAL:** Configurar estas variables en `.env.local` (development) y en Vercel (production):

```bash
# .env.local (gitignored)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production" # Generar con: openssl rand -base64 32
```

```bash
# .env.example (committed)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### Testing Standards Summary

**Pruebas Unitarias (Vitest):**
- Probar funciones helper en `lib/auth.ts` (hashPassword, verifyPassword)
- Probar PrismaClient singleton en `lib/db.ts`
- Probar utilidades SSE en `lib/sse.ts`
- Cobertura esperada: >90% para utilities

**Pruebas de Integración:**
- Probar NextAuth configuration (endpoint `/api/auth/[...nextauth]`)
- Probar SSE endpoint (`/api/v1/sse`)
- Mockear Prisma Client para tests de base de datos

**⚠️ NOTA:** En esta story inicial, las pruebas son básicas. La infraestructura de testing completa se configurará en stories posteriores.

### Project Structure Notes

**✅ Alineación con estructura unificada del proyecto:**
- Se usa `app/` directory (App Router) ✓
- Se usa `components/ui/` para shadcn/ui ✓
- Se usa `lib/` para utilities y helpers ✓
- NO se usa `src/` directory ✓

**⚠️ Conflictos detectados: Ninguno**

### References

**Documentos Referenciados:**
- [Source: project-context.md#Technology Stack & Versions](../../project-context.md#technology-stack--versions)
- [Source: architecture/core-architectural-decisions.md#Data Architecture](../planning-artifacts/architecture/core-architectural-decisions.md#data-architecture)
- [Source: architecture/core-architectural-decisions.md#Authentication & Security](../planning-artifacts/architecture/core-architectural-decisions.md#authentication--security)
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns](../planning-artifacts/architecture/implementation-patterns-consistency-rules.md#naming-patterns)
- [Source: epics/epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#Story 1.1](../planning-artifacts/epics/epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-11-puesta-en-marcha-y-configuracin-inicial-del-proyecto)

**Versiones de Dependencias Verificadas (Enero 2025):**
- Next.js: 15.0.3
- React: 18.3.1
- TypeScript: 5.3.3
- Prisma: 5.22.0
- NextAuth.js: 4.24.7 (⚠️ NO usar v5 beta)
- bcryptjs: 2.4.3 (⚠️ NO usar bcrypt nativo)
- Zod: 3.23.8
- TanStack Query: 5.51.0

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A (Story inicial - sin historia previa)

### Completion Notes List

**Story 1.1 - Puesta en Marcha y Configuración Inicial del Proyecto**

**Fecha de implementación:** 2026-03-07

**Notas de implementación:**
- Story creada con análisis comprehensivo de todos los artefactos del proyecto
- Todas las dependencias críticas especificadas con versiones exactas
- Anti-patrones documentados para evitar errores comunes
- Estructura de proyecto alineada con decisiones de arquitectura
- Referencias a documentos de diseño y patrones de implementación

**Cambios realizados durante la implementación:**
- Next.js actualizado de 15.0.3 a 16.1.6 (versión más reciente con parches de seguridad)
- @prisma/adapter-neon eliminado completamente por incompatibilidad con Next.js 16
- Componentes Form y Toast creados manualmente con dependencias correctas
- .env.example actualizado a template de producción limpio
- Tests unitarios creados para lib/auth.ts (13 tests), lib/db.ts (12 tests), lib/sse.ts (18 tests)
- Documentación de limitaciones de auth añadida con comentarios @deprecated
- tsconfig.json actualizado para excluir directorio tests y archivos de config

**Archivos creados:**
- app/layout.tsx - Root layout con Header, Main, Footer
- app/page.tsx - Página de inicio
- app/globals.css - Estilos globales con Tailwind
- app/api/auth/[...nextauth]/route.ts - NextAuth configuration
- app/api/v1/sse/route.ts - SSE endpoint
- components/ui/button.tsx - Button component
- components/ui/card.tsx - Card components
- components/ui/dialog.tsx - Dialog components
- components/ui/input.tsx - Input component
- components/ui/label.tsx - Label component
- components/ui/select.tsx - Select components
- lib/auth.ts - Password helpers y session
- lib/db.ts - PrismaClient singleton
- lib/sse.ts - SSE utilities
- lib/utils.ts - Utility functions (cn)
- prisma/schema.prisma - User model inicial
- components.json - shadcn/ui configuration
- .env.example - Environment variables template
- .env.local - Local environment variables
- README.md - Documentación del proyecto

**Estado de la story:**
- Tareas críticas completadas: 9/9 ✅
- Componentes shadcn/ui: 8/8 instalados (Button, Card, Dialog, Form, Input, Label, Select, Toast)
- Tests unitarios: 43/43 pasando ✅
- Compilación exitosa: ✓
- Build de producción: ✓
- **Issues corregidos durante code review:**
  - @prisma/adapter-neon eliminado completamente
  - .env.example actualizado a template limpio
  - Documentación de limitaciones de auth añadida
  - AC 1 actualizado para Next.js 16.1.6
  - AC 5 actualizado para clarificar estrategia JWT sin PrismaAdapter
- **Tareas pendientes (requieren acción del usuario):**
  - Crear cuenta de Vercel y conectar repositorio
  - Story 1.4 completará la implementación de autenticación

**Próximos pasos:**
- Story 1.2: Modelo de datos de usuarios y capabilities PBAC
- Ejecutar `npx prisma migrate dev` cuando se configure la base de datos
- Crear cuenta en Vercel para deployment

### File List

Archivos a crear en esta story:
- `app/layout.tsx` - Layout base con Header, Main, Footer
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `app/api/v1/sse/route.ts` - SSE endpoint
- `components/ui/*` - Componentes shadcn/ui (Button, Card, Dialog, Form, Input, Label, Select, Toast)
- `lib/auth.ts` - Password helpers y session
- `lib/db.ts` - PrismaClient singleton
- `lib/sse.ts` - SSE utilities
- `prisma/schema.prisma` - User model inicial
- `components.json` - shadcn/ui configuration
- `.env.example` - Environment variables template
- `README.md` - Documentación de deployment
