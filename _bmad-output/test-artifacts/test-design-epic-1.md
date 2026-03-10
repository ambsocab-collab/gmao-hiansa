---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-10'
epic_num: '1'
epic_title: 'Autenticación y Gestión de Usuarios (PBAC)'
total_risks: 13
high_priority_count: 4
top_categories: 'SEC (Security)'
p0_count: 19
p0_hours: '25-40'
p1_count: 14
p1_hours: '15-25'
p2p3_count: 3
p2p3_hours: '5-10'
total_hours: '45-75'
total_days: '6-10'
design_level: 'full'
mode: 'epic-level'
---

# Test Design: Epic 1 - Autenticación y Gestión de Usuarios (PBAC)

**Date:** 2026-03-10
**Author:** Bernardo
**Status:** Draft
**Epic:** 1 - Autenticación y Gestión de Usuarios (PBAC)

---

## Executive Summary

**Scope:** Full test design for Epic 1 - Autenticación y Gestión de Usuarios (PBAC)

**Epic Goal:** Los usuarios pueden registrarse, hacer login, y los administradores pueden gestionar usuarios con control de acceso granular basado en 15 capacidades (PBAC - Permission-Based Access Control).

**Stories:**
- Story 1.1: Login, Registro y Perfil de Usuario
- Story 1.2: Sistema PBAC con 15 Capacidades
- Story 1.3: Etiquetas de Clasificación y Organización

**Risk Summary:**

- Total risks identified: **13**
- High-priority risks (≥6): **4**
- Critical categories: **SEC (Security)** - 7/13 riesgos son de seguridad

**Coverage Summary:**

- P0 scenarios: **19** (25-40 hours)
- P1 scenarios: **14** (15-25 hours)
- P2/P3 scenarios: **3** (5-10 hours)
- **Total effort**: **36 tests**, **45-75 hours** (~**6-10 days**)

---

## Not in Scope

| Item       | Reasoning      | Mitigation            |
| ---------- | -------------- | --------------------- |
| **Mantenimiento Reglamentario** | Phase 1.5 feature (primer módulo post-deploy) | Validado manualmente por equipo de seguridad certificado |
| **Integración ERP** | Phase 3+ feature (expansión futura) | Manual hasta Phase 3 |
| **Soporte Firefox/Safari** | NFR: Solo Chrome/Edge soportados | Documentado en requisitos |
| **Internacionalización (i18n)** | MVP: Solo castellano | Aceptable para empresa local |

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ---------- | ------- | -------- |
| R-EP1-001 | SEC | Implementación incorrecta de PBAC permite escalación de privilegios | 2 | 3 | **6** | Security testing exhaustivo, code review de middleware de autorización | Backend Dev + QA | Phase 1 MVP |
| R-EP1-002 | SEC | forcePasswordReset bypass permite acceso sin cambiar contraseña | 2 | 3 | **6** | E2E tests: verificar redirección forzada, bloqueo de navegación | QA | Story 1.1 |
| R-EP1-009 | SEC | Access denied no funciona correctamente para módulos no autorizados (NFR-S76) | 2 | 3 | **6** | E2E test suite: probar access denied para cada una de las 15 capabilities | QA | Story 1.2 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ---------- | ------- |
| R-EP1-003 | SEC | Rate insuficiente en login permite brute force efectivo | 2 | 2 | 4 | Validar rate limiting después de 5 intentos (15min block) | Backend Dev |
| R-EP1-004 | SEC | Default capability incorrecta otorga más permisos | 1 | 3 | 3 | Unit test: verificar valor por defecto | Dev |
| R-EP1-005 | SEC | Etiquetas confundidas con capabilities (NFR-S67-A/B) | 2 | 2 | 4 | Tests claros: verificar que etiquetas NO otorgan capacidades | QA |
| R-EP1-007 | DATA | Soft delete falla, usuario puede hacer login post-eliminación | 1 | 3 | 3 | Integration test: eliminar usuario, intentar login | QA |
| R-EP1-011 | SEC | Navegación muestra módulos sin authorization (NFR-S74/S75) | 2 | 2 | 4 | E2E test: crear usuario sin capabilities, verificar módulos ocultos | QA |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ------------- | ----------- | ------ | ----- | ------- |
| R-EP1-006 | BUS | Usuario no puede editar su propio perfil (NFR-S69-A) | 1 | 2 | 2 | Monitor |
| R-EP1-008 | OPS | Historial de actividad últimos 6 meses incompleto | 1 | 2 | 2 | Monitor |
| R-EP1-010 | BUS | Admin inicial no tiene las 15 capabilities (NFR-S68-C) | 1 | 2 | 2 | Monitor |
| R-EP1-012 | TECH | Límite de 20 etiquetas no se valida | 1 | 1 | 1 | Monitor |
| R-EP1-013 | BUS | Eliminar etiqueta no remueve visualmente de usuarios | 1 | 2 | 2 | Monitor |

### Risk Category Legend

- **SEC**: Security (access controls, auth, data exposure)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **OPS**: Operations (deployment, config, monitoring)
- **TECH**: Technical/Architecture (flaws, integration, scalability)

---

## Entry Criteria

- [x] Requirements and assumptions agreed upon by QA, Dev, PM
- [x] Test environment provisioned and accessible
- [x] Test data available or factories ready (Epic 0 factories exist)
- [ ] Feature deployed to test environment
- [ ] Test Data Seeding APIs implementadas (BLK-001 del system-level)

## Exit Criteria

- [ ] All P0 tests passing (100%)
- [ ] All P1 tests passing (≥95%, failures triaged)
- [ ] No open high-priority / high-severity bugs
- [ ] Test coverage agreed as sufficient (Security: 100%, PBAC: 100%)
- [ ] Las 15 capacidades del sistema PBAC funcionan correctamente sin exponer datos sensibles

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core functionality + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| **Login exitoso** | E2E | R-EP1-001 | 1 | QA | Core authentication flow |
| **Login fallido + rate limiting** | E2E | R-EP1-003 | 2 | QA | Brute force protection (5 intentos → 15min block) |
| **Password reset forzado** | E2E | R-EP1-002 | 3 | QA | Redirección forzada, navegación bloqueada |
| **Admin inicial capabilities** | E2E | R-EP1-010 | 1 | QA | Primer usuario tiene 15 capabilities |
| **Usuario nuevo default capability** | API | R-EP1-004 | 1 | QA | Solo can_create_failure_report por defecto |
| **Asignación de capabilities** | E2E | R-EP1-001 | 2 | QA | Admin asigna/remueve capabilities |
| **Access denied (15 capabilities)** | E2E | R-EP1-009 | 5 | QA | Validar access denied para cada capability |
| **Modo lectura sin capability** | E2E | R-EP1-009 | 1 | QA | Usuario ve modo lectura, no puede editar |
| **Navegación filtrada por capabilities** | E2E | R-EP1-011 | 2 | QA | Módulos ocultos + access denied por URL |
| **Etiquetas NO otorgan capabilities** | E2E | R-EP1-005 | 2 | QA | Verificar independencia etiquetas-capabilities |
| **PBAC middleware** | Integration | R-EP1-001 | 1 | QA | Middleware deniega acceso correctamente |

**Total P0**: **19 tests**, **~25-40 hours**

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| **Validación de registro** | API | - | 1 | QA | Input validation (422 sin nombre/email) |
| **Edición de perfil propio** | E2E | R-EP1-006 | 2 | QA | NFR-S69-A |
| **Cambio password desde perfil** | E2E | - | 1 | QA | User self-service |
| **Edición de usuario por admin** | API | R-EP1-006 | 1 | QA | NFR-S69-A |
| **Soft delete de usuario** | E2E | R-EP1-007 | 1 | QA | Soft delete validation |
| **Checkboxes de capabilities UI** | E2E | - | 1 | QA | NFR-S68-UI |
| **Auditoría de capabilities** | API | - | 1 | QA | Audit trail |
| **Sesión actual actualizada** | E2E | - | 1 | QA | Self-edit |
| **Validación de 15 capabilities en DB** | API | - | 1 | QA | Data validation |
| **Crear etiqueta** | E2E | - | 1 | QA | Basic CRUD |
| **Validar límite 20 etiquetas** | API | R-EP1-012 | 1 | QA | NFR-S59 |
| **Asignar múltiples etiquetas** | E2E | - | 1 | QA | NFR-S62 |
| **Etiquetas en perfil** | E2E | - | 1 | QA | Visual validation (badges) |
| **Eliminar etiqueta** | E2E | R-EP1-013 | 1 | QA | Cascade delete |
| **Mensaje clarificador** | E2E | - | 1 | QA | UX clarity |

**Total P1**: **14 tests**, **~15-25 hours**

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| **Historial de actividad (6 meses)** | E2E | R-EP1-008 | 1 | QA | NFR-S72 |
| **Historial de trabajos completo** | E2E | R-EP1-008 | 1 | QA | NFR-S72-C |
| **Filtro por rango de fechas** | E2E | - | 1 | QA | UX feature |

**Total P2**: **3 tests**, **~5-10 hours**

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| *Ninguno para MVP* | - | 0 | - | Exploratory testing manual |

**Total P3**: **0 tests**, **0 hours**

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [x] Login exitoso (30s)
- [x] Login fallido + mensaje error (30s)
- [x] Admin inicial tiene 15 capabilities (30s)
- [x] Usuario nuevo default capability (30s)
- [x] Access denied para capability faltante (1min)
- [x] Etiquetas NO otorgan capabilities (1min)
- [x] Password reset forzado (1min)
- [x] Navegación filtrada por capabilities (30s)

**Total**: **8 scenarios**, **~5 min**

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [x] Login exitoso (E2E)
- [x] Login fallido + rate limiting (E2E)
- [x] Password reset forzado + navegación bloqueada (E2E)
- [x] Admin inicial capabilities (E2E)
- [x] Usuario nuevo default capability (API)
- [x] Asignación de capabilities (E2E)
- [x] Access denied 15 capabilities (E2E)
- [x] Modo lectura sin capability (E2E)
- [x] Navegación filtrada + URL directa (E2E)
- [x] Etiquetas ≠ capabilities (E2E)
- [x] PBAC middleware (Integration)

**Total**: **19 scenarios**, **~10 min**

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [x] Validación de registro (API)
- [x] Edición de perfil propio (E2E)
- [x] Cambio password desde perfil (E2E)
- [x] Edición de usuario por admin (API)
- [x] Soft delete de usuario (E2E)
- [x] Checkboxes de capabilities UI (E2E)
- [x] Auditoría de capabilities (API)
- [x] Sesión actual actualizada (E2E)
- [x] Validación de 15 capabilities en DB (API)
- [x] Crear/eliminar etiqueta (E2E)
- [x] Validar límite 20 etiquetas (API)
- [x] Asignar múltiples etiquetas (E2E)
- [x] Etiquetas en perfil (E2E)
- [x] Mensaje clarificador (E2E)

**Total**: **14 scenarios**, **~20 min**

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [x] Historial de actividad 6 meses (E2E)
- [x] Historial de trabajos completo (E2E)
- [x] Filtro por rango de fechas (E2E)

**Total**: **3 scenarios**, **~10 min**

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| ---------- | ------- | ---------- | ----------- | ----- |
| P0 | 19 | 1.5-2.0 | **25-40** | Security-critical, multiple scenarios |
| P1 | 14 | 1.0-1.5 | **15-25** | Standard coverage |
| P2 | 3 | 1.5-3.0 | **5-10** | Complex filtering scenarios |
| P3 | 0 | 0.25 | **0** | Exploratory manual |
| **Total** | **36** | **-** | **45-75** | **~6-10 days for 1 QA** |

### Prerequisites

**Test Data:**
- User factory (faker-based, auto-cleanup) - **Ya existe** (Epic 0)
- Capability factory (15 capabilities PBAC)
- Etiqueta factory (hasta 20 etiquetas)
- Fixture: Usuario con forcePasswordReset=true
- Fixture: Admin con todas las capabilities

**Tooling:**
- Playwright (E2E, API) - **Ya configurado** (Epic 0)
- bcrypt hash validation (Unit) - **Ya existe** (Epic 0)
- Auth middleware testing (Integration) - **Parcialmente existe** (Epic 0)

**Environment:**
- Test database con seed data (Epic 0)
- /api/test-data endpoints (BLK-001 - Pending)
- SSE mock layer (BLK-002 - Pending)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Security scenarios (SEC category)**: 100%
- **PBAC authorization paths**: 100%
- **Critical authentication flows**: ≥90%
- **Business logic**: ≥80%
- **Edge cases**: ≥70%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category) pass 100%
- [ ] Access denied funciona para las 15 capabilities
- [ ] forcePasswordReset bypass no es posible

---

## Mitigation Plans

### R-EP1-001: Implementación incorrecta de PBAC permite escalación de privilegios (Score: 6)

**Mitigation Strategy:**
1. Code review exhaustivo de middleware de autorización
2. E2E test suite: validar cada una de las 15 capabilities
3. Integration test: validar PBAC middleware deniega acceso correctamente
4. Security testing: probar escalación de privilegios (usuario sin capability intenta acceder a recurso protegido)

**Owner:** Backend Dev + QA
**Timeline:** Phase 1 MVP
**Status:** Planned
**Verification:**
- [ ] P0 tests pass (access denied para 15 capabilities)
- [ ] Integration test: PBAC middleware
- [ ] Security review firmado por Tech Lead

### R-EP1-002: forcePasswordReset bypass permite acceso sin cambiar contraseña (Score: 6)

**Mitigation Strategy:**
1. E2E test: verificar redirección forzada a /cambiar-password
2. E2E test: verificar bloqueo de navegación (no puede acceder a otras rutas)
3. E2E test: verificar que al cambiar contraseña, forcePasswordReset=false

**Owner:** QA
**Timeline:** Story 1.1
**Status:** Planned
**Verification:**
- [ ] P0-E2E-004: Redirección forzada
- [ ] P0-E2E-005: Navegación bloqueada
- [ ] P0-E2E-006: Cambio password exitoso

### R-EP1-009: Access denied no funciona correctamente para módulos no autorizados (Score: 6)

**Mitigation Strategy:**
1. E2E test suite: probar access denied para cada una de las 15 capabilities
2. E2E test: verificar modo lectura cuando usuario no tiene capability de edición
3. E2E test: verificar que módulos sin capabilities no aparecen en navegación
4. E2E test: verificar access denied cuando usuario accede por URL directa

**Owner:** QA
**Timeline:** Story 1.2
**Status:** Planned
**Verification:**
- [ ] P0-E2E-004 a P0-E2E-008: Access denied suite
- [ ] P0-E2E-007 a P0-E2E-008: Navegación filtrada

---

## Assumptions and Dependencies

### Assumptions

1. Epic 0 está **GREEN** con 106 tests passing - factories, auth, SSE infrastructure disponibles
2. Test Data Seeding APIs (BLK-001) serán implementadas antes de Epic 1 QA
3. SSE mock layer (BLK-002) será implementada para tests de tiempo real
4. Observability infrastructure (BLK-004) estará disponible para debugging

### Dependencies

1. **BLK-001: Test Data Seeding APIs** - Backend Dev - Phase 1 pre-implementation
2. **BLK-002: SSE Mock Layer** - Backend Dev + QA - Phase 1 pre-implementation
3. **PBAC middleware implementation** - Backend Dev - Story 1.2
4. **15 capabilities seed data** - Backend Dev - Story 1.2

### Risks to Plan

- **Risk**: BLK-001 y BLK-002 no están completos al inicio de Epic 1 QA
  - **Impact**: Tests serán más lentos (setup manual vía UI en lugar de API seeding)
  - **Contingency**: Priorizar BLK-001 y BLK-002, o usar factories de Epic 0 como workaround

- **Risk**: PBAC middleware tiene bugs en implementación inicial
  - **Impact**: Muchos P0 tests fallarán, bloqueando Epic 1
  - **Contingency**: Code review temprano de PBAC middleware, testing iterativo durante desarrollo

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope |
| ----------------- | ------ | ---------------- |
| **Epic 0: Auth infrastructure** | Epic 1 usa bcrypt, NextAuth, factories de Epic 0 | Tests de Epic 0 deben seguir pasando (106 tests GREEN) |
| **Epic 0: SSE infrastructure** | Epic 1 usa SSE para notificaciones de cambios en usuarios | SSE tests de Epic 0 (Story 0.4) |
| **Epic 2: Averías** | Depende de capabilities can_create_failure_report | Validar que usuarios sin capability no pueden reportar averías |
| **Epic 4: Activos** | Depende de capability can_manage_assets | Validar access denied para usuarios sin capability |

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- **PRD:** `{output_folder}/planning-artifacts/archive/prd.md`
- **Epic:** `{output_folder}/planning-artifacts/epics.md` (Epic 1)
- **Architecture:** `{output_folder}/planning-artifacts/archive/architecture.md`
- **System-level Test Design (Architecture):** `{test_artifacts}/test-design-architecture.md`
- **System-level Test Design (QA):** `{test_artifacts}/test-design-qa.md`

### Test ID Format

`{EPIC}.{STORY}-{LEVEL}-{SEQ}`

Examples:
- `1.1-E2E-001`: Story 1.1, E2E test #1
- `1.2-API-001`: Story 1.2, API test #1
- `1.3-INT-001`: Story 1.3, Integration test #1

---

## Follow-on Workflows (Manual)

- Run `*atdd` para generar P0 tests fallidos (separate workflow; not auto-run).
- Run `*automate` para broader coverage una vez que la implementación existe.
- Run `*trace` para validar traceability matrix antes de gate decision.

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 5.0 (Step-File Architecture)
**Mode**: Epic-Level
**Date**: 2026-03-10
