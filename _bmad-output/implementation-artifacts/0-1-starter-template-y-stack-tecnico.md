# Story 0.1: Starter Template y Stack Técnico

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como desarrollador,
quiero inicializar el proyecto Next.js con el stack técnico completo,
para tener una base sólida y probada para el desarrollo.

## Acceptance Criteria

**Given** que el proyecto está vacío
**When** ejecuto `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
**Then** proyecto creado con Next.js 15.0.3 + TypeScript 5.6.0
**And** directorio structure creada con /app, /components, /lib, /prisma, /types, /public

**Given** proyecto Next.js creado
**When** instalo dependencias críticas (Prisma 5.22.0, NextAuth 4.24.7, shadcn/ui, Zod 3.23.8, React Hook Form 7.51.5, TanStack Query 5.51.0, Lucide React 0.344.0, bcryptjs 2.4.3)
**Then** todas las dependencias instaladas sin conflictos de versiones
**And** package.json contiene todas las dependencias con versiones verificadas

**Given** dependencias instaladas
**When** configuro Tailwind CSS con colores del design system
**Then** colors configurados: rojo burdeos #7D1220, HiRock #FFD700, Ultra #8FBC8F, 8 estados OT
**And** fuente Inter configurada con scale completa (12px a 36px)
**And** spacing system basado en grid de 8px

**Given** Tailwind configurado
**When** inicializo shadcn/ui
**Then** componentes base instalados (Button, Card, Dialog, Form, Table, Toast)
**And** components path alias configurado (@/components/ui)
**And** Tailwind config extendido con colores custom

**Testability:**
- data-testid attributes definidos para componentes base
- Configuración de Playwright preparada para testing E2E
- Environment variables documentadas en .env.example

## Tasks / Subtasks

- [x] Crear proyecto Next.js con create-next-app (AC: 1)
  - [x] Ejecutar comando: `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
  - [x] Verificar estructura de directorios creada
  - [x] Confirmar Next.js 15.0.3 y TypeScript 5.3.3 instalados
- [x] Instalar dependencias críticas (AC: 2)
  - [x] Instalar Prisma 5.22.0 y @prisma/client@5.22.0
  - [x] Instalar NextAuth 4.24.7 (NO usar v5 beta)
  - [x] Instalar bcryptjs 2.4.3 y @types/bcryptjs@2.4.6
  - [x] Instalar Zod 3.23.8
  - [x] Instalar React Hook Form 7.51.5
  - [x] Instalar TanStack Query (usando última versión 5.x estable: 5.90.21)
  - [x] Instalar Lucide React 0.344.0
  - [x] Verificar package.json con versiones correctas
- [x] Configurar Tailwind CSS con design system (AC: 3)
  - [x] Configurar colores custom en tailwind.config.js
  - [x] Configurar fuente Inter con escala completa
  - [x] Configurar spacing system basado en grid de 8px
- [x] Inicializar shadcn/ui (AC: 4)
  - [x] Ejecutar `npx shadcn-ui@latest init`
  - [x] Instalar componentes base (Button, Card, Dialog, Form, Table, Toast)
  - [x] Verificar path alias @/components/ui
  - [x] Extender Tailwind config con colores custom
- [x] Configurar testability (AC: 5)
  - [x] Agregar data-testid attributes a componentes base
  - [x] Crear configuración de Playwright para E2E
  - [x] Documentar environment variables en .env.example

## Dev Notes

### Requisitos Críticos del Stack Técnico

**Next.js 15.0.3 con App Router:**
- Usar App Router (NO Pages Router)
- Estructura sin directorio /src (usar /app directo)
- Server Components por defecto
- Import alias @/* configurado

**TypeScript 5.3.3 - Configuración Estricta:**
- Strict mode enabled
- No usar tipos `any` (usar `unknown` o tipos proper)
- Path aliases: @/ para imports desde root
- Named exports para componentes
- Export types desde carpeta /types

**Tailwind CSS 3.4.1 - Design System:**
- Colores del GMAO HiRock/Ultra:
  - Rojo Burdeos: #7D1220
  - HiRock: #FFD700
  - Ultra: #8FBC8F
  - 8 estados OT (colores semáforo)
- Fuente Inter con escala completa (12px a 36px)
- Spacing system basado en grid de 8px
- Mobile-first approach

**shadcn/ui - Componentes Base:**
- Instalar usando `npx shadcn-ui@latest init`
- Componentes requeridos: Button, Card, Dialog, Form, Table, Toast
- Path alias: @/components/ui
- Componentes copiados al código (100% personalizable)
- WCAG AA compliant

**Dependencias Críticas con Versiones Verificadas:**
- Prisma 5.22.0 (ORM)
- NextAuth 4.24.7 (Authentication - CRITICAL: NO v5 beta)
- Zod 3.23.8 (Validation)
- React Hook Form 7.51.5 (Form handling)
- TanStack Query 5.51.0 (Data fetching)
- Lucide React 0.344.0 (Icons)
- bcryptjs 2.4.3 (Password hashing - compatible con Vercel)

⚠️ **IMPORTANTE:** Verificar versiones actuales antes de instalar:
```bash
npm view next version
npm view prisma version
npm view next-auth version
```

### Project Structure Notes

**Estructura de Directorios Requerida:**
```
gmao-hiansa/
├── app/                    # Next.js App Router (sin /src)
│   ├── (auth)/            # Rutas autenticadas (dashboard, kanban)
│   ├── (public)/          # Rutas públicas (login)
│   ├── api/               # API Routes
│   ├── actions/           # Server Actions
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── forms/            # Formularios
│   └── [feature]/        # Componentes específicos por feature
├── lib/                   # Utilidades y helpers
│   ├── auth.ts           # Utilidades de autenticación
│   ├── db.ts             # Prisma client singleton
│   ├── utils.ts          # Utilidades generales
│   └── sse.ts            # Server-Sent Events utilities
├── prisma/
│   ├── schema.prisma     # Schema de base de datos
│   └── seed.ts           # Seeds de desarrollo
├── types/                 # TypeScript types
│   ├── auth.ts           # Types de NextAuth
│   ├── models.ts         # Types de dominio
│   └── api.ts            # Types de API
└── public/               # Archivos estáticos
```

**Alineación con Unified Project Structure:**
- Feature-based organization en /components
- Server Actions en /app/actions/
- Types centralizados en /types/
- Lib/utilities en /lib/
- No se detectan conflictos (es el primer story)

### Testing Requirements

**Configuración de Testing:**
- Agregar data-testid attributes a componentes base de shadcn/ui
- Preparar configuración de Playwright para E2E testing
- Documentar environment variables en .env.example

**Frameworks a instalar en stories futuras:**
- Vitest para unit/integration tests
- React Testing Library para component tests
- Playwright para E2E tests

**Estrategia de Testing:**
- Tests colocados junto al código (colocation)
- Critical paths: >80% coverage
- UI components: >60% coverage
- Utilities: >90% coverage

### Configuration Files

**Archivos de Configuración a Crear/Modificar:**

1. **tsconfig.json** - Type aliases y paths
   - Configurar @/ alias para imports absolutos
   - Strict mode enabled
   - ES2020 target para compatibilidad

2. **tailwind.config.ts** - Design system
   - Extender theme con colores custom
   - Configurar fontFamily Inter
   - Spacing scale basado en 8px

3. **components.json** - shadcn/ui config
   - Configurar path alias @/components/ui
   - Configurar Tailwind CSS integration
   - Configurar TypeScript + RSC

4. **.env.example** - Environment variables template
   - Documentar todas las variables requeridas
   - DATABASE_URL, NEXTAUTH_SECRET, etc.
   - NO incluir valores reales

### References

**Documentos de Arquitectura:**
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Decision Priority Analysis]
- [Source: _bmad-output/planning-artifacts/architecture/starter-template-evaluation.md#Selected Starter]
- [Source: _bmad-output/project-context.md#Technology Stack & Versions]

**Versiones Estables Verificadas (Enero 2025):**
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Versiones Estables Verificadas]

**Design System Colors:**
- [Source: _bmad-output/planning-artifacts/prd/visual-specifications.md#Design System]

**Project Structure:**
- [Source: _bmad-output/planning-artifacts/architecture/starter-template-evaluation.md#Code Organization]

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No previous implementation to reference (first story of Epic 0).

### Completion Notes List

✅ **Story 0.1 Completada Exitosamente**

**Implementación Realizada:**
- Proyecto Next.js 15.0.3 verificado con estructura correcta
- TypeScript 5.6.0 instalado (actualizado de 5.3.3 a versión superior disponible)
- tsconfig.json target configurado en ES2020 (cumpliendo especificación de compatibilidad)
- Todas las dependencias críticas instaladas sin conflictos:
  - Prisma 5.22.0 ✅
  - NextAuth 4.24.7 ✅ (NO v5 beta)
  - bcryptjs 2.4.3 ✅
  - Zod 3.23.8 ✅
  - React Hook Form 7.51.5 ✅
  - TanStack Query 5.90.21 ✅ (usando última versión 5.x estable)
  - Lucide React 0.344.0 ✅
  - shadcn/ui dependencies ✅

**Configuración del Design System:**
- Tailwind CSS 3.4.1 configurado con colores del GMAO:
  - Rojo Burdeos: #7D1220 ✅
  - HiRock Gold: #FFD700 ✅
  - Ultra Green: #8FBC8F ✅
  - 8 estados OT con colores semáforo ✅
- Fuente Inter configurada con next/font/google (optimización Next.js 15) ✅
- Escala de fuente de 12px a 36px ✅
- Spacing system basado en grid de 8px ✅

**Componentes shadcn/ui:**
- Button, Card, Dialog, Form, Input, Label, Select, Table, Toast instalados ✅
- Path alias @/components/ui configurado ✅
- Soporte para data-testid agregado a TODOS los componentes base ✅
  - Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter ✅
  - Dialog, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription ✅
  - Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage ✅
  - Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption ✅
  - Toast, ToastViewport, ToastTitle, ToastDescription, ToastAction, ToastClose ✅

**Testing Infrastructure:**
- Playwright configurado para testing E2E ✅
- Vitest configurado para unit/integration tests ✅
- Environment variables documentadas en .env.example ✅

**Estructura de Directorios:**
- /app, /components, /lib, /prisma, /types creados ✅
- Archivos de tipos base creados (auth.ts, models.ts, api.ts, index.ts) ✅

**Validaciones Pasadas:**
- TypeScript type-check: ✅ Sin errores
- Production build: ✅ Compilación exitosa
- Todas las dependencias en package.json verificadas ✅

**Notas de Implementación:**
- El proyecto ya existía con estructura base, se completó la configuración
- TanStack Query 5.51.0 no existía, se usó 5.90.21 (última 5.x estable)
- TypeScript actualizado de 5.3.3 a 5.6.0 (versión superior disponible)
- tsconfig.json target corregido de ES2017 a ES2020 para cumplir especificaciones
- Componente Table fue instalado manualmente (CLI de shadcn con problemas de registry)
- Se agregó data-testid a todos los componentes base (Button, Card, Dialog, Form, Table, Toast)
- Se instalaron todas las dependencias de shadcn/ui necesarias
- Configuración completa lista para desarrollo de features

**Correcciones Aplicadas durante Code Review:**
- ✅ Componente Table instalado manualmente
- ✅ data-testid agregado a todos los componentes UI base
- ✅ tsconfig.json target actualizado a ES2020
- ✅ File List actualizado con todos los cambios realizados
- ✅ Versión de TypeScript documentada correctamente como 5.6.0

### File List

**Archivos Modificados/Creados:**

**Configuración:**
- `package.json` - Dependencias críticas agregadas (TypeScript 5.6.0, Next.js 15.0.3, TanStack Query 5.90.21)
- `package-lock.json` - Lock file actualizado con nuevas dependencias
- `tailwind.config.js` - Colores GMAO y fuente Inter configurados
- `.env.example` - Documentación completa de environment variables
- `tsconfig.json` - Target actualizado a ES2020, include/exclude ajustados
- `app/layout.tsx` - Fuente Inter con next/font/google
- `.gitignore` - Ajustado para el proyecto

**Directorios Creados:**
- `types/` - Directorio de tipos TypeScript creado
- `types/index.ts` - Export barrel para types
- `types/auth.ts` - Types de NextAuth
- `types/models.ts` - Types de dominio (Capabilities, WorkOrderStatus, etc.)
- `types/api.ts` - Types de API responses

**Componentes UI Actualizados:**
- `components/ui/button.tsx` - Soporte para data-testid agregado ✅
- `components/ui/card.tsx` - Soporte para data-testid agregado a todos los subcomponentes ✅
- `components/ui/dialog.tsx` - Soporte para data-testid agregado a todos los subcomponentes ✅
- `components/ui/form.tsx` - Soporte para data-testid agregado a todos los subcomponentes ✅
- `components/ui/toast.tsx` - Soporte para data-testid agregado a todos los subcomponentes ✅
- `components/ui/table.tsx` - Componente Table instalado con data-testid support ✅

**Archivos Existentes (Verificados):**
- `app/globals.css` - Estilos base de Tailwind ✅
- `components/ui/input.tsx` - Componente Input ✅
- `components/ui/label.tsx` - Componente Label ✅
- `components/ui/select.tsx` - Componente Select ✅
- `components/ui/toaster.tsx` - Componente Toaster ✅
- `components/ui/use-toast.ts` - Hook useToast ✅
- `lib/utils.ts` - Utilidades base ✅
- `playwright.config.ts` - Configuración E2E ✅
- `vitest.config.ts` - Configuración unit tests ✅

**Archivos Generados:**
- `next-env.d.ts` - TypeScript definitions generadas por Next.js
- `vercel.json` - Configuración de deployment en Vercel (opcional)

**Directorios Creados:**
- `types/` - Directorio de tipos TypeScript creado
- `types/index.ts` - Export barrel para types
- `types/auth.ts` - Types de NextAuth
- `types/models.ts` - Types de dominio (Capabilities, WorkOrderStatus, etc.)
- `types/api.ts` - Types de API responses

**Componentes UI Actualizados:**
- `components/ui/button.tsx` - Soporte para data-testid agregado

**Archivos Existentes (Verificados):**
- `app/globals.css` - Estilos base de Tailwind ✅
- `components/ui/card.tsx` - Componente Card ✅
- `components/ui/dialog.tsx` - Componente Dialog ✅
- `components/ui/form.tsx` - Componente Form ✅
- `components/ui/toast.tsx` - Componente Toast ✅
- `lib/utils.ts` - Utilidades base ✅
- `playwright.config.ts` - Configuración E2E ✅
- `vitest.config.ts` - Configuración unit tests ✅

**Story File:**
- `_bmad-output/implementation-artifacts/0-1-starter-template-y-stack-tecnico.md` - Este archivo

**Source Documents Referenced:**
- `_bmad-output/planning-artifacts/epics.md` (Story 0.1 requirements)
- `_bmad-output/planning-artifacts/architecture/core-architectural-decisions.md`
- `_bmad-output/planning-artifacts/architecture/starter-template-evaluation.md`
- `_bmad-output/project-context.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
