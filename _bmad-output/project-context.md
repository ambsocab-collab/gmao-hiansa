---
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-07'
sections_completed:
  ['technology_stack', 'documentation_references', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
status: 'complete'
rule_count: 95
optimized_for_llm: true
existing_patterns_found: 24
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core Framework
- **Next.js 15.0.3** with App Router (NOT Pages Router)
- **TypeScript 5.3.3** with strict mode enabled
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
- **TanStack Query 5.51.0** - Real-time data fetching (KPIs every 30s)
- **React Hook Form 7.51.5** - Form handling with Zod integration
- **Zod 3.23.8** - Type-safe validation (schemas auto-generate TypeScript types)

### Real-time Communication
- **Server-Sent Events (SSE)** - NOT WebSockets (incompatible with Vercel serverless)
- Heartbeat: 30 seconds
- Auto-reconnection: <30 seconds

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
- "Según `epics/epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-43`..."

---

## Critical Implementation Rules

### Language-Specific Rules

#### TypeScript Configuration
- **Strict mode enabled** - All type checking enforced
- **Path aliases**: Use `@/` for root imports (configured in tsconfig.json)
- **No `any` types** - Use `unknown` or proper types instead

#### Import/Export Conventions
- **Components**: Named exports (e.g., `export function Button()`)
- **Server Actions**: `export async function` with `'use server'` directive at top
- **Types**: Export from `types/` folder (e.g., `types/models.ts`, `types/auth.ts`)
- **shadcn/ui components**: Default import (e.g., `import { Button } from "@/components/ui/button"`)

#### Error Handling Patterns
- **Custom error classes** defined in `lib/utils/errors.ts`:
  - `AppError` (base), `ValidationError` (400), `AuthorizationError` (403), `InsufficientStockError` (400)
- **Error messages in Spanish** - User-facing text must be Spanish
- **Server Actions**: Throw errors directly (Next.js handles them)
- **API Routes**: Use error handler middleware from `lib/api/errors.ts`

#### Async/Await Patterns
- **Server Components**: Use `async/await` directly in component body
- **Server Actions**: Always async, validate with Zod first, then throw errors if needed
- **Database queries**: Use Prisma Client with `await` (returns camelCase properties)
- **Never use `.then()/.catch()`** - Always async/await for consistency

#### Type Safety Rules
- **Zod schemas generate TypeScript types** - Use `z.infer<typeof schema>` for type derivation
- **Prisma auto-generates types** - Use `Prisma.ModelName` types from `@prisma/client`
- **No type assertions** - Let TypeScript infer types when possible
- **Server Actions validate inputs** - Always parse with Zod before processing

### Framework-Specific Rules

#### Next.js App Router Patterns
- **Server Components by default** - Only add `'use client'` when necessary (interactivity, hooks, browser APIs)
- **Route groups** - Use `(auth)` and `(public)` folders for logical grouping
- **Server Actions in `app/actions/`** - All server actions must be in dedicated action files
- **API Routes versioned** - Use `/api/v1/` prefix for all API endpoints

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
- **Server Actions**: Check `session.user.capabilities.includes('can_do_action')`
- **UI adaptation**: Hide/show elements based on user capabilities
- **No role-based logic** - Use PBAC capabilities (15 granular capabilities)

### Testing Rules

#### Test Organization
- **Colocate tests with code** - Place test files next to files they test
- **Test file naming**: `{ComponentName}.test.tsx` or `{functionName}.test.ts`
- **Integration tests**: `__tests__/` folder for cross-feature tests
- **E2E tests**: `e2e/` folder (using Playwright or similar)

#### Mock Patterns
- **Prisma Client**: Mock `@prisma/client` for database tests
- **NextAuth session**: Mock `auth()` function for authentication tests
- **Server Actions**: Mock using vi.mock() for component tests
- **External APIs**: Mock fetch/axios for API route tests

#### Test Coverage Expectations
- **Critical paths**: Server Actions, business logic (aim for >80%)
- **UI components**: Components with forms and validation (aim for >60%)
- **Utilities**: Helper functions, validation schemas (aim for >90%)
- **Not critical**: Simple presentational components (test manually if needed)

#### Test Boundaries
- **Unit tests**: Pure functions, Zod schemas, utilities (no DB, no external calls)
- **Integration tests**: Server Actions with test database, API routes with mocked services
- **E2E tests**: Critical user journeys (login → create OT → complete OT)

#### Testing Framework
- **Unit/Integration**: Vitest (configured for Next.js 15)
- **E2E**: Playwright (when critical flows are implemented)
- **Component testing**: React Testing Library (shadcn/ui patterns)

### Code Quality & Style Rules

#### ESLint/Prettier Configuration
- **ESLint**: Configured for Next.js 15 + TypeScript strict rules
- **No console.log in production** - Use proper logging if needed
- **No unused variables** - Enforced by TypeScript strict mode
- **Consistent imports** - Group imports: external, internal, types

#### File and Folder Structure
- **Feature-based organization** - Group by feature, NOT by type
- **Standard folders**:
  - `app/` - Next.js App Router (pages, layouts, API routes)
  - `components/` - React components (ui/ for generic, {feature}/ for specific)
  - `lib/` - Utilities and helpers (auth/, db/, utils/, api/)
  - `types/` - TypeScript type definitions
  - `prisma/` - Database schema and migrations
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
  - Example: `components/kanban/`, `lib/auth/`
- **JSON responses**: camelCase (Prisma auto-converts from snake_case)

#### Documentation Requirements
- **User-facing text**: Spanish (UI labels, error messages, notifications)
- **Code comments**: Spanish for domain logic, English for technical patterns
- **JSDoc**: Use for complex functions, exported utilities
- **Component documentation**: Add brief comment for complex UI components

#### Code Organization Patterns
- **One component per file** - Keep components focused and modular
- **Barrel exports** - Use `index.ts` to group related exports
- **Absolute imports** - Use `@/` alias for root imports (configured in tsconfig.json)
- **No circular dependencies** - Structure prevents import cycles

### Development Workflow Rules

#### Branch Naming Conventions
- **Feature branches**: `feature/{feature-name}` (e.g., `feature/kanban-board`)
- **Bug fixes**: `fix/{bug-description}` (e.g., `fix/login-validation`)
- **Refactoring**: `refactor/{description}` (e.g., `refactor/user-auth`)
- **Use kebab-case** - Always lowercase with hyphens
- **Descriptive names** - Make branch purpose clear

#### Commit Message Format
- **Format**: `{type}: {description in Spanish}`
- **Types**: `docs`, `feat`, `fix`, `refactor`, `test`, `chore`
- **Examples**:
  - `feat: agregar formulario de reporte de averías`
  - `fix: corregir validación de stock insuficiente`
  - `docs: actualizar README con instrucciones de deployment`
- **AI-assisted commits**: Add `Co-Authored-By: Claude Sonnet 4.x <noreply@anthropic.com>`

#### Pull Request Requirements
- **Clear description** - Explain what and why, not just what
- **Related issues** - Reference epic/story if applicable
- **Tests updated** - Ensure tests pass for new functionality
- **No merge conflicts** - Resolve before requesting review
- **Code review** - At least one approval required for main branch

#### Deployment Patterns
- **Vercel integration** - Automatic deploy on push to `main`
- **Environment variables**:
  - Use `.env.local` for local development (gitignored)
  - Use `.env.example` as template (committed)
  - Configure secrets in Vercel dashboard
- **Database migrations** - Run `prisma migrate deploy` during deploy
- **No manual deployments** - All deployments via git push to main

#### Development Workflow
- **Feature branches** - Work on feature branches, NOT directly on main
- **Update frequently** - Pull latest main regularly to avoid conflicts
- **Test before commit** - Run tests and linting before pushing
- **Clean git history** - Squash commits when merging if needed

### Critical Don't-Miss Rules

#### Anti-Patterns to Avoid
- **❌ NO WebSockets** - Use Server-Sent Events (SSE) instead (Vercel serverless incompatible)
- **❌ NO NextAuth.js v5** - Use v4.24.7 (v5 is beta, not stable)
- **❌ NO pre-defined roles** - Use PBAC with 15 granular capabilities
- **❌ NO Pages Router** - Use Next.js 15 App Router only
- **❌ NO mixing snake_case/camelCase** - DB: snake_case, Code: camelCase
- **❌ NO callbacks or .then()/.catch()** - Always use async/await for consistency
- **❌ NO any types** - Use `unknown` or proper TypeScript types
- **❌ NO console.log in production** - Use proper logging if needed

#### Critical Edge Cases
- **5-level hierarchy strict** - Planta → Linea → Equipo → Componente → Repuesto (validate in Prisma)
- **Multiple OT assignment** - 1-3 technicians or providers (enforce maximum)
- **8-hour session timeout** - NextAuth must expire sessions after 8 hours
- **Login rate limiting** - 5 attempts per 15 minutes (in-memory, migrate to Redis Phase 2)
- **10K asset import** - Must complete in <5 minutes (use batch inserts)
- **10K+ asset search** - Must return results in <200ms (use DB indexes, caching)
- **Stock minimum alerts** - Alert only when stock <= minimum (not every update)
- **Real-time heartbeat** - SSE heartbeat every 30s, reconnect <30s if lost

#### Security Rules
- **🔒 Password hashing** - Always use bcryptjs (NOT bcrypt native - incompatible with Vercel)
- **🔒 Input sanitization** - Zod validates all inputs (prevents XSS, SQL injection)
- **🔒 PBAC verification** - Check capabilities in middleware, Server Actions, AND UI
- **🔒 HTTPS enforced** - Vercel auto-forwards HTTP to HTTPS
- **🔒 Critical actions audit** - Log capability changes, OT deletions, stock adjustments
- **🔒 No credentials in code** - Use environment variables (`.env.local`)
- **🔒 Session management** - NextAuth handles sessions, set maxAge to 8 hours

#### Performance Gotchas
- **⚡ Default to Server Components** - Only Client Components when absolutely necessary
- **⚡ Skeleton UI not spinners** - Better UX for loading states (shadcn/ui has `<Skeleton />`)
- **⚡ DB indexes for search** - Create indexes on frequently searched fields
- **⚡ Pagination for long lists** - NEVER fetch all records at once (use cursor/offset pagination)
- **⚡ Optimize images** - Always use `<Image />` from Next.js (auto-optimization)
- **⚡ Code splitting** - Use `dynamic()` for heavy components (Kanban, Charts)
- **⚡ Cache KPIs** - Cache KPI calculations for 30s (TanStack Query staleTime)

#### Domain-Specific Rules
- **Spanish user-facing text** - ALL UI labels, errors, notifications must be in Spanish
- **Chrome/Edge only** - NO support for Firefox, Safari, or IE (Chromium browsers only)
- **Single-tenant** - NOT multi-tenant SaaS (simplifies architecture)
- **Industrial environment** - Assume WiFi, tablets, Windows desktops, 4K TVs with Chrome
- **Always online** - PWA for installation/notifications, but requires internet connection
- **No offline mode** - System assumes constant connectivity (factory environment)

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-03-07
