---
title: 'TEA Test Design → BMAD Handoff Document'
version: '1.0'
workflowType: 'testarch-test-design-handoff'
inputDocuments: ['prd.md', 'architecture.md']
sourceWorkflow: 'testarch-test-design'
generatedBy: 'TEA Master Test Architect'
generatedAt: '2026-03-08'
projectName: 'gmao-hiansa'
---

# TEA → BMAD Integration Handoff

## Purpose

This document bridges TEA's test design outputs with BMAD's epic/story decomposition workflow (`create-epics-and-stories`). It provides structured integration guidance so that quality requirements, risk assessments, and test strategies flow into implementation planning.

---

## TEA Artifacts Inventory

| Artifact             | Path                                                      | BMAD Integration Point                                 |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| Test Design Architecture | `_bmad-output/test-artifacts/test-design-architecture.md`    | Epic quality requirements, architectural testability gaps |
| Test Design QA       | `_bmad-output/test-artifacts/test-design-qa.md`               | Story acceptance criteria, test coverage requirements    |
| This Handoff         | `_bmad-output/test-artifacts/test-design/gmao-hiansa-handoff.md` | Epic/story quality integration, risk-to-story mapping   |

---

## Epic-Level Integration Guidance

### Risk References

**Critical (Score = 9) - MUST appear as epic-level quality gates:**

#### R-001: Predictive Search Performance Degradation (PERF, Score: 9)
- **Affected Epic:** Gestión de Activos (búsqueda de equipos/activos)
- **Quality Gate:** Búsqueda predictiva con 10,000+ activos debe completar en <200ms (P95)
- **Epic Acceptance Criteria:** "Como técnico, puedo buscar equipos rápidamente para reportar averías"
- **Test Validation:** k6 load test con 10K activos, P95 <200ms (P0-062)

#### R-002: Multi-Device Sync Race Conditions (DATA, Score: 9)
- **Affected Epic:** Sincronización Multi-Device (SSE real-time)
- **Quality Gate:** Sincronización de OTs y KPIs entre múltiples dispositivos sin pérdida de datos
- **Epic Acceptance Criteria:** "Como usuario, veo actualizaciones en tiempo real en todos mis dispositivos"
- **Test Validation:** E2E test: 2 dispositivos editan misma OT simultáneamente, validar merge correcto (P0-051)

**High Priority (Score ≥6) - SHOULD appear as epic-level quality gates:**

#### R-005: PBAC Implementation Security (SEC, Score: 6)
- **Affected Epic:** Usuarios y PBAC
- **Quality Gate:** Las 15 capacidades del sistema PBAC funcionan correctamente sin exponer datos sensibles
- **Epic Acceptance Criteria:** "Como administrador, puedo controlar acceso granular sin riesgos de seguridad"
- **Test Validation:** E2E test suite P0: Validar todas las 15 capacidades (P0-045)

#### R-006: Concurrent User Performance (PERF, Score: 6)
- **Affected Epic:** Todos los epics (scalability requirement)
- **Quality Gate:** Sistema soporta 100 usuarios concurrentes sin degradación >10%
- **Epic Acceptance Criteria:** "Como usuario, el sistema responde rápidamente incluso con muchos usuarios concurrentes"
- **Test Validation:** k6 load test: 100 usuarios concurrentes, degradación <10% (P0-068)

---

### Quality Gates

**Recommended quality gates per epic based on risk assessment:**

| Epic                                   | P0 Tests | P1 Tests | Critical Risks (Score ≥6) | Quality Gate Criteria                                                                 |
| -------------------------------------- | -------- | -------- | ------------------------- | ------------------------------------------------------------------------------------- |
| **Gestión de Averías**                 | 9        | 2        | R-001                     | Búsqueda predictiva <200ms, reporte avería <30s                                     |
| **Órdenes de Trabajo**                | 14       | 6        | R-002                     | Sincronización multi-device <1s, stock actualización <1s                              |
| **Gestión de Activos**                | 6        | 3        | R-001, R-013              | Búsqueda <200ms, 10K activos sin degradación, relaciones muchos-a-muchos funcionan  |
| **Gestión de Repuestos**              | 5        | 3        | R-011                     | Stock actualización en tiempo real, alertas solo stock mínimo                         |
| **Usuarios y PBAC**                    | 11       | 7        | R-005                     | Las 15 capacidades funcionan correctamente, acceso denegado funciona                  |
| **Dashboard KPIs**                    | 5        | 3        | R-009                     | KPIs actualizados cada 30s, drill-down funciona                                       |
| **Sincronización Multi-Device**       | 5        | 1        | R-002                     | Sync OTs <1s, sync KPIs <30s, reconexión automática <30s                              |
| **Seguridad y NFRs**                  | 13       | 3        | R-001, R-002, R-005, R-006 | Todos los NFRs validados (performance, seguridad, accesibilidad, scalability)        |
| **Testabilidad Setup**                | 5        | 0        | Blockers                  | 5 blockers resueltos antes de QA puede escribir tests                                 |

---

## Story-Level Integration Guidance

### P0/P1 Test Scenarios → Story Acceptance Criteria

**Critical test scenarios that MUST be converted to story acceptance criteria:**

#### From P0 Tests (Critical Path):

**Gestión de Averías - Story: "Operario reporta avería"**
- **P0-001:** Búsqueda predictiva de equipo en <30 segundos (R-001: <200ms)
- **P0-002:** Descripción vacía rechazada
- **P0-003:** Foto opcional subida correctamente
- **P0-004:** Notificación push recibida dentro de 30s (R-002: SSE 30s heartbeat)
- **Acceptance Criteria Given/When/Then:**
  ```
  GIVEN operario autenticado con capability can_create_failure_report
  WHEN navega a /averias/nuevo Y busca equipo "Perfiladora-P201"
  THEN resultados aparecen en <200ms (R-001)
  AND cuando completa descripción Y selecciona equipo
  THEN puede adjuntar foto opcional
  AND cuando envía reporte
  THEN notificación push recibida en <30s (R-002)
  ```

**Órdenes de Trabajo - Story: "Técnico actualiza OT asignada"**
- **P0-012:** Técnico inicia OT (cambio a "En Progreso")
- **P0-013:** Técnico agrega repuestos usados (R-011: stock race condition)
- **P0-014:** Técnico completa OT
- **P0-015:** Stock actualizado en tiempo real <1s (R-011)
- **P0-019:** Todos los asignados reciben notificación SSE (R-002)
- **Acceptance Criteria Given/When/Then:**
  ```
  GIVEN técnico autenticado con capability can_update_work_order
  WHEN tiene OT asignada "OT-1234"
  AND cambia estado a "En Progreso"
  THEN todos los usuarios asignados reciben notificación SSE en <30s (R-002)
  AND cuando agrega repuesto "ROD-6208" usado
  THEN stock actualizado en <1s (R-011)
  AND cuando completa OT
  THEN estado cambia a "Completado"
  ```

**Usuarios y PBAC - Story: "Admin crea usuario con capacidades"**
- **P0-035:** Admin crea usuario con solo can_create_failure_report por defecto (R-005)
- **P0-036:** Admin selecciona capabilities con checkboxes
- **P0-037:** Usuario sin can_manage_assets solo consulta (R-005: access denied)
- **P0-045:** Las 15 capacidades funcionan correctamente (R-005)
- **Acceptance Criteria Given/When/Then:**
  ```
  GIVEN admin autenticado con las 15 capabilities
  WHEN crea nuevo usuario "tecnico@example.com"
  THEN usuario creado con solo capability can_create_failure_report por defecto (R-005)
  AND cuando admin agrega capability can_view_kpis
  THEN usuario puede acceder a dashboard /kpis
  AND cuando usuario intenta acceder a /activos sin can_manage_assets
  THEN acceso denegado, solo lectura visible (R-005)
  ```

**Dashboard KPIs - Story: "Usuario ve KPIs actualizados en tiempo real"**
- **P0-046:** MTTR actualizado cada 30s (R-002: SSE heartbeat)
- **P0-047:** MTBF actualizado cada 30s
- **P0-048:** Drill-down: Global → Planta → Línea → Equipo
- **Acceptance Criteria Given/When/Then:**
  ```
  GIVEN usuario autenticado con capability can_view_kpis
  WHEN accede a dashboard /kpis
  THEN ve MTTR Y MTBF actualizados en tiempo real
  AND cuando OT se completa en otro dispositivo
  THEN MTTR actualizado en <30s automáticamente (R-002: SSE)
  AND cuando hace drill-down a Planta → Línea → Equipo
  THEN ve KPIs específicos del equipo seleccionado
  ```

#### From P1 Tests (High Priority):

**Órdenes de Trabajo - Story: "Supervisor filtra y vista OTs"**
- **P1-004:** Filtros por estado, técnico, fecha, tipo, equipo
- **P1-005:** Alternar vista Kanban ↔ listado con sincronización real-time (R-002)
- **Acceptance Criteria:**
  ```
  GIVEN supervisor autenticado con capability can_view_all_work_orders
  WHEN aplica filtro "Estado=Completado"
  THEN solo OTs completadas visibles en lista
  AND cuando cambia a vista Kanban
  THEN misma filtra aplicada, sincronización SSE activa (R-002)
  ```

---

### Data-TestId Requirements

**Recommended data-testid attributes for testability:**

**Gestión de Averías:**
- `averia-nuevo-form` - Formulario de reporte de avería
- `equipo-search` - Input búsqueda predictiva de equipos
- `averia-descripcion` - Textarea descripción avería
- `averia-foto-upload` - Upload foto opcional
- `averia-submit` - Botón enviar reporte

**Órdenes de Trabajo:**
- `ot-kanban-board` - Board Kanban de OTs
- `ot-card-{id}` - Tarjeta OT individual
- `ot-iniciar-btn` - Botón iniciar OT
- `ot-completar-btn` - Botón completar OT
- `repuestos-usados-list` - Lista repuestos usados
- `repuesto-select` - Select agregar repuesto

**Gestión de Activos:**
- `activo-jerarquia-nav` - Navegación jerárquica
- `activo-busqueda` - Búsqueda de activos
- `activo-estado-select` - Select estado equipo
- `activo-historial-tab` - Tab historial reparaciones

**Dashboard KPIs:**
- `kpi-mttr-value` - Valor MTTR
- `kpi-mtbf-value` - Valor MTBF
- `kpi-drilldown-planta` - Selector drill-down planta
- `kpi-drilldown-linea` - Selector drill-down línea
- `kpi-drilldown-equipo` - Selector drill-down equipo

**Usuarios y PBAC:**
- `usuario-nuevo-form` - Formulario crear usuario
- `capabilities-checkbox-group` - Checkboxes de 15 capacidades
- `capability-{name}` - Checkbox individual (ej: capability-can_view_kpis)

**Autenticación:**
- `login-email` - Input email
- `login-password` - Input password
- `login-submit` - Botón submit login
- `cambiar-password-form` - Formulario cambio contraseña

---

## Risk-to-Story Mapping

| Risk ID | Category | P×I | Recommended Epic/Story | Test Level | Priority |
| ------- | -------- | --- | ---------------------- | ---------- | -------- |
| **R-001** | PERF | 9 | Epic: Gestión de Activos - Story: "Operario busca equipo con 10K+ activos" | E2E + Load | P0 |
| **R-002** | DATA | 9 | Epic: Sincronización Multi-Device - Story: "Dos dispositivos editan misma OT simultáneamente" | E2E + API | P0 |
| **R-003** | OPS | 6 | Epic: DevOps - Story: "Implementar blue/green deployment con rollback automático" | Manual + E2E | P1 |
| **R-004** | PERF | 6 | Epic: Reportes Automáticos - Story: "Generar reporte mensual PDF en background sin bloquear servidor" | API | P1 |
| **R-005** | SEC | 6 | Epic: Usuarios y PBAC - Story: "Admin crea usuario con capacidades granulares" | E2E | P0 |
| **R-006** | PERF | 6 | Epic: Performance/NFRs - Story: "100 usuarios concurrentes sin degradación" | Load | P0 |
| **R-007** | PERF | 4 | Epic: Búsqueda Universal - Story: "Búsqueda universal con datasets grandes" | API | P1 |
| **R-008** | PERF | 4 | Epic: Gestión de Activos - Story: "Importación masiva 10K activos desde CSV" | API | P1 |
| **R-009** | PERF | 4 | Epic: Dashboard KPIs - Story: "Cálculo MTTR/MTBF con histórico grande" | API | P1 |
| **R-010** | PERF | 4 | Epic: PWA - Story: "PWA performance óptima en móviles gama baja" | E2E | P1 |
| **R-011** | DATA | 4 | Epic: Órdenes de Trabajo - Story: "Dos técnicos actualizan stock simultáneamente" | API | P0 |
| **R-012** | PERF | 4 | Epic: Database - Story: "Connection pooling configurado correctamente" | Load | P1 |
| **R-013** | TECH | 4 | Epic: Gestión de Activos - Story: "Componente asociado a múltiples equipos" | API | P0 |
| **R-014** | OPS | 5 | Epic: Reportes Automáticos - Story: "Email service failure con queue retry" | API | P1 |
| **R-015** | OPS | 5 | Epic: DevOps - Story: "Backup restore trimestral con RTO <4h" | Manual | P1 |
| **R-016** | PERF | 4 | Epic: Testabilidad - Story: "Tests corren en paralelo sin data pollution" | Unit | P0 |

**Notes:**
- P×I = Probability × Impact (score 1-9)
- Stories marcados como P0 deben implementarse en Phase 1 MVP
- Stories P1/P2 pueden implementarse en Phase 1 MVP o Phase 1.5 dependiendo del timeline

---

## Recommended BMAD → TEA Workflow Sequence

**Secuencia recomendada de workflows BMAD y TEA para implementación ágil con calidad integrada:**

1. **✅ COMPLETADO: TEA Test Design (System-Level)**
   - Workflow: `testarch-test-design` (este workflow)
   - Outputs: Architecture doc, QA doc, Handoff doc
   - Status: COMPLETADO (2026-03-07)

2. **🔄 SIGUIENTE: BMAD Create Epics & Stories**
   - Workflow: `create-epics-and-stories` (bmad-bmm-create-epics-and-stories)
   - Input: PRD + este Handoff
   - Output: Epics con quality requirements integradas
   - **Integration:**
     - Referenciar Risk IDs (R-001, R-002, etc.) en epic-level acceptance criteria
     - Incluir Quality Gates de cada epic en epic descriptions
     - Mapear P0/P1 tests a story acceptance criteria
   - Estimated: 1-2 semanas

3. **⏭️ TEA ATDD (Acceptance Test-Driven Development)**
   - Workflow: `testarch-atdd` (bmad-tea-testarch-atdd)
   - Input: Epics & Stories + P0/P1 test scenarios
   - Output: Failing acceptance tests (Given/When/Then)
   - **Integration:**
     - Generar failing tests para P0 scenarios (73 tests)
     - Usar data-testid attributes definidos en este handoff
     - Convertir acceptance criteria en test specs Playwright
   - Estimated: 2-3 semanas

4. **⏭️ BMAD Implementation (Dev Stories)**
   - Workflow: `dev-story` (bmad-bmm-dev-story)
   - Input: Stories con failing tests
   - Output: Código que pasa los tests
   - **Integration:**
     - Developers implementan features test-first
     - Cada story no está completa hasta que sus tests pasan
   - Estimated: 8-12 semanas (Phase 1 MVP)

5. **⏭️ TEA Automate (Expand Test Coverage)**
   - Workflow: `testarch-automate` (bmad-tea-testarch-automate)
   - Input: P1/P2 test scenarios del QA doc
   - Output: Full test suite (102 tests: 73 P0, 26 P1, 3 P2)
   - **Integration:**
     - Expandir cobertura más allá de P0
     - Implementar tests de P1 scenarios (26 tests)
     - Implementar tests de P2 edge cases (3 tests)
   - Estimated: 4-6 semanas

6. **⏭️ TEA Trace (Coverage Validation)**
   - Workflow: `testarch-trace` (bmad-tea-testarch-trace)
   - Input: Test suite completo + PRD requirements
   - Output: Traceability matrix + Quality gate decision
   - **Integration:**
     - Validar que todos los P0/P1 requirements tienen tests
     - Validar coverage target ≥80%
     - Quality gate decision: PASS/CONCERNS/FAIL
   - Estimated: 1 semana

7. **⏭️ Release (si Quality Gate PASS)**
   - Workflow: `release` (decision manual)
   - Input: Quality gate PASS + Trace validation
   - Output: GA release
   - **Criteria:**
     - 100% P0 tests passing
     - ≥95% P1 tests passing
     - Todos los riesgos score 9 (R-001, R-002) mitigados
     - Coverage ≥80%
   - Estimated: Gate decision meeting

---

## Phase Transition Quality Gates

| From Phase          | To Phase            | Gate Criteria                                                                                                                               | Owner    |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Test Design**     | **Epic/Story Creation** | - ✅ Todos los P0 riesgos tienen estrategia de mitigación documentada<br>- ✅ Quality gates por epic definidos<br>- ✅ Risk-to-story mapping completo | QA Lead  |
| **Epic/Story Creation** | **ATDD**            | - [ ] Stories tienen acceptance criteria desde test design (P0/P1)<br>- [ ] Data-testid attributes incluidos en stories<br>- [ ] Risk IDs referenciados | PM + QA |
| **ATDD**            | **Implementation**  | - [ ] Failing acceptance tests existen para todos los escenarios P0<br>- [ ] Tests siguen Given/When/Then format<br>- [ ] Tests usan data-testids definidos | QA Lead  |
| **Implementation**  | **Test Automation** | - [ ] Todos los acceptance tests P0 pasan<br>- [ ] Code review completado<br>- [ ] No bugs de alta prioridad abiertos                              | Dev Lead |
| **Test Automation** | **Release**         | - [ ] Trace matrix muestra ≥80% coverage de P0/P1 requirements<br>- [ ] P0 pass rate = 100%<br>- [ ] P1 pass rate ≥95%<br>- [ ] Riesgos score 9 mitigados | QA Lead  |

**Quality Gate Decision Framework:**

**PASS** - Release autorizado:
- 100% P0 passing
- ≥95% P1 passing
- Todos los riesgos score 9 (R-001, R-002) tienen mitigación implementada y probada
- Coverage ≥80%

**CONCERNS** - Release con reservaciones:
- ≥90% P0 passing
- 80-95% P1 passing
- Riesgos score 9 tienen plan de mitigación documentado (no necesariamente implementado)
- Coverage 70-79%

**FAIL** - Release NO autorizado:
- <90% P0 passing
- <80% P1 passing
- Riesgos score 9 sin plan de mitigación
- Coverage <70%

---

## Pre-Implementation Blockers (CRITICAL)

**5 blockers que DEBEN resolverse antes que QA pueda escribir tests:**

| Blocker ID | Description                                       | Owner          | Timeline  | Status   |
| ---------- | ------------------------------------------------- | -------------- | --------- | -------- |
| **BLK-001** | Test Data Seeding APIs (`/api/test-data` endpoints) | Backend Dev    | Phase 1 pre-implementation | Pending |
| **BLK-002** | SSE Mock Layer (fast-forward mode para tests)     | Backend Dev + QA | Phase 1 pre-implementation | Pending |
| **BLK-003** | Multi-Device Sync Conflict Strategy (last-write-wins + merge) | Backend Dev | Phase 1 MVP | Pending |
| **BLK-004** | Observability Infrastructure (structured logging, correlation IDs) | Backend Dev | Phase 1 MVP | Pending |
| **BLK-005** | Performance Baseline Infrastructure (k6 load testing) | Backend Dev + DevOps | Phase 1 MVP | Pending |

**Impact si NO se resuelven:**
- QA no puede escribir tests eficientemente (10x más lento)
- Tests no pueden paralelizarse
- Tests no deterministas (flaky)
- No se pueden validar NFRs (performance, scalability)
- Timeline de QA se extiende 4-6 semanas

**Qué necesita BMAD:**
- Incluir estos 5 blockers como stories de alta prioridad en Sprint Planning
- Asignar owners y deadlines
- Validar que están completados antes de iniciar Sprint de QA test development

---

## Testability Requirements for Epic/Story Authors

**Cuando escriban epics y stories, incluir:**

### Epic-Level Requirements:

1. **Quality Gates Section** - Referenciar Risk IDs relevantes
   ```
   ## Quality Gates
   - R-001: Búsqueda predictiva <200ms con 10K activos (P95)
   - R-002: Sincronización multi-device <1s para OTs
   ```

2. **NFR References** - Link a non-functional requirements del PRD
   ```
   ## Non-Functional Requirements
   - NFR-P1: Búsqueda predictiva <200ms
   - NFR-P3: SSE heartbeat 30s
   ```

### Story-Level Requirements:

1. **Acceptance Criteria con Given/When/Then** - Basarse en P0/P1 tests
   ```
   GIVEN técnico autenticado con capability can_update_work_order
   WHEN inicia OT asignada
  THEN estado cambia a "En Progreso"
   AND notificación SSE enviada a todos los asignados
   ```

2. **Data-Testid Attributes** - Listar los testids requeridos
   ```
   ## Testability
   - `ot-iniciar-btn` - Botón iniciar OT
   - `repuestos-usados-list` - Lista repuestos usados
   ```

3. **Risk References** - Mencionar riesgos mitigados por la story
   ```
   ## Risks Mitigated
   - R-011: Stock update race conditions (optimistic locking)
   - R-002: Multi-device sync (SSE notification)
   ```

---

## Open Questions & Assumptions

### Assumptions (Validated):

1. ✅ Single-tenant architecture aceptable para MVP (una empresa metalúrgica)
2. ✅ Chrome/Edge only browser support aceptable para ambiente industrial
3. ✅ Spanish-only localization aceptable para MVP inicial
4. ✅ Supabase local (Docker) suficiente para desarrollo y testing
5. ✅ Vercel serverless puede manejar 100 usuarios concurrentes sin degradación
6. ✅ SSE con 30s heartbeat suficiente para real-time requirements
7. ✅ Playwright puede manejar 102 tests con paralelización en CI/CD
8. ✅ 1 QA engineer suficiente para implementar 102 tests en 10-15 semanas

### Open Questions (Requieren Validación en Epic Creation):

1. **¿Cuándo se resolverán los 5 pre-implementation blockers?** (BLK-001 through BLK-005)
   - Recomendación: Incluir como stories prioritarias en Sprint 1

2. **¿Quién es el owner para cada risk mitigation?** (R-001 through R-006)
   - Recomendación: Asignar owners en Epic Planning meeting

3. **¿Timeline para Phase 1 MVP vs Phase 1.5?** (3-4 meses vs 5-6 meses)
   - Recomendación: Validar con PM antes de Epic creation

4. **¿Budget para QA team size?** (1 QA vs 2 QAs afecta timeline 10-15 semanas vs 6-9 semanas)
   - Recomendación: Decidir en Sprint Planning

5. **¿Tools de monitoreo y observabilidad seleccionados?** (para BLK-004)
   - Recomendación: Seleccionar antes de Phase 1 MVP (DataDog, New Relic, self-hosted?)

---

## Next Steps

### Para BMAD Team (Epic/Story Creation):

1. **Review los Risk References** arriba - Asegurar que todos los riesgos score ≥6 estén referenciados en epics
2. **Review los Quality Gates** - Incluir criteria de quality gates en epic descriptions
3. **Usar P0/P1 Test Scenarios** - Convertir escenarios críticos en story acceptance criteria
4. **Incluir Data-Testids** - Agregar sección de testability en stories con atributos recomendados
5. **Planificar los 5 Blockers** - Incluir BLK-001 through BLK-005 como stories de alta prioridad

### Para QA Team:

1. **Esperar a que se resuelvan los 5 blockers** pre-implementation
2. **Revisar Test Design QA doc** (`test-design-qa.md`) para escenarios detallados
3. **Planificar P0 test implementation** (73 tests, 6-9 semanas estimado)
4. **Configurar test infrastructure** (factories, fixtures, environments)

### Para Project Management:

1. **Priorizar epics** alineados con risk mitigation (R-001, R-002 primero)
2. **Asignar owners** para cada riesgo score ≥6
3. **Planificar sprint timeline** considerando 10-15 semanas para QA test development
4. **Programar review meeting** de los 3 documentos TEA (Architecture, QA, Handoff)

---

**Generated by:** TEA Master Test Architect
**Workflow:** `_bmad/tea/testarch/test-design`
**Version:** 5.0 (System-Level Handoff)
**Date:** 2026-03-08
**Mode:** System-Level (Phase 3)
**Status:** Ready for BMAD Integration
