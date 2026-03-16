---
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-10'
sections_completed:
  ['technology_stack', 'documentation_references', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 130
optimized_for_llm: true
existing_patterns_found: 32
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core Framework
- **Next.js 15.0.3** with App Router (NOT Pages Router)
- **TypeScript 5.6.0** with strict mode enabled
- **Node.js** (LTS version - check .nvmrc if exists)

### Database & ORM
- **Neon PostgreSQL** (serverless, Vercel-compatible)
- **Prisma 5.22.0** - Type-safe database access
- Schema: `prisma/schema.prisma` with 5-level hierarchy (Planta → Linea → Equipo → Componente → Repuesto)

### Authentication & Security
- **NextAuth.js 4.24.7** (CRITICAL: Use v4, NOT v5 beta)
- Provider: Credentials (email/password)
- **bcryptjs 2.4.3** - Password hashing (works on Vercel serverless)
- **PBAC authorization** - 15 granular capabilities (NO pre-defined roles)

### UI & Styling
- **shadcn/ui** + Radix UI - Copy-paste components (100% customizable, WCAG AA)
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Lucide React 0.344.0** - Icons (tree-shakeable)

### State & Data
- **TanStack Query 5.90.21** - Real-time data fetching (KPIs every 30s)
- **React Hook Form 7.51.5** - Form handling with Zod integration
- **Zod 3.23.8** - Type-safe validation (schemas auto-generate TypeScript types)

### Observability & Error Handling
- **Structured Logging** - Native JSON format for Vercel (correlation IDs)
- **Performance Tracking** - Custom `lib/observability/performance.ts` (>1s threshold)
- **Client Logging** - `lib/observability/client-logger.ts` with rate limiting (10 errors/min)
- **Custom Error Classes** - AppError base with ValidationError, AuthorizationError, AuthenticationError, etc.

### Real-time Communication
- **Server-Sent Events (SSE)** - NOT WebSockets (incompatible with Vercel serverless)
- Heartbeat: 30 seconds
- Auto-reconnection: <30 seconds

### Testing & Quality
- **Vitest 1.0.0** - Unit/Integration tests with jsdom environment
- **Playwright 1.48.0** - E2E tests (Chromium only - 4 workers)
- **k6 0.55.0** - Performance load testing (baseline: login, search, create OT)
- **React Testing Library** - Component testing with shadcn/ui patterns

### Critical Constraints
- **Browsers**: Chrome and Edge ONLY (Chromium browsers)
- **Deployment**: Optimized for Vercel serverless
- **Scale**: 10,000 assets, 100 concurrent users (Phase 1)
- **Hosting**: Single-tenant (NOT multi-tenant SaaS)

---

## 📚 Documentación Referencial

**Importante:** Los documentos del proyecto han sido fragmentados en secciones manejables para optimizar el contexto de AI agents.

### Rutas de Acceso a Documentos Fragmentados

**Base Path:** `_bmad-output/planning-artifacts/`

#### PRD (Product Requirements Document)
- **Índice:** `prd/index.md`
- **Secciones Principales:**
  - `prd/executive-summary.md` - Visión, criterios de éxito
  - `prd/functional-requirements.md` - 123 FRs (10 áreas de capacidad)
  - `prd/non-functional-requirements.md` - 37 NFRs (performance, security, scalability)
  - `prd/user-journeys.md` - 5 journeys de usuario (Carlos, María, Javier, Elena, Pedro)
  - `prd/domain-specific-requirements.md` - Mantenimiento reglamentario, certificaciones
  - `prd/web-app-specific-requirements.md` - Performance targets, browser support
  - `prd/project-scoping-phased-development.md` - MVP strategy, fases (Phase 1-4)
  - `prd/visual-specifications.md` - Design system, key screens, iconography

#### Architecture Decision Document
- **Índice:** `architecture/index.md`
- **Secciones Principales:**
  - `architecture/project-context-analysis.md` - Análisis de requisitos, restricciones técnicas
  - `architecture/core-architectural-decisions.md` - Decisiones clave (data, auth, API, frontend, infra)
  - `architecture/implementation-patterns-consistency-rules.md` - Patrones de naming, estructura, formato
  - `architecture/project-structure-boundaries.md` - Estructura de directorios, boundaries
  - `architecture/architecture-validation-results.md` - Coherence, coverage, readiness validation

#### UX Design Specification
- **Índice:** `ux-design-specification/index.md`
- **Secciones Principales:**
  - `ux-design-specification/executive-summary.md` - Visión, usuarios, challenges
  - `ux-design-specification/core-user-experience.md` - Defining experience, mental model
  - `ux-design-specification/desired-emotional-response.md` - Emotional goals, journey mapping
  - `ux-design-specification/design-system-foundation.md` - shadcn/ui, customization strategy
  - `ux-design-specification/visual-design-foundation.md` - Color system, typography, spacing
  - `ux-design-specification/user-journey-flows.md` - 5 journeys con detalles
  - `ux-design-specification/component-strategy.md` - 8 componentes custom (OTCard, KanbanBoard, etc.)
  - `ux-design-specification/ux-consistency-patterns.md` - Buttons, feedback, forms, navigation
  - `ux-design-specification/responsive-design-accessibility.md` - Breakpoints, accessibility strategy

#### Epics & Stories
- **Índice:** `epics/index.md`
- **Secciones Principales:**
  - `epics/overview.md` - Overview de epics
  - `epics/requirements-inventory.md` - Inventario de requisitos (123 FRs, 37 NFRs)
  - `epics/epic-list.md` - Lista de 10 epics con resúmenes
  - `epics/epic-0-infraestructura-core-del-sistema.md` - 5 stories (Starter Template, DB, Auth, SSE, Error Handling)
  - `epics/epic-1-autenticacin-y-gestin-de-usuarios-pbac.md` - 11 stories
  - `epics/epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md` - 9 stories
  - `epics/epic-4-rdenes-de-trabajo-y-kanban-digital.md` - 9 stories
  - `epics/epic-5-control-de-stock-y-repuestos.md` - 7 stories
  - `epics/epic-6-gestin-de-proveedores.md` - 2 stories
  - `epics/epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md` - 4 stories
  - `epics/epic-8-kpis-dashboard-y-reportes-automticos.md` - 6 stories
  - `epics/epic-9-sincronizacin-multi-dispositivo-y-pwa.md` - 5 stories
  - `epics/epic-10-funcionalidades-adicionales-y-ux-avanzada.md` - 7 stories
  - `epics/resumen-final-de-todos-los-epics.md` - Resumen ejecutivo de todos los epics

#### Implementation Artifacts (Stories)
- **Epic 0 (Infraestructura)** - Stories completadas:
  - `0-1-starter-template-y-stack-tecnico.md`
  - `0-2-database-schema-prisma-con-jerarqua-5-niveles.md`
  - `0-3-nextauth-js-con-credentials-provider.md`
  - `0-4-sse-infrastructure-con-heartbeat.md`
  - `0-5-error-handling-observability-y-ci-cd.md` ⬅️ **Story 0.5 - Error Handling & Observability**
  - `1-1-login-registro-y-perfil-de-usuario.md` ⬅️ **Story 1.1 - En progreso**

### Documentos Completos (Archivados)

**Para referencia rápida, los documentos completos originales están archivados en:**
- `archive/prd.md` - PRD completo (123 FRs + 37 NFRs + todas las secciones)
- `archive/architecture.md` - Architecture completo (8 steps completados)
- `archive/ux-design-specification.md` - UX Design completo (14 steps completados)
- `archive/epics.md` - Epics completo (10 epics + 66 stories)

### Uso Recomendado para AI Agents

**Al implementar código:**
1. Referenciar secciones específicas fragmentadas (mejor para contexto)
2. Usar los índices para navegar a la sección relevante
3. Consultar documentos completos solo cuando necesites visión general

**Ejemplo de referencias:**
- "Según `prd/functional-requirements.md#1-gestin-de-averas`..."
- "De acuerdo con `architecture/core-architectural-decisions.md#data-architecture`..."
- "Como se especifica en `ux-design-specification/component-strategy.md#1-otcard`..."
- "Según `implementation-artifacts/0-5-error-handling-observability-y-ci-cd.md`..." (Story 0.5)

---

## Critical Implementation Rules

### Language-Specific Rules

#### TypeScript Configuration
- **Strict mode enabled** - All type checking enforced
- **Path aliases**: Use `@/` for root imports (configured in tsconfig.json)
- **No `any` types** - Use `unknown` or proper types instead
- **Type guards** - Use `isError()` and `isAppErrorLike()` for type narrowing

#### Import/Export Conventions
- **Components**: Named exports (e.g., `export function Button()`)
- **Server Actions**: `export async function` with `'use server'` directive at top
- **Types**: Export from `types/` folder (e.g., `types/models.ts`, `types/auth.ts`)
- **shadcn/ui components**: Default import (e.g., `import { Button } from "@/components/ui/button"`)
- **Utilities**: Named exports from `lib/utils/` and `lib/observability/`

#### Error Handling Patterns (CRITICAL - Story 0.5)
- **Custom error classes** defined in `lib/utils/errors.ts`:
  - `AppError` (base) - Includes: code, statusCode, message, details, timestamp, correlationId
  - `ValidationError` (400) - For input validation failures
  - `AuthorizationError` (403) - For PBAC capability checks
  - `AuthenticationError` (401) - For auth failures (used in Story 0.3)
  - `InsufficientStockError` (400) - For stock management
  - `InternalError` (500) - For unexpected server errors
- **Error messages in Spanish** - User-facing text must be Spanish
- **Server Actions**: Throw errors directly (Next.js handles them)
- **API Routes**: Use `apiErrorHandler()` from `lib/api/errorHandler.ts`
- **Type safety**: Use `isError()` guard before type assertions (see `lib/api/errorHandler.ts:31`)

#### Async/Await Patterns with Performance Tracking
- **Server Components**: Use `async/await` directly in component body
- **Server Actions**: Always async, validate with Zod first, then throw errors if needed
- **Database queries**: Use Prisma Client with `await` (returns camelCase properties)
- **Performance tracking**: Wrap slow queries with `trackPerformance(action, correlationId)`:
  ```typescript
  const perf = trackPerformance('seed_database', correlationId)
  await prisma.user.createMany({ data: users })
  perf.end(1000) // Log warning if >1s
  ```
- **Never use `.then()/.catch()`** - Always async/await for consistency

#### Type Safety Rules
- **Zod schemas generate TypeScript types** - Use `z.infer<typeof schema>` for type derivation
- **Prisma auto-generates types** - Use `Prisma.ModelName` types from `@prisma/client`
- **No type assertions without guards** - Use `isError()` before `error as Error`
- **Server Actions validate inputs** - Always parse with Zod before processing

#### Duck Typing Pattern (Avoid Circular Dependencies)
- **Logger pattern**: Use interface `AppErrorLike` with type guard `isAppErrorLike()`
- **Purpose**: Avoid circular imports between `lib/observability/logger.ts` and `lib/utils/errors.ts`
- **Usage**: Check for error structure, not instance of `AppError`
- **Example** (see `lib/observability/logger.ts:35-52`):
  ```typescript
  export interface AppErrorLike {
    code?: string
    message: string
    statusCode?: number
  }

  export function isAppErrorLike(error: unknown): error is AppErrorLike {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as AppErrorLike).message === 'string'
    )
  }
  ```

### Framework-Specific Rules

#### Next.js App Router Patterns
- **Server Components by default** - Only add `'use client'` when necessary (interactivity, hooks, browser APIs)
- **Route groups** - Use `(auth)` and `(public)` folders for logical grouping
- **Server Actions in `app/actions/`** - All server actions must be in dedicated action files
- **API Routes versioned** - Use `/api/v1/` prefix for all API endpoints

#### Error Boundary Pattern (CRITICAL - Story 0.5)
- **Root error boundary**: `app/error.tsx` (Client Component)
- **Correlation ID**: Display `error.digest` to users for support tracking
- **Client-side logging**: Use `logClientError()` from `lib/observability/client-logger.ts`
- **Rate limiting**: Client logger limited to 10 errors/minute (prevents endpoint spam)
- **User-friendly messages**: Spanish error messages, no technical jargon
- **Recovery**: Provide "Intentar nuevamente" button with `reset()` function

#### React Component Rules
- **Named exports** for components (e.g., `export function KanbanBoard()`)
- **PascalCase** for component files and names
- **Props destructuring** - Destructure props in function signature
- **Component location**:
  - Generic reusable: `components/ui/` (from shadcn/ui)
  - Feature-specific: `components/{feature}/` (e.g., `components/kanban/`)
  - Pages: `app/{route}/page.tsx`

#### State Management
- **Server Components**: Fetch data with async/await directly in component
- **Client Components**: Use TanStack Query for real-time data (KPIs, OTs)
- **Forms**: React Hook Form + Zod integration (use `useForm` hook)
- **Local state**: useState sparingly (prefer Server Component data)
- **Global state**: Avoid unless absolutely necessary (use Server Actions instead)

#### Performance Rules
- **Prefer Server Components** - Only Client Components when necessary
- **Code splitting**: Use `dynamic()` from Next.js for heavy components
- **Images**: Always use `<Image />` from `next/image` (automatic optimization)
- **Loading states**: Use Skeleton UI from shadcn/ui (NOT spinners)
- **Font optimization**: Use `next/font` for custom fonts

#### Data Fetching Patterns
- **Server Components**: `const data = await fetchData()` directly in component
- **Client Components**: `useQuery({ queryKey, queryFn })` from TanStack Query
- **Real-time updates**: SSE endpoint at `/api/v1/sse` with EventSource
- **Optimistic updates**: Use `onMutate` in TanStack Query mutations

#### Authorization in Components
- **Middleware protection** - Route-level protection in `middleware.ts`
- **Correlation ID propagation** - All requests include `x-correlation-id` header (generated in middleware)
- **Server Actions**: Check `session.user.capabilities.includes('can_do_action')`
- **UI adaptation**: Hide/show elements based on user capabilities
- **No role-based logic** - Use PBAC capabilities (15 granular capabilities)

#### Observability Integration (Story 0.5)
- **Health check endpoint**: `GET /api/v1/health` - Returns DB status, version, timestamp
- **Correlation IDs**: Generate in middleware, propagate to all logs/responses
- **Structured logging**: All logs use JSON format (Vercel compatible)
- **Performance tracking**: Log queries >1s threshold with `trackPerformance()`
- **Client error endpoint**: `POST /api/v1/log/error` for client-side error logging

### Testing Rules

#### Test Strategy Overview (CRITICAL)

This project uses a **multi-layered testing strategy** with complementary test types:

**E2E Tests (Playwright) - CRITICAL for User Journeys**
- Tests complete user workflows from login to completion
- Validates UI, API routes, authentication, authorization, and error handling
- Covers PBAC authorization checks and access control
- **59 E2E test files** covering all epics and stories
- **WHY CRITICAL**: Catches integration issues that unit/integration tests miss

**Integration Tests (Vitest) - CRITICAL for Business Logic**
- Tests Server Actions, middleware, and business rules
- Validates PBAC middleware logic and authorization checks
- Tests database operations and data transformations
- Tests state management and data fetching logic
- **~5 integration test files** for cross-feature validation
- **WHY CRITICAL**: Fast feedback on business logic without browser overhead

**Unit Tests (Vitest) - CRITICAL for Utilities**
- Tests pure functions, validation schemas, and utilities
- Tests formatters, transformers, and helpers
- Tests Zod schemas and type definitions
- **~10 unit test files** for isolated function testing
- **WHY CRITICAL**: Fastest feedback, catches bugs at function level

**API Tests (Playwright APIRequestContext) - MINIMAL**
- Only **1 test file** with 7 tests for public `/api/v1/capabilities` endpoint
- Tests endpoints that DON'T require authentication
- **WHY MINIMAL**: NextAuth makes authenticated API testing complex:
  - NextAuth uses JWT + CSRF tokens that are hard to manage in API-only tests
  - Most endpoints require session management that only works in browser context
  - E2E tests naturally handle auth flow, cookies, and session state
  - API tests for authenticated endpoints are error-prone and brittle

#### API Testing Limitations (IMPORTANT)

**What's Minimal:**
- **⚠️ NO comprehensive API test suite exists** - Only `tests/api/capabilities.spec.ts` (7 tests for public endpoint)
- **Authenticated endpoints NOT tested via API calls** - Tested via E2E + Integration instead

**What's NOT Minimal (Still Critical):**
- ✅ **Integration tests** ARE used for Server Actions, middleware, and business logic
- ✅ **Unit tests** ARE used for utilities, schemas, and pure functions
- ✅ **E2E tests** cover authenticated API routes through browser automation

**Why Not More API Tests?** NextAuth session management complexity:
  ```typescript
  // Required flow for authenticated API calls (complex and error-prone):
  // 1. GET /api/auth/csrf → Get CSRF token
  // 2. POST /api/auth/callback/credentials → Login with CSRF + credentials
  // 3. Extract cookies from response headers
  // 4. Pass cookies to subsequent API requests
  // This is brittle compared to E2E tests that handle auth automatically
  ```

**Testing Strategy for Authenticated Endpoints:**
| Endpoint | Auth Required | E2E Tests | Integration Tests | API Tests |
|----------|---------------|-----------|-------------------|-----------|
| `/api/v1/capabilities` | ❌ No | ✅ | ✅ | ✅ (only this one) |
| `/api/auth/*` | ✅ Yes (JWT) | ✅ | ✅ | ❌ (too complex) |
| `/api/v1/users` | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use E2E/Integration) |
| `/api/v1/users/[id]` | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use E2E/Integration) |
| Server Actions | ✅ Yes + PBAC | ✅ | ✅ | ❌ (use Integration) |

**Guidance:**
- **DO NOT add new API tests** for endpoints requiring authentication
- **DO use Integration tests** for Server Actions, middleware, and business logic
- **DO use E2E tests** for complete user workflows
- **DO use Unit tests** for utilities, schemas, and pure functions
- **Exception: Public endpoints** - Can be tested with API tests if they don't require auth

#### Test Organization
- **PRIMARY: E2E tests** - `tests/e2e/` folder (using Playwright) - Main testing strategy
- **Unit/Integration tests** - `tests/unit/` and `tests/integration/` (using Vitest)
- **API tests** - `tests/api/` folder (MINIMAL - only public endpoints)
- **Performance tests** - `tests/performance/baseline/` folder (using k6 scripts)
- **Test file naming**: `{ComponentName}.test.tsx` or `{functionName}.test.ts`
- **E2E test naming**: `story-{epic}-{story}.spec.ts` (e.g., `story-1.1-login.spec.ts`)

#### Mock Patterns
- **Prisma Client**: Mock `@prisma/client` for database tests
- **NextAuth session**: Mock `auth()` function for authentication tests
- **Server Actions**: Mock using vi.mock() for component tests
- **External APIs**: Mock fetch/axios for API route tests
- **Logger**: Mock `lib/observability/logger.ts` for tests that don't need logging
- **Performance tracking**: Mock `trackPerformance()` to avoid timing assertions

#### Test Coverage Expectations (Epic 0 Baseline)
- **Critical paths**: Server Actions, business logic (aim for >80%)
- **UI components**: Components with forms and validation (aim for >60%)
- **Utilities**: Helper functions, validation schemas (aim for >90%)
- **Error handling**: Custom error classes, error handlers (24/24 tests passing)
- **Observability**: Logger, performance tracking, client-logger (21/21 tests passing)
- **Not critical**: Simple presentational components (test manually if needed)

#### Test Boundaries

**Unit Tests (Vitest) - Fast, Isolated**
- Pure functions (formatters, transformers, validators)
- Zod schemas and type validation
- Utility functions and helpers
- **NO** database calls, **NO** external services
- **~10 test files** covering utilities and schemas
- **WHY CRITICAL**: Fastest feedback, catches bugs at function level

**Integration Tests (Vitest) - Medium Speed, Business Logic**
- Server Actions with test database
- Middleware logic (PBAC authorization, rate limiting)
- API routes with mocked external services
- Database operations and data transformations
- State management and data fetching logic
- **~5 test files** for cross-feature validation
- **WHY CRITICAL**: Validates business logic without browser overhead

**E2E Tests (Playwright) - Slow, Complete User Workflows**
- Critical user journeys (login → create OT → complete OT)
- UI components, forms, and user interactions
- Authentication flows (login, logout, password reset)
- Authorization checks (PBAC access control)
- **59 test files** covering all epics and stories
- **WHY CRITICAL**: Catches integration issues, validates complete flows

**API Tests (Playwright) - Minimal, Public Endpoints Only**
- Only public endpoints that don't require authentication
- Current: Only `/api/v1/capabilities` endpoint (7 tests)
- **WHY MINIMAL**: NextAuth makes authenticated API testing too complex
- Use **Integration + E2E tests** instead for authenticated endpoints
  - Tests ALL authenticated API routes via browser automation
  - Tests PBAC authorization checks (access denied scenarios)
  - Tests form validation, error handling, and user flows
- **API tests (MINIMAL)**: Only public endpoints that don't require authentication
  - Current: Only `/api/v1/capabilities` endpoint (7 tests)
  - Future: Only add API tests for truly public endpoints (no auth, no session)

#### Testing Framework Configuration
- **Unit/Integration**: Vitest 1.0.0 with jsdom environment
  - Config: `vitest.config.ts`
  - Setup file: `tests/setup.ts`
  - Coverage threshold: 70% (lines, functions, branches, statements)
- **E2E (PRIMARY)**: Playwright 1.48.0
  - Config: `playwright.config.ts`
  - Browsers: Chromium only (Chrome/Edge requirement)
  - Workers: 4 in CI, 8 locally (adjustable with `--workers`)
  - Timeouts: 60s test, 15s assertion, 30s navigation
  - **IMPORTANT**: Epic 1 tests require `--workers=1` (serial execution) to prevent race conditions
  - Test files: 59 E2E test files covering all user journeys
- **API Tests (MINIMAL)**: Playwright APIRequestContext
  - Only 1 test file: `tests/api/capabilities.spec.ts` (7 tests)
  - Tests public `/api/v1/capabilities` endpoint only
  - DO NOT add API tests for authenticated endpoints (use E2E instead)
- **Performance**: k6 0.55.0
  - Scripts: `tests/performance/baseline/*.js`
  - Baselines: login (100 users), asset-search (50 users), create-ot (20 users)
  - Run via: `npm run test:perf` or `npm run test:perf:{endpoint}`

#### Testing Best Practices
- **TDD cycle**: Write failing tests first (RED), implement to pass (GREEN), refactor (REFACTOR)
- **Describe blocks**: Group related tests with descriptive `describe()` blocks
- **Test isolation**: Each test should be independent (use `beforeEach` for setup)
- **Mock cleanup**: Use `vi.clearAllMocks()` in `beforeEach` to prevent test pollution
- **Dynamic imports**: Use ESM dynamic imports for Server Components in tests
- **Test IDs**: Use `data-testid` attributes for Playwright selectors

#### Performance Testing (k6 - Story 0.5)
- **Baseline scripts**: 3 load testing scenarios configured:
  - `login-load-test.js` - 100 concurrent users, login endpoint
  - `asset-search-load-test.js` - 50 concurrent users, search endpoint
  - `create-ot-load-test.js` - 20 concurrent users, create OT endpoint
- **Thresholds**: p95 latency <500ms for all endpoints
- **Documentation**: See `tests/performance/baseline/README.md`
- **Run commands**:
  - `npm run test:perf` - Run all performance tests
  - `npm run test:perf:login` - Login load test only
  - `npm run test:perf:asset-search` - Search load test only
  - `npm run test:perf:create-ot` - Create OT load test only

### Code Quality & Style Rules

#### ESLint/Prettier Configuration
- **ESLint 9.0.0** - Flat config format (`eslint.config.js`)
- **TypeScript strict rules** - Enforced via `@typescript-eslint/eslint-plugin`
- **No console.log in production** - Allow: `console.warn`, `console.error` only
- **No unused variables** - Enforced by TypeScript strict mode (ignore `_` prefix)
- **Consistent imports** - Group imports: external, internal, types
- **lint-staged**: Run on pre-commit via Husky (see `.husky/pre-commit`)

#### File and Folder Structure
- **Feature-based organization** - Group by feature, NOT by type
- **Standard folders**:
  - `app/` - Next.js App Router (pages, layouts, API routes)
  - `components/` - React components (ui/ for generic, {feature}/ for specific)
  - `lib/` - Utilities and helpers
    - `lib/auth.ts`, `lib/auth-adapter.ts` - Authentication
    - `lib/db.ts` - Prisma client singleton
    - `lib/utils/` - Utilities (errors.ts, etc.)
    - `lib/observability/` - Logging & performance (Story 0.5)
      - `logger.ts` - Structured logging
      - `performance.ts` - Performance tracking
      - `client-logger.ts` - Client-side logging with rate limiting
    - `lib/api/` - API utilities (Story 0.5)
      - `errorHandler.ts` - API error handler middleware
    - `lib/sse/` - SSE infrastructure
  - `types/` - TypeScript type definitions
  - `prisma/` - Database schema and migrations
  - `tests/` - All test files (unit/, integration/, e2e/, performance/)
- **Tests colocated** - Place `{file}.test.ts` next to `{file}.ts`

#### Naming Conventions
- **Database (Prisma schema)**: `snake_case` for tables and columns
  - Example: `work_order`, `first_name`, `created_at`
- **API endpoints**: Plural + kebab-case
  - Example: `/api/v1/work-orders`, `/api/v1/failure-reports`
- **Components**: PascalCase
  - Example: `KanbanBoard.tsx`, `UserForm.tsx`
- **Functions and variables**: camelCase
  - Example: `getUsers()`, `workOrderCount`
- **Folders**: kebab-case
  - Example: `components/kanban/`, `lib/observability/`
- **JSON responses**: camelCase (Prisma auto-converts from snake_case)
- **Error classes**: PascalCase with "Error" suffix
  - Example: `AppError`, `ValidationError`, `AuthorizationError`

#### Documentation Requirements
- **User-facing text**: Spanish (UI labels, error messages, notifications)
- **Code comments**: Spanish for domain logic, English for technical patterns
- **JSDoc**: Use for complex functions, exported utilities
  - Required for: `trackPerformance()`, `apiErrorHandler()`, exported functions
  - Format: Description, params (@param), returns (@returns)
- **Component documentation**: Add brief comment for complex UI components

#### Code Organization Patterns
- **One component per file** - Keep components focused and modular
- **Barrel exports** - Use `index.ts` to group related exports
- **Absolute imports** - Use `@/` alias for root imports (configured in tsconfig.json)
- **No circular dependencies** - Structure prevents import cycles
  - Example: Logger uses duck typing (`isAppErrorLike()`) to avoid importing `AppError`
- **Singleton pattern**: Use for Prisma client, logger (export const instance)

#### Git Hooks (Husky + lint-staged)
- **Pre-commit hook**: `.husky/pre-commit` runs `npx lint-staged`
- **lint-staged configuration** (package.json):
  - `*.ts,*.tsx`: eslint --fix
  - `tests/**/*.ts,*.tsx`: eslint --fix + typecheck (tsconfig.test.json)
  - `app/**/*.ts,*.tsx`: eslint --fix + typecheck
  - `lib/**/*.ts,*.tsx`: eslint --fix + typecheck
  - `middleware.ts`: eslint --fix + typecheck
- **Block commits on**: ESLint errors or TypeScript type errors

### Development Workflow Rules

#### Branch Naming Conventions
- **Feature branches**: `feature/{feature-name}` (e.g., `feature/kanban-board`)
- **Bug fixes**: `fix/{bug-description}` (e.g., `fix/login-validation`)
- **Refactoring**: `refactor/{description}` (e.g., `refactor/user-auth`)
- **Story branches**: `story/{epic-number}.{story-number}` (e.g., `story-1.1-login`)
- **Use kebab-case** - Always lowercase with hyphens
- **Descriptive names** - Make branch purpose clear

#### Commit Message Format
- **Format**: `{type}: {description in Spanish}`
- **Types**: `docs`, `feat`, `fix`, `refactor`, `test`, `chore`
- **Examples**:
  - `feat: agregar formulario de reporte de averías`
  - `fix: corregir validación de stock insuficiente`
  - `docs: actualizar README con instrucciones de deployment`
  - `test(story-0.5): agregar tests de error handling`
  - `feat(story-0.5): implementar infraestructura de observability`
- **AI-assisted commits**: Add `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

#### Pull Request Requirements
- **Clear description** - Explain what and why, not just what
- **Related issues** - Reference epic/story if applicable
- **Tests updated** - Ensure tests pass for new functionality
- **No merge conflicts** - Resolve before requesting review
- **Code review** - At least one approval required for main branch
- **CI/CD checks**: All GitHub Actions must pass (if configured)

#### Deployment Patterns
- **Vercel integration** - Automatic deploy on push to `main`
- **Environment variables**:
  - Use `.env.local` for local development (gitignored)
  - Use `.env.example` as template (committed)
  - Configure secrets in Vercel dashboard (see `VERCEL_SETUP.md`)
- **Database migrations** - Run `prisma migrate deploy` during deploy
- **No manual deployments** - All deployments via git push to main
- **Preview deployments**: Automatic for PRs (if Vercel GitHub integration configured)
- **Rollback**: 1-click rollback available in Vercel dashboard

#### Development Workflow
- **Feature branches** - Work on feature branches, NOT directly on main
- **Update frequently** - Pull latest main regularly to avoid conflicts
- **Test before commit** - Run tests and linting before pushing
  - `npm run test` - Run Vitest unit/integration tests
  - `npm run test:e2e` - Run Playwright E2E tests
  - `npm run lint` - Run ESLint
  - `npm run type-check` - Run TypeScript type checking
- **Clean git history** - Squash commits when merging if needed
- **Pre-commit hooks**: Husky runs lint-staged automatically

#### Available Scripts (package.json)
- **Development**:
  - `npm run dev` - Start Next.js dev server (port 3000)
  - `npm run build` - Build for production
  - `npm run start` - Start production server
- **Testing**:
  - `npm run test` - Run all Vitest tests
  - `npm run test:watch` - Run Vitest in watch mode
  - `npm run test:coverage` - Run tests with coverage report
  - `npm run test:unit` - Run unit tests only
  - `npm run test:integration` - Run integration tests only
  - `npm run test:e2e` - Run Playwright E2E tests
  - `npm run test:e2e:ui` - Run Playwright with UI
  - `npm run test:perf` - Run all k6 performance tests
  - `npm run test:perf:login` - Run login load test
  - `npm run test:perf:asset-search` - Run asset search load test
  - `npm run test:perf:create-ot` - Run create OT load test
- **Database**:
  - `npm run db:generate` - Generate Prisma client
  - `npm run db:push` - Push schema to database
  - `npm run db:seed` - Seed database with test data
  - `npm run db:studio` - Open Prisma Studio

### Critical Don't-Miss Rules

#### Anti-Patterns to Avoid
- **❌ NO WebSockets** - Use Server-Sent Events (SSE) instead (Vercel serverless incompatible)
- **❌ NO NextAuth.js v5** - Use v4.24.7 (v5 is beta, not stable)
- **❌ NO pre-defined roles** - Use PBAC with 15 granular capabilities
- **❌ NO Pages Router** - Use Next.js 15 App Router only
- **❌ NO mixing snake_case/camelCase** - DB: snake_case, Code: camelCase
- **❌ NO callbacks or .then()/.catch()** - Always use async/await for consistency
- **❌ NO any types** - Use `unknown` or proper TypeScript types
- **❌ NO console.log in production** - Use structured logging via `lib/observability/logger.ts`
- **❌ NO type assertions without guards** - Use `isError()` before `error as Error`
- **❌ NO circular dependencies** - Use duck typing patterns (e.g., `isAppErrorLike()`)
- **❌ NO exposing stack traces in production** - Use custom error classes with sanitized messages

#### Critical Edge Cases
- **5-level hierarchy strict** - Planta → Linea → Equipo → Componente → Repuesto (validate in Prisma)
- **Multiple OT assignment** - 1-3 technicians or providers (enforce maximum)
- **8-hour session timeout** - NextAuth must expire sessions after 8 hours
- **Login rate limiting** - 5 attempts per 15 minutes (in-memory, migrate to Redis Phase 2)
- **10K asset import** - Must complete in <5 minutes (use batch inserts)
- **10K+ asset search** - Must return results in <200ms (use DB indexes, caching)
- **Stock minimum alerts** - Alert only when stock <= minimum (not every update)
- **Real-time heartbeat** - SSE heartbeat every 30s, reconnect <30s if lost
- **Correlation ID propagation** - Every request/response must include `x-correlation-id` header
- **Performance tracking threshold** - Log queries >1000ms (1s) as warnings
- **Client error rate limiting** - Max 10 errors/minute per client (prevents endpoint spam)

#### Security Rules
- **🔒 Password hashing** - Always use bcryptjs (NOT bcrypt native - incompatible with Vercel)
- **🔒 Input sanitization** - Zod validates all inputs (prevents XSS, SQL injection)
- **🔒 PBAC verification** - Check capabilities in middleware, Server Actions, AND UI
- **🔒 HTTPS enforced** - Vercel auto-forwards HTTP to HTTPS
- **🔒 Critical actions audit** - Log capability changes, OT deletions, stock adjustments
- **🔒 No credentials in code** - Use environment variables (`.env.local`)
- **🔒 Session management** - NextAuth handles sessions, set maxAge to 8 hours
- **🔒 Sensitive data in logs** - NEVER log passwords, tokens, secrets (NFR-S8)
- **🔒 Error messages in production** - Sanitize stack traces, use Spanish user messages only
- **🔒 Test data cleanup protection** - Requires `can_manage_users` capability (Story 0.5)

#### Performance Gotchas
- **⚡ Default to Server Components** - Only Client Components when absolutely necessary
- **⚡ Skeleton UI not spinners** - Better UX for loading states (shadcn/ui has `<Skeleton />`)
- **⚡ DB indexes for search** - Create indexes on frequently searched fields
- **⚡ Pagination for long lists** - NEVER fetch all records at once (use cursor/offset pagination)
- **⚡ Optimize images** - Always use `<Image />` from Next.js (auto-optimization)
- **⚡ Code splitting** - Use `dynamic()` for heavy components (Kanban, Charts)
- **⚡ Cache KPIs** - Cache KPI calculations for 30s (TanStack Query staleTime)
- **⚡ Performance tracking placement** - Wrap slow operations with `trackPerformance()`:
  - Database queries that may exceed 1s
  - Bulk operations (seed, cleanup)
  - External API calls
- **⚡ Health check threshold** - Use 1000ms (1s) for DB connection check threshold

#### Domain-Specific Rules
- **Spanish user-facing text** - ALL UI labels, errors, notifications must be in Spanish
- **Chrome/Edge only** - NO support for Firefox, Safari, or IE (Chromium browsers only)
- **Single-tenant** - NOT multi-tenant SaaS (simplifies architecture)
- **Industrial environment** - Assume WiFi, tablets, Windows desktops, 4K TVs with Chrome
- **Always online** - PWA for installation/notifications, but requires internet connection
- **No offline mode** - System assumes constant connectivity (factory environment)

#### Error Handling Gotchas (Story 0.5)
- **🚨 Error boundary is Client Component** - `app/error.tsx` uses `'use client'` directive
- **🚨 Client-side logging rate limited** - Max 10 errors/minute per client
- **🚨 Correlation IDs in all responses** - Include in JSON responses for debugging
- **🚨 Type safety for error handlers** - Use `isError()` guard before type assertions
- **🚨 Duck typing for logger** - `isAppErrorLike()` avoids circular dependencies
- **🚨 Health check includes DB status** - Return `services.database: 'up'` or `'down'`
- **🚨 Performance tracking requires correlation ID** - Always pass `correlationId` to `trackPerformance()`

#### Observability Gotchas (Story 0.5)
- **📊 All logs in JSON format** - Vercel requires structured logging
- **📊 Log levels: DEBUG, INFO, WARN, ERROR** - Use appropriate level
- **📊 Stack traces only in development** - Production logs hide stack traces
- **📊 Performance logs include duration** - Log `duration` and `threshold` metadata
- **📊 Correlation IDs for traceability** - Every log must include `correlationId`
- **📊 Client errors go to endpoint** - POST to `/api/v1/log/error`, not `console.error()`

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge
- **Story 0.5 Reference**: See `_bmad-output/implementation-artifacts/0-5-error-handling-observability-y-ci-cd.md` for complete error handling patterns

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

**Recent Updates (2026-03-16):**
- ✅ Clarified testing strategy: Multi-layered (E2E + Integration + Unit), MINIMAL API tests only
- ✅ Documented NextAuth authentication limitations for API testing
- ✅ Added Epic 1 test execution: 21/22 passing (95.5%) in serial mode
- ✅ Fixed 4 failing P0 tests with serial execution configuration
- ✅ Test stability improved: 70.6% → 95.8%
- ✅ Added Story 0.5: Error Handling & Observability patterns
- ✅ Updated TanStack Query to 5.90.21
- ✅ Added k6 0.55.0 for performance testing
- ✅ Added structured logging, performance tracking, client logging rules
- ✅ Updated rule count: 95 → 140 rules
- ✅ Total tests: 59 E2E + ~10 Unit + ~5 Integration + 7 API = ~81 test files

Last Updated: 2026-03-10
