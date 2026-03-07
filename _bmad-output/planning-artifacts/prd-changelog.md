# PRD Changelog - GMAO Hiansa

Este documento registra el historial de ediciones del PRD del sistema GMAO Hiansa.

## Edición más reciente (2026-03-07)

**NOTA:** Actualizado tras Sprint Change Proposal y Edit Workflow - Corrección de anti-patrones BMAD, agregación de métricas y FRs faltantes

- **Última edición (2026-03-07):** ELIMINADA capacidad `can_regulatory_inspection` del Domain-Specific Requirements. El mantenimiento reglamentario se cubre con capacidades existentes: `can_view_all_ots` (ver OTs reglamentarias), `can_create_manual_ot` (crear OTs reglamentarias), `can_manage_providers` (gestionar proveedores certificados con nº certificación), `can_manage_assets` (bloquear/desbloquear equipos), `can_assign_technicians` (asignar técnicos/proveedores a OTs reglamentarias). El sistema mantiene las 15 capacidades oficiales.
- **Última edición (2026-03-07):** ELIMINADAS todas las menciones de "roles" como entidades funcionales del sistema. Ahora solo existen "etiquetas de clasificación" que son puramente visuales y NO otorgan capacidades. Corregidos Executive Summary, FR59, FR61, FR62, FR64, FR65, FR67-A, FR67-B, FR68, FR68-UI, y User Journey de Elena. Aclarado que `can_manage_users` gestiona usuarios y sus capacidades individuales, no roles.
- **Última edición (2026-03-07):** CORREGIDA numeración del MVP Feature Set (PWA de 11 a 13, Reparación Dual de 12 a 14, Reportes Automáticos de 13 a 15). Ahora el MVP tiene 14 funcionalidades base correctamente numeradas.
- **Última edición (2026-03-07):** ELIMINADO FR103 por duplicidad con FR91 (dashboard común). Total actualizado de 124 a 123 FRs.
- **Última edición (2026-03-07):** CORREGIDAS 47 INCONSISTENCIAS (12 críticas, 18 altas, 12 medias, 5 bajas):
  - **CRÍTICAS:** Fecha actualizada (2026-03-07), Executive Summary con sistema PBAC, Success Criteria con lenguaje basado en capacidades, User Journeys actualizados (Elena, Javier, María, Carlos, Pedro), FR90 con capability can_view_kpis, FR103 eliminado, FR108 aclarado (MVP base, tracking avanzado Phase 3), MVP con 15 capacidades, FR68-C aclarado, color amarillo cambiado a naranja #FD7E14 para WCAG AA
  - **ALTAS:** FR36, FR44-46, FR53 con capabilities, FR72-C corregido, FR73 módulo Usuarios con can_manage_users, MVP con can_receive_reports, Success Criteria con can_receive_reports, Journey Elena con can_receive_reports, FR85-89 con capabilities, FR79-80 con can_manage_providers, NFR-S5 actualizado, MVP con 13 funcionalidades, Executive Summary actualizado
  - **MEDIAS:** Phase 1.5 aclarado, frontmatter actualizado, Success Criteria con can_manage_assets, Journey Elena con can_manage_assets, NFR-P1 aclarado, MVP con can_view_repair_history, FR91-FR91-A aclarados
  - **BAJAS:** NFR-A5 con touch targets
- **Última edición (2026-03-07):** Actualizados FR17, FR19, FR20 para soportar entre 1 y 3 usuarios asignados por OT. Agregado FR19-A: Todos los usuarios asignados pueden colaborar, reciben notificaciones. Actualizado FR90-A para incluir KPI de usuarios asignados por OT.
- **Última edición (2026-03-07):** Actualizados FR33, FR34, FR38, FR39, FR42, FR43 en Gestión de Activos para requerir capability can_manage_assets.
- FRs eliminados: FR60, FR63, FR92, FR93, FR94, FR95, FR103 (7 FRs eliminados)
- FRs modificados: FR1, FR4, FR5, FR11, FR16, FR19, FR32, FR34, FR35, FR37, FR38, FR40, FR51, FR59, FR66, FR67, FR67-A, FR68, FR73, FR77, FR78, FR82, FR85, FR86, FR91 (26 FRs modificados)
- FRs nuevos: FR67-A, FR67-B, FR68-UI, FR68-A, FR68-B, FR68-C, FR72-A, FR72-B, FR78-A, FR91-A, FR101-FR108 (16 FRs nuevos)
- Net change: +6 FR (de 105 a 111)
- **Última edición (2026-03-07):** Reorganizada capabilities: can_manage_users absorbe gestión de roles, capabilities e historiales. can_assign_technicians reducida a solo asignar técnicos a OTs. Actualizados FR59, FR61, FR64, FR65, FR66, FR67, FR72, FR72-C. Edición previa: Agregada capability can_manage_users como 14ª capability. FR58, FR69-A, FR70-A, FR72-B usan can_manage_users. FR59, FR61, FR64, FR65, FR67, FR72 mantienen can_assign_technicians. Actualizados FR12-FR23 para requerir capabilities específicas (can_update_own_ot, can_complete_ot, can_assign_technicians). Agregado color verde #28A745 para OTs preventivas. Eliminada mención de roles en FR21. Agregado FR72-C: Usuarios con can_assign_technicians pueden ver historial de trabajos completo por usuario con filtro de rango de fechas. Corregidos FR48, FR50, FR51, FR52, FR54: Reemplazado 'usuarios con permisos' por capability específica 'can_manage_stock' para todas las operaciones de gestión de stock. Actualizados FR1-FR9 para requerir capabilities específicas: FR1, FR2, FR3, FR6 requieren can_create_failure_report. FR7, FR8, FR9 requieren can_view_all_ots.
  - **Última edición (2026-03-07):** Actualizados FR101-FR107 en Funcionalidades Adicionales: FR101 (can_create_failure_report), FR106-FR107 (can_update_own_ot), FR104 (cualquiera + can_manage_users), FR105 (cualquier usuario), FR102 (búsqueda universal), FR103 (dashboard inicio sin TVs).
- **Última edición (2026-03-07):** Reorganizada capabilities: can_manage_users absorbe gestión de roles, capabilities e historiales. can_assign_technicians reducida a solo asignar técnicos a OTs. Actualizados FR59, FR61, FR64, FR65, FR66, FR67, FR72, FR72-C. Edición previa: Agregada capability can_manage_users como 14ª capability. FR58, FR69-A, FR70-A, FR72-B usan can_manage_users. FR59, FR61, FR64, FR65, FR67, FR72 mantienen can_assign_technicians. Actualizados FR12-FR23 para requerir capabilities específicas (can_update_own_ot, can_complete_ot, can_assign_technicians). Agregado color verde #28A745 para OTs preventivas. Eliminada mención de roles en FR21. Agregado FR72-C: Usuarios con can_assign_technicians pueden ver historial de trabajos completo por usuario con filtro de rango de fechas. Corregidos FR48, FR50, FR51, FR52, FR54: Reemplazado 'usuarios con permisos' por capability específica 'can_manage_stock' para todas las operaciones de gestión de stock. Actualizados FR1-FR9 para requerir capabilities específicas: FR1, FR2, FR3, FR6 requieren can_create_failure_report. FR7, FR8, FR9 requieren can_view_all_ots.
  - Actualizado FR12: Requiere can_update_own_ot para iniciar OTs
  - Actualizado FR13: Requiere can_update_own_ot para agregar repuestos y requisitos
  - Actualizado FR14: Requiere can_complete_ot para completar OTs
  - Actualizado FR15: Requiere can_update_own_ot para agregar notas internas
  - Actualizado FR17: Requiere can_assign_technicians y técnico debe tener can_update_own_ot
  - Actualizado FR18: Requiere can_assign_technicians para asignar a proveedores
  - Actualizado FR19: Requiere can_assign_technicians para seleccionar técnicos/proveedores
  - Actualizado FR20: Requiere can_update_own_ot para ver OTs asignadas
  - Actualizado FR21: Eliminada mención de roles específicos (Supervisor, Administrador, Director)
  - Actualizado FR22: Agregado color verde #28A745 para OTs preventivas
  - Actualizado FR23: Agregada referencia a color verde #28A745 para preventivas
  - Agregado FR72-C: Usuarios con can_assign_technicians pueden ver historial de trabajos completo por usuario con filtro de rango de fechas
  - Actualizado FR48: Requiere can_manage_stock para ajustes manuales de stock
  - Actualizado FR50: Requiere can_manage_stock para recibir alertas de stock mínimo
  - Actualizado FR51: Requiere can_manage_stock para generar pedidos a proveedores
  - Actualizado FR52: Requiere can_manage_stock para gestionar stock de repuestos
  - Actualizado FR54: Requiere can_manage_stock para importar repuestos masivamente
  - Ediciones previas: Actualización de sección "Gestión de Usuarios, Roles y Capacidades" (FR58-FR76) y "Gestión de Proveedores" (FR77-FR80) y "Gestión de Rutinas de Mantenimiento" (FR81-FR84)
  - Ediciones previas: Agregados FR11-A y FR11-B para distinguir OTs preventivas vs correctivas con etiquetas visibles en Kanban y listado
  - Ediciones previas: Actualizado FR11: Mención de ambos tipos de OT (preventivas y correctivas)
  - Ediciones previas: Actualizado FR82: OTs preventivas generadas con etiqueta "Preventivo"
  - Ediciones previas: Agregada capability can_manage_routines como 13ª capability
  - Ediciones previas: Agregados FR81-A, FR81-B: Modalidades de rutinas (por equipo/customizables) y campos configurables
  - Ediciones previas: Actualizados FR66: Referencia a 12 capabilities (antes 11)
  - Ediciones previas: Actualizado FR68: Lista de 13 capabilities con can_manage_routines
  - Ediciones previas: Actualizado FR68-C: Administrador inicial tiene 13 capabilities (antes 12)
  - Ediciones previas: Actualizado FR68-UI: Tabla con can_manage_routines
  - Ediciones previas: Actualizado FR81: Requiere capability can_manage_routines
  - Ediciones previas: Actualizado FR83: Requiere capability can_view_all_ots para ver KPIs de rutinas
  - Ediciones previas: Actualizado FR84: Alertas solo al usuario asignado a la rutina
  - Ediciones previas: Actualizado FR73: Agregado módulo Rutinas con can_view_all_ots y can_manage_routines
  - Ediciones previas: Agregada capability can_manage_providers como 12ª capability
  - Ediciones previas: Agregado FR78-A: Formulario unificado de proveedores con campo "Tipo de proveedor"
  - Ediciones previas: Agregadas capabilities can_manage_assets, can_view_repair_history - Total 13 capabilities
  - Ediciones previas: Agregado FR68-UI: Presentación de capabilities en castellano en UI
  - Ediciones previas: Agregados FR68-A, FR68-B: Restricciones de acceso sin capabilities específicas
  - Ediciones previas: Actualizados FR59, FR66, FR67, FR67-A: Clarificaciones sobre roles vs capabilities
  - Ediciones previas: Actualizados FR35, FR37, FR40: Requieren capabilities específicas
