# GMAO Hiansa

Sistema de gestión de mantenimiento industrial con reporte de averías en segundos, kanban digital de órdenes de trabajo y control de stock en tiempo real.

## Tech Stack

- **Framework**: Next.js 16.1.6 con App Router
- **Lenguaje**: TypeScript 5.3.3
- **Base de datos**: Neon PostgreSQL (serverless)
- **ORM**: Prisma 5.22.0
- **Autenticación**: NextAuth.js 4.24.7
- **UI**: shadcn/ui + Tailwind CSS 3.4.1
- **Real-time**: Server-Sent Events (SSE)

## Comenzando

### Prerrequisitos

- Node.js 20+
- Cuenta de Neon PostgreSQL (o cualquier base de datos PostgreSQL compatible)

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install --legacy-peer-deps
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui-min-32-caracteres"
```

4. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate dev
```

5. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript

## Deployment en Vercel

### Configuración

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar el repositorio Git
3. Configurar variables de entorno en Vercel:
   - `DATABASE_URL`: Tu URL de Neon PostgreSQL
   - `NEXTAUTH_URL`: URL de tu deployed app (ej: `https://tu-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Generar con `openssl rand -base64 32`

### Deploy

Automático al hacer push a la rama `main`.

### Base de Datos

El proyecto usa Neon PostgreSQL, que es compatible con Vercel serverless. Para configurar:

1. Crear cuenta en [Neon](https://neon.tech)
2. Crear un nuevo proyecto
3. Copiar la URL de conexión
4. Configurar `DATABASE_URL` en Vercel

## Estructura del Proyecto

```
gmao-hiansa/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Componentes React
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilidades y helpers
│   ├── auth.ts           # Password helpers
│   ├── db.ts             # PrismaClient singleton
│   └── sse.ts            # SSE utilities
├── prisma/               # Database schema
└── tests/                # Tests (Vitest + Playwright)
```

## Características Implementadas

### Story 1.1 - Puesta en Marcha y Configuración Inicial

- ✅ Proyecto Next.js con TypeScript y Tailwind CSS
- ✅ Prisma configurado con modelo User inicial
- ✅ NextAuth.js configurado con Credentials provider
- ✅ Infraestructura SSE para real-time updates
- ✅ shadcn/ui inicializado con componentes base
- ✅ Layout responsive con Header, Main y Footer

## Próximos Pasos

- Story 1.2: Modelo de datos de usuarios y capabilities PBAC
- Story 1.3: Registro de usuarios por administrador
- Story 1.4: Login de usuarios con NextAuth

## Licencia

Copyright © 2025 GMAO Hiansa. Todos los derechos reservados.
