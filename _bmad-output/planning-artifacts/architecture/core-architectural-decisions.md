# Core Architectural Decisions

## Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Frontend Framework: Next.js 15.0.3 + TypeScript 5.3.3
- Database & ORM: Neon PostgreSQL + Prisma 5.22.0
- Authentication: NextAuth.js 4.24.7 (Credentials provider)
- Component Library: shadcn/ui + Radix UI (WCAG AA compliant)
- Validation: Zod 3.23.8 (type-safe schema validation)
- Authorization: PBAC con 15 capacidades granulares (middleware + Server Actions + UI)

**Important Decisions (Shape Architecture):**
- State Management: Híbrido Server Components + TanStack Query 5.51.0
- Real-time: Server-Sent Events (SSE) con auto-reconnection
- Form Handling: React Hook Form 7.51.5 + Zod integration
- Data Modeling: Tablas específicas por nivel (jerarquía 5 niveles estricta)
- Error Handling: Custom Error Classes + Error Handler Middleware
- API Design: REST versionado `/v1/` + Server Actions híbrido
- Styling: Tailwind CSS 3.4.1 con design system del PRD
- Icons: Lucide React 0.344.0

**Deferred Decisions (Post-MVP):**
- Redis distributed caching (migrar desde Next.js Data Cache cuando sea necesario)
- Sentry error tracking (añadir en Phase 2 cuando haya errores reales)
- Upstash Redis rate limiting (migrar desde in-memory cuando sea necesario)
- Neon Scale plan (más retención de backups cuando se requiera)

## Data Architecture

**Database:** Neon PostgreSQL (serverless, compatible con Vercel)

**ORM:** Prisma 5.22.0
- Rationale: Type-safe, migraciones integradas, compatible con Next.js 15
- Version verified: Latest stable Ene 2025
- Affects: Todo el acceso a datos, models, queries
- Provided by Starter: No - manual setup required

**Validation Strategy:** Zod 3.23.8
- Rationale: Type-safe autogenera TypeScript types, reutilizable frontend/backend, compatible NextAuth.js
- Version verified: Latest stable Ene 2025
- Affects: Formularios, API inputs, data validation
- Provided by Starter: No

**State Management:** Híbrido Server Components + TanStack Query 5.51.0
- Rationale: Server Components por defecto (mejor performance) + TanStack Query para datos en tiempo real (KPIs cada 30s)
- Version verified: Latest stable Ene 2025
- Affects: Componentes de dashboard, KPIs, OTs en tiempo real
- Provided by Starter: TanStack Query requiere instalación manual

**Database Schema Organization:** Tablas Específicas por Nivel
- Rationale: Validación nativa de jerarquía de 5 niveles, type-safe completo, queries claras (`db.planta.findUnique()`)
- Affects: Estructura de Prisma schema, queries de activos
- Estructura:
  ```
  Planta → Linea → Equipo → Componente → Repuesto
  (5 tablas relacionadas con foreign keys)
  ```

**Migration Strategy:** Prisma Migrate
- Rationale: Versionado de migrations, auto-generación de tipos, reversible, compatible Vercel
- Affects: Workflow de desarrollo, deployment automático
- Provided by Starter: No - requiere configuración inicial

**Caching Strategy:** Next.js Data Cache + Índices Prisma
- Rationale: Cero costo (Next.js incluido), suficiente para 100 usuarios, añadir Redis Phase 2 si es necesario
- Affects: Performance de búsquedas <200ms, KPIs cada 30s
- Provided by Starter: Next.js cache incluido, índices requieren configuración Prisma

## Authentication & Security

**Authentication Method:** NextAuth.js 4.24.7 (Credentials Provider)
- Rationale: Battle-tested, compatible Vercel, cero config, perfecto para email/password
- Version verified: Latest stable (NO usar v5 beta)
- Affects: Todo el sistema de auth, sesiones, protección de rutas
- Provided by Starter: No - requiere configuración manual

**Authorization Pattern:** Híbrido Middleware + Server Actions + UI Adaptativa
- Rationale: Defense in depth con 3 capas:
  1. Middleware global - protege rutas completas
  2. Server Actions - verificación granular por acción
  3. UI adaptativa - mejor UX (no mostrar botones sin permiso)
- Affects: Todas las funciones del sistema según 15 capacidades PBAC
- Provided by Starter: No - requiere implementación custom

**Password Hashing:** bcryptjs 2.4.3
- Rationale: Battle-tested desde 2007, compatible NextAuth.js, funciona en Vercel serverless (no native bindings)
- Version verified: Latest stable Ene 2025
- Affects: User model, login flow, security
- Provided by Starter: No - requiere instalación manual

**API Security Strategy:** Rate limiting en memoria + Built-in protections
- Rationale: Suficiente para 100 usuarios, cero costo, migrar a Upstash Redis Phase 2
- Affects: Login endpoint (5 intentos / 15 min), protección contra fuerza bruta
- Protecciones incluidas:
  - Zod sanitiza inputs (previene XSS)
  - Prisma previene SQL injection (parámetros)
  - Vercel fuerza HTTPS automáticamente

## API & Communication Patterns

**API Design:** REST versionado `/v1/` + Server Actions híbrido
- Rationale: Server Actions para frontend simple (80% casos) + API Routes REST para integración ERP futura (Phase 3)
- Affects: Estructura de `/api/v1/`, Server Actions en `/app/actions/`
- Estructura:
  ```
  app/api/v1/
    ├── auth/[...nextauth]/
    ├── assets/[id]/route.ts
    ├── work-orders/[id]/complete/route.ts
    ├── kpis/route.ts
    └── sse/route.ts
  ```

**Real-time Communication:** Server-Sent Events (SSE) Manual
- Rationale: Más simple que WebSockets, compatible con Vercel serverless, cumple requisitos (heartbeat 30s, reconexión <30s)
- Affects: Endpoint `/api/v1/sse`, cliente con auto-reconnection
- Compromiso: Sin real-time <1s, pero suficiente con actualizaciones cada 30s (cumple NFR modificados)

**Error Handling:** Custom Error Classes + Error Handler Middleware
- Rationale: Type-safe, format consistente, mensajes en castellano, información rica con contexto
- Affects: Todas las APIs y Server Actions
- Clases definidas:
  ```typescript
  AppError (base)
  ├── ValidationError (400)
  ├── AuthorizationError (403)
  ├── InsufficientStockError (400) - específico del dominio
  └── InternalError (500)
  ```

## Frontend Architecture

**Component Architecture:** shadcn/ui + Radix UI
- Rationale: Componentes copiados a tu códigobase (100% personalizable), basado en Radix UI (WCAG AA), integrado con Tailwind
- Affects: Todos los componentes UI (Button, Card, Dialog, Form, Table, Toast)
- Provided by Starter: No - requiere inicialización con `npx shadcn-ui@latest init`

**Form Handling:** React Hook Form 7.51.5 + Zod
- Rationale: Validación en tiempo real, type-safe con Zod, UX rica (errors, loading states), integración con shadcn/ui Form
- Version verified: Latest stable Ene 2025
- Affects: Todos los formularios (reporte avería, OTs, usuarios, importación CSV)
- Provided by Starter: No - requiere instalación manual

**Icons:** Lucide React 0.344.0
- Rationale: Tree-shakeable (solo importa lo que usas), integrado con shadcn/ui, consistente estilo
- Version verified: Latest stable Ene 2025
- Affects: Iconos de navegación, estados, acciones
- Provided by Starter: No - requiere instalación manual

**Routing Strategy:** Next.js App Router (file-based routing)
- Affects: Estructura de `/app/`, layout anidado, Server vs Client Components
- Provided by Starter: Yes - Next.js 15 incluye App Router por defecto

**Performance Optimization:** Server Components por defecto + TanStack Query selectivo
- Server Components: Zero JavaScript al cliente para datos estáticos
- TanStack Query: Solo para datos que cambian frecuentemente (KPIs, OTs)
- Affects: Bundle size, initial load time, UX general

## Infrastructure & Deployment

**Hosting Strategy:** Vercel
- Rationale: Zero config, preview deployments, rollback instantáneo, automatic HTTPS, Edge deployment
- Affects: Todo el pipeline de deployment, preview URLs, producción
- Provided by Starter: Yes - Next.js es optimizado para Vercel

**CI/CD Pipeline:** Vercel GitHub Integration nativo
- Rationale: Zero config, deploy automático a main, preview deployments por PR, rollback 1-click
- Affects: Workflow de desarrollo, code review, deployment
- Workflow:
  ```
  git push origin feature-branch → Preview URL automática
  PR + merge → Deploy automático a producción
  ```

**Environment Configuration:** Vercel Variables + .env.example
- Rationale: Separación clara (dev local vs producción), documentación con .env.example, seguro
- Affects: Configuración de DATABASE_URL, NEXTAUTH_SECRET, etc.
- Setup:
  - Desarrollo: `.env.local` (gitignored)
  - Documentación: `.env.example` (committed)
  - Producción: Vercel Dashboard → Environment Variables

**Monitoring & Error Tracking:** Vercel Analytics (MVP) + Sentry (futuro)
- Vercel Analytics: Gratis, incluido, Web Vitals, page views, device breakdown
- Sentry: Phase 2 (cuando haya errores reales) - $26/mes Team plan
- Affects: Visibilidad de errores, performance, user behavior
- Cumple: NFR-P2 (carga <3s monitoreado)

**Database Backup Strategy:** Neon Native Backups
- Rationale: Backups diarios automáticos, point-in-time recovery, RTO <4 horas (cumple NFR-R3), gratis incluido
- Affects: Disaster recovery, compliance de backups diarios (NFR-R2)
- Plan free: 7 días retención
- Plan Scale ($19/mes): 30 días retención

**Scaling Strategy:** Vercel Automatic Scaling + Neon Vertical Scaling
- Vercel: Escala horizontal automáticamente (serverless)
- Neon: Escala vertical con upgrades de plan
- Affects: Capacidad de crecimiento hasta 10,000 activos, 100 usuarios concurrentes (cumple NFR-SC1, NFR-SC2)

## Decision Impact Analysis

**Implementation Sequence:**

1. **Setup Inicial (Story 1):**
   - create-next-app con configuración manual
   - Instalar dependencias críticas (Prisma, NextAuth, Zod, shadcn/ui)

2. **Infraestructura Core (Stories 2-4):**
   - Configurar Prisma + Neon (schema inicial)
   - Configurar NextAuth.js (Credentials provider)
   - Implementar PBAC middleware + Server Actions
   - Setup SSE infrastructure

3. **Data Layer (Stories 5-6):**
   - Definir schema Prisma con 5 niveles
   - Implementar migrations con Prisma Migrate
   - Crear índices para búsquedas <200ms

4. **UI Components (Stories 7-10):**
   - Instalar shadcn/ui componentes base
   - Configurar Tailwind con design system (colores semáforo)
   - Implementar formularios con React Hook Form + Zod
   - Crear layouts responsive (3 breakpoints)

5. **API Development (Stories 11-15):**
   - Server Actions para operaciones CRUD
   - API Routes REST para integración futura
   - Error handling middleware
   - SSE endpoint con heartbeat

6. **Testing & Deployment (Stories 16-18):**
   - Configurar Vercel GitHub Integration
   - Setup environment variables
   - Deploy inicial a producción
   - Validar backups y restores

**Cross-Component Dependencies:**

- **Authentication → Authorization:** NextAuth debe estar configurado antes de implementar PBAC middleware
- **Prisma → Migrations:** Schema debe estar definido antes de crear primera migration
- **Tailwind → shadcn/ui:** Design system configurado antes de instalar componentes
- **Server Components → TanStack Query:** Decidir qué componentes son Client vs Server antes de implementar queries
- **SSE → KPIs:** Infraestructura SSE lista antes de implementar dashboard en tiempo real
- **Error Handling → APIs:** Middleware de errores antes de implementar endpoints
- **Vercel → Environment Variables:** Variables configuradas antes de primer deploy

**Versiones Estables Verificadas (Enero 2025):**

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| Next.js | 15.0.3 | Frontend framework |
| React | 18.3.1 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Prisma | 5.22.0 | ORM |
| @prisma/client | 5.22.0 | Prisma Client |
| NextAuth.js | 4.24.7 | Authentication (ESTABLE, NO v5 beta) |
| Tailwind CSS | 3.4.1 | Styling |
| Zod | 3.23.8 | Validation |
| TanStack Query | 5.51.0 | Data fetching |
| React Hook Form | 7.51.5 | Form handling |
| shadcn/ui | Latest | Component library (code copied to project) |
| Radix UI | Latest | Accessible primitives (via shadcn/ui) |
| Lucide React | 0.344.0 | Icons |
| bcryptjs | 2.4.3 | Password hashing |
| Node.js | 20.11.1 LTS | Runtime |

⚠️ **IMPORTANTE:** Verificar versiones actuales antes de instalación:
```bash
npm view next version
npm view prisma version
npm view next-auth version
```
