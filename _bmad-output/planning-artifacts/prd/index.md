# Product Requirements Document - gmao-hiansa

## Table of Contents

- [Product Requirements Document - gmao-hiansa](#table-of-contents)
  - [stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-v-01-discovery', 'step-v-02-format-detection', 'step-v-03-density-validation', 'step-v-04-brief-coverage-validation', 'step-v-05-measurability-validation', 'step-v-06-traceability-validation', 'step-v-07-implementation-leakage-validation', 'step-v-08-domain-compliance-validation', 'step-v-09-project-type-validation', 'step-v-10-smart-validation', 'step-v-11-holistic-quality-validation', 'step-v-12-completeness-validation', 'step-v-13-report-complete', 'step-e-01-discovery', 'step-e-02-review', 'step-e-03-edit']
inputDocuments: [
'product-brief-gmao-hiansa-2026-02-26.md',
'brainstorming-session-2026-02-25.md',
'brainstorming-session-2026-02-25-ideas-detalladas.md'
]
documentCounts:
briefCount: 1
researchCount: 0
brainstormingCount: 2
projectDocsCount: 0
classification:
projectType: web_app
domain: general
complexity: medium
projectContext: greenfield
workflowType: 'prd'
date: '2026-03-07'
lastValidated: '2026-03-07'
validationRating: 4.5/5 EXCELLENT
validationStatus: PASS
author: Bernardo
project_name: gmao-hiansa](#stepscompleted-step-01-init-step-02-discovery-step-02b-vision-step-02c-executive-summary-step-03-success-step-04-journeys-step-05-domain-step-06-innovation-step-07-project-type-step-08-scoping-step-09-functional-step-10-nonfunctional-step-11-polish-step-v-01-discovery-step-v-02-format-detection-step-v-03-density-validation-step-v-04-brief-coverage-validation-step-v-05-measurability-validation-step-v-06-traceability-validation-step-v-07-implementation-leakage-validation-step-v-08-domain-compliance-validation-step-v-09-project-type-validation-step-v-10-smart-validation-step-v-11-holistic-quality-validation-step-v-12-completeness-validation-step-v-13-report-complete-step-e-01-discovery-step-e-02-review-step-e-03-edit-inputdocuments-product-brief-gmao-hiansa-2026-02-26md-brainstorming-session-2026-02-25md-brainstorming-session-2026-02-25-ideas-detalladasmd-documentcounts-briefcount-1-researchcount-0-brainstormingcount-2-projectdocscount-0-classification-projecttype-webapp-domain-general-complexity-medium-projectcontext-greenfield-workflowtype-prd-date-2026-03-07-lastvalidated-2026-03-07-validationrating-455-excellent-validationstatus-pass-author-bernardo-projectname-gmao-hiansa)
  - [Table of Contents](./table-of-contents.md)
  - [Executive Summary](./executive-summary.md)
    - [What Makes This Special](./executive-summary.md#what-makes-this-special)
  - [Success Criteria](./success-criteria.md)
    - [User Success](./success-criteria.md#user-success)
    - [Business Success](./success-criteria.md#business-success)
    - [Technical Success](./success-criteria.md#technical-success)
    - [Measurable Outcomes](./success-criteria.md#measurable-outcomes)
  - [User Journeys](./user-journeys.md)
    - [Journey de Carlos - Operario de Línea (25 años)](./user-journeys.md#journey-de-carlos-operario-de-lnea-25-aos)
    - [Journey de María - Técnica de Mantenimiento (28 años)](./user-journeys.md#journey-de-mara-tcnica-de-mantenimiento-28-aos)
    - [Journey de Javier - Supervisor de Mantenimiento (32 años)](./user-journeys.md#journey-de-javier-supervisor-de-mantenimiento-32-aos)
    - [Journey de Elena - Administrador / Jefa de Mantenimiento (38 años)](./user-journeys.md#journey-de-elena-administrador-jefa-de-mantenimiento-38-aos)
    - [Journey de Pedro - Usuario con Capacidad de Gestión de Stock (35 años)](./user-journeys.md#journey-de-pedro-usuario-con-capacidad-de-gestin-de-stock-35-aos)
  - [Visual Specifications](./visual-specifications.md)
    - [Design System](./visual-specifications.md#design-system)
    - [Key Screen Specifications](./visual-specifications.md#key-screen-specifications)
      - [Screen 1: Kanban Dashboard (Supervisor View)](./visual-specifications.md#screen-1-kanban-dashboard-supervisor-view)
      - [Screen 2: Formulario Reportar Avería (Operario View)](./visual-specifications.md#screen-2-formulario-reportar-avera-operario-view)
      - [Screen 3: Dashboard KPIs (Director/Admin View)](./visual-specifications.md#screen-3-dashboard-kpis-directoradmin-view)
    - [Iconography](./visual-specifications.md#iconography)
    - [Accessibility Notes](./visual-specifications.md#accessibility-notes)
  - [Domain-Specific Requirements](./domain-specific-requirements.md)
    - [Mantenimiento Reglamentario y Certificaciones Obligatorias](./domain-specific-requirements.md#mantenimiento-reglamentario-y-certificaciones-obligatorias)
      - [Categorías de Equipos con Mantenimiento Reglamentario](./domain-specific-requirements.md#categoras-de-equipos-con-mantenimiento-reglamentario)
      - [Niveles de Inspección (A, B, C)](./domain-specific-requirements.md#niveles-de-inspeccin-a-b-c)
      - [Requisitos del Sistema](./domain-specific-requirements.md#requisitos-del-sistema)
  - [Web App Specific Requirements](./web-app-specific-requirements.md)
    - [Project-Type Overview](./web-app-specific-requirements.md#project-type-overview)
    - [Responsive Design](./web-app-specific-requirements.md#responsive-design)
    - [Performance Targets](./web-app-specific-requirements.md#performance-targets)
    - [Browser Support](./web-app-specific-requirements.md#browser-support)
    - [SEO Strategy](./web-app-specific-requirements.md#seo-strategy)
    - [Accessibility Level](./web-app-specific-requirements.md#accessibility-level)
    - [Implementation Considerations](./web-app-specific-requirements.md#implementation-considerations)
  - [Project Scoping & Phased Development](./project-scoping-phased-development.md)
    - [MVP Strategy & Philosophy](./project-scoping-phased-development.md#mvp-strategy-philosophy)
    - [MVP Feature Set (Phase 1)](./project-scoping-phased-development.md#mvp-feature-set-phase-1)
    - [Post-MVP Features](./project-scoping-phased-development.md#post-mvp-features)
      - [Phase 1.5 (Primer módulo post-deploy - Gate 3 meses)](./project-scoping-phased-development.md#phase-15-primer-mdulo-post-deploy-gate-3-meses)
      - [Phase 2 (6 meses - Post-MVP)](./project-scoping-phased-development.md#phase-2-6-meses-post-mvp)
      - [Phase 3 (12 meses - Expansion)](./project-scoping-phased-development.md#phase-3-12-meses-expansion)
      - [Phase 4 (18 meses - Optimización)](./project-scoping-phased-development.md#phase-4-18-meses-optimizacin)
    - [Risk Mitigation Strategy](./project-scoping-phased-development.md#risk-mitigation-strategy)
      - [Technical Risks](./project-scoping-phased-development.md#technical-risks)
      - [Market Risks](./project-scoping-phased-development.md#market-risks)
      - [Resource Risks](./project-scoping-phased-development.md#resource-risks)
    - [Phased Development Summary](./project-scoping-phased-development.md#phased-development-summary)
  - [Functional Requirements](./functional-requirements.md)
    - [1. Gestión de Averías](./functional-requirements.md#1-gestin-de-averas)
    - [2. Gestión de Órdenes de Trabajo](./functional-requirements.md#2-gestin-de-rdenes-de-trabajo)
      - [Vista Kanban](./functional-requirements.md#vista-kanban)
      - [Vista de Listado](./functional-requirements.md#vista-de-listado)
    - [3. Gestión de Activos](./functional-requirements.md#3-gestin-de-activos)
    - [4. Gestión de Repuestos](./functional-requirements.md#4-gestin-de-repuestos)
    - [5. Gestión de Usuarios, Roles y Capacidades](./functional-requirements.md#5-gestin-de-usuarios-roles-y-capacidades)
      - [Perfil de Usuario](./functional-requirements.md#perfil-de-usuario)
      - [Flujo de Onboarding y Primer Acceso](./functional-requirements.md#flujo-de-onboarding-y-primer-acceso)
      - [Control de Acceso por Módulos](./functional-requirements.md#control-de-acceso-por-mdulos)
    - [6. Gestión de Proveedores](./functional-requirements.md#6-gestin-de-proveedores)
    - [7. Gestión de Rutinas de Mantenimiento](./functional-requirements.md#7-gestin-de-rutinas-de-mantenimiento)
    - [8. Análisis y Reportes](./functional-requirements.md#8-anlisis-y-reportes)
      - [KPIs y Métricas](./functional-requirements.md#kpis-y-mtricas)
      - [Dashboard Común con Navegación por Capacidades](./functional-requirements.md#dashboard-comn-con-navegacin-por-capacidades)
      - [Diferencia entre "Mis OTs" y "Ver Kanban"](./functional-requirements.md#diferencia-entre-mis-ots-y-ver-kanban)
    - [9. Sincronización y Acceso Multi-Dispositivo](./functional-requirements.md#9-sincronizacin-y-acceso-multi-dispositivo)
    - [10. Funcionalidades Adicionales](./functional-requirements.md#10-funcionalidades-adicionales)
  - [Non-Functional Requirements](./non-functional-requirements.md)
    - [Performance](./non-functional-requirements.md#performance)
    - [Security](./non-functional-requirements.md#security)
    - [Scalability](./non-functional-requirements.md#scalability)
    - [Accessibility](./non-functional-requirements.md#accessibility)
    - [Reliability](./non-functional-requirements.md#reliability)
    - [Integration](./non-functional-requirements.md#integration)
