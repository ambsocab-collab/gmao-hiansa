---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-07'
workflowType: 'testarch-test-design'
inputDocuments: ['prd.md', 'architecture.md']
mode: 'system-level'
---

# Test Design for Architecture: gmao-hiansa (GMAO - Gestión de Mantenimiento Asistido por Ordenador)

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** 2026-03-07
**Author:** Bernardo
**Status:** Architecture Review Pending
**Project:** gmao-hiansa
**PRD Reference:** `/planning-artifacts/archive/prd.md`
**ADR Reference:** `/planning-artifacts/archive/architecture.md`

---

## Executive Summary

**Scope:** GMAO (Gestión de Mantenimiento Asistido por Ordenador) single-tenant optimizado para empresa metalúrgica con dos plantas (acero perfilado y panel sandwich). MVP con 13 funcionalidades base que transforman departamento de mantenimiento reactivo a proactivo mediante datos y automatización.

**Business Context** (from PRD):

- **Revenue/Impact:** Transformación cultural de "caótico" a "profesional", reducción de downtime de producción, optimización de costos de mantenimiento
- **Problem:** Departamento opera con información fragmentada (Excel, WhatsApp, pizarra Kanban física), pérdida de tiempo productivo, paradas por falta de repuestos, incapacidad de medir y mejorar
- **GA Launch:** MVP Phase 1: 3-4 meses, Gate de decisión a 3 meses (90% adopción, 50+ OTs completadas)

**Architecture** (from ADR):

- **Key Decision 1:** Single-tenant optimizado (no multi-tenant complexity)
- **Key Decision 2:** Server-Sent Events (SSE) para real-time en lugar de WebSockets (Vercel serverless compatible)
- **Key Decision 3:** Next.js 14+ fullstack con API Routes + tRPC (no backend separado)
- **Key Decision 4:** PostgreSQL + Prisma ORM (hosting: Supabase/Docker local)
- **Key Decision 5:** Playwright para todos los niveles de testing (E2E, API, Unit)

**Expected Scale** (from ADR):

- 10,000+ activos (jerarquía 5 niveles)
- 100 usuarios concurrentes
- Búsqueda predictiva <200ms
- SSE heartbeat 30 segundos
- PWA con sincronización multi-dispositivo

**Risk Summary:**

- **Total riesgos**: 20 (2 críticos score=9, 4 altos score≥6, 10 medios, 4 bajos)
- **High-priority (≥6)**: 6 riesgos requieren mitigación inmediata
- **Test effort**: ~102 tests (~10-15 semanas para 1 QA, ~6-9 semanas para 2 QAs)

---

## Quick Guide

### 🚨 BLOCKERS - Team Must Decide (Can't Proceed Without)

**Pre-Implementation Critical Path** - These MUST be completed before QA can write integration tests:

1. **BLK-001: Test Data Seeding APIs Missing** - Implement `/api/test-data` endpoints (dev/staging only) para inyectar estados de datos específicos (ej: "Usuario con suscripción expirada") instantáneamente (recommended owner: Backend Dev, Phase 1 pre-implementation)

2. **BLK-002: SSE Mocking Complexity** - Proveer mock layer para SSE en test environment para evitar tests no deterministas con delays arbitrarios (recommended owner: Backend Dev + QA, Phase 1 pre-implementation)

3. **BLK-003: Multi-Device Sync Race Conditions** - Implementar estrategia de conflicto (last-write-wins + merge, versioning) para sincronización multi-dispositivo con SSE 30s heartbeat (recommended owner: Backend Dev, Phase 1 pre-implementation)

4. **BLK-004: Observability Gaps** - Agregar logging estructurado (JSON), correlation IDs distributed tracing para debuggear tests fallidos en CI/CD (recommended owner: Backend Dev, Phase 1 MVP)

5. **BLK-005: Performance Baseline Infrastructure** - Configurar load testing (k6) para validar NFRs: 10K activos, 100 usuarios concurrentes, búsqueda <200ms, importación <5min (recommended owner: Backend Dev + DevOps, Phase 1 MVP)

**What we need from team:** Complete these 5 items pre-implementation or test development is blocked.

---

### ⚠️ HIGH PRIORITY - Team Should Validate (We Provide Recommendation, You Approve)

1. **R-001: Predictive Search Performance (Score: 9)** - Implementar debouncing (300ms), caché de búsquedas frecuentes, índices DB optimizados. Owner: Backend Dev. Timeline: Phase 1 MVP (implementation phase)

2. **R-002: Multi-Device Sync Race Conditions (Score: 9)** - Implementar estrategia de conflicto (last-write-wins + merge), versioning de entidades, mecanismo de "fast-forward" para tests SSE. Owner: Backend Dev. Timeline: Phase 1 MVP (implementation phase)

3. **R-003: Deployment Strategy (Score: 6)** - Implementar rollback automatizado, feature flags para blue/green deployment en Vercel. Owner: DevOps. Timeline: Phase 1 MVP

4. **R-004: PDF Generation Blocking (Score: 6)** - Offload a background job, cola de generación, async processing para reportes automáticos. Owner: Backend Dev. Timeline: Phase 1 MVP

5. **R-005: PBAC Implementation Security (Score: 6)** - Testing de seguridad exhaustivo, code review, P0 security tests para validar implementación correcta de 15 capacidades. Owner: Backend Dev + QA. Timeline: Phase 1 MVP

6. **R-006: Concurrent User Performance (Score: 6)** - Load testing antes de GA, optimización de queries, connection pooling para 100 usuarios concurrentes. Owner: Backend Dev. Timeline: Pre-GA

**What we need from team:** Review recommendations and approve (or suggest changes).

---

### 📋 INFO ONLY - Solutions Provided (Review, No Decisions Needed)

1. **Test strategy**: 60 E2E tests (user journeys), 30 API tests (business logic), 8 Unit tests (pure functions), 4 Load tests (performance) - Total 102 tests (Rationale: Pyramid invertida es apropiada para este stack fullstack moderno con Playwright)

2. **Tooling**: Playwright (E2E, API, Unit), k6 (performance), Supabase local (Docker), Vercel CLI (deployment)

3. **Tiered CI/CD**: PR tests (~10-15 min, Playwright todos), Nightly performance (~30-60 min, k6 load), Weekly chaos (si aplica fases posteriores)

4. **Coverage**: ~102 test scenarios priorizados P0-P3 con clasificación basada en riesgo
   - P0: 73 tests (critical paths, security, high-risk features)
   - P1: 26 tests (important features, integration)
   - P2: 3 tests (edge cases, regression)
   - P3: 0 tests (exploratory, benchmarks - no incluidos en MVP)

5. **Quality gates**: P0 pass rate = 100%, P1 pass rate ≥ 95%, todos los riesgos score 9 mitigados antes de GA, coverage target ≥ 80%

**What we need from team:** Just review and acknowledge (we already have the solution).

---

## For Architects and Devs - Open Topics 👷

### Risk Assessment

**Total risks identified**: 20 (2 critical score=9, 6 high priority score≥6, 10 medium, 4 low)

#### High-Priority Risks (Score ≥6) - IMMEDIATE ATTENTION

| Risk ID    | Category  | Description   | Probability | Impact | Score       | Mitigation            | Owner   | Timeline    |
| ---------- | --------- | ------------- | ----------- | ------ | ----------- | --------------------- | ------- | -------- |
| **R-001** | **PERF** | Búsqueda predictiva >200ms con 10K+ activos degrada UX | 3 (Alta) | 3 (Alto) | **9** | Debouncing (300ms), caché, índices DB optimizados | Backend Dev | Phase 1 MVP |
| **R-002** | **DATA** | Race conditions en sincronización multi-dispositivo (SSE 30s) | 3 (Alta) | 3 (Alto) | **9** | Estrategia conflicto (last-write-wins + merge), versioning | Backend Dev | Phase 1 MVP |
| **R-003** | **OPS** | Deployment monolítico sin blue/green | 2 (Media) | 3 (Alto) | **6** | Rollback automatizado, feature flags | DevOps | Phase 1 MVP |
| **R-004** | **PERF** | Generación PDF bloquea servidor (reportes automáticos) | 3 (Alta) | 2 (Medio) | **6** | Background job, cola generación, async | Backend Dev | Phase 1 MVP |
| **R-005** | **SEC** | Implementación incorrecta PBAC expone datos sensibles | 2 (Media) | 3 (Alto) | **6** | Security testing exhaustivo, code review, P0 tests | Backend Dev + QA | Phase 1 MVP |
| **R-006** | **PERF** | 100 usuarios concurrentes degradan performance | 2 (Media) | 3 (Alto) | **6** | Load testing pre-GA, optimización queries, connection pooling | Backend Dev | Pre-GA |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description   | Probability | Impact | Score   | Mitigation   | Owner   |
| ------- | -------- | ------------- | ----------- | ------ | ------- | ------------ | ------- |
| R-007  | PERF | Búsqueda universal >500ms con datasets grandes | 2 | 2 | 4 | Paginación, búsqueda incremental | Backend Dev |
| R-008  | PERF | Importación 10K activos >5 minutos | 2 | 2 | 4 | Batch processing, progress bar | Backend Dev |
| R-009  | PERF | Cálculo KPIs (MTTR/MTBF) lento con histórico grande | 2 | 2 | 4 | Materialized views, caché | Backend Dev |
| R-010  | PERF | PWA performance pobre en móviles gama baja | 2 | 2 | 4 | Optimizar bundle, lazy loading | Frontend Dev |
| R-011  | DATA | Pérdida datos en concurrencia stock updates | 2 | 2 | 4 | Optimistic locking, transacciones | Backend Dev |
| R-012  | PERF | Database connection pool exhaustion | 2 | 2 | 4 | Connection pooling, monitoring | Backend Dev |
| R-013  | TECH | Relaciones muchos-a-muchos (componentes multi-equipos) complejas | 2 | 2 | 4 | Prisma junction tables, integration tests | Backend Dev |
| R-014  | OPS | Email service failure (reportes automáticos) | 1 | 3 | 5 | Queue con retry, fallback, monitoring | Backend Dev |
| R-015  | OPS | Backup restore no probado (RTO 4h no validado) | 1 | 3 | 5 | Restore exercises trimestrales | DevOps |
| R-016  | PERF | Tests no pueden correr en paralelo (data pollution) | 2 | 2 | 4 | Auto-cleanup fixtures, faker unique data | QA |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description   | Probability | Impact | Score   | Action  |
| ------- | -------- | ------------- | ----------- | ------ | ------- | ------- |
| R-017  | OPS | Falla terceros (Supabase, Vercel) | 1 | 2 | 2 | Monitor |
| R-018  | TECH | Solo Chrome/Edge soportado (no Firefox/Safari) | 1 | 2 | 2 | Documentar |
| R-019  | TECH | Localización solo castellano (no i18n) | 1 | 1 | 1 | N/A |
| R-020  | PERF | Móviles antiguos no soportan PWA | 1 | 1 | 1 | N/A |

#### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

### Testability Concerns and Architectural Gaps

**🚨 ACTIONABLE CONCERNS - Architecture Team Must Address**

#### 1. Blockers to Fast Feedback (WHAT WE NEED FROM ARCHITECTURE)

| Concern            | Impact              | What Architecture Must Provide         | Owner  | Timeline    |
| ------------------ | ------------------- | -------------------------------------- | ------ | ----------- |
| **Test Data Seeding APIs Missing** | Tests lentos, setup manual vía UI | Implement `/api/test-data` endpoints (dev/staging only) para inyectar estados: "Usuario con suscripción expirada", "Equipo con 50 OTs", "Stock crítico alcanzado" | Backend Dev | Phase 1 pre-implementation |
| **SSE Mocking Complexity** | Tests no deterministas, arbitrary delays | Proveer mock layer para SSE que permita "fast-forward" (actualizaciones instantáneas en tests en lugar de esperar 30s heartbeat) | Backend Dev + QA | Phase 1 pre-implementation |
| **Multi-Device Sync Determinism** | Tests flaky, race conditions | Implement estrategia de conflicto (last-write-wins + merge), versioning de entidades, correlation IDs | Backend Dev | Phase 1 MVP |
| **Observability Gaps** | Difícil debuggear tests fallidos | Agregar logging estructurado (JSON), correlation IDs distributed tracing, /metrics endpoint (RED: Rate, Errors, Duration) | Backend Dev | Phase 1 MVP |
| **Performance Baseline Missing** | No se puede validar NFRs | Configurar load testing infrastructure (k6), monitoreo de connection pools, índices DB optimizados | Backend Dev + DevOps | Phase 1 MVP |

**Examples:**

- **No API for test data seeding** → Cannot parallelize tests → Provide POST /test/seed endpoint (Backend Dev, pre-implementation)
- **SSE cannot be mocked** → Tests dependen de timing real → Provide SSE mock with fast-forward mode (Backend Dev + QA, pre-implementation)

#### 2. Architectural Improvements Needed (WHAT SHOULD BE CHANGED)

**Prioridad 1 - BLOCKERS (resolución obligatoria pre-implementation):**

1. **Test Data Seeding API**
   - **Current problem**: No forma de inyectar estados específicos para tests (ej: "Stock mínimo alcanzado", "Equipo con 3 averías en el día")
   - **Required change**: Implement `/api/test-data` endpoints con operaciones de seeding:
     - `POST /test-data/users` - Crear usuarios con estados específicos
     - `POST /test-data/assets` - Crear activos con historial de OTs
     - `POST /test-data/stock` - Configurar niveles de stock críticos
     - `POST /test-data/reset` - Limpiar datos de tests (cleanup)
   - **Impact if not fixed**: Tests toman 10x más tiempo (setup manual vía UI), tests no pueden paralelizarse, tests no deterministas
   - **Owner**: Backend Dev
   - **Timeline**: Phase 1 pre-implementation (ANTES de que QA escriba tests)

2. **SSE Mock Layer**
   - **Current problem**: SSE para actualizaciones real-time (30s heartbeat) no tiene mock, tests dependen de delays arbitrarios (waitForTimeout(30000))
   - **Required change**: Implement mock layer que permita:
     - "Fast-forward mode": Actualizaciones instantáneas en tests en lugar de esperar 30s
     - Event triggering: Disparar eventos específicos (ej: "OT status changed") en tests
     - State control: Controlar estado de conexión SSE (connected, disconnected, error)
   - **Impact if not fixed**: Tests no deterministas, tests lentos (30s+ por test), tests flaky
   - **Owner**: Backend Dev + QA
   - **Timeline**: Phase 1 pre-implementation

3. **Observability Infrastructure**
   - **Current problem**: No logging estructurado, no correlation IDs, no /metrics endpoint, difícil debuggear tests fallados en CI/CD
   - **Required change**: Implement:
     - Logging estructurado en JSON (no console.log strings)
     - Correlation IDs en todas las requests (W3C Trace Context)
     - /metrics endpoint exponiendo RED metrics (Rate, Errors, Duration)
     - Distributed tracing (opcional pero recomendado)
   - **Impact if not fixed**: Imposible debuggear tests fallados en CI/CD, diagnosis time aumenta 10x
   - **Owner**: Backend Dev
   - **Timeline**: Phase 1 MVP

**Prioridad 2 - HIGH (resolución recomendada Phase 1 MVP):**

4. **Multi-Device Sync Conflict Strategy**
   - **Current problem**: SSE 30s heartbeat + eventual consistency crea race conditions cuando mismo dispositivo edita desde múltiples clientes
   - **Required change**: Implement:
     - Versión de entidades (version field o updated_at timestamp)
     - Estrategia de conflicto: last-write-wins + merge strategy
     - Detección de conflictos: Comparar versiones antes de sobrescribir
     - Resolución de conflictos: Merge automático o notificación a usuario
   - **Impact if not fixed**: Pérdida de datos,用户体验 pobre, tests flaky (R-002 score 9)
   - **Owner**: Backend Dev
   - **Timeline**: Phase 1 MVP

5. **Performance Baseline Infrastructure**
   - **Current problem**: No load testing configurado, no se puede validar NFRs (10K activos, 100 usuarios, búsqueda <200ms)
   - **Required change**: Configurar:
     - k6 para load testing (50 y 100 usuarios concurrentes)
     - Monitoring de connection pools (PostgreSQL)
     - Baselines de performance: búsqueda predictiva <200ms, importación <5min, cálculo KPIs <2s
   - **Impact if not fixed**: No se puede validar NFRs pre-GA, performance surprises en producción (R-001, R-006 score 9, 6)
   - **Owner**: Backend Dev + DevOps
   - **Timeline**: Phase 1 MVP

---

### Testability Assessment Summary

**📊 CURRENT STATE - FYI**

#### What Works Well

- ✅ **API-first design** - Todos los flujos de negocio son accesibles vía API (Next.js API Routes), permite testing headless sin UI
- ✅ **Type-safe communication** - tRPC elimina ambigüedad en contratos API, reduce errores de integración
- ✅ **PostgreSQL con Prisma** - ORM estable con excelente soporte de testing, migrations integradas
- ✅ **Playwright seleccionado** - Framework moderno con fixtures, paralelización, network-first patterns
- ✅ **Stateless backend** - Next.js serverless sin session state, fácil de escalar, fácil de testear
- ✅ **HTTP-only (no WebSockets)** - SSE es más simple y testable que WebSockets, compatible con Vercel serverless

#### Accepted Trade-offs (No Action Required)

For **gmao-hiansa Phase 1 MVP**, the following trade-offs are acceptable:

- **Single-tenant architecture** - Aceptable para MVP (una empresa), reduce complejidad de multi-tenancy
- **SSE instead of WebSockets** - Menos real-time (30s heartbeat vs instantáneo) pero suficiente para GMAO, compatible con Vercel serverless
- **No ERP/IoT integration initially** - Fases posteriores (Phase 3+), MVP se enfoca en core functionality
- **Chrome/Edge only** - Aceptable para ambiente industrial controlado, reduce testing surface
- **Spanish only (no i18n)** - Aceptable para MVP, empresa local en país hispanohablante

These trade-offs **should be revisited post-GA** OR maintained as-is depending on business evolution.

---

### Risk Mitigation Plans (High-Priority Risks ≥6)

**Purpose**: Detailed mitigation strategies for all 6 high-priority risks (score ≥6). These risks MUST be addressed before GA launch.

#### R-001: Predictive Search Performance Degradation (Score: 9) - CRITICAL

**Mitigation Strategy:**

1. **Implement debouncing**: 300ms delay antes de ejecutar búsqueda
2. **Optimize database indexes**: Índices compuestos en (name, type, location) para jerarquía de activos
3. **Add caching layer**: Redis o Supabase cache para búsquedas frecuentes (top 1000 términos)
4. **Implement pagination**: Máximo 50 resultados por página, cursor-based pagination
5. **Load testing baseline**: Validar <200ms con 10K activos usando k6 antes de GA

**Owner:** Backend Dev
**Timeline:** Phase 1 MVP (implementation phase)
**Status:** Planned
**Verification:** k6 load test con 10K activos, P95 <200ms

---

#### R-002: Multi-Device Sync Race Conditions (Score: 9) - CRITICAL

**Mitigation Strategy:**

1. **Entity versioning**: Agregar `version` field o `updated_at` timestamp a todas las entidades editables
2. **Conflict detection**: Comparar versiones antes de sobrescribir (optimistic locking)
3. **Last-write-wins strategy**: Última actualización gana, con merge automático de campos no conflictivos
4. **Conflict notification**: Usuario notificado si su edición fue sobrescrita
5. **SSE fast-forward for tests**: Mock layer que permita actualizar instantáneo en tests (sin esperar 30s)

**Owner:** Backend Dev
**Timeline:** Phase 1 MVP (implementation phase)
**Status:** Planned
**Verification:** Tests de concurrencia: 2 dispositivos editan misma OT simultáneamente, validar merge correcto

---

#### R-003: Deployment Strategy Gaps (Score: 6) - HIGH

**Mitigation Strategy:**

1. **Automated rollback**: Vercel deployment integration con rollback automático si health checks fallan
2. **Feature flags**: Implementar sistema de feature flags (LaunchDarkly o self-hosted) para rollback de features sin redeploy
3. **Blue/Green deployment**: Configurar Vercel para blue/green (preview deployments + alias switch)
4. **Health check endpoint**: `/health` endpoint que valide DB connection, critical services

**Owner:** DevOps
**Timeline:** Phase 1 MVP
**Status:** Planned
**Verification:** Deployment drill: deploy versión rota, validar rollback automático <5 min

---

#### R-004: PDF Generation Blocking Server (Score: 6) - HIGH

**Mitigation Strategy:**

1. **Background job processing**: Offload generación de PDF a cola (Vercel Cron Jobs o service externo)
2. **Async generation**: Reportes automáticos (diario, semanal, mensual) generados en background
3. **User notification**: Usuario notificado cuando PDF está listo (email + notificación in-app)
4. **Manual download fallback**: Permitir descarga manual en cualquier momento desde dashboard
5. **Queue monitoring**: Monitorear longitud de cola, alertas si backlog >100 reportes pendientes

**Owner:** Backend Dev
**Timeline:** Phase 1 MVP
**Status:** Planned
**Verification:** Test: Generar reporte mensual con 1000 OTs, validar que servidor no se bloquea, PDF completado en <2 min

---

#### R-005: PBAC Implementation Security (Score: 6) - HIGH

**Mitigation Strategy:**

1. **P0 security test suite**: Tests exhaustivos de todas las 15 capacidades del sistema PBAC
2. **Code review mandatory**: Todo cambio a lógica de autorización requiere code review de Senior Dev
3. **Security audit**: Auditoría de seguridad externa antes de GA (opcional pero recomendado)
4. **Test data sanitization**: Asegurar que datos de test nunca se mezclan con producción
5. **Access denied testing**: Tests que validan acceso denegado para todas las combinaciones de capabilities

**Owner:** Backend Dev + QA
**Timeline:** Phase 1 MVP (implementation phase)
**Status:** Planned
**Verification:** Security test suite: Validar que usuario sin `can_view_kpis` NO puede acceder a dashboard, etc.

---

#### R-006: Concurrent User Performance (Score: 6) - HIGH

**Mitigation Strategy:**

1. **Load testing infrastructure**: Configurar k6 para simular 100 usuarios concurrentes
2. **Connection pooling**: Configurar PostgreSQL connection pool (max 100 conexiones)
3. **Query optimization**: Revisar queries N+1, implementar eager loading donde necesario
4. **Database indexing**: Validar EXPLAIN queries críticos, asegurar uso de índices
5. **Pre-GA validation**: Load test obligatorio antes de GA, pasar = sin degradación >10%

**Owner:** Backend Dev
**Timeline:** Pre-GA (1 mes antes de launch)
**Status:** Planned
**Verification:** k6 load test: 100 usuarios concurrentes durante 1 hora, degradación <10% en response times

---

### Assumptions and Dependencies

#### Assumptions

1. Single-tenant architecture es aceptable para MVP (una empresa metalúrgica específica)
2. Chrome/Edge only browser support es aceptable para ambiente industrial controlado
3. Spanish-only localization es aceptable para MVP inicial
4. Supabase local (Docker) es suficiente para desarrollo y testing
5. Vercel serverless puede manejar 100 usuarios concurrentes sin degradación
6. SSE con 30s heartbeat es suficiente para real-time requirements (no instantáneo como WebSockets)
7. Playwright puede manejar 102 tests con paralelización en CI/CD sin timeouts
8. 1 QA engineer es suficiente para implementar 102 tests en 10-15 semanas

#### Dependencies

1. **Backend Dev** - Implement test data seeding APIs pre-implementation (BLK-001)
2. **Backend Dev** - Implement SSE mock layer pre-implementation (BLK-002)
3. **Backend Dev** - Implement multi-device sync conflict strategy Phase 1 MVP (BLK-003)
4. **Backend Dev** - Add observability (structured logging, correlation IDs, metrics) Phase 1 MVP (BLK-004)
5. **Backend Dev + DevOps** - Configure performance testing infrastructure Phase 1 MVP (BLK-005)
6. **QA** - Implement auto-cleanup fixtures para paralelización pre-implementation (BLK-003)
7. **DevOps** - Configure CI/CD pipeline con Playwright tests en PRs
8. **DevOps** - Configure k6 load testing infrastructure
9. **PM** - Priorizar epics y stories para alineación con test plan

#### Risks to Plan

- **Risk**: Test data seeding APIs no están implementadas pre-implementation
  - **Impact**: QA no puede escribir tests eficientemente, timeline se extiende 4-6 semanas
  - **Contingency**: QA usa UI manual para setup (10x más lento), reducir scope de tests P0-P1 only

- **Risk**: SSE mock layer no está disponible pre-implementation
  - **Impact**: Tests de real-time son no deterministas y lentos,质量问题
  - **Contingency**: Aceptar tests flaky temporalmente, priorizar fixes en Phase 1.5

- **Risk**: Load testing infrastructure no está lista Phase 1 MVP
  - **Impact**: No se pueden validar NFRs pre-GA, riesgo de performance surprises en producción
  - **Contingency**: Postergar GA hasta validar NFRs con 100 usuarios concurrentes

---

**End of Architecture Document**

**Next Steps for Architecture Team:**

1. Review Quick Guide (🚨/⚠️/📋) and prioritize blockers
2. Assign owners and timelines for high-priority risks (R-001 through R-006)
3. Validate assumptions and dependencies
4. Provide feedback to QA on testability gaps
5. **CRITICAL**: Resolve 5 blockers (BLK-001 through BLK-005) before QA starts test development

**Next Steps for QA Team:**

1. Wait for pre-implementation blockers to be resolved
2. Refer to companion QA doc (test-design-qa.md) for test scenarios
3. Begin test infrastructure setup (factories, fixtures, environments)
4. Plan P0 test implementation (73 tests, 6-9 semanas estimated effort)
