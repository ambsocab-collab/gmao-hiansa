# Lecciones Aprendidas: Debugging Tests E2E con Playwright y NextAuth

**Fecha:** 2026-03-15
**Story:** 1.1 - Admin User Management
**Test:** P0-E2E-012

---

## Resumen Ejecutivo

Este documento documenta los problemas encontrados y las soluciones implementadas durante el debugging de tests E2E que involucran autenticación con NextAuth en Playwright. Los problemas principales fueron:

1. **Fallo de autenticación en global-setup** debido a incompatibilidad entre React forms y Playwright
2. **Capabilities no asignadas** en la base de datos causando redirecciones a `/unauthorized`

---

## Problema 1: Login Fallando en Global Setup

### Síntomas

```
❌ Failed to setup authenticated session: page.waitForURL: Timeout 30000ms exceeded
[DEBUG] Cookies after login attempt: 0
[DEBUG] Session cookie exists: false
[API Response] /api/auth/session Status: 200
[API Response Body]: {}
```

### Causa Raíz

El `global-setup.ts` original intentaba hacer login usando el formulario de React:

```typescript
await page.getByTestId('login-email').fill('admin@hiansa.com');
await page.getByTestId('login-password').fill('admin123');
await page.getByTestId('login-submit').click();
await page.waitForURL((url) => url.pathname !== '/login');
```

**El problema**: Playwright no detectaba la navegación porque:
1. El formulario usa `signIn('credentials', { redirect: false })`
2. Luego navega manualmente con `window.location.href = '/dashboard'`
3. Playwright no espera correctamente las navegaciones manuales

### Solución Implementada

Cambio a login directo por API:

```typescript
// Step 1: Get CSRF token
const csrfResponse = await fetch(`${baseURL}/api/auth/csrf`);
const csrfData = await csrfResponse.json();
const csrfCookies = parseCookies(csrfResponse.headers);

// Step 2: Login with API
const loginResponse = await fetch(`${baseURL}/api/auth/callback/credentials`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': csrfCookies
  },
  body: new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    email: 'admin@hiansa.com',
    password: 'admin123',
    redirect: 'false',
    json: 'true'
  })
});

// Step 3: Set cookies in browser
const loginCookies = parseCookies(loginResponse.headers);
await context.addCookies(parseCookieObjects(loginCookies));

// Step 4: Verify session
await page.goto(`${baseURL}/dashboard`);
```

### Helper para Parsear Cookies

```typescript
function parseCookies(headers: Headers | any): string {
  const cookies: string[] = [];

  if (headers.headers) {
    // Playwright APIResponse
    const setCookieHeaders = headers.headers()['set-cookie'];
    if (Array.isArray(setCookieHeaders)) {
      setCookieHeaders.forEach(cookie => {
        cookies.push(cookie.split(';')[0].trim());
      });
    }
  } else if (typeof headers.forEach === 'function') {
    // Standard fetch Headers
    headers.forEach((value: string, key: string) => {
      if (key === 'set-cookie') {
        const cookieValues = value.split('\n').map(c => c.split(';')[0].trim());
        cookies.push(...cookieValues);
      }
    });
  }

  return cookies.join('; ');
}
```

### Lección Aprendida

**Lesson 1.1**: En Playwright global-setup, usa API directa para autenticación en lugar de formularios React.

**Razón**:
- Los formularios React con `signIn()` de NextAuth usan navegación asíncrona que Playwright no detecta correctamente
- El endpoint de API es más fiable y rápido (~2-3 segundos vs 10+ segundos)
- No dependes de que el DOM esté completamente renderizado

**Cuándo aplicar**:
- Siempre en `global-setup.ts` o hooks `beforeAll`
- Cuando necesites establecer sesión antes de tests

---

## Problema 2: Redirección a /unauthorized

### Síntomas

```
[DEBUG] URL after navigation: http://localhost:3000/unauthorized?path=%2Fusuarios%2Fnuevo&required=can_manage_users
[DEBUG] Page title: Acceso Denegado
✘ expect(locator).toBeVisible() failed: getByTestId('register-form') not found
```

### Causa Raíz

El usuario admin no tenía la capability `can_manage_users` asignada en la base de datos:

```typescript
// Verificación de capabilities en DB
Admin user: admin@hiansa.com
Number of capabilities: 0  // ❌ Debería ser 15
Capabilities: []
```

**Problema**: El seed no se había ejecutado correctamente o la DB estaba en estado inconsistente.

### Solución Implementada

```bash
# Regenerar seed completo
npx prisma db seed
```

Verificación posterior:

```typescript
Admin user: admin@hiansa.com
Number of capabilities: 15  // ✅ Correcto
Capabilities: [
  'can_manage_users',  // ✅ Presente
  'can_create_failure_report',
  'can_view_all_ots',
  // ... 12 más
]
```

### Lección Aprendida

**Lesson 2.1**: Verifica siempre el estado de la base de datos antes de debuggear problemas de autorización.

**Checklist de diagnóstico**:
1. ¿El usuario existe en la base de datos?
2. ¿Tiene las capabilities necesarias?
3. ¿El middleware de autorización funciona correctamente?

**Lesson 2.2**: Añade verificaciones de estado en global-setup.

```typescript
// Verificar que el admin tenga capabilities antes de guardar sesión
const sessionResponse = await fetch('/api/auth/session');
const session = await sessionResponse.json();

if (!session?.user?.capabilities?.includes('can_manage_users')) {
  throw new Error('Admin user missing required capabilities. Run: npx prisma db seed');
}
```

---

## Problema 3: CSRF Token Management

### Síntomas

```
Login Response Body: {"url":"http://localhost:3000/api/auth/signin?csrf=true"}
```

### Causa Raíz

El token CSRF cambia con cada petición. Intentar reutilizar un token de una petición anterior falla.

### Solución Implementada

```typescript
// ❌ MAL - Token de petición anterior
const csrfToken = 'token-antiguo';
const login = await fetch('/api/auth/callback/credentials', { ... });

// ✅ BIEN - Token fresco para cada login
const csrfResponse = await fetch('/api/auth/csrf');
const csrfData = await csrfResponse.json();
const login = await fetch('/api/auth/callback/credentials', {
  body: new URLSearchParams({
    csrfToken: csrfData.csrfToken,  // Token fresco
    // ...
  })
});
```

### Lección Aprendida

**Lesson 3.1**: Siempre obtén un token CSRF fresco inmediatamente antes del login.

**Razión**: NextAuth genera un nuevo token CSRF para cada petición `/api/auth/csrf`. Los tokens tienen una vida corta y no son reutilizables.

---

## Debugging Tips para Futuros Issues

### 1. Habilita Logging Detallado

```typescript
// Log todas las requests/responses de API
page.on('request', request => {
  if (request.url().includes('/api/auth')) {
    console.log(`[API Request] ${request.method()} ${request.url()}`);
  }
});

page.on('response', async response => {
  if (response.url().includes('/api/auth')) {
    console.log(`[API Response] ${response.status()} ${response.url()}`);
    try {
      const body = await response.json();
      console.log('[Body]:', body);
    } catch {}
  }
});
```

### 2. Verifica Cookies en Cada Paso

```typescript
const cookies = await context.cookies();
console.log('Cookies:', cookies.map(c => c.name).join(', '));
const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token');
console.log('Session exists:', !!sessionCookie);
```

### 3. Verifica Sesión con API Call

```typescript
const session = await page.evaluate(async () => {
  const response = await fetch('/api/auth/session');
  return await response.json();
});
console.log('Session data:', session);
```

### 4. Usa Screenshots para Debugging

```typescript
await page.screenshot({ path: 'debug-failure.png', fullPage: true });
```

---

## Recomendaciones para Tests E2E con NextAuth

### 1. Global Setup Optimizado

```typescript
// ✅ Usar API directa para login
// ✅ Verificar capabilities antes de guardar sesión
// ✅ Guardar storageState para reutilización
// ✅ Añadir logs de diagnóstico
```

### 2. Tests que Verifican Permisos

```typescript
test('should redirect unauthorized users', async ({ page }) => {
  // Login como usuario sin permisos
  await loginAs(page, 'tecnico@example.com');

  // Intentar acceder a ruta protegida
  await page.goto('/usuarios/nuevo');

  // Verificar redirección
  await expect(page).toHaveURL('/unauthorized');
});
```

### 3. Fixture para Login Reutilizable

```typescript
// tests/fixtures/auth.fixture.ts
export async function loginAs(page: Page, email: string, password: string) {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  // Get CSRF
  const csrfResponse = await page.request.get(`${baseURL}/api/auth/csrf`);
  const csrfData = await csrfResponse.json();

  // Login
  await page.request.post(`${baseURL}/api/auth/callback/credentials`, {
    form: {
      csrfToken: csrfData.csrfToken,
      email,
      password,
      redirect: 'false',
      json: 'true'
    }
  });

  // Reload to apply session
  await page.reload();
}
```

---

## Archivos Modificados

1. **`tests/e2e/global-setup.ts`**
   - Cambiado de login con formulario React a login por API
   - Añadido helper `parseCookies()` para manejar cookies de fetch y Playwright
   - Añadido logging detallado para debugging

2. **`playwright/.auth/admin.json`** (generado)
   - Estado de autenticación guardado para reutilización en tests

---

## Comandos Útiles

```bash
# Ejecutar seed
npx prisma db seed

# Verificar usuario admin
npx tsx -e "import { prisma } from './lib/db'; prisma.user.findUnique({ where: { email: 'admin@hiansa.com' }, include: { userCapabilities: { include: { capability: true } } } }).then(u => console.log('Caps:', u.userCapabilities.map(uc => uc.capability.name)))"

# Ejecutar un test específico en modo debug
npx playwright test --debug --grep "P0-E2E-012" tests/e2e/story-1.1-admin-user-management.spec.ts

# Ver trace de test fallido
npx playwright show-trace test-results/[test-name]/trace.zip

# Limpiar auth state
rm -rf playwright/.auth/
```

---

## Conclusión

Los problemas de autenticación en tests E2E con NextAuth pueden ser complejos de diagnosticar. Las lecciones clave son:

1. **Usa API directa** para autenticación en setup/hooks en lugar de formularios UI
2. **Verifica el estado de la base de datos** cuando hay problemas de autorización
3. **Maneja CSRF tokens correctamente** - siempre obtén uno fresco
4. **Añade logging detallado** para debugging rápido
5. **Verifica permisos/capabilities** antes de asumir que el usuario tiene acceso

Implementando estas prácticas, los tests E2E son más fiables y más rápidos de debuggear cuando surgen problemas.
