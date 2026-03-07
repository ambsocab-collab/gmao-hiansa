# Implementation Patterns & Consistency Rules

## Pattern Categories Defined

**Critical Conflict Points Identified:**
24 áreas donde agentes AI podrían hacer elecciones diferentes si no se especifican patrones claros.

## Naming Patterns

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

## Structure Patterns

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

## Format Patterns

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

## Communication Patterns

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

## Process Patterns

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

## Enforcement Guidelines

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

## Pattern Examples

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
