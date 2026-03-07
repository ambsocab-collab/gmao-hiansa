# Requirements Inventory

## Functional Requirements

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

## NonFunctional Requirements

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

## Additional Requirements

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

## FR Coverage Map

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
