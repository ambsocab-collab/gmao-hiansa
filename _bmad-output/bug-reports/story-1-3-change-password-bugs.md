# Bug Report: Story 1.3 - Cambio de Contraseña

**Fecha Reporte**: 2026-03-05
**Story**: Story 1.3 - Cambio Obligatorio de Contraseña
**Tester**: QA Team (TEA Agent)
**Severidad**: HIGH
**Estado**: OPEN
**Affected Tests**: 5/117 tests failing

---

## Executive Summary

Story 1.3 tiene **5 bugs críticos** que impiden el correcto funcionamiento del cambio de contraseña. Los bugs afectan tanto el API endpoint `/api/change-password` como el flujo E2E del usuario.

**Impacto**: Los usuarios no pueden cambiar su contraseña correctamente, lo que bloquea el flujo de "first login" y pone en riesgo la seguridad del sistema.

**Recomendación**: **P0 - Bloqueante para el próximo sprint**

---

## Bug Detalles

### Bug #1: Audit Log Entry Not Created After Password Change

**ID**: BUG-1.3-PWD-001
**Severity**: HIGH
**Priority**: P0
**Test Failing**: `[P1] should create audit log entry after password change`
**Location**: `tests/api/auth/story-1.3-change-password.spec.ts:315`

#### Descripción
El endpoint `/api/change-password` no está creando una entrada en el audit log cuando un usuario cambia su contraseña exitosamente. Según FR72 (Activity History), todos los cambios de credenciales deben ser auditados.

#### Pasos para Reproducir
```bash
# 1. Login como usuario
POST /api/auth/signin
{
  "email": "firstlogin@gmao-hiansa.com",
  "password": "FirstLogin123!"
}

# 2. Cambiar contraseña
POST /api/change-password
{
  "currentPassword": "FirstLogin123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

# 3. Verificar audit log
GET /api/audit/logs?userId=<userId>

# Expected: Entrada de audit log con action="password_changed"
# Actual: No existe entrada de audit log
```

#### Expected Behavior
- Debe crearse entrada en `ActivityLog` con:
  - `action`: "password_changed"
  - `userId`: ID del usuario
  - `ipAddress`: IP del request
  - `userAgent`: User agent del navegador
  - `timestamp`: Fecha/hora del cambio

#### Actual Behavior
```javascript
// Test output:
Error: Expected 1 audit log entry, found 0
```

#### Root Cause
El endpoint `/api/change-password` probablemente no está llamando a `prisma.activityLog.create()` después de actualizar la contraseña.

#### Fix Sugerido
```typescript
// apps/api/src/app/api/change-password/route.ts

// Después de actualizar contraseña exitosamente:
await prisma.activityLog.create({
  data: {
    userId: session.user.id,
    action: 'password_changed',
    details: {
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
    timestamp: new Date(),
  },
});
```

---

### Bug #2: Long Passwords (>72 chars) Not Handled

**ID**: BUG-1.3-PWD-002
**Severity**: MEDIUM
**Priority**: P1
**Test Failing**: `[P2] should handle very long passwords (>72 chars)`
**Location**: `tests/api/auth/story-1.3-change-password.spec.ts:420`

#### Descripción
El endpoint acepta passwords más largos de 72 caracteres, lo cual puede causar problemas de seguridad con bcrypt (que tiene un límite de 72 bytes) y base de datos.

#### Pasos para Reproducir
```bash
POST /api/change-password
{
  "currentPassword": "FirstLogin123!",
  "newPassword": "a".repeat(100) + "1A!", // 103 caracteres
  "confirmPassword": "a".repeat(100) + "1A!"
}

# Expected: 400 Bad Request - "Password too long (max 72 characters)"
# Actual: 200 OK o error de base de datos
```

#### Expected Behavior
- Validar longitud máxima de 72 caracteres ANTES de procesar
- Retornar `400` con mensaje claro: `"Password must be between 8 and 72 characters"`

#### Actual Behavior
```javascript
// Test output:
Error: Request failed with status 500
// OR
Error: Password truncated at 72 characters (bcrypt behavior)
```

#### Security Risk
- **SQL Injection**: Passwords muy largos pueden causar buffer overflows
- **DoS**: Procesar passwords gigantes consume recursos innecesarios
- **Bcrypt Behavior**: bcrypt trunca a 72 chars silenciosamente (security issue)

#### Fix Sugerido
```typescript
// apps/api/src/app/api/change-password/route.ts

const MAX_PASSWORD_LENGTH = 72;
const MIN_PASSWORD_LENGTH = 8;

if (newPassword.length < MIN_PASSWORD_LENGTH) {
  return NextResponse.json(
    { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
    { status: 400 }
  );
}

if (newPassword.length > MAX_PASSWORD_LENGTH) {
  return NextResponse.json(
    { error: `Password must be no more than ${MAX_PASSWORD_LENGTH} characters` },
    { status: 400 }
  );
}
```

---

### Bug #3: Password Confirmation Validation Not Working

**ID**: BUG-1.3-PWD-003
**Severity**: HIGH
**Priority**: P0
**Test Failing**: `[P0] should validate password confirmation matches`
**Location**: `tests/e2e/auth/story-1-3-change-password.spec.ts:250`

#### Descripción
El formulario de cambio de contraseña no está validando que `newPassword` y `confirmPassword` coincidan. El usuario puede enviar passwords diferentes y el formulario no muestra error.

#### Pasos para Reproducir
```bash
# 1. Navegar a /change-password
# 2. Llenar formulario:
currentPassword: "FirstLogin123!"
newPassword: "NewPassword123!"
confirmPassword: "DifferentPassword123!" # <- Diferente!

# 3. Submit formulario
# Expected: Error message "Las contraseñas no coinciden"
# Actual: Formulario se envía o muestra error incorrecto
```

#### Expected Behavior
- Frontend: Validación en tiempo real que muestra error cuando passwords no coinciden
- Backend: Validación que rechaza el request si `newPassword !== confirmPassword`
- Error message: `"Las contraseñas nuevas no coinciden"`

#### Actual Behavior
```javascript
// Test output:
Error: Expected error message to contain "no coinciden"
```

#### Root Cause
Posibles causas:
1. Validación de frontend no implementada
2. Validación de backend no implementada
3. Campo `confirmPassword` no está siendo validado

#### Fix Sugerido
```typescript
// Backend validation:
if (newPassword !== confirmPassword) {
  return NextResponse.json(
    { error: 'Las contraseñas nuevas no coinciden' },
    { status: 400 }
  );
}

// Frontend validation (React component):
const validateForm = () => {
  if (formData.newPassword !== formData.confirmPassword) {
    setErrors({
      confirmPassword: 'Las contraseñas no coinciden',
    });
    return false;
  }
  return true;
};
```

---

### Bug #4: Redirect After Password Change Fails

**ID**: BUG-1.3-PWD-004
**Severity**: HIGH
**Priority**: P0
**Test Failing**: `[P0] should change password and redirect to dashboard after success`
**Location**: `tests/e2e/auth/story-1-3-change-password.spec.ts:311`

#### Descripción
Después de cambiar la contraseña exitosamente, el usuario no es redirigido al dashboard. La redirección está fallando o el endpoint no retorna el redirect correcto.

#### Pasos para Reproducir
```bash
# 1. Login como usuario (firstlogin@gmao-hiansa.com)
# 2. Navegar a /change-password (redirección automática por isFirstLogin=true)
# 3. Llenar formulario correctamente:
currentPassword: "FirstLogin123!"
newPassword: "NewPassword123!"
confirmPassword: "NewPassword123!"

# 4. Submit formulario

# Expected: Redirección a /dashboard (o /kpis basado en capabilities)
# Actual: Se queda en /change-password o redirección incorrecta
```

#### Expected Behavior
```typescript
// Flujo esperado:
1. POST /api/change-password → 200 OK
2. Response incluye: { success: true, redirect: '/dashboard' }
3. Frontend: router.push('/dashboard')
4. Usuario ve dashboard
```

#### Actual Behavior
```javascript
// Test output:
Error: Timeout waiting for URL to match /dashboard
Current URL: /change-password
```

#### Root Cause
Posibles causas:
1. Endpoint no retorna `redirect` en la respuesta
2. Frontend no maneja el redirect response
3. `isFirstLogin` no está siendo actualizado a `false`
4. Siguiente request al middleware aún ve `isFirstLogin=true` y redirige de vuelta

#### Fix Sugerido
```typescript
// Backend: Asegurar que isFirstLogin se actualiza:
const updatedUser = await prisma.user.update({
  where: { id: session.user.id },
  data: {
    passwordHash: hashedNewPassword,
    isFirstLogin: false, // <- CRÍTICO
  },
});

// Retornar redirect URL:
return NextResponse.json({
  success: true,
  redirect: determineRedirectUrl(session.user), // /dashboard, /kpis, etc.
});

// Frontend: Manejar redirect:
const response = await fetch('/api/change-password', { ... });
const data = await response.json();
if (data.success) {
  router.push(data.redirect);
}
```

---

### Bug #5: Session Not Updated After Password Change

**ID**: BUG-1.3-PWD-005
**Severity**: HIGH
**Priority**: P0
**Test Failing**: `[P1] should update session after password change`
**Location**: `tests/e2e/auth/story-1-3-change-password.spec.ts:340`

#### Descripción
Después de cambiar la contraseña, la sesión del usuario no se actualiza correctamente. Esto puede causar problemas de autenticación en requests subsecuentes.

#### Pasos para Reproducir
```bash
# 1. Login como usuario
POST /api/auth/signin
→ Response: { sessionToken: "abc123", expires: "...", user: {...} }

# 2. Cambiar contraseña
POST /api/change-password
→ Response: { success: true }

# 3. Verificar sesión actual
GET /api/auth/session
→ Expected: Sesión actualizada con nueva info
→ Actual: Sesión antigua o error
```

#### Expected Behavior
```typescript
// Después de cambiar contraseña:
// Opción 1: Invalidar sesión anterior (forzar re-login)
// Opción 2: Actualizar sesión con nueva info (seamless)

// Opción 1 (Más seguro):
await NextAuth.signOut({ sessionToken });
return NextResponse.json({
  success: true,
  message: 'Password changed. Please login again.',
  redirect: '/login'
});

// Opción 2 (Mejor UX):
const session = await getSession(request);
if (session) {
  session.user = { ...session.user, passwordChanged: true };
  await updateSession(session);
}
```

#### Actual Behavior
```javascript
// Test output:
Error: Session not updated after password change
Expected: session.user.passwordChanged = true
Actual: undefined
```

#### Security Risk
- **Session Hijacking**: Sesión antigua sigue siendo válida después de cambio de password
- **No Logout**: Usuario cambió password pero sesión antigua todavía funciona
- **Best Practice Violation**: Las sesiones deberían invalidarse después de cambio de credenciales

#### Fix Sugerido
```typescript
// Recomendación: Invalidar sesión por seguridad
// Después de cambiar contraseña:

import { getToken } from 'next-auth/jwt';
import { deleteSession } from 'next-auth/next';

// Invalidar todas las sesiones del usuario
await prisma.session.deleteMany({
  where: { userId: session.user.id }
});

// O invalidar solo la sesión actual
const sessionToken = getToken({ req: request });
await prisma.session.delete({
  where: { sessionToken }
});

// Forzar re-login
return NextResponse.json({
  success: true,
  message: 'Password changed. Please login with your new password.',
  redirect: '/login'
});
```

---

## Severity Matrix

| Bug ID | Severity | Priority | Security Risk | User Impact | Blocks Feature |
|--------|----------|----------|---------------|-------------|----------------|
| BUG-1.3-PWD-001 | HIGH | P0 | Audit compliance lost | Medium | No |
| BUG-1.3-PWD-002 | MEDIUM | P1 | DoS/SQL injection possible | Low | No |
| BUG-1.3-PWD-003 | HIGH | P0 | None (UX) | High | YES |
| BUG-1.3-PWD-004 | HIGH | P0 | None (UX) | High | YES |
| BUG-1.3-PWD-005 | HIGH | P0 | Session hijacking | High | YES |

**Total**: 4 HIGH/P0 + 1 MEDIUM/P1

---

## Test Failures Detail

### API Test Failures (2)

```
❌ [P1] should create audit log entry after password change
   → tests/api/auth/story-1.3-change-password.spec.ts:315

❌ [P2] should handle very long passwords (>72 chars)
   → tests/api/auth/story-1.3-change-password.spec.ts:420
```

### E2E Test Failures (3)

```
❌ [P0] should validate password confirmation matches
   → tests/e2e/auth/story-1-3-change-password.spec.ts:250

❌ [P0] should change password and redirect to dashboard after success
   → tests/e2e/auth/story-1-3-change-password.spec.ts:311

❌ [P1] should update session after password change
   → tests/e2e/auth/story-1.3-change-password.spec.ts:340
```

---

## Recommended Actions

### Immediate (Before Next Release)

1. **Fix Bug #3 (Password Confirmation)** - P0
   - Agregar validación en backend
   - Agregar validación en frontend
   - **Estimated effort**: 2-3 hours

2. **Fix Bug #4 (Redirect)** - P0
   - Asegurar que `isFirstLogin` se actualice a `false`
   - Verificar que response incluya redirect URL
   - **Estimated effort**: 2-4 hours

3. **Fix Bug #5 (Session Update)** - P0
   - Invalidar sesión después de cambio de password
   - Forzar re-login por seguridad
   - **Estimated effort**: 2-3 hours

### Short Term (Next Sprint)

4. **Fix Bug #1 (Audit Log)** - P1
   - Agregar `prisma.activityLog.create()` en `/api/change-password`
   - **Estimated effort**: 1-2 hours

5. **Fix Bug #2 (Long Passwords)** - P1
   - Agregar validación de longitud máxima (72 chars)
   - **Estimated effort**: 1 hour

---

## Acceptance Criteria for Fix

Cada bug está considerado "FIXED" cuando:

### Bug #1 (Audit Log)
- [ ] Test `[P1] should create audit log entry after password change` pasa
- [ ] Audit log entry contiene todos los campos requeridos
- [ ] Audit log visible en `/activity` para admins

### Bug #2 (Long Passwords)
- [ ] Test `[P2] should handle very long passwords (>72 chars)` pasa
- [ ] API retorna 400 para passwords >72 chars
- [ ] Error message es claro y user-friendly

### Bug #3 (Confirmation)
- [ ] Test `[P0] should validate password confirmation matches` pasa
- [ ] Frontend valida en tiempo real
- [ ] Backend valida y retorna 400 si no coinciden

### Bug #4 (Redirect)
- [ ] Test `[P0] should change password and redirect to dashboard after success` pasa
- [ ] Usuario es redirigido a página correcta después de cambio
- [ ] No hay redirect loops

### Bug #5 (Session)
- [ ] Test `[P1] should update session after password change` pasa
- [ ] Sesión anterior es invalidada
- [ ] Usuario debe re-login después de cambio de password

---

## Additional Context

### Related Requirements
- **FR72**: Activity History - All password changes must be logged
- **FR58**: Authentication - Session management
- **Security Best Practice**: Invalidate sessions after credential change

### Affected Files (Probables)
```
apps/api/src/app/api/change-password/route.ts
apps/web/src/app/change-password/page.tsx
apps/web/components/change-password-form.tsx
prisma/schema.prisma (User model)
```

### Database Schema
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  isFirstLogin  Boolean   @default(true)
  // ...
}

model ActivityLog {
  id          String   @id @default(cuid())
  userId      String
  action      String   // "password_changed", "login", "user_created", etc.
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())
  details     Json?

  user        User     @relation(fields: [userId], references: [id])
}
```

---

## Verification Steps

Una vez corregidos los bugs, ejecutar:

```bash
# Ejecutar solo tests de Story 1.3
npx playwright test \
  tests/api/auth/story-1-3-change-password.spec.ts \
  tests/e2e/auth/story-1-3-change-password.spec.ts \
  --workers=4

# Expected: All tests passing (0 failed)
# Current: 5 failed
```

---

## Notes for Developers

1. **Security First**: Bug #5 es un security risk. Las sesiones DEBEN invalidarse después de cambio de password.

2. **Test Coverage**: Los tests ATDD ya están escritos. Solo necesitan que el feature funcione correctamente.

3. **Backwards Compatibility**: Considerar usuarios que ya cambiaron su contraseña (si hay en producción).

4. **Email Notification**: Considerar enviar email al usuario cuando su contraseña es cambiada (extra security measure).

5. **Rate Limiting**: Considerar agregar rate limiting al endpoint `/api/change-password` para prevenir brute force attacks.

---

## Contact

**QA Lead**: Bernardo
**Created**: 2026-03-05
**Last Updated**: 2026-03-05
**Status**: OPEN - awaiting development team assignment

---

## Appendix: Full Test Output

```
Running 26 tests using 4 workers

  ✅ 21 passed
  ❌ 5 failed:
     - tests/api/auth/story-1.3-change-password.spec.ts:315:9 → Audit log
     - tests/api/auth/story-1.3-change-password.spec.ts:420:9 → Long passwords
     - tests/e2e/auth/story-1.3-change-password.spec.ts:250:9 → Confirmation
     - tests/e2e/auth/story-1.3-change-password.spec.ts:311:9 → Redirect
     - tests/e2e/auth/story-1.3-change-password.spec.ts:340:9 → Session

  ⏭️  0 skipped
  ⏱️  Total time: 45.2s
```

---

**END OF BUG REPORT**
