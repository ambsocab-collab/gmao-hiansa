# Functional Requirements

Esta sección define **EL CONTRATO DE CAPACIDADES** para todo el producto. Los diseñadores UX, arquitectos y equipos de desarrollo solo implementarán lo listado aquí.

## 1. Gestión de Averías

- **FR1:** Los usuarios con capability `can_create_failure_report` pueden crear avisos de avería asociados a equipos de la jerarquía de activos
- **FR2:** Los usuarios con capability `can_create_failure_report` pueden agregar una descripción textual del problema al crear un aviso
- **FR3:** Los usuarios con capability `can_create_failure_report` pueden adjuntar una foto opcional al reportar una avería
- **FR4:** Los usuarios reciben notificaciones push dentro de los 30 segundos siguientes al cambio de estado de su aviso (recibido, autorizado, en progreso, completado)
- **FR5:** Los operarios pueden confirmar si una reparación funciona correctamente después de completada y reciben confirmación con número de aviso generado dentro de los 3 segundos
- **FR6:** Los usuarios con capability `can_create_failure_report` pueden realizar búsqueda predictiva de equipos durante la creación de avisos
- **FR7:** Los usuarios con capability `can_view_all_ots` pueden ver todos los avisos nuevos en una columna de triage
- **FR8:** Los usuarios con capability `can_view_all_ots` pueden convertir avisos en órdenes de trabajo
- **FR9:** Los usuarios con capability `can_view_all_ots` pueden descartar avisos que no son procedentes
- **FR10:** Se pueden distinguir visualmente entre avisos de avería (color rosa #FFC0CB) y reparación (color blanco #FFFFFF)

## 2. Gestión de Órdenes de Trabajo

### Vista Kanban

- **FR11:** Las órdenes de trabajo (tanto preventivas como correctivas) tienen 8 estados posibles: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada
- **FR11-A:** Las órdenes de trabajo tienen un atributo de "tipo de mantenimiento" que las clasifica como: Preventivo (generadas desde rutinas) o Correctivo (generadas desde reportes de averías). Este tipo es visible tanto en la vista de listado como en las tarjetas Kanban.
- **FR11-B:** Las OTs de mantenimiento preventivo muestran la etiqueta "Preventivo" en tarjetas Kanban y listado. Las OTs de mantenimiento correctivo muestran la etiqueta "Correctivo" en las mismas vistas.
- **FR12:** Los usuarios con capability `can_update_own_ot` pueden iniciar una orden de trabajo asignada cambiando su estado a "En Progreso"
- **FR13:** Los usuarios con capability `can_update_own_ot` pueden agregar repuestos usados y requisitos durante el cumplimiento de una orden de trabajo asignada
- **FR14:** Los usuarios con capability `can_complete_ot` pueden completar (validar) una orden de trabajo
- **FR15:** Los usuarios con capability `can_update_own_ot` pueden agregar notas internas a una orden de trabajo asignada
- **FR16:** El stock de repuestos se actualiza en tiempo real (dentro de 1 segundo) al registrar uso. Las actualizaciones de stock son silenciosas (sin enviar notificaciones a usuarios con `can_manage_stock`) para evitar spam de notificaciones por actualizaciones masivas
- **FR17:** Los usuarios con capability `can_assign_technicians` pueden asignar de 1 a 3 técnicos internos a cada orden de trabajo, todos deben tener la capability `can_update_own_ot`
- **FR18:** Los usuarios con capability `can_assign_technicians` pueden asignar órdenes de trabajo a proveedores externos
- **FR19:** Los usuarios con capability `can_assign_technicians` pueden seleccionar de 1 a 3 técnicos (que tengan `can_update_own_ot`) o proveedores según el tipo de orden de trabajo, filtrando técnicos disponibles por habilidades y ubicación. Todos los usuarios asignados reciben notificaciones de la OT
- **FR19-A:** Cuando una orden de trabajo tiene múltiples usuarios asignados, cualquiera de ellos puede agregar repuestos usados, actualizar estado o completar la OT. Todos los usuarios asignados reciben notificaciones de cambios de estado y actualizaciones de la OT
- **FR20:** Los usuarios con capability `can_update_own_ot` pueden ver todas las órdenes de trabajo donde están asignados en su dashboard personal
- **FR21:** Los usuarios con capability `can_view_all_ots` pueden ver todas las órdenes de trabajo de la organización. La vista de listado incluye una columna "Asignaciones" que muestra la distribución de usuarios asignados (ej: "2 técnicos / 1 proveedor" cuando hay múltiples asignados)
- **FR22:** Se pueden distinguir visualmente entre órdenes de preventivo (color verde #28A745), correctivo propio (color rojizo #DC3545) y correctivo externo (color rojo con línea blanca #DC3545 con borde #FFFFFF)
- **FR23:** Se pueden distinguir visualmente entre órdenes de reparación interna (taller propio, color naranja #FD7E14) y reparación enviada a proveedor (color azul #17A2B8). Las órdenes de preventivo usan color verde #28A745
- **FR24:** Se pueden ver detalles completos de una orden de trabajo (fechas, origen, técnico, repuestos) en modal informativo
- **FR24-A:** Cuando un proveedor marca una orden de reparación como completada, los usuarios con capability `can_assign_technicians` pueden confirmar la recepción del equipo reparado antes de marcar la OT como completada. La confirmación requiere verificación visual del estado del reparado
- **FR25:** Los usuarios con capacidad `can_create_manual_ot` pueden crear órdenes de trabajo manuales sin partir de un aviso

### Vista de Listado

- **FR26:** Se puede acceder a una vista de listado de todas las órdenes de trabajo
- **FR27:** Se puede filtrar el listado de órdenes de trabajo por 5 criterios: estado, técnico, fecha, tipo, equipo
- **FR28:** Se puede ordenar el listado de órdenes de trabajo por cualquier columna
- **FR29:** Se pueden realizar las mismas acciones en la vista de listado que en el Kanban (asignar, iniciar, completar, ver detalles)
- **FR30:** Se puede alternar entre vista Kanban y vista de listado
- **FR31:** Las vistas Kanban y de listado mantienen sincronización en tiempo real (cambios se reflejan en ambas)

## 3. Gestión de Activos

- **FR32:** El sistema maneja jerarquía de activos de 5 niveles: Planta → Línea → Equipo → Componente → Repuesto
- **FR33:** Los usuarios con capability `can_manage_assets` pueden navegar la jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto) en cualquier dirección
- **FR34:** Los usuarios con capability `can_manage_assets` pueden asociar un componente a múltiples equipos
- **FR35:** Los usuarios con capability `can_view_repair_history` pueden ver el historial de reparaciones de un equipo (todas las OTs completadas con fechas, repuestos usados, técnicos asignados)
- **FR36:** Los usuarios con capability `can_manage_assets` pueden gestionar 5 estados para equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado)
- **FR37:** Los usuarios con capability `can_manage_assets` pueden cambiar el estado de un equipo
- **FR38:** Los usuarios con capability `can_manage_assets` pueden ver el stock de equipos completos reutilizables con contador de cantidades por estado (Disponible, En Uso, En Reparación, Descartado)
- **FR39:** Los usuarios con capability `can_manage_assets` pueden rastrear la ubicación actual de equipos reutilizables por área de fábrica asignada, último técnico con custodia, o estado de reserva actual
- **FR40:** Los usuarios con capability `can_manage_assets` pueden importar activos masivamente desde un archivo CSV
- **FR41:** La estructura jerárquica se valida automáticamente durante la importación masiva de activos
- **FR42:** Los usuarios con capability `can_manage_assets` pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)
- **FR43:** Los usuarios con capability `can_manage_assets` pueden descargar una plantilla de importación con el formato requerido

## 4. Gestión de Repuestos

- **FR44:** Todos los usuarios pueden acceder al catálogo de repuestos consumibles en modo consulta (sin capability específica)
- **FR45:** Todos los usuarios pueden ver el stock actual de cada repuesto en tiempo real (sin capability específica)
- **FR46:** Todos los usuarios pueden ver la ubicación física de cada repuesto en el almacén (sin capability específica)
- **FR47:** Los usuarios ven el stock y ubicación al seleccionar un repuesto para uso
- **FR48:** Los usuarios con capability `can_manage_stock` pueden realizar ajustes manuales de stock
- **FR49:** Los usuarios deben agregar un motivo al realizar ajustes manuales de stock
- **FR50:** Los usuarios con capability `can_manage_stock` reciben alertas cuando un repuesto alcanza su stock mínimo
- **FR51:** Los usuarios con capability `can_manage_stock` pueden generar pedidos de repuestos a proveedores
- **FR52:** Los usuarios con capability `can_manage_stock` pueden gestionar el stock de repuestos
- **FR53:** Los usuarios con capability `can_manage_stock` pueden asociar cada repuesto con uno o más proveedores
- **FR54:** Los usuarios con capability `can_manage_stock` pueden importar repuestos masivamente desde un archivo CSV
- **FR55:** Los datos de proveedores y ubicaciones se validan automáticamente durante la importación masiva de repuestos y se reportan errores
- **FR56:** Los usuarios pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)

## 5. Gestión de Usuarios, Roles y Capacidades

**MODELO DE AUTORIZACIÓN: PBAC (Permission-Based Access Control) con Roles como Etiquetas**

- **FR58:** Los usuarios con capability `can_manage_users` pueden crear nuevos usuarios en el sistema
- **FR59:** Los usuarios con capability `can_manage_users` pueden crear hasta 20 etiquetas de clasificación de usuarios (ej: Operario, Técnico, Supervisor). Estas etiquetas son solo para clasificación visual y NO otorgan capabilities ni afectan el acceso al sistema.
- **FR60:** ❌ **ELIMINADO** (las capacidades ya NO se asignan a roles)
- **FR61:** Los usuarios con capability `can_manage_users` pueden eliminar etiquetas de clasificación personalizadas
- **FR62:** Los usuarios pueden tener asignada una o más etiquetas de clasificación simultáneamente (ej: Operario, Técnico, Supervisor)
- **FR63:** ❌ **ELIMINADO** (los usuarios NO heredan capacidades desde roles)
- **FR64:** Los usuarios con capability `can_manage_users` pueden asignar etiquetas de clasificación a usuarios para organización visual
- **FR65:** Los usuarios con capability `can_manage_users` pueden quitar las etiquetas de clasificación de usuarios
- **FR66:** Todo usuario nuevo (excepto el administrador inicial) tiene ÚNICAMENTE la capability `can_create_failure_report` asignada por defecto. Las otras 14 capabilities deben ser asignadas manualmente por un usuario con capability `can_manage_users`.
- **FR67:** Durante el registro de usuarios, los usuarios con capability `can_manage_users` seleccionan las capabilities asignadas usando checkboxes con etiquetas en castellano legibles (ej: "✅ Reportar averías", "✅ Ver todas las OTs"). Los nombres internos del código permanecen en inglés.
- **FR67-A:** Las etiquetas de clasificación son únicamente para organizar visualmente a los usuarios (ej: Operario, Técnico, Supervisor) y NO tienen ninguna relación con las capabilities. Las etiquetas NO otorgan, NO eliminan, NO modifican, NO afectan de ninguna manera las capabilities asignadas a un usuario. Etiquetas y capabilities son completamente independientes.
- **FR67-B:** Una misma etiqueta de clasificación NO otorga las mismas capacidades a todos los usuarios que la tienen asignada (las capacidades se asignan individualmente a cada usuario)
- **FR68:** Las capacidades del sistema son 15 en total:
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
- **FR68-UI:** Las capabilities se presentan en la interfaz de usuario en castellano con formato legible, sin usar notación técnica. Los nombres internos del código (en inglés) no son visibles para el usuario final.

**Tabla de Presentación de Capabilities:**

| Nombre Interno (Código) | Etiqueta en UI (Castellano) |
|------------------------|---------------------------|
| `can_create_failure_report` | ✅ Reportar averías |
| `can_create_manual_ot` | Crear OTs manuales |
| `can_update_own_ot` | Actualizar OTs propias |
| `can_view_own_ots` | Ver OTs asignadas |
| `can_view_all_ots` | Ver todas las OTs |
| `can_complete_ot` | Completar OTs |
| `can_manage_stock` | Gestionar stock |
| `can_assign_technicians` | Asignar técnicos a órdenes de trabajo |
| `can_view_kpis` | Ver KPIs avanzados |
| `can_manage_assets` | Gestionar activos |
| `can_view_repair_history` | Ver historial de reparaciones |
| `can_manage_providers` | Gestionar proveedores |
| `can_manage_routines` | Gestionar rutinas de mantenimiento |
| `can_manage_users` | Gestionar usuarios y sus capacidades (crear, editar, eliminar usuarios, asignar capabilities, etiquetar con clasificaciones) |
| `can_receive_reports` | Recibir reportes automáticos |
- **FR68-A:** Los usuarios sin la capability `can_manage_assets` solo pueden consultar activos en modo solo lectura (ver jerarquía, historial de OTs, estados), sin poder crear, modificar ni eliminar equipos
- **FR68-B:** Los usuarios sin la capability `can_view_repair_history` no pueden acceder al historial de reparaciones de equipos (ver OTs completadas, patrones de fallas, métricas de confiabilidad por equipo)
- **FR68-C:** El primer usuario creado durante el setup inicial de la aplicación (denominado "administrador inicial") tiene las 15 capabilities del sistema asignadas por defecto. Este usuario especial es el único que recibe capabilities preasignadas además de `can_create_failure_report`. Ningún otro usuario creado posteriormente tiene capabilities preasignadas excepto `can_create_failure_report` que es predeterminada para todos.

### Perfil de Usuario

- **FR69:** Los usuarios pueden acceder a su perfil personal
- **FR69-A:** Los usuarios con capability `can_manage_users` pueden editar la información personal de cualquier usuario (nombre, email, teléfono)
- **FR70:** Los usuarios pueden editar su información personal (nombre, email, teléfono)
- **FR71:** Los usuarios pueden cambiar su contraseña
- **FR70-A:** Los usuarios con capability `can_manage_users` pueden eliminar usuarios del sistema
- **FR72:** Los usuarios con capability `can_manage_users` pueden ver un historial de actividad del usuario durante los últimos 6 meses (login, cambios de perfil, acciones críticas)

### Flujo de Onboarding y Primer Acceso

- **FR72-A:** El sistema obliga a los usuarios a cambiar su contraseña temporal en el primer acceso antes de permitirles navegar a cualquier otra sección de la aplicación
- **FR72-B:** Los usuarios con capability `can_manage_users` pueden registrar nuevos usuarios asignando credenciales temporales (usuario y contraseña) que deberán ser cambiadas en el primer acceso
- **FR72-C:** Los usuarios con capability `can_manage_users` pueden ver el historial de trabajos completo de cualquier usuario, incluyendo: OTs completadas, OTs en progreso asignadas, OTs canceladas o reasignadas, tiempo promedio de completación (MTTR por usuario), repuestos usados, y productividad (OTs completadas por semana). El historial permite filtrar por rango de fechas específico. Esta capability es distinta de `can_assign_technicians` que solo permite asignar técnicos a OTs.

### Control de Acceso por Módulos

- **FR73:** Los usuarios acceden solo a los módulos para los que tienen capacidades asignadas:
  - Órdenes de Trabajo (requiere `can_view_own_ots` o `can_view_all_ots`)
  - Activos (requiere `can_view_own_ots` para consultar, `can_manage_assets` para editar)
  - Repuestos (requiere `can_manage_stock` para gestionar)
  - Proveedores (requiere `can_manage_providers`)
  - Rutinas (requiere `can_view_all_ots` para consultar, `can_manage_routines` para crear/editar)
  - KPIs (requiere `can_view_kpis`)
  - Usuarios (requiere `can_manage_users`)
- **FR74:** Los usuarios solo ven en la navegación los módulos para los que tienen capacidades asignadas
- **FR75:** El acceso se deniega automáticamente si un usuario intenta navegar directamente a un módulo no autorizado (URL directa)
- **FR76:** Los usuarios ven un mensaje explicativo cuando se deniega acceso por falta de capacidades

## 6. Gestión de Proveedores

- **FR77:** Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de mantenimiento (crear, editar, desactivar)
- **FR78:** Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de repuestos (crear, editar, desactivar)
- **FR78-A:** El formulario de proveedores es único para ambos tipos (mantenimiento y repuestos), con un campo de selección "Tipo de proveedor" que permite clasificarlos como "Mantenimiento" o "Repuestos". Un mismo proveedor puede ofrecer ambos tipos de servicio.
- **FR79:** Los usuarios con capability `can_manage_providers` pueden ver datos de contacto de cada proveedor
- **FR80:** Los usuarios con capability `can_manage_providers` pueden asociar proveedores con tipos de servicio que ofrecen. El catálogo de servicios incluye 6 tipos predefinidos: Mantenimiento Correctivo, Mantenimiento Preventivo, Mantenimiento Reglamentario, Suministro de Repuestos, Mantenimiento de Equipos Específicos (soldadura, corte, etc.), y Servicios de Emergencia

## 7. Gestión de Rutinas de Mantenimiento

- **FR81:** Los usuarios con capability `can_manage_routines` pueden gestionar rutinas de mantenimiento (crear, editar, desactivar) con frecuencias diaria, semanal o mensual
- **FR81-A:** Las rutinas de mantenimiento pueden ser de dos modalidades: (1) Por equipo específico - rutinas asociadas a un equipo particular de la jerarquía de activos, o (2) Customizables - rutinas generales como orden y limpieza con campos variables personalizables
- **FR81-B:** Cada rutina de mantenimiento configura: tareas a realizar, técnico responsable, repuestos necesarios y duración estimada. Estos campos aplican tanto a rutinas por equipo como customizables.
- **FR82:** Las órdenes de trabajo de mantenimiento preventivo se generan automáticamente 24 horas antes del vencimiento de rutina, con estado "Pendiente" y etiqueta "Preventivo"
- **FR83:** Los usuarios con capability `can_view_all_ots` pueden ver el porcentaje de rutinas completadas en el dashboard, incluyendo sus propias rutinas asignadas
- **FR84:** El usuario asignado a una rutina recibe alertas cuando la rutina no se completa en el plazo previsto. Las alertas se envían en 3 momentos: 1 hora antes del vencimiento, en el momento del vencimiento, y 24 horas después del vencimiento si permanece incompleta

## 8. Análisis y Reportes

### KPIs y Métricas

- **FR85:** Los usuarios con capability `can_view_kpis` pueden ver el KPI MTTR (Mean Time To Repair) calculado con datos actualizados cada 30 segundos
- **FR86:** Los usuarios con capability `can_view_kpis` pueden ver el KPI MTBF (Mean Time Between Failures) calculado con datos actualizados cada 30 segundos
- **FR87:** Los usuarios con capability `can_view_kpis` pueden navegar drill-down de KPIs (Global → Planta → Línea → Equipo)
- **FR88:** Los usuarios con capability `can_view_kpis` pueden ver métricas adicionales (OTs abiertas, OTs completadas, técnicos activos, stock crítico)
- **FR89:** Los usuarios con capability `can_view_kpis` reciben alertas de 3 tipos: stock mínimo (requiere `can_manage_stock`), MTFR alto (definido como 150% del promedio de los últimos 30 días), rutinas no completadas
- **FR90:** Los usuarios con capability `can_view_kpis` pueden exportar reportes de KPIs a Excel en formato .xlsx compatible con Microsoft Excel 2016+, con hojas separadas por KPI (MTTR, MTBF, OTs Abiertas, Stock Crítico)
- **FR90-A:** Los usuarios con capability `can_receive_reports` pueden configurar la recepción de reportes automáticos en PDF enviados por email, incluyendo selección de KPIs (MTTR, MTBF, OTs abiertas, OTs completadas, stock crítico, técnicos activos, porcentaje de rutinas completadas, número de usuarios asignados por OT) y frecuencia (diario, semanal, mensual)
- **FR90-B:** Los reportes diarios se generan automáticamente todos los días a las 8:00 AM con datos del día anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-C:** Los reportes semanales se generan automáticamente todos los lunes a las 8:00 AM con datos de la semana anterior (lunes a domingo), en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-D:** Los reportes mensuales se generan automáticamente el primer lunes de cada mes a las 9:00 AM con datos del mes anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-E:** Los usuarios con capability `can_receive_reports` pueden descargar manualmente cualquier reporte desde el dashboard en formato PDF, independientemente de la recepción automática por email

### Dashboard Común con Navegación por Capacidades

- **FR91:** Todos los usuarios acceden al mismo dashboard general con KPIs de la planta (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login, con botones de acceso a módulos según capacidades asignadas. Este dashboard muestra los KPIs básicos visibles para todos.
- **FR91-A:** Los usuarios con capability `can_view_kpis` pueden hacer drill-down (Global → Planta → Línea → Equipo) y ver análisis avanzado. Los usuarios sin esta capability ven los mismos KPIs básicos que FR91 pero no pueden interactuar más allá de la vista general.
- **FR92:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR93:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR94:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR95:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

### Diferencia entre "Mis OTs" y "Ver Kanban"

- **"Mis OTs"** (requiere `can_view_own_ots`): Vista propia del usuario con listado de OTs asignadas, con toggle a vista Kanban
- **"Ver Kanban"** (requiere `can_view_all_ots`): Vista de supervisor con todas las OTs del equipo en tablero Kanban de 8 columnas

## 9. Sincronización y Acceso Multi-Dispositivo

- **FR96:** El sistema sincroniza datos entre múltiples dispositivos: <1 segundo para OTs, <30 segundos para KPIs
- **FR97:** Los usuarios pueden acceder desde dispositivos desktop, tablet y móvil
- **FR98:** La interfaz se adapta responsivamente al tamaño de pantalla del dispositivo con 3 breakpoints definidos: >1200px (layout desktop con navegación lateral completa), 768-1200px (layout tablet con navegación simplificada), <768px (layout móvil con navegación inferior y componentes apilados)
- **FR99:** Los usuarios pueden instalar la aplicación en dispositivos móviles como aplicación nativa (PWA)
- **FR100:** Los usuarios reciben notificaciones push en sus dispositivos

## 10. Funcionalidades Adicionales

- **FR101:** Los usuarios con capability `can_create_failure_report` pueden rechazar una reparación si no funciona correctamente después de completada, lo que genera una OT de re-trabajo con prioridad alta
- **FR102:** La búsqueda predictiva está disponible en cualquier campo de búsqueda del sistema (equipos, componentes, repuestos, OTs, técnicos, usuarios) sin requerir capability específica
- **FR103:** ❌ **ELIMINADO** (duplicaba FR91 - dashboard común ya está especificado)
- **FR104:** Los usuarios pueden ver su propio historial de acciones de los últimos 30 días (login, cambios de perfil, acciones críticas). Los usuarios con capability `can_manage_users` pueden ver el historial de acciones de cualquier usuario.
- **FR105:** Cualquier usuario puede configurar sus propias preferencias de notificación por tipo (habilitar/deshabilitar: recibido, autorizado, en progreso, completado)
- **FR106:** Los usuarios con capability `can_update_own_ot` pueden agregar comentarios con timestamp a OTs en progreso asignadas
- **FR107:** Los usuarios con capability `can_update_own_ot` pueden adjuntar fotos antes y después de la reparación en una orden de trabajo asignada
- **FR108:** Los equipos pueden tener código QR asociado para escaneo de identificación (funcionalidad base disponible en MVP; tracking avanzado con cadena de custodia y mapa en tiempo real en Phase 3)

---

**Total: 123 Requerimientos Funcionales** organizados en 10 áreas de capacidad

**NOTA:** El historial completo de ediciones se encuentra en `prd-changelog.md`

**Última edición (2026-03-07):** Validación PRD completada - Rating 4.5/5 EXCELLENT. Aplicando 10 mejoras identificadas en validación.

---
