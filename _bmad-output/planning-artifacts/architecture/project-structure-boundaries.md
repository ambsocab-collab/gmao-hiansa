# Project Structure & Boundaries

## Complete Project Directory Structure

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

## Architectural Boundaries

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

## Requirements to Structure Mapping

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

## Integration Points

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

## File Organization Patterns

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

## Development Workflow Integration

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
