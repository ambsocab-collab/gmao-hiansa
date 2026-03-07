# Starter Template Evaluation

## Primary Technology Domain

**Web Application Full-Stack** basada en el análisis de requisitos:
- Frontend interactivo con componentes complejos (Kanban, dashboards, formularios)
- Backend con lógica de negocio dominio específico (GMAO)
- Base de datos relacional con esquema complejo (jerarquía 5 niveles)
- Real-time features vía Server-Sent Events (SSE)
- Autenticación y autorización granular (PBAC)

## Starter Options Considered

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

## Selected Starter: create-next-app (Manual Configuration)

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
