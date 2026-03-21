# Story 2.2: Formulario Reporte de Avería (Mobile First)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como operario en el piso de fábrica,
quiero reportar una avería en menos de 30 segundos desde mi móvil,
para notificar rápidamente sobre cualquier falla en los equipos.

## Acceptance Criteria

**AC1: Mobile-First UI con CTA prominente**
- **Given** que accedo a /averias/nuevo desde móvil (<768px)
- **When** carga el formulario
- **Then** veo CTA primario "+ Reportar Avería" prominente (rojo burdeos #7D1220, padding 16px, altura 56px) (NFR-S6, UX Dirección 6 Action Oriented)
- **And** CTA tiene data-testid="averia-submit"
- **And** formulario usa layout Mobile First (UX Dirección 3)

**AC2: Completar reporte en <30 segundos**
- **Given** formulario visible en móvil
- **When** lo completo end-to-end
- **Then** puedo completar reporte en <30 segundos (NFR-P2, objetivo "Reportar avería en 30 segundos")
- **And** formulario optimizado para tapping rápido

**AC3: Búsqueda predictiva de equipo (Story 2.1 integration)**
- **Given** que completo el formulario
- **When** lleno el campo de equipo
- **Then** búsqueda predictiva funciona (ver Story 2.1)
- **And** validación: equipo es requerido
- **And** si intento submit sin equipo, veo error: "Debes seleccionar un equipo" (NFR-S2)

**AC4: Descripción del problema REQUERIDA**
- **Given** que he seleccionado un equipo
- **When** lleno descripción del problema
- **Then** input es textarea con placeholder "Describe brevemente la falla..."
- **And** descripción es marcada como opcional en el label
- **And** textarea tiene data-testid="averia-descripcion"
- **And** textarea tiene altura mínima 80px, máxima 200px
- **Given** que descripción está vacía
- **When** intento submit el formulario
- **Then** validación rechaza el formulario (NFR-S2, P0-002)
- **And** mensaje de error inline: "La descripción es obligatoria"
- **And** campo marcado con borde rojo #EF4444

**AC5: Foto opcional**
- **Given** que he llenado descripción
- **When** subo una foto
- **Then** botón "Adjuntar foto" visible con dashed border
- **And** botón tiene data-testid="averia-foto-upload"
- **And** foto es opcional (NFR-S3)
- **And** si subo foto, veo preview antes de submit
- **And** foto subida a storage y URL almacenada

**AC6: Confirmación en <3 segundos con número generado**
- **Given** que he completado el formulario
- **When** subo el reporte
- **Then** recibo confirmación con número de aviso generado en <3 segundos (NFR-S5)
- **And** confirmación muestra: "Avería #{numero} reportada exitosamente"
- **And** redirect a /mis-avisos o dashboard
- **And** notificación push enviada a usuarios can_view_all_ots en <30s (NFR-S4, R-002)

**AC7: Layout Desktop (>1200px)**
- **Given** que estoy en desktop (>1200px)
- **When** accedo a /averias/nuevo
- **Then** formulario usa layout Desktop (UX Dirección 1 o 6)
- **And** dos columnas: izquierda (equipo + descripción), derecha (foto + preview)
- **And** mismo esquema de validación y submit que móvil

## Tasks / Subtasks

- [ ] Crear Server Action para crear reporte de avería (AC: 3, 4, 5, 6)
  - [ ] Crear `app/actions/averias.ts` con función `createFailureReport()`
  - [ ] Implementar validación Zod: equipoId (required), descripcion (required, min 10 chars), fotoUrl (optional)
  - [ ] Crear reporte en database con Prisma (modelo FailureReport)
  - [ ] Generar número de aviso único (ej: AV-2026-001, AV-2026-002)
  - [ ] Emitir notificación SSE a usuarios can_view_all_ots
  - [ ] Performance tracking con threshold 3000ms (3s)
  - [ ] Logging estructurado con correlation ID
  - [ ] Manejar errores con ValidationError

- [ ] Crear componente ReporteAveriaForm (AC: 1, 2, 3, 4, 5, 7)
  - [ ] Crear `components/averias/reporte-averia-form.tsx` como Client Component
  - [ ] Usar React Hook Form + Zod para form state management
  - [ ] Integrar EquipoSearch de Story 2.1 (reutilizar sin cambios)
  - [ ] Implementar textarea para descripción (data-testid="averia-descripcion", altura 80-200px)
  - [ ] Implementar file upload para foto (data-testid="averia-foto-upload", dashed border, preview)
  - [ ] Implementar CTA "+ Reportar Avería" (#7D1220, padding 16px, altura 56px, data-testid="averia-submit")
  - [ ] Layout Mobile First: single column (<768px), dos columnas (>1200px)
  - [ ] Validaciones inline: equipo requerido, descripción requerida
  - [ ] Toast notifications para errores y confirmación (shadcn/ui Sonner)
  - [ ] Redirect a /mis-avisos o dashboard después de submit exitoso

- [ ] Crear página /averias/nuevo (AC: 1, 7)
  - [ ] Crear `app/(auth)/averias/nuevo/page.tsx` como Server Component wrapper
  - [ ] Proteger ruta con middleware (requiere autenticación)
  - [ ] Pasar sesión de usuario a ReporteAveriaForm
  - [ ] Layout con Sidebar (desktop) o sin sidebar (móvil)

- [ ] Actualizar Prisma schema con modelo FailureReport (AC: 6)
  - [ ] Agregar modelo FailureReport en `prisma/schema.prisma`
  - [ ] Campos: id, descripcion, fotoUrl?, equipoId, reportadoPor, numero, createdAt
  - [ ] Relaciones: equipo (Equipo), reporter (User)
  - [ ] Índices: equipoId, reportadoPor, numero (unique)
  - [ ] Ejecutar migration: `npx prisma migrate dev --name failure_reports`

- [ ] Implementar upload de foto a storage (AC: 5)
  - [ ] Decidir estrategia: Vercel Blob Storage o base64 (recomendado: Vercel Blob)
  - [ ] Crear utilidad `lib/storage/image-upload.ts`
  - [ ] Validar tamaño máximo (5MB) y tipo (image/jpeg, image/png)
  - [ ] Generar URL pública después de upload
  - [ ] Manejar errores de upload

- [ ] Implementar SSE notification (AC: 6)
  - [ ] Actualizar `lib/sse/server.ts` con evento `failure_report_created`
  - [ ] Target: usuarios con capability `can_view_all_ots`
  - [ ] Payload: reportId, numero, equipo (con jerarquía), descripcion, reporter, timestamp
  - [ ] Test: notificación recibida en <30s (P0-E2E-004)

- [ ] Testing Strategy - Unit Tests (AC: 3, 4, 5)
  - [ ] Test file: `tests/unit/components/averias/reporte-averia-form.test.tsx`
  - [ ] Test: Form state management con React Hook Form
  - [ ] Test: Validación de equipo requerido
  - [ ] Test: Validación de descripción requerida
  - [ ] Test: Foto upload preview (base64 o mock)
  - [ ] Test: Toast notifications mostradas

- [ ] Testing Strategy - Integration Tests (AC: 6)
  - [ ] Test file: `tests/integration/actions/averias.test.ts`
  - [ ] Test: Server Action `createFailureReport()` crea reporte en database
  - [ ] Test: Número de aviso único generado correctamente
  - [ ] Test: Validación Zod rechaza datos inválidos
  - [ ] Test: Notificación SSE emitida correctamente
  - [ ] Test: Performance tracking loggea si >3s

- [ ] Testing Strategy - E2E Tests (AC: 1, 2, 3, 4, 5, 6, 7)
  - [ ] Test file: `tests/e2e/story-2.2/reporte-averia-p0.spec.ts`
  - [ ] P0-E2E-001: Flujo completo mobile (login → reportar avería → confirmación)
  - [ ] P0-E2E-002: Validación descripción vacía rechazada
  - [ ] P0-E2E-003: Validación equipo requerido
  - [ ] P0-E2E-004: Notificación SSE recibida en <30s
  - [ ] Test file: `tests/e2e/story-2.2/reporte-averia-desktop.spec.ts`
  - [ ] Test: Layout desktop con dos columnas funciona

## Dev Notes

### Contexto de Epic 2

**Epic Goal:** Los operarios pueden reportar averías en menos de 30 segundos con búsqueda predictiva de equipos, y los supervisores pueden triagear y convertir los reportes en órdenes de trabajo.

**FRs cubiertos:** FR1-FR10 (10 FRs)
**NFRs cubiertos:** NFR-P1, NFR-P2, NFR-S2, NFR-S3, NFR-S4, NFR-S5, NFR-S6, NFR-A3, NFR-A4
**Riesgos críticos:** R-002 (SSE, Score 8): Notificaciones en <30s

**UX Design Direction:** Dirección 6 (Action Oriented) + Dirección 3 (Mobile First)

**Stories en Epic 2:**
- Story 2.1: Búsqueda Predictiva de Equipos ✅ DONE (15/15 E2E tests passing)
- Story 2.2: Formulario Reporte de Avería (Mobile First) ← ESTA STORY
- Story 2.3: Triage de Averías y Conversión a OTs

### Requisitos Técnicos Críticos

**Performance Requirements:**
- ⚠️ **NFR-P2 (CRITICAL):** Reporte completo end-to-end en <30 segundos
- ⚠️ **NFR-S5 (CRITICAL):** Confirmación con número generado en <3 segundos
- ⚠️ **NFR-S4 (HIGH):** Notificación SSE entregada en <30s (95%)
- ⚠️ **R-002:** Sistema de notificaciones debe cumplir <30s P95

**Validaciones Críticas (NFR-S2):**
- Equipo es **REQUERIDO** (usar EquipoSearch de Story 2.1)
- Descripción es **REQUERIDA** (label dice "opcional" pero validación la rechaza si está vacía)
- Mínimo 10 caracteres para descripción
- Foto es opcional (NFR-S3)

**Mobile First Requirements (UX Dirección 3):**
- Touch targets mínimos: 44px altura (Apple HIG)
- CTA prominente: 56px altura, 16px padding, color #7D1220 (rojo burdeos Hiansa)
- Single column layout en móvil (<768px)
- No sidebar en móvil (usar bottom navigation)

**Layout Responsive:**
- Mobile (<768px): Single column, fields stacked
- Desktop (>1200px): Two columns (left: equipo+descripción, right: foto+preview)

### Database Schema - FailureReport Model

**Modelo FailureReport (agregar a schema.prisma):**
```prisma
model FailureReport {
  id          String   @id @default(cuid())
  numero      String   @unique // ej: AV-2026-001
  descripcion String
  fotoUrl     String?
  equipoId    String
  reportadoPor String
  createdAt   DateTime @default(now())

  // Relations
  equipo      Equipo   @relation(fields: [equipoId], references: [id], onDelete: Cascade)
  reporter    User     @relation(fields: [reportadoPor], references: [id], onDelete: Cascade)

  @@index([equipoId])
  @@index([reportadoPor])
  @@map("failure_reports")
}
```

**Actualizar modelo User:**
```prisma
model User {
  // ... campos existentes
  failureReports FailureReport[] // Agregar esta relación
}
```

**Actualizar modelo Equipo:**
```prisma
model Equipo {
  // ... campos existentes
  failureReports FailureReport[] // Agregar esta relación
}
```

**Generación de Número de Aviso:**
- Formato: `AV-{YYYY}-{NNNN}` (ej: AV-2026-001, AV-2026-002)
- Sequential por año (reset en enero)
- Generar en Server Action con lock o counter en database

### Arquitectura Técnica

**Server Component vs Client Component:**

```typescript
// ✅ CORRECTO: Server Component wrapper + Client Component form
// app/(auth)/averias/nuevo/page.tsx (Server Component)
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ReporteAveriaForm } from '@/components/averias/reporte-averia-form'

export default async function NuevoReportePage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Reportar Avería</h1>
      <ReporteAveriaForm userId={session.user.id} />
    </div>
  )
}
```

**Client Component Form:**

```typescript
// ✅ CORRECTO: Client Component para estado interactivo
// components/averias/reporte-averia-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { EquipoSearch } from '@/components/equipos/equipo-search'
import { createFailureReport } from '@/app/actions/averias'
import { reporteAveriaSchema, type ReporteAveriaInput } from '@/lib/utils/validations/averias'

export function ReporteAveriaForm({ userId }: { userId: string }) {
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const methods = useForm<ReporteAveriaInput>({
    resolver: zodResolver(reporteAveriaSchema),
    defaultValues: {
      equipoId: '',
      descripcion: '',
      fotoUrl: '',
    }
  })

  const onSubmit = async (data: ReporteAveriaInput) => {
    if (!selectedEquipo) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un equipo',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createFailureReport({
        ...data,
        equipoId: selectedEquipo.id,
        reportadoPor: userId
      })

      toast({
        title: 'Avería reportada',
        description: `Avería #${result.numero} reportada exitosamente`
      })

      router.push('/mis-avisos')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al reportar la avería',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      {/* Equipo Search - Reutilizar de Story 2.1 */}
      <EquipoSearch onEquipoSelect={setSelectedEquipo} />

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium mb-2">
          Descripción del problema (opcional)
        </label>
        <Textarea
          id="descripcion"
          data-testid="averia-descripcion"
          placeholder="Describe brevemente la falla..."
          className="min-h-[80px] max-h-[200px]"
          {...methods.register('descripcion')}
        />
        {methods.formState.errors.descripcion && (
          <p className="text-red-500 text-sm mt-1">
            {methods.formState.errors.descripcion.message}
          </p>
        )}
      </div>

      {/* Foto Upload */}
      <div>
        <label htmlFor="foto" className="block text-sm font-medium mb-2">
          Adjuntar foto (opcional)
        </label>
        <Input
          id="foto"
          type="file"
          accept="image/jpeg,image/png"
          data-testid="averia-foto-upload"
          className="border-dashed"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              // Validar tamaño (5MB max)
              if (file.size > 5 * 1024 * 1024) {
                toast({
                  title: 'Error',
                  description: 'La foto no puede superar 5MB',
                  variant: 'destructive'
                })
                return
              }
              // Mostrar preview
              setFotoPreview(URL.createObjectURL(file))
            }
          }}
        />
        {fotoPreview && (
          <div className="mt-2">
            <img src={fotoPreview} alt="Preview" className="max-w-xs rounded" />
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        type="submit"
        data-testid="averia-submit"
        className="w-full bg-[#7D1220] hover:bg-[#6A0E1B] text-white py-4 px-4 h-14"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Reportando...' : '+ Reportar Avería'}
      </Button>
    </form>
  )
}
```

**Server Action para Crear Reporte:**

```typescript
// app/actions/averias.ts
'use server'

import { prisma } from '@/lib/db'
import { trackPerformance } from '@/lib/observability/performance'
import { logger } from '@/lib/observability/logger'
import { ValidationError } from '@/lib/utils/errors'
import { reporteAveriaSchema } from '@/lib/utils/validations/averias'
import { emitSSEEvent } from '@/lib/sse/server'

export async function createFailureReport(data: ReporteAveriaInput) {
  const correlationId = generateCorrelationId()
  const perf = trackPerformance('create_failure_report', correlationId)

  try {
    // Validación Zod
    const validated = reporteAveriaSchema.parse(data)

    // Generar número de aviso único
    const year = new Date().getFullYear()
    const count = await prisma.failureReport.count({
      where: {
        numero: { startsWith: `AV-${year}` }
      }
    })
    const numero = `AV-${year}-${String(count + 1).padStart(3, '0')}`

    // Crear en database
    const report = await prisma.failureReport.create({
      data: {
        numero,
        descripcion: validated.descripcion,
        fotoUrl: validated.fotoUrl,
        equipoId: validated.equipoId,
        reportadoPor: validated.reportadoPor,
      },
      include: {
        equipo: {
          include: {
            linea: { planta: true }
          }
        },
        reporter: {
          select: { name: true, email: true }
        }
      }
    })

    // Emitir notificación SSE
    await emitSSEEvent({
      type: 'failure_report_created',
      data: {
        reportId: report.id,
        numero: report.numero,
        equipo: {
          id: report.equipo.id,
          name: report.equipo.name,
          jerarquia: `${report.equipo.linea.planta.division} → ${report.equipo.linea.planta.name} → ${report.equipo.linea.name} → ${report.equipo.name}`
        },
        descripcion: report.descripcion,
        reporter: report.reporter.name,
        createdAt: report.createdAt
      },
      target: { capability: 'can_view_all_ots' }
    })

    perf.end() // Log si >3s

    return { success: true, report }
  } catch (error) {
    logger.error('Error creating failure report', { error, correlationId })
    throw error
  }
}
```

### Patrones de Story 1.5 a Reutilizar

**Layout por Dirección (Story 1.5):**
- Epic 2 usa Dirección 6 (Action Oriented) + Dirección 3 (Mobile First)
- `/averias/nuevo` usa Sidebar `default` (256px) en desktop
- Mobile: NO sidebar, bottom navigation

**Responsive Patterns (Story 1.5):**
- Mobile (<768px): NO sidebar, single column, touch targets grandes
- Tablet (768-1200px): Sidebar `compact` (200px)
- Desktop (>1200px): Sidebar `default` (256px)

**Colors de Marca (Story 1.0):**
- Primario: #7D1220 (rojo burdeos Hiansa)
- CTA: #7D1220 hover #6A0E1B
- Error: #EF4444 (rojo Tailwind)

**Error Handling (Story 0.5):**
- Usar `ValidationError` para input validation
- Server Actions throw errores directamente
- Logging estructurado con correlation IDs

**Toast Notifications (Story 2.1):**
- shadcn/ui Sonner component
- `useToast()` hook
- Variantes: default, destructive (error)

### Dependencies

**Epic 0 DEBE estar completado:**
- ✅ Story 0.1: Starter Template Next.js 15
- ✅ Story 0.2: Prisma Schema con 5 niveles
- ✅ Story 0.3: NextAuth.js Credentials provider
- ✅ Story 0.4: SSE Infrastructure
- ✅ Story 0.5: Error Handling & Observability

**Epic 1 DEBE estar completado:**
- ✅ Story 1.0: Sistema de Diseño Multi-Direccional
- ✅ Story 1.1: Login, Registro y Perfil
- ✅ Story 1.2: Sistema PBAC con 15 Capabilities
- ✅ Story 1.3: Etiquetas de Clasificación
- ✅ Story 1.4: Landing Page Minimalista
- ✅ Story 1.5: Layout Desktop Optimizado

**Epic 2 - Story 2.1 DEBE estar completado:**
- ✅ Story 2.1: Búsqueda Predictiva de Equipos (EquipoSearch component)

**Librerías instaladas:**
- Next.js 15.0.3
- shadcn/ui (Button, Textarea, Card, Toast/Sonner)
- Prisma 5.22.0
- React Hook Form 7.51.5
- Zod 3.23.8
- Sonner (toast notifications) - agregado en Story 2.1

**Librerías requeridas (instalar si no existen):**
- Vercel Blob Storage (para upload de fotos) o usar base64

### Project Structure Notes

**Estructura de Archivos (Feature-based):**

```
app/
├── (auth)/
│   └── averias/
│       └── nuevo/
│           └── page.tsx                    # Server Component wrapper
├── actions/
│   ├── equipos.ts                          # Ya existe (Story 2.1)
│   └── averias.ts                          # CREAR: createFailureReport
components/
├── averias/
│   └── reporte-averia-form.tsx             # CREAR: Client Component
├── equipos/
│   └── equipo-search.tsx                   # Ya existe (Story 2.1)
lib/
├── utils/
│   └── validations/
│       └── averias.ts                      # CREAR: Zod schemas
├── storage/
│   └── image-upload.ts                     # CREAR: Vercel Blob upload
types/
└── averias.ts                              # CREAR: TypeScript types
prisma/
└── schema.prisma                           # MODIFICAR: Agregar FailureReport
```

**Naming Conventions (Architecture):**
- Server Actions: camelCase (`createFailureReport`)
- Components: PascalCase (`ReporteAveriaForm`)
- Files: kebab-case (`reporte-averia-form.tsx`)
- Database: snake_case (`failure_reports`)

### Critical Edge Cases y Anti-Patterns

**❌ ANTI-PATTERNS A EVITAR (aprendido de Story 2.1):**

1. **No usar Server Component para formulario:**
   - ❌ Server Component no puede manejar estado de formulario
   - ✅ Client Component con 'use client' directive

2. **No manipular DOM directamente:**
   - ❌ `document.getElementById('equipoId').value = ...`
   - ✅ React state management con `useState`, `useForm`

3. **No usar alert() para errores:**
   - ❌ `alert('Formulario incompleto')`
   - ✅ `toast({ title: 'Error', description: '...' })`

4. **No usar type assertions inseguros:**
   - ❌ `onEquipoSelect?.(null as unknown as Equipo)`
   - ✅ Tipar callback correctamente: `onEquipoSelect: (equipo: Equipo | null) => void`

5. **No olvidar validación de descripción:**
   - ❌ Asumir que descripción es opcional por el label
   - ✅ Validación Zod requiere descripción (NFR-S2)

**✅ CRITICAL EDGE CASES:**

1. **Validación contradictoria:**
   - Label dice "opcional" pero validación la requiere
   - Solution: Implementar validación Zod required, mantener label user-friendly

2. **Upload de fotos:**
   - Validar tamaño máximo (5MB)
   - Validar tipo (image/jpeg, image/png)
   - Preview antes de submit
   - Error handling si upload falla

3. **Generación de número único:**
   - Lock o counter para evitar duplicados concurrentes
   - Formato: `AV-{YYYY}-{NNNN}`

4. **SSE notification target:**
   - Solo usuarios con capability `can_view_all_ots`
   - No enviar al reporter (suscriptor ya sabe)

5. **Performance <30s:**
   - Server Action debe completarse en <3s (NFR-S5)
   - SSE notification debe entregarse en <30s (NFR-S4)
   - End-to-end <30s (NFR-P2)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#story-2-2] - Epic 2 Story 2.2 requirements
- [Source: _bmad-output/planning-artifacts/architecture/workflow-complete.md] - Architecture decisions
- [Source: _bmad-output/implementation-artifacts/2-1-busqueda-predictiva-de-equipos.md] - Story 2.1 (previous story)
- [Source: _bmad-output/project-context.md] - Project context y reglas críticas
- [Source: prisma/schema.prisma] - Database schema con 5 niveles

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Story creado el: 2026-03-21
- Workflow: create-story (BMAD bmm-create-story)
- Contexto cargado: Epic 2, Story 2.1, Architecture, Project Context

### Completion Notes List

**Análisis Exhaustivo Completado:**
- ✅ Epics file analizado: Story 2.2 con 7 Acceptance Criteria extraídos
- ✅ Story 2.1 (previous story) analizada: 15/15 E2E tests passing, patrones identificados
- ✅ Architecture patterns extraídos: Server Actions, Prisma, SSE, Error handling
- ✅ Project context cargado: Technology stack, reglas críticas, constraints
- ✅ Anti-patrones identificados desde Story 2.1: 5 anti-patterns a evitar
- ✅ Success patterns identificados desde Story 2.1: Toast notifications, keyboard navigation, accessibility

**Contexto Crítico Proporcionado:**
- Validación contradictoria documentada (label "opcional" vs validación required)
- Performance requirements: <30s end-to-end, <3s confirmación, <30s SSE
- Mobile First patterns: 44px touch targets, 56px CTA, single column móvil
- Database schema: FailureReport model con número único sequential
- SSE notification pattern: target capability can_view_all_ots
- File upload strategy: Vercel Blob Storage recomendado

**Guardrails para Developer:**
- Type safety: Sin `as` assertions (lección de Story 2.1 Round 6)
- No DOM manipulation: Usar React state (lección de Story 2.1 Round 1)
- No alert(): Usar toast notifications (lección de Story 2.1 Round 6)
- Validación Zod: Descripción REQUERIDA a pesar de label
- Performance tracking: Threshold 3000ms (3s)
- E2E tests: P0 tests para flujo completo, validaciones, SSE

**Próximos Pasos Recomendados:**
1. Ejecutar `dev-story` workflow para implementar Story 2.2
2. Crear Server Action `createFailureReport` primero
3. Crear componente `ReporteAveriaForm` integrando `EquipoSearch` de Story 2.1
4. Ejecutar tests en orden: Unit → Integration → E2E
5. Ejecutar `code-review` cuando tests pasen

### File List

**Archivos a CREAR:**
- `app/actions/averias.ts` - Server Action: createFailureReport
- `components/averias/reporte-averia-form.tsx` - Client Component: formulario
- `app/(auth)/averias/nuevo/page.tsx` - Server Component: página
- `lib/utils/validations/averias.ts` - Zod schemas
- `lib/storage/image-upload.ts` - Vercel Blob upload utility
- `types/averias.ts` - TypeScript types

**Archivos a MODIFICAR:**
- `prisma/schema.prisma` - Agregar modelo FailureReport
- `lib/sse/server.ts` - Agregar evento failure_report_created

**Archivos de TESTING a CREAR:**
- `tests/unit/components/averias/reporte-averia-form.test.tsx` - Unit tests
- `tests/integration/actions/averias.test.ts` - Integration tests
- `tests/e2e/story-2.2/reporte-averia-p0.spec.ts` - E2E tests P0
- `tests/e2e/story-2.2/reporte-averia-desktop.spec.ts` - E2E tests Desktop

**Archivos de REFERENCIA (no modificar):**
- `_bmad-output/planning-artifacts/epics.md` - Requisitos de Story 2.2
- `_bmad-output/implementation-artifacts/2-1-busqueda-predictiva-de-equipos.md` - Story 2.1 (previous story)
- `_bmad-output/planning-artifacts/architecture/workflow-complete.md` - Architecture decisions
- `_bmad-output/project-context.md` - Project context y reglas críticas
