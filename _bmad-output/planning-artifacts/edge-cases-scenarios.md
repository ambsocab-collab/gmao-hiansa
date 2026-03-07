# Edge Cases and Scenarios - gmao-hiansa

Este documento documenta escenarios complejos, edge cases y comportamientos especiales del sistema gmao-hiansa.

## 1. Escenarios de Gestión de Órdenes de Trabajo

### Edge Case 1.1: Técnico no completa OT asignada

**Escenario:** Un técnico es asignado a una OT pero no la completa en el tiempo esperado.

**Comportamiento del Sistema:**
1. **Alerta de timeout:** Si la OT está "En Progreso" por >24 horas sin actividad, el sistema envía alerta al supervisor del técnico
2. **Reasignación:** El supervisor puede reasignar la OT a otro técnico
3. **Notificación al técnico original:** El técnico original recibe notificación: "OT XXX fue reasignada a [Nombre Nuevo Técnico] por [Motivo]"
4. **Historial:** La OT conserva registro del técnico original y el nuevo en su historial de asignaciones

**Requerimientos relacionados:** FR16 (auto-asignación), FR73 (restricción acceso), FR89 (alertas)

### Edge Case 1.2: Cambio de urgencia durante ejecución

**Escenario:** Una OT creada como urgencia "Media" se vuelve crítica durante su ejecución.

**Comportamiento del Sistema:**
1. **Cambio permitido:** Cualquier usuario con capacidad `can_change_urgency` (Supervisor, Admin) puede cambiar urgencia en OTs "Pendiente" o "En Progreso"
2. **Notificación inmediata:** Si urgencia cambia a "Crítica":
   - Push notification a todos los supervisores
   - Email al director del área afectada
   - Badge rojo en Kanban dashboard
3. **Regla de negocio:** No se puede bajar urgencia de "Crítica" a "Media" sin autorización de Director
4. **Audit log:** Cambio de urgencia queda registrado en historial de OT con usuario y timestamp

**Requerimientos relacionados:** FR19 (selección técnicos), FR21 (ver todas OTs), FR89 (alertas)

### Edge Case 1.3: OT con múltiples repuestos fuera de stock

**Escenario:** Técnico necesita 3 repuestos para una OT, pero solo 1 está disponible en stock.

**Comportamiento del Sistema:**
1. **Detección automática:** Al crear OT, sistema verifica stock de repuestos listados
2. **Advertencia al crear:** Si algún repuesto tiene stock = 0:
   - Warning: "Repuesto [Nombre] tiene stock 0. ¿Crear OT de todas formas?"
   - Opción: "Sí, crear OT" o "No, cancelar"
3. **Estado OT:** Si se crea, OT pasa a estado "Pendiente Repuesto"
4. **Notificación a stock:** Usuario con rol Stock recibe alerta: "Repuestos faltantes para OT XXX"
5. **Transición automática:** Cuando todos los repuestos estén disponibles, OT cambia de "Pendiente Repuesto" a "Pendiente"

**Requerimientos relacionados:** FR45 (stock actual), FR47 (ver stock al usar), FR50 (alertas stock mínimo)

## 2. Escenarios de Inventario y Repuestos

### Edge Case 2.1: Uso simultáneo de mismo repuesto

**Escenario:** Dos técnicos necesitan usar el mismo repuesto al mismo tiempo, pero solo hay 1 unidad disponible.

**Comportamiento del Sistema:**
1. **Race condition:** Primer técnico en registrar uso se lleva el repuesto
2. **Segundo técnico:** Recibe error: "Repuesto [Nombre] tiene stock 0. No disponible."
3. **Opciones:**
   - Esperar a que se reponga stock
   - Contactar a proveedor para urgente
   - Usar repuesto alternativo si existe
4. **Notificación:** Técnico y supervisor del segundo técnico reciben alerta de stock agotado

**Requerimientos relacionados:** FR47 (stock visible al usar), FR49 (uso obliga motivo), FR50 (alertas stock mínimo)

### Edge Case 2.2: Repuesto con múltiples proveedores

**Escenario:** Un repuesto tiene 3 proveedores, con diferentes precios y lead times.

**Comportamiento del Sistema:**
1. **Orden de proveedores:** Al generar pedido, sistema sugiere proveedor según:
   - **Precio ascendente** (más económico primero)
   - **Lead time** (más rápido primero si urgencia = Alta/Crítica)
2. **Override manual:** Usuario con rol Stock puede cambiar proveedor sugerido
3. **Historial:** Sistema registra qué proveedor se usó en cada pedido
4. **Métrica:** FR54 incluye "proveedor preferido" calculado según combinación precio × lead time × calidad

**Requerimientos relacionados:** FR52 (generar pedidos), FR54 (asociar proveedores), FR78 (catálogo proveedores)

## 3. Escenarios de Usuarios y Permisos

### Edge Case 3.1: Usuario con múltiples roles

**Escenario:** Usuario "María" tiene roles "Técnico" y "Stock" simultáneamente.

**Comportamiento del Sistema:**
1. **Heredar capacidades:** María tiene todas las capacidades de Técnico + todas las de Stock
2. **Conflictos de capacidad:** Si hay conflicto (ej: "can_approve_stocks" vs "cannot_approve_stocks"):
   - **Regla:** Capacidad "allow" siempre prevalece sobre "deny"
   - María puede aprobar stocks si cualquiera de sus roles tiene `can_approve_stocks`
3. **UI/UX:** María ve módulos de ambos roles en navegación
4. **Switch de contexto:** Opción para filtrar vista por rol (ver solo módulos de Técnico o solo de Stock)

**Requerimientos relacionados:** FR62 (múltiples roles), FR63 (herencia capacidades), FR67 (modelo RBAC)

### Edge Case 3.2: Revocación de acceso durante sesión activa

**Escenario:** Administrador revoca rol de usuario mientras el usuario tiene sesión activa.

**Comportamiento del Sistema:**
1. **Detección:** Cambio de capacidades se detecta en próxima request del usuario (máx. 30 segundos)
2. **Forzar logout:** Si capacidades revocadas son críticas (ej: can_login, can_view_all_ots):
   - Sistema fuerza logout inmediatamente
   - Usuario ve mensaje: "Tus permisos han cambiado. Por favor inicia sesión nuevamente."
3. **Soft revocación:** Si capacidades no son críticas:
   - Usuario continúa sesión activa
   - Botones/menús para capacidades revocadas desaparecen en próxima carga
   - Mensaje toast: "Tus permisos han sido actualizados."

**Requerimientos relacionados:** FR65 (revocar roles), FR73 (restricción módulos), FR75 (denegar acceso)

## 4. Escenarios de Sincronización Multi-Dispositivo

### Edge Case 4.1: Edición simultánea desde dos dispositivos

**Escenario:** Supervisor Javier edita OT desde desktop mientras supervisor Elena edita misma OT desde móvil.

**Comportamiento del Sistema:**
1. **Optimistic locking:** Sistema detecta conflicto al guardar segundo cambio
2. **Resolución:**
   - Último save en ganar: El último cambio sobrescribe el anterior
   - Segundo usuario ve advertencia: "Esta OT fue modificada por [Usuario] hace X minutos. Tus cambios sobrescribirán los anteriores. ¿Continuar?"
3. **Merge inteligente:** Si cambios son en campos diferentes (ej: Javier cambió descripción, Elena cambió urgencia):
   - Sistema combina ambos cambios
   - Ambos usuarios ven versión mergeada
4. **Audit trail:** Sistema registra quién cambió qué y cuándo

**Requerimientos relacionados:** FR96 (sincronización <1s), FR97 (multi-dispositivo)

### Edge Case 4.2: Offline durante creación de OT

**Escenario:** Operario Carlos pierde conexión WiFi mientras está creando una avería.

**Comportamiento del Sistema:**
1. **Detección:** Sistema detecta pérdida de conexión (network API)
2. **Estado OT:** Datos se guardan en localStorage como "Borrador"
3. **UI Feedback:** Carlos ve indicador "Modo offline - cambios se guardarán cuando recuperes conexión"
4. **Al reconectar:**
   - Sistema sincroniza automáticamente borradores
   - Carlos ve confirmación: "1 avería guardada exitosamente (Código A-12345)"
5. **Conflictos:** Si otro usuario creó OT similar durante offline:
   - Sistema advierte duplicado posible
   - Carlos puede revisar y confirmar o descartar

**Requerimientos relacionados:** FR1 (crear avisos), FR96 (sincronización), PWA capabilities

## 5. Escenarios de Reporting y KPIs

### Edge Case 5.1: Datos inconsistentes en MTTR/MTBF

**Escenario:** Sistema reporta MTTR "imposible" (ej: negativo o >30 días) por error en datos.

**Comportamiento del Sistema:**
1. **Validación:** Sistema calcula MTTR solo para OTs con estado "Completada"
2. **Filtros de calidad:**
   - Excluir OTs con tiempo >30 días (outliers)
   - Excluir OTs sin fecha de cierre registrada
   - Usar mediana en lugar de promedio si outlier >20%
3. **Visualización:** Si MTTR parece incorrecto:
   - Icono de warning junto al KPI
   - Tooltip: "Datos insuficientes o inconsistentes. Revisa las OTs completadas."
4. **Recomendación:** "Considera revisar las siguientes OTs: [lista de OTs con datos atípicos]"

**Requerimientos relacionados:** FR85 (MTTR), FR86 (MTBF), FR87 (drill-down)

### Edge Case 5.2: Exportación de Excel con >10,000 filas

**Escenario:** Administrador intenta exportar todas las OTs del último año (aprox. 15,000 filas).

**Comportamiento del Sistema:**
1. **Advertencia:** Botón "Exportar" muestra warning: "La exportación generará ~15,000 filas. Esto puede tomar varios minutos. ¿Continuar?"
2. **Límite técnico:** Si usuario confirma, sistema:
   - Genera exportación en background (async)
   - Usuario ve indicador "Generando archivo..."
   - Notificación cuando esté listo: "Tu exportación está lista. Click para descargar."
3. **Paginación automática:** Si archivo >5MB, sistema genera múltiples archivos (Excel_Part1.xlsx, Excel_Part2.xlsx)
4. **Alternativa:** Sistema ofrece: "¿Prefieres exportar solo últimos 6 meses? (~7,500 filas)"

**Requerimientos relacionados:** FR90 (exportar Excel), NFR-SC2 (100 usuarios concurrentes)

## 6. Escenarios de Mantenimiento Reglamentario

### Edge Case 6.1: PCI vencido próxima inspección

**Escenario:** Un equipo de presión tiene PCI vencido y la próxima inspección es en <7 días.

**Comportamiento del Sistema:**
1. **Alerta crítica:** Sistema genera alerta roja: "Equipo [Compresor Aire] tiene PCI vencido. Próxima inspección: 2026-03-05 (en 5 días)"
2. **Restricción:** Si flag "equipo_puede_operar_sin_pci_firmado" = FALSE:
   - Sistema NO permite crear OTs para ese equipo
   - Usuario ve mensaje: "Este equipo no puede operar hasta renovar PCI. Contacta a administración."
3. **Workflow de excepción:** Si supervisor necesita autorizar uso temporal:
   - Supervisor crea "OT de excepción" con motivo justificado
   - Sistema requiere aprobación de Director
   - Si aprobada, equipo puede operar por X días (configurable)
4. **Audit trail:** Todas las excepciones quedan registradas para auditoría

**Requerimientos relacionados:** Domain Requirements (PCI), FR11 (estados OT), FR73 (restricciones acceso)

## 7. Escenarios de Eliminación y Borrado Lógico

### Edge Case 7.1: Eliminar activo con OTs asociadas

**Escenario:** Administrador intenta eliminar un equipo que tiene 10 OTs históricas asociadas.

**Comportamiento del Sistema:**
1. **Prevención de pérdida de datos:** Sistema NO permite eliminación física
2. **Borrado lógico:** Sistema marca equipo como "Retirado" en lugar de eliminar
3. **Preservación de historial:** Las 10 OTs asociadas permanecen en sistema (integridad referencial)
4. **Warning:** Admin ve mensaje: "Este equipo tiene 10 OTs históricas. Se marcará como 'Retirado' pero las OTs se conservarán para auditoría."
5. **Confirmación:** Admin debe confirmar acción

**Requerimientos relacionados:** FR36 (estados equipos), FR38 (stock equipos), FR73 (restricciones)

## 8. Escenarios de Importación Masiva

### Edge Case 8.1: Importación con errores parciales

**Escenario:** Usuario importa 500 equipos desde CSV, pero 15 tienen errores de validación.

**Comportamiento del Sistema:**
1. **Validación previa:** Sistema valida todas las filas antes de insertar en BD
2. **Resultado parcial:**
   - 485 equipos importados exitosamente
   - 15 equipos con errores NO importados
3. **Reporte de errores:** Sistema muestra:
   - Tabla con filas exitosas: "485 de 500 equipos importados"
   - Tabla con errores: "15 filas con errores:"
     - Línea 23: "Código duplicado: E-12345 ya existe"
     - Línea 45: "Jerarquía inválida: Planta X no existe"
     - Línea 67: "Estado inválido: 'Activo' no es válido"
4. **Opciones del usuario:**
   - "Descargar CSV corregido" (sistema genera CSV con solo filas erróneas + columna de error)
   - "Reintentar importación" (después de corregir CSV manualmente)
   - "Cancelar importación" (rollback de las 485 filas insertadas)
5. **Transacción atómica:** Usuario tiene opción de revertir todo si hay >10% errores

**Requerimientos relacionados:** FR40 (importación masiva), FR41 (validación), FR42 (reporte resultados)

## 9. Escenarios de Performance y Escalabilidad

### Edge Case 9.1: Degradación de performance con 10,000 activos

**Escenario:** Sistema tiene 10,000 activos y la búsqueda predictiva tarda >5 segundos.

**Comportamiento del Sistema:**
1. **Monitoreo:** Sistema detecta lentitud en queries de búsqueda
2. **Índices automáticos:** Sistema recomienda crear índices:
   - Sugerencia en logs: "Considera crear índice en equipos.nombre para mejorar búsquedas"
3. **Caching:** Sistema implementa caché de búsquedas frecuentes:
   - Cache LRU de últimos 1000 términos buscados
   - TTL de 5 minutos para resultados
4. **Feedback al usuario:** Si búsqueda tarda >2 segundos:
   - Usuario ve spinner + "Buscando..."
   - Tooltip: "Búsqueda en progreso. Considera usar filtros para acelerar."
5. **Plan de escalado:** Si性能 degrada consistentemente:
   - Alerta a administradores: "Performance de búsqueda degradada. Considera ajustar infraestructura."

**Requerimientos relacionados:** NFR-SC1 (10,000 activos), NFR-SC3 (optimización BD), NFR-P1 (búsqueda <200ms)

## 10. Escenarios de Seguridad y Acceso

### Edge Case 10.1: Detección de sesión compromise

**Escenario:** Sistema detecta patrón de uso inusual en cuenta de usuario (posible compromiso).

**Comportamiento del Sistema:**
1. **Reglas de detección:**
   - Login desde 2 países diferentes en <1 hora
   - >100 OTs creadas en <1 hora (bot pattern)
   - Intentos fallidos de login >10 en 5 minutos
2. **Acción automática:**
   - Sistema bloquea cuenta temporalmente
   - Usuario ve mensaje: "Actividad inusual detectada. Tu cuenta ha sido bloqueada por seguridad."
   - Email enviado: "Detectamos actividad inusual. Si fuiste tú, haz clic en 'Restablecer cuenta'."
3. **Restablecimiento:**
   - Usuario debe cambiar contraseña
   - Opcional: 2FA (autenticación de dos factores) si está habilitado
4. **Audit log:** Evento de bloqueo registrado con IP, timestamp, razón

**Requerimientos relacionados:** NFR-S1 (autenticación), NFR-S3 (password policy), NFR-A1 (protección datos)
