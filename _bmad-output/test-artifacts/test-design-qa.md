---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-07'
workflowType: 'testarch-test-design'
inputDocuments: ['prd.md', 'architecture.md']
mode: 'system-level'
---

# Test Design for QA: gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

**Purpose:** Test execution recipe for QA team. Defines what to test, how to test it, and what QA needs from other teams.

**Date:** 2026-03-07
**Author:** Bernardo
**Status:** Draft
**Project:** gmao-hiansa

**Related:** See Architecture doc (test-design-architecture.md) for testability concerns and architectural blockers.

---

## Executive Summary

**Scope:** GMAO (Gestión de Mantenimiento Asistido por Ordenador) single-tenant optimizado para empresa metalúrgica. MVP con 13 funcionalidades base que incluyen gestión de averías, órdenes de trabajo, activos, repuestos, usuarios con 15 capacidades PBAC, dashboard KPIs, y sincronización multi-dispositivo real-time.

**Risk Summary:**

- Total Risks: 20 (2 critical score=9, 4 high score≥6, 10 medium, 4 low)
- Critical Categories: PERFORMANCE (R-001, R-002 search & sync), DATA (R-002 multi-device), OPERATIONS (deployment)
- High-Priority Mitigations Required: 6 risks with score ≥6 must be addressed before GA

**Coverage Summary:**

- P0 tests: ~73 (critical paths, security, high-risk features)
- P1 tests: ~26 (important features, integration)
- P2 tests: ~3 (edge cases, regression)
- P3 tests: ~0 (exploratory, benchmarks - not included in MVP)
- **Total**: ~102 tests (~10-15 weeks with 1 QA)

---

## Not in Scope

**Components or systems explicitly excluded from this test plan:**

| Item       | Reasoning                   | Mitigation                                                                      |
| ---------- | --------------------------- | ------------------------------------------------------------------------------- |
| **Mantenimiento Reglamentario (PCI, Eléctrico, Presión)** | Phase 1.5 feature (primer módulo post-deploy) | Validado manualmente por equipo de seguridad certificado, posterior automatización en Phase 1.5 |
| **Integración ERP** | Phase 3+ feature (expansión futura) | Manual hasta Phase 3, pruebas de contract testing cuando se implemente |
| **Integración IoT/Sensores** | Phase 4 feature (optimización avanzada) | Manual hasta Phase 4, pruebas de ingesta de datos cuando se implemente |
| **Soporte Firefox/Safari** | NFR: Solo Chrome/Edge soportados | Documentado en requisitos, validación manual de experiencia de usuario no requerida |
| **Internacionalización (i18n)** | MVP: Solo castellano | Aceptable para empresa local, pruebas de localización no requeridas en Phase 1 |
| **Búsqueda Universal** | Phase 2 feature (estructura completa) | MVP tiene búsqueda predictiva de equipos solamente |

**Note:** Items listed here have been reviewed and accepted as out-of-scope for MVP Phase 1 by QA, Dev, and PM.

---

## Dependencies & Test Blockers

**CRITICAL:** QA cannot proceed without these items from other teams.

### Backend/Architecture Dependencies (Pre-Implementation)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans.

1. **BLK-001: Test Data Seeding APIs** - Backend Dev - Phase 1 pre-implementation
   - **What QA needs:** `/api/test-data` endpoints (dev/staging only) para inyectar estados específicos:
     - `POST /test-data/users` - Crear usuarios con estados específicos
     - `POST /test-data/assets` - Crear activos con historial de OTs
     - `POST /test-data/stock` - Configurar niveles de stock crítico
     - `POST /test-data/reset` - Limpiar datos de tests (cleanup)
   - **Why it blocks testing:** Sin seeding APIs, tests requieren setup manual vía UI (10x más lento), tests no pueden paralelizarse, tests no deterministas

2. **BLK-002: SSE Mock Layer** - Backend Dev + QA - Phase 1 pre-implementation
   - **What QA needs:** Mock layer para SSE que permita:
     - "Fast-forward mode": Actualizaciones instantáneas en tests en lugar de esperar 30s
     - Event triggering: Disparar eventos específicos (ej: "OT status changed") en tests
     - State control: Controlar estado de conexión SSE (connected, disconnected, error)
   - **Why it blocks testing:** Tests de real-time dependen de timing real (30s delays), tests no deterministas, tests flaky

3. **BLK-003: Multi-Device Sync Conflict Strategy** - Backend Dev - Phase 1 MVP
   - **What QA needs:** Estrategia de conflicto implementada (last-write-wins + merge), versioning de entidades
   - **Why it blocks testing:** Tests de sincronización multi-dispositivo no pueden validar correcto comportamiento sin estrategia de conflicto

4. **BLK-004: Observability Infrastructure** - Backend Dev - Phase 1 MVP
   - **What QA needs:** Logging estructurado (JSON), correlation IDs, /metrics endpoint (RED metrics)
   - **Why it blocks testing:** Imposible debuggear tests fallados en CI/CD sin logs estructurados y tracing

5. **BLK-005: Performance Baseline Infrastructure** - Backend Dev + DevOps - Phase 1 MVP
   - **What QA needs:** k6 load testing configurado, monitoreo de connection pools, baselines de performance
   - **Why it blocks testing:** No se puede validar NFRs (10K activos, 100 usuarios, búsqueda <200ms) sin infrastructure

### QA Infrastructure Setup (Pre-Implementation)

1. **Test Data Factories** - QA
   - User factory con faker-based randomization (email, nombre, teléfono únicos)
   - Asset factory (5-level hierarchy: Planta → Línea → Equipo → Componente → Repuesto)
   - OT factory con estados, asignaciones, repuestos
   - Repuesto factory con stock, ubicación, proveedores
   - Auto-cleanup fixtures para parallel safety

2. **Test Environments** - QA
   - **Local:** Supabase Docker + Vercel CLI, datos de test reseteados en cada run
   - **CI/CD:** GitHub Actions con Playwright workers=4-8, cleanup automático post-run
   - **Staging:** Environment configurado con datos de prueba estables, no resetear entre tests

**Example factory pattern (Playwright):**

```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('P0-001: Operario reporta avería con búsqueda predictiva', async ({ apiRequest }) => {
  // Setup: Crear datos de test únicos
  const testData = {
    operario: {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      capabilities: ['can_create_failure_report'],
    },
    equipo: {
      nombre: `Perfiladora-${faker.string.uuid()}`,
      planta: 'Planta Acero Perfilado',
      linea: 'Línea 1',
    },
  };

  // Seed datos vía API (rápido)
  await apiRequest.post('/api/test-data/users', { data: testData.operario });
  await apiRequest.post('/api/test-data/assets', { data: testData.equipo });

  // Test: Búsqueda predictiva
  const searchResponse = await apiRequest({
    method: 'GET',
    path: '/api/assets/search',
    query: { q: 'Perfiladora' },
  });

  expect(searchResponse.status()).toBe(200);
  const results = await searchResponse.json();
  expect(results.items[0].nombre).toContain('Perfiladora');

  // Cleanup (automático via fixture teardown)
});
```

---

## Risk Assessment

**Note:** Full risk details in Architecture doc. This section summarizes risks relevant to QA test planning.

### High-Priority Risks (Score ≥6)

| Risk ID    | Category | Description         | Score       | QA Test Coverage             |
| ---------- | -------- | ------------------- | ----------- | ---------------------------- |
| **R-001** | PERF | Búsqueda predictiva >200ms con 10K+ activos | **9** | k6 load test: 10K activos, búsqueda <200ms P95. API test: Validar debouncing 300ms, caching funciona. |
| **R-002** | DATA | Race conditions en sincronización multi-dispositivo | **9** | E2E test: 2 dispositivos editan misma OT simultáneamente, validar merge correcto. API test: Validar versión entity, conflict detection. |
| **R-003** | OPS | Deployment sin blue/green | **6** | Manual test: Deployment drill, validar rollback <5 min. E2E test: Health check endpoint funciona post-deploy. |
| **R-004** | PERF | PDF generation bloquea servidor | **6** | API test: Generar reporte mensual (1000 OTs), validar async, servidor no bloquea, PDF completado en <2 min. |
| **R-005** | SEC | PBAC implementation incorrecta | **6** | E2E test suite P0: Validar todas las 15 capacidades, acceso denegado funciona correctamente. Security test: SQL injection, XSS sanitizados. |
| **R-006** | PERF | 100 usuarios concurrentes degradan performance | **6** | k6 load test: 100 usuarios concurrentes 1 hora, degradación <10%. API test: Connection pooling funciona, no pool exhaustion. |

### Medium/Low-Priority Risks

| Risk ID | Category | Description         | Score   | QA Test Coverage             |
| ------- | -------- | ------------------- | ------- | ---------------------------- |
| R-007  | PERF | Búsqueda universal >500ms | 4 | API test: Búsqueda con datasets grandes, validarcaching funciona, paginación reduce load |
| R-008  | PERF | Importación 10K activos >5 min | 4 | API test: Import CSV 10K activos, validar <5 min, progress bar funciona |
| R-009  | PERF | Cálculo KPIs lento | 4 | API test: Calcular MTTR/MTBF con histórico grande (10K OTs), validarcaching o materialized views |
| R-010  | PERF | PWA poor performance en móviles baja gama | 4 | E2E test: Validar first paint <3s en móvil baja gama, lazy loading funciona |
| R-011  | DATA | Stock update race conditions | 4 | API test: 2 usuarios actualizan stock simultáneamente, validar optimistic locking, transacción DB funciona |
| R-012  | PERF | Connection pool exhaustion | 4 | k6 load test: Validar connection pooling configurado, monitoring alerta si pool exhaustion |
| R-013  | TECH | Relaciones muchos-a-muchos complejas | 4 | API test: Componente asociado a múltiples equipos, validar junction tables funcionan |
| R-014  | OPS | Email service failure | 5 | API test: Email service down, validar queue retry funciona, fallback descarga manual disponible |
| R-015  | OPS | Backup restore no probado | 5 | Manual test: Restore backup, validar RTO <4 horas, datos intactos |
| R-016  | PERF | Tests no pueden correr en paralelo | 4 | Unit test: Validar auto-cleanup fixtures funcionan, faker genera datos únicos, no pollution |

---

## Entry Criteria

**QA testing cannot begin until ALL of the following are met:**

- [ ] All requirements and assumptions agreed upon by QA, Dev, PM
- [ ] Test environments provisioned and accessible
  - [ ] Local: Supabase Docker running, `docker-compose up`
  - [ ] CI/CD: GitHub Actions workflow configured
  - [ ] Staging: Vercel deployment with test data
- [ ] Test data factories ready or seed data available
  - [ ] User factory (faker-based randomization)
  - [ ] Asset factory (5-level hierarchy)
  - [ ] OT factory (states, assignments, parts)
  - [ ] Auto-cleanup fixtures (parallel safety)
- [ ] Pre-implementation blockers resolved (see Dependencies section above)
  - [ ] BLK-001: Test data seeding APIs implemented
  - [ ] BLK-002: SSE mock layer available
  - [ ] BLK-003: Multi-device sync conflict strategy implemented
  - [ ] BLK-004: Observability infrastructure (logs, metrics, tracing)
  - [ ] BLK-005: Performance baseline infrastructure (k6 load testing)
- [ ] Feature deployed to test environment
  - [ ] Staging environment updated with latest code
  - [ ] Database migrations applied
- [ ] Playwright configured
  - [ ] `playwright.config.ts` configured with baseURL, workers=4-8
  - [ ] Test data factories in `tests/factories/`
  - [ ] Auto-cleanup fixtures in `tests/fixtures/`
- [ ] Project-specific entry criteria
  - [ ] Supabase local (Docker) configured para tests
  - [ ] Vercel deployment pipeline configurado
  - [ ] Environment variables (`.env.test`) documentadas

---

## Exit Criteria

**Testing phase is complete when ALL of the following are met:**

- [ ] All P0 tests passing (73 tests, 100% pass rate mandatory)
- [ ] All P1 tests passing (26 tests, ≥95% pass rate, failures triaged and accepted)
- [ ] No open high-priority / high-severity bugs
- [ ] Test coverage agreed as sufficient by QA Lead and Dev Lead
- [ ] Performance baselines met (if applicable)
  - [ ] P0-061: Búsqueda predictiva <200ms validada con k6
  - [ ] P0-064: 50 usuarios concurrentes sin degradación >10%
  - [ ] P1-027: 100 usuarios concurrentes sin degradación >10%
- [ ] High-risk mitigations complete before release
  - [ ] R-001 (Score 9): Search performance mitigated y probada
  - [ ] R-002 (Score 9): Multi-device sync conflict strategy implementada y probada
- [ ] Project-specific exit criteria
  - [ ] Todos los riesgos score ≥6 tienen mitigación implementada y probada
  - [ ] 5 testability blockers (BLK-001 through BLK-005) resueltos
  - [ ] Coverage target ≥80% alcanzado (ajustable si está justificado)

---

## Project Team (Optional)

**Include only if roles/names are known or responsibility mapping is needed; otherwise omit.**

| Name   | Role      | Testing Responsibilities                                      |
| ------ | --------- | ------------------------------------------------------------ |
| TBD    | QA Lead   | Test strategy, E2E/API test implementation, test review       |
| TBD    | Dev Lead  | Unit tests, integration test support, testability hooks       |
| TBD    | PM        | Requirements clarification, acceptance criteria, UAT sign-off |
| TBD    | Architect | Testability review, NFR guidance, environment provisioning    |

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **priority and risk level** (what to focus on if time-constrained), NOT execution timing. See "Execution Strategy" for when tests run.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk (≥6) + No workaround + Affects majority of users

#### MÓDULO 1: Gestión de Averías (9 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-001** | Operario reporta avería con búsqueda predictiva en <30 segundos | E2E | R-001 | Validar búsqueda debouncing 300ms, resultados <200ms |
| **P0-002** | Avería con descripción vacía es rechazada | API | | Validación de campos requeridos |
| **P0-003** | Operario adjunta foto opcional al reportar avería | E2E | | Validar upload de imagen funciona |
| **P0-004** | Notificación push recibida dentro de 30s al cambiar estado | E2E | R-002 | Validar SSE heartbeat 30s funciona |
| **P0-005** | Operario confirma si reparación funciona tras completado | E2E | | Validar flujo de confirmación de operario |
| **P0-006** | Supervisor ve aviso nuevo en columna "Triage" (color rosa) | E2E | | Validar código de colores en Kanban |
| **P0-007** | Supervisor convierte aviso en OT | E2E | | Validar conversión aviso → OT |
| **P0-008** | Supervisor descarta aviso no procedente | E2E | | Validar descarte de aviso |
| **P0-009** | Avisos de avería vs reparación se distinguen visualmente (rosa vs blanco) | E2E | | Validar colores de tarjetas en Kanban |

**Total P0 - Módulo 1:** 9 tests

#### MÓDULO 2: Órdenes de Trabajo (14 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-010** | OT tiene 8 estados posibles (Pendiente, Asignada, En Progreso, etc.) | API | | Validar ciclo de vida completo |
| **P0-011** | OT muestra tipo de mantenimiento (Preventivo/Correctivo) en tarjeta Kanban | E2E | | Validar etiquetas visibles |
| **P0-012** | Técnico inicia OT asignada cambiando estado a "En Progreso" | E2E | | Validar botón ▶️ Iniciar funciona |
| **P0-013** | Técnico agrega repuestos usados durante cumplimiento de OT | E2E | R-011 | Validar stock se actualiza en tiempo real |
| **P0-014** | Técnico completa OT y valida | E2E | | Validar flujo de completado |
| **P0-015** | Stock de repuestos se actualiza en tiempo real (<1s) al registrar uso | API | R-011 | Validar actualización silenciosa (sin spam) |
| **P0-016** | Supervisor asigna 1-3 técnicos internos a OT | E2E | | Validar asignación múltiple |
| **P0-017** | Supervisor asigna proveedor externo a OT | E2E | | Validar asignación proveedor |
| **P0-018** | Asignación múltiple: cualquiera de los técnicos asignados puede actualizar OT | E2E | | Validar colaboración multi-técnico |
| **P0-019** | Todos los usuarios asignados reciben notificación de cambios de estado | API | R-002 | Validar SSE notifica a todos |
| **P0-020** | OTs se distinguen visualmente por color (verde preventivo, rojizo correctivo propio) | E2E | | Validar código de colores |
| **P0-021** | Reparación interna (naranja) vs externa (azul) visualmente distintas | E2E | | Validar colores de reparación |
| **P0-022** | Modal ℹ️ muestra detalles completos de OT | E2E | | Validar modal informativo |
| **P0-023** | Supervisor confirma recepción de equipo reparado de proveedor | E2E | | Validar confirmación de recepción |

**Total P0 - Módulo 2:** 14 tests

#### MÓDULO 3: Gestión de Activos (6 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-024** | Jerarquía de 5 niveles: Planta → Línea → Equipo → Componente → Repuesto | API | | Validar navegación jerárquica |
| **P0-025** | Usuario navega jerarquía en cualquier dirección | E2E | | Validar navegación bidireccional |
| **P0-026** | Componente asociado a múltiples equipos (relación muchos-a-muchos) | API | R-013 | Validar junction tables |
| **P0-027** | Admin gestiona 5 estados de equipos (Operativo, Averiado, etc.) | E2E | | Validar cambios de estado |
| **P0-028** | Admin ve stock de equipos completos reutilizables con contador por estado | E2E | | Validar stock de equipos |
| **P0-029** | Usuario ve historial de reparaciones de equipo (requiere `can_view_repair_history`) | E2E | | Validar control de acceso PBAC |

**Total P0 - Módulo 3:** 6 tests

#### MÓDULO 4: Gestión de Repuestos (5 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-030** | Todos los usuarios ven stock actual y ubicación física de repuestos | E2E | | Validar stock visible sin `can_manage_stock` |
| **P0-031** | Usuario con `can_manage_stock` realiza ajuste manual con motivo | E2E | | Validar ajuste manual requiere motivo |
| **P0-032** | Usuario con `can_manage_stock` recibe alerta al alcanzar stock mínimo | API | | Validar alerta solo stock mínimo (no spam) |
| **P0-033** | Usuario con `can_manage_stock` genera pedido a proveedor | E2E | | Validar generación de pedido |
| **P0-034** | Actualización de stock es silenciosa (sin notificar a `can_manage_stock`) | API | | Validar silencio de notificaciones |

**Total P0 - Módulo 4:** 5 tests

#### MÓDULO 5: Usuarios y PBAC (11 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-035** | Admin crea usuario nuevo con solo `can_create_failure_report` por defecto | E2E | R-005 | Validar capability default |
| **P0-036** | Admin selecciona capabilities con checkboxes en castellano legible | E2E | R-005 | Validar UI castellano |
| **P0-037** | Usuario sin `can_manage_assets` solo consulta activos en modo solo lectura | E2E | R-005 | Validar control de acceso PBAC |
| **P0-038** | Usuario sin `can_view_repair_history` no accede a historial | E2E | R-005 | Validar control de acceso PBAC |
| **P0-039** | Admin inicial tiene las 15 capabilities asignadas por defecto | E2E | R-005 | Validar setup inicial |
| **P0-040** | Obligatorio cambiar contraseña temporal en primer acceso | E2E | NFR-S6 | Validar cambio contraseña obligatorio |
| **P0-041** | Admin registra nuevo usuario con credenciales temporales | E2E | NFR-S2 | Validar registro de usuario |
| **P0-042** | Admin ve historial completo de trabajos de cualquier usuario | E2E | | Validar historial de trabajos |
| **P0-043** | Usuario accede solo a módulos para los que tiene capabilities asignadas | E2E | R-005 | Validar navegación por capacidades |
| **P0-044** | Acceso denegado automáticamente si usuario intenta navegar a módulo no autorizado | API | R-005 | Validar acceso denegado |
| **P0-045** | PBAC: Las 15 capacidades funcionan correctamente | E2E | R-005 | Validar todas las capacidades |

**Total P0 - Módulo 5:** 11 tests

#### MÓDULO 6: Dashboard KPIs (5 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-046** | Usuario con `can_view_kpis` ve MTTR actualizado cada 30s | E2E | NFR-P3 | Validar SSE heartbeat |
| **P0-047** | Usuario con `can_view_kpis` ve MTBF actualizado cada 30s | E2E | NFR-P3 | Validar SSE heartbeat |
| **P0-048** | Drill-down de KPIs: Global → Planta → Línea → Equipo | E2E | R-009 | Validar navegación drill-down |
| **P0-049** | Dashboard muestra métricas adicionales (OTs abiertas, técnicos activos) | E2E | | Validar métricas adicionales |
| **P0-050** | Usuario con `can_view_kpis` recibe alertas accionables | API | | Validar alertas configurables |

**Total P0 - Módulo 6:** 5 tests

#### MÓDULO 7: Sincronización Multi-Device (5 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-051** | Sistema sincroniza OTs entre múltiples dispositivos: <1s | E2E | R-002 (CRÍTICO) | Validar sync OTs en tiempo real |
| **P0-052** | Sistema sincroniza KPIs entre múltiples dispositivos: <30s | E2E | R-002 (CRÍTICO) | Validar sync KPIs con SSE |
| **P0-053** | Interfaz se adapta responsivamente: desktop, tablet, móvil | E2E | | Validar responsive design |
| **P0-054** | Usuario instala app en dispositivo móvil como PWA | E2E | | Validar instalación PWA |
| **P0-055** | Usuario recibe notificaciones push en dispositivo | E2E | | Validar notificaciones push |

**Total P0 - Módulo 7:** 5 tests

#### MÓDULO 8: Seguridad y NFRs (13 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-056** | Usuario no autenticado es redirigido a login | E2E | R-005 | Validar autenticación requerida |
| **P0-057** | Contraseñas almacenadas hasheadas (bcrypt/argon2) | Unit | NFR-S2 | Validar hashing, no texto plano |
| **P0-058** | Todas las comunicaciones usan HTTPS/TLS 1.3 | E2E | NFR-S3 | Validar HTTPS enforced |
| **P0-059** | Sistema implementa control de acceso PBAC | API | R-005 | Validar PBAC enforcement |
| **P0-060** | Sistema sanitiza entradas para prevenir SQL injection/XSS | API | NFR-S7 | Validar sanitización |
| **P0-061** | Rate limiting: máx 5 intentos fallidos por IP en 15 minutos | API | NFR-S9 | Validar rate limiting |
| **P0-062** | Búsqueda predictiva devuelve resultados <200ms | E2E | R-001 (CRÍTICO) | Validar performance baseline |
| **P0-063** | Carga inicial (first paint) <3 segundos | E2E | NFR-P2 | Validar performance baseline |
| **P0-064** | Actualizaciones SSE refrescan cada 30 segundos | E2E | NFR-P3 | Validar SSE heartbeat |
| **P0-065** | Sistema soporta 50 usuarios concurrentes sin degradación >10% | Load | R-006 | Validar scalability baseline |
| **P0-066** | Importación de 10,000 activos completa <5 minutos | API | R-008 | Validar performance baseline |
| **P0-067** | Sistema soporta 10,000 activos sin degradación | Load | R-001 | Validar scalability baseline |
| **P0-068** | Sistema soporta 100 usuarios concurrentes sin degradación >10% | Load | R-006 | Validar scalability baseline |

**Total P0 - Módulo 8:** 13 tests

#### MÓDULO 9: Testabilidad Setup (5 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P0-069** | `/api/test-data` endpoint para seeding de datos de prueba | API | Testability Blocker | Validar seeding APIs funcionan |
| **P0-070** | Mock layer para SSE en test environment | Unit | Testability Blocker | Validar SSE mock funciona |
| **P0-071** | Auto-cleanup fixtures para paralelización segura | Unit | Testability Blocker | Validar cleanup automático |
| **P0-072** | Logging estructurado (JSON) con correlation IDs | Unit | Testability Blocker | Validar logs estructurados |
| **P0-073** | Fast-forward mechanism para tests SSE (instant SSE) | Unit | Testability Blocker | Validar fast-forward mode |

**Total P0 - Módulo 9:** 5 tests

**TOTAL P0:** 73 tests

---

### P1 (High)

**Criteria:** Important features + Medium risk (3-4) + Common workflows + Workaround exists but difficult

#### MÓDULO 1: Gestión de Averías (2 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-001** | Búsqueda predictiva devuelve resultados con debounce 300ms | E2E | R-001 | Validar debouncing funciona |
| **P1-002** | Notificación push contiene todos los estados | API | | Validar todos los estados notificados |

**Total P1 - Módulo 1:** 2 tests

#### MÓDULO 2: Órdenes de Trabajo (5 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-003** | Técnico agrega notas internas a OT asignada | E2E | | Validar notas internas |
| **P1-004** | Vista de listado: filtros por estado, técnico, fecha, tipo, equipo | E2E | | Validar filtros funcionan |
| **P1-005** | Alternar entre vista Kanban y listado con sincronización real-time | E2E | R-002 | Validar sync entre vistas |
| **P1-006** | Técnico ve sus OTs asignadas en dashboard personal | E2E | | Validar "Mis OTs" |
| **P1-007** | Supervisor ve todas las OTs de la organización | E2E | | Validar "Ver Kanban" |
| **P1-008** | Admin crea OT manual sin partir de aviso | E2E | | Validar OT manual |

**Total P1 - Módulo 2:** 6 tests

#### MÓDULO 3: Gestión de Activos (3 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-009** | Admin rastrea ubicación actual de equipos reutilizables | E2E | | Validar tracking de ubicación |
| **P1-010** | Importación masiva de 10,000 activos desde CSV completa en <5 minutos | API | R-008 | Validar import masiva |
| **P1-011** | Admin descarga plantilla de importación con formato requerido | E2E | | Validar descarga plantilla |

**Total P1 - Módulo 3:** 3 tests

#### MÓDULO 4: Gestión de Repuestos (3 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-012** | Usuario con `can_manage_stock` gestiona catálogo de repuestos | E2E | | Validar gestión catálogo |
| **P1-013** | Importación masiva de repuestos desde CSV con validación | API | R-008 | Validar import repuestos |
| **P1-014** | Reporte de resultados de importación (exitosos, errores) | E2E | | Validar reporte importación |

**Total P1 - Módulo 4:** 3 tests

#### MÓDULO 5: Usuarios y PBAC (6 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-015** | Admin crea hasta 20 etiquetas de clasificación personalizadas | E2E | | Validar creación de etiquetas |
| **P1-016** | Admin asigna/quita etiquetas de clasificación a usuarios | E2E | | Validar asignación de etiquetas |
| **P1-017** | Etiquetas de clasificación NO otorgan capabilities (independientes) | E2E | | Validar independencia |
| **P1-018** | Usuario edita su información personal | E2E | | Validar edición perfil |
| **P1-019** | Usuario cambia su contraseña | E2E | NFR-S2 | Validar cambio contraseña |
| **P1-020** | Admin elimina usuario del sistema | E2E | | Validar eliminación usuario |
| **P1-021** | Admin ve historial de actividad de usuario últimos 6 meses | E2E | | Validar historial actividad |

**Total P1 - Módulo 5:** 7 tests

#### MÓDULO 6: Dashboard KPIs (3 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-022** | Exportar reportes de KPIs a Excel compatible con Excel 2016+ | E2E | | Validar export Excel |
| **P1-023** | Usuario con `can_receive_reports` configura reportes automáticos | E2E | R-004 | Validar configuración reportes |
| **P1-024** | Dashboard común visible para todos con navegación por capacidades | E2E | | Validar dashboard común |

**Total P1 - Módulo 6:** 3 tests

#### MÓDULO 7: Sincronización Multi-Device (1 test)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-025** | Conexión SSE se reconecta automáticamente si se pierde temporalmente (<30s) | E2E | NFR-R4 | Validar reconexión automática |

**Total P1 - Módulo 7:** 1 test

#### MÓDULO 8: Seguridad y NFRs (3 tests)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P1-026** | Sistema soporta 10,000 activos sin degradación | Load | R-001 | Validar scalability |
| **P1-027** | Sistema soporta 100 usuarios concurrentes sin degradación >10% | Load | R-006 | Validar scalability |
| **P1-028** | Rate limiting enforced | API | NFR-S9 | Validar rate limiting |

**Total P1 - Módulo 8:** 3 tests

**TOTAL P1:** 26 tests

---

### P2 (Medium)

**Criteria:** Secondary features + Low risk (1-2) + Edge cases + Regression prevention

#### MÓDULO 3: Gestión de Activos (1 test)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P2-001** | Estructura jerárquica se valida automáticamente durante importación | API | | Validar validación jerárquica |

#### MÓDULO 7: Sincronización Multi-Device (1 test)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P2-002** | Estrategia de conflicto en sincronización (last-write-wins + merge) | API | R-002 | Validar resolución de conflictos |

#### MÓDULO 8: Seguridad y NFRs (1 test)

| Test ID    | Requirement   | Test Level | Risk Link | Notes   |
| ---------- | ------------- | ---------- | --------- | ------- |
| **P2-003** | Interfaz cumple WCAG AA (contraste 4.5:1) | E2E | NFR-A1 | Validar accesibilidad |

**TOTAL P2:** 3 tests

---

### P3 (Low)

**Criteria:** Nice-to-have + Exploratory + Performance benchmarks + Documentation validation

**Note:** P3 tests not included in MVP Phase 1. Will be considered for Phase 2+.

**TOTAL P3:** 0 tests

---

## Execution Strategy

**Philosophy:** Run everything in PRs unless there's significant infrastructure overhead. Playwright with parallelization is extremely fast (100s of tests in ~10-15 min).

**Organized by TOOL TYPE:**

### Every Pull Request: Playwright Tests (~10-15 min)

**All functional tests** (from any priority level):

- All E2E, API, integration, unit tests using Playwright
- Parallelized across 4-8 workers
- Total: ~102 Playwright tests (includes P0, P1, P2)
- **Commands:**
  ```bash
  # All tests in PR
  npx playwright test --workers=4

  # Only P0 + P1 for quick verification
  npx playwright test --grep "@P0|@P1"

  # Only P0 for critical path validation
  npx playwright test --grep "@P0"
  ```

**Why run in PRs:** Fast feedback, no expensive infrastructure, catches regressions early

### Nightly: k6 Performance Tests (~30-60 min)

**All performance tests** (from any priority level):

- Load tests: 50 and 100 concurrent users (NFR-P6, NFR-SC2, R-006)
- Performance: Predictive search <200ms (NFR-P1, R-001)
- Performance: 10K asset import <5min (NFR-P7, R-008)
- Performance: KPI calculation with large history (R-009)
- Total: ~6-8 k6 tests (may include P0, P1, P2)
- **Commands:**
  ```bash
  # Load test: 50 concurrent users
  k6 run tests/load/50-users.js

  # Load test: 100 concurrent users
  k6 run tests/load/100-users.js

  # Performance: Predictive search with 10K assets
  k6 run tests/performance/predictive-search.js
  ```

**Why defer to nightly:** Expensive infrastructure (k6 Cloud), long-running (10-40 min per test)

### Weekly: Chaos & Long-Running (~hours)

**Special infrastructure tests** (from any priority level):

- Multi-region failover (requires AWS Fault Injection Simulator)
- Disaster recovery (backup restore, 4+ hours)
- Endurance tests (4+ hours runtime)

**Why defer to weekly:** Very expensive infrastructure, very long-running, infrequent validation sufficient

**Manual tests** (excluded from automation):

- DevOps validation (deployment, monitoring)
- Documentation validation

---

## QA Effort Estimate

**QA test development effort only** (excludes DevOps, Backend, Data Eng, Finance work):

| Priority  | Count | Effort Range       | Notes                                             |
| --------- | ----- | ------------------ | ------------------------------------------------- |
| P0        | ~73  | ~6-9 weeks         | Complex setup (security, performance, multi-step, testability blockers) |
| P1        | ~26  | ~4-6 weeks         | Standard coverage (integration, API tests)        |
| P2        | ~3   | ~3-5 days          | Edge cases, simple validation                     |
| P3        | 0    | N/A                | Not included in MVP                               |
| **Total** | **~102** | **~10-15 weeks** | **1 QA engineer, full-time**                      |

**Assumptions:**

- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure (factories, fixtures, environments) ready
- **Dependencies from other teams:** See "Dependencies & Test Blockers" section above

**Dependencies from other teams:**

- **Backend Dev**: 5 pre-implementation blockers (BLK-001 through BLK-005)
- **DevOps**: CI/CD pipeline configuration, k6 infrastructure
- **PM**: Requirements clarification, acceptance criteria

---

## Implementation Planning Handoff (Optional)

**Include only if this test design produces implementation tasks that must be scheduled.**

| Work Item   | Owner        | Target Milestone | Dependencies/Notes |
| ----------- | ------------ | ----------------- | ------------------ |
| Implement `/api/test-data` seeding APIs | Backend Dev | Phase 1 pre-implementation | BLOCKER for QA (BLK-001) |
| Implement SSE mock layer with fast-forward | Backend Dev + QA | Phase 1 pre-implementation | BLOCKER for QA (BLK-002) |
| Implement multi-device sync conflict strategy | Backend Dev | Phase 1 MVP | BLOCKER for QA (BLK-003) |
| Add observability (structured logging, correlation IDs, metrics) | Backend Dev | Phase 1 MVP | BLOCKER for QA (BLK-004) |
| Configure k6 load testing infrastructure | Backend Dev + DevOps | Phase 1 MVP | BLOCKER for QA (BLK-005) |
| Create Playwright test factories and fixtures | QA | Phase 1 pre-implementation | User, Asset, OT, Repuesto factories |
| Configure GitHub Actions with Playwright | DevOps + QA | Phase 1 MVP | PR tests automation |
| Implement P0 test suite (73 tests) | QA | Phase 1 MVP | 6-9 weeks estimated |
| Implement P1 test suite (26 tests) | QA | Phase 1 MVP | 4-6 weeks estimated |
| Implement P2 test suite (3 tests) | QA | Phase 1 MVP | 3-5 days estimated |

---

## Tooling & Access

**Include only if non-standard tools or access requests are required.**

| Tool or Service   | Purpose   | Access Required | Status            |
| ----------------- | --------- | --------------- | ----------------- |
| Supabase (Docker local) | Local development database | Docker installed | Ready (local) |
| Supabase (hosted) | Staging environment | API key, project URL | Pending setup |
| Vercel CLI | Deployment | Installed, authenticated | Ready |
| Playwright | E2E/API/Unit testing | Node.js 18+, npx | Ready |
| k6 | Performance testing | CLI installed, k6 Cloud account (optional) | Pending setup |
| GitHub Actions | CI/CD | Repository access | Pending configuration |
| Faker.js | Test data generation | npm package | Ready |

**Access requests needed (if any):**

- [ ] Supabase hosted project API key and URL (staging)
- [ ] k6 Cloud account (optional, local k6 CLI sufficient)
- [ ] GitHub Actions workflows configuration

---

## Interworking & Regression

**Services and components impacted by this feature:**

**Note:** For MVP Phase 1 of gmao-hiansa, there are no external system integrations yet. Future phases (Phase 3+) will integrate with ERP and IoT systems.

**Internal dependencies:**

| Service/Component | Impact              | Regression Scope                | Validation Steps              |
| ----------------- | ------------------- | ------------------------------- | ----------------------------- |
| **PostgreSQL/Supabase** | Core database, todas las funcionalidades dependen de DB | Todas las pruebas de API/E2E validan que DB queries funcionan correctamente | Validar migrations aplicadas, índices creados, connection pooling configurado |
| **Next.js API Routes** | Backend API, todos los flujos de negocio | Todas las pruebas de API validan endpoints funcionan | Validar API routes no broken, tRPC contratos maintained |
| **SSE (Server-Sent Events)** | Real-time updates para OTs y KPIs | Tests P0-004, P0-019, P0-051, P0-052 validan sync funciona | Validar SSE heartbeat 30s funciona, reconexión automática, fast-forward en tests |
| **tRPC** | Type-safe API communication | Todas las pruebas de API validan contratos tRPC | Validar tRPC routers no broken, types match |
| **Prisma ORM** | Database access layer | Tests de importación masiva, jerarquía de activos validan ORM funciona | Validar migrations aplicadas, seed data funciona, relaciones muchos-a-muchos funcionan |
| **Vercel (deployment)** | Hosting, serverless functions | Tests de deployment validan que aplicación funciona post-deploy | Validar deployment exitosa, rollback funciona, health check endpoint responde |

**Regression test strategy:**

- Validar que todos los P0 tests (73 tests) pasan antes y después de cambios significativos (DB schema, API contracts, authentication)
- Validar que NFRs (performance baselines) no degradan: búsqueda <200ms, first paint <3s, 50 usuarios concurrentes sin degradación
- Nota: No hay cross-team coordination needed para regression validation en MVP Phase 1 (sistema es standalone)

---

## Appendix A: Code Examples & Tagging

**Playwright Tags for Selective Execution:**

```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';

// P0 critical test - Búsqueda predictiva
test('@P0 @E2E @Performance P0-001: Operario reporta avería con búsqueda predictiva', async ({ page, apiRequest }) => {
  // Setup: Seed data via API (fast!)
  const equipo = await apiRequest.post('/api/test-data/assets', {
    data: {
      nombre: 'Perfiladora-P201',
      planta: 'Planta Acero Perfilado',
      linea: 'Línea 1',
    },
  });

  // Network-first: Intercept BEFORE action
  const searchPromise = page.waitForResponse('**/api/assets/search?q=Perfiladora');

  await page.goto('/averias/nuevo');
  await page.fill('[data-testid="equipo-search"]', 'Perfiladora');
  // Debounce automático de 300ms
  await searchPromise;

  // Assert: Resultados aparecen
  await expect(page.getByText('Perfiladora-P201')).toBeVisible();
});

// P0 critical test - PBAC capability check
test('@P0 @E2E @Security P0-037: Usuario sin can_manage_assets solo consulta activos', async ({ page }) => {
  // Login as user without can_manage_assets
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'tecnico@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login"]');

  // Try to access asset management
  await page.goto('/activos');

  // Assert: Cannot edit (solo lectura)
  await expect(page.getByText('Ver Activos')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Editar' })).not.toBeVisible();
});

// P1 API test - Stock update es silencioso
test('@P1 @API P0-034: Actualización de stock es silenciosa', async ({ apiRequest }) => {
  // Setup: Create repuesto with stock mínimo
  const repuesto = await apiRequest.post('/api/test-data/repuestos', {
    data: {
      codigo: 'ROD-6208',
      nombre: 'Rodamiento SKF-6208',
      stock: 5,
      stock_minimo: 5,
    },
  });

  // Update stock (usage)
  const updateResponse = await apiRequest.patch(`/api/repuestos/${repuesto.id}`, {
    data: { stock: 4, motivo: 'Usado en OT-1234' },
  });

  expect(updateResponse.status()).toBe(200);

  // Verify: No notificación enviada a usuarios con can_manage_stock
  // (esto se valida checking que no hay notificaciones pendientes)
  const notifications = await apiRequest.get('/api/notifications?user=stock-manager');
  const notifs = await notifications.json();
  expect(notifs.items).toHaveLength(0); // Silencioso
});
```

**Run specific tags:**

```bash
# Run only P0 tests
npx playwright test --grep @P0

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run only security tests
npx playwright test --grep @Security

# Run only performance tests
npx playwright test --grep @Performance

# Run all Playwright tests in PR (default)
npx playwright test
```

**k6 Load Test Examples:**

```javascript
// tests/load/100-users.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // P95 <500ms
    http_req_failed: ['rate<0.01'],   // <1% error rate
  },
};

export default function () {
  // Login
  const loginRes = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const authToken = loginRes.json('token');

  // View dashboard
  const dashboardRes = http.get('http://localhost:3000/api/dashboard', {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });

  check(dashboardRes, {
    'dashboard loaded': (r) => r.status === 200,
    'MTTR present': (r) => r.json('mttr') !== undefined,
    'MTBF present': (r) => r.json('mtbf') !== undefined,
  });

  sleep(1);
}
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` - Risk scoring methodology (Probability × Impact)
- **Test Priorities Matrix**: `test-priorities-matrix.md` - P0-P3 criteria
- **Test Levels Framework**: `test-levels-framework.md` - E2E vs API vs Unit selection
- **Test Quality**: `test-quality.md` - Definition of Done (no hard waits, <300 lines, <1.5 min)
- **ADR Quality Readiness Checklist**: `adr-quality-readiness-checklist.md` - 29 NFR criteria

---

**Generated by:** BMad TEA Agent
**Workflow:** `_bmad/tea/testarch/test-design`
**Version:** 4.0 (BMad v6)
**Mode:** System-Level (Phase 3)
