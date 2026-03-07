# Epic List

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

## Epic 2: Gestión de Activos y Jerarquía de 5 Niveles

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

## Epic 3: Reporte de Averías en Segundos

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

## Epic 4: Órdenes de Trabajo y Kanban Digital

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

## Epic 5: Control de Stock y Repuestos

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

## Epic 6: Gestión de Proveedores

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

## Epic 7: Rutinas de Mantenimiento y Generación Automática

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

## Epic 8: KPIs, Dashboard y Reportes Automáticos

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

## Epic 9: Sincronización Multi-Dispositivo y PWA

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

## Epic 10: Funcionalidades Adicionales y UX Avanzada

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
