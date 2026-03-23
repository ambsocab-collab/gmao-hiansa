---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-23'
mode: 'epic-level'
epic_num: '3'
---

# Test Design: Epic 3 - Órdenes de Trabajo (Kanban Multi-Dispositivo)

**Date:** 2026-03-23
**Author:** Bernardo
**Status:** Draft

---

## Executive Summary

**Scope:** Epic-level test design para Epic 3: Órdenes de Trabajo (Kanban Multi-Dispositivo)

**Epic Goal:** Los técnicos pueden ver y actualizar OTs asignadas, los supervisores pueden gestionar el Kanban de 8 columnas con drag & drop, y todo se sincroniza en tiempo real entre dispositivos y vistas.

**Risk Summary:**

- Total riesgos identificados: 9
- High-priority risks (≥6): 7 (2 BLOCKERS score=9, 5 MITIGATE score 6-8)
- Critical categories: PERFORMANCE, DATA

**Coverage Summary:**

- P0 scenarios: 34 (60-80 hours) - Critical paths, race conditions, SSE sync
- P1 scenarios: 23 (40-55 hours) - Core features, multi-device, mobile
- P2/P3 scenarios: 11 (15-25 hours) - Edge cases, UX polish
- Unit scenarios: 12 (6-10 hours) - Business logic validation
- **Total effort**: 121-175 hours (~3-4 semanas con 1 QA full-time + Dev support)

**Test Distribution:**
- E2E tests: 45 (56%) - User journeys, drag & drop, multi-device sync
- Integration tests: 11 (14%) - Race conditions, PBAC, SSE, filters (requieren autenticación NextAuth)
- Unit tests: 12 (15%) - Business logic: state transitions, stock calculations, filters
- Integration (antes API): Reemplazados por Integration tests debido a autenticación NextAuth con JWT + CSRF (ver `tests/api/README.md`)

---

## Notas sobre Estrategia de Tests

### Por qué Integration Tests en lugar de API Tests

**Problema:** NextAuth.js con estrategia JWT requiere:
1. CSRF token fresco de `/api/auth/csrf`
2. Login a `/api/auth/callback/credentials` con form data
3. Extraer cookies de la respuesta
4. Pasar cookies en requests subsiguientes

Esto hace que los tests API puros sean **complejos y propensos a errores**.

**Solución:** Usar Integration tests (Vitest) que:
- Manejan autenticación completa en el setup
- Simulan requests HTTP con contexto de autenticación
- Son más rápidos que E2E pero más completos que API puro
- Pueden validar PBAC, endpoints autenticados, y lógica de servidor

**Referencia:** `tests/api/README.md` - Documenta el leccionario aprendido de Epic 2

### Por qué Unit Tests para Business Logic

**Ventajas:**
- Ejecución ultra-rápida (~10-50ms por test)
- Aislamiento completo (sin dependencias externas)
- Feedback inmediato al desarrollador
- Validan lógica compleja: cálculos de stock, transiciones de estado, filtros

**Scope:**
- **NO** probar integración con DB, API, UI
- **SÍ** probar funciones puras: validaciones, cálculos, transformaciones

---

---

## Not in Scope

| Item | Reasoning | Mitigation |
|------|-----------|------------|
| **Integración ERP** | Phase 3+ feature | Manual testing hasta Phase 3 |
| **Soporte Firefox/Safari** | NFR: Solo Chrome/Edge soportados | Documentado en requisitos |
| **Internacionalización (i18n)** | MVP: Solo castellano | Aceptable para empresa local |
| **Mantenimiento Reglamentario** | Phase 1.5 feature | Validado manualmente por equipo de seguridad |
| **API tests puros** | NextAuth requiere JWT + CSRF tokens (ver `tests/api/README.md`) | Usar Integration tests con autenticación completa |
| **Unit tests para UI components** | Fuera de alcance de Epic 3 | Delegar a equipo de Frontend |

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|-------------|--------|-------|-----------|-------|----------|
| **R-101** | PERF | SSE sync failure Kanban ↔ Listado - Data inconsistency across views | 3 | 3 | **9** 🔴 | Implementar versioning de entidades + last-write-wins; Test de sincronización bidireccional | Backend Dev | Pre-implementation |
| **R-105** | DATA | Multi-device sync strategy undefined - BLK-003 pending | 2 | 3 | **6** 🟠 | Completar BLK-003 (multi-device sync conflict strategy); Test de sync: Desktop modifica OT, móvil ve cambio | Architect + Backend Dev | Pre-implementation |
| **R-102** | DATA | Drag & drop race conditions - Two users move same OT simultaneously | 3 | 3 | **8** 🟠 | Optimistic locking con version field; Conflict detection: "OT modificada por otro usuario"; Test de 2 usuarios arrastran misma OT | Backend Dev + QA | Sprint 1 |
| **R-103** | DATA | Stock update race condition - Multiple technicians use same part | 3 | 3 | **8** 🟠 | Database transactions con SELECT FOR UPDATE; Stock validation antes de commit; Test de 2 usuarios paralelos | Backend Dev | Sprint 1 |
| **R-104** | PERF | SSE notification delay >30s - Users don't receive OT updates | 2 | 3 | **6** 🟠 | SSE heartbeat cada 30s; Retry mechanism con exponential backoff; Test de timeout: simular SSE down | Backend Dev | Sprint 1 |
| **R-107** | SEC | Asignación múltiple sin validación PBAC - Unauthorized assignment | 2 | 2 | **4** 🟡 | PBAC test para can_assign_technicians (P0); API test: POST /api/ots/{id}/assign sin capability → 403 | Backend Dev + QA | Sprint 1 |
| **R-106** | PERF | Kanban performance 100+ OTs - Response >500ms | 2 | 2 | **4** 🟡 | Virtual scrolling para columnas con muchas OTs; Performance test: 100 OTs, medir render time | Frontend Dev | Sprint 2 |

### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|-------------|--------|-------|-----------|-------|
| **R-108** | BUS | Mobile swipe interference - UX confusion on mobile | 2 | 2 | **4** | Test E2E en móvil: validar swipe vs scroll; Asegurar touch targets ≥44x44px | Frontend Dev + QA |
| **R-109** | DATA | Filtros combinados AND incorrecto - Combined filters broken | 2 | 1 | **2** | Test de filtros combinados (P1); Validar lógica AND en backend | Backend Dev |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Entry Criteria

- [x] Requirements and assumptions agreed upon by QA, Dev, PM
- [ ] Test environment provisioned and accessible (Local: Supabase Docker, CI: GitHub Actions, Staging: Vercel)
- [ ] Test data factories ready (User factory, Asset factory, OT factory, Repuesto factory)
- [ ] Pre-implementation blockers resolved:
  - [ ] BLK-001: Test data seeding APIs implemented
  - [ ] BLK-002: SSE mock layer available
  - [ ] BLK-003: Multi-device sync conflict strategy implemented
  - [ ] BLK-004: Observability infrastructure (logs, metrics, tracing)
  - [ ] BLK-005: Performance baseline infrastructure (k6 load testing)
- [ ] Feature deployed to test environment (Staging environment updated with latest code)
- [ ] Playwright configured (playwright.config.ts con baseURL, workers=4-8)

## Exit Criteria

- [ ] All P0 tests passing (34 tests, 100% pass rate mandatory)
- [ ] All P1 tests passing (≥95% pass rate, failures triaged and accepted)
- [ ] No open high-priority / high-severity bugs
- [ ] Test coverage agreed as sufficient (≥80% coverage target)
- [ ] High-risk mitigations complete before release:
  - [ ] R-101 (SSE sync) resuelto y probado
  - [ ] R-102 (Drag & drop race) mitigado con optimistic locking
  - [ ] R-103 (Stock race) mitigado con DB transactions
  - [ ] R-105 (Multi-device sync) completado (BLK-003)
  - [ ] R-107 (PBAC security) validado

## Project Team

**Roles TBD** - Asignar responsables:

| Name | Role | Testing Responsibilities |
|------|------|------------------------|
| TBD | QA Lead | Test strategy, E2E/API test implementation, test review |
| TBD | Dev Lead | Unit tests, integration test support, testability hooks |
| TBD | PM | Requirements clarification, acceptance criteria, UAT sign-off |
| TBD | Architect | Testability review, NFR guidance, environment provisioning |

---

## Test Coverage Plan

### Story 3.1: Kanban de 8 Columnas con Drag & Drop (20 tests)

**P0 Tests (9) - Critical Path + High Risk:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Supervisor ve Kanban de 8 columnas en desktop | E2E | - | 1 | QA | data-testid="ot-kanban-board" |
| Kanban muestra columnas en orden correcto con colores | E2E | - | 1 | QA | Por Revisar #6B7280, Por Aprobar #F59E0B, etc. |
| OT cards muestran información completa | E2E | - | 1 | QA | Número, título, equipo, tags, técnicos, fecha |
| Drag & drop actualiza estado de OT en <1s | E2E | R-102 | 1 | QA | NFR-S96 <1s requirement |
| SSE enviado a todos los clientes tras drag & drop | E2E | R-101 | 1 | QA | R-002 SSE notification <30s |
| Auditoría logged: "OT {id} movida de {estadoAnterior} a {estadoNuevo}" | Integration | - | 1 | QA | Audit trail requirement |
| OT state change endpoint valida optimistic locking | Integration | R-102 | 1 | QA | Race condition mitigation |
| OTs preventivas muestran etiqueta "Preventivo" verde | E2E | - | 1 | QA | NFR-S11-B |
| OTs correctivas muestran etiqueta "Correctivo" rojizo | E2E | - | 1 | QA | NFR-S11-B |

**P1 Tests (7) - Important Features:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Tablet: 2 columnas visibles con swipe horizontal | E2E | - | 1 | QA | Responsive design |
| Móvil: 1 columna visible con swipe, OT cards simplificadas | E2E | - | 1 | QA | Mobile-first UX (NFR-A3) |
| Móvil: touch en OT card abre modal (no drag & drop) | E2E | - | 1 | QA | Touch target 44x44px |
| Modal tiene botones: "Iniciar", "Completar", "Ver Detalles" | E2E | - | 1 | QA | Modal actions |
| Toggle Kanban ↔ Listado mantiene sincronización | E2E | R-101 | 1 | QA | NFR-S31 sync real-time |
| SSE heartbeat validation - reconexión automática | Integration | R-104 | 1 | QA | SSE retry mechanism |
| Preferencia de vista guardada por usuario | E2E | - | 1 | QA | User preference persistence |

**P2 Tests (4) - Edge Cases:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Count badges por columna: "En Progreso (8)" | E2E | 1 | QA | Badge display |
| Panel lateral KPIs colapsable visible | E2E | 1 | QA | KPI panel |
| Indicador de columnas visibles: "1-2 de 8" (tablet) | E2E | 1 | QA | Column indicator |
| Toggle Kanban ↔ Listado data-testid="vista-toggle" | E2E | 1 | QA | Testability attribute |

**Unit Tests (3) - Business Logic:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| OT state transition machine validates all valid transitions | Unit | 1 | Dev | Asignada → En Progreso → Completada → Por Revisar → Por Aprobar |
| Column color mapping function returns correct hex codes | Unit | 1 | Dev | Por Revisar #6B7280, Por Aprobar #F59E0B, etc. |
| OT card formatting function formats all required fields | Unit | 1 | Dev | Número, título, equipo, tags, técnicos, fecha |

**Total Story 3.1:** 23 tests - P0: 9, P1: 7, P2: 4, Unit: 3 (~35-45 hours)

---

### Story 3.2: Gestión de OTs Asignadas (Mis OTs) (18 tests)

**P0 Tests (10) - Critical Path + High Risk:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Técnico accede a /mis-ots ve lista donde está asignado | E2E | - | 1 | QA | data-testid="mis-ots-lista" |
| Móvil: bottom nav tab "Mis OTs" visible | E2E | - | 1 | QA | Mobile navigation |
| Touch en OT asignada abre modal con detalles | E2E | - | 1 | QA | Modal interaction |
| Botón "Iniciar OT" cambia estado a "En Progreso" en <1s | E2E | - | 1 | QA | State change performance |
| SSE enviado a todos los asignados en <30s | E2E | R-104 | 1 | QA | NFR-S19 <30s requirement |
| Agregar repuesto usado actualiza stock en tiempo real <1s | Integration | R-103 | 1 | QA | NFR-S16 stock update |
| Stock update usa database transaction (race condition test) | Integration | R-103 | 1 | QA | Race condition validation |
| Completar OT requiere confirmación: "¿Completar OT #{numero}?" | E2E | - | 1 | QA | Confirmation dialog |
| Operario confirma si reparación funciona | E2E | - | 1 | QA | NFR-S5 verification |
| Comentarios agregados con timestamp | E2E | - | 1 | QA | NFR-S106 |

**P1 Tests (6) - Important Features:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Dropdown de repuestos muestra: nombre, stock, ubicación | E2E | - | 1 | QA | Repuesto selection |
| Lista de repuestos usados actualizada en tiempo real | E2E | - | 1 | QA | Real-time updates |
| No se envía notificación a can_manage_stock (actualizaciones silenciosas) | E2E | - | 1 | QA | NFR-S16 silent updates |
| Adjuntar fotos antes/después de reparación | E2E | - | 2 | QA | NFR-S107 photo upload |
| Fotos subidas a storage y URLs almacenadas | E2E | - | 1 | QA | Storage integration |
| Preview visible en modal de detalles | E2E | - | 1 | QA | Photo preview |

**P2 Tests (2) - Edge Cases:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Comentarios visibles en modal de detalles | E2E | 1 | QA | Comment display |
| Notificación SSE enviada a otros asignados | E2E | 1 | QA | Multi-user notification |

**Unit Tests (3) - Business Logic:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Stock calculation function validates sufficient stock | Unit | 1 | Dev | Validates stock >= quantity before allowing use |
| Repuesto validation function checks all required fields | Unit | 1 | Dev | nombre, stock, ubicación required |
| OT completion validation function checks required fields | Unit | 1 | Dev | comentarios, confirmación operatorio required |

**Total Story 3.2:** 21 tests - P0: 10, P1: 6, P2: 2, Unit: 3 (~30-40 hours)

---

### Story 3.3: Asignación de Técnicos y Proveedores (14 tests)

**P0 Tests (7) - Critical Path + Security:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Supervisor puede seleccionar 1-3 técnicos internos | E2E | - | 1 | QA | NFR-S17 |
| Supervisor puede seleccionar 1 proveedor externo | E2E | - | 1 | QA | NFR-S18 |
| Todos los técnicos asignados reciben notificación SSE <30s | E2E | R-104 | 1 | QA | NFR-S19 |
| Cualquiera de los asignados puede iniciar la OT | E2E | - | 1 | QA | NFR-S19-A |
| Cualquiera de los asignados puede agregar repuestos usados | E2E | - | 1 | QA | Multi-user collaboration |
| Cualquiera de los asignados puede completar la OT | E2E | - | 1 | QA | Multi-user completion |
| Asignación sin capability can_assign_technicians retorna 403 | Integration | R-107 | 1 | QA | PBAC security |

**P1 Tests (5) - Important Features:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Filtros disponibles: habilidades, ubicación, disponibilidad | E2E | 1 | QA | Technician filters |
| Filtro por habilidades muestra técnicos relevantes | E2E | 1 | QA | Skill-based filtering |
| Columna "Asignaciones" muestra distribución: "2 técnicos / 1 proveedor" | E2E | 1 | QA | NFR-S21 distribution |
| Supervisor recibe notificación cuando proveedor marca OT completada | E2E | 1 | QA | Provider notification |
| Supervisor debe confirmar recepción de equipo reparado | E2E | 1 | QA | NFR-S24-A confirmation |

**P2 Tests (2) - Edge Cases:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Filtro técnicos por ubicación (Planta HiRock, Planta Ultra, Taller, Almacén) | E2E | 1 | QA | Location filter |
| Indicador visual de sobrecarga: técnico con 5+ OTs asignadas | E2E | 1 | QA | Overload indicator |

**Unit Tests (3) - Business Logic:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Assignment limit validation function validates 1-3 technicians or 1 provider | Unit | 1 | Dev | NFR-S17: 1-3 technicians OR 1 provider, not both |
| Provider assignment logic function validates provider availability | Unit | 1 | Dev | Validates provider exists and is active |
| Distribution formatting function returns "X técnicos / Y proveedor" | Unit | 1 | Dev | NFR-S21: Display format for assignment count |

**Total Story 3.3:** 17 tests - P0: 7, P1: 5, P2: 2, Unit: 3 (~25-35 hours)

---

### Story 3.4: Vista de Listado con Filtros y Sync Real-time (16 tests)

**P0 Tests (8) - Critical Path:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Supervisor ve tabla con todas las OTs de la organización | E2E | - | 1 | QA | NFR-S21 |
| Tabla tiene columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones | E2E | - | 1 | QA | Table structure |
| Paginación: 100 OTs por página | E2E | - | 1 | QA | NFR-SC4 |
| Filtro por estado: dropdown con 8 estados | E2E | - | 1 | QA | State filter |
| Filtro por técnico: búsqueda predictiva de usuarios | E2E | - | 1 | QA | Technician search |
| Filtro por fecha: range picker (fecha inicio, fecha fin) | E2E | - | 1 | QA | Date range filter |
| Filtro por tipo: Preventivo/Correctivo | E2E | - | 1 | QA | NFR-S11-A |
| Filtros combinados con AND lógica funcionan correctamente | Integration | R-109 | 1 | QA | NFR-S27 combined filters |

**P1 Tests (5) - Important Features:**

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|-------------|------------|-----------|------------|-------|-------|
| Ordenar por cualquier columna: ascendente/descendente toggle | E2E | - | 1 | QA | NFR-S28 sorting |
| Indicador visual de columna ordenada (icono ↑/↓) | E2E | - | 1 | QA | Sort indicator |
| Sorting mantenido cuando cambio de página | E2E | - | 1 | QA | Sort persistence |
| Mismos filtros y sorting aplicados en Kanban tras toggle | E2E | R-101 | 1 | QA | NFR-S30 |
| Sincronización en tiempo real entre Kanban y Listado | E2E | R-101 | 1 | QA | NFR-S31 sync |

**P2 Tests (3) - Edge Cases:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Modal informativo muestra detalles completos | E2E | 1 | QA | NFR-S24 |
| Modal puede cerrarse con click en "X", ESC key, o click fuera | E2E | 1 | QA | Modal close interaction |
| OT creada desde avería muestra link a avería original | E2E | 1 | QA | Avería reference |

**Unit Tests (3) - Business Logic:**

| Requirement | Test Level | Test Count | Owner | Notes |
|-------------|------------|------------|-------|-------|
| Filter combination function applies AND logic correctly | Unit | 1 | Dev | NFR-S27: All filters combined with AND |
| Sort function handles ascending/descending toggle correctly | Unit | 1 | Dev | NFR-S28: Toggle sort direction per column |
| Pagination calculation function returns correct page count | Unit | 1 | Dev | NFR-SC4: 100 OTs per page, calculate total pages |

**Total Story 3.4:** 19 tests - P0: 8, P1: 5, P2: 3, Unit: 3 (~25-40 hours)

---

### Coverage Summary by Priority

**P0 (Critical):** 34 tests (60-80 hours)
- Story 3.1: 9 tests - Drag & drop, SSE sync, audit logging
- Story 3.2: 10 tests - Stock race conditions, OT lifecycle
- Story 3.3: 7 tests - Multi-user assignment, PBAC security
- Story 3.4: 8 tests - Filters, pagination, table display

**P1 (High):** 23 tests (40-55 hours)
- Story 3.1: 7 tests - Responsive design, SSE heartbeat
- Story 3.2: 6 tests - Repuestos, photos, notifications
- Story 3.3: 5 tests - Technician filters, provider workflow
- Story 3.4: 5 tests - Sorting, sync Kanban ↔ Listado

**P2 (Medium):** 11 tests (15-25 hours)
- Story 3.1: 4 tests - UI polish, badges, indicators
- Story 3.2: 2 tests - Comments display
- Story 3.3: 2 tests - Location filter, overload indicator
- Story 3.4: 3 tests - Modal close, avería reference

**Unit Tests (12 tests - Business Logic):**
- Story 3.1: 3 tests - State transitions, column colors, card formatting
- Story 3.2: 3 tests - Stock calculations, repuesto validation, completion requirements
- Story 3.3: 3 tests - Assignment limits, provider logic, distribution formatting
- Story 3.4: 3 tests - Filter combinations, sort logic, pagination

**Total:** 80 tests (34 P0 + 23 P1 + 11 P2 + 12 Unit = 115-160 hours ~3-4 semanas)

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

Run en cada PR:
- [ ] Story 3.1: Supervisor ve Kanban de 8 columnas (30s)
- [ ] Story 3.2: Técnico inicia OT asignada (45s)
- [ ] Story 3.3: Supervisor asigna técnico a OT (1min)
- [ ] Story 3.4: Supervisor ve lista de OTs con filtros (1min)
- [ ] Story 3.2: Stock update en tiempo real (45s)

**Total**: 5 smoke tests (~4 min)

### P0 Tests (<15 min)

**Purpose**: Critical path validation - Run en cada PR

**Story 3.1 - Kanban (9 tests, ~6 min):**
- [ ] 3.1-E2E-P0-001: Kanban 8 columnas visible
- [ ] 3.1-E2E-P0-002: Columnas orden correcto + colores
- [ ] 3.1-E2E-P0-003: OT cards info completa
- [ ] 3.1-E2E-P0-004: Drag & drop <1s (R-102)
- [ ] 3.1-E2E-P0-005: SSE enviado tras drag & drop (R-101)
- [ ] 3.1-E2E-P0-006: Auditoría logged
- [ ] 3.1-INT-P0-007: Optimistic locking validation (R-102)
- [ ] 3.1-E2E-P0-008: Preventivas etiqueta verde
- [ ] 3.1-E2E-P0-009: Correctivas etiqueta rojiza

**Story 3.2 - Mis OTs (10 tests, ~5 min):**
- [ ] 3.2-E2E-P0-021: Técnico ve /mis-ots
- [ ] 3.2-E2E-P0-022: Móvil bottom nav tab
- [ ] 3.2-E2E-P0-023: Touch abre modal
- [ ] 3.2-E2E-P0-024: Iniciar OT <1s
- [ ] 3.2-E2E-P0-025: SSE <30s (R-104)
- [ ] 3.2-INT-P0-026: Stock update <1s (R-103)
- [ ] 3.2-INT-P0-027: Stock race condition test (R-103)
- [ ] 3.2-E2E-P0-028: Completar OT requiere confirmación
- [ ] 3.2-E2E-P0-029: Operario confirma reparación
- [ ] 3.2-E2E-P0-030: Comentarios con timestamp

**Story 3.3 - Asignación (7 tests, ~2 min):**
- [ ] 3.3-E2E-P0-039: Seleccionar 1-3 técnicos
- [ ] 3.3-E2E-P0-040: Seleccionar 1 proveedor
- [ ] 3.3-E2E-P0-041: SSE a todos <30s (R-104)
- [ ] 3.3-E2E-P0-042: Cualquiera puede iniciar
- [ ] 3.3-E2E-P0-043: Cualquiera puede agregar repuestos
- [ ] 3.3-E2E-P0-044: Cualquiera puede completar
- [ ] 3.3-INT-P0-045: PBAC can_assign_technicians (R-107)

**Story 3.4 - Listado (8 tests, ~2 min):**
- [ ] 3.4-E2E-P0-053: Tabla todas las OTs
- [ ] 3.4-E2E-P0-054: Columnas correctas
- [ ] 3.4-E2E-P0-055: Paginación 100 OTs
- [ ] 3.4-E2E-P0-056: Filtro estado
- [ ] 3.4-E2E-P0-057: Filtro técnico
- [ ] 3.4-E2E-P0-058: Filtro fecha
- [ ] 3.4-E2E-P0-059: Filtro tipo
- [ ] 3.4-INT-P0-060: Filtros AND (R-109)

**Total P0**: 34 scenarios (~15 min)

### P1 Tests (<30 min)

**Purpose**: Important feature coverage - Run nightly/PR to main

**Story 3.1 (7 tests):** Tablet/mobile responsive, SSE heartbeat (Integration), toggle sync
**Story 3.2 (6 tests):** Repuestos dropdown, photos, notifications silent
**Story 3.3 (5 tests):** Filtros habilidades, distribución asignados, proveedor workflow
**Story 3.4 (5 tests):** Sorting, sync Kanban ↔ Listado

**Total P1**: 23 scenarios (~25-30 min)

### Unit Tests (<15 min)

**Purpose**: Business logic validation - Run on every commit

**Story 3.1 (3 tests):** State transitions, column colors, card formatting
**Story 3.2 (3 tests):** Stock calculations, repuesto validation, completion validation
**Story 3.3 (3 tests):** Assignment limits, provider logic, distribution formatting
**Story 3.4 (3 tests):** Filter combinations, sort logic, pagination

**Total Unit**: 12 scenarios (~10-15 min)

### P2 Tests (<10 min)

**Purpose**: Full regression coverage - Run weekly

**Story 3.1 (4 tests):** Badges, KPIs, indicators
**Story 3.2 (2 tests):** Comments display, notifications multi-user
**Story 3.3 (2 tests):** Location filter, overload indicator
**Story 3.4 (3 tests):** Modal close, avería reference

**Total P2**: 11 scenarios (~8-10 min)

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
|----------|-------|------------|-------------|-------|
| P0 | 34 | 2.0 | 60-80 | Complex setup: race conditions, SSE, drag & drop |
| P1 | 23 | 1.5 | 35-55 | Multi-device, responsive, filters |
| P2 | 11 | 0.5 | 15-25 | Simple scenarios, edge cases |
| Unit | 12 | 0.5 | 6-10 | Business logic, fast feedback |
| **Total** | **80** | **-** | **116-170** | **~3-4 semanas con 1 QA + Dev** |

### By Story

| Story | Tests | Hours | Complexity |
|-------|-------|-------|------------|
| 3.1 Kanban | 23 | 37-47 | Drag & drop complex, SSE critical, 3 unit tests |
| 3.2 Mis OTs | 21 | 32-42 | Stock race conditions, modal flows, 3 unit tests |
| 3.3 Asignación | 17 | 27-37 | PBAC tests, multi-user scenarios, 3 unit tests |
| 3.4 Listado | 19 | 27-42 | Filtros complejos, sync Kanban ↔ Listado, 3 unit tests |

### Prerequisites

**Test Data (Factories):**

- User factory (faker-based randomization: email, nombre, teléfono únicos)
- Asset factory (5-level hierarchy: Planta → Línea → Equipo → Componente → Repuesto)
- OT factory con estados, asignaciones, repuestos
- Repuesto factory con stock, ubicación, proveedores
- Auto-cleanup fixtures para parallel safety

**Tooling:**

- Playwright browser automation (E2E tests)
- Vitest para Integration y Unit tests
- API testing con `@seontechnologies/playwright-utils/api-request` (Integration tests)
- SSE mock layer (BLK-002) para fast-forward testing
- k6 load testing para performance validation

**Environment:**

- **Local:** Supabase Docker + Vercel CLI, datos reseteados en cada run
- **CI/CD:** GitHub Actions con Playwright workers=4-8, cleanup automático
- **Staging:** Environment configurado con datos de prueba estables

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (34 tests must pass - NO exceptions)
- **P1 pass rate**: ≥95% (≥22 of 23 tests, waivers required for failures)
- **P2 pass rate**: ≥90% (≥10 of 11 tests, informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths**: ≥80% (Epic 3 core workflows: Kanban, Mis OTs, Asignación, Listado)
- **Security scenarios**: 100% (PBAC R-107: can_assign_technicians)
- **Data integrity**: 100% (R-102, R-103: Race conditions)
- **Performance**: 100% (R-104: SSE <30s, R-106: Kanban <500ms)

### Non-Negotiable Requirements

- [ ] All P0 tests pass (34/34 tests)
- [ ] No high-risk (≥6) items unmitigated:
  - [ ] R-101 (SSE sync) resuelto
  - [ ] R-102 (Drag & drop race) mitigado
  - [ ] R-103 (Stock race) mitigado
  - [ ] R-105 (Multi-device sync) completado (BLK-003)
- [ ] Security tests (SEC category) pass 100%:
  - [ ] R-107 (PBAC can_assign_technicians) validado
- [ ] Performance targets met (PERF category):
  - [ ] R-104: SSE notifications <30s
  - [ ] R-106: Kanban 100 OTs <500ms

---

## Mitigation Plans

### R-101: SSE sync failure Kanban ↔ Listado (Score: 9) 🔴 BLOCKER

**Mitigation Strategy:**
1. Implementar versioning de entidades OT (version field incrementado en cada update)
2. Usar last-write-wins con timestamp ordering
3. Test de sincronización bidireccional:
   - Escenario: Desktop modifica OT, móvil debe ver cambio en <30s
   - Escenario: Móvil modifica OT, desktop debe ver cambio en <30s
   - Escenario: Ambos modifican misma OT → last-write-wins gana

**Owner:** Backend Dev
**Timeline:** Pre-implementation (BLOCKER - must complete before Epic 3 implementation)
**Status:** Planned
**Verification:** E2E test 3.1-E2E-P1-065: Sincronización Kanban ↔ Listado + 3.4-E2E-P1-065

### R-102: Drag & drop race conditions (Score: 8) 🟠 MITIGATE

**Mitigation Strategy:**
1. Implementar optimistic locking con version field
2. Conflict detection: Si version mismatch → return 409 Conflict
3. UI muestra: "OT modificada por otro usuario, recargue"
4. Test de race condition: 2 usuarios arrastran misma OT simultáneamente

**Owner:** Backend Dev + QA
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Integration test 3.1-INT-P0-007: OT state change optimistic locking

### R-103: Stock update race condition (Score: 8) 🟠 MITIGATE

**Mitigation Strategy:**
1. Database transactions con SELECT FOR UPDATE (lock row during update)
2. Stock validation antes de commit (stock >= quantity)
3. Si stock insuficiente → return 400 Bad Request con mensaje descriptivo
4. Test de race condition: 2 técnicos agregan mismo repuesto simultáneamente

**Owner:** Backend Dev
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Integration test 3.2-INT-P0-027: Stock update race condition

### R-104: SSE notification delay >30s (Score: 6) 🟠 MITIGATE

**Mitigation Strategy:**
1. SSE heartbeat cada 30s (ping/pong para detectar conexiones muertas)
2. Retry mechanism con exponential backoff (1s, 2s, 4s, 8s, max 30s)
3. Client auto-reconnect si SSE desconecta
4. Test de timeout: Simular SSE server down, validar reconexión automática

**Owner:** Backend Dev
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Integration test 3.1-INT-P1-015: SSE heartbeat validation

### R-105: Multi-device sync strategy undefined (Score: 6) 🟠 MITIGATE

**Mitigation Strategy:**
1. Completar BLK-003: Multi-device sync conflict strategy
2. Implementar last-write-wins + merge strategy
3. Versioning de entidades OT
4. Test de sync: Desktop modifica OT, móvil ve cambio en <30s

**Owner:** Architect + Backend Dev
**Timeline:** Pre-implementation (BLOCKER - BLK-003 pending)
**Status:** Planned
**Verification:** E2E test 3.1-E2E-P1-065 + 3.4-E2E-P1-065: Sync bidireccional

### R-107: Asignación múltiple sin validación PBAC (Score: 4) 🟡 MONITOR

**Mitigation Strategy:**
1. PBAC test para capability can_assign_technicians
2. API test: POST /api/ots/{id}/assign sin capability → 403 Forbidden
3. Validar que usuarios con capability pueden asignar
4. Validar que usuarios sin capability reciben 403

**Owner:** Backend Dev + QA
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Integration test 3.3-INT-P0-045: PBAC can_assign_technicians

### R-106: Kanban performance 100+ OTs (Score: 4) 🟡 MONITOR

**Mitigation Strategy:**
1. Implementar virtual scrolling para columnas con muchas OTs
2. Pagination lazy loading (solo renderizar OTs visibles)
3. Performance test: 100 OTs, medir render time
4. Target: <500ms para cargar Kanban con 100 OTs (NFR-SC4)

**Owner:** Frontend Dev
**Timeline:** Sprint 2
**Status:** Planned
**Verification:** Performance test: Kanban con 100 OTs <500ms

---

## Assumptions and Dependencies

### Assumptions

1. Epic 1 y Epic 2 están completados y en producción
2. BLK-001 a BLK-005 (pre-implementation blockers) serán resueltos antes de iniciar Epic 3
3. SSE infrastructure está disponible y configurada
4. PBAC system está implementado con las 15 capacidades definidas
5. Base de datos de usuarios con roles y capabilities está seeded
6. Playwright framework está configurado y funcionando

### Dependencies

1. **BLK-001: Test data seeding APIs** - Required by Sprint 1 (Pre-implementation)
2. **BLK-002: SSE mock layer** - Required by Sprint 1 (Pre-implementation)
3. **BLK-003: Multi-device sync conflict strategy** - Required by Sprint 1 (BLOCKER)
4. **BLK-004: Observability infrastructure** - Required by Sprint 1 (Pre-implementation)
5. **BLK-005: Performance baseline infrastructure** - Required by Sprint 1 (Pre-implementation)
6. **Epic 1 & Epic 2 completion** - Required before Epic 3 implementation starts
7. **PBAC implementation complete** - Required for Story 3.3 (Asignación)

### Risks to Plan

- **Risk:** BLK-003 (multi-device sync) no está implementado
  - **Impact:** BLOCKER - Epic 3 core feature no puede funcionar sin sync strategy
  - **Contingency:** Priorizar BLK-003 en Sprint 1 antes de iniciar Stories 3.1-3.4

- **Risk:** SSE infrastructure no está disponible
  - **Impact:** HIGH - Tests de sincronización real-time no pueden ejecutarse
  - **Contingency:** Implementar BLK-002 (SSE mock layer) para testing en entorno aislado

- **Risk:** Performance infrastructure (k6) no está configurada
  - **Impact:** MEDIUM - Performance tests no pueden ejecutarse
  - **Contingency:** Implementar BLK-005 (k6 setup) en Sprint 2 para tests de performance

---

## Tooling and Access

### Required Tools

- **Playwright** - Browser automation para E2E tests
- **Vitest** - Integration y Unit test framework
- **@seontechnologies/playwright-utils** - API testing utilities (Integration tests)
- **k6** - Load testing para performance validation
- **Supabase CLI** - Local database testing
- **Vercel CLI** - Deployment testing

### Access Requirements

- **GitHub Actions** - CI/CD pipeline configuration
- **Staging environment** - Integration testing environment
- **Test data seeding access** - /api/test-data endpoints (dev/staging only)
- **Observability access** - Logs, metrics, traces para debugging

**Status:** Pending setup - BLK-001, BLK-002, BLK-004, BLK-005

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope |
|-------------------|--------|------------------|
| **Epic 1: Auth & PBAC** | Critical - Epic 3 depende de PBAC can_assign_technicians | Validar que PBAC tests de Epic 1 siguen pasando; Test 3.3-INT-P0-045: PBAC can_assign_technicians |
| **Epic 2: Averías y OTs** | Critical - Epic 3 gestiona OTs creadas desde Epic 2 | Validar que conversión avería → OT funciona; Test 3.4-E2E-P2-068: OT creada desde avería muestra link |
| **SSE Infrastructure** | Critical - Epic 3 requiere SSE sync real-time | Validar que SSE tests de Epic 2 siguen pasando; Tests 3.1-E2E-P0-005, 3.2-E2E-P0-025: SSE notifications |
| **Stock Management** | High - Epic 3.2 actualiza stock en tiempo real | Validar que stock updates funcionan sin romper inventario; Test 3.2-INT-P0-027: Stock race condition |
| **User Management** | High - Epic 3.3 asigna técnicos a OTs | Validar que user capabilities funcionan correctamente; Test 3.3-INT-P0-045: PBAC validation |

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests (separate workflow; not auto-run).
- Run `*automate` for broader coverage once implementation exists.
- Run `*trace` to generate traceability matrix post-implementation.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: ________________ Date: ________
- [ ] Tech Lead: ________________ Date: ________
- [ ] QA Lead: ________________ Date: ________

**Comments:**

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework (score 1-9, categories TECH/SEC/PERF/DATA/BUS/OPS)
- `probability-impact.md` - Risk scoring methodology (probability × impact)
- `test-levels-framework.md` - Test level selection (Unit/Integration/E2E decision matrix)
- `test-priorities-matrix.md` - P0-P3 prioritization criteria
- `playwright-cli.md` - Browser automation for agents
- `pactjs-utils-overview.md` - Contract testing utilities
- `api-testing-patterns.md` - When to use API vs Integration vs Unit tests
- `tests/api/README.md` - Lessons learned: NextAuth not testable via pure API

### Related Documents

- **PRD:** `{project-root}/_bmad-output/planning-artifacts/archive/prd.md`
- **Epics:** `{project-root}/_bmad-output/planning-artifacts/epics.md` (Epic 3: Órdenes de Trabajo)
- **Architecture:** `{project-root}/_bmad-output/planning-artifacts/archive/architecture.md`
- **System-Level Test Design:** `{project-root}/_bmad-output/test-artifacts/test-design-qa.md`

### Test File Structure

```
tests/
├── e2e/
│   ├── story-3.1/
│   │   ├── kanban-p0-critical.spec.ts (9 tests)
│   │   ├── kanban-p1-important.spec.ts (7 tests)
│   │   └── kanban-p2-edge.spec.ts (4 tests)
│   ├── story-3.2/
│   │   ├── mis-ots-p0-critical.spec.ts (10 tests)
│   │   ├── mis-ots-p1-important.spec.ts (6 tests)
│   │   └── mis-ots-p2-edge.spec.ts (2 tests)
│   ├── story-3.3/
│   │   ├── asignacion-p0-critical.spec.ts (7 tests)
│   │   ├── asignacion-p1-important.spec.ts (5 tests)
│   │   └── asignacion-p2-edge.spec.ts (2 tests)
│   └── story-3.4/
│       ├── listado-p0-critical.spec.ts (8 tests)
│       ├── listado-p1-important.spec.ts (5 tests)
│       └── listado-p2-edge.spec.ts (3 tests)
├── integration/
│   ├── story-3.1/
│   │   ├── audit-logging.spec.ts (1 test)
│   │   ├── optimistic-locking.spec.ts (1 test)
│   │   └── sse-heartbeat.spec.ts (1 test)
│   ├── story-3.2/
│   │   ├── stock-update.spec.ts (2 tests - race conditions)
│   │   └── sse-notifications.spec.ts (1 test)
│   ├── story-3.3/
│   │   └── pbac-assignments.spec.ts (1 test - R-107)
│   └── story-3.4/
│       └── filters-combined.spec.ts (1 test - R-109)
└── unit/
    ├── story-3.1/
    │   ├── ot-state-transitions.spec.ts (1 test)
    │   ├── column-colors.spec.ts (1 test)
    │   └── card-formatting.spec.ts (1 test)
    ├── story-3.2/
    │   ├── stock-calculations.spec.ts (1 test)
    │   ├── repuesto-validation.spec.ts (1 test)
    │   └── completion-validation.spec.ts (1 test)
    ├── story-3.3/
    │   ├── assignment-limits.spec.ts (1 test)
    │   ├── provider-logic.spec.ts (1 test)
    │   └── distribution-formatting.spec.ts (1 test)
    └── story-3.4/
        ├── filter-combinations.spec.ts (1 test)
        ├── sort-logic.spec.ts (1 test)
        └── pagination.spec.ts (1 test)
```

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 5.0 (BMad v6.0.4)
**Mode**: Epic-Level (Phase 4)
