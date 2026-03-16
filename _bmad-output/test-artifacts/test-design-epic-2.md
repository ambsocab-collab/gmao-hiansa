---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-16'
workflowType: 'testarch-test-design'
inputDocuments: ['epics.md', 'prd/non-functional-requirements.md', 'test-design-qa.md', 'risk-governance.md', 'probability-impact.md', 'test-levels-framework.md', 'test-priorities-matrix.md', 'playwright-cli.md', 'pactjs-utils-overview.md', 'pact-mcp.md']
mode: 'epic-level'
---

# Test Design: Epic 2 - Gestión de Averías y Reportes Rápidos

**Date:** 2026-03-16
**Author:** Bernardo
**Status:** Draft
**Project:** gmao-hiansa

---

## Executive Summary

**Scope:** full test design for Epic 2 - Gestión de Averías y Reportes Rápidos

**Risk Summary:**

- Total risks identified: 7
- High-priority risks (≥6): 5 (R-004 score=9, R-001 score=8, R-002 score=6, R-003 score=6, R-006 score=6)
- Critical categories: SECURITY (R-004), PERFORMANCE (R-001, R-002), DATA (R-006)

**Coverage Summary:**

- P0 scenarios: 15 (~25-35 hours)
- P1 scenarios: 23 (~20-30 hours)
- P2/P3 scenarios: 6 (~2-5 hours)
- **Total effort**: ~47-70 hours (~6-9 days)

---

## Not in Scope

| Item       | Reasoning      | Mitigation            |
| ---------- | -------------- | --------------------- |
| **Integración ERP** | Phase 3+ feature (expansión futura) | Manual hasta Phase 3, pruebas de contract testing cuando se implemente |
| **Sensores IoT para equipos** | Phase 4 feature (optimización avanzada) | Manual hasta Phase 4, pruebas de ingesta de datos cuando se implemente |
| **Búsqueda Universal (equipos, componentes, repuestos, OTs)** | Phase 2 feature (estructura completa) | MVP tiene búsqueda predictiva de equipos solamente (Story 2.1) |
| **Internacionalización (i18n)** | MVP: Solo castellano | Aceptable para empresa local, pruebas de localización no requeridas en Phase 1 |

**Note:** Items listed here have been reviewed and accepted as out-of-scope for MVP Phase 1 by QA, Dev, and PM.

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description   | Probability | Impact | Score | Mitigation   | Owner   | Timeline |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ------------ | ------- | -------- |
| R-004   | SEC      | PBAC authorization bypass en triage - usuarios sin capability pueden acceder | 2 | 3 | 9 | P0 E2E/API tests validate 403, code review mandatory para PBAC middleware, audit logging | Backend Dev + QA Security | Story 2.3 |
| R-001   | PERF     | Búsqueda predictiva >200ms con 10,000 activos - degrada performance | 3 | 3 | 8 | Database indexing, query LIMIT 10, caching layer (Redis), k6 load test antes de release | Backend Dev | Antes de staging |
| R-002   | PERF     | SSE notifications delay >30s - supervisores no ven averías en tiempo real | 2 | 3 | 6 | SSE mock layer (BLK-002), RED metrics, fallback polling cada 20s | Backend Dev + QA | Sprint 2.2 |
| R-003   | BUS      | Mobile First usability - formulario no completar en <30s en móviles | 2 | 3 | 6 | Touch targets 44x44px (NFR-A3), CTA altura 56px, E2E test en <768px viewport, user testing | UX Designer + Frontend Dev | Story 2.2 |
| R-006   | DATA     | OT creation race condition - dos supervisores convierten misma avería simultáneamente | 2 | 3 | 6 | Database unique constraint on averia_id, API returns 409 Conflict, E2E test concurrent conversion | Backend Dev | Story 2.3 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description   | Probability | Impact | Score | Mitigation   | Owner   |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ------------ | ------- |
| R-007   | DATA     | Multi-device sync conflicts en triage - last-write-wins sin merge | 2 | 2 | 5 | Last-write-wins + merge strategy (BLK-003), version field (optimistic locking), UI "Actualizando..." indicator | Backend Dev + Frontend Dev |
| R-005   | OPS      | Photo upload storage failure - Vercel Blob/S3 limits, timeouts | 2 | 2 | 4 | File size validation (5MB), retry con exponential backoff, graceful degradation sin foto, storage metrics | Backend Dev |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Entry Criteria

- [ ] Requirements and assumptions agreed upon by QA, Dev, PM
- [ ] Test environment provisioned and accessible
- [ ] Test data available or factories ready:
  - [ ] Asset factory con 5-level hierarchy (10K+ assets para performance test)
  - [ ] User factory con capabilities PBAC (can_view_all_ots, sin can_view_all_ots)
  - [ ] Avería factory con estados (nueva, revisada, descartada, convertida a OT)
- [ ] Feature deployed to test environment
- [ ] **BLK-001**: Test Data Seeding APIs implementadas (/api/test-data/*)
- [ ] **BLK-002**: SSE Mock Layer implementado (fast-forward mode para tests)
- [ ] **BLK-003**: Multi-Device Sync Conflict Strategy implementada (last-write-wins + merge)
- [ ] **BLK-004**: Observability Infrastructure implementada (logging estructurado, correlation IDs, /metrics endpoint)
- [ ] **BLK-005**: Performance Baseline Infrastructure implementada (k6 configurado, baselines de performance)

## Exit Criteria

- [ ] All P0 tests passing (15 tests - 100% pass rate)
- [ ] All P1 tests passing (23 tests - ≥95% pass rate)
- [ ] No open high-priority / high-severity bugs (risks score≥6 mitigados)
- [ ] Test coverage agreed as sufficient:
  - [ ] Critical paths: ≥80%
  - [ ] Security scenarios: 100% (PBAC validation)
  - [ ] Performance: Story 2.1 search <200ms P95 with 10K assets
  - [ ] Mobile responsiveness: ≥80% (Stories 2.1-2.2 on <768px viewport)
- [ ] Quality gate decision: PASS (contingent on R-004 mitigation and P0 pass rate)

## Project Team (Optional)

**Include only if roles/names are known or responsibility mapping is needed; otherwise omit.**

| Name   | Role     | Testing Responsibilities |
| ------ | -------- | ------------------------ |
| Bernardo | QA Lead  | Test strategy, P0 E2E tests, performance validation (k6) |
| TBD | Backend Dev | API tests, PBAC middleware, SSE infrastructure, data seeding APIs |
| TBD | Frontend Dev | Component tests, mobile viewport validation, SSE client integration |
| TBD | UX Designer | Mobile usability testing, user journey validation |

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| **Story 2.1 - Búsqueda Predictiva** | | | | | |
| Search performance <200ms P95 (10K assets) | E2E (k6) | R-001 | 1 | QA | Performance critical path |
| Búsqueda predictiva end-to-end | E2E | R-001 | 1 | QA | Core user journey |
| **Story 2.2 - Formulario Avería** | | | | | |
| Complete report in <30 seconds (mobile) | E2E (mobile) | R-003 | 1 | QA | Core journey |
| Team search integration | E2E | R-001 | 1 | QA | Dependency Story 2.1 |
| Team required validation | E2E | R-003 | 1 | QA | NFR-S2 |
| Description required validation | E2E | R-003 | 1 | QA | NFR-S2 |
| Submit confirmation with number | E2E | - | 1 | QA | Success criteria |
| **Story 2.3 - Triage y OTs** | | | | | |
| PBAC: only can_view_all_ots access /averias/triage | E2E | R-004 | 1 | QA Security | **CRITICAL BLOCKER** |
| API: POST /averias/triage sin capability returns 403 | API | R-004 | 1 | QA Security | Security test |
| "Por Revisar" column shows new avisos | E2E | - | 1 | QA | Core feature |
| Modal "Convertir a OT" creates OT | E2E | R-006 | 1 | QA | Core workflow |
| OT created with "Pendiente" status | E2E | R-006 | 1 | QA | State transition |
| OT marked as "Correctivo" type | E2E | - | 1 | QA | NFR-S11-A |
| OT appears in Kanban "Pendiente" column | E2E | - | 1 | QA | Integration Epic 3 |
| API: Concurrent conversion unique constraint | API | R-006 | 1 | QA | Race condition |
| E2E: Two supervisors convert same avería → 1 OT | E2E | R-006 | 1 | QA | Data integrity |

**Total P0**: 15 tests, ~30 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| **Story 2.1** (8 tests) | E2E | R-001 | 8 | QA | Input 44px, hierarchy display, division tags, max 10 results, selection behavior, no results, change selection |
| **Story 2.2** (7 tests) | E2E/API | R-005 | 7 | QA | CTA styling, description textarea, photo upload, redirect, SSE notification, desktop layout |
| **Story 2.3** (9 tests) | E2E/API | R-002, R-007 | 9 | QA | Card details, pink/white colors, modal details, SSE notification, discard flow, audit logging, SSE sync, rework OT |

**Total P1**: 23 tests, ~23 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement   | Test Level | Risk Link | Test Count | Owner | Notes   |
| ------------- | ---------- | --------- | ---------- | ----- | ------- |
| **Story 2.1** (1 test) | Unit | - | 1 | DEV | data-testid attribute |
| **Story 2.2** (2 tests) | E2E/API | R-005 | 2 | QA | Photo upload failure, submit with photo (multipart) |
| **Story 2.3** (3 tests) | E2E | - | 3 | QA | Count badge, filter/sort, reporter notification |

**Total P2**: 6 tests, ~3 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement   | Test Level | Test Count | Owner | Notes   |
| ------------- | ---------- | ---------- | ----- | ------- |
| **Story 2.2** (0 tests) | - | 0 | - | None in MVP |
| **Story 2.3** (0 tests) | - | 0 | - | None in MVP |

**Total P3**: 0 tests, 0 hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Story 2.1: Búsqueda predictiva muestra resultados (30s)
- [ ] Story 2.2: Login → reportar avería → confirmación número (2min)
- [ ] Story 2.3: Supervisor accede a /averias/triage → ve columna "Por Revisar" (30s)

**Total**: 3 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] Story 2.1: Búsqueda predictiva <200ms performance test (k6 load test) (5min)
- [ ] Story 2.1: Búsqueda predictiva end-to-end (E2E) (1min)
- [ ] Story 2.2: Complete report in <30s mobile (E2E) (2min)
- [ ] Story 2.2: Team required validation (E2E) (30s)
- [ ] Story 2.2: Description required validation (E2E) (30s)
- [ ] Story 2.2: Submit confirmation + redirect (E2E) (1min)
- [ ] Story 2.3: PBAC access control (E2E) (1min)
- [ ] Story 2.3: API 403 sin capability (API) (30s)
- [ ] Story 2.3: Convertir a OT (E2E) (1min)
- [ ] Story 2.3: OT "Pendiente" status + "Correctivo" type (E2E) (1min)
- [ ] Story 2.3: OT en Kanban (E2E) (30s)
- [ ] Story 2.3: API concurrent conversion unique constraint (API) (1min)
- [ ] Story 2.3: E2E two supervisors → 1 OT (E2E) (2min)

**Total**: 15 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] Story 2.1: 8 E2E tests (UI validation, hierarchy, tags, selection) (8min)
- [ ] Story 2.2: 7 E2E/API tests (CTA, description, photo, redirect, SSE, desktop) (10min)
- [ ] Story 2.3: 9 E2E/API tests (cards, modal, discard, audit, SSE sync, rework) (12min)

**Total**: 23 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] Story 2.1: 1 Unit test (data-testid) (2min)
- [ ] Story 2.2: 2 E2E/API tests (photo failure, multipart upload) (5min)
- [ ] Story 2.3: 3 E2E tests (badge, filter/sort, notification) (5min)

**Total**: 6 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count             | Hours/Test | Total Hours       | Notes                   |
| --------- | ----------------- | ---------- | ----------------- | ----------------------- |
| P0        | 15                | 1.5-2.5    | ~25-35 hours      | Complex setup, security, performance |
| P1        | 23                | 0.75-1.5   | ~20-30 hours      | Standard coverage       |
| P2        | 6                 | 0.25-1.0   | ~2-5 hours        | Edge cases              |
| P3        | 0                 | -          | 0 hours           | None in MVP             |
| **Total** | **44**            | **-**      | **~47-70 hours**  | **~6-9 days**           |

### Timeline

- **Week 1-2**: P0 smoke tests (15 tests) - ~25-35 hours
- **Week 2-3**: P1 coverage (23 tests) - ~20-30 hours
- **Week 3-4**: P2 edge cases (6 tests) - ~2-5 hours

### Prerequisites

**Test Data:**

- `AssetFactory` (faker-based, 5-level hierarchy: Planta → Línea → Equipo → Componente → Repuesto)
  - Seed 10,000+ assets para performance test Story 2.1
  - Con jerarquía completa y tags de división (HiRock, Ultra)
- `UserFactory` (faker-based, email, nombre, teléfono únicos)
  - Con capabilities PBAC: can_view_all_ots, sin can_view_all_ots
- `AveriaFactory` (faker-based, estados: nueva, revisada, descartada, convertida)
  - Con foto opcional, reportado por, timestamp
- `OTFactory` (faker-based, estados: Pendiente, Aprobada, En Progreso)
  - Con tipo: Correctivo, Preventivo, vinculación a avería

**Tooling:**

- **k6** para load testing (Story 2.1 performance test with 10K assets)
- **Playwright** para E2E tests (mobile viewport <768px, desktop >1200px)
- **SSE Mock Layer** (BLK-002) para fast-forward mode en tests
- **Test Data Seeding APIs** (BLK-001): POST /api/test-data/assets, /users, /averias

**Environment:**

- Staging con SSE mock layer implementado
- Test database with 10K+ assets seeded
- Performance baseline infrastructure (k6 configurado, baselines <200ms)
- Observability: logging estructurado, correlation IDs, /metrics endpoint (RED metrics)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions) - 15 tests must pass
- **P1 pass rate**: ≥95% (waivers required for failures) - 22/23 tests minimum
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers
  - R-004 (SEC score=9): **MUST** be mitigated before release
  - R-001 (PERF score=8): **MUST** be mitigated (search <200ms validated)
  - R-002, R-003, R-006 (score=6): Mitigation plans required

### Coverage Targets

- **Critical paths**: ≥80% (Stories 2.1-2.3 happy paths)
- **Security scenarios**: 100% (R-004 PBAC validation - can_view_all_ots)
- **Performance**: Story 2.1 search <200ms P95 with 10K assets (k6 load test)
- **Business logic**: ≥70% (avería → OT workflow, PBAC checks, SSE notifications)
- **Mobile responsiveness**: ≥80% (Stories 2.1-2.2 on <768px viewport, touch targets 44x44px)

### Non-Negotiable Requirements

- [ ] All P0 tests pass (15/15 tests - 100%)
- [ ] No high-risk (≥6) items unmitigated (R-004, R-001, R-002, R-003, R-006)
- [ ] Security tests (R-004 SEC category) pass 100%
  - [ ] E2E: Usuario sin capability can_view_all_ots no puede acceder /averias/triage
  - [ ] API: POST /averias/triage sin capability returns 403
- [ ] Performance targets met (R-001 PERF category)
  - [ ] Story 2.1: Búsqueda predictiva <200ms P95 with 10,000 assets (k6 validated)
- [ ] SSE notifications functional (R-002 PERF category)
  - [ ] Story 2.2/2.3: SSE notifications delivered in <30s to supervisores/técnicos

**Gate Decision:**
- **Current**: FAIL - 1 critical risk (R-004 score=9) unmitigated
- **After Mitigation**: PASS contingent on all P0 tests passing and R-001 performance validated

---

## Mitigation Plans

### R-004: PBAC Authorization Bypass en Triage (Score: 9)

**Mitigation Strategy:**
- Implement PBAC middleware check en todos endpoints de /averias/triage
- P0 E2E test: Login usuario sin capability can_view_all_ots, attempt GET /averias/triage, verify 403 Forbidden
- P0 API test: POST /averias/triage (convert action) sin capability returns 403
- Code review mandatory para todos endpoints nuevos de Story 2.3
- Audit logging: access denials logged (NFR-S5) - "Access denied to /averias/triage by user {userId}"

**Owner:** Backend Dev + QA Security
**Timeline:** Antes de Story 2.3 deployment
**Status:** Planned
**Verification:** P0 tests 2.3-E2E-001 y 2.3-API-001 must pass

---

### R-001: Búsqueda Predictiva Performance Degradation (Score: 8)

**Mitigation Strategy:**
- Implement database indexing on asset name and hierarchy fields (Planta, Línea, Equipo)
- Use query LIMIT 10 to prevent full table scans
- Add caching layer (Redis) para frequent searches
- k6 load test with 10,000 assets before deployment to staging:
  - Simulate 100 concurrent users searching
  - Validate P95 <200ms response time
  - Baseline metrics stored in performance dashboard

**Owner:** Backend Dev
**Timeline:** Antes de deployment a staging
**Status:** Planned
**Verification:** Test 2.1-E2E-001 (k6) must pass with P95 <200ms

---

### R-002: SSE Notification Delay >30s (Score: 6)

**Mitigation Strategy:**
- Implement SSE mock layer (BLK-002) para fast-forward mode en tests (no esperar 30s reales)
- Monitor SSE delivery time con métricas RED (Rate, Errors, Duration)
- Fallback: polling cada 20s si SSE reconnect falla 3 veces consecutivas
- Test: P0-004 validates notificación SSE recibida en <30s

**Owner:** Backend Dev + QA
**Timeline:** Sprint 2.2 implementation
**Status:** Planned
**Verification:** Tests 2.2-E2E-011 y 2.3-E2E-011 must pass (SSE <30s)

---

### R-003: Mobile First Form Usability Issues (Score: 6)

**Mitigation Strategy:**
- Enforce NFR-A3: touch targets mínimo 44x44px (validar en Story 2.2 AC)
- Mobile-first layout: CTA altura 56px, padding 16px, tapping-friendly
- E2E test en viewport móvil (<768px) valida 30-second completion
- User testing con 2-3 operarios reales antes de GA (sesión 30 min)

**Owner:** UX Designer + Frontend Dev
**Timeline:** Antes de Story 2.2 code-complete
**Status:** Planned
**Verification:** Test 2.2-E2E-002 must pass (complete report <30s en mobile)

---

### R-006: OT Creation Race Condition (Score: 6)

**Mitigation Strategy:**
- Implement database unique constraint on averia_id en OTs table
- API returns 409 Conflict si OT ya existe para esa avería
- Frontend: refetch averías después de conversión exitosa para actualizar UI
- E2E test: two concurrent supervisors convert same avería, verify only 1 OT created

**Owner:** Backend Dev
**Timeline:** Story 2.3 implementation
**Status:** Planned
**Verification:** Tests 2.3-API-003 y 2.3-E2E-020 must pass (unique constraint enforced)

---

## Assumptions and Dependencies

### Assumptions

1. Epic 2 starts after Epic 1 (Autenticación y PBAC) is complete - PBAC system already implemented
2. SSE infrastructure is available from Epic 0/1 (heartbeat every 30s)
3. Asset hierarchy (5 levels) is seeded from Epic 4 or via CSV import
4. Supervisores and técnicos already exist in system with capabilities assigned
5. Kanban de 8 columnas (Epic 3) is partially implemented para "Pendiente" column

### Dependencies

1. **BLK-001**: Test Data Seeding APIs - Backend Dev - Sprint 2.1 Week 1
2. **BLK-002**: SSE Mock Layer - Backend Dev + QA - Sprint 2.1 Week 2
3. **BLK-003**: Multi-Device Sync Conflict Strategy - Backend Dev - Sprint 2.2
4. **BLK-004**: Observability Infrastructure - Backend Dev - Phase 1 MVP (already available)
5. **BLK-005**: Performance Baseline Infrastructure - Backend Dev + DevOps - Sprint 2.1 Week 1

### Risks to Plan

- **Risk**: R-001 (Performance) may require additional database optimization beyond indexing
  - **Impact**: Story 2.1 deployment delayed if >200ms P95 not achievable
  - **Contingency**: Implement search debouncing (300ms) para reducir frecuencia de queries, consider Elasticsearch para 10K+ assets

- **Risk**: R-004 (Security) PBAC bypass may require architecture change if middleware not applied correctly
  - **Impact**: Critical security vulnerability blocks Epic 2 release
  - **Contingency**: Dedicated security sprint para PBAC hardening, external security review

- **Risk**: R-002 (SSE) mock layer may not be ready in time, tests become flaky
  - **Impact**: Test execution time increases (waiting 30s for real SSE), CI pipeline slows down
  - **Contingency**: Use polling fallback en tests, flag tests as "slow" suite run nightly only

---

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests (separate workflow; not auto-run).
- Run `*automate` for broader coverage once implementation exists.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: ____________ Date: ________
- [ ] Tech Lead: ____________ Date: ________
- [ ] QA Lead: ____________ Date: ________

**Comments:**


---

---

## Interworking & Regression

| Service/Component | Impact         | Regression Scope                |
| ----------------- | -------------- | ------------------------------- |
| **Epic 1: PBAC System** | Critical dependency | All existing PBAC tests must pass (can_view_all_ots capability) |
| **Epic 0: SSE Infrastructure** | Real-time sync | SSE heartbeat, connection, reconnection tests must pass |
| **Epic 3: Kanban OTs** | Integration | "Pendiente" column must receive OTs from Story 2.3 (convert flow) |
| **Epic 4: Asset Hierarchy** | Data source | Asset navigation, 5-level hierarchy tests must pass (search uses this data) |

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework (probability × impact = score 1-9)
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection (E2E vs API vs Unit)
- `test-priorities-matrix.md` - P0-P3 prioritization rules

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd/index.md`
- Epic: `_bmad-output/planning-artifacts/epics.md` (Epic 2: Gestión de Averías y Reportes Rápidos)
- Architecture: `_bmad-output/planning-artifacts/architecture/index.md`
- System-Level Test Design: `_bmad-output/test-artifacts/test-design-qa.md`

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 5.0 (Step-File Architecture)
