# gmao-hiansa - Epic Breakdown

## Table of Contents

- [gmao-hiansa - Epic Breakdown](#table-of-contents)
  - [stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-02-approved', 'step-03-create-stories', 'step-03-approved']
inputDocuments: [
'prd.md',
'architecture.md',
'ux-design-specification.md'
]
workflowType: 'create-epics-and-stories'
lastStep: 3
status: 'complete'
completedAt: '2026-03-07'
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-07'
requirementsExtraction:
functionalRequirements: 123
nonFunctionalRequirements: 37
additionalArchitectureRequirements: 25
additionalUXRequirements: 30
technicalDecisions:
realTimeTechnology: 'SSE (Server-Sent Events)'
heartbeatInterval: '30 seconds'
hosting: 'Vercel serverless compatible'
epicsDesign:
totalEpics: 10
epic1_story_1_1: 'Puesta en Marcha y Configuración Inicial'
frCoverage: '110 of 123 FRs covered (excluding deleted FRs)'
storiesGenerated: 66
epicStatus:
Epic 1: 'COMPLETE (11 stories)'
Epic 2: 'COMPLETE (9 stories)'
Epic 3: 'COMPLETE (6 stories)'
Epic 4: 'COMPLETE (9 stories)'
Epic 5: 'COMPLETE (7 stories)'
Epic 6: 'COMPLETE (2 stories)'
Epic 7: 'COMPLETE (4 stories)'
Epic 8: 'COMPLETE (6 stories)'
Epic 9: 'COMPLETE (5 stories)'
Epic 10: 'COMPLETE (7 stories)'](#stepscompleted-step-01-validate-prerequisites-step-02-design-epics-step-02-approved-step-03-create-stories-step-03-approved-inputdocuments-prdmd-architecturemd-ux-design-specificationmd-workflowtype-create-epics-and-stories-laststep-3-status-complete-completedat-2026-03-07-projectname-gmao-hiansa-username-bernardo-date-2026-03-07-requirementsextraction-functionalrequirements-123-nonfunctionalrequirements-37-additionalarchitecturerequirements-25-additionaluxrequirements-30-technicaldecisions-realtimetechnology-sse-server-sent-events-heartbeatinterval-30-seconds-hosting-vercel-serverless-compatible-epicsdesign-totalepics-10-epic1story11-puesta-en-marcha-y-configuracin-inicial-frcoverage-110-of-123-frs-covered-excluding-deleted-frs-storiesgenerated-66-epicstatus-epic-1-complete-11-stories-epic-2-complete-9-stories-epic-3-complete-6-stories-epic-4-complete-9-stories-epic-5-complete-7-stories-epic-6-complete-2-stories-epic-7-complete-4-stories-epic-8-complete-6-stories-epic-9-complete-5-stories-epic-10-complete-7-stories)
  - [Overview](./overview.md)
  - [Requirements Inventory](./requirements-inventory.md)
    - [Functional Requirements](./requirements-inventory.md#functional-requirements)
    - [NonFunctional Requirements](./requirements-inventory.md#nonfunctional-requirements)
    - [Additional Requirements](./requirements-inventory.md#additional-requirements)
    - [FR Coverage Map](./requirements-inventory.md#fr-coverage-map)
  - [Epic List](./epic-list.md)
    - [Epic 1: Autenticación y Gestión de Usuarios PBAC](./epic-list.md#epic-1-autenticacin-y-gestin-de-usuarios-pbac)
    - [Epic 2: Gestión de Activos y Jerarquía de 5 Niveles](./epic-list.md#epic-2-gestin-de-activos-y-jerarqua-de-5-niveles)
    - [Epic 3: Reporte de Averías en Segundos](./epic-list.md#epic-3-reporte-de-averas-en-segundos)
    - [Epic 4: Órdenes de Trabajo y Kanban Digital](./epic-list.md#epic-4-rdenes-de-trabajo-y-kanban-digital)
    - [Epic 5: Control de Stock y Repuestos](./epic-list.md#epic-5-control-de-stock-y-repuestos)
    - [Epic 6: Gestión de Proveedores](./epic-list.md#epic-6-gestin-de-proveedores)
    - [Epic 7: Rutinas de Mantenimiento y Generación Automática](./epic-list.md#epic-7-rutinas-de-mantenimiento-y-generacin-automtica)
    - [Epic 8: KPIs, Dashboard y Reportes Automáticos](./epic-list.md#epic-8-kpis-dashboard-y-reportes-automticos)
    - [Epic 9: Sincronización Multi-Dispositivo y PWA](./epic-list.md#epic-9-sincronizacin-multi-dispositivo-y-pwa)
    - [Epic 10: Funcionalidades Adicionales y UX Avanzada](./epic-list.md#epic-10-funcionalidades-adicionales-y-ux-avanzada)
  - [Epic 1: Autenticación y Gestión de Usuarios PBAC](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md)
    - [Story 1.1: Puesta en Marcha y Configuración Inicial del Proyecto](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-11-puesta-en-marcha-y-configuracin-inicial-del-proyecto)
    - [Story 1.2: Modelo de Datos de Usuarios y Capabilities PBAC](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-12-modelo-de-datos-de-usuarios-y-capabilities-pbac)
    - [Story 1.3: Registro de Usuarios por Administrador](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-13-registro-de-usuarios-por-administrador)
    - [Story 1.4: Login de Usuarios con NextAuth](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-14-login-de-usuarios-con-nextauth)
    - [Story 1.5: Cambio de Contraseña Obligatorio en Primer Acceso](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-15-cambio-de-contrasea-obligatorio-en-primer-acceso)
    - [Story 1.6: Gestión de Capabilities por Administrador](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-16-gestin-de-capabilities-por-administrador)
    - [Story 1.7: Etiquetas de Clasificación Visual](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-17-etiquetas-de-clasificacin-visual)
    - [Story 1.8: Perfil de Usuario y Gestión de Credenciales](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-18-perfil-de-usuario-y-gestin-de-credenciales)
    - [Story 1.9: Historial de Actividad de Usuarios](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-19-historial-de-actividad-de-usuarios)
    - [Story 1.10: Eliminación de Usuarios por Administrador](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-110-eliminacin-de-usuarios-por-administrador)
    - [Story 1.11: Control de Acceso por Módulos](./epic-1-autenticacin-y-gestin-de-usuarios-pbac.md#story-111-control-de-acceso-por-mdulos)
  - [✅ Epic 1 Completado - Resumen](./epic-1-completado-resumen.md)
  - [Epic 2: Gestión de Activos y Jerarquía de 5 Niveles](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md)
    - [Story 2.1: Modelo de Datos de Jerarquía de 5 Niveles](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-21-modelo-de-datos-de-jerarqua-de-5-niveles)
    - [Story 2.2: Gestión de Plantas y Líneas](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-22-gestin-de-plantas-y-lneas)
    - [Story 2.3: Gestión de Equipos con Estados](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-23-gestin-de-equipos-con-estados)
    - [Story 2.4: Gestión de Componentes con Relaciones Muchos-a-Muchos](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-24-gestin-de-componentes-con-relaciones-muchos-a-muchos)
    - [Story 2.6: Navegación Jerárquica de Activos](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-26-navegacin-jerrquica-de-activos)
    - [Story 2.7: Historial de Reparaciones por Equipo](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-27-historial-de-reparaciones-por-equipo)
    - [Story 2.8: Importación Masiva CSV de Activos](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-28-importacin-masiva-csv-de-activos)
    - [Story 2.9: Códigos QR para Identificación de Equipos](./epic-2-gestin-de-activos-y-jerarqua-de-5-niveles.md#story-29-cdigos-qr-para-identificacin-de-equipos)
  - [✅ Epic 2 Completado - Resumen](./epic-2-completado-resumen.md)
  - [Estado: Epic 2 COMPLETADO.](#estado-epic-2-completado)
  - [Epic 4: Órdenes de Trabajo y Kanban Digital](./epic-4-rdenes-de-trabajo-y-kanban-digital.md)
    - [Story 4.1: Modelo de Datos de Órdenes de Trabajo](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-41-modelo-de-datos-de-rdenes-de-trabajo)
    - [Story 4.2: Creación Manual de OTs](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-42-creacin-manual-de-ots)
    - [Story 4.3: Kanban Digital 8 Columnas](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-43-kanban-digital-8-columnas)
    - [Story 4.4: Gestión de Estados por Técnico](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-44-gestin-de-estados-por-tcnico)
    - [Story 4.5: Asignación Múltiple 1-3 Técnicos/Proveedores](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-45-asignacin-mltiple-1-3-tcnicosproveedores)
    - [Story 4.6: Confirmación Recepción Reparación Externa](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-46-confirmacin-recepcin-reparacin-externa)
    - [Story 4.7: Vista Listado con Filtros Avanzados](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-47-vista-listado-con-filtros-avanzados)
    - [Story 4.8: Comentarios, Fotos y Notas](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-48-comentarios-fotos-y-notas)
    - [Story 4.9: Sincronización SSE y Toggle Vistas](./epic-4-rdenes-de-trabajo-y-kanban-digital.md#story-49-sincronizacin-sse-y-toggle-vistas)
  - [Epic 5: Control de Stock y Repuestos](./epic-5-control-de-stock-y-repuestos.md)
    - [Story 5.1: Modelo de Datos de Repuestos de Stock](./epic-5-control-de-stock-y-repuestos.md#story-51-modelo-de-datos-de-repuestos-de-stock)
    - [Story 5.2: Vista de Stock en Tiempo Real](./epic-5-control-de-stock-y-repuestos.md#story-52-vista-de-stock-en-tiempo-real)
    - [Story 5.3: Actualización Silenciosa de Stock](./epic-5-control-de-stock-y-repuestos.md#story-53-actualizacin-silenciosa-de-stock)
    - [Story 5.4: Alertas de Stock Mínimo](./epic-5-control-de-stock-y-repuestos.md#story-54-alertas-de-stock-mnimo)
    - [Story 5.5: Gestión de Stock y Ajustes Manuales](./epic-5-control-de-stock-y-repuestos.md#story-55-gestin-de-stock-y-ajustes-manuales)
    - [Story 5.6: Generación de Pedidos a Proveedores](./epic-5-control-de-stock-y-repuestos.md#story-56-generacin-de-pedidos-a-proveedores)
    - [Story 5.7: Importación Masiva CSV de Repuestos](./epic-5-control-de-stock-y-repuestos.md#story-57-importacin-masiva-csv-de-repuestos)
  - [Epic 6: Gestión de Proveedores](./epic-6-gestin-de-proveedores.md)
    - [Story 6.1: CRUD de Proveedores](./epic-6-gestin-de-proveedores.md#story-61-crud-de-proveedores)
    - [Story 6.2: 6 Tipos de Servicio](./epic-6-gestin-de-proveedores.md#story-62-6-tipos-de-servicio)
  - [Epic 7: Rutinas de Mantenimiento y Generación Automática](./epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md)
    - [Story 7.1: Configuración de Rutinas](./epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md#story-71-configuracin-de-rutinas)
    - [Story 7.2: Generación Automática de OTs Preventivas](./epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md#story-72-generacin-automtica-de-ots-preventivas)
    - [Story 7.3: Alertas de Vencimiento](./epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md#story-73-alertas-de-vencimiento)
    - [Story 7.4: Dashboard de Cumplimiento](./epic-7-rutinas-de-mantenimiento-y-generacin-automtica.md#story-74-dashboard-de-cumplimiento)
  - [Epic 8: KPIs, Dashboard y Reportes Automáticos](./epic-8-kpis-dashboard-y-reportes-automticos.md)
    - [Story 8.1: Dashboard Común con KPIs Básicos](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-81-dashboard-comn-con-kpis-bsicos)
    - [Story 8.2: Drill-down Multi-Nivel de KPIs](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-82-drill-down-multi-nivel-de-kpis)
    - [Story 8.3: Alertas Accionables](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-83-alertas-accionables)
    - [Story 8.4: Exportación Excel](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-84-exportacin-excel)
    - [Story 8.5: Reportes Automáticos PDF por Email](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-85-reportes-automticos-pdf-por-email)
    - [Story 8.6: Configuración de Reportes por Usuario](./epic-8-kpis-dashboard-y-reportes-automticos.md#story-86-configuracin-de-reportes-por-usuario)
  - [Epic 9: Sincronización Multi-Dispositivo y PWA](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md)
    - [Story 9.1: Responsive Design 3 Breakpoints](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md#story-91-responsive-design-3-breakpoints)
    - [Story 9.2: Kanban Responsive](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md#story-92-kanban-responsive)
    - [Story 9.3: PWA Instalable](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md#story-93-pwa-instalable)
    - [Story 9.4: Notificaciones Push](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md#story-94-notificaciones-push)
    - [Story 9.5: SSE para Sincronización](./epic-9-sincronizacin-multi-dispositivo-y-pwa.md#story-95-sse-para-sincronizacin)
  - [Epic 10: Funcionalidades Adicionales y UX Avanzada](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md)
    - [Story 10.1: Rechazo de Reparación](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-101-rechazo-de-reparacin)
    - [Story 10.2: Búsqueda Universal](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-102-bsqueda-universal)
    - [Story 10.3: Historial de Acciones](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-103-historial-de-acciones)
    - [Story 10.4: Preferencias de Notificación](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-104-preferencias-de-notificacin)
    - [Story 10.5: Comentarios con Timestamp](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-105-comentarios-con-timestamp)
    - [Story 10.6: Fotos Antes/Después](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-106-fotos-antesdespus)
    - [Story 10.7: Códigos QR (Funcionalidad Base)](./epic-10-funcionalidades-adicionales-y-ux-avanzada.md#story-107-cdigos-qr-funcionalidad-base)
  - [✅ Resumen Final de Todos los Epics](./resumen-final-de-todos-los-epics.md)
