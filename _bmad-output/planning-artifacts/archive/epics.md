---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-02-approved', 'step-03-create-stories', 'step-03-approved']
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
    Epic 10: 'COMPLETE (7 stories)'
---

# gmao-hiansa - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for gmao-hiansa, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. Gestión de Averías (FR1-FR10):**

FR1: Los usuarios con capability `can_create_failure_report` pueden crear avisos de avería asociados a equipos de la jerarquía de activos

FR2: Los usuarios con capability `can_create_failure_report` pueden agregar una descripción textual del problema al crear un aviso

FR3: Los usuarios con capability `can_create_failure_report` pueden adjuntar una foto opcional al reportar una avería

FR4: Los usuarios reciben notificaciones push dentro de los 30 segundos siguientes al cambio de estado de su aviso (recibido, autorizado, en progreso, completado)

FR5: Los operarios pueden confirmar si una reparación funciona correctamente después de completada y reciben confirmación con número de aviso generado dentro de los 3 segundos

FR6: Los usuarios con capability `can_create_failure_report` pueden realizar búsqueda predictiva de equipos durante la creación de avisos

FR7: Los usuarios con capability `can_view_all_ots` pueden ver todos los avisos nuevos en una columna de triage

FR8: Los usuarios con capability `can_view_all_ots` pueden convertir avisos en órdenes de trabajo

FR9: Los usuarios con capability `can_view_all_ots` pueden descartar avisos que no son procedentes

FR10: Se pueden distinguir visualmente entre avisos de avería (color rosa #FFC0CB) y reparación (color blanco #FFFFFF)

**2. Gestión de Órdenes de Trabajo (FR11-FR31):**

FR11: Las órdenes de trabajo (tanto preventivas como correctivas) tienen 8 estados posibles: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada

FR11-A: Las órdenes de trabajo tienen un atributo de "tipo de mantenimiento" que las clasifica como: Preventivo (generadas desde rutinas) o Correctivo (generadas desde reportes de averías). Este tipo es visible tanto en la vista de listado como en las tarjetas Kanban

FR11-B: Las OTs de mantenimiento preventivo muestran la etiqueta "Preventivo" en tarjetas Kanban y listado. Las OTs de mantenimiento correctivo muestran la etiqueta "Correctivo" en las mismas vistas

FR12: Los usuarios con capability `can_update_own_ot` pueden iniciar una orden de trabajo asignada cambiando su estado a "En Progreso"

FR13: Los usuarios con capability `can_update_own_ot` pueden agregar repuestos usados y requisitos durante el cumplimiento de una orden de trabajo asignada

FR14: Los usuarios con capability `can_complete_ot` pueden completar (validar) una orden de trabajo

FR15: Los usuarios con capability `can_update_own_ot` pueden agregar notas internas a una orden de trabajo asignada

FR16: El stock de repuestos se actualiza en tiempo real (dentro de 1 segundo) al registrar uso. Las actualizaciones de stock son silenciosas (sin enviar notificaciones a usuarios con `can_manage_stock`) para evitar spam de notificaciones por actualizaciones masivas

FR17: Los usuarios con capability `can_assign_technicians` pueden asignar de 1 a 3 técnicos internos a cada orden de trabajo, todos deben tener la capability `can_update_own_ot`

FR18: Los usuarios con capability `can_assign_technicians` pueden asignar órdenes de trabajo a proveedores externos

FR19: Los usuarios con capability `can_assign_technicians` pueden seleccionar de 1 a 3 técnicos (que tengan `can_update_own_ot`) o proveedores según el tipo de orden de trabajo, filtrando técnicos disponibles por habilidades y ubicación. Todos los usuarios asignados reciben notificaciones de la OT

FR19-A: Cuando una orden de trabajo tiene múltiples usuarios asignados, cualquiera de ellos puede agregar repuestos usados, actualizar estado o completar la OT. Todos los usuarios asignados reciben notificaciones de cambios de estado y actualizaciones de la OT

FR20: Los usuarios con capability `can_view_own_ots` pueden ver todas las órdenes de trabajo donde están asignados en su dashboard personal

FR21: Los usuarios con capability `can_view_all_ots` pueden ver todas las órdenes de trabajo de la organización. La vista de listado incluye una columna "Asignaciones" que muestra la distribución de usuarios asignados (ej: "2 técnicos / 1 proveedor" cuando hay múltiples asignados)

FR22: Se pueden distinguir visualmente entre órdenes de preventivo (color verde #28A745), correctivo propio (color rojizo #DC3545) y correctivo externo (color rojo con línea blanca #DC3545 con borde #FFFFFF)

FR23: Se pueden distinguir visualmente entre órdenes de reparación interna (taller propio, color naranja #FD7E14) y reparación enviada a proveedor (color azul #17A2B8). Las órdenes de preventivo usan color verde #28A745

FR24: Se pueden ver detalles completos de una orden de trabajo (fechas, origen, técnico, repuestos) en modal informativo

FR24-A: Cuando un proveedor marca una orden de reparación como completada, los usuarios con capability `can_assign_technicians` pueden confirmar la recepción del equipo reparado antes de marcar la OT como completada. La confirmación requiere verificación visual del estado del reparado

FR25: Los usuarios con capacidad `can_create_manual_ot` pueden crear órdenes de trabajo manuales sin partir de un aviso

FR26: Se puede acceder a una vista de listado de todas las órdenes de trabajo

FR27: Se puede filtrar el listado de órdenes de trabajo por 5 criterios: estado, técnico, fecha, tipo, equipo

FR28: Se puede ordenar el listado de órdenes de trabajo por cualquier columna

FR29: Se pueden realizar las mismas acciones en la vista de listado que en el Kanban (asignar, iniciar, completar, ver detalles)

FR30: Se puede alternar entre vista Kanban y vista de listado

FR31: Las vistas Kanban y de listado mantienen sincronización en tiempo real (cambios se reflejan en ambas)

**3. Gestión de Activos (FR32-FR43):**

FR32: El sistema maneja jerarquía de activos de 5 niveles: Planta → Línea → Equipo → Componente → Repuesto

FR33: Los usuarios con capability `can_manage_assets` pueden navegar la jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto) en cualquier dirección

FR34: Los usuarios con capability `can_manage_assets` pueden asociar un componente a múltiples equipos

FR35: Los usuarios con capability `can_view_repair_history` pueden ver el historial de reparaciones de un equipo (todas las OTs completadas con fechas, repuestos usados, técnicos asignados)

FR36: Los usuarios con capability `can_manage_assets` pueden gestionar 5 estados para equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado)

FR37: Los usuarios con capability `can_manage_assets` pueden cambiar el estado de un equipo

FR38: Los usuarios con capability `can_manage_assets` pueden ver el stock de equipos completos reutilizables con contador de cantidades por estado (Disponible, En Uso, En Reparación, Descartado)

FR39: Los usuarios con capability `can_manage_assets` pueden rastrear la ubicación actual de equipos reutilizables por área de fábrica asignada, último técnico con custodia, o estado de reserva actual

FR40: Los usuarios con capability `can_manage_assets` pueden importar activos masivamente desde un archivo CSV

FR41: La estructura jerárquica se valida automáticamente durante la importación masiva de activos

FR42: Los usuarios con capability `can_manage_assets` pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)

FR43: Los usuarios con capability `can_manage_assets` pueden descargar una plantilla de importación con el formato requerido

**4. Gestión de Repuestos (FR44-FR56):**

FR44: Todos los usuarios pueden acceder al catálogo de repuestos consumibles en modo consulta (sin capability específica)

FR45: Todos los usuarios pueden ver el stock actual de cada repuesto en tiempo real (sin capability específica)

FR46: Todos los usuarios pueden ver la ubicación física de cada repuesto en el almacén (sin capability específica)

FR47: Los usuarios ven el stock y ubicación al seleccionar un repuesto para uso

FR48: Los usuarios con capability `can_manage_stock` pueden realizar ajustes manuales de stock

FR49: Los usuarios deben agregar un motivo al realizar ajustes manuales de stock

FR50: Los usuarios con capability `can_manage_stock` reciben alertas cuando un repuesto alcanza su stock mínimo

FR51: Los usuarios con capability `can_manage_stock` pueden generar pedidos de repuestos a proveedores

FR52: Los usuarios con capability `can_manage_stock` pueden gestionar el stock de repuestos

FR53: Los usuarios con capability `can_manage_stock` pueden asociar cada repuesto con uno o más proveedores

FR54: Los usuarios con capability `can_manage_stock` pueden importar repuestos masivamente desde un archivo CSV

FR55: Los datos de proveedores y ubicaciones se validan automáticamente durante la importación masiva de repuestos y se reportan errores

FR56: Los usuarios pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)

**5. Gestión de Usuarios, Roles y Capacidades (FR58-FR76):**

FR58: Los usuarios con capability `can_manage_users` pueden crear nuevos usuarios en el sistema

FR59: Los usuarios con capability `can_manage_users` pueden crear hasta 20 etiquetas de clasificación de usuarios (ej: Operario, Técnico, Supervisor). Estas etiquetas son solo para clasificación visual y NO otorgan capabilities ni afectan el acceso al sistema

FR60: ❌ **ELIMINADO** (las capacidades ya NO se asignan a roles)

FR61: Los usuarios con capability `can_manage_users` pueden eliminar etiquetas de clasificación personalizadas

FR62: Los usuarios pueden tener asignada una o más etiquetas de clasificación simultáneamente (ej: Operario, Técnico, Supervisor)

FR63: ❌ **ELIMINADO** (los usuarios NO heredan capacidades desde roles)

FR64: Los usuarios con capability `can_manage_users` pueden asignar etiquetas de clasificación a usuarios para organización visual

FR65: Los usuarios con capability `can_manage_users` pueden quitar las etiquetas de clasificación de usuarios

FR66: Todo usuario nuevo (excepto el administrador inicial) tiene ÚNICAMENTE la capability `can_create_failure_report` asignada por defecto. Las otras 14 capabilities deben ser asignadas manualmente por un usuario con capability `can_manage_users`

FR67: Durante el registro de usuarios, los usuarios con capability `can_manage_users` seleccionan las capabilities asignadas usando checkboxes con etiquetas en castellano legibles (ej: "✅ Reportar averías", "✅ Ver todas las OTs"). Los nombres internos del código permanecen en inglés

FR67-A: Las etiquetas de clasificación son únicamente para organizar visualmente a los usuarios (ej: Operario, Técnico, Supervisor) y NO tienen ninguna relación con las capabilities. Las etiquetas NO otorgan, NO eliminan, NO modifican, NO afectan de ninguna manera las capabilities asignadas a un usuario. Etiquetas y capabilities son completamente independientes

FR67-B: Una misma etiqueta de clasificación NO otorga las mismas capacidades a todos los usuarios que la tienen asignada (las capacidades se asignan individualmente a cada usuario)

FR68: Las capacidades del sistema son 15 en total:
1. `can_create_failure_report` - Reportar averías (PREDETERMINADA para todos)
2. `can_create_manual_ot` - Crear OTs manuales sin aviso previo
3. `can_update_own_ot` - Actualizar OTs propias
4. `can_view_own_ots` - Ver solo OTs asignadas al usuario
5. `can_view_all_ots` - Ver todas las OTs del equipo
6. `can_complete_ot` - Completar OTs
7. `can_manage_stock` - Gestionar stock de repuestos
8. `can_assign_technicians` - Asignar técnicos a órdenes de trabajo
9. `can_view_kpis` - Ver KPIs avanzados con drill-down
10. `can_manage_assets` - Gestionar activos (crear, editar, eliminar equipos de la jerarquía)
11. `can_view_repair_history` - Consultar historial de reparaciones de equipos
12. `can_manage_providers` - Gestionar proveedores (mantenimiento y repuestos)
13. `can_manage_routines` - Gestionar rutinas de mantenimiento (crear, editar, desactivar)
14. `can_manage_users` - Gestionar usuarios y sus capacidades (crear, editar, eliminar usuarios, asignar capabilities, etiquetar usuarios con clasificaciones)
15. `can_receive_reports` - Recibir reportes automáticos por email

FR68-UI: Las capabilities se presentan en la interfaz de usuario en castellano con formato legible, sin usar notación técnica. Los nombres internos del código (en inglés) no son visibles para el usuario final

FR68-A: Los usuarios sin la capability `can_manage_assets` solo pueden consultar activos en modo solo lectura (ver jerarquía, historial de OTs, estados), sin poder crear, modificar ni eliminar equipos

FR68-B: Los usuarios sin la capability `can_view_repair_history` no pueden acceder al historial de reparaciones de equipos (ver OTs completadas, patrones de fallas, métricas de confiabilidad por equipo)

FR68-C: El primer usuario creado durante el setup inicial de la aplicación (denominado "administrador inicial") tiene las 15 capabilities del sistema asignadas por defecto. Este usuario especial es el único que recibe capabilities preasignadas además de `can_create_failure_report`. Ningún otro usuario creado posteriormente tiene capabilities preasignadas excepto `can_create_failure_report` que es predeterminada para todos

FR69: Los usuarios pueden acceder a su perfil personal

FR69-A: Los usuarios con capability `can_manage_users` pueden editar la información personal de cualquier usuario (nombre, email, teléfono)

FR70: Los usuarios pueden editar su información personal (nombre, email, teléfono)

FR71: Los usuarios pueden cambiar su contraseña

FR70-A: Los usuarios con capability `can_manage_users` pueden eliminar usuarios del sistema

FR72: Los usuarios con capability `can_manage_users` pueden ver un historial de actividad del usuario durante los últimos 6 meses (login, cambios de perfil, acciones críticas)

FR72-A: El sistema obliga a los usuarios a cambiar su contraseña temporal en el primer acceso antes de permitirles navegar a cualquier otra sección de la aplicación

FR72-B: Los usuarios con capability `can_manage_users` pueden registrar nuevos usuarios asignando credenciales temporales (usuario y contraseña) que deberán ser cambiadas en el primer acceso

FR72-C: Los usuarios con capability `can_manage_users` pueden ver el historial de trabajos completo de cualquier usuario, incluyendo: OTs completadas, OTs en progreso asignadas, OTs canceladas o reasignadas, tiempo promedio de completación (MTTR por usuario), repuestos usados, y productividad (OTs completadas por semana). El historial permite filtrar por rango de fechas específico. Esta capability es distinta de `can_assign_technicians` que solo permite asignar técnicos a OTs

FR73: Los usuarios acceden solo a los módulos para los que tienen capacidades asignadas:
- Órdenes de Trabajo (requiere `can_view_own_ots` o `can_view_all_ots`)
- Activos (requiere `can_view_own_ots` para consultar, `can_manage_assets` para editar)
- Repuestos (requiere `can_manage_stock` para gestionar)
- Proveedores (requiere `can_manage_providers`)
- Rutinas (requiere `can_view_all_ots` para consultar, `can_manage_routines` para crear/editar)
- KPIs (requiere `can_view_kpis`)
- Usuarios (requiere `can_manage_users`)

FR74: Los usuarios solo ven en la navegación los módulos para los que tienen capacidades asignadas

FR75: El acceso se deniega automáticamente si un usuario intenta navegar directamente a un módulo no autorizado (URL directa)

FR76: Los usuarios ven un mensaje explicativo cuando se deniega acceso por falta de capacidades

**6. Gestión de Proveedores (FR77-FR80):**

FR77: Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de mantenimiento (crear, editar, desactivar)

FR78: Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de repuestos (crear, editar, desactivar)

FR78-A: El formulario de proveedores es único para ambos tipos (mantenimiento y repuestos), con un campo de selección "Tipo de proveedor" que permite clasificarlos como "Mantenimiento" o "Repuestos". Un mismo proveedor puede ofrecer ambos tipos de servicio

FR79: Los usuarios con capability `can_manage_providers` pueden ver datos de contacto de cada proveedor

FR80: Los usuarios con capability `can_manage_providers` pueden asociar proveedores con tipos de servicio que ofrecen. El catálogo de servicios incluye 6 tipos predefinidos: Mantenimiento Correctivo, Mantenimiento Preventivo, Mantenimiento Reglamentario, Suministro de Repuestos, Mantenimiento de Equipos Específicos (soldadura, corte, etc.), y Servicios de Emergencia

**7. Gestión de Rutinas de Mantenimiento (FR81-FR84):**

FR81: Los usuarios con capability `can_manage_routines` pueden gestionar rutinas de mantenimiento (crear, editar, desactivar) con frecuencias diaria, semanal o mensual

FR81-A: Las rutinas de mantenimiento pueden ser de dos modalidades: (1) Por equipo específico - rutinas asociadas a un equipo particular de la jerarquía de activos, o (2) Customizables - rutinas generales como orden y limpieza con campos variables personalizables

FR81-B: Cada rutina de mantenimiento configura: tareas a realizar, técnico responsable, repuestos necesarios y duración estimada. Estos campos aplican tanto a rutinas por equipo como customizables

FR82: Las órdenes de trabajo de mantenimiento preventivo se generan automáticamente 24 horas antes del vencimiento de rutina, con estado "Pendiente" y etiqueta "Preventivo"

FR83: Los usuarios con capability `can_view_all_ots` pueden ver el porcentaje de rutinas completadas en el dashboard, incluyendo sus propias rutinas asignadas

FR84: El usuario asignado a una rutina recibe alertas cuando la rutina no se completa en el plazo previsto. Las alertas se envían en 3 momentos: 1 hora antes del vencimiento, en el momento del vencimiento, y 24 horas después del vencimiento si permanece incompleta

**8. Análisis y Reportes (FR85-FR95):**

FR85: Los usuarios con capability `can_view_kpis` pueden ver el KPI MTTR (Mean Time To Repair) calculado con datos actualizados cada 30 segundos

FR86: Los usuarios con capability `can_view_kpis` pueden ver el KPI MTBF (Mean Time Between Failures) calculado con datos actualizados cada 30 segundos

FR87: Los usuarios con capability `can_view_kpis` pueden navegar drill-down de KPIs (Global → Planta → Línea → Equipo)

FR88: Los usuarios con capability `can_view_kpis` pueden ver métricas adicionales (OTs abiertas, OTs completadas, técnicos activos, stock crítico)

FR89: Los usuarios con capability `can_view_kpis` reciben alertas de 3 tipos: stock mínimo (requiere `can_manage_stock`), MTFR alto (definido como 150% del promedio de los últimos 30 días), rutinas no completadas

FR90: Los usuarios con capability `can_view_kpis` pueden exportar reportes de KPIs a Excel en formato .xlsx compatible con Microsoft Excel 2016+, con hojas separadas por KPI (MTTR, MTBF, OTs Abiertas, Stock Crítico)

FR90-A: Los usuarios con capability `can_receive_reports` pueden configurar la recepción de reportes automáticos en PDF enviados por email, incluyendo selección de KPIs (MTTR, MTBF, OTs abiertas, OTs completadas, stock crítico, técnicos activos, porcentaje de rutinas completadas, número de usuarios asignados por OT) y frecuencia (diario, semanal, mensual)

FR90-B: Los reportes diarios se generan automáticamente todos los días a las 8:00 AM con datos del día anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado

FR90-C: Los reportes semanales se generan automáticamente todos los lunes a las 8:00 AM con datos de la semana anterior (lunes a domingo), en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado

FR90-D: Los reportes mensuales se generan automáticamente el primer lunes de cada mes a las 9:00 AM con datos del mes anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado

FR90-E: Los usuarios con capability `can_receive_reports` pueden descargar manualmente cualquier reporte desde el dashboard en formato PDF, independientemente de la recepción automática por email

FR91: Todos los usuarios acceden al mismo dashboard general con KPIs de la planta (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login, con botones de acceso a módulos según capacidades asignadas. Este dashboard muestra los KPIs básicos visibles para todos

FR91-A: Los usuarios con capability `can_view_kpis` pueden hacer drill-down (Global → Planta → Línea → Equipo) y ver análisis avanzado. Los usuarios sin esta capability ven los mismos KPIs básicos que FR91 pero no pueden interactuar más allá de la vista general

FR92: ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

FR93: ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

FR94: ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

FR95: ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

**9. Sincronización y Acceso Multi-Dispositivo (FR96-FR100):**

FR96: El sistema sincroniza datos entre múltiples dispositivos mediante Server-Sent Events (SSE) con actualizaciones cada 30 segundos para OTs y KPIs

FR97: Los usuarios pueden acceder desde dispositivos desktop, tablet y móvil

FR98: La interfaz se adapta responsivamente al tamaño de pantalla del dispositivo con 3 breakpoints definidos: >1200px (layout desktop con navegación lateral completa), 768-1200px (layout tablet con navegación simplificada), <768px (layout móvil con navegación inferior y componentes apilados)

FR99: Los usuarios pueden instalar la aplicación en dispositivos móviles como aplicación nativa (PWA)

FR100: Los usuarios reciben notificaciones push en sus dispositivos

**10. Funcionalidades Adicionales (FR101-FR108):**

FR101: Los usuarios con capability `can_create_failure_report` pueden rechazar una reparación si no funciona correctamente después de completada, lo que genera una OT de re-trabajo con prioridad alta

FR102: La búsqueda predictiva está disponible en cualquier campo de búsqueda del sistema (equipos, componentes, repuestos, OTs, técnicos, usuarios) sin requerir capability específica

FR103: ❌ **ELIMINADO** (duplicaba FR91 - dashboard común ya está especificado)

FR104: Los usuarios pueden ver su propio historial de acciones de los últimos 30 días (login, cambios de perfil, acciones críticas). Los usuarios con capability `can_manage_users` pueden ver el historial de acciones de cualquier usuario

FR105: Cualquier usuario puede configurar sus propias preferencias de notificación por tipo (habilitar/deshabilitar: recibido, autorizado, en progreso, completado)

FR106: Los usuarios con capability `can_update_own_ot` pueden agregar comentarios con timestamp a OTs en progreso asignadas

FR107: Los usuarios con capability `can_update_own_ot` pueden adjuntar fotos antes y después de la reparación en una orden de trabajo asignada

FR108: Los equipos pueden tener código QR asociado para escaneo de identificación (funcionalidad base disponible en MVP; tracking avanzado con cadena de custodia y mapa en tiempo real en Phase 3)

**Total: 123 Requerimientos Funcionales**

### NonFunctional Requirements

**Performance (NFR-P1 a NFR-P7):**

NFR-P1: La búsqueda predictiva de equipos (principal criterio de búsqueda) debe devolver resultados en menos de 200ms. La búsqueda universal (equipos, componentes, repuestos, OTs, técnicos, usuarios) puede extenderse hasta 500ms para consultas complejas multi-campo

NFR-P2: La carga inicial (first paint) de la aplicación debe completarse en menos de 3 segundos en conexión WiFi industrial estándar

NFR-P3: Las actualizaciones en tiempo real via Server-Sent Events (SSE) deben reflejarse en todos los clientes conectados cada 30 segundos (heartbeat)

NFR-P4: El dashboard de KPIs debe cargar y mostrar datos en menos de 2 segundos

NFR-P5: Las transiciones entre vistas (p.ej. Kanban ↔ Listado) deben completarse en menos de 100ms

NFR-P6: El sistema debe soportar 50 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta)

NFR-P7: La importación masiva de 10,000 activos debe completarse en menos de 5 minutos

**Security (NFR-S1 a NFR-S9):**

NFR-S1: Todos los usuarios deben autenticarse antes de acceder al sistema

NFR-S2: Las contraseñas deben almacenarse hasheadas (bcrypt/argon2) nunca en texto plano

NFR-S3: Todas las comunicaciones entre cliente y servidor deben usar HTTPS/TLS 1.3

NFR-S4: El sistema debe implementar control de acceso basado en capacidades (ACL) para restringir acceso a módulos

NFR-S5: El sistema debe registrar logs de auditoría para acciones críticas (cambio de capabilities, ajustes de stock, cambio de estados de equipos)

NFR-S6: Las sesiones de usuario deben expirar después de 8 horas de inactividad

NFR-S7: El sistema debe sanitizar todas las entradas de usuario para prevenir inyección SQL/XSS

NFR-S8: Los datos sensibles (contraseñas, tokens) nunca deben aparecer en logs o errores expuestos al cliente

NFR-S9: El sistema debe implementar Rate Limiting para prevenir ataques de fuerza bruta en login (máx. 5 intentos fallidos por IP en 15 minutos)

**Scalability (NFR-SC1 a NFR-SC5):**

NFR-SC1: El sistema debe soportar hasta 10,000 activos sin degradación de performance. Método de medición: Prueba de carga con JMeter simulando 10,000 activos con consultas concurrentes, verificando tiempos de respuesta <200ms en búsqueda predictiva (NFR-P1)

NFR-SC2: El sistema debe soportar hasta 100 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta). Método de medición: Prueba de carga con 100 usuarios simultáneos durante 1 hora usando JMeter o herramienta similar, verificando degradación <10% en NFR-P1 a NFR-P6

NFR-SC3: La base de datos debe estar optimizada con índices para consultas frecuentes (búsqueda de equipos, filtrado de OTs, KPIs). Método de medición: Análisis EXPLAIN query en consultas frecuentes de búsqueda y listado, verificando uso de índices y tiempos de ejecución <50ms para queries críticas

NFR-SC4: El sistema debe implementar paginación para listados grandes (p.ej. más de 100 items por vista). Método de medición: Testing de carga con listados de 100, 500, 1000 items, verificando tiempo de carga <500ms independientemente del tamaño del listado (siempre con paginación)

NFR-SC5: El sistema debe soportar crecimiento a 20,000 activos con ajustes de infraestructura sin cambios de arquitectura. Método de medición: Proyección lineal basada en pruebas de carga con 10,000 activos, certificando que la arquitectura actual permite escalar a 20,000 activos con ajustes de hardware solamente (vertical scaling)

**Accessibility (NFR-A1 a NFR-A6):**

NFR-A1: La interfaz debe cumplir con nivel WCAG AA de contraste (mínimo 4.5:1 para texto normal)

NFR-A2: El tamaño de texto base debe ser mínimo 16px con títulos de 20px o más

NFR-A3: Los elementos interactivos (botones, links) deben tener un tamaño mínimo de 44x44px para facilitar toque en tablets/móviles

NFR-A4: La interfaz debe ser legible en condiciones de iluminación de fábrica (alto contraste, sin dependencia de color solo)

NFR-A5: La aplicación debe ser navegable usando teclado (Tab, Enter, Esc) en desktop y mediante touch targets (44x44px mínimo) en tablets/móviles

NFR-A6: La interfaz debe soportar zoom hasta 200% sin romper el layout

**Reliability (NFR-R1 a NFR-R6):**

NFR-R1: El sistema debe tener un uptime objetivo del 99% durante horarios de operación de fábrica (día laboral)

NFR-R2: El sistema debe realizar backups automáticos diarios de la base de datos

NFR-R3: El sistema debe tener un proceso de restore validado con recovery time objetivo (RTO) de 4 horas

NFR-R4: Las conexiones SSE (Server-Sent Events) deben reconectarse automáticamente si se pierde conexión temporal (<30 segundos)

NFR-R5: El sistema debe mostrar mensajes claros de error cuando un servicio no está disponible

NFR-R6: Las operaciones críticas (completar OT, ajustes de stock) deben tener confirmación de éxito antes de considerarlas completadas

**Integration (NFR-I1 a NFR-I4):**

NFR-I1: El sistema debe soportar importación masiva de datos mediante archivos CSV con formato validado

NFR-I2: El sistema debe exportar reportes de KPIs en formato Excel compatible con Microsoft Excel 2016+

NFR-I3: La arquitectura debe permitir futura integración con sistemas ERP mediante API REST (Phase 3+). Método de medición: Revisión arquitectónica verificando que endpoints REST estén documentados con OpenAPI/Swagger y capacidades de autenticación (OAuth2/JWT) para integración de terceros

NFR-I4: La arquitectura debe permitir futura integración con sistemas de producción (IoT) para lectura de datos de equipos (Phase 4). Método de medición: Revisión arquitectónica verificando capacidades de ingesta de datos externos vía API REST o webhooks, con autenticación y validación de datos

**Total: 37 Requerimientos No Funcionales**

### Additional Requirements

**Requisitos Adicionales de Arquitectura:**

- **Greenfield Project:** El proyecto es desde cero (greenfield) para implementar un sistema GMAO completo
- **Sistema PBAC con 15 Capacidades:** Implementar Permission-Based Access Control con 15 capacidades granulares asignables individualmente por usuario
- **SSE (Server-Sent Events) para Tiempo Real:** Implementar actualizaciones en tiempo real mediante SSE con heartbeat de 30 segundos para OTs y KPIs (compatible con Vercel serverless, más simple que WebSockets)
- **Búsqueda Predictiva <200ms:** Implementar búsqueda predictiva de equipos con debouncing (300ms) y caché de búsquedas frecuentes
- **Jerarquía de 5 Niveles:** Implementar estructura jerárquica Planta → Línea → Equipo → Componente → Repuesto con relaciones muchos-a-muchos
- **Responsive Design:** Implementar 3 breakpoints (>1200px desktop, 768-1200px tablet, <768px móvil)
- **PWA (Progressive Web App):** Implementar capacidades de instalación en dispositivos móviles y notificaciones push
- **Importación Masiva CSV:** Implementar importación de activos y repuestos desde archivos CSV con validación estructural
- **Exportación Excel:** Implementar exportación de reportes KPIs en formato .xlsx compatible con Microsoft Excel 2016+
- **Reportes Automáticos PDF:** Implementar generación de reportes en PDF con envío automático por email (diario 8:00 AM, semanal lunes 8:00 AM, mensual primer lunes 9:00 AM)
- **8 Estados de OTs:** Implementar máquina de estados con 8 estados: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada
- **Kanban Digital 8 Columnas:** Implementar tablero Kanban con columnas: Pendientes Triage, Asignaciones (dividida en Pendiente de Asignar / Programada), En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completadas, Descartadas
- **Código de Colores de OTs:** Implementar 7 tipos visuales de OTs con colores WCAG AA compliance: Rosa (avería triage), Blanco (reparación triage), Verde (preventivo), Rojizo (correctivo propio), Rojo con línea (correctivo externo viene), Naranja (reparación interna), Azul (reparación externa)
- **KPIs Core:** Implementar cálculo de MTTR y MTBF con drill-down (Global → Planta → Línea → Equipo)
- **Sistema de Notificaciones Push:** Implementar envío de notificaciones push en <30 segundos tras cambio de estado
- **Gestión de Stock Silencioso:** Implementar actualizaciones de stock en tiempo real (1 segundo) sin enviar notificaciones por cada uso (solo alertas stock mínimo)
- **Multi-Asignación de Usuarios:** Implementar capacidad de asignar 1-3 técnicos o proveedores por OT con notificaciones a todos los asignados
- **Onboarding con Cambio de Contraseña Obligatorio:** Implementar flujo de primer acceso que obliga a cambiar contraseña temporal antes de navegar
- **Dashboard Común con Navegación por Capacidades:** Implementar dashboard general accesible para todos con KPIs básicos, permitiendo drill-down solo a usuarios con `can_view_kpis`
- **Etiquetas de Clasificación Visual:** Implementar sistema de hasta 20 etiquetas de clasificación de usuarios (ej: Operario, Técnico, Supervisor) completamente independientes de las 15 capabilities
- **Confirmación de Recepción de Reparación Externa:** Implementar flujo de confirmación de recepción de equipo reparado por proveedor antes de marcar OT como completada
- **Rutinas con Generación Automática de OTs:** Implementar sistema de rutinas diarias/semanales/mensuales que genera OTs preventivas 24 horas antes del vencimiento
- **Modal Informativo ℹ️ con Trazabilidad Completa:** Implementar modal con timeline visual, fechas, origen, técnicos/proveedores con contacto, repuestos usados
- **Alertas de Rutinas no Completadas:** Implementar alertas en 3 momentos: 1 hora antes, vencimiento, 24 horas después

**Requisitos Adicionales de UX:**

- **Onboarding Ultra-Simplificado:** Implementar tutorial de 30 segundos para operarios y 1-2 minutos para técnicos/supervisores/admins
- **Confirmación Inmediata de Aviso:** Implementar confirmación visual dentro de 3 segundos con número de aviso generado
- **Mensaje de Gratitud:** Implementar mensaje "Gracias por tu reporte" tras confirmación de operario
- **Búsqueda Predictiva con Contexto Jerárquico:** Implementar suggestions con ubicación en planta (ej: "Prensa PH-500 (Panel Sandwich, Línea 2)")
- **Historial Reciente en Búsqueda:** Implementar historial de búsquedas recientes y últimas averías por equipo
- **Debouncing de 300ms:** Implementar debouncing en campos de búsqueda para optimizar performance
- **Highlighting de Término Buscado:** Implementar resaltado visual del término buscado en resultados
- **Autocomplete Jerárquico:** Implementar autocompletado que muestra estructura jerárquica completa del activo
- **Paleta de Colores WCAG AA:** Implementar colores con contraste mínimo 4.5:1 (Main Blue #0066CC, Warning/Orange #FD7E14, Success/Green #28A745, Danger/Red #DC3545)
- **Tipografía Responsiva:** Implementar tamaños de texto: H1 32px, H2 24px, H3 20px, Body 16px, Small 14px, X-Small 12px
- **Touch Targets 44x44px:** Implementar todos los elementos interactivos con tamaño mínimo 44x44px
- **Cards con Sombra Sutil:** Implementar cards con fondo blanco, sombra sutil, border radius 8px, padding 20px
- **Filtros en Kanban:** Implementar filtros por estado, técnico, fecha, urgencia, equipo
- **Drag & Drop entre Columnas:** Implementar capacidad de arrastrar tarjetas entre columnas del Kanban
- **Responsive Kanban:** Implementar 8 columnas en desktop >1200px, 2 columnas en tablet 768-1200px, 1 columna con swipe horizontal en móvil <768px
- **Formulario Multi-Paso para Reportar Avería:** Implementar formulario con 3 pasos (Datos básicos → Detalles → Confirmación) con progress indicator
- **Validaciones Real-Time:** Implementar feedback visual en tiempo real durante completación de formulario
- **Adjuntar Fotos (Máx 5):** Implementar capacidad de adjuntar hasta 5 fotos por aviso/OT con thumbnails
- **KPIs con Trending Icons:** Implementar indicadores visuales de tendencia (↑↓) en KPIs
- **Gráficos Interactivos:** Implementar gráficos: OTs por semana (bar chart), Tiempos de reparación (line chart), Top 5 averías recurrentes (horizontal bar chart)
- **Drill-Down de KPIs:** Implementar navegación drill-down en KPIs (Global → Planta → Línea → Equipo)
- **Exportar Excel Button:** Implementar botón de exportación con icono download + "Exportar Excel"
- **Checkboxes con Etiquetas Legibles:** Implementar checkboxes para capabilities con etiquetas en castellano legibles (ej: "✅ Reportar averías", "✅ Ver todas las OTs")
- **Vista de Todas las Capabilities en Una Pantalla:** Implementar gestión de las 15 capabilities en una sola pantalla con scroll vertical
- **Labels Textuales Redundantes:** Implementar labels de texto + icon + color para los 7 tipos de OTs
- **Tooltip ℹ️ con Detalles Completos:** Implementar tooltip informativo con detalles completos de cada tipo de OT
- **Stock con Ubicación Visible:** Implementar visualización de ubicación física en almacén (ej: "📍 Estante A3, Cajón 3")
- **Alertas Solo Stock Mínimo:** Implementar alertas solo cuando repuesto alcanza stock mínimo (no spam por cada uso)
- **Dashboard Público para TV:** Implementar dashboard simplificado para TV en área común con KPIs básicos sin datos sensibles
- **Navegación por Capacidades:** Implementar navegación dinámica que muestra solo módulos accesibles según capabilities del usuario
- **Mensaje Explicativo de Acceso Denegado:** Implementar mensaje claro cuando usuario intenta acceder a módulo no autorizado

### FR Coverage Map

FR1: Epic 3 - Reporte de avería con búsqueda predictiva
FR2: Epic 3 - Descripción textual del problema
FR3: Epic 3 - Foto opcional al reportar avería
FR4: Epic 3 - Notificaciones push de estado (30s)
FR5: Epic 3 - Confirmación de operario tras reparación
FR6: Epic 3 - Búsqueda predictiva de equipos
FR7: Epic 3 - Vista de avisos en columna triage
FR8: Epic 4 - Convertir avisos en OTs
FR9: Epic 4 - Descartar avisos no procedentes
FR10: Epic 3 - Distinción visual avería (rosa) vs reparación (blanco)

FR11: Epic 4 - 8 estados de ciclo de vida de OTs
FR11-A: Epic 4 - Atributo tipo de mantenimiento (Preventivo/Correctivo)
FR11-B: Epic 4 - Etiquetas Preventivo/Correctivo visibles
FR12: Epic 4 - Iniciar OT asignada (En Progreso)
FR13: Epic 4 - Agregar repuestos usados durante cumplimiento
FR14: Epic 4 - Completar (validar) OT
FR15: Epic 4 - Agregar notas internas a OT
FR16: Epic 5 - Actualización stock en tiempo real (1s, silenciosa)
FR17: Epic 4 - Asignar 1-3 técnicos internos a OT
FR18: Epic 4 - Asignar OTs a proveedores externos
FR19: Epic 4 - Seleccionar 1-3 técnicos o proveedores por tipo OT
FR19-A: Epic 4 - Múltiples usuarios asignados pueden actualizar OT
FR20: Epic 4 - Ver OTs asignadas en dashboard personal
FR21: Epic 4 - Ver todas las OTs de la organización
FR22: Epic 4 - Distinción visual preventivo (verde), correctivo propio (rojizo), correctivo externo (rojo con línea)
FR23: Epic 4 - Distinción visual reparación interna (naranja) vs externa (azul)
FR24: Epic 4 - Modal con detalles completos de OT
FR24-A: Epic 4 - Confirmación de recepción de reparación externa
FR25: Epic 4 - Crear OTs manuales sin aviso previo
FR26: Epic 4 - Vista de listado de todas las OTs
FR27: Epic 4 - Filtrar listado por 5 criterios (estado, técnico, fecha, tipo, equipo)
FR28: Epic 4 - Ordenar listado por cualquier columna
FR29: Epic 4 - Acciones en vista listado = Kanban
FR30: Epic 4 - Alternar entre vista Kanban y listado
FR31: Epic 4 - Sincronización real-time entre vistas Kanban y listado

FR32: Epic 2 - Jerarquía de activos 5 niveles
FR33: Epic 2 - Navegar jerarquía en cualquier dirección
FR34: Epic 2 - Asociar componente a múltiples equipos
FR35: Epic 2 - Ver historial de reparaciones de equipo
FR36: Epic 2 - Gestionar 5 estados de equipos
FR37: Epic 2 - Cambiar estado de equipo
FR38: Epic 2 - Ver stock de equipos completos reutilizables
FR39: Epic 2 - Rastrear ubicación actual de equipos reutilizables
FR40: Epic 2 - Importar activos masivamente desde CSV
FR41: Epic 2 - Validación automática estructura jerárquica
FR42: Epic 2 - Reporte de resultados de importación
FR43: Epic 2 - Descargar plantilla de importación

FR44: Epic 5 - Acceder catálogo repuestos (consulta)
FR45: Epic 5 - Ver stock actual en tiempo real
FR46: Epic 5 - Ver ubicación física en almacén
FR47: Epic 5 - Ver stock y ubicación al seleccionar
FR48: Epic 5 - Ajustes manuales de stock
FR49: Epic 5 - Motivo obligatorio en ajustes manuales
FR50: Epic 5 - Alertas stock mínimo
FR51: Epic 5 - Generar pedidos a proveedores
FR52: Epic 5 - Gestionar stock de repuestos
FR53: Epic 5 - Asociar repuestos con proveedores
FR54: Epic 5 - Importar repuestos masivamente desde CSV
FR55: Epic 5 - Validación automática datos proveedores y ubicaciones
FR56: Epic 5 - Reporte de resultados de importación

FR58: Epic 1 - Crear nuevos usuarios
FR59: Epic 1 - Crear hasta 20 etiquetas de clasificación visual
FR60: [ELIMINADO] Capacidades ya NO se asignan a roles
FR61: Epic 1 - Eliminar etiquetas de clasificación personalizadas
FR62: Epic 1 - Asignar múltiples etiquetas a usuario
FR63: [ELIMINADO] Usuarios NO heredan capacidades desde roles
FR64: Epic 1 - Asignar etiquetas de clasificación a usuarios
FR65: Epic 1 - Quitar etiquetas de clasificación de usuarios
FR66: Epic 1 - can_create_failure_report predeterminada para todos
FR67: Epic 1 - Seleccionar capabilities con checkboxes legibles
FR67-A: Epic 1 - Etiquetas independientes de capabilities
FR67-B: Epic 1 - Misma etiqueta NO otorga mismas capacidades
FR68: Epic 1 - 15 capabilities del sistema definidas
FR68-UI: Epic 1 - Capabilities en castellano legible
FR68-A: Epic 1 - Usuarios sin can_manage_assets = solo lectura
FR68-B: Epic 1 - Usuarios sin can_view_repair_history = sin acceso historial
FR68-C: Epic 1 - Administrador inicial con 15 capabilities preasignadas
FR69: Epic 1 - Acceder a perfil personal
FR69-A: Epic 1 - Editar información personal de cualquier usuario
FR70: Epic 1 - Editar información personal propia
FR71: Epic 1 - Cambiar contraseña
FR70-A: Epic 1 - Eliminar usuarios del sistema
FR72: Epic 1 - Ver historial actividad últimos 6 meses
FR72-A: Epic 1 - Cambio contraseña obligatorio en primer acceso
FR72-B: Epic 1 - Registrar usuarios con credenciales temporales
FR72-C: Epic 1 - Ver historial de trabajos completo de usuario
FR73: Epic 1 - Acceso solo a módulos con capacidades asignadas
FR74: Epic 1 - Navegación muestra solo módulos autorizados
FR75: Epic 1 - Denegación automática acceso no autorizado
FR76: Epic 1 - Mensaje explicativo acceso denegado

FR77: Epic 6 - Gestionar catálogo proveedores mantenimiento
FR78: Epic 6 - Gestionar catálogo proveedores repuestos
FR78-A: Epic 6 - Formulario único proveedores con campo Tipo
FR79: Epic 6 - Ver datos de contacto proveedores
FR80: Epic 6 - Asociar proveedores con tipos de servicio

FR81: Epic 7 - Gestionar rutinas diaria/semanal/mensual
FR81-A: Epic 7 - Rutinas por equipo específico o customizables
FR81-B: Epic 7 - Configurar tareas, técnico, repuestos, duración
FR82: Epic 7 - Generar automáticamente OTs preventivas 24h antes
FR83: Epic 7 - Ver % rutinas completadas en dashboard
FR84: Epic 7 - Alertas rutinas no completadas (1h antes, vencimiento, 24h después)

FR85: Epic 8 - Ver KPI MTTR actualizado cada 30s
FR86: Epic 8 - Ver KPI MTBF actualizado cada 30s
FR87: Epic 8 - Navegar drill-down KPIs (Global → Planta → Línea → Equipo)
FR88: Epic 8 - Ver métricas adicionales (OTs abiertas, completadas, técnicos activos, stock crítico)
FR89: Epic 8 - Recibir alertas accionables (stock mínimo, MTFR alto, rutinas no completadas)
FR90: Epic 8 - Exportar reportes KPIs a Excel
FR90-A: Epic 8 - Configurar reportes automáticos PDF por email
FR90-B: Epic 8 - Reportes diarios automáticos 8:00 AM
FR90-C: Epic 8 - Reportes semanales automáticos lunes 8:00 AM
FR90-D: Epic 8 - Reportes mensuales automáticos primer lunes 9:00 AM
FR90-E: Epic 8 - Descargar manualmente reportes en PDF
FR91: Epic 8 - Dashboard común KPIs básicos al login
FR91-A: Epic 8 - Drill-down para usuarios con can_view_kpis
FR92: [ELIMINADO] Dashboards específicos por rol reemplazados
FR93: [ELIMINADO] Dashboards específicos por rol reemplazados
FR94: [ELIMINADO] Dashboards específicos por rol reemplazados
FR95: [ELIMINADO] Dashboards específicos por rol reemplazados

FR96: Epic 9 - Sincronización multi-dispositivo via SSE cada 30s
FR97: Epic 9 - Acceder desde desktop, tablet, móvil
FR98: Epic 9 - Responsive design 3 breakpoints (>1200px, 768-1200px, <768px)
FR99: Epic 9 - Instalar app como PWA
FR100: Epic 9 - Recibir notificaciones push

FR101: Epic 10 - Rechazar reparación si no funciona (genera OT re-trabajo)
FR102: Epic 10 - Búsqueda predictiva global sin capability específica
FR103: [ELIMINADO] Duplicaba FR91
FR104: Epic 10 - Ver historial acciones últimos 30 días
FR105: Epic 10 - Configurar preferencias notificación por tipo
FR106: Epic 10 - Agregar comentarios con timestamp a OTs
FR107: Epic 10 - Adjuntar fotos antes/después reparación
FR108: Epic 2 - Códigos QR para identificación de equipos

## Epic List

### Epic 1: Autenticación y Gestión de Usuarios PBAC

Establecer la infraestructura técnica base del proyecto (Story 1.1) y el sistema de autenticación con gestión flexible de usuarios usando 15 capacidades individuales (PBAC - Permission-Based Access Control), permitiendo a los administradores gestionar quién puede hacer qué en el sistema sin roles predefinidos. Incluye registro de usuarios, asignación individual de capabilities, etiquetas de clasificación visual, perfiles, cambio de contraseña obligatorio en primer acceso, historial de actividad y control de acceso por módulos.

**FRs cubiertos:** FR58-FR76 (19 requerimientos funcionales)
**Usuario principal:** Elena (Administrador / Jefa de Mantenimiento)
**Valor entregado:**
- Sistema completo de autenticación y autorización funcional
- Elena puede registrar usuarios con credenciales temporales
- Usuarios cambian contraseña obligatoriamente en primer acceso
- Elena asigna las 15 capabilities individualmente (no por roles)
- Elena crea hasta 20 etiquetas de clasificación visual (Operario, Técnico, Supervisor)
- Control de acceso granular por módulos según capabilities
- Historial de actividad de usuarios últimos 6 meses
- **Story 1.1 incluye:** Setup inicial completo (Next.js, Prisma, NextAuth, SSE, shadcn/ui, Vercel)

**Dependencias:** Ninguna (primer epic)

---

### Epic 2: Gestión de Activos y Jerarquía de 5 Niveles

Permitir a los usuarios gestionar la estructura completa de activos con jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), relaciones muchos-a-muchos entre componentes y equipos, historial completo de reparaciones por equipo, 5 estados de equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado), stock de equipos completos reutilizables, importación masiva de hasta 10,000 activos desde CSV y códigos QR para identificación.

**FRs cubiertos:** FR32-FR43, FR108 (13 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con capability can_manage_assets), técnicos con can_view_repair_history
**Valor entregado:**
- Jerarquía completa de 5 niveles navegable en cualquier dirección
- Relaciones muchos-a-muchos (un componente sirve a múltiples equipos)
- Historial de reparaciones por equipo con fechas, repuestos usados, técnicos
- 5 estados de equipos con visualización de stock de reutilizables
- Importación CSV masiva con validación estructural automática
- Códigos QR para identificación rápida de equipos
- Rastreo de ubicación actual de equipos reutilizables

**Dependencias:** Epic 1 (requiere autenticación y capabilities)

---

### Epic 3: Reporte de Averías en Segundos

Permitir a operarios como Carlos reportar averías en menos de 30 segundos con búsqueda predictiva de equipos (<200ms), descripción textual, fotos opcionales, recibiendo confirmación inmediata con número de aviso (<3 segundos), notificaciones push de estado en tiempo real (recibido, autorizado, en progreso, completado) dentro de los 30 segundos siguientes al cambio, y capacidad de confirmar si la reparación funciona correctamente. Los supervisores pueden ver avisos nuevos en columna de triage con distinción visual por color (rosa para avería, blanco para reparación).

**FRs cubiertos:** FR1-FR10, FR102 (11 requerimientos funcionales)
**Usuario principal:** Carlos (Operario de Línea), Javier (Supervisor con capability can_view_all_ots)
**Valor entregado:**
- Carlos reporta averías en <30s vs 2-5 minutos actuales
- Búsqueda predictiva <200ms con contexto jerárquico
- Confirmación inmediata con número de aviso (<3s)
- Notificaciones push de estado en tiempo real (SSE cada 30s)
- Carlos confirma si reparación funciona (feedback loop)
- Javier gestiona triage de avisos con vista Kanban
- Carlos siente "mi voz importa" vs "nadie hace caso"

**Dependencias:** Epic 1 (requiere autenticación), Epic 2 (requiere jerarquía de activos)

---

### Epic 4: Órdenes de Trabajo y Kanban Digital

Permitir a técnicos como María y supervisores como Javier gestionar el ciclo de vida completo de Órdenes de Trabajo con 8 estados (Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada), Kanban digital de 8 columnas con código de colores (7 tipos visuales: verde preventivo, rojizo correctivo propio, rojo con línea correctivo externo viene, naranja reparación interna, azul reparación externa, rosa avería triage, blanco reparación triage), asignación múltiple de 1-3 técnicos o proveedores, vista de listado con filtros, capacidad de agregar repuestos usados, notas internas, comentarios con timestamp y fotos antes/después de la reparación.

**FRs cubiertos:** FR11-FR31 (21 requerimientos funcionales)
**Usuario principal:** María (Técnica de Mantenimiento), Javier (Supervisor con can_view_all_ots, can_assign_technicians)
**Valor entregado:**
- María ve sus OTs asignadas organizadas
- María actualiza estado en tiempo real (botón ▶️ Iniciar)
- María agrega repuestos usados con stock visible
- Javier gestiona visualmente en Kanban 8 columnas
- Código de colores permite identificación inmediata
- Asignación múltiple 1-3 técnicos/proveedores
- Modal ℹ️ con trazabilidad completa en 1 clic
- Vista de listado con filtros y ordenamiento
- Sincronización real-time entre vistas Kanban y listado

**Dependencias:** Epic 1 (requiere autenticación), Epic 2 (requiere activos), Epic 3 (requiere reporte de averías)

---

### Epic 5: Control de Stock y Repuestos

Permitir a gestores como Pedro controlar el stock de repuestos consumibles en tiempo real con ubicación física visible en almacén (ej: "📍 Estante A3, Cajón 3"), actualizaciones silenciosas cuando técnicos usan repuestos en OTs (sin spam de notificaciones), alertas solo al alcanzar stock mínimo, capacidad de realizar ajustes manuales con motivo obligatorio, generar pedidos a proveedores, importar repuestos masivamente desde CSV y asociar cada repuesto con uno o más proveedores. Todos los usuarios pueden ver stock y ubicación al seleccionar repuestos para uso.

**FRs cubiertos:** FR16, FR44-FR56 (14 requerimientos funcionales)
**Usuario principal:** Pedro (Usuario con capability can_manage_stock), María (Técnica que usa repuestos en OTs)
**Valor entregado:**
- Todos los usuarios ven stock y ubicación al seleccionar repuestos
- María ve stock actualizado en tiempo real (1s, silencioso)
- Pedro NO recibe spam por cada uso (solo alertas stock mínimo)
- Pedro recibe alerta: "Filtro F-205 alcanzó mínimo (6 unidades, mínimo: 5)"
- Pedro genera pedidos a proveedores desde la alerta
- Pedro hace ajustes manuales con motivo (discrepancia física)
- Importación CSV masiva con validación de proveedores y ubicaciones
- Pedro ahorra 2+ horas diarias (sin interrupciones constantes)

**Dependencias:** Epic 1 (requiere autenticación)

---

### Epic 6: Gestión de Proveedores

Permitir a Elena gestionar el catálogo unificado de proveedores de mantenimiento y repuestos con formulario único que incluye campo "Tipo de proveedor" (Mantenimiento, Repuestos, o ambos), datos de contacto completos (teléfono, email), asociación con 6 tipos de servicio (Mantenimiento Correctivo, Mantenimiento Preventivo, Mantenimiento Reglamentario, Suministro de Repuestos, Mantenimiento de Equipos Específicos, Servicios de Emergencia) y capacidad de activar/desactivar proveedores. Los supervisores pueden ver datos de contacto de proveedores en modal ℹ️ de OTs asignadas.

**FRs cubiertos:** FR77-FR80 (4 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con capability can_manage_providers), Javier (Supervisor que ve contacto en modal ℹ️)
**Valor entregado:**
- Formulario único para ambos tipos de proveedores
- Un mismo proveedor puede ofrecer ambos servicios
- 6 tipos de servicio predefinidos clasifican especialidades
- Javier ve teléfono del técnico en campo en modal ℹ️
- Javier llama proveedor: toca tarjeta azul 🔵 → modal con teléfono
- Catálogo centralizado de proveedores de mantenimiento y repuestos

**Dependencias:** Epic 1 (requiere autenticación)

---

### Epic 7: Rutinas de Mantenimiento y Generación Automática

Permitir a Elena configurar rutinas de mantenimiento diarias, semanales o mensuales de dos modalidades: (1) Por equipo específico de la jerarquía de activos, o (2) Customizables (ej: orden y limpieza) con campos variables personalizables. Cada rutina configura tareas a realizar, técnico responsable, repuestos necesarios y duración estimada. El sistema genera automáticamente Órdenes de Trabajo preventivas 24 horas antes del vencimiento con estado "Pendiente" y etiqueta "Preventivo". El usuario asignado recibe alertas en 3 momentos: 1 hora antes del vencimiento, en el momento del vencimiento, y 24 horas después si permanece incompleta. El dashboard muestra porcentaje de rutinas completadas.

**FRs cubiertos:** FR81-FR84 (4 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con capability can_manage_routines), María (Técnica asignada a rutinas)
**Valor entregado:**
- Rutinas por equipo específico (ej: Caldera C-101)
- Rutinas customizables (ej: Orden y limpieza general)
- Configuración: tareas, técnico, repuestos, duración
- Generación automática de OTs preventivas 24h antes
- Alertas de vencimiento (1h antes, vencimiento, 24h después)
- Dashboard muestra % rutinas completadas
- Transición de reactivo a proactivo

**Dependencias:** Epic 1 (requiere autenticación), Epic 4 (requiere sistema de OTs)

---

### Epic 8: KPIs, Dashboard y Reportes Automáticos

Permitir a Elena acceder a dashboard común con KPIs básicos visibles para todos (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login, con drill-down para usuarios con capability can_view_kpis (Global → Planta → Línea → Equipo), métricas adicionales (OTs abiertas, OTs completadas, técnicos activos, stock crítico), alertas accionables (stock mínimo, MTFR alto definido como 150% del promedio 30 días, rutinas no completadas), exportación a Excel compatible Microsoft 2016+ con hojas separadas por KPI, y reportes automáticos en PDF enviados por email (diario 8:00 AM, semanal lunes 8:00 AM, mensual primer lunes 9:00 AM) configurables por usuario con capability can_receive_reports.

**FRs cubiertos:** FR85-FR95, FR89, FR104 (12 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con can_view_kpis, can_receive_reports)
**Valor entregado:**
- Dashboard común KPIs básicos para todos al login
- Drill-down (Global → Planta → Línea → Equipo) para análisis avanzado
- KPIs actualizados cada 30 segundos via SSE
- Alertas accionables (stock mínimo, MTFR alto, rutinas vencidas)
- Exportación Excel (.xlsx compatible MS 2016+)
- Reportes automáticos PDF por email (diario, semanal, mensual)
- KPIs configurables por usuario
- "Por primera vez, tengo datos. No adivino."

**Dependencias:** Epic 1 (requiere autenticación), Epic 2-7 (requiere datos de todos los epics anteriores)

---

### Epic 9: Sincronización Multi-Dispositivo y PWA

Permitir a todos los usuarios acceder desde dispositivos desktop, tablet y móvil con diseño responsive (3 breakpoints: >1200px desktop con navegación lateral completa, 768-1200px tablet con navegación simplificada, <768px móvil con navegación inferior y componentes apilados), capacidad de instalar la aplicación como PWA en dispositivos móviles, notificaciones push de cambios de estado, y sincronización de datos en tiempo real via Server-Sent Events (SSE) con actualizaciones cada 30 segundos para OTs y KPIs, heartbeat de 30 segundos y reconexión automática <30s si se pierde conexión temporal.

**FRs cubiertos:** FR96-FR100 (5 requerimientos funcionales)
**Usuario principal:** Todos los usuarios (Carlos móvil, María tablet+móvil, Javier desktop+tablet, Elena desktop)
**Valor entregado:**
- Carlos usa app en móvil Android (PWA instalable)
- María usa tablet en campo + móvil para notificaciones
- Javier usa desktop en oficina + tablet en piso de fábrica
- Elena usa desktop en oficina
- Sincronización SSE cada 30s (compatible Vercel serverless)
- Reconexión automática <30s si pierde conexión
- Touch targets 44x44px mínimos (WCAG AA)
- Kanban responsive (8→2→1 columnas según pantalla)

**Dependencias:** Cross-cutting (mejora experiencia de usuario de todos los epics anteriores)

---

### Epic 10: Funcionalidades Adicionales y UX Avanzada

Implementar funcionalidades que mejoran significativamente la experiencia del usuario: capacidad de rechazar reparación si no funciona correctamente (genera OT de re-trabajo con prioridad alta), búsqueda predictiva universal disponible en cualquier campo del sistema (equipos, componentes, repuestos, OTs, técnicos, usuarios) sin capability específica, historial de acciones de los últimos 30 días para todos los usuarios (login, cambios de perfil, acciones críticas) con vista extendida para administradores, configuración de preferencias de notificación por tipo (habilitar/deshabilitar: recibido, autorizado, en progreso, completado), capacidad de agregar comentarios con timestamp a OTs en progreso, y adjuntar fotos antes y después de la reparación en órdenes de trabajo.

**FRs cubiertos:** FR101, FR103-FR108, FR105-107 (7 requerimientos funcionales)
**Usuario principal:** Todos los usuarios según capabilities
**Valor entregado:**
- Carlos puede rechazar reparación si no funciona (genera OT re-trabajo)
- Búsqueda universal <200ms en cualquier campo
- Usuarios ven su historial acciones últimos 30 días
- Admins ven historial completo de cualquier usuario
- Preferencias de notificación configurables por usuario
- María agrega comentarios con timestamp a OTs
- María adjunta fotos antes/después de reparación
- UX mejorada reduce frustración y aumenta adopción

**Dependencias:** Cross-cutting (funcionalidades adicionales que mejoran todos los epics anteriores)

---

## Epic 1: Autenticación y Gestión de Usuarios PBAC

Establecer la infraestructura técnica base del proyecto (Story 1.1) y el sistema de autenticación con gestión flexible de usuarios usando 15 capacidades individuales (PBAC - Permission-Based Access Control), permitiendo a los administradores gestionar quién puede hacer qué en el sistema sin roles predefinidos. Incluye registro de usuarios, asignación individual de capabilities, etiquetas de clasificación visual, perfiles, cambio de contraseña obligatorio en primer acceso, historial de actividad y control de acceso por módulos.

**FRs cubiertos:** FR58-FR76 (19 requerimientos funcionales)
**Usuario principal:** Elena (Administrador / Jefa de Mantenimiento)
**Valor entregado:**
- Sistema completo de autenticación y autorización funcional
- Elena puede registrar usuarios con credenciales temporales
- Usuarios cambian contraseña obligatoriamente en primer acceso
- Elena asigna las 15 capabilities individualmente (no por roles)
- Elena crea hasta 20 etiquetas de clasificación visual (Operario, Técnico, Supervisor)
- Control de acceso granular por módulos según capabilities
- Historial de actividad de usuarios últimos 6 meses
- **Story 1.1 incluye:** Setup inicial completo (Next.js, Prisma, NextAuth, SSE, shadcn/ui, Vercel)

**Dependencias:** Ninguna (primer epic)

---

### Story 1.1: Puesta en Marcha y Configuración Inicial del Proyecto

As a developer of the gmao-hiansa project,
I want to establish the base technical infrastructure using Next.js 15, Prisma, NextAuth.js, SSE, shadcn/ui, and Vercel,
So that the project has a solid technical foundation on which to build all future functionalities.

**Acceptance Criteria:**

**Given** that a new Next.js project is being started
**When** I execute `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
**Then** the project structure is created with Next.js 15.0.3, TypeScript 5.3.3, Tailwind CSS 3.4.1, and App Router enabled
**And** the `app/` directory is created without `src/` subdirectory
**And** import aliases `@/*` are configured in `tsconfig.json`

**Given** that the Next.js project is created
**When** I install critical dependencies with stable versions
**Then** Prisma 5.22.0, @prisma/client 5.22.0, @prisma/adapter-neon 5.22.0 are installed
**And** next-auth 4.24.7 is installed (NOT using v5 beta)
**And** bcryptjs 2.4.3 and @types/bcryptjs 2.4.6 are installed
**And** zod 3.23.8 is installed for schema validation
**And** date-fns 3.6.0 is installed for date handling
**And** @tanstack/react-query 5.51.0 is installed for data fetching

**Given** that dependencies are installed
**When** I configure Prisma with `npx prisma init`
**Then** the `prisma/schema.prisma` file is created
**And** the `.env` file is created with `DATABASE_URL` placeholder
**And** `DATABASE_URL` is configured to use Neon PostgreSQL

**Given** that Prisma is initialized
**When** I create the `lib/db.ts` file
**Then** a PrismaClient singleton is exported to avoid multiple instances in development
**And** the client is reused throughout the application

**Given** that NextAuth is installed
**When** I create `app/api/auth/[...nextauth]/route.ts`
**Then** NextAuth.js is configured with Credentials provider for email/password
**And** the provider is configured to use Prisma Adapter
**And** the session strategy is `jwt` (NextAuth default)
**And** sessions expire after 8 hours of inactivity

**Given** that NextAuth is configured
**When** I create the User model in `prisma/schema.prisma`
**Then** the User model has fields: id (UUID), name (String), email (String, unique), password (String), isFirstLogin (Boolean, default true), createdAt (DateTime), updatedAt (DateTime)
**And** the password field stores bcrypt hash (never plain text)
**And** the User model is configured with @@map for "users" table

**Given** that the User model is created
**When** I create the `lib/auth.ts` file
**Then** helper functions for hash and verify password using bcryptjs are exported
**And** a function to get current session from server is exported

**Given** that authentication is configured
**When** I create SSE infrastructure in `lib/sse.ts`
**Then** utilities for Server-Sent Events are implemented
**And** a heartbeat of 30 seconds is configured
**And** auto-reconnection logic <30s is implemented

**Given** that SSE infrastructure is created
**When** I create the `/api/v1/sse/route.ts` endpoint
**Then** the endpoint accepts SSE connections from authenticated clients
**And** the endpoint keeps connection alive with 30s heartbeat
**And** the endpoint can send real-time updates for OTs and KPIs

**Given** that base infrastructure is ready
**When** I initialize shadcn/ui with `npx shadcn-ui@latest init`
**Then** the `components.json` file is created with Tailwind configuration
**And** the `components/ui/` directory is created for base components
**And** design system colors are configured (Main Blue #0066CC, Warning/Orange #FD7E14, Success/Green #28A745, Danger/Red #DC3545)

**Given** that shadcn/ui is initialized
**When** I install necessary base components
**Then** Button, Card, Dialog, Form, Input, Label, Select, Toast are installed in `components/ui/`
**And** all components meet WCAG AA (minimum 4.5:1 contrast)
**And** components use minimum touch targets of 44x44px

**Given** that base components are installed
**When** I create the base layout in `app/layout.tsx`
**Then** the layout includes Header, Main, and Footer
**And** the layout uses the PRD design system
**And** the layout is responsive (3 breakpoints: >1200px, 768-1200px, <768px)
**And** base text is minimum 16px for WCAG AA compliance

**Given** that the project is configured locally
**When** I configure deployment on Vercel
**Then** the project is ready for deploy on Vercel
**And** the `DATABASE_URL` environment variable is configured in Vercel
**And** NextAuth.js is compatible with Vercel serverless
**And** SSE is compatible with Vercel serverless (simpler than WebSockets)

**NFRs covered:** NFR-S1, NFR-S2, NFR-S3, NFR-P2 (initial load <3s), Initial architecture requirements

---

### Story 1.2: Modelo de Datos de Usuarios y Capabilities PBAC

As a developer of the system,
I want to create the complete data model with 15 individual capabilities (PBAC) and visual classification tags in Prisma,
So that the system can store and manage users with granular capabilities without predefined roles.

**Acceptance Criteria:**

**Given** that the basic User model exists in `prisma/schema.prisma`
**When** I add additional fields to the User model
**Then** the User model has fields: phoneNumber (String, optional), isActive (Boolean, default true), lastLogin (DateTime, optional)
**And** the email field has format validation
**And** the email field is case-insensitive

**Given** that the User model is updated
**When** I create the Capability enum in `prisma/schema.prisma`
**Then** the enum has the 15 values: CREATE_FAILURE_REPORT, CREATE_MANUAL_OT, UPDATE_OWN_OT, VIEW_OWNS_OTS, VIEW_ALL_OTS, COMPLETE_OT, MANAGE_STOCK, ASSIGN_TECHNICIANS, VIEW_KPIS, MANAGE_ASSETS, VIEW_REPAIR_HISTORY, MANAGE_PROVIDERS, MANAGE_ROUTINES, MANAGE_USERS, RECEIVE_REPORTS
**And** each enum value represents a system capability

**Given** that the Capability enum is created
**When** I create the UserCapability model in `prisma/schema.prisma`
**Then** the UserCapability model has fields: id (UUID), userId (UUID, reference to User), capability (Capability, enum), assignedAt (DateTime), assignedBy (UUID, reference to User, optional)
**And** there is a many-to-one relationship from UserCapability to User (userId → User.id)
**And** there is a many-to-one relationship from UserCapability to User (assignedBy → User.id)
**And** there is a unique composite index (userId, capability) to avoid duplicates

**Given** that the UserCapability model is created
**When** I create the UserTag model in `prisma/schema.prisma`
**Then** the UserTag model has fields: id (UUID), name (String), description (String, optional), color (String, optional), createdAt (DateTime), createdBy (UUID, reference to User)
**And** the name field is unique (maximum 20 tags in the system)
**And** there is a many-to-one relationship from UserTag to User (createdBy → User.id)

**Given** that the UserTag model is created
**When** I create the UserTagAssignment model in `prisma/schema.prisma`
**Then** the UserTagAssignment model has fields: id (UUID), userId (UUID, reference to User), userTagId (UUID, reference to UserTag), assignedAt (DateTime)
**And** there is a many-to-one relationship from UserTagAssignment to User (userId → User.id)
**And** there is a many-to-one relationship from UserTagAssignment to UserTag (userTagId → UserTag.id)
**And** there is a unique composite index (userId, userTagId) to avoid duplicates
**And** a user can have multiple tags assigned simultaneously

**Given** that all models are created
**When** I run `npx prisma migrate dev --name init_user_models`
**Then** the initial migration is created with all models
**And** the tables users, UserCapability, UserTag, UserTagAssignment are created in the database
**And** unique indexes are created correctly
**And** foreign key relationships are created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
**And** TypeScript types are generated automatically
**And** Prisma helpers include the new models

**Given** that models are generated
**When** I create the `types/models.ts` file
**Then** TypeScript types derived from Prisma are exported for User, UserCapability, UserTag, UserTagAssignment
**And** a CapabilityLabel type is created mapping each capability to its readable Spanish label
**And** the mapping includes: CREATE_FAILURE_REPORT → "✅ Reportar averías", CREATE_MANUAL_OT → "Crear OTs manuales", UPDATE_OWN_OT → "Actualizar OTs propias", VIEW_OWNS_OTS → "Ver OTs asignadas", VIEW_ALL_OTS → "Ver todas las OTs", COMPLETE_OT → "Completar OTs", MANAGE_STOCK → "Gestionar stock", ASSIGN_TECHNICIANS → "Asignar técnicos a OTs", VIEW_KPIS → "Ver KPIs avanzados", MANAGE_ASSETS → "Gestionar activos", VIEW_REPAIR_HISTORY → "Ver historial de reparaciones", MANAGE_PROVIDERS → "Gestionar proveedores", MANAGE_ROUTINES → "Gestionar rutinas", MANAGE_USERS → "Gestionar usuarios y sus capacidades", RECEIVE_REPORTS → "Recibir reportes automáticos"

**Given** that types are created
**When** I create the helper function `getDefaultCapabilities()` in `lib/auth.ts`
**Then** the function returns an array with only Capability.CREATE_FAILURE_REPORT
**And** this capability is the default for all new users except the initial administrator

**Given** that default capabilities are defined
**When** I create the helper function `getAllCapabilities()` in `lib/auth.ts`
**Then** the function returns an array with the 15 system capabilities
**And** each capability has its readable Spanish label
**And** capabilities are ordered logically (basic first, then advanced)

**FRs covered:** FR58 (base structure), FR68 (15 capabilities defined), FR59-62 (classification tags), FR66 (default capability)

---

### Story 1.3: Registro de Usuarios por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to register new users in the system by assigning temporary credentials and selecting individual capabilities for each user,
So that I can control who has access to the system and what each user can do without depending on predefined roles.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users/register` route
**Then** I see the user registration form with fields: full name, email, phone (optional), list of 15 capabilities with checkboxes, list of visual classification tags (optional)
**And** the capability checkboxes show readable Spanish labels ("✅ Reportar averías", "✅ Ver todas las OTs", not the internal code names)
**And** the can_create_failure_report checkbox is checked by default (cannot be unchecked)
**And** the email field has format validation
**And** there is a "Generate temporary password" button that creates a secure random password
**And** there is a "Register User" button that creates the user

**Given** that I am on the registration form
**When** I fill in the fields and select the user's capabilities
**Then** I can select from 0 to 15 individual capabilities (except can_create_failure_report which is always checked)
**And** I can select 0 or more visual classification tags from the existing list
**And** the classification tags are completely independent of capabilities (selecting "Operario" does NOT automatically grant capabilities)
**And** I see a visual summary of selected capabilities before creating the user

**Given** that I have completed the form correctly
**When** I click "Register User"
**Then** the system creates the user in the database with isFirstLogin = true status
**And** the password is hashed using bcryptjs before storage (never plain text)
**And** the selected capabilities are saved in the UserCapability table with assignment timestamps
**And** the assignedBy field is registered with my user ID
**And** the selected classification tags are assigned in UserTagAssignment
**And** I see a confirmation message with the created user's name and email
**And** I see the temporary credentials (email and password) to share with the user

**Given** that the user was created successfully
**When** the new user attempts to login for the first time
**Then** the system detects that isFirstLogin = true
**And** the user is redirected to the mandatory password change page
**And** the user cannot navigate to other sections until changing the password

**Given** that I am registering the first user in the system (initial administrator)
**When** the system detects that no other users exist
**Then** the initial administrator is created automatically with all 15 system capabilities preassigned
**And** the initial administrator has can_create_failure_report + the other 14 capabilities
**And** the initial administrator does NOT have isFirstLogin = true (can login normally)
**And** this is the only special case of preassigned capabilities

**Given** that I attempt to register a user with an already existing email
**When** I click "Register User"
**Then** the system shows a validation error: "El email ya está registrado en el sistema"
**And** the user is not created
**And** the form remains with the entered data for correction

**Given** that I attempt to register a user without selecting any additional capability
**When** I click "Register User"
**Then** the system successfully creates the user with only can_create_failure_report (which is default)
**And** the user can report failures but has no other capabilities
**And** I see a warning message: "El usuario tiene solo la capacidad básica de reportar averías. Puede asignar más capabilities más tarde."

**FRs covered:** FR58, FR59, FR62, FR64, FR66, FR67, FR67-A, FR67-B, FR68, FR68-C

---

### Story 1.4: Login de Usuarios con NextAuth

As a user of the gmao-hiansa system (any role),
I want to login using my email and password,
So that I can access the system functionalities according to the capabilities assigned to me.

**Acceptance Criteria:**

**Given** that I am a registered user in the system
**When** I access the `/login` route
**Then** I see a login form with fields: email, password, "Iniciar Sesión" button, "¿Olvidaste tu contraseña?" link (disabled in MVP), "Volver" link
**And** the form uses the PRD design system (colors, typography, 44x44px touch targets)
**And** the form is responsive (3 breakpoints)
**And** the email field has type="email" for browser validation
**And** the password field has type="password" with show/hide button
**And** there is a "Volver" link that redirects to the home page

**Given** that I am on the login form
**When** I correctly fill in email and password
**Then** the "Iniciar Sesión" button is enabled
**And** when clicked, the system sends credentials to NextAuth Credentials provider
**And** NextAuth searches for the user by email in the database
**And** NextAuth compares the hashed password using bcryptjs
**And** if credentials are correct, NextAuth creates a JWT session
**And** the session expires after 8 hours of inactivity
**And** I am redirected to the common dashboard (`/dashboard`)
**And** I see my basic KPIs (MTTR, MTBF, open OTs, critical stock)

**Given** that I attempt to login with an incorrect email
**When** I click "Iniciar Sesión"
**Then** the system shows a generic error: "Credenciales inválidas"
**And** the error does NOT reveal whether the email exists or not (security)
**And** the form remains with entered data for correction
**And** the failed attempt is logged in audit logs

**Given** that I attempt to login with an incorrect password
**When** I click "Iniciar Sesión"
**Then** the system shows a generic error: "Credenciales inválidas"
**And** after 5 failed attempts in 15 minutes from the same IP
**Then** the system temporarily blocks the IP for 15 minutes (Rate Limiting per NFR-S9)
**And** I see a message: "Demasiados intentos fallidos. Intente nuevamente en 15 minutos."
**And** all failed attempts are logged in audit logs

**Given** that I successfully login
**When** NextAuth creates the session
**Then** the JWT session contains: user ID, email, name, list of capabilities, list of classification tags
**And** the last login is updated in the database with current timestamp
**And** the session is stored in an httpOnly cookie for security (NFR-S8)
**And** the cookie has security configuration: secure=true on HTTPS, sameSite=strict

**Given** that I already have an active session
**When** I access `/login` again
**Then** I am automatically redirected to the dashboard (`/dashboard`)
**And** I do not see the login form (already authenticated)

**Given** that I successfully login
**When** I am redirected to the dashboard
**Then** I see a Header with my name and a "Cerrar Sesión" button
**And** the side navigation shows only modules for which I have assigned capabilities (per FR73-74)
**And** if I have no capability beyond can_create_failure_report, I see only the "Reportar Avería" module

**Given** that I login on an unsupported browser (Firefox, Safari)
**When** the page loads
**Then** I see a warning message: "Este navegador no es soportado. Por favor use Chrome o Edge para una experiencia óptima."
**And** I can continue using the application at my own risk (not a block, just a warning)

**Given** that my user is marked as isActive = false
**When** I attempt to login
**Then** the system shows an error: "Su cuenta ha sido desactivada. Contacte al administrador."
**And** I cannot login until an administrator reactivates my account

**FRs covered:** FR58 (basic login), FR69 (profile access), NFR-S1 (mandatory authentication), NFR-S2 (hashed passwords), NFR-S3 (HTTPS/TLS), NFR-S6 (8h sessions), NFR-S9 (rate limiting)

---

### Story 1.5: Cambio de Contraseña Obligatorio en Primer Acceso

As a new user of the system who has just been registered,
I want to be forced to change my temporary password the first time I login,
So that my account has a secure password chosen by me and not the temporary password assigned by the administrator.

**Acceptance Criteria:**

**Given** that I am a user with isFirstLogin = true
**When** I successfully login with my temporary credentials
**Then** the system detects that isFirstLogin = true
**And** I am automatically redirected to the `/change-password` route
**And** I CANNOT navigate to other sections of the application until changing the password
**And** if I attempt to access any other route (e.g., `/dashboard`, `/assets`, `/work-orders`)
**Then** I am redirected back to `/change-password`
**And** I see an explanatory message: "Debe cambiar su contraseña temporal en el primer acceso antes de continuar."

**Given** that I am on the password change page
**When** the page loads
**Then** I see a form with fields: current password (optional for first access), new password, confirm new password, "Cambiar Contraseña" button
**And** I see visible password requirements: minimum 8 characters, at least one uppercase, one lowercase, one number
**And** I see a real-time password strength indicator (weak, medium, strong)
**And** the form uses the PRD design system
**And** password fields have show/hide button

**Given** that I am on the password change form
**When** I type the new password
**Then** I see real-time validation:
- If less than 8 characters: "Mínimo 8 caracteres requeridos"
- If no uppercase: "Al menos una mayúscula requerida"
- If no lowercase: "Al menos una minúscula requerida"
- If no number: "Al menos un número requerido"
- If meets all requirements: "Contraseña fuerte ✅"
**And** the "Cambiar Contraseña" button remains disabled until the password meets all requirements

**Given** that I have entered a valid new password
**When** I complete the "confirm new password" field
**Then** the system validates in real-time that both passwords match
**And** if they don't match: "Las contraseñas no coinciden"
**And** the "Cambiar Contraseña" button is disabled until they match

**Given** that I have completed the form correctly with matching passwords
**When** I click "Cambiar Contraseña"
**Then** the system hashes the new password using bcryptjs
**And** updates the user's password field with the new hash
**And** updates the isFirstLogin field to false
**And** logs the password change in audit logs
**And** displays a success message: "Contraseña cambiada exitosamente. Redirigiendo al dashboard..."
**And** automatically redirects me to the `/dashboard` dashboard after 2 seconds
**And** I can now freely navigate all modules according to my capabilities

**Given** that I have already changed my password (isFirstLogin = false)
**When** I login in the future
**Then** I am NO longer redirected to `/change-password`
**And** I can access the dashboard directly
**And** the login flow is normal

**Given** that I am the initial administrator with all 15 capabilities preassigned
**When** I login for the first time
**Then** I do NOT have isFirstLogin = true (special case per FR68-C)
**And** I can access the dashboard directly without changing password
**And** I can voluntarily change my password from my profile if desired

**Given** that I attempt to change my password later (not first access)
**When** I access `/change-password` from my profile
**Then** I must enter my current password to confirm my identity
**And** the "current password" field is required
**And** the system validates that the current password is correct before allowing the change
**And** the rest of the flow is the same as first access

**FRs covered:** FR58, FR71 (change password), FR72-A (mandatory change on first access), FR72-B (temporary credentials)

---

### Story 1.6: Gestión de Capabilities por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to edit any user's capabilities using a visual interface with readable Spanish checkboxes,
So that I can adjust what each user can do according to changing needs without depending on rigid roles.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users` route
**Then** I see a list of all system users
**And** the list shows: name, email, classification tags (colored badges), number of assigned capabilities, status (active/inactive), last login
**And** there is an "Editar Capabilities" button in each user row
**And** there is a "Ver Perfil Completo" button that opens a details modal

**Given** that I am on the users list
**When** I click "Editar Capabilities" for a user
**Then** a modal or page opens at `/users/[id]/edit-capabilities`
**And** I see the user's name and email in the header
**And** I see the 15 capabilities organized in a list with checkboxes
**And** each checkbox shows the readable Spanish label ("✅ Reportar averías", "Crear OTs manuales", "Actualizar OTs propias", etc.)
**And** the user's currently assigned capabilities are checked
**And** the can_create_failure_report checkbox is checked and cannot be unchecked (always default)
**And** there is a brief description of each capability on hover (tooltip)
**And** I see a visual summary of assigned capabilities: "7 of 15 capabilities selected"
**And** there are "Cancelar" and "Guardar Cambios" buttons

**Given** that I am editing a user's capabilities
**When** I check or uncheck boxes
**Then** the visual summary updates in real-time: "8 of 15 capabilities selected"
**And** capabilities are organized in logical groups:
- **Básicas:** Reportar averías (always checked), Ver OTs asignadas
- **Trabajo:** Actualizar OTs propias, Completar OTs, Crear OTs manuales
- **Visibilidad:** Ver todas las OTs, Ver historial reparaciones, Ver KPIs avanzados
- **Gestión:** Gestionar activos, Gestionar stock, Gestionar proveedores, Gestionar rutinas, Asignar técnicos a OTs
- **Administración:** Gestionar usuarios y sus capacidades, Recibir reportes automáticos
**And** I see a visual separator between groups
**And** there are "Marcar Todas" and "Desmarcar Todas" buttons for quick editing

**Given** that I have modified capabilities
**When** I click "Guardar Cambios"
**Then** the system shows a confirmation dialog: "¿Está seguro de cambiar las capabilities de este usuario? Esta acción afectará su acceso al sistema."
**And** if I confirm, the system:
- Deletes all current user capabilities (UserCapability records)
- Creates new UserCapability records for selected capabilities
- Registers assignedBy with my user ID
- Registers assignedAt timestamp
- Logs the change in audit logs with details: which capabilities were added, which were removed
- Shows success message: "Capabilities actualizadas exitosamente para [Nombre Usuario]"
**And** if I cancel, changes are discarded and modal closes

**Given** that I am editing my own capabilities (I am Elena editing myself)
**When** I uncheck the can_manage_users capability
**Then** the system shows a special warning: "ADVERTENCIA: Está a punto de quitarse la capability de gestionar usuarios. No podrá editar usuarios ni capabilities después de guardar. ¿Desea continuar?"
**And** I must explicitly confirm with a checkbox "Entiendo las consecuencias" before being able to save
**And** if I confirm and save, I lose access to `/users` immediately
**And** I am redirected to dashboard and navigation no longer shows "Usuarios"

**Given** that I am the only user with can_manage_users in the system
**When** I attempt to uncheck my own can_manage_users capability
**Then** the system shows a blocking error: "ERROR: No puede quitarse la última capability can_manage_users del sistema. Debe haber al menos un administrador."
**And** the can_manage_users checkbox remains checked and disabled
**And** I cannot save changes

**Given** that I have successfully saved capability changes
**When** the affected user is logged into the system
**Then** the user's session updates in real-time via SSE
**And** the user's navigation updates immediately (modules appear/disappear)
**And** if the user lost access to a module where they were, they see a message: "Sus permisos han cambiado. Ha sido redirigido."
**And** if the user gained access to a new module, it appears immediately in their navigation

**Given** that I am editing the initial administrator's capabilities
**When** I see their capabilities
**Then** all 15 capabilities are checked (special case FR68-C)
**And** I can uncheck capabilities except can_manage_users if they are the only admin
**And** the system functions the same as any other user

**Given** that I want to see what capabilities a user has without editing
**When** I click "Ver Perfil Completo"
**Then** a read-only modal opens with:
- User's basic information
- List of assigned capabilities with disabled checkboxes (read-only)
- List of assigned classification tags
- History of capability changes last 6 months
**And** there is no "Guardar" button (read-only)

**FRs covered:** FR58, FR67 (readable checkboxes), FR68 (15 capabilities), FR68-A, FR69-A (edit user info), NFR-S5 (audit logs for critical actions)

---

### Story 1.7: Etiquetas de Clasificación Visual

As an Elena (Administrator with can_manage_users capability),
I want to create, edit, and delete up to 20 visual classification tags (e.g., Operario, Técnico, Supervisor) and assign them to users for visual organization,
So that I can visually classify users without these tags affecting their capabilities (they are completely independent).

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access the `/users/tags` route
**Then** I see a visual classification tags management page
**And** I see a list of all existing tags
**And** each tag shows: name, color (badge), description (optional), number of users who have it assigned, creation date, creator
**And** there is a "Crear Nueva Etiqueta" button
**And** each tag has "Editar" and "Eliminar" buttons
**And** I see the total count: "X of 20 tags created"

**Given** that I am on the tags management page
**When** I click "Crear Nueva Etiqueta"
**Then** a modal opens with form:
- "Nombre de etiqueta" field (text, required, max 50 characters)
- "Descripción" field (optional text, max 200 characters)
- "Color" selector (7 predefined semaphore colors: green #28A745, orange #FD7E14, red #DC3545, blue #17A2B8, yellow #FFC107, gray #6C757D, purple #6F42C1)
- Badge preview with selected color
- "Cancelar" and "Crear Etiqueta" buttons
**And** the form validates that no other tag with the same name exists (case-insensitive)

**Given** that I have completed the new tag form
**When** I click "Crear Etiqueta"
**Then** the system validates:
- Name is not empty
- Name is not duplicated (case-insensitive)
- Does not exceed the limit of 20 tags in the system
**And** if validation passes:
- Creates the UserTag record in the database
- Registers createdBy with my user ID
- Registers createdAt with current timestamp
- Shows success message: "Etiqueta [Nombre] creada exitosamente"
- Closes the modal and updates the tag list
**And** if validation fails:
- Shows specific error
- The modal remains open for correction

**Given** that I want to edit an existing tag
**When** I click "Editar" on a tag
**Then** a modal opens with the pre-filled form:
- Tag name (editable)
- Description (editable)
- Color selector (editable)
- Updated badge preview
- "Cancelar" and "Guardar Cambios" buttons
**And** I see how many users have this tag assigned
**And** if there are assigned users, I see a warning: "X users have this tag assigned. Changes will affect all these users."

**Given** that I am editing a tag
**When** I change the name, description, or color
**Then** the badge preview updates in real-time
**And** when I click "Guardar Cambios":
- The system updates the UserTag record
- Users who have this tag assigned see the updated badge in real-time via SSE
- The change is logged in audit logs
- Shows success message: "Etiqueta [Nombre] actualizada exitosamente"

**Given** that I want to delete a tag
**When** I click "Eliminar" on a tag
**Then** the system shows a confirmation dialog: "¿Está seguro de eliminar la etiqueta [Nombre]? This action will unassign the tag from X users who have it assigned."
**And** if I confirm:
- Deletes the UserTag record
- Deletes all associated UserTagAssignment records (users lose the tag)
- Logs the deletion in audit logs
- Shows success message: "Etiqueta [Nombre] eliminada exitosamente"
**And** if I cancel, the action is cancelled

**Given** that I am creating a tag and 20 tags already exist in the system
**When** I click "Crear Nueva Etiqueta"
**Then** the button is disabled
**And** I see a message: "Ha alcanzado el límite máximo de 20 etiquetas. Elimine etiquetas existentes antes de crear nuevas."
**And** No more tags can be created

**Given** that I want to assign tags to a user
**When** I am on the user editing screen (Story 1.6)
**Then** I see a "Etiquetas de Clasificación Visual" section
**And** I see a multi-select list with existing tags
**And** The user's currently assigned tags are checked
**And** I can select or deselect multiple tags
**And** I see a preview of the badges the user will have assigned
**And** When saving user changes:
- Selected tags are assigned in UserTagAssignment
- Deselected tags are removed from UserTagAssignment
- The user sees their updated tags in their profile in real-time

**Given** that I am viewing a user's profile (not editing)
**When** I look at their classification tags
**Then** I see colored badges for each assigned tag
**And** On hover over a badge, I see tooltip with tag name and description
**And** Tags are SOLO visual for classification
**And** Tags do NOT grant, do NOT remove, do NOT modify capabilities

**Given** that I am any user (not administrator)
**When** I access my profile
**Then** I can see the tags I have assigned
**And** I CANNOT edit my own tags
**And** I CANNOT edit other users' tags (no access to `/users/tags`)

**Given** that I assign the "Operario" tag to Carlos
**When** Carlos has the can_create_failure_report capability
**Then** Carlos has the "Operario" badge as a visual tag in his profile
**And** Carlos can continue reporting failures (his capability)
**And** If I later also assign him the "Técnico" tag
**Then** Carlos has both badges: "Operario" and "Técnico"
**And** Tags do NOT grant new capabilities to Carlos

**FRs covered:** FR59 (create up to 20 tags), FR61 (delete tags), FR62 (multiple tags simultaneously), FR64 (assign tags), FR65 (remove tags), FR67-A (tags independent of capabilities), FR67-B (same tag does NOT grant same capabilities)

---

### Story 1.8: Perfil de Usuario y Gestión de Credenciales

As a user of the system (any role),
I want to access my personal profile to view and edit my information (name, email, phone) and change my password,
So that I can keep my data updated and maintain my account security.

**Acceptance Criteria:**

**Given** that I am an authenticated user
**When** I access the `/profile` route
**Then** I see the "Mi Perfil" page with sections:
- **Información Personal:** full name, email, phone (optional), last password change date
- **Mis Capabilities:** list of capabilities I have assigned (read-only, badges)
- **Mis Etiquetas:** badges of classification tags I have assigned (read-only)
- **Seguridad:** "Cambiar Contraseña" button
- **"Guardar Cambios"** button (to edit personal information)
**And** the page uses the PRD design system
**And** the page is responsive (3 breakpoints)

**Given** that I am on my profile
**When** I want to edit my personal information
**Then** the name, email, and phone fields are editable
**And** the email field has real-time format validation
**And** if I change the email to one that already exists in the system, I see error: "Este email ya está registrado"
**And** the "Guardar Cambios" button is only enabled when there are changes
**And** when I click "Guardar Cambios":
- The system validates the data
- Updates my User record in the database
- Logs the change in audit logs
- Shows success message: "Información actualizada exitosamente"
**And** if I change my email, my session updates with the new email

**Given** that I am on my profile
**When** I want to change my password
**Then** I click the "Cambiar Contraseña" button
**And** a modal opens or I go to `/profile/change-password`
**And** I see a form with fields:
- Current password (required to verify myself)
- New password
- Confirm new password
**And** I see password requirements: minimum 8 characters, one uppercase, one lowercase, one number
**And** I see real-time strength indicator
**And** fields have show/hide button
**And** when I complete the form and click "Cambiar Contraseña":
- The system validates that the current password is correct
- Hashes the new password with bcryptjs
- Updates the password field in the database
- Logs the change in audit logs
- Shows success message: "Contraseña cambiada exitosamente"
- Closes the modal

**Given** that I am Elena (administrator with can_manage_users capability)
**When** I access another user's profile at `/users/[id]/profile`
**Then** I can see all the user's information:
- Personal information (name, email, phone)
- Assigned capabilities (list with badges)
- Assigned classification tags
- Status (active/inactive)
- Last login
- Account creation date
**And** I see "Editar Información" and "Gestionar Capabilities" buttons (Story 1.6)
**And** The information is read-only in the profile view
**And** I can edit the user's personal information by clicking "Editar Información"

**Given** that Elena is editing another user's personal information
**When** she modifies name, email, or phone
**Then** The system allows editing the same fields that the user edits in their own profile
**And** Elena can view and edit any user's personal information
**And** Changes are logged in audit logs with "editedBy: Elena"

**Given** that I am a user without can_manage_users capability
**When** I attempt to access another user's profile at `/users/[id]/profile`
**Then** The system denies me access (FR73, FR75)
**And** I see a message: "No tiene permiso para ver perfiles de otros usuarios. Contacte al administrador."
**And** I am redirected to my own profile `/profile`
**And** The navigation does not show "Users" module (I don't have can_manage_users capability)

**Given** that I am on my profile
**When** I look at the "Mis Capabilities" section
**Then** I see a list of the capabilities I have assigned
**And** Each capability is shown as a badge with its Spanish label ("✅ Reportar averías", "Ver todas las OTs", etc.)
**And** Capabilities are read-only (I cannot edit them here, that's Story 1.6)
**And** I see a summary: "Tienes X of 15 system capabilities"

**Given** that I am on my profile
**When** I look at the "Mis Etiquetas" section
**Then** I see badges of classification tags I have assigned
**And** If I have "Operario" and "Técnico" tags, I see both badges
**And** Tags are read-only (I cannot edit them myself)
**And** I understand that tags are only visual for classification

**Given** that I want to change my profile photo (optional, not in MVP)
**When** I am on my profile
**Then** This functionality is NOT available in MVP (future)
**And** I see an avatar placeholder with my initials

**FRs covered:** FR69 (profile access), FR69-A (Elena edits any user's info), FR70 (user edits own info), FR71 (change password), FR73 (access by modules), FR74 (navigation by capabilities), FR75 (denied unauthorized access), FR76 (explanatory message)

---

### Story 1.9: Historial de Actividad de Usuarios

As an Elena (Administrator with can_manage_users capability),
I want to view the activity history of any user for the last 6 months and their completed work history (OTs, productivity),
So that I can audit the performance and activity of team members.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I access a user's profile at `/users/[id]/profile`
**Then** I see an "Historial de Actividad" section with tabs:
- "Actividad de Sistema" (last 6 months)
- "Historial de Trabajos" (completed OTs, productivity)

**Given** that I am on the "Actividad de Sistema" tab
**When** the tab loads
**Then** I see a table or timeline with the user's actions from the last 6 months:
- Date and time of action
- Action type (login, profile change, capability change, tag assignment)
- Action details (e.g., "Capabilities changed: +Asignar técnicos, -Ver KPIs")
- Performed by (who did the action, if another administrator)
**And** There are filters by: action type, date range
**And** There is an "Exportar a Excel" button to download the history
**And** Most recent actions appear first (descending chronological order)

**Given** that I am filtering the activity history
**When** I select an action type (e.g., "Cambio de capabilities")
**Then** the table shows only actions of that type
**And** I see count: "X actions found in date range"
**And** I can apply multiple filters simultaneously

**Given** that I am on the "Historial de Trabajos" tab
**When** the tab loads
**Then** I see a summary of the user's performance:
- Total completed OTs (in selected date range)
- User's average MTTR (Mean Time To Repair)
- Completed OTs per week (average)
- Most frequently used spare parts
- Last completed OT (date and equipment)
**And** I see a bar chart with completed OTs per week
**And** I see a detailed list of completed OTs with:
- OT number
- Completion date
- Equipment
- Total repair time
- Spare parts used
- Link to the OT (to view details)

**Given** that I want to filter work history by date range
**When** I select a range (e.g., "Last 30 days", "Last 3 months", "Custom")
**Then** the KPIs are recalculated for the selected range
**And** the chart updates with range data
**And** the OT list is filtered by completion date

**Given** that I am Elena viewing María's work history
**When** I see that María has an MTTR of 3.5 hours (low average)
**Then** I see a positive indicator: "MTTR de 3.5h (18% faster than team average) 🟢"
**And** If María has an MTTR of 7 hours (high average)
**Then** I see an attention indicator: "MTTR de 7h (40% slower than team average) 🔴"
**And** Indicators compare with team average

**Given** that I am a user without can_manage_users capability
**When** I access my own profile `/profile`
**Then** I see a "Mi Actividad" section with:
- My last 30 days of activity (read-only)
- Recent logins
- Profile changes I made
- I do NOT see completed work history (need specific capability per FR72-C)
**And** The history is limited to my own actions
**And** The range is fixed to last 30 days (cannot see 6 months)

**Given** that I am a user with can_view_all_ots capability (but without can_manage_users)
**When** I am on my profile
**Then** I do NOT see the work history section (per FR72-C, that capability is different)
**And** I only see my system activity from last 30 days

**Given** that I want to view the activity history of a user with many records
**When** the table has more than 50 records
**Then** the table is paginated (50 records per page)
**And** I see pagination controls: "Anterior", "Page X of Y", "Siguiente"
**And** I can jump to a specific page
**And** Pagination does not affect Excel export (exports everything)

**Given** that I click "Exportar a Excel" on activity history
**When** the file is generated
**Then** a .xlsx file compatible with Microsoft Excel 2016+ is downloaded
**And** The file has separate sheets: "Actividad de Sistema", "Historial de Trabajos" (if applicable)
**And** Each sheet has corresponding columns with complete data
**And** The file includes the user's name and export date in the filename: "historial_juan_perez_2026-03-07.xlsx"

**Given** that a user has been deleted from the system
**When** I attempt to view their activity history
**Then** I see a message: "Este usuario ha sido eliminado del sistema. El historial no está disponible."
**And** The profile view option no longer exists in the user list

**FRs covered:** FR72 (activity history last 6 months), FR72-C (complete work history with completed OTs, user MTTR, spare parts used, productivity), NFR-S5 (audit logs for critical actions)

---

### Story 1.10: Eliminación de Usuarios por Administrador

As an Elena (Administrator with can_manage_users capability),
I want to delete users from the system who no longer work at the company or no longer need access,
So that I can keep the user list updated and avoid orphaned accounts.

**Acceptance Criteria:**

**Given** that I am a user with can_manage_users capability
**When** I am on the users list `/users`
**Then** each user row has an "Eliminar Usuario" button
**And** the button has a trash icon and warning color (red)
**And** on hover, I see tooltip: "Eliminar este usuario del sistema"

**Given** that I want to delete a user
**When** I click "Eliminar Usuario" on any row
**Then** a confirmation modal opens with:
- Title: "¿Eliminar Usuario?"
- Message: "Está a punto de eliminar al usuario [Nombre] ([Email]) del sistema. Esta acción es irreversible."
- Prominent warnings:
  - "⚠️ El usuario perderá todo acceso al sistema inmediatamente"
  - "⚠️ Las OTs asignadas al usuario se reasignarán o cancelarán"
  - "⚠️ El historial del usuario se mantendrá para auditoría"
- List of OTs currently assigned to the user (if any)
- "Motivo de eliminación" field (text, required, max 500 characters)
- OT handling options:
  - "Reasignar a:" [dropdown of other users]
  - "Cancelar OTs abiertas"
- Confirmation checkbox: "Entiendo que esta acción no se puede deshacer"
- Buttons: "Cancelar" (secondary), "Eliminar Usuario" (danger, disabled until confirmed)

**Given** that the user has OTs currently assigned
**When** I open the deletion modal
**Then** I see a summary: "Este usuario tiene X OTs asignadas:"
- List of OTs with number, equipment, status
- "X en En Progreso", "Y en Pendiente", "Z Pendiente Repuesto"
**And** I must select how to handle each OT before deleting
**And** The options are:
- Reassign to another user (I select from dropdown)
- Cancel OT (I check "Cancelar OTs abiertas" checkbox)
- For each OT, I choose individually or in bulk

**Given** that I have completed the deletion form
**When** I select to reassign OTs to another user
**Then** the dropdown shows only users with can_update_own_ot or can_complete_ot capability
**And** I see the number of OTs the selected user already has assigned
**And** If I reassign, OTs are transferred with history maintained (shows who worked on the OT before)

**Given** that I have completed all required fields
**When** I check the confirmation checkbox and click "Eliminar Usuario"
**Then** the system:
- Verifies that I completed deletion reason
- Verifies that I selected OT handling (if there are any)
- Marks the user as isActive = false (soft delete)
- Updates deletedAt field with current timestamp
- Registers deletedBy with my user ID
- Saves the deletion reason
- Reassigns or cancels OTs according to my selection
- Logs the deletion in audit logs
- Shows success message: "Usuario [Nombre] eliminado exitosamente. X OTs reasignadas, Y OTs canceladas."
**And** The user disappears from the active users list
**And** The user can no longer login (attempts login → "Cuenta desactivada")

**Given** that I have deleted a user
**When** I go to the users list
**Then** the deleted user NO longer appears in the main list
**And** If I activate a "Mostrar inactivos" filter, I see deleted users with "Inactivo" badge
**And** I can "Reactivar" a deleted user (marks them as isActive = true)

**Given** that I am the only user with can_manage_users capability
**When** I attempt to delete myself
**Then** the system shows a blocking error: "ERROR: No puede eliminarse a sí mismo si es el único administrador del sistema."
**And** The "Eliminar Usuario" button is disabled on my own row
**And** I must assign can_manage_users to another user before I can delete myself

**Given** that there are other users with can_manage_users capability
**When** I attempt to delete myself
**Then** the system shows a warning: "ADVERTENCIA: Está a punto de eliminarse a sí mismo del sistema. Perderá acceso inmediatamente. ¿Desea continuar?"
**And** I must explicitly confirm with an additional checkbox: "Entiendo que perderé acceso al sistema inmediatamente."
**And** If I confirm, I delete myself and am redirected to login (my session ends)

**Given** that I deleted a user by mistake
**When** I want to undo the deletion
**Then** there is NO "restore" function in the modal (the action is marked as irreversible)
**And** I can reactivate a deleted user from the inactive list (if I activate the filter)
**And** When reactivating, the user regains access with their previous credentials
**And** OTs that were cancelled during deletion are NOT restored (remain cancelled)

**Given** that a deleted user attempts to login
**When** they enter their credentials
**Then** the system detects that isActive = false or deletedAt is not null
**And** shows error: "Su cuenta ha sido desactivada o eliminada. Contacte al administrador."
**And** the user cannot access the system

**Given** that I am deleting a user with extensive history
**When** I confirm the deletion
**Then** the user's activity history is preserved in the database (for auditing)
**And** OTs completed by the user maintain the record that they worked on them
**And** The history can be consulted by activating "Mostrar inactivos" filters

**FRs covered:** FR70-A (delete users), NFR-S5 (audit logs for critical actions)

---

### Story 1.11: Control de Acceso por Módulos

As a user of the system with specific assigned capabilities,
I want to access only the modules for which I have capacities and see dynamic navigation based on my permissions,
So that the interface shows only what I can do and does not confuse me with unauthorized options.

**Acceptance Criteria:**

**Given** that I am an authenticated user with specific capabilities
**When** I successfully login
**Then** I am redirected to the common dashboard `/dashboard`
**And** I see the side navigation (or hamburger on mobile)
**And** the navigation shows ONLY the modules for which I have assigned capabilities
**And** modules without permissions do NOT appear in navigation
**And** The number of visible modules varies according to my capabilities

**Given** that I have only the can_create_failure_report capability (basic user like Carlos)
**When** I see the navigation
**Then** I see ONLY one visible module: "Reportar Avería"
**And** I do NOT see: "Órdenes de Trabajo", "Activos", "Repuestos", "Proveedores", "Rutinas", "KPIs", "Usuarios"
**And** The navigation is minimalist according to my permissions

**Given** that I have capabilities: can_create_failure_report, can_view_own_ots, can_update_own_ot, can_complete_ot (technician like María)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Mis Órdenes de Trabajo"
**And** I do NOT see management modules: "Activos", "Repuestos", "Proveedores", "Rutinas", "KPIs", "Usuarios"

**Given** that I have capabilities: can_view_all_ots, can_assign_technicians (supervisor like Javier)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Tablero Kanban" (all team OTs)
**And** I can view and manage OTs from the entire team

**Given** that I have capabilities: can_view_kpis, can_manage_users, can_manage_assets (administrator like Elena)
**When** I see the navigation
**Then** I see ALL system modules:
- "Reportar Avería"
- "Mis Órdenes de Trabajo"
- "Tablero Kanban"
- "Activos"
- "Repuestos"
- "Proveedores"
- "Rutinas"
- "Dashboard de KPIs"
- "Usuarios"
**And** I have complete access to all functionalities

**Given** that I have capability can_manage_stock (stock manager like Pedro)
**When** I see the navigation
**Then** I see the modules:
- "Reportar Avería"
- "Repuestos"
**And** I can manage stock but do NOT see other modules

**Given** that I am on the common dashboard
**When** I see the basic KPIs (MTTR, MTBF, open OTs, critical stock)
**Then** these KPIs are visible to ALL users (no specific capability required)
**And** If I have can_view_kpis capability
**Then** KPIs are interactive and I can drill-down (Global → Planta → Línea → Equipo)
**And** If I do NOT have can_view_kpis
**Then** KPIs are read-only (I cannot interact beyond the general view)

**Given** that I attempt to access an UNAUTHORIZED module
**When** I type the URL directly in the browser (e.g., `/assets` without can_manage_assets)
**Then** the system detects that I do not have the required capability
**And** shows an error message: "Acceso Denegado"
**And** shows an explanatory message: "No tiene permiso para acceder a este módulo. Contacte al administrador."
**And** I am redirected to the dashboard after 3 seconds
**And** The unauthorized access attempt is logged in audit logs

**Given** that I attempt to access multiple unauthorized routes
**When** the system detects the attempt pattern
**Then** after 10 failed attempts in 5 minutes from my IP
**Then** the system temporarily blocks my IP for 5 minutes
**And** I see message: "Demasiados intentos de acceso no autorizado. Intente nuevamente en 5 minutos."

**Given** that an administrator assigns me new capabilities
**When** the capabilities are saved
**Then** my session updates in real-time via SSE
**And** Navigation updates immediately (new modules appear, old ones disappear)
**And** If I am in a module I lost access to
**Then** I see a message: "Sus permisos han cambiado. Ha sido redirigido."
**And** I am automatically redirected to the dashboard

**Given** that I am using a tablet (768-1200px)
**When** I see the navigation
**Then** Navigation is simplified for medium screens
**And** Modules are organized in a compact menu
**And** Touch targets remain 44x44px minimum

**Given** that I am using a mobile (<768px)
**When** I see the navigation
**Then** Navigation is at the bottom of the screen
**And** Modules are organized in a horizontal menu with icons
**And** Touching an icon opens the corresponding module
**And** Touch targets are 44x44px minimum (WCAG AA)

**Given** that I have capability can_view_own_ots but NOT can_view_all_ots
**When** I access the Work Orders section
**Then** I see ONLY "Mis Órdenes de Trabajo" (those where I am assigned)
**And** I do NOT see the "Tablero Kanban" (requires can_view_all_ots)
**And** I cannot see other users' OTs

**Given** that I have capability can_view_all_ots
**When** I access the Work Orders section
**Then** I see BOTH options: "Mis Órdenes de Trabajo" and "Tablero Kanban"
**And** I can toggle between personal view and supervisor view
**And** The OTs module is complete

**Given** that I am on the "Reportar Avería" page
**When** the page loads
**Then** I can access because I have can_create_failure_report (all users have it)
**And** The form is available and functional

**Given** that an administrator removes my can_create_failure_report capability (extreme case, should not happen per FR66)
**When** I attempt to access any module
**Then** I have NO modules available in navigation
**And** I see a special message: "Su usuario no tiene capabilities asignadas. Contacte al administrador."
**And** I am redirected to the dashboard (which still shows basic KPIs)

**Given** that I am using the system
**When** my session expires after 8 hours of inactivity
**Then** I am redirected to `/login`
**And** I see a message: "Su sesión ha expirado. Por favor haga login nuevamente."

**FRs covered:** FR73 (access by modules according to capabilities), FR74 (navigation shows only authorized modules), FR75 (automatic denial of direct URL), FR76 (explanatory message for denied access), FR91 (common dashboard with basic KPIs for all), FR91-A (drill-down only with can_view_kpis), NFR-S6 (sessions expire 8h)

---

## ✅ Epic 1 Completado - Resumen

**Epic 1: Autenticación y Gestión de Usuarios PBAC**

**Stories creadas:** 11 stories
- Story 1.1: Puesta en Marcha y Configuración Inicial ✅
- Story 1.2: Modelo de Datos de Usuarios y Capabilities PBAC ✅
- Story 1.3: Registro de Usuarios por Administrador ✅
- Story 1.4: Login de Usuarios con NextAuth ✅
- Story 1.5: Cambio de Contraseña Obligatorio en Primer Acceso ✅
- Story 1.6: Gestión de Capabilities por Administrador ✅
- Story 1.7: Etiquetas de Clasificación Visual ✅
- Story 1.8: Perfil de Usuario y Gestión de Credenciales ✅
- Story 1.9: Historial de Actividad de Usuarios ✅
- Story 1.10: Eliminación de Usuarios por Administrador ✅
- Story 1.11: Control de Acceso por Módulos ✅

**FRs cubiertos:** FR58-FR76 (19 requerimientos funcionales) + NFRs técnicos + requisitos de arquitectura inicial

**Estado:** Epic 1 COMPLETADO y validado por el usuario.

---

## Epic 2: Gestión de Activos y Jerarquía de 5 Niveles

Permitir a los usuarios gestionar la estructura completa de activos con jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), relaciones muchos-a-muchos entre componentes y equipos, historial completo de reparaciones por equipo, 5 estados de equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado), stock de equipos completos reutilizables, importación masiva de hasta 10,000 activos desde CSV y códigos QR para identificación.

**FRs cubiertos:** FR32-FR43, FR108 (13 requerimientos funcionales)
**Usuario principal:** Elena (Administrador con can_manage_assets), técnicos con can_view_repair_history
**Valor entregado:**
- Jerarquía completa de 5 niveles navegable en cualquier dirección
- Relaciones muchos-a-muchos (un componente sirve a múltiples equipos)
- Historial de reparaciones por equipo con fechas, repuestos usados, técnicos
- 5 estados de equipos con visualización de stock de reutilizables
- Importación CSV masiva con validación estructural automática
- Códigos QR para identificación rápida de equipos

**Dependencias:** Epic 1 (requiere autenticación y capabilities)

---

### Story 2.1: Modelo de Datos de Jerarquía de 5 Niveles

As a developer of the system,
I want to create the Prisma data model with the 5 asset hierarchy tables (Planta, Linea, Equipo, Componente, Repuesto) with foreign key relationships and structural validations,
So that the system can store and manage the complete asset hierarchy structure of the metalworking company.

**Acceptance Criteria:**

**Given** that I am defining the Prisma schema in `prisma/schema.prisma`
**When** I create the Planta model
**Then** the Planta model has fields:
- id (UUID, primary key)
- nombre (String, required, unique, max 200 characters)
- descripcion (String, optional, max 500 characters)
- direccion (String, optional)
- ciudad (String, optional)
- codigo (String, optional, unique for short identification)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "plantas" table

**Given** that the Planta model is created
**When** I create the Linea model
**Then** the Linea model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 500 characters)
- codigo (String, optional, unique within the plant)
- plantaId (UUID, foreign key → Planta.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "lineas" table
- And there is a many-to-one relationship from Linea to Planta (plantaId → Planta.id)

**Given** that the Linea model is created
**When** I create the Equipo model
**Then** the Equipo model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the line)
- numeroSerie (String, optional, unique in entire system)
- modelo (String, optional)
- fabricante (String, optional)
- añoFabricacion (Int, optional)
- lineaId (UUID, foreign key → Linea.id)
- estado (Enum EquipoEstado, default OPERATIVO)
- ubicacionActual (String, optional, for reusable equipment)
- esReutilizable (Boolean, default false)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "equipos" table
- And there is a many-to-one relationship from Equipo to Linea (lineaId → Linea.id)
- And there is an EquipoEstado enum with values: OPERATIVO, AVERIADO, EN_REPARACION, RETIRADO, BLOQUEADO

**Given** that the Equipo model is created
**When** I create the Componente model
**Then** the Componente model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the equipment)
- numeroParte (String, optional, manufacturer code)
- equipoId (UUID, foreign key → Equipo.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "componentes" table
- And there is a many-to-one relationship from Componente to Equipo (equipoId → Equipo.id)

**Given** that the Componente model is created
**When** I create the Repuesto model
**Then** the Repuesto model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique within the component)
- numeroParte (String, optional, manufacturer code)
- componenteId (UUID, foreign key → Componente.id)
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt)
- @@map for "repuestos" table
- And there is a many-to-one relationship from Repuesto to Componente (componenteId → Componente.id)

**Given** that all 5 models are created
**When** I create the EquipoComponente model for many-to-many relationships
**Then** the EquipoComponente model has fields:
- id (UUID, primary key)
- equipoId (UUID, foreign key → Equipo.id)
- componenteId (UUID, foreign key → Componente.id)
- fechaAsignacion (DateTime, default now())
- notas (String, optional)
- @@map for "equipo_componentes" table
- And there is a unique composite index (equipoId, componenteId) to avoid duplicates
- And there is a many-to-one relationship from EquipoComponente to Equipo
- And there is a many-to-one relationship from EquipoComponente to Componente

**Given** that all models are defined
**When** I run `npx prisma migrate dev --name init_jerarquia_activos`
**Then** the initial migration is created with the 5 hierarchy models
**And** the tables plantas, lineas, equipos, componentes, repuestos are created in the database
**And** the equipo_componentes table is created for many-to-many relationships
**And** foreign keys are created correctly
**And** unique indexes are created correctly
**And** the EquipoEstado enum is created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
**And** TypeScript types are generated automatically
**And** Prisma helpers include the new models with their relationships

**Given** that models are generated
**When** I create the `types/assets.ts` file
**Then** TypeScript types derived from Prisma are exported for Planta, Linea, Equipo, Componente, Repuesto, EquipoComponente
**And** a JerarquíaActivo type is created representing the complete 5-level structure
**And** an EquipoEstado type is created with the 5 possible states

**Given** that I am using the generated models
**When** I query a Planta with Prisma
**Then** I can include its Lineas using `include: { lineas: true }`
**And** each Linea can include its Equipos
**And** each Equipo can include its Componentes
**And** each Componente can include its Repuestos
**And** the complete hierarchy can be queried in a single query

**FRs covered:** FR32 (5-level hierarchy), base structure for FR34 (many-to-many relationships), FR36 (5 equipment states)

---

### Story 2.2: Gestión de Plantas y Líneas

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Production Plants and Lines,
So that I can define the organizational structure of the metalworking company with its two specialized plants (profiled steel and sandwich panel).

**Acceptance Criteria:**

**Given** that I am a user with can_manage_assets capability
**When** I access the `/assets/plantas` route
**Then** I see a list of all system Plants
**And** each Plant row shows: name, city, code (optional), number of lines, status (active/inactive)
**And** there is a "Crear Nueva Planta" button
**And** each Plant has "Ver Detalles", "Editar", "Eliminar" buttons
**And** there is a search to filter Plants by name or city
**And** the list is paginated (20 plants per page)

**Given** that I am on the Plants list
**When** I click "Crear Nueva Planta"
**Then** a modal opens or I go to `/assets/plantas/new`
**And** I see a form with fields:
- Plant Name (text, required, max 200 characters)
- Description (optional text, max 500 characters)
- Address (optional text)
- City (optional text)
- Code (optional text, max 50 characters)
- "Cancelar" and "Crear Planta" buttons
**And** the Name field validates that it's not duplicated (case-insensitive)
**And** the Code field validates that it's not duplicated (if provided)

**Given** that I have completed the New Plant form
**When** I click "Crear Planta"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Planta record in the database
- Shows success message: "Planta [Nombre] creada exitosamente"
- Redirects to the Plants list
- The new Plant appears in the list
**And** if validation fails:
- Shows specific errors
- The form remains open for correction

**Given** that I want to see a Plant's details
**When** I click "Ver Detalles" on a Plant
**Then** I go to `/assets/plantas/[id]`
**And** I see the Plant's complete information:
- All Plant fields (name, description, address, city, code)
- List of Lines associated with this Plant
- Total number of Equipos in this Plant (summing all Lines)
- Total number of Componentes
- Total number of Repuestos
- Creation date
- Last update date
**And** there is a "Crear Nueva Línea" button to add lines to this Plant

**Given** that I am viewing a Plant's details
**When** I see the list of associated Lines
**Then** each Line shows: name, code, number of equipments, status
**And** there is a "Ver" button on each Line to navigate to Line details
**And** there are "Editar" and "Eliminar" buttons on each Line
**And** I can view Lines in table or card format (toggle)

**Given** that I am on a Plant's details page
**When** I click "Crear Nueva Línea"
**Then** a modal opens within the Plant page
**And** the form has fields:
- Line Name (text, required, max 200 characters)
- Description (optional text, max 500 characters)
- Code (optional text, max 50 characters, unique within the Plant)
- "Cancelar" and "Crear Línea" buttons
**And** the Code field validates that it's not duplicated within this Plant

**Given** that I have completed the New Line form
**When** I click "Crear Línea"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Linea record in the database with current Plant's plantaId
- Shows success message: "Línea [Nombre] creada exitosamente en Planta [Nombre Planta]"
- The new Line appears in the Plant's Lines list
**And** if validation fails:
- Shows specific errors

**Given** that I want to edit an existing Plant
**When** I click "Editar" on a Plant
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new name already exists in another Plant, shows error
- If the new code already exists in another Plant, shows error
- If validation is correct, updates the Planta record
- Logs the update in audit logs
- Shows success message: "Planta actualizada exitosamente"

**Given** that I want to delete a Plant
**When** I click "Eliminar" on a Plant
**Then** the system shows a confirmation dialog: "¿Eliminar Planta [Nombre]? This action will also delete all associated Lines, Equipos, Componentes, and Repuestos. This action is irreversible."
**And** if the Plant has associated Equipos
**Then** I see a summary: "This Plant has X Lines with Y Equipos in total."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará toda la jerarquía debajo de esta Planta."
**And** if I confirm:
- The system marks the Plant as isActive = false (soft delete)
- Marks all associated Lines as isActive = false
- Marks all associated Equipos as isActive = false
- Marks all Componentes and Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Planta eliminada exitosamente. X Líneas, Y Equipos eliminados."
**And** the Plant disappears from the main list (but can be seen by activating "Mostrar inactivos" filter)

**Given** that I am a user without can_manage_assets capability
**When** I attempt to access `/assets/plantas`
**Then** the system denies me access (per FR73)
**And** I see message: "No tiene permiso para acceder a este módulo. Contacte al administrador."
**And** I am redirected to the dashboard

**Given** that I have can_view_repair_history capability but NOT can_manage_assets
**When** I access `/assets/plantas`
**Then** I see Plants in read-only mode
**And** I do NOT see "Crear", "Editar" or "Eliminar" buttons
**And** I can navigate the hierarchy to view repair history

**Given** that I am navigating Plants and Lines
**When** I want to see the hierarchical structure
**Then** I can click on a Plant to see its Lines
**Then** I can click on a Line to see its Equipos
**Then** navigation is intuitive following the Plant → Line → Equipo hierarchy

**FRs covered:** FR33 (navigate hierarchy), FR32 (5-level structure), FR73 (access by capabilities)

---

### Story 2.3: Gestión de Equipos con Estados

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Equipos within Lines, managing their 5 states (Operativo, Averiado, En Reparación, Retirado, Bloqueado),
So that I can maintain the complete inventory of machinery and equipment in the plant with their current status.

**Acceptance Criteria:**

**Given** that I am on a Line's details page at `/assets/lineas/[id]`
**When** the page loads
**Then** I see the Line's information (name, description, code)
**And** I see a list of Equipos associated with this Line
**And** each Equipo shows: name, code, serial number, model, manufacturer, status (colored badge), current location (if reusable)
**And** there is a "Crear Nuevo Equipo" button
**And** each Equipo has "Ver Detalles", "Editar", "Cambiar Estado", "Eliminar" buttons
**And** there are filters by status and search by name or code
**And** the list is paginated (20 equipos per page)

**Given** that Equipo states are:
- OPERATIVO (green): Equipment is functioning normally
- AVERIADO (red): Equipment is reported as faulty and not operational
- EN_REPARACION (orange): Equipment is currently being repaired
- RETIRADO (gray): Equipment has been permanently retired from service
- BLOQUEADO (yellow): Equipment is blocked for safety or maintenance
**When** I see the Equipos list
**Then** each state is shown with a corresponding colored badge
**And** the badge has readable text and meets WCAG AA (4.5:1 contrast)

**Given** that I am on a Line's Equipos list
**When** I click "Crear Nuevo Equipo"
**Then** a modal opens or I go to `/assets/equipos/new?lineaId=[id]`
**And** I see a form with fields:
- Equipo Name (text, required, max 200 characters)
- Description (optional text, max 1000 characters)
- Code (optional text, max 50 characters, unique within the Line)
- Serial Number (optional text, unique in entire system)
- Model (optional text)
- Manufacturer (optional text)
- Year of Manufacture (optional number, between 1900 and current year)
- Estado (dropdown, required, options: OPERATIVO, AVERIADO, EN_REPARACION, RETIRADO, BLOQUEADO)
- Es Reutilizable (checkbox, default false)
- Ubicación Actual (optional text, required if reusable)
- "Cancelar" and "Crear Equipo" buttons
**And** the Code field validates that it's not duplicated within this Line
**And** the Serial Number field validates that it's not duplicated in the entire system
**And** the Year of Manufacture field validates that it's between 1900 and current year

**Given** that I check "Es Reutilizable" as true
**When** the form detects this change
**Then** the "Ubicación Actual" field becomes required
**And** I see a help message: "Especifique la ubicación actual del equipo (ej: Almacén Central, Planta A - Área de Producción)"
**And** the Estado field shows additional visible options: Disponible, En Uso, En Reparación, Descartado

**Given** that I have completed the New Equipo form
**When** I click "Crear Equipo"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Equipo record in the database with current Line's lineaId
- Default estado is OPERATIVO (if not specified otherwise)
- If reusable, marks esReutilizable = true
- Shows success message: "Equipo [Nombre] creado exitosamente en Línea [Nombre Línea]"
- The new Equipo appears in the list
**And** if validation fails:
- Shows specific errors

**Given** that I want to edit an existing Equipo
**When** I click "Editar" on an Equipo
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID and lineaId
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new code already exists in this Line, shows error
- If the new serial number already exists in the system, shows error
- If validation is correct, updates the Equipo record
- Logs the update in audit logs
- Shows success message: "Equipo actualizado exitosamente"

**Given** that I want to change an Equipo's status
**When** I click "Cambiar Estado" on an Equipo
**Then** a simple modal opens with:
- Equipo's current estado (colored badge)
- Dropdown to select new estado
- "Motivo del cambio" field (text, required, max 500 characters)
- "Cancelar" and "Cambiar Estado" buttons
**And** the dropdown only shows states that can be transitioned from the current estado:
- From OPERATIVO: → AVERIADO, EN_REPARACION, BLOQUEADO, RETIRADO
- From AVERIADO: → OPERATIVO (if repaired), EN_REPARACION, RETIRADO
- From EN_REPARACION: → OPERATIVO, AVERIADO, RETIRADO
- From RETIRADO: → (cannot change, final state)
- From BLOQUEADO: → OPERATIVO, AVERIADO, RETIRADO

**Given** that I have selected the new estado and provided the reason
**When** I click "Cambiar Estado"
**Then** the system:
- Updates the Equipo's estado field
- Logs the estado change in audit logs with reason
- Logs who made the change (my user ID)
- Logs the timestamp of the change
- Shows success message: "Estado del Equipo cambiado to [NEW STATE] exitosamente"
**And** the estado badge in the list updates immediately with the new color

**Given** that I change an Equipo's estado to AVERIADO
**When** the change is saved
**Then** the system checks if there is an open failure report for this equipment
**And** if a report exists, it automatically associates it
**And** if no report exists, the AVERIADO estado is saved without associated report

**Given** that I change an Equipo's estado from AVERIADO to OPERATIVO
**When** the change is saved
**Then** the system checks if there is an open OT for this equipment
**And** if an open OT exists with "En Progreso" or "Completada" status, it suggests completing the OT first

**Given** that I want to delete an Equipo
**When** I click "Eliminar" on an Equipo
**Then** the system shows a confirmation dialog: "¿Eliminar Equipo [Nombre]? This action will also delete all associated Componentes and Repuestos. This action is irreversible."
**And** if the Equipo has associated Componentes
**Then** I see a summary: "Este Equipo has X Componentes with Y Repuestos in total."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará toda la jerarquía beneath this Equipo."
**And** if I confirm:
- The system marks the Equipo as isActive = false (soft delete)
- Marks all associated Componentes and Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Equipo eliminado exitosamente. X Componentes, Y Repuestos eliminados."
**And** the Equipo disappears from the main list

**Given** that I am viewing the Equipos list
**When** I apply the "Estado: AVERIADO" filter
**Then** I see only Equipos with AVERIADO status
**And** I can quickly see which equipment needs attention

**Given** that I am viewing the Equipos list
**When** I apply the "Solo Reutilizables" filter
**Then** I see only Equipos with esReutilizable = true
**And** each Equipo shows its current location
**And** I can see the stock of reusable equipment by estado

**Given** that I want to see an Equipo's complete details
**When** I click "Ver Detalles" on an Equipo
**Then** I go to `/assets/equipos/[id]`
**And** I see all the Equipo's information:
- All Equipo fields
- Current estado with colored badge
- Estado change history last 6 months (timeline)
- List of associated Componentes
- List of associated OTs (if I have can_view_repair_history capability)
- If reusable: current location, location history
- Creation date
- Last update date

**FRs covered:** FR36 (5 equipment states), FR37 (change estado), FR38 (stock of reusable equipment), FR39 (track current location), FR33 (navigate hierarchy)

---

### Story 2.4: Gestión de Componentes con Relaciones Muchos-a-Muchos

As an Elena (Administrator with can_manage_assets capability),
I want to create, edit, view, and delete Componentes within Equipos, with the ability to associate a Componente to multiple Equipos (many-to-many relationship),
So that I can manage components that serve more than one equipment without duplicating information.

**Acceptance Criteria:**

**Given** that I am on an Equipo's details page at `/assets/equipos/[id]`
**When** the page loads
**Then** I see the Equipo's information
**And** I see a list of Componentes associated with this Equipo
**And** each Componente shows: name, code, part number, short description
**And** there is a "Crear Nuevo Componente" button
**And** each Componente has "Ver Detalles", "Editar", "Asignar a otro Equipo", "Eliminar" buttons
**And** there is a search to filter Componentes by name or code
**And** the list is paginated (20 componenti per page)

**Given** that I am on an Equipo's Componentes list
**When** I click "Crear Nuevo Componente"
**Then** a modal opens or I go to `/assets/componentes/new?equipoId=[id]`
**And** I see a form with fields:
- Componente Name (text, required, max 200 characters)
- Description (optional text, max 1000 characters)
- Code (optional text, max 50 characters, unique within the Equipo)
- Part Number (optional text, manufacturer code)
- "Cancelar" and "Crear Componente" buttons
**And** the Code field validates that it's not duplicated within this Equipo
**And** the componente is automatically associated with the current Equipo

**Given** that I have completed the New Componente form
**When** I click "Crear Componente"
**Then** the system validates the data
**And** if validation is correct:
- Creates the Componente record in the database with current Equipo's equipoId
- Creates a record in EquipoComponente associating the Componente to the Equipo
- Shows success message: "Componente [Nombre] creado exitosamente en Equipo [Nombre Equipo]"
- The new Componente appears in the list
**And** if validation fails:
- Shows specific errors

**Given** that I want to see a Componente's details
**When** I click "Ver Detalles" on a Componente
**Then** I go to `/assets/componentes/[id]`
**And** I see all the Componente's information:
- All Componente fields
- List of Equipos to which it is associated (many-to-many relationship)
- For each associated Equipo: name, code, assignment date
- List of Repuestos within this Componente
- Creation date
- Last update date

**Given** that I am viewing a Componente's details
**When** I see the "Equipos Asociados" section
**Then** I see a list of all Equipos that use this Componente
**And** if the Componente is associated to multiple Equipos
**Then** I see more than one Equipo listed (e.g., "Motor eléctrico 50HP is in 3 equipos: Prensa PH-500, Prensa PH-600, Compresor C-100")
**And** this demonstrates the many-to-many relationship

**Given** that I want to associate an existing Componente to another Equipo
**When** I am on a Componente's details page
**Then** I see an "Asignar a otro Equipo" button
**And** when clicked, a modal opens with:
- List of all system Equipos (with filter by Planta/Línea)
- Checkboxes to select one or more Equipos
- "Notas de asignación" field (optional text, max 500 characters)
- "Cancelar" and "Asignar" buttons
**And** Equipos that already have this Componente associated appear marked/disabled

**Given** that I have selected one or more additional Equipos
**When** I click "Asignar"
**Then** the system:
- Creates EquipoComponente records for each new selected Equipo
- Registers the assignment date as current timestamp
- Saves assignment notes if provided
- Logs the association in audit logs
- Shows success message: "Componente assigned to X Equipos exitosamente"
**And** the Componente now appears in each selected Equipo's Componentes list

**Given** that I want to edit a Componente
**When** I click "Editar" on a Componente
**Then** a modal opens with the form pre-filled with current data
**And** all fields are editable except ID
**And** NOTE: Changing the equipoId field is NOT the correct way to manage multiple associations
**And** when I click "Guardar Cambios":
- The system validates the data
- If the new code already exists in this Equipo, shows error
- If validation is correct, updates the Componente record
- Logs the update in audit logs
- Shows success message: "Componente actualizado exitosamente"

**Given** that I want to dissociate a Componente from an Equipo
**When** I am on a Componente's details page
**Then** in the "Equipos Asociados" section, each Equipo has a "Desasociar" button
**And** when I click "Desasociar" on an Equipo
**Then** the system shows a confirmation dialog: "¿Desasociar Componente [Nombre] from Equipo [Nombre Equipo]? This action removes the relationship but does NOT delete the Componente nor the Equipo."
**And** if I confirm:
- Deletes the corresponding EquipoComponente record
- Logs the dissociation in audit logs
- Shows success message: "Componente dissociated from Equipo exitosamente"
**And** the Componente NO longer appears in that Equipo's Componentes list
**And** The Componente continues to exist and can remain associated to other Equipos

**Given** that I want to delete a Componente completely
**When** I click "Eliminar" on a Componente
**Then** the system shows a warning dialog: "¿Eliminar Componente [Nombre]? This action will remove the Componente from ALL associated Equipos (X equipos) and also delete all Repuestos beneath. This action is irreversible."
**And** I see a summary: "Este Componente is associated to X Equipos and has Y Repuestos."
**And** I must explicitly confirm with a checkbox: "Entiendo que esta action eliminará the Componente from all Equipos and its Repuestos."
**And** if I confirm:
- Deletes all associated EquipoComponente records
- Marks the Componente as isActive = false (soft delete)
- Marks all this Componente's Repuestos as isActive = false
- Logs the deletion in audit logs
- Shows success message: "Componente eliminado exitosamente. X associations deleted, Y Repuestos deleted."
**And** the Componente disappears from all Equipos

**Given** that I am viewing an Equipo
**When** I see a Componente with a "Multiple Equipos" badge
**Then** the Componente is associated to 2 or more Equipos
**And** on hover over the badge
**Then** I see a tooltip: "Este componente is in X equipos: [list of equipo names]"
**And** this helps me quickly understand that the Componente is shared

**Given** that I am creating a new Equipo
**When** I want to associate existing Componentes
**Then** I can select Componentes from other Equipos during creation
**And** I see a search of existing Componentes in the system
**And** I can select multiple Componentes to associate to the new Equipo
**And** When creating the Equipo, EquipoComponente relationships are created automatically

**Given** that I want to see all system Componentes
**When** I access `/assets/componentes`
**Then** I see a global Componentes list
**And** each Componente shows: name, number of associated equipos, number of repuestos
**And** there are filters by Planta/Línea/Equipo
**And** there is a global search
**And** I can see Componentes that are in multiple Equipos with a special badge

**FRs covered:** FR34 (componente to multiple equipos), FR33 (navigate hierarchy), FR32 (5-level structure)

---

### Story 2.6: Navegación Jerárquica de Activos

As a user with capabilities to view assets (can_manage_assets or can_view_repair_history),
I want to navigate the complete 5-level asset hierarchy (Planta → Línea → Equipo → Componente → Repuesto) using an interactive tree view and predictive search,
So that I can quickly find any asset in the system regardless of its position in the hierarchy.

**Acceptance Criteria:**

**Given** that I have can_manage_assets capability
**When** I access `/assets`
**Then** I see the Asset Management main page
**And** I see two main views: "Vista de Árbol Jerárquico" and "Vista de Listado"
**And** I can toggle between the two views
**And** The tree view is selected by default

**Given** that I am in "Vista de Árbol Jerárquico"
**When** the view loads
**Then** I see an expandable/collapsible tree structure
**And** The top level shows all Plantas as main nodes
**And** Each Planta has a [+] expansion icon
**And** Clicking [+] expands to show Líneas of that Planta
**And** Each Línea has a [+] expansion icon
**And** Expanding a Línea shows its Equipos
**And** Each Equipo can expand to show Componentes
**And** Each Componente can expand to show Repuestos
**And** The complete hierarchy is navigated by expanding/collapsing nodes

**Given** that I am navigating the hierarchical tree
**When** I click any node (Planta, Línea, Equipo, Componente, Repuesto)
**Then** A right side panel shows that node's details
**And** I see action buttons according to my capabilities (View, Edit, Delete)
**And** For Equipos: I see "Ver Historial de Reparaciones" if I have can_view_repair_history
**And** For Repuestos: I see "Ver Uso en OTs" if I have can_view_repair_history
**And** I can navigate quickly without changing pages

**Given** that I want to use predictive search
**When** I am at `/assets`
**Then** I see a search bar at the top
**And** The bar has placeholder: "Buscar activos (equipos, componentes, repuestos)..."
**And** When I start typing (debouncing 300ms)
**Then** The system searches in real-time and shows suggestions
**And** Suggestions show:
- Asset name
- Complete hierarchical path (e.g., "Prensa PH-500 (Panel Sandwich > Línea 2 > Equipos)")
- Asset type icon (distinct icon for Equipo/Componente/Repuesto)
**And** Suggestions appear in less than 200ms (NFR-P1)
**And** Maximum 10 suggestions shown

**Given** that I select a search suggestion
**When** I click the result
**Then** The hierarchical tree automatically expands to the selected asset's level
**And** The side panel shows that asset's details
**And** The path to the asset is highlighted in the tree

**Given** that I am in "Vista de Listado"
**When** the view loads
**Then** I see a paginated table with ALL system assets
**And** The table has columns: Type, Name, Hierarchical Path, Code, Status (for equipos), Actions
**And** There are advanced filters:
- Dropdown "Tipo": Todos, Plantas, Líneas, Equipos, Componentes, Repuestos
- Dropdown "Planta": All or specific plantas
- Dropdown "Estado": Todos, Operativo, Averiado, En Reparación, Retirado, Bloqueado
- Text search
**And** I can apply multiple filters simultaneously
**And** The list updates in real-time (SSE every 30s)

**Given** that I want to see only AVERIADO Equipos
**When** I apply filters "Tipo: Equipos" and "Estado: Averiado"
**Then** I see only Equipos with AVERIADO estado
**And** Each row shows the Equipo with red badge
**And** I can quickly see which equipment needs attention

**Given** that I want to navigate upwards from a Repuesto in the hierarchy
**When** I am viewing a Repuesto's details
**Then** I see breadcrumbs: "Assets > Plantas > [Planta] > Líneas > [Línea] > Equipos > [Equipo] > Componentes > [Componente] > Repuestos > [Repuesto]"
**And** Each breadcrumb level is a clickable link
**And** Clicking "Equipos > [Equipo]" takes me to the parent Equipo
**Then** I can continue going up levels: Equipo → Línea → Planta

**Given** that I want to navigate downwards from an Equipo in the hierarchy
**When** I am viewing an Equipo's details
**Then** I see sections for "Componentes" and "Repuestos"
**And** Each section shows a list with links to each child
**Then** I can click any Componente to navigate down
**Then** From the Componente, I can click any Repuesto to go down another level

**FRs covered:** FR33 (navigate hierarchy any direction), FR102 (predictive global search <200ms), NFR-P1 (<200ms search), NFR-P2 (<3s initial load), NFR-P5 (<100ms transitions)


---

### Story 2.7: Historial de Reparaciones por Equipo

As a user with can_view_repair_history capability (technicians, supervisors, administrators),
I want to view the complete repair history of any equipment, including all completed OTs with dates, spare parts used, and assigned technicians,
So that I can identify patterns of failures, most problematic equipment, and make informed maintenance decisions.

**Acceptance Criteria:**

**Given** that I have can_view_repair_history capability
**When** I view an Equipo's details page at `/assets/equipos/[id]`
**Then** I see a "Historial de Reparaciones" section
**And** This section shows a list of all completed OTs associated with this Equipo
**And** Each OT in the history shows:
- OT number (clickable link to OT details)
- Completion date
- Maintenance type (Preventivo/Correctivo)
- Assigned technician(s)
- Total repair time (hours)
- Spare parts used (list with quantities)
- Final Equipment estado after repair

**Given** that I am viewing the repair history
**When** The list loads
**Then** Most recent OTs appear first (descending chronological order)
**And** The list is paginated (20 OTs per page)
**And** There are filters by:
- Date range (from - to)
- Maintenance type (All, Preventivo, Correctivo)
- Assigned technician
- Final Equipment estado
**And** There is a search by OT number or description

**Given** that I apply a date range filter
**When** I select "Last 30 days"
**Then** I see only OTs completed in the last 30 days
**And** I see a summary: "X OTs found in this period"
**And** I see calculated KPIs for this period:
- Average MTTR of this Equipo in the period
- Total number of failures
- Most used spare parts (top 5)
- Trend: "↑ 20% more failures than previous period" or "↓ 15% less failures"

**FRs covered:** FR35 (complete OT history with dates, parts, technicians), FR102 (search), NFR-P2 (<3s load)

---

### Story 2.8: Importación Masiva CSV de Activos

As an Elena (Administrator with can_manage_assets capability),
I want to import up to 10,000 assets from a CSV file with automatic structural validation of the 5-level hierarchy,
So that I can quickly populate the system with all existing assets without manual data entry.

**Acceptance Criteria:**

**Given** that I have can_manage_assets capability
**When** I access `/assets/importar`
**Then** I see the bulk import page with sections:
- Step 1: Download CSV Template
- Step 2: Complete Template with Data
- Step 3: Upload CSV File
- Step 4: Validate and Confirm Import

**Given** that I click "Download CSV Template"
**When** The download starts
**Then** File `plantilla_importacion_activos.csv` downloads
**And** The file has columns for all 5 levels
**And** The file includes 5 example rows to illustrate format

**Given** that I upload the CSV file
**When** I click "Validate File"
**Then** The system validates:
- Correct CSV format
- Required columns present
- Valid hierarchical structure
- Unique codes within each level
- Valid equipment estados
- Maximum 10,000 rows
**And** Validation completes in less than 5 minutes for 10,000 rows (NFR-P7)

**Given** that validation completes with errors
**When** I see the results report
**Then** I see: "❌ Validation failed. [X] rows with errors found."
**And** I see a list of errors by line number with clear descriptions
**And** I can download an error report in Excel format

**Given** that validation succeeds
**When** I confirm the import
**Then** The system imports all rows in a single database transaction
**And** All Plantas, Líneas, Equipos, Componentes, Repuestos are created
**And** The process completes in less than 5 minutes (NFR-P7)
**And** I see a success message with counts of each asset type created

**FRs covered:** FR40 (bulk CSV import), FR41 (automatic structural validation), FR42 (results report), FR43 (download template), NFR-P7 (<5min for 10K assets)

---

### Story 2.9: Códigos QR para Identificación de Equipos

As an Elena (Administrator with can_manage_assets capability),
I want to generate QR codes for each equipment and print QR labels for identification,
So that operators can quickly scan equipment codes with mobile devices to view details or report failures.

**Acceptance Criteria:**

**Given** that I am viewing an Equipo's details at `/assets/equipos/[id]`
**When** The page loads
**Then** I see a "Código QR" section with:
- The generated QR code for the Equipo
- "Download QR" button (downloads PNG image)
- "Print QR Label" button
- "Print Batch of Labels" button

**Given** that I view the QR code
**When** The QR is displayed
**Then** The QR contains: Type "EQUIPO", Equipo ID, code, app URL
**And** The QR is a standard square scannable by any QR scanner
**And** The size is 300x300 pixels

**Given** that I click "Download QR"
**When** The download starts
**Then** File `qr_equipo_[codigo].png` downloads
**And** The image has white background, black QR, good contrast
**And** The image includes the Equipo name below the QR
**And** High resolution (300 DPI) for clear printing

**Given** that I click "Print QR Label"
**When** Print dialog opens
**Then** I see a label preview with:
- QR code (3x3 cm, centered)
- Equipo name (large, bold text)
- Equipo code (medium text)
- Línea and Planta (small text)
- Instruction: "Escanee para ver detalles en la app"
**And** Label dimensions are 10x6 cm

**Given** that I am Carlos (operario) with mobile
**When** I scan an Equipo's QR code
**Then** My mobile app opens/redirects to `/assets/equipos/[id]`
**And** I see equipment details
**And** I see "Reportar Avería" button if AVERIADO
**And** I can report failure in seconds from the scanned QR

**FRs covered:** FR108 (QR codes for equipment identification), base QR functionality for Phase 3 (advanced tracking)

---

## ✅ Epic 2 Completado - Resumen

**Epic 2: Gestión de Activos y Jerarquía de 5 Niveles**

**Stories creadas:** 9 stories
- Story 2.1: Modelo de Datos de Jerarquía de 5 Niveles ✅
- Story 2.2: Gestión de Plantas y Líneas ✅
- Story 2.3: Gestión de Equipos con Estados ✅
- Story 2.4: Gestión de Componentes con Relaciones Muchos-a-Muchos ✅
- Story 2.5: Gestión de Repuestos dentro de Componentes ✅
- Story 2.6: Navegación Jerárquica de Activos ✅
- Story 2.7: Historial de Reparaciones por Equipo ✅
- Story 2.8: Importación Masiva CSV de Activos ✅
- Story 2.9: Códigos QR para Identificación de Equipos ✅

**FRs cubiertos:** FR32-FR43, FR108 (13 requerimientos funcionales)

**Estado:** Epic 2 COMPLETADO.
---

## Epic 4: Órdenes de Trabajo y Kanban Digital

Permitir a técnicos como María y supervisores como Javier gestionar el ciclo de vida completo de Órdenes de Trabajo con 8 estados (Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada), Kanban digital de 8 columnas con código de colores (7 tipos visuales), asignación múltiple de 1-3 técnicos o proveedores, vista de listado con filtros, capacidad de agregar repuestos usados, notas internas, comentarios con timestamp y fotos antes/después de la reparación.

**FRs cubiertos:** FR11-FR31 (21 requerimientos funcionales)
**Usuario principal:** María (Técnica), Javier (Supervisor)
**Dependencias:** Epic 1, Epic 2, Epic 3

### Story 4.1: Modelo de Datos de Órdenes de Trabajo

Crear modelo Prisma con 8 estados, tipo mantenimiento, asignación múltiple y relaciones.

### Story 4.2: Creación Manual de OTs

Elena y Javier pueden crear OTs sin aviso previo.

### Story 4.3: Kanban Digital 8 Columnas

Javier gestiona visualmente todas las OTs en tablero Kanban con código de colores.

### Story 4.4: Gestión de Estados por Técnico

María cambia estado de sus OTs (ASIGNADA→EN PROGRESO→COMPLETADA).

### Story 4.5: Asignación Múltiple 1-3 Técnicos/Proveedores

Javier asigna múltiples usuarios a cada OT.

### Story 4.6: Confirmación Recepción Reparación Externa

Confirmar recepción de equipo cuando proveedor lo devuelve.

### Story 4.7: Vista Listado con Filtros Avanzados

Tabla paginada con filtros por 5 criterios y ordenamiento.

### Story 4.8: Comentarios, Fotos y Notas

Documentación con comentarios timestamp, fotos antes/después.

### Story 4.9: Sincronización SSE y Toggle Vistas

Actualizaciones en tiempo real cada 30s via SSE, alternar Kanban/Listado.

---

## Epic 5: Control de Stock y Repuestos

Permitir a gestores como Pedro controlar stock de repuestos en tiempo real con ubicación física visible, actualizaciones silenciosas, alertas solo por stock mínimo.

**FRs:** FR16, FR44-FR56 (14 FRs)
**Usuario:** Pedro (can_manage_stock), María (usa repuestos)

### Story 5.1: Modelo de Datos de Repuestos de Stock

Crear tabla RepuestoStock con campos: stockActual, stockMinimo, ubicacionAlmacen, proveedorId.

### Story 5.2: Vista de Stock en Tiempo Real

Todos los usuarios ven stock actualizado en tiempo real (1s, silencioso).

### Story 5.3: Actualización Silenciosa de Stock

Cuando María usa repuestos en OT, stock actualiza sin notificar a Pedro.

### Story 5.4: Alertas de Stock Mínimo

Pedro recibe alertas solo al alcanzar stock mínimo (no spam por cada uso).

### Story 5.5: Gestión de Stock y Ajustes Manuales

Pedro gestiona stock, hace ajustes manuales con motivo obligatorio.

### Story 5.6: Generación de Pedidos a Proveedores

Pedro genera pedidos desde alertas de stock mínimo.

### Story 5.7: Importación Masiva CSV de Repuestos

Importar repuestos masivamente desde CSV con validación.

---

## Epic 6: Gestión de Proveedores

Permitir a Elena gestionar catálogo de proveedores de mantenimiento y repuestos.

**FRs:** FR77-FR80 (4 FRs)

### Story 6.1: CRUD de Proveedores

Formulario único para proveedores de mantenimiento y repuestos con campo Tipo.

### Story 6.2: 6 Tipos de Servicio

Asociar proveedores con tipos: Mantenimiento Correctivo/Preventivo/Reglamentario/Repuestos/Equipos Específicos/Emergencia.

---

## Epic 7: Rutinas de Mantenimiento y Generación Automática

Permitir a Elena configurar rutinas que generan OTs preventivas automáticamente 24h antes.

**FRs:** FR81-FR84 (4 FRs)

### Story 7.1: Configuración de Rutinas

Crear rutinas por equipo específico o customizables (orden/limpieza).

### Story 7.2: Generación Automática de OTs Preventivas

Sistema genera OTs preventivas 24h antes del vencimiento con estado PENDIENTE y etiqueta "Preventivo".

### Story 7.3: Alertas de Vencimiento

Usuario asignado recibe alertas: 1h antes, vencimiento, 24h después.

### Story 7.4: Dashboard de Cumplimiento

Dashboard muestra % rutinas completadas.

---

## Epic 8: KPIs, Dashboard y Reportes Automáticos

Permitir a Elena acceder a dashboard con MTTR/MTBF drill-down, métricas adicionales, alertas accionables, exportación Excel y reportes automáticos PDF por email.

**FRs:** FR85-FR95, FR89, FR104 (12 FRs)

### Story 8.1: Dashboard Común con KPIs Básicos

Todos los usuarios ven MTTR, MTBF, OTs abiertas, stock crítico al login.

### Story 8.2: Drill-down Multi-Nivel de KPIs

Elena con can_view_kpis puede navegar: Global→Planta→Línea→Equipo.

### Story 8.3: Alertas Accionables

Alertas: stock mínimo, MTFR alto, rutinas no completadas.

### Story 8.4: Exportación Excel

Exportar reportes KPIs a .xlsx compatible MS 2016+.

### Story 8.5: Reportes Automáticos PDF por Email

Configurar reportes automáticos: diario 8AM, semanal lunes 8AM, mensual lunes 9AM.

### Story 8.6: Configuración de Reportes por Usuario

Usuario con can_receive_reports configura KPIs y frecuencia.

---

## Epic 9: Sincronización Multi-Dispositivo y PWA

Permitir acceso desde desktop/tablet/móvil con responsive design 3 breakpoints, PWA instalable, SSE cada 30s.

**FRs:** FR96-FR100 (5 FRs)

### Story 9.1: Responsive Design 3 Breakpoints

Desktop >1200px: navegación lateral completa
Tablet 768-1200px: navegación simplificada
Móvil <768px: navegación inferior + componentes apilados

### Story 9.2: Kanban Responsive

8 columnas desktop, 2 columnas tablet, 1 columna móvil con swipe horizontal.

### Story 9.3: PWA Instalable

Instalar app en móviles como app nativa.

### Story 9.4: Notificaciones Push

Notificaciones push para cambios de estado OT.

### Story 9.5: SSE para Sincronización

SSE con heartbeat 30s, reconexión automática <30s.

---

## Epic 10: Funcionalidades Adicionales y UX Avanzada

Implementar funcionalidades que mejoran la experiencia del usuario.

**FRs:** FR101, FR103-FR108, FR105-107 (7 FRs)

### Story 10.1: Rechazo de Reparación

Carlos puede rechazar reparación si no funciona → genera OT re-trabajo prioridad alta.

### Story 10.2: Búsqueda Universal

Búsqueda predictiva global en <200ms sin capability específica.

### Story 10.3: Historial de Acciones

Usuarios ven su actividad últimos 30 días. Admins ven historial completo cualquier usuario.

### Story 10.4: Preferencias de Notificación

Configurar notificaciones por tipo (habilitar/deshabilitar).

### Story 10.5: Comentarios con Timestamp

María agrega comentarios con timestamp a OTs en progreso.

### Story 10.6: Fotos Antes/Después

María adjunta fotos antes/después de reparación.

### Story 10.7: Códigos QR (Funcionalidad Base)

Escanear QR de equipo para ver detalles o reportar avería (base para Phase 3).

---

## ✅ Resumen Final de Todos los Epics

| Epic | Stories | FRs | Estado |
|------|---------|-----|--------|
| Epic 1: Autenticación y Usuarios PBAC | 11 | FR58-FR76 (19) | ✅ |
| Epic 2: Gestión de Activos | 9 | FR32-FR43, FR108 (13) | ✅ |
| Epic 3: Reporte de Averías | 6 | FR1-FR10, FR102 (11) | ✅ |
| Epic 4: Órdenes de Trabajo y Kanban | 9 | FR11-FR31 (21) | ✅ |
| Epic 5: Control de Stock y Repuestos | 7 | FR16, FR44-FR56 (14) | ✅ |
| Epic 6: Gestión de Proveedores | 2 | FR77-FR80 (4) | ✅ |
| Epic 7: Rutinas y Generación Automática | 4 | FR81-FR84 (4) | ✅ |
| Epic 8: KPIs, Dashboard y Reportes | 6 | FR85-FR95, FR89, FR104 (12) | ✅ |
| Epic 9: Sincronización Multi-Dispositivo | 5 | FR96-FR100 (5) | ✅ |
| Epic 10: Funcionalidades Adicionales | 7 | FR101, FR103-FR108, FR105-FR107 (7) | ✅ |

**TOTAL: 11 Epics completados con 66 stories cubriendo 110 FRs**

---

**ESTADO FINAL: Todos los epics han sido generados y añadidos al documento epics.md**

**El documento está listo para la siguiente fase: Validación Final (Step 4)**