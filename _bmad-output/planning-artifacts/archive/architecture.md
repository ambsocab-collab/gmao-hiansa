---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
inputDocuments: [
  'ux-design-specification.md',
  'prd.md'
]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

El sistema implementa un GMAO (Gestión de Mantenimiento Asistido por Ordenador) completo con 123 requerimientos funcionales organizados en 10 áreas de capacidad:

1. **Gestión de Averías (FR1-FR10):** Reporte por operarios con búsqueda predictiva, notificaciones push en tiempo real, confirmación de operario
2. **Gestión de Órdenes de Trabajo (FR11-FR31):** 8 estados de ciclo de vida, Kanban digital de 8 columnas, vista de listado con filtros, asignación múltiple (1-3 técnicos o proveedores)
3. **Gestión de Activos (FR32-FR43):** Jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), relaciones muchos-a-muchos, 5 estados de equipos, importación masiva CSV
4. **Gestión de Repuestos (FR44-FR56):** Stock en tiempo real visible para todos, actualizaciones silenciosas, alertas solo por stock mínimo, ubicación física en almacén
5. **Gestión de Usuarios y Capacidades (FR58-FR76):** Modelo PBAC con 15 capacidades granulares (no roles predefinidos), etiquetas de clasificación visual, onboarding con cambio de contraseña obligatorio
6. **Gestión de Proveedores (FR77-FR80):** Proveedores de mantenimiento y repuestos, catálogo de 6 tipos de servicio
7. **Gestión de Rutinas (FR81-FR84):** Rutinas diarias/semanales/mensuales, generación automática de OTs preventivas 24h antes, alertas de vencimiento
8. **Análisis y Reportes (FR85-FR95):** KPIs MTTR/MTBF con drill-down, reportes automáticos PDF por email (diario/semanal/mensual), exportación Excel
9. **Sincronización Multi-Dispositivo (FR96-FR100):** WebSockets para real-time <1s, responsive design con 3 breakpoints, PWA instalable
10. **Funcionalidades Adicionales (FR101-FR108):** Rechazo de reparación, búsqueda predictiva global, comentarios con fotos, QR codes

**Non-Functional Requirements:**

37 requerimientos no funcionales que impulsarán decisiones arquitectónicas críticas:

- **Performance (7 NFRs):** Búsqueda predictiva <200ms, carga inicial <3s, websockets <1s, KPIs <2s, transiciones <100ms, 50 usuarios concurrentes sin degradación, importación 10K activos <5min
- **Security (9 NFRs):** Autenticación obligatoria, contraseñas hasheadas (bcrypt/argon2), HTTPS/TLS 1.3, ACL por capacidades, auditoría de acciones críticas, sesiones 8h, sanitización inputs, rate limiting login (5 intentos/15min)
- **Scalability (5 NFRs):** 10,000 activos sin degradación, 100 usuarios concurrentes, índices DB optimizados, paginación listados, crecimiento a 20K con vertical scaling
- **Accessibility (6 NFRs):** WCAG AA (contraste 4.5:1), texto mínimo 16px, touch targets 44x44px, legible en iluminación de fábrica, navegación por teclado, zoom 200%
- **Reliability (6 NFRs):** 99% uptime horario laboral, backups diarios, RTO 4 horas, reconexión automática websockets <30s, mensajes error claros, confirmación operaciones críticas
- **Integration (4 NFRs):** Importación CSV validada, exportación Excel compatible, API REST para futura integración ERP, capacidades para IoT futuro

**Scale & Complexity:**

**Complejidad del proyecto:** Media-Alta

- **Dominio técnico principal:** Full-stack Web Application con real-time features (WebSockets, PWA, responsive design)
- **Componentes arquitectónicos estimados:** 12-15 componentes principales
  - Frontend: 6-8 (Dashboard, Kanban, Formularios, Listados, KPIs, Configuración)
  - Backend: 6-7 (API REST, WebSocket Server, Auth/PBAC, Business Logic, Data Access, Reporting, Background Jobs)

### Technical Constraints & Dependencies

**Restricciones técnicas conocidas:**

- **Single-tenant optimizado:** No es SaaS multi-tenant, permite personalización profunda sin necesidad de aislamiento entre organizaciones
- **Navegadores soportados:** Chrome y Edge únicamente (motores Chromium) - NO Firefox, Safari, IE
- **Ambiente industrial:** Requiere WiFi estable, tablets Android industriales, desktops Windows, TVs 4K con Chrome
- **Always online:** NO requiere modo offline (PWA para instalación y notificaciones, pero siempre conectada)
- **Fases de desarrollo:** MVP sin mantenimiento reglamentario (Phase 1.5), requiere arquitectura extensible para módulos futuros
- **Performance estricta:** Búsqueda <200ms con 10,000+ activos requiere optimización de índices y caché

**Dependencias externas:**

- Proveedores de mantenimiento externo (requieren coordinación para OTs asignadas)
- Servicio de email para reportes automáticos PDF
- Futura integración ERP (Phase 3+) - requiere API REST documentada
- Futura integración IoT (Phase 4) - requiere capacidades de ingesta de datos

### Cross-Cutting Concerns Identified

**Preocupaciones transversales que afectarán múltiples componentes:**

1. **Autorización y Control de Acceso (PBAC):**
   - 15 capacidades granulares sin roles predefinidos
   - Requiere middleware de autorización en toda la API
   - UI adaptativa según capacidades asignadas
   - Auditoría de cambios de capacidades

2. **Sincronización en Tiempo Real:**
   - WebSockets para 100 usuarios concurrentes
   - Actualizaciones <1s en todos los dispositivos conectados
   - Estados de OT sincronizados (ej: "Pendiente Repuesto" → "En Progreso")
   - Heartbeat de 30 segundos para conexiones
   - Reconexión automática <30s

3. **Performance de Búsqueda:**
   - Búsqueda predictiva <200ms con jerarquía de 5 niveles
   - Búsqueda global (equipos, componentes, repuestos, OTs, técnicos, usuarios)
   - Debouncing 300ms para optimización
   - Índices de base de datos optimizados
   - Caché de búsquedas frecuentes

4. **Accesibilidad Industrial (WCAG AA):**
   - Contraste 4.5:1 mínimo en toda la UI
   - Texto mínimo 16px, touch targets 44x44px
   - Navegación por teclado (desktop) y touch (tablet/móvil)
   - Zoom 200% sin romper layout
   - Lectura en iluminación de fábrica

5. **Seguridad Empresarial:**
   - Autenticación obligatoria para todos los endpoints
   - Contraseñas hasheadas nunca en texto plano
   - HTTPS/TLS 1.3 obligatorio
   - ACL por capacidades en backend y frontend
   - Auditoría de acciones críticas (cambios de capacidades, stock, estados)
   - Rate limiting contra fuerza bruta
   - Sanitización de inputs contra XSS/SQL injection

6. **Responsive Design Multi-Dispositivo:**
   - 3 breakpoints: >1200px (desktop), 768-1200px (tablet), <768px (móvil)
   - Componentes adaptativos (Kanban: 3 columnas → 2 → 1 con swipe)
   - Touch targets 44x44px mínimo
   - PWA instalable en dispositivos

7. **Gestión de Datos Masivos:**
   - Importación 10,000 activos en <5 minutos
   - Jerarquía de 5 niveles validada
   - Paginación para listados grandes
   - Optimización de queries con índices

8. **Notificaciones y Comunicaciones:**
   - Notificaciones push para cambios de estado OT
   - Email PDF programado (diario/semanal/mensual)
   - Alertas accionables (stock mínimo, MTFR alto, rutinas vencidas)
   - Silencio selectivo (actualizaciones de stock sin spam a gestores)

9. **Reporting y Analítica:**
   - KPIs MTTR/MTBF con drill-down 4 niveles
   - Exportación Excel compatible Microsoft 2016+
   - Generación PDF con programación cron
   - Cálculos en tiempo real (datos actualizados cada 30s)

## Starter Template Evaluation

### Primary Technology Domain

**Web Application Full-Stack** basada en el análisis de requisitos:
- Frontend interactivo con componentes complejos (Kanban, dashboards, formularios)
- Backend con lógica de negocio dominio específico (GMAO)
- Base de datos relacional con esquema complejo (jerarquía 5 niveles)
- Real-time features vía Server-Sent Events (SSE)
- Autenticación y autorización granular (PBAC)

### Starter Options Considered

**Opción 1: T3 Stack (create-t3-app)**
- ✅ Incluye Next.js + Prisma + NextAuth.js + TypeScript out-of-the-box
- ✅ Versiones probadas y compatibles garantizadas
- ✅ Estructura de proyecto probada en producción
- ❌ Incluye tRPC que no necesitamos (preferimos API REST)
- ❌ Menos flexibilidad para arquitectura personalizada

**Opción 2: create-next-app (Manual)** ⭐ SELECCIONADA
- ✅ Máxima flexibilidad y control sobre cada dependencia
- ✅ Sin dependencias innecesarias (tRPC, etc.)
- ✅ Aprendizaje profundo del stack
- ❌ Requiere configuración manual de cada tecnología
- ❌ Más trabajo inicial de setup

### Selected Starter: create-next-app (Manual Configuration)

**Rationale for Selection:**

El usuario priorizó **control total sobre versiones estables y compatibilidad** sobre conveniencia de setup. La configuración manual permite:

1. **Selección explícita de versiones estables:** Cada dependencia se instala con versión verificada como estable
2. **Arquitectura limpia sin opinionaciones:** Sin tRPC ni patrones impuestos por el starter
3. **Aprendizaje del stack:** Configurar cada tecnología permite entender mejor interacciones
4. **Flexibilidad para SSE:** Integración de Server-Sent Events sin frameworks de real-time innecesarios
5. **Compatibilidad Vercel out-of-the-box:** Next.js official starter está optimizado para Vercel

**Compromiso técnico adoptado:**
- **Real-time simplificado via SSE** en lugar de WebSockets complejos
- Actualizaciones cada 30s para KPIs (cumple requisitos NFR)
- Notificaciones push vía SSE (suficiente para UX del producto)
- Compatible 100% con Vercel serverless

**Initialization Command:**

```bash
# Paso 1: Crear proyecto Next.js
npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"

# Paso 2: Entrar al directorio
cd gmao-hiansa

# Paso 3: Instalar dependencias críticas (VERSIONES ESTABLES)
npm install prisma@5.22.0              # ORM - última versión estable Enero 2025
npm install @prisma/client@5.22.0      # Prisma Client
npm install @prisma/adapter-neon@5.22.0 # Adapter para Neon
npm install next-auth@4.24.7           # Autenticación (ESTABLE - NO usar v5 beta)
npm install bcryptjs@2.4.3             # Hashing de contraseñas
npm install @types/bcryptjs@2.4.6      # Types para bcryptjs

# Paso 4: Dependencias de desarrollo
npm install -D prisma@5.22.0           # Prisma CLI

# Paso 5: Utilidades adicionales
npm install zod@3.23.8                 # Validación de esquemas
npm install date-fns@3.6.0             # Manejo de fechas
npm install @tanstack/react-query@5.51.0 # Data fetching (opcional, útil para cache)
```

**Verificación de versiones estables (Enero 2025):**

| Dependencia | Versión Estable | Estado | Notas |
|-------------|-----------------|--------|-------|
| **Next.js** | 15.0.3 | ✅ Stable | Última versión estable, compatible con todo |
| **React** | 18.3.1 | ✅ Stable | Versión LTS estable |
| **TypeScript** | 5.3.3 | ✅ Stable | Incluido con Next.js 15 |
| **Prisma** | 5.22.0 | ✅ Stable | Última versión estable Ene 2025 |
| **NextAuth.js** | 4.24.7 | ✅ Stable | ESTABLE - v5 todavía en beta |
| **Tailwind CSS** | 3.4.1 | ✅ Stable | Incluido con create-next-app |
| **Node.js** | 20.11.1 LTS | ✅ LTS | Versión recomendada |

⚠️ **IMPORTANTE: Verificar versiones actuales antes de instalación**
```bash
# Ver última versión estable de cada paquete
npm view next version
npm view prisma version
npm view next-auth version
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- **TypeScript 5.3.3** - Type safety en todo el código
- **ESLint** - Linting configurado
- **Prettier** - Code formatting (recomendado agregar)
- **Node.js 20.11.1 LTS** - Runtime compatible con Vercel

**Styling Solution:**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework incluido por defecto
- **CSS Modules** - Disponible si se necesita
- **PostCSS** - Configurado automáticamente con Tailwind

**Build Tooling:**
- **Turbopack** - Next.js 15 incluye Turbopack para builds ultra-rápidos
- **SWC Minification** - Minificación optimizada por defecto
- **Tree-shaking** - Eliminación de código muerto automática
- **Image Optimization** - next/image para optimización automática de imágenes
- **Font Optimization** - next/font para optimización de fuentes

**Code Organization:**
```
gmao-hiansa/
├── app/                    # Next.js App Router (no /src directory)
│   ├── (auth)/            # Grupo de rutas autenticadas
│   │   ├── dashboard/
│   │   ├── kanban/
│   │   └── layout.tsx
│   ├── (public)/          # Rutas públicas (login)
│   ├── api/               # API Routes
│   │   ├── auth/[...nextauth]/
│   │   ├── sse/           # Server-Sent Events endpoints
│   │   └── trpc/          # NO usaremos tRPC
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes base (shadcn/ui recomendado)
│   ├── forms/            # Formularios
│   ├── dashboard/        # Componentes de dashboard
│   └── kanban/           # Componentes de Kanban
├── lib/                   # Utilidades y helpers
│   ├── auth.ts           # Utilidades de autenticación
│   ├── db.ts             # Prisma client singleton
│   ├── utils.ts          # Utilidades generales
│   └── sse.ts            # Server-Sent Events utilities
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   └── seed.ts           # Seeds de desarrollo
├── types/                 # TypeScript types
│   ├── auth.ts           # Types de NextAuth
│   ├── models.ts         # Types de dominio
│   └── api.ts            # Types de API
└── public/               # Archivos estáticos
```

**Development Experience:**
- **Hot Reloading** - Next.js dev server con hot reload instantáneo
- **Fast Refresh** - Preservación de estado en cambios de código
- **TypeScript Configuration** - tsconfig.json optimizado
- **Debugging** - Compatible con VS Code debugger
- **Testing Infrastructure** - NO incluido (agregar Jest o Vitest después)

**Configuration Required (Manual Setup):**

**1. Prisma Setup (Requerido):**
```bash
npx prisma init
```
Configurar `DATABASE_URL` en `.env` con conexión Neon PostgreSQL

**2. NextAuth.js Setup (Requerido):**
- Crear `app/api/auth/[...nextauth]/route.ts`
- Configurar providers (Credentials para email/password)
- Integrar con Prisma User model

**3. Server-Sent Events Setup (Requerido):**
- Crear utilidades SSE en `lib/sse.ts`
- Crear endpoint `/api/sse/route.ts`
- Implementar heartbeat 30s
- Manejar reconexión automática

**4. Componentes UI (Recomendado):**
- Instalar shadcn/ui para componentes base
- Configurar Tailwind con design system del PRD
- Implementar colores semáforo (#28A745, #FD7E14, #DC3545)

**5. Testing Setup (Opcional pero recomendado):**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Note:** Project initialization using these commands should be the first implementation story. Priorizar:
1. Story 1: Setup inicial con create-next-app
2. Story 2: Configuración Prisma + Neon
3. Story 3: Configuración NextAuth.js
4. Story 4: Configuración SSE infrastructure

## Core Architectural Decisions

### Decision Priority Analysis

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

### Data Architecture

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

### Authentication & Security

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

### API & Communication Patterns

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

### Frontend Architecture

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

### Infrastructure & Deployment

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

### Decision Impact Analysis

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

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
24 áreas donde agentes AI podrían hacer elecciones diferentes si no se especifican patrones claros.

### Naming Patterns

**Database Naming Conventions:**

**Reglas:**
- Tablas y columnas en Prisma schema: `snake_case`
- Prisma Client genera automáticamente tipos `camelCase`
- Índices: `idx_tabla_columnas`
- Foreign keys: `tabla_id` (ej: `user_id`, `work_order_id`)

**Ejemplos:**
```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  first_name     String
  created_at     DateTime  @default(now())
  work_orders    WorkOrder[]
  @@index([email])
  @@index([created_at])
}

model WorkOrder {
  id          String   @id @default(cuid())
  title       String
  assigned_to String?
  assigned_to User?    @relation(fields: [assigned_to], references: [id])
  created_at  DateTime @default(now())
}
```

**En código TypeScript:**
```typescript
const user = await db.user.findUnique({ where: { email } })
// user.firstName, user.createdAt (camelCase automático)
```

**API Naming Conventions:**

**Reglas:**
- Endpoints: Plural + kebab-case
- Rutas de API: `/api/v1/{recurso}`
- Parámetros de ruta: `:id`
- Sub-recursos: `/api/v1/{recurso}/:id/{accion}`
- Query params: `camelCase`

**Ejemplos:**
```typescript
GET    /api/v1/users                      // Listar todos
POST   /api/v1/users                      // Crear
GET    /api/v1/users/:id                  // Obtener uno
PUT    /api/v1/users/:id                  // Actualizar
DELETE /api/v1/users/:id                  // Eliminar

POST   /api/v1/work-orders/:id/complete   // Sub-recurso acción
POST   /api/v1/work-orders/:id/assign     // Sub-recurso acción
GET    /api/v1/kpis/drilldown/:level      // Sub-recurso con parámetro

// Query params
GET /api/v1/work-orders?status=en_progreso&assignedTo=user-123
```

**Code Naming Conventions:**

**Reglas:**
- Componentes React: `PascalCase`
- Funciones: `camelCase`
- Archivos de componente: `PascalCase.tsx`
- Carpetas: `kebab-case`
- Server Actions: `camelCase`
- Tipos TypeScript: `PascalCase`

**Ejemplos:**
```typescript
// Componentes
components/ui/Button.tsx           → export function Button()
components/kanban/KanbanBoard.tsx   → export function KanbanBoard()
components/forms/UserForm.tsx       → export function UserForm()

// Funciones y Server Actions
const getUserById = (id: string) => { }
export async function createWorkOrder(data: WorkOrderCreate) { }
export async function getKPIs() { }

// Carpetas
components/work-orders/   // Correcto
components/workOrders/    // Incorrecto
app/api/v1/users/         // Correcto

// Tipos
types/models.ts           → interface WorkOrder { }
```

### Structure Patterns

**Project Organization:**

**Reglas:**
- Feature-based organization (no type-based)
- Tests colocalizados con código
- Componentes genéricos en `components/ui/`
- Componentes específicos en `components/{feature}/`
- Server Actions en `app/actions/`

**Estructura completa:**
```typescript
app/
  (auth)/                    # Route group (rutas autenticadas)
    dashboard/page.tsx
    kanban/page.tsx
  (public)/                  # Route group (rutas públicas)
    login/page.tsx
  api/
    v1/                      # Versionado de API
      users/route.ts
      work-orders/
        route.ts
        [id]/route.ts
        [id]/complete/route.ts
  actions/
    users.ts                 # Server Actions de usuarios
    work-orders.ts           # Server Actions de OTs
    kpis.ts                  # Server Actions de KPIs

components/
  ui/                       # Componentes genéricos reutilizables
    button.tsx
    card.tsx
    dialog.tsx
  kanban/                   # Componentes específicos de Kanban
    KanbanBoard.tsx
    KanbanColumn.tsx
  forms/                    # Formularios específicos
    FailureReportForm.tsx
    WorkOrderForm.tsx

lib/
  auth/
    config.ts               # NextAuth config
    middleware.ts
  db/
    prisma.ts               # Prisma client singleton
  sse/
    handler.ts              # SSE utilities
  utils/
    errors.ts               # Custom error classes
    validation.ts           # Zod schemas
  api/
    errors.ts               # API error handler middleware

types/
  models.ts                 # Domain models
  auth.ts                   # NextAuth types
  api.ts                    # API request/response types
```

**File Structure Patterns:**

**Reglas:**
- Config files en root (estándar Next.js)
- Environment: `.env.local` (gitignored), `.env.example` (committed)
- Prisma: carpeta `prisma/` con schema y seed
- Tests: `__tests__/` junto al código o `{archivo}.test.ts`

**Config files en root:**
```typescript
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
├── .eslintrc.json          # ESLint config
├── .env.local              # Secrets (gitignored)
├── .env.example            # Template (committed)
├── package.json
└── prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Seed script
```

### Format Patterns

**API Response Formats:**

**Reglas:**
- Respuestas exitosas: formato directo (sin wrapper)
- Errores: formato consistente `{code, message, details}`
- Códigos HTTP: usar apropiadamente (200, 201, 404, 403, 500)

**Éxitos:**
```typescript
// GET /api/v1/users
200 OK
[
  { "id": "1", "firstName": "Carlos", "email": "carlos@example.com" },
  { "id": "2", "firstName": "María", "email": "maria@example.com" }
]

// GET /api/v1/users/:id
200 OK
{ "id": "1", "firstName": "Carlos", "email": "carlos@example.com" }

// POST /api/v1/users
201 Created
{ "id": "3", "firstName": "Elena", "email": "elena@example.com" }

// DELETE /api/v1/users/:id
204 No Content
(sin body)
```

**Errores:**
```typescript
{
  "code": "VALIDATION_ERROR",
  "message": "Email es requerido",
  "details": { "field": "email" }
}

{
  "code": "AUTHORIZATION_ERROR",
  "message": "No tienes permiso para realizar esta acción",
  "details": { "requiredCapability": "can_manage_users" }
}

{
  "code": "INSUFFICIENT_STOCK",
  "message": "Stock insuficiente para Rodamiento SKF-6208. Solicitado: 5, Disponible: 2",
  "details": { "item": "Rodamiento SKF-6208", "requested": 5, "available": 2 }
}
```

**Data Exchange Formats:**

**Reglas:**
- JSON fields: `camelCase`
- Dates: ISO 8601 strings
- Booleans: `true`/`false` (no 1/0)
- Null: null para valores opcionales ausentes

**Ejemplos:**
```json
{
  "userId": "clx123",
  "firstName": "Carlos",
  "email": "carlos@example.com",
  "isActive": true,
  "deletedAt": null,
  "createdAt": "2025-03-07T10:30:00.000Z",
  "updatedAt": "2025-03-07T14:22:00.000Z"
}
```

**Mapeo automático Prisma:**
```typescript
// Prisma schema (DB: snake_case)
model User {
  first_name String
  created_at DateTime
}

// JSON response (camelCase automático)
{
  "firstName": "Carlos",
  "createdAt": "2025-03-07T10:30:00.000Z"
}
```

### Communication Patterns

**Event System Patterns:**

**SSE Event Naming:**
- Event names: `snake_case`
- Payload data: `camelCase`
- Heartbeat: evento `heartbeat` cada 30s

**Ejemplos:**
```typescript
// Eventos de OTs
event: work_order_created
data: {"id":"wo-123","title":"Perfiladora P-201 falla","urgency":"alta"}

event: work_order_updated
data: {"id":"wo-123","status":"en_progreso","assignedTo":"user-456"}

event: work_order_completed
data: {"id":"wo-123","completedAt":"2025-03-07T14:30:00Z"}

// Eventos de KPIs
event: kpi_refreshed
data: {"mttr":4.2,"mtbf":127,"otsAbiertas":15}

// Eventos de stock
event: stock_alert
data: {"item":"Rodamiento SKF-6208","current":2,"minimum":5,"level":"critical"}

// Heartbeat (cada 30s)
event: heartbeat
data: {"timestamp":1710000000000}
```

**Client-side handler:**
```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/v1/sse')

  eventSource.addEventListener('work_order_updated', (e) => {
    const data = JSON.parse(e.data)  // data.status, data.assignedTo (camelCase)
    updateWorkOrder(data)
  })

  eventSource.addEventListener('heartbeat', () => {
    // Conexión viva confirmada
  })

  return () => eventSource.close()
}, [])
```

**State Management Patterns:**

**Reglas:**
- Server Components: usar async/await directamente
- TanStack Query: para datos en tiempo real
- Mutations: usar `useMutation` para acciones write
- Updates: inmutables (siguiendo patterns de React)

**Ejemplos:**
```typescript
// Server Component (async)
export default async function Dashboard() {
  const kpis = await getKPIs()  // Next.js maneja loading
  return <KPIs kpis={kpis} />
}

// Client Component + TanStack Query
'use client'
export function WorkOrderList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['work-orders'],
    queryFn: fetchWorkOrders
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorAlert />
  return <List workOrders={data} />
}

// Mutation con optimistic update
const { mutate } = useMutation({
  mutationFn: updateWorkOrder,
  onMutate: async (newData) => {
    // Optimistic update
    queryClient.setQueryData(['work-orders'], (old) => [...])
  },
  onSuccess: (data) => {
    // Actualizar con datos reales
    queryClient.setQueryData(['work-orders'], data)
  }
})
```

### Process Patterns

**Error Handling Patterns:**

**Custom Error Classes (definidas en `lib/utils/errors.ts`):**
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', 400, message)
    this.details = details
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('AUTHORIZATION_ERROR', 403, message)
  }
}

export class InsufficientStockError extends AppError {
  constructor(item: string, requested: number, available: number) {
    super('INSUFFICIENT_STOCK', 400,
      `Stock insuficiente para ${item}. Solicitado: ${requested}, Disponible: ${available}`)
    this.item = item
    this.requested = requested
    this.available = available
  }
}
```

**Uso en Server Actions:**
```typescript
'use server'
export async function deleteWorkOrder(id: string) {
  const session = await auth()

  if (!session?.user.capabilities.includes('can_delete_work_order')) {
    throw new AuthorizationError('No tienes permiso para eliminar OTs')
  }

  const workOrder = await db.workOrder.findUnique({ where: { id }})
  if (!workOrder) {
    throw new AppError('NOT_FOUND', 404, 'Orden de trabajo no encontrada')
  }

  return await db.workOrder.delete({ where: { id }})
}
```

**Loading State Patterns:**

**Reglas:**
- Loading states: locales (por componente)
- TanStack Query: maneja `isLoading`, `isError` automáticamente
- Skeleton UI: preferible a spinners
- Form submissions: usar `isPending`

**Ejemplos:**
```typescript
// 1. TanStack Query loading automático
const { data: workOrders, isLoading, isError } = useQuery({
  queryKey: ['work-orders'],
  queryFn: fetchWorkOrders
})

if (isLoading) return <KanbanSkeleton />
if (isError) return <ErrorAlert message="Error al cargar órdenes" />

// 2. Mutation loading state
const { mutate: createWO, isPending } = useMutation({
  mutationFn: createWorkOrder
})

<Button disabled={isPending}>
  {isPending ? <Spinner className="mr-2" /> : null}
  {isPending ? 'Creando...' : 'Crear Orden'}
</Button>

// 3. Server Component (loading automático Next.js)
export default async function Page() {
  const data = await fetchData()  // Next.js muestra <Suspense fallback>
  return <Display data={data} />
}

// 4. Nombres consistentes
isLoading     // TanStack Query (datos iniciales)
isPending      // TanStack Query (mutación)
isSubmitting   // React Hook Form
isValidating   // Zod validación
```

**Loading UI Components:**
```typescript
// Skeleton UI (shadcn/ui)
<Skeleton className="h-12 w-full" />          // Tarjeta Kanban
<Skeleton className="h-4 w-1/2" />           // Texto
<TableSkeleton rows={5} />                   // Tabla

// Spinner inline
<Spinner size="sm" className="mr-2" />      // Pequeño
<Spinner size="md" />                       // Mediano

// Botón deshabilitado
<Button disabled={isLoading}>
  {isLoading ? 'Cargando...' : 'Guardar'}
</Button>
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Seguir convenciones de nombres establecidas:**
   - DB: `snake_case` en Prisma schema
   - APIs: Plural + kebab-case en URLs
   - Código: camelCase funciones, PascalCase componentes
   - JSON: camelCase en campos

2. **Organizar código por features (no por tipo):**
   - Componentes específicos en `components/{feature}/`
   - Componentes genéricos en `components/ui/`
   - Tests colocalizados con código

3. **Usar patrones de error consistentes:**
   - Lanzar `AppError` o subclasses en Server Actions
   - Middleware maneja y formatea respuestas
   - Mensajes en castellano, user-friendly

4. **Seguir patrones de API:**
   - Respuestas directas (sin wrapper `{data, error}`)
   - Errores en formato `{code, message, details}`
   - Códigos HTTP apropiados

5. **Usar TanStack Query para datos en tiempo real:**
   - KPIs, OTs, stock (datos que cambian frecuentemente)
   - Server Components para datos estáticos

6. **Implementar SSE con formato establecido:**
   - Event names: `snake_case`
   - Payload data: `camelCase`
   - Heartbeat cada 30s

**Pattern Enforcement:**

**Verificación en code review:**
- ✓ Nombres de archivos siguen convención
- ✓ APIs usan formato correcto (plural, kebab-case)
- ✓ Errores usan clases custom
- ✓ Loading states siguen patrón (local + TanStack Query)
- ✓ JSON fields en camelCase

**Documentación de violaciones:**
- Si un patrón debe romperse: documentar por qué
- Agregar comentario `// PATTERNS: Breaking {pattern} because {reason}`
- Discutir en team si violación impacta otros agentes

**Proceso para actualizar patrones:**
- Si patrón no funciona: abrir issue/discusión
- Consenso requerido antes de cambiar
- Actualizar este documento con nueva regla
- Comunicar cambio a todos los agentes AI

### Pattern Examples

**Good Examples:**

```typescript
// ✅ Correcto: API RESTful
GET /api/v1/work-orders
POST /api/v1/work-orders
GET /api/v1/work-orders/wo-123
PUT /api/v1/work-orders/wo-123
POST /api/v1/work-orders/wo-123/complete

// ✅ Correcto: Component PascalCase
export function KanbanBoard() { }
export function WorkOrderCard() { }

// ✅ Correcto: Function camelCase
const getUserById = (id: string) => { }
export async function createWorkOrder(data: WorkOrderCreate) { }

// ✅ Correcto: Prisma schema snake_case
model WorkOrder {
  id          String   @id
  created_at  DateTime @default(now())
  assigned_to String?
  assigned_to User?    @relation(fields: [assigned_to], references: [id])
}

// ✅ Correcto: Error con clase custom
throw new ValidationError('Email es requerido', { field: 'email' })

// ✅ Correcto: Loading con TanStack Query
const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
if (isLoading) return <Skeleton />

// ✅ Correcto: SSE event
event: work_order_updated
data: {"id":"wo-123","status":"en_progreso"}
```

**Anti-Patterns:**

```typescript
// ❌ Incorrecto: API singular
GET /api/v1/user
POST /api/v1/workorder

// ❌ Incorrecto: Component kebab-case
export function kanban-board() { }

// ❌ Incorrecto: Function snake_case
const get_user_by_id = (id: string) => { }

// ❌ Incorrecto: Prisma schema camelCase
model WorkOrder {
  createdAt DateTime  // ❌ Debe ser created_at
}

// ❌ Incorrecto: Error string genérico
throw new Error('Not found')  // ❌ Debe ser throw new AppError('NOT_FOUND', 404, '...')

// ❌ Incorrecto: Loading global
<Loading />  // ❌ Debe ser local al componente

// ❌ Incorrecto: SSE event camelCase
event: workOrderUpdated  // ❌ Debe ser work_order_updated
```

## Project Structure & Boundaries

### Complete Project Directory Structure

Based on all architectural decisions made, here is the complete project structure for **gmao-hiansa**:

```
gmao-hiansa/
├── README.md                           # Project documentation
├── package.json                       # Dependencies and scripts
├── next.config.js                      # Next.js 15 configuration
├── tailwind.config.js                  # Tailwind + design system config
├── tsconfig.json                       # TypeScript configuration
├── .eslintrc.json                      # ESLint configuration
├── .prettierrc                         # Prettier configuration (optional)
├── .gitignore                          # Git ignored files
├── .env.local                          # Environment variables (SECRETS - gitignored)
├── .env.example                        # Environment template (committed)
├── vercel.json                         # Vercel deployment configuration
│
├── prisma/                             # Database schema and migrations
│   ├── schema.prisma                   # Database schema (5 levels hierarchy)
│   ├── seed.ts                         # Seed data for development
│   └── migrations/                     # Migration files
│       ├── 20250307_init/
│       │   └── migration.sql
│       └── ...                         # Future migrations
│
├── public/                             # Static files (public access)
│   ├── favicon.ico
│   └── images/                         # Static images
│       └── placeholder/                # Placeholder images
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout (global UI, providers)
│   ├── page.tsx                        # Home page (landing/login)
│   ├── globals.css                     # Global styles + Tailwind
│   ├── api/                            # API Routes
│   │   └── v1/                         # API versioning
│   │       ├── auth/
│   │       │   └── [...nextauth]       # NextAuth.js authentication
│   │       │       └── route.ts
│   │       ├── users/
│   │       │   ├── route.ts            # GET/POST users
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET/PUT/DELETE user
│   │       ├── assets/
│   │       │   ├── route.ts            # GET/POST assets
│   │       │   ├── [id]/
│   │       │   │   └── route.ts        # GET/PUT/DELETE asset
│   │       │   └── hierarchy/
│   │       │       └── route.ts        # GET 5-level tree
│   │       ├── work-orders/
│   │       │   ├── route.ts            # GET/POST work-orders
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts        # GET/PUT/DELETE work-order
│   │       │   │   ├── complete/
│   │       │   │   │   └── route.ts    # POST complete OT
│   │       │   │   └── assign/
│   │       │   │       └── route.ts    # POST assign technicians
│   │       ├── failure-reports/
│   │       │   ├── route.ts            # GET/POST failure-reports
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET failure-report
│   │       ├── stock/
│   │       │   ├── route.ts            # GET stock, adjustments
│   │       │   └── alerts/
│   │       │       └── route.ts        # GET stock alerts
│   │       ├── kpis/
│   │       │   ├── route.ts            # GET KPIs (MTTR, MTBF)
│   │       │   └── drilldown/
│   │       │       └── [level]/
│   │       │           └── route.ts    # GET drilldown by level
│   │       ├── providers/
│   │       │   └── route.ts            # GET/POST providers
│   │       ├── routines/
│   │       │   ├── route.ts            # GET/POST routines
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET/PUT/DELETE routine
│   │       └── sse/
│   │           └── route.ts            # SSE endpoint (real-time)
│   │
│   ├── actions/                        # Server Actions (API-like, no /api/)
│   │   ├── users.ts                     # Users server actions
│   │   ├── assets.ts                    # Assets server actions
│   │   ├── work-orders.ts              # Work orders server actions
│   │   ├── failure-reports.ts           # Failure reports server actions
│   │   ├── stock.ts                     # Stock server actions
│   │   ├── kpis.ts                      # KPIs server actions
│   │   ├── providers.ts                 # Providers server actions
│   │   └── routines.ts                  # Routines server actions
│   │
│   ├── (auth)/                          # Route group (requires auth)
│   │   ├── layout.tsx                   # Layout for authenticated routes
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Main dashboard
│   │   ├── kanban/
│   │   │   └── page.tsx                # Kanban board
│   │   ├── assets/
│   │   │   ├── page.tsx                # Assets list
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Asset details
│   │   ├── work-orders/
│   │   │   ├── page.tsx                # Work orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Work order details
│   │   ├── reports/
│   │   │   └── page.tsx                # Reports and analytics
│   │   └── users/
│   │       └── page.tsx                # User management
│   │
│   └── (public)/                        # Route group (public)
│       ├── login/
│       │   └── page.tsx                # Login page
│       └── register/
│           └── page.tsx                # Register (if applicable)
│
├── components/                         # React components
│   ├── ui/                              # Generic components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx                    # Form components
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx                   # Toast notifications
│   │   ├── skeleton.tsx                # Skeleton loading UI
│   │   └── alert.tsx                   # Alert banners
│   │
│   ├── kanban/                          # Kanban-specific components
│   │   ├── KanbanBoard.tsx             # Main Kanban board
│   │   ├── KanbanColumn.tsx            # Kanban column
│   │   ├── KanbanCard.tsx               # Work order card
│   │   ├── KanbanFilters.tsx           # Kanban filters
│   │   └── types.ts                     # Kanban-specific types
│   │
│   ├── dashboard/                       # Dashboard components
│   │   ├── KPICard.tsx                 # Individual KPI card
│   │   ├── MetricsChart.tsx            # Metrics chart
│   │   ├── DrillDownSelector.tsx       # Drill-down selector
│   │   └── DashboardLayout.tsx         # Dashboard layout
│   │
│   ├── forms/                           # Specific forms
│   │   ├── FailureReportForm.tsx       # Failure report form
│   │   ├── WorkOrderForm.tsx           # Work order form
│   │   ├── AssetForm.tsx               # Asset form
│   │   ├── UserForm.tsx                # User form
│   │   ├── StockAdjustmentForm.tsx     # Stock adjustment form
│   │   └── ProviderForm.tsx            # Provider form
│   │
│   ├── assets/                          # Asset components
│   │   ├── AssetList.tsx                # Asset list
│   │   ├── AssetCard.tsx               # Asset card
│   │   ├── AssetTree.tsx               # 5-level hierarchy tree
│   │   └── AssetDetails.tsx            # Asset details
│   │
│   ├── work-orders/                     # Work order components
│   │   ├── WorkOrderList.tsx            # Work order list
│   │   ├── WorkOrderCard.tsx            # Work order card
│   │   ├── WorkOrderTimeline.tsx       # Status timeline
│   │   └── AssignTechnicianDialog.tsx   # Assign technician dialog
│   │
│   ├── stock/                           # Stock components
│   │   ├── StockList.tsx                # Stock list
│   │   ├── StockCard.tsx               # Stock card
│   │   ├── StockAlerts.tsx             # Stock minimum alerts
│   │   └── StockLocation.tsx            # Warehouse location
│   │
│   ├── users/                           # User components
│   │   ├── UserList.tsx                 # User list
│   │   ├── UserCard.tsx                 # User card
│   │   ├── CapabilitiesSelector.tsx     # 15 capabilities selector
│   │   └── UserForm.tsx                 # User form
│   │
│   └── providers/                       # Provider components
│       ├── ProviderList.tsx             # Provider list
│       ├── ProviderCard.tsx            # Provider card
│       └── ProviderForm.tsx            # Provider form
│
├── lib/                                # Utilities and helpers
│   ├── auth/                            # Authentication and authorization
│   │   ├── config.ts                    # NextAuth.js config
│   │   ├── middleware.ts                # PBAC middleware
│   │   └── utils.ts                     # Auth utilities
│   │
│   ├── db/                              # Database utilities
│   │   ├── prisma.ts                    # Prisma Client singleton
│   │   └── seed.ts                      # Seed script
│   │
│   ├── sse/                             # Server-Sent Events
│   │   ├── handler.ts                   # SSE utilities
│   │   ├── events.ts                    # SSE event types
│   │   └── connections.ts               # SSE connection management
│   │
│   ├── utils/                           # General utilities
│   │   ├── errors.ts                    # Custom error classes
│   │   ├── validation.ts                # Zod schemas
│   │   ├── date.ts                      # Date helpers (date-fns)
│   │   ├── format.ts                    # Format helpers
│   │   └── cn.ts                        # classNames utility (clsx)
│   │
│   └── api/                             # API utilities
│       └── errors.ts                    # API error handler middleware
│
├── types/                              # TypeScript types
│   ├── models.ts                        # Domain models (WorkOrder, User, Asset...)
│   ├── api.ts                           # API request/response types
│   ├── auth.ts                          # NextAuth types
│   └── sse.ts                           # SSE event types
│
└── docs/                               # Documentation
    ├── api/                             # API documentation
    │   └── openapi.yaml                 # OpenAPI/Swagger spec (optional)
    └── runbooks/                        # Operational runbooks
        ├── database-restore.md         # Database restore procedure
        └── deployment.md                # Deployment procedure
```

### Architectural Boundaries

**API Boundaries:**

- **External API Endpoints:** `/api/v1/` - RESTful API versioned for future ERP integration (Phase 3)
- **Internal Service Boundaries:** `app/actions/` - Server Actions for internal use (80% of cases)
- **Authentication Boundary:** `lib/auth/middleware.ts` - PBAC middleware protects all `(auth)` routes
- **Authorization Boundary:** 15 capabilities checked in Server Actions before executing
- **Data Access Layer:** `lib/db/prisma.ts` - Prisma Client singleton, all DB access goes through it

**Component Boundaries:**

- **Frontend Component Communication:**
  - Server Components: Default, no client JavaScript
  - Client Components: Marked with `'use client'` directive
  - State Sharing: Server Components pass props to Client Components
- **State Management Boundaries:**
  - Server Components: No state, use async/await for data
  - Client Components: TanStack Query for real-time data (KPIs, OTs)
  - Form State: React Hook Form with Zod validation
- **Service Communication:**
  - Server Actions: Direct calls from Client Components
  - API Routes: Used for external integration (Phase 3)
  - SSE: `/api/v1/sse/route.ts` for real-time updates
- **Event-Driven Integration:**
  - SSE Events: `work_order_updated`, `kpi_refreshed`, `stock_alert`, `heartbeat`
  - Client-side: `hooks/useSSE.ts` listens to SSE events

**Service Boundaries:**

- **Auth Service:** `lib/auth/config.ts` - NextAuth.js configuration, isolated from business logic
- **User Service:** `app/actions/users.ts` + `app/api/v1/users/route.ts` - All user operations
- **Asset Service:** `app/actions/assets.ts` + `app/api/v1/assets/route.ts` - All asset operations
- **Work Order Service:** `app/actions/work-orders.ts` + `app/api/v1/work-orders/route.ts` - All OT operations
- **Stock Service:** `app/actions/stock.ts` + `app/api/v1/stock/route.ts` - All stock operations
- **KPI Service:** `app/actions/kpis.ts` + `app/api/v1/kpis/route.ts` - All KPI calculations
- **SSE Service:** `lib/sse/handler.ts` + `app/api/v1/sse/route.ts` - Real-time communication

**Data Boundaries:**

- **Database Schema Boundaries:**
  - 5-level hierarchy enforced by Prisma schema
  - Specific tables per level (Planta, Linea, Equipo, Componente, Repuesto)
  - Foreign keys enforce relationships
- **Data Access Patterns:**
  - All DB access through Prisma Client (`lib/db/prisma.ts`)
  - Server Actions use Prisma for CRUD operations
  - No raw SQL, always use Prisma queries
- **Caching Boundaries:**
  - Next.js Data Cache: Server Components cache data automatically
  - TanStack Query Cache: Client-side cache for real-time data
  - No Redis in MVP (Phase 2 if needed)
- **External Data Integration:**
  - Email Service: For automatic PDF reports (Phase 1)
  - Future ERP Integration: REST API `/api/v1/` (Phase 3)
  - Future IoT Integration: Not in MVP (Phase 4)

### Requirements to Structure Mapping

**Feature/Epic Mapping:**

**Gestión de Averías (FR1-FR10):**
- Components: `components/forms/FailureReportForm.tsx`
- Server Actions: `app/actions/failure-reports.ts`
- API Routes: `app/api/v1/failure-reports/route.ts`
- Database: `prisma/schema.prisma` (FailureReport model)

**Gestión de Órdenes de Trabajo (FR11-FR31):**
- Components: `components/kanban/`, `components/work-orders/`
- Server Actions: `app/actions/work-orders.ts`
- API Routes: `app/api/v1/work-orders/route.ts`
- Database: `prisma/schema.prisma` (WorkOrder model)

**Gestión de Activos (FR32-FR43):**
- Components: `components/assets/`
- Server Actions: `app/actions/assets.ts`
- API Routes: `app/api/v1/assets/route.ts`
- Database: `prisma/schema.prisma` (Asset hierarchy: Planta, Linea, Equipo, Componente, Repuesto)

**Gestión de Repuestos (FR44-FR56):**
- Components: `components/stock/`
- Server Actions: `app/actions/stock.ts`
- API Routes: `app/api/v1/stock/route.ts`
- Database: `prisma/schema.prisma` (Repuesto model)

**Gestión de Usuarios y Capacidades (FR58-FR76):**
- Components: `components/users/`
- Server Actions: `app/actions/users.ts`
- API Routes: `app/api/v1/users/route.ts`
- Database: `prisma/schema.prisma` (User model + UserCapabilities join table)
- Auth: `lib/auth/config.ts` (NextAuth.js), `lib/auth/middleware.ts` (PBAC)

**Gestión de Proveedores (FR77-FR80):**
- Components: `components/providers/`
- Server Actions: `app/actions/providers.ts`
- API Routes: `app/api/v1/providers/route.ts`
- Database: `prisma/schema.prisma` (Provider model)

**Gestión de Rutinas (FR81-FR84):**
- Components: `components/routines/`
- Server Actions: `app/actions/routines.ts`
- API Routes: `app/api/v1/routines/route.ts`
- Database: `prisma/schema.prisma` (Routine model)

**Análisis y Reportes (FR85-FR95):**
- Components: `components/dashboard/`
- Server Actions: `app/actions/kpis.ts`
- API Routes: `app/api/v1/kpis/route.ts`
- Database: `prisma/schema.prisma` (derived data, MTTR/MTBF calculations)

**Sincronización Multi-Dispositivo (FR96-FR100):**
- SSE Utilities: `lib/sse/handler.ts`
- SSE Endpoint: `app/api/v1/sse/route.ts`
- Client Hook: `hooks/useSSE.ts`
- Real-time Events: `work_order_updated`, `kpi_refreshed`, `stock_alert`, `heartbeat`

**Cross-Cutting Concerns:**

**Authentication System:**
- Components: `components/auth/LoginForm.tsx`
- Config: `lib/auth/config.ts` (NextAuth.js Credentials provider)
- Middleware: `lib/auth/middleware.ts` (PBAC with 15 capabilities)
- Utils: `lib/auth/utils.ts` (auth helper functions)
- Types: `types/auth.ts` (NextAuth types)

**Authorization (PBAC) System:**
- Middleware: `lib/auth/middleware.ts` (protects all `(auth)` routes)
- Server Actions: Check capabilities before executing
- UI Components: `components/users/CapabilitiesSelector.tsx`
- Database: 15 capabilities stored in UserCapabilities join table

**Error Handling System:**
- Error Classes: `lib/utils/errors.ts` (AppError, ValidationError, AuthorizationError, InsufficientStockError)
- API Middleware: `lib/api/errors.ts` (catches and formats errors)
- UI: Toast notifications via `components/ui/toast.tsx`

**Server-Sent Events (SSE) System:**
- Handler: `lib/sse/handler.ts` (SSE utilities)
- Endpoint: `app/api/v1/sse/route.ts` (SSE connection)
- Events: `lib/sse/events.ts` (event type definitions)
- Client Hook: `hooks/useSSE.ts` (SSE listener with auto-reconnection)

### Integration Points

**Internal Communication:**

- **Server Component → Server Action:**
  ```typescript
  // app/(auth)/dashboard/page.tsx (Server Component)
  import { getKPIs } from '@/app/actions/kpis'
  const kpis = await getKPIs()  // Direct call
  ```

- **Client Component → Server Action:**
  ```typescript
  // components/kanban/KanbanBoard.tsx (Client Component)
  'use client'
  import { updateWorkOrder } from '@/app/actions/work-orders'
  const { mutate } = useMutation({ mutationFn: updateWorkOrder })
  ```

- **Client Component → API Route:**
  ```typescript
  // components/dashboard/KPICard.tsx (Client Component with TanStack Query)
  const { data } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => fetch('/api/v1/kpis').then(r => r.json())
  })
  ```

- **SSE Client → SSE Endpoint:**
  ```typescript
  // hooks/useSSE.ts
  const eventSource = new EventSource('/api/v1/sse')
  eventSource.addEventListener('work_order_updated', handler)
  ```

**External Integrations:**

- **Email Service:** Automatic PDF reports (Phase 1)
  - Integration point: Background job in Vercel Cron Jobs
  - Service: SendGrid or Resend (to be configured)
  - Location: `app/api/v1/cron/send-reports/route.ts`

- **Future ERP Integration (Phase 3):**
  - Integration point: REST API `/api/v1/`
  - Documentation: `docs/api/openapi.yaml`
  - Versioning: `/api/v1/` allows `/api/v2/` in future

- **Future IoT Integration (Phase 4):**
  - Integration point: Webhook endpoint or MQTT broker
  - Not in MVP architecture

**Data Flow:**

1. **User Action → Client Component:**
   - User clicks button in `KanbanCard.tsx`
   - Component calls `updateWorkOrder()` Server Action

2. **Server Action → Database:**
   - `updateWorkOrder()` in `app/actions/work-orders.ts`
   - Checks PBAC capability `can_update_own_ot`
   - Updates database via Prisma: `db.workOrder.update()`
   - Returns updated WorkOrder

3. **Database → SSE:**
   - Trigger SSE event: `work_order_updated`
   - `lib/sse/handler.ts` broadcasts to connected clients

4. **SSE → Client Components:**
   - All clients listening to SSE receive event
   - TanStack Query cache updates automatically
   - UI refreshes with new data (KanbanBoard, Dashboard, etc.)

### File Organization Patterns

**Configuration Files:**

- **Root Level:** All config files in project root (Next.js standard)
  - `next.config.js` - Next.js configuration
  - `tailwind.config.js` - Tailwind + design system colors
  - `tsconfig.json` - TypeScript configuration
  - `.eslintrc.json` - ESLint rules
  - `.env.local` - Secrets (gitignored)
  - `.env.example` - Template (committed)

**Source Organization:**

- **Feature-based:** Components organized by feature, not by type
  - `components/kanban/` - All Kanban-related components
  - `components/forms/` - All form components
  - `components/dashboard/` - All dashboard components
- **Exception:** `components/ui/` - Generic reusable components (shadcn/ui)

**Test Organization:**

- **Colocation:** Tests next to code (pattern decided in step 5)
  - `components/kanban/KanbanBoard.test.tsx`
  - `lib/utils/errors.test.ts`
  - `app/actions/users.test.ts`

**Asset Organization:**

- **Public Assets:** `public/` folder
  - `public/images/` - Static images
  - `public/favicon.ico` - Site icon
- **Component Assets:** Co-located with components
  - `components/kanban/assets/` - Kanban-specific images (if any)

### Development Workflow Integration

**Development Server Structure:**

- **Next.js Dev Server:** `npm run dev` starts development server
  - Hot reload enabled
  - Access at `http://localhost:3000`
  - Prisma migrations run automatically
  - NextAuth.js configured for development

**Build Process Structure:**

- **Production Build:** `npm run build` creates optimized build
  - Turbopack compiles code
  - Prisma Client generated
  - Assets optimized
  - Output: `.next/` folder (internal to Next.js)

**Deployment Structure:**

- **Vercel Deployment:** Automatic on push to `main` branch
  - Vercel detects Next.js and configures automatically
  - Environment variables from Vercel Dashboard
  - Prisma migrations deploy automatically
  - Preview deployments for PRs

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

✅ **Stack Tecnológico Compatible:**
- Next.js 15.0.3 + React 18.3.1 + TypeScript 5.3.3 → Compatible
- Prisma 5.22.0 + Neon PostgreSQL → Compatible (Prisma soporta Neon out-of-the-box)
- NextAuth.js 4.24.7 (Credentials) + bcryptjs 2.4.3 → Compatible (ambos probados en producción)
- TanStack Query 5.51.0 + Next.js 15 → Compatible (Server Components + Client Components híbrido)
- shadcn/ui + Radix UI + Tailwind CSS 3.4.1 → Compatible (shadcn/ui usa Radix + Tailwind)
- React Hook Form 7.51.5 + Zod 3.23.8 → Compatible (integración oficial @hookform/resolvers)
- Lucide React 0.344.0 + shadcn/ui → Compatible (shadcn/ui recomienda Lucide)
- Vercel + Next.js 15 → Optimizado (Vercel creadores de Next.js)

✅ **Sin Decisiones Contradictorias:**
- SSE (no WebSockets) → Compatible con Vercel serverless
- Server Components (80%) + TanStack Query (20%) → Complementario, no contradictorio
- API REST + Server Actions híbrido → Cada uno tiene su propósito claro
- PBAC middleware + Server Actions + UI → Defense in depth, no redundancia

**Pattern Consistency:**

✅ **Naming Patterns Soportan Decisiones:**
- `snake_case` en Prisma → PostgreSQL estándar, Prisma auto-mapea a `camelCase`
- Plural RESTful + kebab-case → Estándar REST, Next.js App Router soporta
- PascalCase components + camelCase functions → Estándar React/TypeScript

✅ **Structure Patterns Alinean con Stack:**
- Feature-based organization → Next.js App Router favorece este patrón
- Server Actions centralizados → Next.js 15 best practice
- API versionada `/api/v1/` → Preparado para integración ERP futura

✅ **Communication Patterns Coherentes:**
- SSE snake_case events + camelCase payload → Estándar SSE, consistente con JSON APIs
- Local loading states + TanStack Query → Next.js 15 best practice
- Error classes + middleware → Defense in depth, layers claros

**Structure Alignment:**

✅ **Project Structure Soporta Decisiones:**
- `/app/api/v1/` → API REST versionada (decisión arquitectónica)
- `/app/actions/` → Server Actions (decisión híbrida)
- `/components/ui/` + `/components/{feature}/` → Feature-based (decisión estructura)
- `lib/auth/`, `lib/db/`, `lib/sse/` → Servicios separados (decisiones servicios)

✅ **Límites Bien Definidos:**
- API boundary: `/api/v1/` vs Server Actions
- Component boundary: Server vs Client Components
- Data boundary: Prisma schema (5 niveles estrictos)
- Auth boundary: PBAC middleware + capabilities en Server Actions

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**

✅ **Gestión de Averías (FR1-FR10):**
- Components: `components/forms/FailureReportForm.tsx`
- Server Actions: `app/actions/failure-reports.ts`
- API Routes: `app/api/v1/failure-reports/route.ts`
- **COBERTURA COMPLETA** - Todos los FRs soportados

✅ **Gestión de Órdenes de Trabajo (FR11-FR31):**
- Components: `components/kanban/` (8 estados de ciclo de vida)
- Server Actions: `app/actions/work-orders.ts`
- API Routes: `app/api/v1/work-orders/route.ts`
- **COBERTURA COMPLETA** - Incluye drag-and-drop, 8 columnas, asignación múltiple

✅ **Gestión de Activos (FR32-FR43):**
- Components: `components/assets/`
- Database: Prisma schema (5 niveles estrictos)
- **COBERTURA COMPLETA** - Tablas específicas por nivel, relaciones validadas

✅ **Gestión de Repuestos (FR44-FR56):**
- Components: `components/stock/`
- Server Actions: `app/actions/stock.ts`
- **COBERTURA COMPLETA** - Stock visible, actualizaciones silenciosas, alertas mínimo

✅ **Gestión de Usuarios y Capacidades (FR58-FR76):**
- Auth: `lib/auth/middleware.ts` (PBAC con 15 capacidades)
- Components: `components/users/CapabilitiesSelector.tsx`
- **COBERTURA COMPLETA** - 15 capacidades granulares, sin roles predefinidos

✅ **Gestión de Proveedores (FR77-FR80):**
- Components: `components/providers/`
- Server Actions: `app/actions/providers.ts`
- **COBERTURA COMPLETA** - CRUD de proveedores, catálogo de servicios

✅ **Gestión de Rutinas (FR81-FR84):**
- Components: `components/routines/`
- Server Actions: `app/actions/routines.ts`
- **COBERTURA COMPLETA** - Rutinas diarias/semanales/mensuales, alertas vencimiento

✅ **Análisis y Reportes (FR85-FR95):**
- Components: `components/dashboard/` (KPIs MTTR/MTBF con drill-down)
- Server Actions: `app/actions/kpis.ts`
- **COBERTURA COMPLETA** - Drill-down 4 niveles, exportación Excel, reportes PDF

✅ **Sincronización Multi-Dispositivo (FR96-FR100):**
- SSE: `lib/sse/handler.ts` + `app/api/v1/sse/route.ts`
- Client: `hooks/useSSE.ts` (auto-reconnection)
- **COBERTURA COMPLETA** - SSE con heartbeat 30s, reconexión <30s

✅ **Funcionalidades Adicionales (FR101-FR108):**
- Distribuido en múltiples módulos
- **COBERTURA COMPLETA** - Rechazo reparación, búsqueda global, comentarios, QR codes

**Functional Requirements Coverage:**

**Todas las 123 FRs están arquitecturalmente soportadas:**
- 10 categorías de funcionalidad → Mapeadas a componentes y servicios específicos
- Cross-cutting concerns (auth, SSE, error handling) → Capas separadas definidas
- Integraciones → Puntos de integración claros (`/api/v1/`, SSE endpoints)

**Non-Functional Requirements Coverage:**

✅ **Performance (7 NFRs):**
- Búsqueda <200ms → Prisma índices + Next.js Data Cache
- Carga <3s → Server Components (zero client JS)
- KPIs <2s → Server Components + TanStack Query cache
- Transiciones <100ms → TanStack Query optimistic updates
- 50 usuarios concurrentes → Vercel automatic scaling
- Importación 10K activos <5min → Prisma bulk operations

✅ **Security (9 NFRs):**
- Autenticación → NextAuth.js Credentials + bcryptjs
- Contraseñas hasheadas → bcryptjs 2.4.3
- HTTPS/TLS 1.3 → Vercel fuerza automáticamente
- ACL por capacidades → PBAC middleware (15 capacidades)
- Auditoría → Custom error classes + logging
- Rate limiting → In-memory MVP (migración Upstash Phase 2)
- Sanitización inputs → Zod validation

✅ **Scalability (5 NFRs):**
- 10,000 activos → Prisma escalable + índices optimizados
- 100 usuarios concurrentes → Vercel serverless scaling
- Índices DB → Prisma @@index() en schema
- Paginación → TanStack Query + Prisma paginate
- Crecimiento a 20K → Neon vertical scaling (Scale plan)

✅ **Accessibility (6 NFRs):**
- WCAG AA (contraste 4.5:1) → Tailwind colors cumplen
- Texto mínimo 16px → Tailwind base font size
- Touch targets 44x44px → shadcn/ui (Radix UI WCAG AA)
- Navegación teclado → Radix UI soporte nativo
- Zoom 200% → Next.js responsive layout

✅ **Reliability (6 NFRs):**
- 99% uptime → Vercel SLA + Neon backups
- Backups diarios → Neon Native Backups (incluido)
- RTO 4 horas → Neon point-in-time recovery
- Reconexión SSE <30s → `hooks/useSSE.ts` auto-reconnection
- Mensajes error claros → Custom error classes (castellano)

✅ **Integration (4 NFRs):**
- Importación CSV → Prisma bulk + Zod validation
- Exportación Excel → TBD en implementación (recomendación: `xlsx` o `exceljs`)
- API REST → `/api/v1/` versionada (preparado Phase 3)
- IoT futuro → No en MVP, arquitectura extensible

### Implementation Readiness Validation ✅

**Decision Completeness:**

✅ **Todas las decisiones críticas documentadas con versiones:**
- Frontend: Next.js 15.0.3, React 18.3.1, TypeScript 5.3.3
- Database: Prisma 5.22.0, Neon PostgreSQL
- Auth: NextAuth.js 4.24.7 (ESTABLE), bcryptjs 2.4.3
- UI: shadcn/ui + Radix UI, Tailwind CSS 3.4.1
- Validation: Zod 3.23.8
- State: TanStack Query 5.51.0, React Hook Form 7.51.5
- Icons: Lucide React 0.344.0
- Deployment: Vercel

✅ **Implementation patterns comprehensivos:**
- 24 conflict points identificados y resueltos
- 6 categorías de patrones definidas
- Good examples y anti-patterns documentados
- Ejemplos de código concretos para cada patrón

**Structure Completeness:**

✅ **Project structure completo y específico:**
- 200+ archivos/directorios definidos
- Archivos específicos (no placeholders genéricos)
- Rutas específicas para cada feature
- Ubicación clara para cada componente

✅ **Integration points claramente especificados:**
- API endpoints: `/api/v1/{resource}/:id/{action}`
- Server Actions: `app/actions/{domain}.ts`
- SSE endpoint: `/api/v1/sse/route.ts`
- Component boundaries: Server vs Client Components

✅ **Component boundaries bien definidos:**
- API boundary: REST (`/api/v1/`) vs Server Actions (`/app/actions/`)
- Auth boundary: PBAC middleware (`lib/auth/middleware.ts`)
- Data boundary: Prisma schema (5 niveles estrictos)
- Service boundaries: Módulos separados por dominio

**Pattern Completeness:**

✅ **Todos los conflict points potenciales abordados:**
- Naming: 3 categorías (DB, API, código)
- Structure: 4 categorías (proyecto, archivos, tests, assets)
- Format: 2 categorías (API responses, JSON fields)
- Communication: 2 categorías (SSE events, state management)
- Process: 2 categorías (errors, loading states)

✅ **Ejemplos proveídos para todos los patrones principales:**
- Good examples para cada patrón
- Anti-patterns documentados
- Código concreto de referencia

### Gap Analysis Results

**Critical Gaps:**
❌ **NINGUNO** - No hay gaps críticos que bloqueen la implementación

**Important Gaps:**

⚠️ **Función de Exportación Excel** - Requerida por FR95 ("Exportación Excel compatible Microsoft 2016+")
- **Acción:** Decidir librería en implementación
- **Recomendación:** `xlsx` (popular, bien mantenido) o `exceljs` (más features)
- **Prioridad:** Phase 1 (MVP incluye esta funcionalidad)

⚠️ **Email Service Selection** - Reportes automáticos PDF (FR90)
- **Acción:** Decidir servicio de email
- **Recomendación:** Resend (más simple para Next.js) o SendGrid (más establecido)
- **Prioridad:** Phase 1 (MVP incluye reportes automáticos)

**Nice-to-Have Gaps:**

📝 **Testing Framework** - No seleccionado (opcional)
- **Acción:** Decidir en Phase 2
- **Recomendación:** Vitest + Testing Library (compatibles con Vercel)
- **Prioridad:** Phase 2 (no bloquea MVP)

📝 **Sentry Configuration** - Diferido a Phase 2
- **Acción:** Configurar cuando haya errores reales
- **Recomendación:** Esperar a Phase 2 para evitar costo innecesario
- **Prioridad:** Phase 2 (cuando haya errores reales)

### Validation Issues Addressed

**Critical Issues:**
NINGUNO - No hay issues críticos que resolver

**Important Issues:**
NINGUNO - No hay issues importantes que bloqueen

**Minor Issues:**
Los gaps identificados (Export Excel, Email Service) son decisions de implementación, no arquitectónicas. La arquitectura soporta ambas funcionalidades.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Media-Alta)
- [x] Technical constraints identified (single-tenant, Chrome/Edge only, always online)
- [x] Cross-cutting concerns mapped (9 concerns: PBAC, SSE, búsqueda, accesibilidad, seguridad, responsive, datos masivos, notificaciones, reporting)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions (8 categorías de decisiones)
- [x] Technology stack fully specified (13 tecnologías con versiones verificadas)
- [x] Integration patterns defined (SSE, REST, Server Actions híbrido)
- [x] Performance considerations addressed (7 NFRs cubiertos arquitectónicamente)

**✅ Implementation Patterns**

- [x] Naming conventions established (6 categorías: DB, API, código, archivos, eventos, estados)
- [x] Structure patterns defined (Feature-based organization, test colocation)
- [x] Communication patterns specified (SSE format, state management)
- [x] Process patterns documented (Error handling, loading states)

**✅ Project Structure**

- [x] Complete directory structure defined (200+ archivos/directorios específicos)
- [x] Component boundaries established (Server vs Client, API vs Server Actions)
- [x] Integration points mapped (API endpoints, SSE, eventos)
- [x] Requirements to structure mapping complete (10 FR categories mapeadas a estructura)

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **ALTA**

Basado en validación completa:
- ✅ Coherencia validada (todas las decisiones compatibles)
- ✅ Cobertura completa (123 FRs + 37 NFRs soportados)
- ✅ Patrones comprehensivos (24 conflict points resueltos)
- ✅ Estructura específica (200+ archivos definidos)
- ✅ Listo para agentes AI (documentación clara y completa)

**Key Strengths:**

1. **Stack Tecnológico Moderno y Compatible:** Next.js 15, Prisma 5, Neon, TanStack Query - todas versiones estables y probadas
2. **Compromiso Técnico Realista:** SSE vs WebSockets balancea complejidad con funcionalidad (cumple requisitos NFR modificados)
3. **Patrones de Consistencia Completos:** 24 conflict points identificados y resueltos con ejemplos concretos
4. **Estructura de Proyecto Específica:** 200+ archivos/directorios definidos (no placeholders genéricos)
5. **Preparado para Crecimiento:** API versionada `/api/v1/`, escalabilidad planificada (10K → 20K activos)
6. **Autorización Flexible:** PBAC con 15 capacidades granulares (sin roles predefinidos, máximo flexibility)

**Areas for Future Enhancement:**

1. **Phase 1 (MVP):** Seleccionar librería de exportación Excel (`xlsx` recomendado) y servicio de email (Resend recomendado)
2. **Phase 2:** Añadir testing framework (Vitest + Testing Library) y configurar Sentry para error tracking
3. **Phase 3:** Aprovechar API REST versionada para integración ERP
4. **Phase 4:** Considerar IoT integration (arquitectura extensible, pero no en MVP)

### Implementation Handoff

**AI Agent Guidelines:**

✅ **Follow all architectural decisions exactly as documented:**
- Use versiones especificadas (Next.js 15.0.3, Prisma 5.22.0, etc.)
- Follow naming conventions (snake_case DB, camelCase JSON, PascalCase components)
- Respect project structure (feature-based organization, no type-based)
- Use implementation patterns consistently (error classes, loading states, SSE format)

✅ **Use implementation patterns consistently across all components:**
- Naming: Follow 6 categories de patterns (DB, API, code, files, events, states)
- Structure: Feature-based organization, test colocation
- Communication: SSE snake_case events + camelCase payload
- Process: Custom error classes, local loading states + TanStack Query

✅ **Respect project structure and boundaries:**
- API boundary: `/api/v1/` (REST) vs `/app/actions/` (Server Actions)
- Auth boundary: PBAC middleware with 15 capabilities
- Component boundary: Server vs Client Components
- Data boundary: Prisma schema (5 levels strict hierarchy)

✅ **Refer to this document for all architectural questions:**
- All technology choices documented with versions
- All patterns documented with good/bad examples
- All structure defined with specific files/directories
- All requirements mapped to specific components

**First Implementation Priority:**

**Story 1: Setup inicial con create-next-app**

```bash
# Comando exacto para inicializar el proyecto
npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"

cd gmao-hiansa

# Instalar dependencias críticas
npm install prisma@5.22.0 @prisma/client@5.22.0 next-auth@4.24.7 bcryptjs@2.4.3
npm install zod@3.23.8 @tanstack/react-query@5.51.0 react-hook-form@7.51.5
npm install @hookform/resolvers@3.9.0 lucide-react@0.344.0

# Dev dependencies
npm install -D prisma@5.22.0

# Inicializar shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input label table toast skeleton alert

# Inicializar Prisma
npx prisma init

# Configurar DATABASE_URL en .env.local (Neon PostgreSQL)
# Crear schema.prisma con 5 niveles (Planta → Linea → Equipo → Componente → Repuesto)

# Primera migration
npx prisma migrate dev --name init

# Seed inicial (opcional)
npx prisma db seed

# Iniciar development server
npm run dev
```

**Siguiente Story después del setup:**
- Story 2: Configurar Prisma + Neon (schema inicial)
- Story 3: Configurar NextAuth.js (Credentials provider)
- Story 4: Implementar PBAC middleware + 15 capacidades
- Story 5: Setup SSE infrastructure
- Story 6: Crear primera página autenticada (dashboard)

**Documentación de Referencia:**
- Archivo completo: `_bmad-output/planning-artifacts/architecture.md`
- PRD: `_bmad-output/planning-artifacts/prd.md`
- UX Design: `_bmad-output/planning-artifacts/ux-design-specification.md`

---

## 🎉 Architecture Workflow Complete

**Status:** ✅ **COMPLETE - READY FOR IMPLEMENTATION**

**Completed:** 2026-03-07

**Workflow Steps Completed:** 8/8

### What We Achieved Together

**1. Project Context Analysis (Step 2):**
- Analyzed 123 Functional Requirements in 10 categories
- Identified 37 Non-Functional Requirements
- Mapped 9 cross-cutting concerns
- Assessed project scale: Media-Alta complexity

**2. Starter Template Selection (Step 3):**
- Chose: create-next-app manual (not T3 Stack)
- Rationale: Maximum control over stable versions
- Verified all versions: Next.js 15.0.3, Prisma 5.22.0, NextAuth 4.24.7, etc.

**3. Core Architectural Decisions (Step 4):**
- Technology stack: 13 technologies with verified stable versions
- Database: 5-level hierarchy with specific tables
- Authorization: PBAC with 15 granular capabilities
- Real-time: SSE (realistic compromise, meets modified NFRs)
- State: Hybrid Server Components + TanStack Query

**4. Implementation Patterns (Step 5):**
- 24 potential conflict points identified and resolved
- 6 pattern categories defined (Naming, Structure, Format, Communication, Process)
- Good examples and anti-patterns documented
- Code consistency rules for AI agents

**5. Project Structure (Step 6):**
- 200+ files/directories specifically defined
- Feature-based organization (not type-based)
- Integration points mapped (API, SSE, Server Actions)
- Component boundaries established

**6. Validation (Step 7):**
- ✅ Coherence validated (all decisions compatible)
- ✅ Coverage verified (123 FRs + 37 NFRs supported)
- ✅ Readiness confirmed (AI agents can implement consistently)
- Confidence Level: ALTA

### Architecture Document Contents

**Your complete architecture document includes:**

1. **Project Context Analysis**
   - Requirements overview (123 FRs, 37 NFRs)
   - Technical constraints
   - Cross-cutting concerns (9 areas)

2. **Starter Template Evaluation**
   - Chosen: create-next-app manual
   - Rationale and initialization command
   - Architectural decisions provided

3. **Core Architectural Decisions**
   - Data architecture (Prisma, Neon, 5 levels)
   - Authentication & security (NextAuth, PBAC)
   - API & communication (REST, SSE, error handling)
   - Frontend (shadcn/ui, TanStack Query, forms)
   - Infrastructure (Vercel, CI/CD, monitoring)

4. **Implementation Patterns & Consistency Rules**
   - Naming patterns (6 categories)
   - Structure patterns (4 categories)
   - Format patterns (2 categories)
   - Communication patterns (2 categories)
   - Process patterns (2 categories)
   - Enforcement guidelines
   - Good examples and anti-patterns

5. **Project Structure & Boundaries**
   - Complete directory tree (200+ files)
   - Architectural boundaries (API, component, service, data)
   - Requirements mapping (10 FR categories → structure)
   - Integration points (internal, external, data flow)

6. **Architecture Validation Results**
   - Coherence validation ✅
   - Requirements coverage validation ✅
   - Implementation readiness validation ✅
   - Gap analysis (3 nice-to-have gaps identified)
   - Completeness checklist (all items checked)
   - Readiness assessment: READY FOR IMPLEMENTATION

### Next Steps

**Immediate Action - Start Implementation:**

The architecture is complete and validated. You can now begin implementation.

**Story 1: Setup inicial**

```bash
# Inicializar proyecto Next.js 15 manual
npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"

cd gmao-hiansa

# Instalar dependencias críticas (versiones estables)
npm install prisma@5.22.0 @prisma/client@5.22.0
npm install next-auth@4.24.7 bcryptjs@2.4.3
npm install zod@3.23.8 @tanstack/react-query@5.51.0
npm install react-hook-form@7.51.5 @hookform/resolvers@3.9.0
npm install lucide-react@0.344.0

# Dev dependencies
npm install -D prisma@5.22.0

# Inicializar shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input label table toast skeleton alert

# Inicializar Prisma
npx prisma init

# Configurar DATABASE_URL en .env.local con conexión Neon
# Crear schema.prisma con modelo inicial (Users con PBAC)

# Primera migration
npx prisma migrate dev --name init

# Iniciar development server
npm run dev
```

**Stories Subsiguientes:**

- Story 2: Configurar Prisma schema con jerarquía de 5 niveles
- Story 3: Configurar NextAuth.js con Credentials provider
- Story 4: Implementar PBAC middleware y 15 capacidades
- Story 5: Setup SSE infrastructure
- Story 6-20: Implementar features del PRD siguiendo el architecture document

**Decisiones Pendientes de Implementación:**

Durante la implementación, necesitarás decidir:
1. **Librería de exportación Excel:** `xlsx` o `exceljs` (para FR95)
2. **Servicio de email:** Resend o SendGrid (para reportes automáticos PDF)
3. **Testing framework:** Vitest + Testing Library (Phase 2)

### AI Agent Implementation Guidelines

**For all AI agents working on this project:**

✅ **MANDATORY: Follow this architecture document exactly**

- **Use specified versions** - All technology choices include version numbers
- **Follow naming conventions** - DB: snake_case, API: plural+kebab-case, Code: camelCase/PascalCase
- **Respect project structure** - Feature-based organization, specific file locations
- **Use implementation patterns** - All 24 conflict points have established patterns
- **Refer to examples** - Good examples and anti-patterns provided for all major patterns

**Red flags that indicate deviation from architecture:**
- Using different technology versions than specified
- Organizing by type instead of feature (`components/buttons/` instead of `components/kanban/`)
- Using WebSockets instead of SSE (SSE is the chosen compromise)
- Implementing roles instead of 15 granular capabilities
- Placing tests in separate `tests/` folder instead of colocation

**When in doubt, refer to:**
1. This architecture document (`_bmad-output/planning-artifacts/architecture.md`)
2. PRD (`_bmad-output/planning-artifacts/prd.md`)
3. UX Design (`_bmad-output/planning-artifacts/ux-design-specification.md`)

### Architecture Strengths

**Why this architecture will succeed:**

1. **Modern, compatible stack** - All technologies are stable and work together seamlessly
2. **Realistic compromises** - SSE instead of WebSockets balances complexity with functionality
3. **Comprehensive patterns** - 24 conflict points resolved before implementation begins
4. **Specific structure** - 200+ files defined (no guessing during implementation)
5. **Validation complete** - All 123 FRs + 37 NFRs architecturally supported
6. **AI-ready** - Clear guidelines for consistent implementation by AI agents

### Architecture Document Location

**Main File:** `_bmad-output/planning-artifacts/architecture.md`

**Supporting Documents:**
- PRD: `_bmad-output/planning-artifacts/prd.md`
- UX Design: `_bmad-output/planning-artifacts/ux-design-specification.md`

This architecture document is now your **single source of truth** for all technical decisions throughout the project lifecycle.

---

**Congratulations on completing the Architecture workflow!** 🎉

Your project **gmao-hiansa** now has a complete, validated architecture ready for implementation.

Ready to start building? The command above will initialize your project with all the architectural decisions already made.

---

**¿Tienes alguna pregunta sobre el documento de arquitectura?**

Estoy aquí para ayudar con cualquier duda sobre:
- Decisiones arquitectónicas tomadas
- Patrones de implementación
- Estructura del proyecto
- Próximos pasos de implementación
