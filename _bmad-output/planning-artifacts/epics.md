---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments: [
  'prd/index.md',
  'architecture/index.md',
  'ux-design-specification/index.md',
  'test-artifacts/test-design/gmao-hiansa-handoff.md'
]
workflowType: 'create-epics-and-stories'
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-03-08'
communication_language: 'Español'
document_output_language: 'Español'
epicsCount: 8
storiesCount: 29
totalAcceptanceCriteria: 180+
---

# gmao-hiansa - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for gmao-hiansa, decomposing the requirements from the PRD, UX Design, Architecture requirements, and TEA Test Design handoff into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. Gestión de Averías (FR1-FR10)**
- FR1: Los usuarios con capability `can_create_failure_report` pueden crear avisos de avería asociados a equipos de la jerarquía de activos
- FR2: Los usuarios con capability `can_create_failure_report` pueden agregar una descripción textual del problema al crear un aviso
- FR3: Los usuarios con capability `can_create_failure_report` pueden adjuntar una foto opcional al reportar una avería
- FR4: Los usuarios reciben notificaciones push dentro de los 30 segundos siguientes al cambio de estado de su aviso (recibido, autorizado, en progreso, completado)
- FR5: Los operarios pueden confirmar si una reparación funciona correctamente después de completada y reciben confirmación con número de aviso generado dentro de los 3 segundos
- FR6: Los usuarios con capability `can_create_failure_report` pueden realizar búsqueda predictiva de equipos durante la creación de avisos
- FR7: Los usuarios con capability `can_view_all_ots` pueden ver todos los avisos nuevos en una columna de triage
- FR8: Los usuarios con capability `can_view_all_ots` pueden convertir avisos en órdenes de trabajo
- FR9: Los usuarios con capability `can_view_all_ots` pueden descartar avisos que no son procedentes
- FR10: Se pueden distinguir visualmente entre avisos de avería (color rosa #FFC0CB) y reparación (color blanco #FFFFFF)

**2. Gestión de Órdenes de Trabajo (FR11-FR31)**
- FR11: Las órdenes de trabajo tienen 8 estados posibles: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada
- FR11-A: Las órdenes de trabajo tienen un atributo de "tipo de mantenimiento" que las clasifica como: Preventivo (generadas desde rutinas) o Correctivo (generadas desde reportes de averías)
- FR11-B: Las OTs de mantenimiento preventivo muestran la etiqueta "Preventivo" en tarjetas Kanban y listado. Las OTs de mantenimiento correctivo muestran la etiqueta "Correctivo"
- FR12: Los usuarios con capability `can_update_own_ot` pueden iniciar una orden de trabajo asignada cambiando su estado a "En Progreso"
- FR13: Los usuarios con capability `can_update_own_ot` pueden agregar repuestos usados y requisitos durante el cumplimiento de una orden de trabajo asignada
- FR14: Los usuarios con capability `can_complete_ot` pueden completar (validar) una orden de trabajo
- FR15: Los usuarios con capability `can_update_own_ot` pueden agregar notas internas a una orden de trabajo asignada
- FR16: El stock de repuestos se actualiza en tiempo real (dentro de 1 segundo) al registrar uso
- FR17: Los usuarios con capability `can_assign_technicians` pueden asignar de 1 a 3 técnicos internos a cada orden de trabajo
- FR18: Los usuarios con capability `can_assign_technicians` pueden asignar órdenes de trabajo a proveedores externos
- FR19: Los usuarios con capability `can_assign_technicians` pueden seleccionar de 1 a 3 técnicos o proveedores según el tipo de orden de trabajo
- FR19-A: Cuando una orden de trabajo tiene múltiples usuarios asignados, cualquiera de ellos puede agregar repuestos usados, actualizar estado o completar la OT
- FR20: Los usuarios con capability `can_update_own_ot` pueden ver todas las órdenes de trabajo donde están asignados en su dashboard personal
- FR21: Los usuarios con capability `can_view_all_ots` pueden ver todas las órdenes de trabajo de la organización
- FR22: Se pueden distinguir visualmente entre órdenes de preventivo (color verde #28A745), correctivo propio (color rojizo #DC3545) y correctivo externo (color rojo con línea blanca)
- FR23: Se pueden distinguir visualmente entre órdenes de reparación interna (taller propio, color naranja #FD7E14) y reparación enviada a proveedor (color azul #17A2B8)
- FR24: Se pueden ver detalles completos de una orden de trabajo en modal informativo
- FR24-A: Cuando un proveedor marca una orden de reparación como completada, los usuarios con capability `can_assign_technicians` pueden confirmar la recepción del equipo reparado
- FR25: Los usuarios con capacidad `can_create_manual_ot` pueden crear órdenes de trabajo manuales sin partir de un aviso
- FR26: Se puede acceder a una vista de listado de todas las órdenes de trabajo
- FR27: Se puede filtrar el listado de órdenes de trabajo por 5 criterios: estado, técnico, fecha, tipo, equipo
- FR28: Se puede ordenar el listado de órdenes de trabajo por cualquier columna
- FR29: Se pueden realizar las mismas acciones en la vista de listado que en el Kanban
- FR30: Se puede alternar entre vista Kanban y vista de listado
- FR31: Las vistas Kanban y de listado mantienen sincronización en tiempo real

**3. Gestión de Activos (FR32-FR43)**
- FR32: El sistema maneja jerarquía de activos de 5 niveles: Planta → Línea → Equipo → Componente → Repuesto
- FR33: Los usuarios con capability `can_manage_assets` pueden navegar la jerarquía de activos de 5 niveles en cualquier dirección
- FR34: Los usuarios con capability `can_manage_assets` pueden asociar un componente a múltiples equipos
- FR35: Los usuarios con capability `can_view_repair_history` pueden ver el historial de reparaciones de un equipo
- FR36: Los usuarios con capability `can_manage_assets` pueden gestionar 5 estados para equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado)
- FR37: Los usuarios con capability `can_manage_assets` pueden cambiar el estado de un equipo
- FR38: Los usuarios con capability `can_manage_assets` pueden ver el stock de equipos completos reutilizables con contador de cantidades por estado
- FR39: Los usuarios con capability `can_manage_assets` pueden rastrear la ubicación actual de equipos reutilizables por área de fábrica asignada
- FR40: Los usuarios con capability `can_manage_assets` pueden importar activos masivamente desde un archivo CSV
- FR41: La estructura jerárquica se valida automáticamente durante la importación masiva de activos
- FR42: Los usuarios con capability `can_manage_assets` pueden ver un reporte de resultados de la importación
- FR43: Los usuarios con capability `can_manage_assets` pueden descargar una plantilla de importación con el formato requerido

**4. Gestión de Repuestos (FR44-FR56)**
- FR44: Todos los usuarios pueden acceder al catálogo de repuestos consumibles en modo consulta
- FR45: Todos los usuarios pueden ver el stock actual de cada repuesto en tiempo real
- FR46: Todos los usuarios pueden ver la ubicación física de cada repuesto en el almacén
- FR47: Los usuarios ven el stock y ubicación al seleccionar un repuesto para uso
- FR48: Los usuarios con capability `can_manage_stock` pueden realizar ajustes manuales de stock
- FR49: Los usuarios deben agregar un motivo al realizar ajustes manuales de stock
- FR50: Los usuarios con capability `can_manage_stock` reciben alertas cuando un repuesto alcanza su stock mínimo
- FR51: Los usuarios con capability `can_manage_stock` pueden generar pedidos de repuestos a proveedores
- FR52: Los usuarios con capability `can_manage_stock` pueden gestionar el stock de repuestos
- FR53: Los usuarios con capability `can_manage_stock` pueden asociar cada repuesto con uno o más proveedores
- FR54: Los usuarios con capability `can_manage_stock` pueden importar repuestos masivamente desde un archivo CSV
- FR55: Los datos de proveedores y ubicaciones se validan automáticamente durante la importación masiva de repuestos
- FR56: Los usuarios pueden ver un reporte de resultados de la importación

**5. Gestión de Usuarios, Roles y Capacidades (FR58-FR76)**
- FR58: Los usuarios con capability `can_manage_users` pueden crear nuevos usuarios en el sistema
- FR59: Los usuarios con capability `can_manage_users` pueden crear hasta 20 etiquetas de clasificación de usuarios (ej: Operario, Técnico, Supervisor)
- FR61: Los usuarios con capability `can_manage_users` pueden eliminar etiquetas de clasificación personalizadas
- FR62: Los usuarios pueden tener asignada una o más etiquetas de clasificación simultáneamente
- FR64: Los usuarios con capability `can_manage_users` pueden asignar etiquetas de clasificación a usuarios para organización visual
- FR65: Los usuarios con capability `can_manage_users` pueden quitar las etiquetas de clasificación de usuarios
- FR66: Todo usuario nuevo (excepto el administrador inicial) tiene ÚNICAMENTE la capability `can_create_failure_report` asignada por defecto
- FR67: Durante el registro de usuarios, los usuarios con capability `can_manage_users` seleccionan las capabilities asignadas usando checkboxes con etiquetas en castellano legibles
- FR67-A: Las etiquetas de clasificación son únicamente para organizar visualmente a los usuarios y NO tienen ninguna relación con las capabilities
- FR67-B: Una misma etiqueta de clasificación NO otorga las mismas capacidades a todos los usuarios que la tienen asignada
- FR68: Las capacidades del sistema son 15 en total (listado detallado en PRD)
- FR68-UI: Las capabilities se presentan en la interfaz de usuario en castellano con formato legible
- FR68-A: Los usuarios sin la capability `can_manage_assets` solo pueden consultar activos en modo solo lectura
- FR68-B: Los usuarios sin la capability `can_view_repair_history` no pueden acceder al historial de reparaciones de equipos
- FR68-C: El primer usuario creado durante el setup inicial de la aplicación tiene las 15 capabilities del sistema asignadas por defecto
- FR69: Los usuarios pueden acceder a su perfil personal
- FR69-A: Los usuarios con capability `can_manage_users` pueden editar la información personal de cualquier usuario
- FR70: Los usuarios pueden editar su información personal (nombre, email, teléfono)
- FR71: Los usuarios pueden cambiar su contraseña
- FR70-A: Los usuarios con capability `can_manage_users` pueden eliminar usuarios del sistema
- FR72: Los usuarios con capability `can_manage_users` pueden ver un historial de actividad del usuario durante los últimos 6 meses
- FR72-A: El sistema obliga a los usuarios a cambiar su contraseña temporal en el primer acceso
- FR72-B: Los usuarios con capability `can_manage_users` pueden registrar nuevos usuarios asignando credenciales temporales
- FR72-C: Los usuarios con capability `can_manage_users` pueden ver el historial de trabajos completo de cualquier usuario
- FR73: Los usuarios acceden solo a los módulos para los que tienen capacidades asignadas
- FR74: Los usuarios solo ven en la navegación los módulos para los que tienen capacidades asignadas
- FR75: El acceso se deniega automáticamente si un usuario intenta navegar directamente a un módulo no autorizado
- FR76: Los usuarios ven un mensaje explicativo cuando se deniega acceso por falta de capacidades

**6. Gestión de Proveedores (FR77-FR80)**
- FR77: Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de mantenimiento
- FR78: Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de repuestos
- FR78-A: El formulario de proveedores es único para ambos tipos, con un campo de selección "Tipo de proveedor"
- FR79: Los usuarios con capability `can_manage_providers` pueden ver datos de contacto de cada proveedor
- FR80: Los usuarios con capability `can_manage_providers` pueden asociar proveedores con tipos de servicio que ofrecen

**7. Gestión de Rutinas de Mantenimiento (FR81-FR84)**
- FR81: Los usuarios con capability `can_manage_routines` pueden gestionar rutinas de mantenimiento con frecuencias diaria, semanal o mensual
- FR81-A: Las rutinas de mantenimiento pueden ser de dos modalidades: Por equipo específico o Customizables
- FR81-B: Cada rutina de mantenimiento configura: tareas a realizar, técnico responsable, repuestos necesarios y duración estimada
- FR82: Las órdenes de trabajo de mantenimiento preventivo se generan automáticamente 24 horas antes del vencimiento de rutina
- FR83: Los usuarios con capability `can_view_all_ots` pueden ver el porcentaje de rutinas completadas en el dashboard
- FR84: El usuario asignado a una rutina recibe alertas cuando la rutina no se completa en el plazo previsto

**8. Análisis y Reportes (FR85-FR95)**
- FR85: Los usuarios con capability `can_view_kpis` pueden ver el KPI MTTR calculado con datos actualizados cada 30 segundos
- FR86: Los usuarios con capability `can_view_kpis` pueden ver el KPI MTBF calculado con datos actualizados cada 30 segundos
- FR87: Los usuarios con capability `can_view_kpis` pueden navegar drill-down de KPIs (Global → Planta → Línea → Equipo)
- FR88: Los usuarios con capability `can_view_kpis` pueden ver métricas adicionales
- FR89: Los usuarios con capability `can_view_kpis` reciben alertas de 3 tipos: stock mínimo, MTTR alto, rutinas no completadas
- FR90: Los usuarios con capability `can_view_kpis` pueden exportar reportes de KPIs a Excel en formato .xlsx
- FR90-A: Los usuarios con capability `can_receive_reports` pueden configurar la recepción de reportes automáticos en PDF enviados por email
- FR90-B: Los reportes diarios se generan automáticamente todos los días a las 8:00 AM
- FR90-C: Los reportes semanales se generan automáticamente todos los lunes a las 8:00 AM
- FR90-D: Los reportes mensuales se generan automáticamente el primer lunes de cada mes a las 9:00 AM
- FR90-E: Los usuarios con capability `can_receive_reports` pueden descargar manualmente cualquier reporte desde el dashboard en formato PDF
- FR91: Todos los usuarios acceden al mismo dashboard general con KPIs de la planta al hacer login
- FR91-A: Los usuarios con capability `can_view_kpis` pueden hacer drill-down y ver análisis avanzado

**9. Sincronización y Acceso Multi-Dispositivo (FR96-FR100)**
- FR96: El sistema sincroniza datos entre múltiples dispositivos: <1 segundo para OTs, <30 segundos para KPIs
- FR97: Los usuarios pueden acceder desde dispositivos desktop, tablet y móvil
- FR98: La interfaz se adapta responsivamente al tamaño de pantalla del dispositivo con 3 breakpoints definidos
- FR99: Los usuarios pueden instalar la aplicación en dispositivos móviles como aplicación nativa (PWA)
- FR100: Los usuarios reciben notificaciones push en sus dispositivos

**10. Funcionalidades Adicionales (FR101-FR108)**
- FR101: Los usuarios con capability `can_create_failure_report` pueden rechazar una reparación si no funciona correctamente
- FR102: La búsqueda predictiva está disponible en cualquier campo de búsqueda del sistema
- FR104: Los usuarios pueden ver su propio historial de acciones de los últimos 30 días
- FR105: Cualquier usuario puede configurar sus propias preferencias de notificación por tipo
- FR106: Los usuarios con capability `can_update_own_ot` pueden agregar comentarios con timestamp a OTs en progreso
- FR107: Los usuarios con capability `can_update_own_ot` pueden adjuntar fotos antes y después de la reparación
- FR108: Los equipos pueden tener código QR asociado para escaneo de identificación

**Total: 123 Requisitos Funcionales**

### NonFunctional Requirements

**Performance (7 requisitos)**
- NFR-P1: La búsqueda predictiva de equipos debe devolver resultados en menos de 200ms
- NFR-P2: La carga inicial (first paint) de la aplicación debe completarse en menos de 3 segundos
- NFR-P3: Las actualizaciones en tiempo real via SSE deben reflejarse cada 30 segundos (heartbeat)
- NFR-P4: El dashboard de KPIs debe cargar y mostrar datos en menos de 2 segundos
- NFR-P5: Las transiciones entre vistas deben completarse en menos de 100ms
- NFR-P6: El sistema debe soportar 50 usuarios concurrentes sin degradación de performance (>10%)
- NFR-P7: La importación masiva de 10,000 activos debe completarse en menos de 5 minutos

**Security (9 requisitos)**
- NFR-S1: Todos los usuarios deben autenticarse antes de acceder al sistema
- NFR-S2: Las contraseñas deben almacenarse hasheadas (bcrypt/argon2)
- NFR-S3: Todas las comunicaciones entre cliente y servidor deben usar HTTPS/TLS 1.3
- NFR-S4: El sistema debe implementar control de acceso basado en capacidades (PBAC)
- NFR-S5: El sistema debe registrar logs de auditoría para acciones críticas
- NFR-S6: Las sesiones de usuario deben expirar después de 8 horas de inactividad
- NFR-S7: El sistema debe sanitizar todas las entradas de usuario para prevenir inyección SQL/XSS
- NFR-S8: Los datos sensibles nunca deben aparecer en logs o errores expuestos al cliente
- NFR-S9: El sistema debe implementar Rate Limiting para prevenir ataques de fuerza bruta (máx. 5 intentos fallidos por IP en 15 minutos)

**Scalability (5 requisitos)**
- NFR-SC1: El sistema debe soportar hasta 10,000 activos sin degradación de performance
- NFR-SC2: El sistema debe soportar hasta 100 usuarios concurrentes sin degradación de performance (>10%)
- NFR-SC3: La base de datos debe estar optimizada con índices para consultas frecuentes
- NFR-SC4: El sistema debe implementar paginación para listados grandes (más de 100 items por vista)
- NFR-SC5: El sistema debe soportar crecimiento a 20,000 activos con ajustes de infraestructura

**Accessibility (6 requisitos)**
- NFR-A1: La interfaz debe cumplir con nivel WCAG AA de contraste (mínimo 4.5:1)
- NFR-A2: El tamaño de texto base debe ser mínimo 16px con títulos de 20px o más
- NFR-A3: Los elementos interactivos deben tener un tamaño mínimo de 44x44px
- NFR-A4: La interfaz debe ser legible en condiciones de iluminación de fábrica (alto contraste)
- NFR-A5: La aplicación debe ser navegable usando teclado en desktop y touch targets en tablets/móviles
- NFR-A6: La interfaz debe soportar zoom hasta 200% sin romper el layout

**Reliability (6 requisitos)**
- NFR-R1: El sistema debe tener un uptime objetivo del 99% durante horarios de operación de fábrica
- NFR-R2: El sistema debe realizar backups automáticos diarios de la base de datos
- NFR-R3: El sistema debe tener un proceso de restore validado con recovery time objetivo (RTO) de 4 horas
- NFR-R4: Las conexiones SSE deben reconectarse automáticamente si se pierde conexión temporal (<30 segundos)
- NFR-R5: El sistema debe mostrar mensajes claros de error cuando un servicio no está disponible
- NFR-R6: Las operaciones críticas deben tener confirmación de éxito antes de considerarlas completadas

**Integration (4 requisitos)**
- NFR-I1: El sistema debe soportar importación masiva de datos mediante archivos CSV con formato validado
- NFR-I2: El sistema debe exportar reportes de KPIs en formato Excel compatible con Microsoft Excel 2016+
- NFR-I3: La arquitectura debe permitir futura integración con sistemas ERP mediante API REST (Phase 3+)
- NFR-I4: La arquitectura debe permitir futura integración con sistemas de producción (IoT) para lectura de datos de equipos (Phase 4)

**Total: 37 Requisitos No Funcionales**

### Additional Requirements

**Requisitos del Starter Template (Architecture)**
- Starter template seleccionado: create-next-app (Manual Configuration)
- Comando de inicialización: `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
- Configuración manual de dependencias requerida

**Stack Técnico (versiones estables Ene 2025)**
- Next.js 15.0.3 + TypeScript 5.3.3
- React 18.3.1
- Prisma 5.22.0 + Neon PostgreSQL
- NextAuth.js 4.24.7 (Credentials provider, NO usar v5 beta)
- Tailwind CSS 3.4.1
- shadcn/ui + Radix UI (WCAG AA compliant)
- Zod 3.23.8 (validación de esquemas)
- TanStack Query 5.51.0 (data fetching)
- React Hook Form 7.51.5 (form handling)
- Lucide React 0.344.0 (icons)
- bcryptjs 2.4.3 (password hashing)
- Node.js 20.11.1 LTS (runtime)

**Infraestructura y Deployment**
- Hosting: Vercel con CI/CD nativo (GitHub Integration)
- Database: Neon PostgreSQL con backups diarios automáticos
- Real-time: Server-Sent Events (SSE) con heartbeat 30s
- Caching: Next.js Data Cache + índices Prisma
- Error handling: Custom Error Classes + Error Handler Middleware
- API design: REST versionado `/v1/` + Server Actions híbrido

**Requisitos de Componentes UI (UX Design)**
- Component library: shadcn/ui + Radix UI
- Componentes custom requeridos:
  - OTCard (Tarjeta de Orden de Trabajo)
  - KanbanBoard (Tablero Kanban)
  - AssetSearch (Búsqueda Predictiva de Activos)
  - KPICard (Tarjeta de KPI)
  - StatusBadge (Badge de Estado)
  - ModalInfo (Modal ℹ️ de Detalles)
  - StockAlert (Alerta de Stock Crítico)
  - DivisionTag (Tag de División)

**Requisitos de Responsive Design**
- 3 breakpoints principales: <768px (móvil), 768-1200px (tablet), >1200px (desktop)
- Breakpoints adicionales: 640px (sm), 1024px (lg), 1536px (2xl)
- Navegación adaptativa: bottom nav (móvil), sidebar simplificado (tablet), sidebar completo (desktop)
- Contenedor responsive: 100% ancho disponible (todas las pantallas)

**Líneas de Diseño UX (Colores y Pantallas)**
- Color principal: Rojo Burdeos #7D1220 (header, botones principales, estados activos)
- Color fondo: Blanco #FFFFFF
- Color texto: Negro #000000 (sobre blanco), Blanco #FFFFFF (sobre rojo)
- Colores de división: HiRock #FFD700 (Amarillo), Ultra #8FBC8F (Verde Salvia)
- Estados OT Kanban (8 colores):
  - pending-review: #6B7280 (Gris)
  - pending-approval: #F59E0B (Ámbar)
  - approved: #3B82F6 (Azul)
  - in-progress: #8B5CF6 (Púrpura)
  - paused: #EC4899 (Rosa)
  - completed: #10B981 (Verde)
  - closed: #6B7280 (Gris)
  - cancelled: #EF4444 (Rojo)
- Feedback UI: Éxito #10B981, Advertencia #F59E0B, Error #EF4444, Info #3B82F6
- Tipografía: Inter (font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- Escala tipográfica: xs 12px, sm 14px, base 16px, lg 18px, xl 20px, 2xl 24px, 3xl 30px, 4xl 36px
- Pesos fuente: Regular 400, Medium 500, Semibold 600, Bold 700
- Espaciado: Grid de 8px (4px, 8px, 12px, 16px, 24px, 32px, 48px)
- Touch targets: Mínimo 44x44px para elementos interactivos
- Padding inputs: 16px vertical (44px altura total para tapping)
- Padding botones: 16px (8px arriba/abajo, 16px izquierda/derecha)
- Padding tarjetas: 16px interno, 24px márgenes
- Espaciado columnas Kanban: 16px entre columnas
- Padding modal: 24px, 32px espaciado entre secciones
- Indicador foco: 2px sólido rojo burdeos #7D1220
- Animaciones: 200-300ms para transiciones, respetar prefers-reduced-motion

**Direcciones de Diseño por Contexto (UX Design Directions)**
Estrategia Multi-Direction: Cada dirección sirve a un contexto específico de usuario y dispositivo

**Dirección 1: Dashboard Clásico (Contexto: Desktop Elena/Javier en oficina)**
- Layout tradicional con sidebar fijo izquierdo (224px ancho)
- Header con logo, nombre app y perfil usuario
- Dashboard principal con 4 KPI cards prominentes (MTTR, MTBF, OTs Abiertas, Disponibilidad)
- Sección "Acciones Rápidas" con 3 botones principales
- Sección "Actividad Reciente" con timeline vertical
- Navegación sidebar: Dashboard, Kanban OTs, Reportar Avería, KPIs, Activos, Stock
- Referencia visual: ux-design-directions.html Dirección 1

**Dirección 2: Kanban First (Contexto: Desktop/Tablet Javier para control visual)**
- Kanban de 8 columnas es protagonista central
- Header simplificado con título "Kanban de Órdenes de Trabajo" y botones Filtros/+Nueva OT
- Panel lateral colapsable derecho (256px) con KPIs del día
- Columnas Kanban: Por Revisar (gris #6B7280), Por Aprobar (ámbar #F59E0B), Aprobada (azul #3B82F6), En Progreso (púrpura #8B5CF6), Pausada (rosa #EC4899), Completada (verde #10B981), Cerrada, Cancelada
- OT cards con borde izquierdo coloreado según estado, tags división HiRock/Ultra, técnico asignado
- Drag & drop visible entre columnas
- Referencia visual: ux-design-directions.html Dirección 2

**Dirección 3: Mobile First (Contexto: Móvil Carlos/María en piso de fábrica)**
- Navegación inferior (bottom tabs): Inicio, OTs, Más
- Header compacto con saludo "Hola, {nombre}" + título página
- Botón CTA primario " + Reportar Avería" prominente (fondo rojo burdeos, padding 16px, altura 56px)
- Stats en grid 2 columnas con cards (Mis Reportes Hoy, En Progreso)
- Lista "Mis Reportes" con cards simplificadas
- Bottom nav con iconos + labels, touch targets 44px altura mínima
- Formulario reporte: búsqueda predictiva autocomplete, descripción opcional, adjuntar foto (botón dashed border)
- Inputs con 44px altura para tapping fácil
- Referencia visual: ux-design-directions.html Dirección 3

**Dirección 4: Data Heavy (Contexto: Desktop Elena para análisis y reportes)**
- Header con select periodo (Últimos 30 días, Últimos 7 días, Este mes)
- Row de 6 KPI cards compactos (MTTR, MTBF, Disponibilidad, OTs Abiertas, Completadas Mes, Costo Mantenimiento)
- Charts: MTTR Trend (bar chart), OTs por Estado (pie chart)
- Data table "Top 10 Equipos con Más Fallas" con columnas: Equipo, División (tag), Fallar, MTTR, Costo, Tendencia (↑↓→)
- Tabla con hover rows, sortable headers, export button
- Tipografía densa, datos concretos para toma de decisiones
- Referencia visual: ux-design-directions.html Dirección 4

**Dirección 5: Minimal (Contexto: Reducir sobrecarga cognitiva)**
- Header minimal con logo cuadrado (64px) + "GMAO" texto, icono búsqueda, avatar
- Hero section: "Buenas tardes, {nombre}" + "¿Qué necesitas hacer hoy?"
- Grid 3 columnas con actions minimal: icono grande (64px) + título + subtítulo
- Cards con border-2 border-gray-100 hover:border-maroon, mucho whitespace
- Stats minimal: número grande (text-4xl font-light) + label pequeño (text-sm text-gray-500)
- Foco en tarea actual, reducción de elementos visuales
- Apoya objetivo emocional "Qué Paz"
- Referencia visual: ux-design-directions.html Dirección 5

**Dirección 6: Action Oriented (Contexto: Core experience "Reportar avería en 30 segundos")**
- Banner primario: "¿Necesitas reportar una avería?" + CTA " + Reportar Avería Ahora"
- Grid 4 columnas quick actions: Mis OTs (8 asignadas), Ver Kanban (23 OTs), Activos (Buscar equipo), Stock (2 críticos)
- Cards con icono (56px), título semibold, count text-xs text-gray-500
- Sección "Requiere tu atención" con items urgency-styled:
  - Avería pendiente aprobación (bg-amber-50, emoji ⚠️, CTA "Revisar →")
  - Stock crítico (bg-red-50, emoji 📉, CTA "Reponer →")
- CTAs prominentes, shortcuts visibles
- Referencia visual: ux-design-directions.html Dirección 6

**Adaptive Layout Strategy**
- Móvil (<768px): Dirección 3 (Mobile First) + elementos de Dirección 6 (Action Oriented)
- Tablet (768-1200px): Híbrido Dirección 2 + 3 (Kanban mobile-optimized con swipe)
- Desktop (>1200px): Dirección 1 (default), adapta a 2/4/5/6 según rol y tarea
- User personas drive layout: Carlos (operario) = Mobile First, María (técnica) = Kanban First, Javier (supervisor) = Kanban First, Elena (admin) = Data Heavy, Pedro (stock) = Classic

**Requisitos de Testabilidad (TEA Handoff)**
- Data-testid attributes requeridos para test automation
- 5 pre-implementation blockers (BLK-001 a BLK-005) deben resolverse antes de QA:
  - BLK-001: Test Data Seeding APIs (/api/test-data endpoints)
  - BLK-002: SSE Mock Layer (fast-forward mode para tests)
  - BLK-003: Multi-Device Sync Conflict Strategy (last-write-wins + merge)
  - BLK-004: Observability Infrastructure (structured logging, correlation IDs)
  - BLK-005: Performance Baseline Infrastructure (k6 load testing)

**Requisitos de Calidad y Riesgos (TEA Handoff)**
- Riesgos críticos (Score ≥6) deben referenciarse en epics:
  - R-001 (PERF, Score 9): Búsqueda predictiva <200ms con 10K+ activos
  - R-002 (DATA, Score 9): Multi-device sync race conditions
  - R-005 (SEC, Score 6): PBAC implementation security
  - R-006 (PERF, Score 6): 100 usuarios concurrentes sin degradación
- Quality gates por epic definidos (73 tests P0 + 26 tests P1 + 3 tests P2)
- Test scenarios P0/P1 deben convertirse a story acceptance criteria

### FR Coverage Map

**Epic 0: Setup e Infraestructura Base**
- Infraestructura (0 FRs): Pre-implementation blockers BLK-001 a BLK-005 resueltos

**Epic 1: Autenticación y Gestión de Usuarios (PBAC)**
- FR58: Crear nuevos usuarios
- FR59: Crear hasta 20 etiquetas de clasificación
- FR61: Eliminar etiquetas personalizadas
- FR62: Asignar múltiples etiquetas a usuarios
- FR64: Asignar etiquetas para organización visual
- FR65: Quitar etiquetas de usuarios
- FR66: Usuario nuevo con solo `can_create_failure_report` por defecto
- FR67: Seleccionar capabilities con checkboxes en castellano
- FR67-A: Etiquetas solo para organización visual (sin relación con capabilities)
- FR67-B: Etiqueta no otorga mismas capacidades a usuarios
- FR68: 15 capacidades del sistema
- FR68-UI: Capabilities presentadas en castellano legible
- FR68-A: Usuarios sin `can_manage_assets` solo consultan (solo lectura)
- FR68-B: Usuarios sin `can_view_repair_history` no acceden a historial
- FR68-C: Administrador inicial con 15 capabilities
- FR69: Acceder a perfil personal
- FR69-A: Editar información personal de cualquier usuario (admin)
- FR70: Editar información personal propia
- FR71: Cambiar contraseña
- FR70-A: Eliminar usuarios (admin)
- FR72: Ver historial de actividad últimos 6 meses (admin)
- FR72-A: Cambio contraseña obligatorio en primer acceso
- FR72-B: Registrar usuarios con credenciales temporales
- FR72-C: Ver historial de trabajos completo
- FR73: Acceder solo a módulos con capabilities asignadas
- FR74: Ver solo módulos con capabilities en navegación
- FR75: Access denied automático a módulos no autorizados
- FR76: Mensaje explicativo cuando access denied

**Epic 2: Gestión de Averías y Reportes Rápidos**
- FR1: Crear avisos de avería asociados a equipos
- FR2: Agregar descripción textual del problema
- FR3: Adjuntar foto opcional
- FR4: Notificaciones push en 30s después de cambio de estado
- FR5: Confirmar si reparación funciona correctamente
- FR6: Búsqueda predictiva de equipos durante creación
- FR7: Ver todos los avisos nuevos en columna de triage
- FR8: Convertir avisos en órdenes de trabajo
- FR9: Descartar avisos no procedentes
- FR10: Distinguir visualmente avería (rosa #FFC0CB) vs reparación (blanco #FFFFFF)

**Epic 3: Órdenes de Trabajo (Kanban Multi-Dispositivo)**
- FR11: 8 estados posibles para OTs
- FR11-A: Tipo de mantenimiento (Preventivo/Correctivo)
- FR11-B: Etiqueta "Preventivo" o "Correctivo" visible
- FR12: Iniciar OT cambiando estado a "En Progreso"
- FR13: Agregar repuestos usados y requisitos
- FR14: Completar (validar) OT
- FR15: Agregar notas internas a OT
- FR16: Stock actualizado en tiempo real (<1s)
- FR17: Asignar 1-3 técnicos internos
- FR18: Asignar OTs a proveedores externos
- FR19: Seleccionar técnicos o proveedores según tipo
- FR19-A: Múltiples usuarios asignados pueden actualizar
- FR20: Ver OTs asignadas en dashboard personal
- FR21: Ver todas las OTs de la organización
- FR22: Distinguir visualmente preventivo (verde #28A745), correctivo propio (rojizo #DC3545), correctivo externo (rojo con línea blanca)
- FR23: Distinguir reparación interna (naranja #FD7E14) vs externa (azul #17A2B8)
- FR24: Ver detalles completos en modal informativo
- FR24-A: Confirmar recepción equipo reparado de proveedor
- FR25: Crear OTs manuales sin aviso previo
- FR26: Acceder a vista de listado de todas las OTs
- FR27: Filtrar listado por 5 criterios
- FR28: Ordenar listado por cualquier columna
- FR29: Realizar mismas acciones en vista listado que Kanban
- FR30: Alternar entre vista Kanban y listado
- FR31: Sincronización en tiempo real entre vistas

**Epic 4: Gestión de Activos y Jerarquía de 5 Niveles**
- FR32: Jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto)
- FR33: Navegar jerarquía en cualquier dirección
- FR34: Asociar componente a múltiples equipos
- FR35: Ver historial de reparaciones de equipo
- FR36: Gestionar 5 estados para equipos
- FR37: Cambiar estado de equipo
- FR38: Ver stock de equipos completos reutilizables
- FR39: Rastrear ubicación actual de equipos reutilizables
- FR40: Importar activos masivamente desde CSV
- FR41: Validar estructura jerárquica durante importación
- FR42: Ver reporte de resultados de importación
- FR43: Descargar plantilla de importación

**Epic 5: Gestión de Repuestos, Stock y Proveedores**
- FR44: Acceder catálogo de repuestos en modo consulta
- FR45: Ver stock actual de cada repuesto en tiempo real
- FR46: Ver ubicación física de cada repuesto
- FR47: Ver stock y ubicación al seleccionar repuesto
- FR48: Realizar ajustes manuales de stock
- FR49: Agregar motivo al ajuste manual de stock
- FR50: Recibir alertas stock mínimo
- FR51: Generar pedidos de repuestos a proveedores
- FR52: Gestionar stock de repuestos
- FR53: Asociar repuesto con uno o más proveedores
- FR54: Importar repuestos masivamente desde CSV
- FR55: Validar proveedores y ubicaciones durante importación
- FR56: Ver reporte de resultados de importación
- FR77: Gestionar catálogo de proveedores de mantenimiento
- FR78: Gestionar catálogo de proveedores de repuestos
- FR78-A: Formulario único con campo "Tipo de proveedor"
- FR79: Ver datos de contacto de cada proveedor
- FR80: Asociar proveedores con tipos de servicio

**Epic 6: KPIs, Dashboard y Reportes Automáticos**
- FR85: Ver KPI MTTR actualizado cada 30s
- FR86: Ver KPI MTBF actualizado cada 30s
- FR87: Navegar drill-down de KPIs (Global → Planta → Línea → Equipo)
- FR88: Ver métricas adicionales
- FR89: Recibir alertas (stock mínimo, MTTR alto, rutinas no completadas)
- FR90: Exportar reportes de KPIs a Excel
- FR90-A: Configurar recepción reportes automáticos PDF por email
- FR90-B: Reportes diarios generados a las 8:00 AM
- FR90-C: Reportes semanales generados lunes 8:00 AM
- FR90-D: Reportes mensuales generados primer lunes 9:00 AM
- FR90-E: Descargar manualmente reporte en PDF
- FR91: Dashboard general con KPIs al hacer login
- FR91-A: Drill-down y análisis avanzado con `can_view_kpis`

**Epic 7: Rutinas de Mantenimiento Preventivo**
- FR81: Gestionar rutinas con frecuencias diaria/semanal/mensual
- FR81-A: Rutinas por equipo específico o Customizables
- FR81-B: Configurar tareas, técnico, repuestos, duración
- FR82: Generar OTs preventivas 24h antes vencimiento
- FR83: Ver porcentaje de rutinas completadas en dashboard
- FR84: Recibir alertas cuando rutina no se completa

**Epic 8: Multi-Dispositivo, PWA y Sincronización**
- FR96: Sincronizar datos entre dispositivos (<1s OTs, <30s KPIs)
- FR97: Acceder desde desktop, tablet y móvil
- FR98: Interfaz responsive con 3 breakpoints
- FR99: Instalar app como PWA en móviles
- FR100: Recibir notificaciones push en dispositivos

## Epic List

### Epic 0: Setup e Infraestructura Base

Sistema base configurado con todas las herramientas y servicios necesarios para soportar el desarrollo de features del GMAO.

**FRs cubiertos:** Infraestructura (0 FRs)

**Pre-implementation Blockers resueltos:**
- BLK-001: Test Data Seeding APIs (/api/test-data endpoints)
- BLK-002: SSE Mock Layer (fast-forward mode para tests)
- BLK-003: Multi-Device Sync Conflict Strategy (last-write-wins + merge)
- BLK-004: Observability Infrastructure (structured logging, correlation IDs)
- BLK-005: Performance Baseline Infrastructure (k6 load testing)

**Stack técnico:**
- Next.js 15.0.3 + TypeScript 5.3.3 + React 18.3.1
- Prisma 5.22.0 + Neon PostgreSQL
- NextAuth.js 4.24.7 (Credentials provider)
- Tailwind CSS 3.4.1 + shadcn/ui + Radix UI
- Zod 3.23.8 + React Hook Form 7.51.5
- TanStack Query 5.51.0 + Lucide React 0.344.0
- Vercel hosting + CI/CD GitHub Integration

### Epic 1: Autenticación y Gestión de Usuarios (PBAC)

Los usuarios pueden registrarse, hacer login, y los administradores pueden gestionar usuarios con control de acceso granular basado en 15 capacidades (PBAC - Permission-Based Access Control).

**FRs cubiertos:** FR58-FR76 (19 FRs)

**NFRs cubiertos:** NFR-S1, NFR-S2, NFR-S4, NFR-S5, NFR-S6, NFR-S7, NFR-S9, NFR-A5

**Riesgos críticos:** R-005 (SEC, Score 6): PBAC implementation security

**Quality Gates:**
- Las 15 capacidades del sistema PBAC funcionan correctamente sin exponer datos sensibles
- Usuarios sin capabilities appropriate solo ven modo lectura
- Access denied funciona correctamente

**Stories (3 condensadas):**
- Story 1.1: Login, Registro y Perfil de Usuario
- Story 1.2: Sistema PBAC con 15 Capacidades
- Story 1.3: Etiquetas de Clasificación y Organización

### Epic 2: Gestión de Averías y Reportes Rápidos

Los operarios pueden reportar averías en menos de 30 segundos con búsqueda predictiva de equipos, y los supervisores pueden triagear y convertir los reportes en órdenes de trabajo.

**FRs cubiertos:** FR1-FR10 (10 FRs)

**NFRs cubiertos:** NFR-P1, NFR-P2, NFR-A3, NFR-A4

**Riesgos críticos:** R-001 (PERF, Score 9): Búsqueda predictiva <200ms con 10K+ activos

**Quality Gates:**
- Búsqueda predictiva <200ms (P95) con 10,000 activos
- Reporte de avería <30 segundos end-to-end
- Notificación push recibida dentro de 30s

**UX Design Direction:** Dirección 6 (Action Oriented) + Dirección 3 (Mobile First)

**Stories (3 condensadas):**
- Story 2.1: Búsqueda Predictiva de Equipos
- Story 2.2: Formulario Reporte de Avería (Mobile First)
- Story 2.3: Triage de Averías y Conversión a OTs

### Epic 3: Órdenes de Trabajo (Kanban Multi-Dispositivo)

Los técnicos pueden ver y actualizar OTs asignadas, los supervisores pueden gestionar el Kanban de 8 columnas con drag & drop, y todo se sincroniza en tiempo real entre dispositivos y vistas.

**FRs cubiertos:** FR11-FR31 (21 FRs)

**NFRs cubiertos:** NFR-P3, NFR-P5, NFR-R4, NFR-R6

**Riesgos críticos:**
- R-002 (DATA, Score 9): Multi-device sync race conditions
- R-011 (DATA, Score 4): Stock update race conditions

**Quality Gates:**
- Sincronización multi-device <1s para OTs
- Stock actualizado en tiempo real <1s
- Kanban sync en tiempo real entre vistas

**UX Design Direction:** Dirección 2 (Kanban First) desktop/tablet, Dirección 3 (Mobile First) móvil

**Stories (4 condensadas):**
- Story 3.1: Kanban de 8 Columnas con Drag & Drop
- Story 3.2: Gestión de OTs Asignadas (Mis OTs)
- Story 3.3: Asignación de Técnicos y Proveedores
- Story 3.4: Vista de Listado con Filtros y Sync Real-time

### Epic 4: Gestión de Activos y Jerarquía de 5 Niveles

Los usuarios pueden navegar y gestionar la jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), ver historial de reparaciones, e importar activos masivamente desde CSV.

**FRs cubiertos:** FR32-FR43 (12 FRs)

**NFRs cubiertos:** NFR-P1, NFR-SC1, NFR-I1

**Riesgos críticos:**
- R-001 (PERF, Score 9): Búsqueda <200ms con 10K+ activos
- R-013 (TECH, Score 4): Componente asociado a múltiples equipos

**Quality Gates:**
- Navegación de 10K activos sin degradación
- Relaciones muchos-a-muchos funcionan correctamente
- Importación CSV con validación de estructura jerárquica

**UX Design Direction:** Dirección 1 (Dashboard Clásico) + Dirección 5 (Minimal)

**Stories (3 condensadas):**
- Story 4.1: Navegación Jerárquica de 5 Niveles
- Story 4.2: Historial de Reparaciones y Estados
- Story 4.3: Importación Masiva de Activos CSV

### Epic 5: Gestión de Repuestos, Stock y Proveedores

Los usuarios pueden gestionar stock de repuestos con actualización en tiempo real y alertas automáticas de stock mínimo, y gestionar el catálogo de proveedores de mantenimiento y repuestos.

**FRs cubiertos:** FR44-FR56, FR77-FR80 (17 FRs)

**NFRs cubiertos:** NFR-A1, NFR-I1, NFR-I2

**Riesgos críticos:** R-011 (DATA, Score 4): Stock update race conditions

**Quality Gates:**
- Stock actualizado en tiempo real <1s
- Alertas solo cuando stock mínimo
- Optimistic locking para prevenir race conditions

**UX Design Direction:** Dirección 6 (Action Oriented) - alertas prominentes

**Stories (3 condensadas):**
- Story 5.1: Catálogo de Repuestos y Stock
- Story 5.2: Gestión de Proveedores
- Story 5.3: Importación CSV de Repuestos y Pedidos

### Epic 6: KPIs, Dashboard y Reportes Automáticos

Los usuarios pueden ver KPIs (MTTR, MTBF) actualizados en tiempo real con drill-down por niveles (Global → Planta → Línea → Equipo), y recibir reportes automáticos por email en PDF/Excel.

**FRs cubiertos:** FR85-FR95 (11 FRs)

**NFRs cubiertos:** NFR-P3, NFR-P4, NFR-A2

**Riesgos críticos:**
- R-002 (PERF, Score 9): KPIs actualizados cada 30s
- R-009 (PERF, Score 4): Cálculo MTTR/MTBF con histórico grande

**Quality Gates:**
- MTTR y MTBF actualizados cada 30s (SSE heartbeat)
- Dashboard carga en <2 segundos
- Drill-down funciona (Global → Planta → Línea → Equipo)

**UX Design Direction:** Dirección 4 (Data Heavy) para Elena, Dirección 1 (Dashboard Clásico) para general

**Stories (3 condensadas):**
- Story 6.1: Dashboard Común con KPIs en Tiempo Real
- Story 6.2: Alertas y Métricas Avanzadas
- Story 6.3: Exportación y Reportes Automáticos

### Epic 7: Rutinas de Mantenimiento Preventivo

Los administradores pueden gestionar rutinas de mantenimiento preventivo que generan automáticamente órdenes de trabajo 24 horas antes del vencimiento, con alertas a los técnicos asignados.

**FRs cubiertos:** FR81-FR84 (4 FRs)

**NFRs cubiertos:** NFR-R6

**Riesgos críticos:** None

**Quality Gates:**
- OTs generadas 24h antes del vencimiento
- Alertas enviadas en 3 momentos (1h antes, vencimiento, 24h después)

**Stories (2 condensadas):**
- Story 7.1: Gestión de Rutinas Preventivas
- Story 7.2: Generación Automática de OTs y Alertas

### Epic 8: Multi-Dispositivo, PWA y Sincronización

Los usuarios pueden instalar la aplicación como PWA en dispositivos móviles, acceder desde cualquier dispositivo (desktop, tablet, móvil), y todas las actualizaciones se sincronizan automáticamente con reconexión inteligente.

**FRs cubiertos:** FR96-FR100 (5 FRs)

**NFRs cubiertos:** NFR-P3, NFR-P6, NFR-SC2, NFR-A3, NFR-A5, NFR-A6, NFR-R4

**Riesgos críticos:** R-002 (DATA, Score 9): Multi-device sync race conditions

**Quality Gates:**
- Sincronización OTs <1s entre dispositivos
- Sincronización KPIs <30s entre dispositivos
- Reconexión automática SSE <30s
- 100 usuarios concurrentes sin degradación >10%

**UX Design Direction:** Multi-direction strategy por dispositivo y rol

**Stories (3 condensadas):**
- Story 8.1: PWA con Instalación y Navegación Adaptativa
- Story 8.2: Sincronización SSE con Reconexión
- Story 8.3: Notificaciones Push y Preferencias

---

## Epic 0: Setup e Infraestructura Base

**Epic Goal:** Sistema base configurado con todas las herramientas y servicios necesarios para soportar el desarrollo de features del GMAO.

### Story 0.1: Starter Template y Stack Técnico

Como desarrollador,
quiero inicializar el proyecto Next.js con el stack técnico completo,
para tener una base sólida y probada para el desarrollo.

**Acceptance Criteria:**

**Given** que el proyecto está vacío
**When** ejecuto `npx create-next-app@latest gmao-hiansa --typescript --tailwind --app --no-src --import-alias "@/*"`
**Then** proyecto creado con Next.js 15.0.3 + TypeScript 5.3.3
**And** directorio structure creada con /app, /components, /lib, /prisma, /types, /public

**Given** proyecto Next.js creado
**When** instalo dependencias críticas (Prisma 5.22.0, NextAuth 4.24.7, shadcn/ui, Zod 3.23.8, React Hook Form 7.51.5, TanStack Query 5.51.0, Lucide React 0.344.0, bcryptjs 2.4.3)
**Then** todas las dependencias instaladas sin conflictos de versiones
**And** package.json contiene todas las dependencias con versiones verificadas

**Given** dependencias instaladas
**When** configuro Tailwind CSS con colores del design system
**Then** colors configurados: rojo burdeos #7D1220, HiRock #FFD700, Ultra #8FBC8F, 8 estados OT
**And** fuente Inter configurada con scale completa (12px a 36px)
**And** spacing system basado en grid de 8px

**Given** Tailwind configurado
**When** inicializo shadcn/ui
**Then** componentes base instalados (Button, Card, Dialog, Form, Table, Toast)
**And** components path alias configurado (@/components/ui)
**And** Tailwind config extendido con colores custom

**Testability:**
- data-testid attributes definidos para componentes base
- Configuración de Playwright preparada para testing E2E
- Environment variables documentadas en .env.example

---

### Story 0.2: Database Schema Prisma con Jerarquía 5 Niveles

Como desarrollador,
quiero definir el schema Prisma con todas las entidades y relaciones,
para tener la estructura de datos del GMAO con type safety completo.

**Acceptance Criteria:**

**Given** que Prisma está instalado
**When** defino schema.prisma con modelo User
**Then** User tiene: id, email, passwordHash, name, phone, forcePasswordReset, createdAt, updatedAt
**And** email es único con índice
**And** relación uno-a-muchos con UserCapability

**Given** modelo User definido
**When** defino modelo Capability (15 capacidades PBAC)
**Then** Capability tiene: id, name (enum inglés), label (castellano), description
**And** 15 capacidades creadas: can_create_failure_report, can_create_manual_ot, can_update_own_ot, can_view_own_ots, can_view_all_ots, can_complete_ot, can_manage_stock, can_assign_technicians, can_view_kpis, can_manage_assets, can_view_repair_history, can_manage_providers, can_manage_routines, can_manage_users, can_receive_reports
**And** relación muchos-a-muchos con User vía UserCapability

**Given** modelos User y Capability definidos
**When** defino modelos de jerarquía de activos (5 niveles)
**Then** Planta tiene: id, name, code, division (HiRock/Ultra), createdAt
**And** Linea tiene: id, name, code, plantaId (FK), createdAt
**And** Equipo tiene: id, name, code, lineaId (FK), estado (enum: Operativo, Averiado, En Reparación, Retirado, Bloqueado), ubicacionActual, createdAt
**And** Componente tiene: id, name, code, equipoId (FK nullable, muchos-a-muchos), createdAt
**And** Repuesto tiene: id, name, code, componenteId (FK), stock, stockMinimo, ubicacionFisica, createdAt
**And** relaciones con foreign keys y cascade delete apropiados

**Given** modelos de jerarquía definidos
**When** defino modelos de WorkOrder (OT)
**Then** WorkOrder tiene: id, numero, tipo (enum: Preventivo, Correctivo), estado (enum: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada), descripcion, equipoId (FK), createdAt, updatedAt, completedAt
**And** relación muchos-a-muchos con User vía WorkOrderAssignment
**And** WorkOrderAssignment tiene: roleId (enum: Tecnico, Proveedor), createdAt

**Given** modelo WorkOrder definido
**When** defino modelos de FailureReport (Avería)
**Then** FailureReport tiene: id, numero, descripcion, fotoUrl, equipoId (FK), estado (enum: Recibido, Autorizado, En Progreso, Completado, Descartado), reportadoPor (UserId FK), createdAt, updatedAt
**And** relación uno-a-uno con WorkOrder (cuando se convierte a OT)

**Given** modelo FailureReport definido
**When** ejecuto `npx prisma migrate dev --name init`
**Then** migration creada exitosamente en Neon PostgreSQL
**And** Prisma Client generado con tipos TypeScript completos
**And** todas las relaciones definidas correctamente sin errores

**Given** schema migrado
**When** creo índices para búsquedas frecuentes
**Then** índice creado en User.email
**And** índice creado en Equipo.name (para búsqueda predictiva <200ms)
**And** índice creado en WorkOrder.numero
**And** índice creado en FailureReport.numero
**And** índices compuestos en relaciones para optimizar joins

**Testability:**
- Seed script creado con datos de prueba (admin inicial, 10 equipos de ejemplo)
- /api/test-data/seed endpoint disponible para testing
- Data factory functions para crear entidades de prueba

---

### Story 0.3: NextAuth.js con Credentials Provider

Como desarrollador,
quiero configurar NextAuth.js con autenticación basada en email/password,
para que los usuarios puedan hacer login seguro en el sistema.

**Acceptance Criteria:**

**Given** que NextAuth 4.24.7 está instalado
**When** creo `/app/api/auth/[...nextauth]/route.ts`
**Then** Credentials provider configurado
**And** session strategy JWT configurada
**And** callbacks implementados: jwt, session, signIn

**Given** NextAuth configurado
**When** implemento lógica de autenticación
**Then** contraseña hasheada con bcryptjs (cost factor 10)
**And** usuario validado contra database Prisma
**And** session contiene: user.id, user.email, user.name, user.capabilities
**And** maxAge de sesión: 8 horas (NFR-S6)

**Given** lógica de autenticación implementada
**When** usuario intenta login con credenciales válidas
**Then** login exitoso y usuario redirigido a /dashboard
**And** session cookie creada con httpOnly y secure
**And** rate limiting aplicado: 5 intentos fallidos por IP en 15 minutos (NFR-S9)

**Given** usuario autenticado
**When** accede a ruta protegida sin capability adecuada
**Then** access denied automático (NFR-S4)
**And** redirect a /unauthorized con mensaje explicativo (NFR-S76)
**And** evento de acceso denegado logged en auditoría (NFR-S5)

**Given** usuario con contraseña temporal
**When** hace login por primera vez
**Then** redirigido a /change-password forzado (NFR-S72-A)
**And** no puede navegar a otras rutas hasta cambiar contraseña
**And** forcePasswordReset flag removido después de cambio exitoso

**Testability:**
- Server action `login()` exportada para usar en forms
- Server action `logout()` implementada
- Middleware de autenticación testable
- Mock auth provider disponible para tests

---

### Story 0.4: SSE Infrastructure con Heartbeat

Como desarrollador,
quiero implementar Server-Sent Events (SSE) infrastructure con heartbeat de 30s,
para soportar actualizaciones en tiempo real de OTs y KPIs.

**Acceptance Criteria:**

**Given** que NextAuth está configurado
**When** creo `/app/api/v1/sse/route.ts`
**Then** endpoint SSE acepta conexiones autenticadas
**And** cada conexión recibe evento 'heartbeat' cada 30 segundos (NFR-P3)
**And** soporta múltiples canales: 'work-orders', 'kpis', 'stock'
**And** reconnection automática si conexión perdida <30s (NFR-R4)

**Given** endpoint SSE implementado
**When** cliente se conecta con token válido
**Then** conexión aceptada y devuelta headers SSE correctos (Content-Type: text/event-stream)
**And** cliente recibe heartbeat inicial en <1s
**And** heartbeat continúa enviándose cada 30s mientras conexión activa

**Given** cliente conectado
**When** OT es actualizada por otro usuario
**Then** evento 'work-order-updated' enviado en <1s a todos los clientes conectados (NFR-R96)
**And** payload contiene: workOrderId, numero, estado, updatedAt
**And** correlational ID incluido para tracking (NFR-BLK-004)

**Given** cliente conectado
**When** KPIs son recalculados
**Then** evento 'kpis-updated' enviado dentro de los próximos 30s (NFR-R96, próximo heartbeat)
**And** payload contiene: mttr, mtbf, otsAbiertas, disponibilidad, timestamp

**Given** pérdida de conexión temporal
**When** cliente se reconecta en <30s
**Then** cliente recibe eventos perdidos desde última desconexión (replay buffer)
**And** conflict strategy aplicada: last-write-wins + merge (NFR-BLK-003)

**Testability:**
- Mock SSE layer disponible para tests (NFR-BLK-002)
- Fast-forward mode para tests de tiempo real
- Eventos de prueba enviados vía /api/test-data/sse/trigger
- Data testids definidos para conectores SSE

---

### Story 0.5: Error Handling, Observability y CI/CD

Como desarrollador,
quiero configurar error handling middleware, observability infrastructure y CI/CD pipeline,
para tener visibilidad de errores y deployments automatizados.

**Acceptance Criteria:**

**Given** que Next.js está configurado
**When** creo custom error classes
**Then** AppError (base) implementada
**And** ValidationError (400), AuthorizationError (403), InsufficientStockError (400), InternalError (500) definidas
**And** cada error tiene: code, message, details, timestamp, correlationId

**Given** custom errors definidas
**When** creo error handler middleware
**Then** middleware captura todas las excepciones
**And** errores logueados con structured logging (NFR-BLK-004)
**And** información sensible no expuesta en responses (NFR-S8)
**And** mensajes de error en castellano legible

**Given** error handler implementado
**When** configuro observability
**Then** structured logging con correlation IDs por request
**And** logs incluyen: timestamp, level, userId, action, error, correlationId
**And** logs enviados a stdout (Vercel compatible)
**And** performance tracking para queries lentas (>1s)

**Given** observability configurada
**When** configuro Vercel CI/CD
**Then** GitHub Integration conectada al repo
**And** preview deployments automáticos por PR
**And** deploy automático a main cuando PR es mergeado
**And** rollback 1-click disponible

**Given** CI/CD configurado
**When** configuro environment variables
**Then** DATABASE_URL configurada en Neon PostgreSQL
**And** NEXTAUTH_SECRET generado con crypto random
**And** variables documentadas en .env.example
**And** ambiente de desarrollo usa .env.local (gitignored)

**Testability:**
- Test data seeding APIs listas (NFR-BLK-001)
- Performance baseline configurada (NFR-BLK-005): k6 scripts preparados
- Multi-device sync conflict strategy documentada (NFR-BLK-003)
- Observability endpoints expuestos para monitoring

---

## Epic 1: Autenticación y Gestión de Usuarios (PBAC)

**Epic Goal:** Los usuarios pueden registrarse, hacer login, y los administradores pueden gestionar usuarios con control de acceso granular basado en 15 capacidades (PBAC).

### Story 1.1: Login, Registro y Perfil de Usuario

Como usuario del sistema,
quiero poder hacer login, registrarme (si soy administrador) y gestionar mi perfil,
para acceder al sistema y mantener mi información actualizada.

**Acceptance Criteria:**

**Given** que soy usuario registrado
**When** accedo a /login
**Then** veo formulario con inputs email y password
**And** inputs tienen 44px altura para tapping fácil (móvil)
**And** formulario tiene data-testid="login-form"
**And** email input tiene data-testid="login-email"
**And** password input tiene data-testid="login-password"
**And** botón submit tiene data-testid="login-submit"

**Given** formulario de login visible
**When** ingreso email y password válidos
**Then** login exitoso y redirigido a /dashboard en <3s
**And** veo mi nombre en header: "Hola, {nombre}"
**And** veo avatar con iniciales en esquina superior derecha
**And** recibo welcome toast o notification

**Given** que ingreso credenciales inválidas
**When** submito formulario
**Then** veo mensaje de error: "Email o contraseña incorrectos" en <1s
**And** mensaje mostrado inline con icono de error (rojo #EF4444)
**And** rate limiting aplicado después de 5 intentos (15 minutos block)

**Given** que soy administrador con capability can_manage_users
**When** accedo a /usuarios/nuevo
**Then** veo formulario de registro con campos: nombre, email, teléfono, role label
**And** puedo asignar credenciales temporales: usuario y password inicial
**And** checkbox groups para 15 capabilities visibles
**And** usuario nuevo creado con solo capability can_create_failure_report por defecto (NFR-S66)

**Given** que soy usuario con contraseña temporal (forcePasswordReset=true)
**When** hago login por primera vez
**Then** soy redirigido forzado a /cambiar-password
**And** no puedo navegar a otras rutas hasta cambiar contraseña (NFR-S72-A)
**And** veo mensaje: "Debes cambiar tu contraseña temporal en el primer acceso"
**And** formulario requiere: password actual, nueva password, confirmación

**Given** que estoy en /cambiar-password
**When** cambio contraseña exitosamente
**Then** forcePasswordReset flag actualizado a false
**And** redirigido a /dashboard
**And** recibo confirmación: "Contraseña cambiada exitosamente"

**Given** que estoy autenticado
**When** accedo a /perfil
**Then** veo mis datos: nombre, email, teléfono
**And** puedo editar nombre, email, teléfono
**And** puedo cambiar contraseña con formulario: contraseña actual, nueva, confirmación
**And** data-testid="perfil-form" presente
**And** data-testid="cambiar-password-form" presente

**Given** que soy administrador
**When** accedo a /usuarios/{id}
**Then** puedo editar información personal de cualquier usuario (NFR-S69-A)
**And** veo historial de actividad últimos 6 meses: login, cambios de perfil, acciones críticas (NFR-S72)
**And** veo historial de trabajos completo: OTs completadas, en progreso, MTTR, productividad (NFR-S72-C)
**And** puedo filtrar historial por rango de fechas

**Given** que soy administrador
**When** elimino un usuario
**Then** confirmación modal requerida: "¿Estás seguro de eliminar {nombre}?"
**And** usuario marcado como deleted (soft delete, no hard delete)
**And** usuario no puede hacer login después de eliminación
**And** auditoría logged: "Usuario {id} eliminado por {adminId}"

**Testability:**
- P0-035: Admin crea usuario con solo can_create_failure_report por defecto
- P0-036: Admin selecciona capabilities con checkboxes
- P0-037: Usuario sin can_manage_assets solo consulta (access denied)
- E2E test: Login → cambiar contraseña forzado → dashboard

---

### Story 1.2: Sistema PBAC con 15 Capacidades

Como administrador del sistema,
quiero asignar capacidades granulares a cada usuario,
para controlar exactamente qué puede y qué no puede hacer cada persona en el sistema.

**Acceptance Criteria:**

**Given** que estoy creando o editando un usuario
**When** veo el formulario de capabilities
**Then** las 15 capacidades se muestran como checkboxes con etiquetas en castellano (NFR-S68-UI)
**And** checkbox group tiene data-testid="capabilities-checkbox-group"
**And** cada capability tiene data-testid="capability-{name}" (ej: capability-can_view_kpis)
**And** labels legibles son:
  - ✅ Reportar averías (can_create_failure_report)
  - Crear OTs manuales (can_create_manual_ot)
  - Actualizar OTs propias (can_update_own_ot)
  - Ver OTs asignadas (can_view_own_ots)
  - Ver todas las OTs (can_view_all_ots)
  - Completar OTs (can_complete_ot)
  - Gestionar stock (can_manage_stock)
  - Asignar técnicos a OTs (can_assign_technicians)
  - Ver KPIs avanzados (can_view_kpis)
  - Gestionar activos (can_manage_assets)
  - Ver historial reparaciones (can_view_repair_history)
  - Gestionar proveedores (can_manage_providers)
  - Gestionar rutinas (can_manage_routines)
  - Gestionar usuarios (can_manage_users)
  - Recibir reportes automáticos (can_receive_reports)

**Given** formulario de capabilities visible
**When** creo un nuevo usuario
**Then** usuario nuevo tiene ÚNICAMENTE can_create_failure_report seleccionado por defecto (NFR-S66)
**And** las otras 14 capabilities están desmarcadas por defecto
**And** solo usuarios con can_manage_users pueden ver y modificar capabilities

**Given** que estoy editando un usuario
**When** asigno o removo capabilities
**Then** cambios aplicados inmediatamente en próxima sesión del usuario
**And** auditoría logged: "Capabilities actualizadas para usuario {id} por {adminId}"
**And** sesión actual del usuario actualizada si el usuario se está editando a sí mismo (con restricciones)

**Given** usuario sin capability can_manage_assets
**When** intenta acceder a /activos
**Then** acceso denegado con mensaje: "No tienes permiso para gestionar activos" (NFR-S76)
**And** modo solo lectura activado si tiene capability de consulta
**And** no puede crear, editar ni eliminar equipos
**And** auditoría logged: "Access denied a /activos para usuario {id}"

**Given** usuario sin capability can_view_repair_history
**When** intenta acceder al historial de reparaciones de un equipo
**Then** acceso denegado con mensaje explicativo (NFR-S68-B)
**And** no ve OTs completadas, patrones de fallas, métricas de confiabilidad
**And** auditoría logged: "Access denied a historial reparaciones para usuario {id}"

**Given** que soy el administrador inicial (primer usuario creado)
**When** consulto mis capabilities
**Then** tengo las 15 capabilities del sistema asignadas por defecto (NFR-S68-C)
**And** soy el único usuario con capabilities preasignadas además de can_create_failure_report
**And** ningún otro usuario creado posteriormente tiene capabilities preasignadas

**Given** que estoy en el dashboard
**When** navego por la aplicación
**Then** solo veo módulos en navegación para los que tengo capabilities asignadas (NFR-S74)
**And** módulos sin capabilities no aparecen en navigation
**And** si intento acceder por URL directa a módulo no autorizado, recibo access denied (NFR-S75)

**Testability:**
- P0-045: Las 15 capacidades funcionan correctamente (E2E test suite completa)
- P0-037: Usuario sin capabilities appropriate solo ve modo lectura
- Test de access denied para cada uno de los 15 capabilities
- Validación de que capabilities se almacenan correctamente en DB

---

### Story 1.3: Etiquetas de Clasificación y Organización

Como administrador del sistema,
quiero crear y asignar etiquetas de clasificación a usuarios (ej: Operario, Técnico, Supervisor),
para organizar visualmente a las personas sin afectar sus capacidades de acceso.

**Acceptance Criteria:**

**Given** que soy administrador con capability can_manage_users
**When** accedo a /usuarios/etiquetas
**Then** puedo crear hasta 20 etiquetas de clasificación personalizadas (NFR-S59)
**And** cada etiqueta tiene: nombre (ej: "Operario", "Técnico", "Supervisor"), color seleccionable, descripción opcional
**And** formulario tiene data-testid="crear-etiqueta-form"
**And** input nombre tiene data-testid="etiqueta-nombre"

**Given** que he creado etiquetas
**When** asigno etiquetas a un usuario
**Then** puedo asignar una o más etiquetas simultáneamente (NFR-S62)
**And** selecciono etiquetas con checkboxes o multi-select
**And** etiquetas mostradas en perfil de usuario como badges/tags visuales
**And** data-testid="usuario-etiquetas" presente en vista de detalle

**Given** que veo la lista de usuarios
**When** etiquetas están asignadas
**Then** puedo ver etiquetas como tags en cada usuario de la lista
**And** puedo filtrar usuarios por etiqueta
**And** puedo ordenar lista por etiqueta
**And** etiquetas sirven solo para organización visual (NFR-S67-A)

**Given** que estoy asignando capabilities
**When** asigno o removo capabilities
**Then** las etiquetas de clasificación NO otorgan ni removen capabilities (NFR-S67-A)
**And** una misma etiqueta NO otorga las mismas capacidades a todos los usuarios que la tienen (NFR-S67-B)
**And** capabilities y etiquetas son completamente independientes
**And** UI muestra mensaje clarificador: "Las etiquetas son solo para organización visual y no afectan los permisos"

**Given** que soy administrador
**When** elimino una etiqueta
**Then** confirmación modal requerida: "¿Eliminar etiqueta {nombre}? Esta acción no afecta las capabilities de los usuarios."
**And** etiqueta removida de todos los usuarios que la tenían asignada
**And** auditoría logged: "Etiqueta {id} eliminada por {adminId}"
**And** etiqueta deja de aparecer en lista de etiquetas disponibles

**Given** que estoy editando un usuario
**When** asigno o quito etiquetas
**Then** cambios aplicados inmediatamente
**And** usuario actualizado refleja nuevas etiquetas
**And** navegación por etiquetas actualizada en tiempo real
**And** no hay límite de cuántas etiquetas puede tener un usuario

**Given** que he creado 20 etiquetas
**When** intento crear una etiqueta número 21
**Then** veo mensaje de error: "Has alcanzado el máximo de 20 etiquetas personalizadas"
**And** botón de crear deshabilitado
**And** sugerencia: "Elimina etiquetas existentes antes de crear nuevas"

**Testability:**
- P0 test: Crear etiqueta, asignar a usuario, verificar que no otorga capabilities
- P0 test: Asignar misma etiqueta a 2 usuarios con diferentes capabilities, verificar independencia
- P0 test: Eliminar etiqueta, verificar que usuarios mantienen sus capabilities
- E2E test: Filtrar usuarios por etiqueta en lista

---

## Epic 2: Gestión de Averías y Reportes Rápidos

**Epic Goal:** Los operarios pueden reportar averías en menos de 30 segundos con búsqueda predictiva de equipos, y los supervisores pueden triagear y convertir los reportes en órdenes de trabajo.

### Story 2.1: Búsqueda Predictiva de Equipos

Como operario reportando una avería,
quiero buscar equipos mediante búsqueda predictiva que muestre resultados en menos de 200ms,
para encontrar rápidamente el equipo que tiene la falla y reportarla.

**Acceptance Criteria:**

**Given** que estoy en el formulario de reporte de avería
**When** digito en el input de búsqueda de equipo
**Then** resultados de búsqueda predictiva aparecen en <200ms (NFR-P1, R-001 P95)
**And** input tiene data-testid="equipo-search"
**And** input tiene placeholder "Buscar equipo..." (16px font-size)
**And** input tiene 44px altura para tapping fácil en móvil

**Given** que he digitado "prensa"
**When** se muestran resultados del autocomplete
**Then** cada resultado muestra: nombre del equipo, jerarquía completa (ej: "HiRock → Línea 1 → Prensas")
**And** resultados con tag de división HiRock (#FFD700) o Ultra (#8FBC8F)
**And** máximo 10 resultados mostrados
**And** resultados destacados con borde izquierdo rojo burdeos #7D1220

**Given** resultados de autocomplete visibles
**When** selecciono un equipo
**Then** input se completa con nombre del equipo seleccionado
**And** equipoId almacenado en estado del formulario
**And** búsqueda predictiva se cierra

**Given** que hay 10,000+ activos en el sistema
**When** realizo búsqueda
**Then** búsqueda predictiva se completa en <200ms P95 (R-001, NFR-P1)
**And** no hay degradación perceptible de performance
**And** índices de database optimizados para consultas de nombre
**And** query utiliza LIMIT 10 para no sobrecargar

**Given** que no hay resultados para mi búsqueda
**When** he digitado al menos 3 caracteres
**Then** mensaje mostrado: "No se encontraron equipos. Intenta con otra búsqueda."
**And** no se muestra spinner de carga (resultados instantáneos)

**Given** que selecciono un equipo
**When** continúo con el formulario
**Then** puedo ver el equipo seleccionado como tag o badge
**And** puedo cambiar el equipo seleccionado haciendo click en "x" para limpiar
**And** jerarquía del equipo seleccionado permanece visible como referencia

**Testability:**
- P0-001: Búsqueda predictiva de equipo en <30 segundos (end-to-end)
- P0-062: k6 load test con 10K activos, P95 <200ms
- Test de performance con database de 10,000 equipos
- E2E test: Buscar "prensa", seleccionar "Prensa PH-500", verificar equipoId correcto

---

### Story 2.2: Formulario Reporte de Avería (Mobile First)

Como operario en el piso de fábrica,
quiero reportar una avería en menos de 30 segundos desde mi móvil,
para notificar rápidamente sobre cualquier falla en los equipos.

**Acceptance Criteria:**

**Given** que accedo a /averias/nuevo desde móvil (<768px)
**When** carga el formulario
**Then** veo CTA primario "+ Reportar Avería" prominente (rojo burdeos #7D1220, padding 16px, altura 56px) (NFR-S6, UX Dirección 6 Action Oriented)
**And** CTA tiene data-testid="averia-submit"
**And** formulario usa layout Mobile First (UX Dirección 3)

**Given** formulario visible en móvil
**When** lo completo end-to-end
**Then** puedo completar reporte en <30 segundos (NFR-P2, objetivo "Reportar avería en 30 segundos")
**And** formulario optimizado para tapping rápido

**Given** que completo el formulario
**When** lleno el campo de equipo
**Then** búsqueda predictiva funciona (ver Story 2.1)
**And** validación: equipo es requerido
**And** si intento submit sin equipo, veo error: "Debes seleccionar un equipo" (NFR-S2)

**Given** que he seleccionado un equipo
**When** lleno descripción del problema
**Then** input es textarea con placeholder "Describe brevemente la falla..."
**And** descripción es marcada como opcional en el label
**And** textarea tiene data-testid="averia-descripcion"
**And** textarea tiene altura mínima 80px, máxima 200px

**Given** que descripción está vacía
**When** intento submit el formulario
**Then** validación rechaza el formulario (NFR-S2, P0-002)
**And** mensaje de error inline: "La descripción es obligatoria"
**And** campo marcado con borde rojo #EF4444

**Given** que he llenado descripción
**When** subo una foto
**Then** botón "Adjuntar foto" visible con dashed border
**And** botón tiene data-testid="averia-foto-upload"
**And** foto es opcional (NFR-S3)
**And** si subo foto, veo preview antes de submit
**And** foto subida a storage y URL almacenada

**Given** que he completado el formulario
**When** subo el reporte
**Then** recibo confirmación con número de aviso generado en <3 segundos (NFR-S5)
**And** confirmación muestra: "Avería #{numero} reportada exitosamente"
**And** redirect a /mis-avisos o dashboard
**And** notificación push enviada a usuarios can_view_all_ots en <30s (NFR-S4, R-002)

**Given** que estoy en desktop (>1200px)
**When** accedo a /averias/nuevo
**Then** formulario usa layout Desktop (UX Dirección 1 o 6)
**And** dos columnas: izquierda (equipo + descripción), derecha (foto + preview)
**And** mismo esquema de validación y submit que móvil

**Testability:**
- P0-001 a P0-004: Flujo completo de reporte de avería
- E2E test mobile: Login → reportar avería → confirmación número
- Test de validación: descripción vacía rechazada
- Test de notificación SSE recibida en <30s (P0-004)

---

### Story 2.3: Triage de Averías y Conversión a OTs

Como supervisor con capability can_view_all_ots,
quiero ver los avisos nuevos en una columna de triage y convertirlos en OTs,
para priorizar y asignar rápidamente las averías reportadas.

**Acceptance Criteria:**

**Given** que soy supervisor con capability can_view_all_ots
**When** accedo a /averias/triage
**Then** veo columna "Por Revisar" con todos los avisos nuevos (NFR-S7)
**And** cada aviso mostrado como tarjeta con: número, equipo, descripción, reportado por, fecha/hora
**And** tarjetas de avería tienen color rosa #FFC0CB (NFR-S10)
**And** tarjetas de reparación tienen color blanco #FFFFFF (NFR-S10)
**And** columna tiene data-testid="averias-triage"

**Given** que veo la lista de avisos
**When** hago click en un aviso
**Then** modal informativo se abre con detalles completos
**And** modal tiene data-testid="modal-averia-info"
**And** modal muestra: foto (si existe), descripción completa, equipo con jerarquía, reporter, timestamp
**And** modal tiene botones de acción: "Convertir a OT", "Descartar"

**Given** modal de avería abierto
**When** click "Convertir a OT"
**Then** aviso convertido a Orden de Trabajo en <1s
**And** OT creada con estado "Pendiente"
**And** tipo de OT marcado como "Correctivo" (NFR-S11-A)
**And** etiqueta "Correctivo" visible en tarjeta OT (NFR-S11-B)
**And** OT aparece en Kanban columna "Pendiente" (o "Por Aprobar" si requiere aprobación)
**And** notificación SSE enviada a técnicos asignados en <30s (NFR-S4)

**Given** modal de avería abierto
**When** click "Descartar"
**Then** confirmación modal: "¿Descartar aviso #{numero}? Esta acción no se puede deshacer."
**And** si confirmo, aviso marcado como "Descartado"
**And** ya no aparece en columna "Por Revisar"
**And** auditoría logged: "Avería {id} descartada por {userId}"
**And** reporter notificado vía SSE que su aviso fue descartado

**Given** que hay múltiples avisos en triage
**When** realizo acciones
**Then** puedo ver indicador de count en columna: "Por Revisar (3)"
**And** puedo filtrar avisos por: fecha, reporter, equipo
**And** puedo ordenar por: fecha (más reciente primero), prioridad
**And** cambios se sincronizan en tiempo real vía SSE

**Given** que un operario confirma que una reparación no funciona
**When** reporta rechazo de reparación
**Then** se genera una OT de re-trabajo con prioridad alta (NFR-S101)
**And** OT vinculada a la OT original
**And** notificación enviada a supervisor para revisión

**Testability:**
- P0-007 a P0-009: Triage de averías y conversión a OTs
- P0-010: Distinguir visualmente avería (rosa) vs reparación (blanco)
- E2E test: Supervisor ve aviso → convierte a OT → OT aparece en Kanban
- Test de sincronización SSE entre triage y Kanban

---

## Epic 3: Órdenes de Trabajo (Kanban Multi-Dispositivo)

**Epic Goal:** Los técnicos pueden ver y actualizar OTs asignadas, los supervisores pueden gestionar el Kanban de 8 columnas con drag & drop, y todo se sincroniza en tiempo real entre dispositivos y vistas.

### Story 3.1: Kanban de 8 Columnas con Drag & Drop

Como supervisor de mantenimiento,
quiero ver todas las OTs en un tablero Kanban de 8 columnas con drag & drop,
para tener control visual inmediato del estado de todas las órdenes de trabajo.

**Acceptance Criteria:**

**Given** que soy supervisor con capability can_view_all_ots
**When** accedo a /ots/kanban en desktop (>1200px)
**Then** veo Kanban de 8 columnas completas (UX Dirección 2 Kanban First)
**And** columnas en orden: Por Revisar (#6B7280), Por Aprobar (#F59E0B), Aprobada (#3B82F6), En Progreso (#8B5CF6), Pausada (#EC4899), Completada (#10B981), Cerrada (#6B7280), Cancelada (#EF4444)
**And** cada columna tiene count badge: "En Progreso (8)"
**And** board tiene data-testid="ot-kanban-board"

**Given** Kanban visible en desktop
**When** veo las OT cards
**Then** cada tarjeta tiene: número OT, título/descripción, equipo, tags división, técnicos asignados, fecha límite
**And** tarjeta tiene borde izquierdo coloreado según estado (4px solid)
**And** tarjeta tiene data-testid="ot-card-{id}"
**And** tarjeta mostrada como tag de división HiRock (#FFD700) o Ultra (#8FBC8F)

**Given** que arrastro una OT card
**When** la suelto en otra columna (drag & drop)
**Then** estado de OT actualizado en <1s
**And** tarjeta movida a nueva columna visualmente
**And** evento SSE enviado a todos los clientes conectados (NFR-S96, R-002)
**And** auditoría logged: "OT {id} movida de {estadoAnterior} a {estadoNuevo} por {userId}"

**Given** que accedo a /ots/kanban en tablet (768-1200px)
**Then** veo 2 columnas visibles con swipe horizontal
**And** indicador de cuales columnas están visibles: "1-2 de 8"
**Then** puedo hacer swipe para ver más columnas
**And** panel lateral KPIs colapsable visible (UX Dirección 2)

**Given** que accedo a /ots/kanban en móvil (<768px)
**Then** vista Mobile First optimizada (UX Dirección 3)
**And** 1 columna visible con swipe horizontal
**And** OT cards simplificadas (menos información, más grande para tapping)
**And** touch targets de 44x44px mínimo (NFR-A3)

**Given** que estoy en móvil
**When** toco una OT card
**Then** modal de detalles se abre (no drag & drop en móvil)
**And** modal tiene botones de acción: "Iniciar", "Completar", "Ver Detalles"
**And** puedo cambiar estado desde el modal

**Given** Kanban visible en cualquier dispositivo
**When** hay OTs de diferentes tipos
**Then** OTs preventivas muestran etiqueta "Preventivo" en verde #28A745 (NFR-S11-B)
**And** OTs correctivas muestran etiqueta "Correctivo" en rojizo #DC3545 (NFR-S11-B)
**And** etiqueta visible en tarjeta y en vista de listado

**Given** que alternan entre vista Kanban y listado
**When** hago toggle entre vistas
**Then** sincronización mantenida: cambios en Kanban reflejados en Listado y viceversa (NFR-S31)
**And** preferencia de vista guardada por usuario
**And** toggle tiene data-testid="vista-toggle"

**Testability:**
- P0-012 a P0-015: Flujo de actualización de OTs
- P0-019: Notificaciones SSE a todos los asignados
- E2E test: Drag OT de "Pendiente" a "En Progreso" → verificar SSE
- Test responsive desktop/tablet/móvil

---

### Story 3.2: Gestión de OTs Asignadas (Mis OTs)

Como técnico de mantenimiento,
quiero ver solo las OTs que me han sido asignadas y poder actualizarlas (iniciar, agregar repuestos, completar),
para gestionar mi trabajo de forma eficiente y enfocada.

**Acceptance Criteria:**

**Given** que soy técnico con capability can_view_own_ots
**When** accedo a /mis-ots
**Then** veo lista de OTs donde estoy asignado
**And** si estoy en móvil, veo bottom nav tab "Mis OTs"
**And** lista tiene data-testid="mis-ots-lista"
**And** cada OT muestra: número, estado, equipo, fecha asignación

**Given** lista de Mis OTs visible
**When** toco una OT asignada
**Then** modal de detalles se abre con acciones disponibles
**And** modal tiene data-testid="ot-detalles-{id}"
**And** puedo ver: descripción completa, equipo, repuestos sugeridos, fecha límite

**Given** modal de OT abierta
**When** la OT está en estado "Asignada"
**Then** puedo click botón "Iniciar OT" (data-testid="ot-iniciar-btn")
**And** estado cambia a "En Progreso" en <1s
**And** botón "Iniciar" reemplazado por "Completar"
**And** evento SSE enviado a todos los usuarios asignados en <30s (NFR-S19)
**And** tarjeta OT movida a columna "En Progreso" en Kanban

**Given** OT en estado "En Progreso"
**When** agrego repuestos usados
**Then** dropdown de repuestos visible (data-testid="repuesto-select")
**And** dropdown muestra: nombre repuesto, stock actual, ubicación
**Then** selecciono repuesto y cantidad
**And** stock del repuesto actualizado en tiempo real <1s (NFR-S16, R-011)
**And** lista de repuestos usados actualizada con data-testid="repuestos-usados-list"
**And** no se envía notificación a usuarios can_manage_stock (actualizaciones silenciosas, NFR-S16)

**Given** que he agregado repuestos usados
**When** completo la OT
**Then** botón "Completar OT" visible (data-testid="ot-completar-btn")
**Then** confirmación requerida: "¿Completar OT #{numero}? Verifica que la reparación funciona correctamente."
**And** si confirmo, estado cambia a "Completada"
**And** fecha completedAt registrada con timestamp
**And** evento SSE enviado a todos los asignados

**Given** OT completada
**When** el operario verifica la reparación
**Then** puede confirmar si funciona o no (NFR-S5)
**Then** si NO funciona, se genera OT de re-trabajo con prioridad alta (NFR-S101)
**And** si funciona, OT marcada como "Verificada"
**And** operario recibe confirmación con número de aviso

**Given** OT en progreso
**When** agrego comentarios
**Then** input de comentario visible con textarea
**Then** comentario agregado con timestamp (NFR-S106)
**Then** comentarios visibles en modal de detalles
**Then** notificación SSE enviada a otros asignados

**Given** OT en progreso
**When** adjunto fotos antes/después de reparación (NFR-S107)
**Then** botón "Adjuntar foto antes" visible
**Then** botón "Adjuntar foto después" visible
**Then** fotos subidas a storage y URLs almacenadas
**Then** preview visible en modal de detalles

**Testability:**
- P0-012 a P0-015, P0-019: Flujo completo de OT asignada
- P0-013: Agregar repuestos usados con validación de stock
- P0-011: Race condition de stock (optimistic locking)
- E2E test: Técnico inicia OT → agrega repuestos → completa → notificación SSE

---

### Story 3.3: Asignación de Técnicos y Proveedores

Como supervisor con capability can_assign_technicians,
quiero asignar 1-3 técnicos internos o proveedores externos a cada OT,
para distribuir el trabajo de mantenimiento según habilidades y disponibilidad.

**Acceptance Criteria:**

**Given** que estoy creando o editando una OT
**When** accedo a la sección de asignaciones
**Then** puedo seleccionar de 1 a 3 técnicos internos (NFR-S17)
**Then** o puedo seleccionar 1 proveedor externo (NFR-S18)
**Then** filtros disponibles: habilidades, ubicación, disponibilidad
**Then** lista de técnicos tiene data-testid="tecnicos-select"
**Then** lista de proveedores tiene data-testid="proveedores-select"

**Given** que estoy asignando técnicos
**When** filtro por habilidades
**Then** solo técnicos con skill relevante mostrados (ej: "Electricista" para work orden eléctrico)
**Then** checkbox groups para skills: "Eléctrica", "Mecánica", "Hidráulica", etc.

**Given** que selecciono múltiples técnicos
**When** guardo la asignación
**Then** todos los técnicos asignados reciben notificación SSE en <30s (NFR-S19, R-002)
**Then** cada técnico puede ver la OT en "Mis OTs"
**Then** cualquiera de los asignados puede iniciar la OT (NFR-S19-A)
**Then** cualquiera de los asignados puede agregar repuestos usados
**Then** cualquiera de los asignados puede completar la OT

**Given** OT con múltiples asignados
**When** veo la OT en vista de listado
**Then** columna "Asignaciones" muestra distribución (NFR-S21)
**Then** formato: "2 técnicos / 1 proveedor" o "1 técnico" o "2 técnicos"
**Then** nombres de asignados visibles en modal de detalles

**Given** que asigno un proveedor externo
**When** proveedor marca OT como completada
**Then** supervisor recibe notificación: "Proveedor {nombre} marcó OT #{numero} como completada"
**Then** supervisor debe confirmar recepción del equipo reparado (NFR-S24-A)
**Then** confirmación requiere verificación visual del estado del reparado
**Then** solo después de confirmación, OT marcada como "Completada"

**Given** que asigno técnicos
**When** filtro técnicos por ubicación
**Then** solo técnicos en misma área fábrica mostrados
**Then** ubicaciones: "Planta HiRock", "Planta Ultra", "Taller", "Almacén"

**Given** que veo distribución de asignados
**When** un técnico está sobrecargado (5+ OTs asignadas)
**Then** indicador visual de sobrecarga visible (badge rojo)
**Then** tooltip: "Este técnico tiene 5 OTs asignadas"

**Testability:**
- P0-019: Asignar múltiples usuarios, todos reciben notificación
- P0-019-A: Cualquiera de los asignados puede actualizar OT
- E2E test: Asignar 2 técnicos → verificar que ambos reciben notificación
- Test de sincronización SSE entre asignados

---

### Story 3.4: Vista de Listado con Filtros y Sync Real-time

Como supervisor con capability can_view_all_ots,
quiero ver todas las OTs en una vista de listado con filtros avanzados,
para encontrar rápidamente órdenes específicas y realizar acciones en lote.

**Acceptance Criteria:**

**Given** que soy supervisor con capability can_view_all_ots
**When** accedo a /ots/lista
**Then** veo tabla con todas las OTs de la organización (NFR-S21)
**Then** tabla tiene columnas: Número, Equipo, Estado, Tipo, Asignados, Fecha Creación, Acciones
**Then** tabla tiene data-testid="ots-lista-tabla"
**Then** paginación: 100 OTs por página (NFR-SC4)

**Given** vista de listado visible
**When** aplico filtros
**Then** puedo filtrar por 5 criterios: estado, técnico, fecha, tipo, equipo (NFR-S27)
**Then** filtro de estado: dropdown con 8 estados posibles
**Then** filtro de técnico: búsqueda predictiva de usuarios
**Then** filtro de fecha: range picker (fecha inicio, fecha fin)
**Then** filtro de tipo: Preventivo/Correctivo (NFR-S11-A)
**Then** filtros combinados con AND lógica

**Given** filtros aplicados
**When** ordeno por cualquier columna (NFR-S28)
**Then** orden ascendente/descendente toggle
**Then** indicador visual de columna ordenada (icono ↑/↓)
**Then** sorting mantenido cuando cambio de página

**Given** lista filtrada
**When** realizo acciones
**Then** mismas acciones disponibles que en Kanban (NFR-S29)
**Then** puedo: asignar técnicos, cambiar estado, agregar comentarios, ver detalles
**Then** acciones en lote disponibles para OTs seleccionadas (checkbox)

**Given** lista visible
**When** hago toggle a vista Kanban
**Then** mismos filtros y sorting aplicados en Kanban (NFR-S30)
**Then** sincronización en tiempo real entre vistas (NFR-S31)
**Then** cambios en Kanban reflejados en Listado instantáneamente vía SSE
**Then** cambios en Listado reflejados en Kanban instantáneamente vía SSE

**Given** que hago click en "Ver Detalles" de una OT
**Then** modal informativo se abre con detalles completos (NFR-S24)
**Then** modal tiene data-testid="modal-ot-info-{id}"
**Then** muestra: fechas (creación, asignación, última actualización), origen (avería/rutina/manual), técnicos asignados, repuestos usados, comentarios
**Then** modal puede cerrarse con click en "X", ESC key, o click fuera

**Given** modal de detalles abierto
**When** OT fue creada desde avería
**Then** link a avería original visible
**Then** puedo ver datos del avería: reporter, descripción, foto

**Given** modal de detalles abierto
**When** OT fue creada desde rutina
**Then** link a rutina visible
**Then** puedo ver: frecuencia, tareas, técnico responsable

**Testability:**
- P1-004 a P1-005: Filtros y toggle Kanban ↔ Listado
- P0-031: Sincronización en tiempo real entre vistas
- E2E test: Filtrar por estado → ordenar por fecha → toggle Kanban → verificar mismos filtros
- Test de performance: 100 OTs cargan en <500ms (NFR-SC4)

---

## Epic 4: Gestión de Activos y Jerarquía de 5 Niveles

**Epic Goal:** Los usuarios pueden navegar y gestionar la jerarquía de activos de 5 niveles, ver historial de reparaciones, e importar activos masivamente desde CSV.

### Story 4.1: Navegación Jerárquica de 5 Niveles

Como usuario con capability can_view_own_ots o can_manage_assets,
quiero navegar la jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto),
para encontrar cualquier activo en la organización y ver su información.

**Acceptance Criteria:**

**Given** que accedo a /activos
**When** veo la vista principal
**Then** lista de Plantas mostrada (nivel 1)
**Then** cada Planta muestra: nombre, código, división (HiRock/Ultra), count de Líneas
**Then** tag de división HiRock con fondo #FFD700
**Then** tag de división Ultra con fondo #8FBC8F
**Then** jerarquía navegable con data-testid="activo-jerarquia-nav"

**Given** lista de Plantas visible
**When** click en una Planta
**Then** navega a vista de Líneas (nivel 2)
**Then** breadcrumb visible: "Activos > HiRock > Línea 1" (UX Dirección 1)
**Then** puedo volver a nivel anterior haciendo click en breadcrumb

**Given** que estoy en nivel Línea
**When** veo la lista
**Then** cada Línea muestra: nombre, código, count de Equipos
**Then** puedo ver Equipos y navegar a nivel 3

**Given** que estoy en nivel Equipo
**When** veo la lista
**Then** cada Equipo muestra: nombre, código, estado (Operativo, Averiado, En Reparación, Retirado, Bloqueado), ubicación actual, count de Componentes
**Then** estado mostrado como badge con color semántico
**Then** puedo ver Componentes y navegar a nivel 4

**Given** que estoy en nivel Componente
**When** veo la lista
**Then** cada Componente muestra: nombre, código, count de Repuestos, equipos asociados
**Then** si Componente asociado a múltiples equipos, todos mostrados (NFR-S34, R-013)
**Then** relación muchos-a-muchos visible (R-013)

**Given** que estoy en nivel Repuesto
**When** veo la lista
**Then** cada Repuesto muestra: nombre, código, stock, ubicación física almacén

**Given** que estoy en cualquier nivel
**When** puedo navegar en cualquier dirección (NFR-S33)
**Then** hacia abajo (drill-down): click en item para ver hijos
**Then** hacia arriba (roll-up): breadcrumb navigation
**Then** búsqueda global permite saltar a cualquier nivel directamente

**Given** que estoy en vista de Equipo
**When** veo equipos reutilizables
**Then** stock de equipos completos mostrado con contador por estado (NFR-S38)
**Then** estados: Disponible, En Uso, En Reparación, Descartado
**Then** count formato: "Disponible: 3, En Uso: 5, En Reparación: 1"

**Given** que estoy en vista de Equipo
**When** veo ubicación actual (NFR-S39)
**Then** ubicación mostrada como: área de fábrica, último técnico con custodia, o estado de reserva
**Then** formato: "Área: Planta HiRock - Línea 1, Custodia: Técnico María G."
**Then** puedo ver historial de custodia en timeline

**Testability:**
- NFR-P1: Búsqueda de equipos en jerarquía <200ms con 10K activos
- R-001: Performance test con 10,000 activos
- E2E test: Navegar Planta → Línea → Equipo → Componente → Repuesto
- Test de muchos-a-muchos: Componente asociado a 3 equipos

---

### Story 4.2: Historial de Reparaciones y Estados

Como usuario con capability can_view_repair_history,
quiero ver el historial completo de reparaciones de un equipo,
para entender patrones de fallas, MTTR, y confiabilidad del equipo.

**Acceptance Criteria:**

**Given** que estoy en vista de detalles de Equipo
**When** accedo a pestaña "Historial de Reparaciones"
**Then** lista de todas las OTs completadas mostrada (NFR-S35)
**Then** cada OT muestra: número, tipo (Preventivo/Correctivo), fecha completada, técnico(s), repuestos usados, duración
**Then** timeline ordenado por fecha (más reciente primero)
**Then** paginación: 20 OTs por página

**Given** historial visible
**When** no tengo capability can_view_repair_history
**Then** acceso denegado con mensaje: "No tienes permiso para ver el historial de reparaciones" (NFR-S68-B)
**Then** redirect a vista de Equipo (modo solo lectura si tengo can_view_own_ots)
**Then** auditoría logged

**Given** historial visible
**When** tengo capability can_view_repair_history
**Then** puedo ver métricas agregadas: MTTR promedio, MTBF, count de fallas en últimos 30 días, costo total mantenimiento
**Then** métricas calculadas en tiempo real
**Then** gráfico de tendencias de fallas visible (opcional)

**Given** que soy usuario con capability can_manage_assets
**When** quiero cambiar estado de un equipo (NFR-S36, NFR-S37)
**Then** dropdown de estados disponible: Operativo, Averiado, En Reparación, Retirado, Bloqueado
**Then** cambio de estado requiere motivo obligatorio (textarea)
**Then** confirmación modal: "¿Cambiar estado de {equipo} a {nuevoEstado}?"
**Then** si confirmo, estado actualizado y auditoría logged

**Given** que soy usuario sin capability can_manage_assets
**When** intento cambiar estado de equipo
**Then** botones de acción no visibles (UI adaptativa, NFR-S73)
**Then** veo mensaje: "Modo solo lectura - Contacta a un administrador para gestionar activos"
**Then** solo puedo consultar: ver jerarquía, historial de OTs, estados

**Given** que estoy en vista de Equipo
**When** un equipo está en estado "Averiado"
**Then** indicador visual prominente (badge rojo)
**Then** OT abierta asociada visible (si existe)
**Then** puedo click para ver detalles de la OT

**Testability:**
- P0 test: Usuario sin can_view_repair_history recibe access denied
- P0 test: Usuario sin can_manage_assets ve modo solo lectura
- E2E test: Ver historial → cambiar estado → verificar auditoría
- Test de performance: Historial con 100+ OTs carga en <2s

---

### Story 4.3: Importación Masiva de Activos CSV

Como administrador con capability can_manage_assets,
quiero importar miles de activos desde un archivo CSV,
para cargar masivamente la jerarquía de activos sin crearlos manualmente uno por uno.

**Acceptance Criteria:**

**Given** que soy administrador con capability can_manage_assets
**When** accedo a /activos/importar
**Then** veo botón "Descargar Plantilla" (NFR-S43)
**Then** plantilla CSV tiene columnas: Nivel, Nombre, Código, División (opcional), Padre (código o vacío), Estado (para equipos), Ubicación (para equipos), Stock (para repuestos)
**Then** botón tiene data-testid="descargar-plantilla-btn"

**Given** plantilla descargada
**When** completo el CSV con datos de activos
**Then** cada fila representa un activo en la jerarquía
**Then** columnas requeridas marcadas con *
**Then** ejemplo de filas:
  - Nivel=1, Nombre="Planta HiRock", Código="PHI", División="HiRock", Padre=""
  - Nivel=2, Nombre="Línea 1", Código="L1", División="", Padre="PHI"
  - Nivel=3, Nombre="Prensa PH-500", Código="PH-500", Estado="Operativo", Padre="L1"

**Given** CSV completado
**When** hago upload del archivo
**Then** file input acepta solo .csv
**Then** validación inicial: formato CSV válido, columnas requeridas presentes
**Then** data-testid="importar-activos-upload"

**Given** archivo upload válido
**When** proceso inicia
**Then** estructura jerárquica validada automáticamente (NFR-S41)
**Then** validaciones: cada nivel 1-5 válido, padres existen o están vacíos (solo para nivel 1), códigos únicos por nivel
**Then** si hay errores de estructura, importación detenida y errores reportados

**Given** validación de estructura exitosa
**When** importación en proceso
**Then** progress bar muestra: "Procesando fila X de Y..."
**Then** 10,000 activos importados en <5 minutos (NFR-S7)
**Then** transacción usada: todo o nada (si hay error, rollback completo)

**Given** importación completada
**When** veo reporte de resultados (NFR-S42, NFR-S56)
**Then** resumen mostrado: "Exitosos: X, Errores: Y, Advertencias: Z"
**Then** errores listados con fila número y motivo
**Then** advertencias listadas (ej: código duplicado, usando fallback)
**Then** puedo descargar reporte en CSV para corrección

**Given** importación con errores
**When** corrijo el CSV
**Then** puedo re-importar solo las filas que fallaron
**Then** o puedo re-importar todo (con sobrescritura)
**Then** opción seleccionable en modal de re-importación

**Testability:**
- P0 test: Validación de estructura jerárquica con CSV válido
- P0 test: Validación de estructura con CSV inválido (padre no existe)
- E2E test: Importar 100 activos → verificar count correcto → ver en jerarquía
- Performance test: Importar 10,000 activos en <5 minutos (NFR-S7)

---

## Epic 5: Gestión de Repuestos, Stock y Proveedores

**Epic Goal:** Los usuarios pueden gestionar stock de repuestos con actualización en tiempo real y alertas automáticas de stock mínimo, y gestionar el catálogo de proveedores de mantenimiento y repuestos.

### Story 5.1: Catálogo de Repuestos y Stock

Como usuario del sistema,
quiero consultar el catálogo de repuestos y ver el stock actual en tiempo real,
para saber qué repuestos están disponibles y dónde están ubicados.

**Acceptance Criteria:**

**Given** que accedo a /repuestos (no requiere capability, NFR-S44)
**When** veo el catálogo
**Then** lista de todos los repuestos mostrada en modo consulta
**Then** cada repuesto muestra: nombre, código, stock actual, ubicación física, proveedores asociados
**Then** stock actualizado en tiempo real (NFR-S45, NFR-S47)
**Then** ubicación física mostrada: "Estante A3 - Pasillo 2" (NFR-S46)
**Then** stock mínimo visible con indicador si está bajo

**Given** catálogo visible
**When** stock de repuesto está en mínimo
**Then** badge/alerta visible: "Stock mínimo: X unidades (mínimo: Y)" (NFR-S50)
**Then** alerta en color rojo #EF4444 o ámbar #F59E0B
**Then** alerta solo visible para usuarios con capability can_manage_stock (NFR-S50)

**Given** que soy usuario con capability can_manage_stock
**When** hago click en un repuesto
**Then** puedo ver detalles completos: stock actual, stock mínimo, ubicación, proveedores, historial de movimientos
**Then** puedo realizar ajustes manuales de stock (NFR-S48)
**Then** formulario de ajuste tiene: nuevo stock, motivo obligatorio (NFR-S49)

**Given** que realizo ajuste manual de stock
**When** completo el formulario
**Then** validación: motivo es requerido (NFR-S49)
**Then** motivo no puede estar vacío ni ser "Test" o "Placeholder"
**Then** si motivo inválido, error inline: "El motivo es obligatorio y debe ser descriptivo"
**Then** stock actualizado en <1s (NFR-S16, R-011)

**Given** que actualizo stock
**When** stock alcanza stock mínimo
**Then** alerta automática enviada a usuarios can_manage_stock (NFR-S50)
**Then** alerta enviada una sola vez (no spam) hasta que stock se reponga
**Then** alerta visible en dashboard de usuarios can_manage_stock

**Given** que selecciono repuesto en dropdown
**When** lo selecciono para uso en OT
**Then** stock y ubicación visibles al seleccionar (NFR-S47)
**Then** dropdown muestra: "Rodamiento SKF-6205 | Stock: 2 | Ubicación: Estante A3"
**Then** si stock es 0, opción deshabilitada o mensaje "Sin stock"

**Given** que estoy usando repuesto en OT
**When** registro uso
**Then** stock decrementado en tiempo real <1s (NFR-S16)
**Then** stock nuevo visible inmediatamente para todos los usuarios vía SSE
**Then** no se envía notificación a can_manage_stock (actualizaciones silenciosas, NFR-S16)

**Testability:**
- P0-015: Stock actualizado en tiempo real <1s
- P0-050: Alerta de stock mínimo
- E2E test: Ajuste manual de stock → verificar stock actualizado
- Test de race condition: 2 usuarios actualizan stock simultáneamente (optimistic locking, R-011)

---

### Story 5.2: Gestión de Proveedores

Como usuario con capability can_manage_providers,
quiero gestionar el catálogo de proveedores de mantenimiento y repuestos,
para tener la información de contacto actualizada y poder generar pedidos.

**Acceptance Criteria:**

**Given** que accedo a /proveedores con capability can_manage_providers
**When** veo el catálogo
**Then** dos secciones: "Mantenimiento" y "Repuestos" (NFR-S77, NFR-S78)
**Then** lista de proveedores en cada sección
**Then** cada proveedor muestra: nombre, tipo de proveedor, servicios que ofrece, datos de contacto
**Then** tipo de proveedor es campo de selección: "Mantenimiento", "Repuestos", "Ambos" (NFR-S78-A)

**Given** catálogo visible
**When** creo un nuevo proveedor
**Then** formulario único para ambos tipos (NFR-S78-A)
**Then** campos requeridos: nombre, tipo de proveedor, email, teléfono
**Then** campos opcionales: dirección, contacto persona, notas
**Then** campo "Tipo de proveedor" es dropdown: Mantenimiento, Repuestos, Ambos
**Then** data-testid="proveedor-nuevo-form"

**Given** que estoy creando proveedor
**When** selecciono tipo de proveedor
**Then** si selecciono "Mantenimiento", campo "Servicios" visible
**Then** servicios son checkbox group con 6 tipos predefinidos (NFR-S80):
  - Mantenimiento Correctivo
  - Mantenimiento Preventivo
  - Mantenimiento Reglamentario
  - Suministro de Repuestos
  - Mantenimiento de Equipos Específicos
  - Servicios de Emergencia
**Then** puedo seleccionar múltiples servicios

**Given** que creo proveedor de repuestos
**When** veo catálogo de servicios
**Then** servicios para repuestos: "Suministro de Repuestos" siempre disponible
**Then** puedo agregar categorías de repuestos que provee (ej: "Rodamientos", "Filtros")

**Given** proveedor creado
**When** lo edito
**Then** puedo cambiar tipo de proveedor (Mantenimiento ↔ Repuestos ↔ Ambos)
**Then** puedo agregar/remover servicios que ofrece
**Then** puedo desactivar proveedor (soft delete, no hard delete)
**Then** proveedores desactivados no aparecen en dropdowns de asignación

**Given** que estoy en vista de repuestos
**When** edito un repuesto
**Then** puedo asociar uno o más proveedores (NFR-S53)
**Then** relación muchos-a-muchos: repuesto puede tener múltiples proveedores
**Then** proveedor mostrado en lista de repuestos que suministra

**Testability:**
- P0 test: Crear proveedor con tipo "Ambos"
- P0 test: Asociar proveedor a repuesto
- E2E test: Crear proveedor → asociar a repuesto → verificar en catálogo
- Test de servicios: 6 tipos predefinidos seleccionables

---

### Story 5.3: Importación CSV de Repuestos y Pedidos

Como administrador con capability can_manage_stock,
quiero importar repuestos masivamente desde CSV y generar pedidos a proveedores,
para cargar el catálogo rápidamente y reponer stock cuando es necesario.

**Acceptance Criteria:**

**Given** que accedo a /repuestos/importar
**When** veo la página
**Then** botón "Descargar Plantilla" visible (NFR-S54)
**Then** plantilla CSV tiene columnas: Código, Nombre, Stock Inicial, Stock Mínimo, Ubicación Física, Proveedores (códigos separados por coma)
**Then** data-testid="descargar-plantilla-repuestos"

**Given** plantilla descargada
**When** completo CSV con datos de repuestos
**Then** cada fila es un repuesto
**Then** ejemplo: Código="ROD-6208", Nombre="Rodamiento SKF-6208", Stock="10", StockMinimo="5", Ubicación="Estante A3", Proveedores="PROV-001,PROV-002"

**Given** CSV completado
**When** lo subo
**Then** validación de datos de proveedores y ubicaciones (NFR-S55)
**Then** si un código de proveedor no existe, error reportado: "Proveedor PROV-999 no existe en fila X"
**Then** importación continúa para filas válidas (importación parcial)

**Given** validación exitosa
**When** importación se procesa
**Then** reporte de resultados mostrado (NFR-S56)
**Then** formato: "Exitosos: X, Errores: Y, Advertencias: Z"
**Then** errores listados con fila número y motivo
**Then** puedo descargar reporte para corrección

**Given** que soy usuario con capability can_manage_stock
**When** stock de repuesto alcanza mínimo
**Then** veo alerta: "Stock crítico: {Repuesto} | Unidades: X (Mínimo: Y)" (NFR-S50)
**Then** alerta tiene botón "Generar Pedido" (NFR-S51)

**Given** alerta de stock crítico visible
**When** click "Generar Pedido"
**Then** modal de pedido se abre
**Then** modal muestra: repuesto, stock actual, stock mínimo, sugerencia de pedido (stock mínimo * 2 - stock actual)
**Then** puedo ajustar cantidad a pedir
**Then** dropdown de proveedores visible (solo proveedores asociados al repuesto)
**Then** genero orden de pedido para proveedor seleccionado

**Given** que genero pedido
**When** completo el formulario
**Then** pedido creado y enviado a proveedor
**Then** pedido registrado en sistema con estado "Pendiente"
**Then** notificación enviada a usuarios can_manage_stock
**Then** pedido visible en /pedidos

**Testability:**
- P0 test: Validación de proveedores durante importación
- P0 test: Importación exitosa de 100 repuestos
- E2E test: Stock crítico → generar pedido → verificar pedido creado
- Test de cálculo de cantidad sugerida en pedido

---

## Epic 6: KPIs, Dashboard y Reportes Automáticos

**Epic Goal:** Los usuarios pueden ver KPIs (MTTR, MTBF) actualizados en tiempo real con drill-down por niveles (Global → Planta → Línea → Equipo), y recibir reportes automáticos por email en PDF/Excel.

### Story 6.1: Dashboard Común con KPIs en Tiempo Real

Como usuario del sistema,
quiero ver un dashboard común con KPIs básicos al hacer login,
para tener una visión rápida del estado del mantenimiento en la planta.

**Acceptance Criteria:**

**Given** que hago login en el sistema
**When** accedo por primera vez
**Then** redirigido a /dashboard (NFR-S91)
**Then** dashboard tiene los 4 KPIs básicos visibles para todos (NFR-S91-A):
  - MTTR (Mean Time To Repair)
  - MTBF (Mean Time Between Failures)
  - OTs Abiertas
  - Disponibilidad
**Then** cada KPI en tarjeta card con data-testid="kpi-{nombre}-card"

**Given** dashboard visible
**When** veo KPIs
**Then** valores actualizados cada 30 segundos vía SSE (NFR-S85, NFR-S86, NFR-S96)
**Then** actualización no requiere recargar página
**Then** indicador visual de última actualización: "Actualizado hace 5s"
**Then** dashboard carga completo en <2 segundos (NFR-S4)

**Given** KPIs visibles
**When** tengo capability can_view_kpis
**Then** puedo hacer click en cualquier KPI para drill-down
**Then** drill-down navega: Global → Planta → Línea → Equipo (NFR-S87)
**Then** breadcrumb muestra nivel actual: "KPIs > Planta HiRock > Línea 1"
**Then** puedo volver a nivel anterior haciendo click en breadcrumb

**Given** que estoy en nivel Global
**When** hago click en MTTR
**Then** navegado a nivel Planta: MTTR desglosado por cada planta
**Then** cada planta muestra: MTTR promedio, OTs completadas, count de equipos
**ThenTags de división HiRock (#FFD700) y Ultra (#8FBC8F) visibles

**Given** que estoy en nivel Planta
**When** hago click en una planta
**Then** navegado a nivel Línea: MTTR desglosado por cada línea
**Then** cada línea muestra: MTTR promedio, OTs completadas, count de equipos

**Given** que estoy en nivel Equipo
**When** veo KPIs específicos del equipo
**Then** MTTR del equipo, MTBF del equipo, count de fallas, historial de OTs
**Then** puedo ver patrón de fallas: Top 3 componentes que más fallan

**Given** que NO tengo capability can_view_kpis
**When** accedo a /dashboard o /kpis
**Then** veo los mismos 4 KPIs básicos que todos (NFR-S91, NFR-S91-A)
**Then** NO puedo hacer drill-down
**Then** mensaje: "Contacta a un administrador para ver análisis avanzados de KPIs"
**Then** analytics y métricas avanzadas no visibles

**Given** dashboard en móvil (<768px)
**When** lo veo
**Then** layout Mobile First optimizado (UX Dirección 3)
**Then** KPIs en grid 2 columnas para mejor visualización
**Then** touch targets de 44x44px para tapping

**Testability:**
- P0-046 a P0-048: KPIs actualizados cada 30s, drill-down funcional
- P0-046: MTTR actualizado cada 30s (SSE heartbeat)
- E2E test: Ver dashboard → esperar 30s → verificar KPIs actualizados sin reload
- Test de performance: Dashboard carga en <2s (NFR-P4)

---

### Story 6.2: Alertas y Métricas Avanzadas

Como usuario con capability can_view_kpis,
quiero ver alertas automáticas y métricas avanzadas,
para estar informado de situaciones que requieren atención inmediata.

**Acceptance Criteria:**

**Given** que tengo capability can_view_kpis
**When** accedo a /kpis
**Then** sección de "Métricas Adicionales" visible (NFR-S88)
**Then** métricas mostradas:
  - OTs Abiertas (desglosadas por prioridad: críticas, normales)
  - OTs Completadas (últimos 30 días)
  - Técnicos Activos (count de técnicos con OTs en progreso)
  - Stock Crítico (count de repuestos en stock mínimo)
**Then** cada métrica en tarjeta card con trend vs mes anterior (↑↓)

**Given** métricas visibles
**When** hay alertas activas
**Then** alertas mostradas prominentemente (NFR-S89):
  - Stock mínimo: lista de repuestos bajo stock mínimo
  - MTTR alto: definido como 150% del promedio últimos 30 días
  - Rutinas no completadas: lista de rutinas vencidas
**Then** cada alerta es clickeable para ver detalles
**Then** alertas tienen data-testid="alerta-{tipo}"

**Given** que tengo capability can_manage_stock
**When** hay alerta de stock mínimo
**Then** alerta visible: "Stock crítico: X repuestos bajo stock mínimo"
**Then** click me lleva a /repuestos con filtro de stock mínimo aplicado
**Then** colores de alerta: rojo #EF4444 para crítico, ámbar #F59E0B para advertencia

**Given** que veo alerta de MTTR alto
**When** hago click
**Then** navegado a análisis detallado de MTTR
**Then** drill-down disponible: Global → Planta → Línea → Equipo
**Then** puedo ver qué equipos están elevando el MTTR

**Given** que tengo capability can_manage_routines
**When** hay rutinas no completadas
**Then** alerta visible: "X rutinas vencidas sin completar"
**Then** click me lleva a /rutinas con filtro de vencidas aplicado

**Given** que estoy en /kpis
**When** veo porcentaje de rutinas completadas (NFR-S83)
**Then** porcentaje mostrado en dashboard: "Rutinas Completadas: 85%"
**Then** gráfico circular o progress bar visible
**Then** puedo ver mis propias rutinas asignadas y su porcentaje de completitud

**Given** que estoy en vista de KPIs
**When** quiero comparar con período anterior
**Then** puedo seleccionar rango de fechas: "Últimos 30 días", "Últimos 7 días", "Este mes", "Mes anterior"
**Then** KPIs recalculados para el período seleccionado
**Then** comparación con período anterior visible: "MTTR: 4.2h (↓15% vs mes anterior)"

**Testability:**
- P0-089: Alertas de stock mínimo, MTTR alto, rutinas no completadas
- E2E test: Stock alcanza mínimo → alerta visible → click → navega a repuestos
- Test de cálculo: MTTR alto = 150% promedio últimos 30 días
- Test de drill-down: KPI → Planta → Línea → Equipo

---

### Story 6.3: Exportación y Reportes Automáticos

Como usuario con capability can_view_kpis o can_receive_reports,
quiero exportar KPIs a Excel y recibir reportes automáticos por email en PDF,
para análisis externos y compartir con dirección sin acceso al sistema.

**Acceptance Criteria:**

**Given** que tengo capability can_view_kpis
**When** estoy en vista de KPIs
**Then** botón "Exportar a Excel" visible (NFR-S90)
**Then** botón tiene data-testid="exportar-kpis-excel"
**Then** click descarga archivo .xlsx compatible con Microsoft Excel 2016+ (NFR-I2)
**Then** Excel tiene hojas separadas por KPI:
  - Hoja 1: MTTR (tabla por día/sem/mes)
  - Hoja 2: MTBF (tabla por día/sem/mes)
  - Hoja 3: OTs Abiertas (lista)
  - Hoja 4: Stock Crítico (lista)
**Then** cada hoja tiene filtros y formatting aplicado

**Given** que tengo capability can_receive_reports
**When** accedo a /reportes/configurar
**Then** formulario visible para configurar reportes automáticos (NFR-S90-A)
**Then** data-testid="configurar-reportes-form"
**Then** puedo seleccionar:
  - KPIs incluidos: checkboxes para MTTR, MTBF, OTs Abiertas, OTs Completadas, Stock Crítico, Técnicos Activos, Porcentaje Rutinas Completadas, Número Usuarios Asignados por OT
  - Frecuencia: Diario, Semanal, Mensual
  - Formato: PDF (adjunto email)

**Given** que configuro reportes diarios
**When** guardo configuración
**Then** reportes generados automáticamente todos los días a las 8:00 AM (NFR-S90-B)
**Then** reporte contiene datos del día anterior
**Then** PDF enviado por email a las 8:00 AM
**Then** email subject: "Reporte Diario GMAO - {YYYY-MM-DD}"
**Then** email remitente: "gmao-hiansa@hiansa.cl"

**Given** que configuro reportes semanales
**When** guardo configuración
**Then** reportes generados automáticamente todos los lunes a las 8:00 AM (NFR-S90-C)
**Then** reporte contiene datos de la semana anterior (lunes a domingo)
**Then** PDF enviado por email los lunes 8:00 AM

**Given** que configuro reportes mensuales
**When** guardo configuración
**Then** reportes generados automáticamente el primer lunes de cada mes a las 9:00 AM (NFR-S90-D)
**Then** reporte contiene datos del mes anterior
**Then** PDF enviado por email el primer lunes 9:00 AM

**Given** que tengo capability can_receive_reports
**When** estoy en dashboard
**Then** puedo descargar manualmente cualquier reporte en PDF (NFR-S90-E)
**Then** botón "Descargar Reporte" visible con dropdown de período: Hoy, Ayer, Esta Semana, Este Mes, Mes Pasado
**Then** click descarga PDF inmediatamente
**Then** PDF tiene mismo formato que reporte automático

**Given** que descargo reporte PDF
**When** lo abro
**Then** PDF tiene branding de empresa: logo, colores corporativos
**Then** secciones del PDF:
  - Página 1: Executive Summary (4 KPIs principales)
  - Página 2-3: KPIs detallados (MTTR, MTBF, Disponibilidad)
  - Página 4: OTs Abiertas (desglosadas por estado y prioridad)
  - Página 5: Stock Crítico
  - Página 6+: Gráficos y tablas según KPIs seleccionados
**Then** footer con fecha de generación y "Generado por GMAO Hiansa"

**Given** que configuro reportes
**When** desactivo un reporte
**Then** reporte deja de enviarse automáticamente
**Then** puedo reactivarlo en cualquier momento
**Then** configuración guardada por usuario

**Testability:**
- P0 test: Exportar a Excel → verificar hojas separadas → abrir en Excel 2016+
- P0 test: Configurar reporte diario → verificar email enviado a las 8:00 AM
- E2E test: Configurar reporte semanal → esperar lunes → verificar email recibido
- Test de formato PDF: Todas las secciones presentes

---

## Epic 7: Rutinas de Mantenimiento Preventivo

**Epic Goal:** Los administradores pueden gestionar rutinas de mantenimiento preventivo que generan automáticamente órdenes de trabajo 24 horas antes del vencimiento, con alertas a los técnicos asignados.

### Story 7.1: Gestión de Rutinas Preventivas

Como administrador con capability can_manage_routines,
quiero crear y gestionar rutinas de mantenimiento preventivo,
para automatizar la generación de OTs recurrentes y asegurar que se cumplan.

**Acceptance Criteria:**

**Given** que tengo capability can_manage_routines
**When** accedo a /rutinas
**Then** lista de rutinas activas e inactivas visible
**Then** puedo crear nueva rutina con botón "+ Nueva Rutina"
**Then** data-testid="rutinas-lista"

**Given** que creo una nueva rutina
**When** el formulario se abre
**Then** campos requeridos:
  - Modalidad: Por Equipo Específico o Customizable (NFR-S81-A)
  - Frecuencia: Diaria, Semanal, Mensual (NFR-S81)
  - Tareas a realizar (textarea o editor de texto)
  - Técnico responsable (dropdown de usuarios)
  - Repuestos necesarios (dropdown multi-select de repuestos)
  - Duración estimada (input en horas)
**Then** campos opcionales:
  - Notas adicionales
**Then** data-testid="rutina-nuevo-form"

**Given** que selecciono "Por Equipo Específico"
**When** configuro la rutina
**Then** debo seleccionar un equipo de la jerarquía (búsqueda predictiva)
**Then** rutina asociada a ese equipo específico
**Then** cuando se genere OT, estará pre-asignada al equipo

**Given** que selecciono "Customizable"
**When** configuro la rutina
**Then** campos adicionales visibles:
  - Título de la rutina (ej: "Orden y Limpieza de Área")
  - Campos variables personalizables (key-value pairs)
  - Ejemplo: "Área" = "Pasillo de Producción", "Tareas" = checklist
**Then** cuando se genere OT, será genérica sin equipo pre-asignado

**Given** que he creado una rutina
**When** la guardo
**Then** rutina aparece en lista con estado "Activa"
**Then** next run date calculado según frecuencia:
  - Diaria: mañana mismo
  - Semanal: 7 días después
  - Mensual: 30 días después
**Then** count de OTs generadas mostrado

**Given** rutina visible
**When** la edito
**Then** puedo modificar todos los campos
**Then** puedo desactivar rutina (no eliminar, solo marcar inactiva)
**Then** si desactivo, deja de generar OTs automáticamente
**Then** auditoría logged: "Rutina {id} modificada/desactivada por {userId}"

**Given** que estoy en /dashboard
**When** tengo capability can_view_all_ots
**Then** porcentaje de rutinas completadas visible (NFR-S83)
**Then** formato: "Rutinas Completadas: 85%"
**Then** gráfico circular o progress bar visible
**Then** puedo ver mis propias rutinas asignadas y su estado

**Given** que estoy en /mis-ots
**When** tengo rutinas asignadas
**Then** OTs preventivas generadas desde rutinas visibles
**Then** etiqueta "Preventivo" visible en tarjetas (NFR-S11-B)
**Then** puedo distinguir OTs preventivas de correctivas

**Testability:**
- P0 test: Crear rutina diaria por equipo → verificar OT generada 24h antes
- P0 test: Crear rutina semanal customizable → verificar OT genérica
- E2E test: Crear rutina → esperar 24h → verificar OT generada con estado "Pendiente"
- Test de cálculo de next run date según frecuencia

---

### Story 7.2: Generación Automática de OTs y Alertas

Como administrador con capability can_manage_routines,
quiero que el sistema genere automáticamente OTs preventivas 24 horas antes del vencimiento,
y que el técnico asignado reciba alertas en 3 momentos para asegurar cumplimiento.

**Acceptance Criteria:**

**Given** que existe una rutina activa
**When** se alcanza 24 horas antes del vencimiento
**Then** OT preventiva generada automáticamente (NFR-S82)
**Then** OT tiene estado "Pendiente"
**Then** OT tiene tipo "Preventivo" (NFR-S11-A, NFR-S11-B)
**Then** OT pre-asignada al técnico responsable de la rutina
**Then** tareas, repuestos y duración estimada copiados desde la rutina (NFR-S81-B)

**Given** OT preventiva generada
**When** aparece en el sistema
**Then** número de OT generado correlativamente (ej: OT-PREV-001, OT-PREV-002)
**Then** técnico asignado recibe notificación en dashboard
**Then** OT visible en "Mis OTs" del técnico

**Given** que el técnico asignado no ha completado la rutina
**When** se alcanza 1 hora antes del vencimiento
**Then** alerta enviada al técnico (NFR-S84)
**Then** alerta tiene: "Rutina '{nombre}' vence en 1 hora - Equipo: {equipo}"
**Then** alerta visible en dashboard del técnico
**Then** email enviado si configurado

**Given** que la rutina sigue sin completarse
**When** se alcanza el momento del vencimiento
**Then** alerta enviada al técnico: "Rutina '{nombre}' vence ahora - Prioridad Alta"
**Then** alerta marcada como urgente (rojo #EF4444)
**Then** supervisor notificado también

**Given** que la rutina sigue sin completarse
**When** pasan 24 horas después del vencimiento
**Then** alerta final enviada: "Rutina '{nombre}' vencida hace 24h - Acción requerida"
**Then** alerta marcada como crítica
**Then** supervisor y jefe de mantenimiento notificados

**Given** que el técnico completa la rutina
**Then** OT marcada como "Completada"
**Then** siguiente OT generada 24 horas antes del próximo vencimiento (según frecuencia)
**Then** alertas cesan para esta instancia de rutina

**Given** que una rutina está desactivada
**When** llega el momento de generar OT
**Then** NO se genera OT
**Then** no se envían alertas
**Then** rutina marcada como "Inactiva" en lista

**Given** que estoy en /dashboard
**When** hay múltiples rutinas vencidas
**Then** alerta agrupada: "X rutinas vencidas requieren atención"
**Then** click me lleva a /rutinas con filtro "Vencidas" aplicado
**Then** puedo ver lista de rutinas vencidas y generar OTs manualmente si es necesario

**Testability:**
- P0 test: Rutina diaria → OT generada 24h antes → alerta 1h antes → alerta al vencer → alerta 24h después
- E2E test: Crear rutina semanal → verificar que OT se genera cada 7 días
- Test de cálculo de 24 horas antes del vencimiento
- Test de alertas: 3 momentos (1h antes, al vencer, 24h después)

---

## Epic 8: Multi-Dispositivo, PWA y Sincronización

**Epic Goal:** Los usuarios pueden instalar la aplicación como PWA en dispositivos móviles, acceder desde cualquier dispositivo (desktop, tablet, móvil), y todas las actualizaciones se sincronizan automáticamente con reconexión inteligente.

### Story 8.1: PWA con Instalación y Navegación Adaptativa

Como usuario de móvil,
quiero instalar la aplicación como app nativa y ver una interfaz optimizada para mi dispositivo,
para tener la mejor experiencia de uso posible desde mi teléfono.

**Acceptance Criteria:**

**Given** que accedo a la app desde móvil (<768px)
**When** la app es instalable como PWA (NFR-S99)
**Then** manifest.json configurado con:
  - name: "GMAO Hiansa"
  - short_name: "GMAO"
  - start_url: "/"
  - display: "standalone"
  - background_color: "#FFFFFF"
  - theme_color: "#7D1220"
  - icons: 192x192 y 512x512 PNG
**Then** service worker registrado para caching offline

**Given** PWA configurada
**When** accedo desde móvil por primera vez
**Then** prompt de instalación aparece: "Agregar a pantalla de inicio"
**Then** o banner de instalación visible después de 2 visitas
**Then** usuario puede instalar app como nativa

**Given** app instalada como PWA
**When** la abro
**Then** se abre en modo standalone (sin browser UI)
**Then** icono de app es logo de GMAO Hiansa (rojo burdeos #7D1220 con H blanco)
**Then** splash screen visible durante carga

**Given** app instalada
**When** estoy en móvil (<768px)
**Then** layout Mobile First optimizado (UX Dirección 3)
**Then** navegación inferior (bottom nav) con tabs:
  - Inicio: Dashboard personal
  - OTs: Mis OTs asignadas
  - Más: Menú expandible con más opciones
**Then** bottom nav tiene touch targets de 44px altura (NFR-A3)
**Then** bottom nav fija en bottom de pantalla

**Given** que estoy en tablet (768-1200px)
**Then** layout híbrido Kanban First + Mobile First
**Then** Kanban optimizado: 2 columnas visibles con swipe horizontal
**Then** KPIs en panel lateral colapsable (UX Dirección 2)
**Then** sidebar simplificado (no todas las opciones de desktop)

**Given** que estoy en desktop (>1200px)
**Then** layout según mi rol y tarea (UX Multi-Direction Strategy):
  - Elena (admin, can_view_kpis): Dirección 4 (Data Heavy)
  - Javier (supervisor, can_view_all_ots): Dirección 2 (Kanban First)
  - Carlos (operario, can_create_failure_report): Dirección 3 + 6 (Mobile First + Action Oriented)
  - María (técnica, can_update_own_ot): Dirección 2 + 3
  - Pedro (stock, can_manage_stock): Dirección 1 (Dashboard Clásico) con foco en módulo Stock

**Given** que estoy en desktop
**Then** sidebar completo visible a la izquierda (224px ancho)
**Then** header con logo, nombre app, perfil usuario
**Then** navegación por módulos según capabilities asignadas

**Given** que cambio orientación de dispositivo (portrait ↔ landscape)
**Then** layout se adapta automáticamente
**Then** transición suave (<100ms, NFR-P5)
**Then** no hay pérdida de datos o contexto

**Testability:**
- P0 test: Instalar PWA en móvil → verificar modo standalone
- P0 test: Acceder desde 3 tamaños de pantalla → verificar layout adaptativo
- E2E test mobile: Bottom nav funcional → touch targets 44px
- E2E test tablet: Swipe horizontal en Kanban → 2 columnas visibles
- Test de breakpoints: <768px, 768-1200px, >1200px

---

### Story 8.2: Sincronización SSE con Reconexión

Como usuario con múltiples dispositivos,
quiero que todas las actualizaciones se sincronicen automáticamente entre mis dispositivos,
para ver el estado actual del sistema sin importar desde dónde me conecto.

**Acceptance Criteria:**

**Given** que estoy conectado a la app
**When** inicializo conexión SSE
**Then** cliente se conecta a /api/v1/sse con token de autenticación
**Then** heartbeat recibido en <1s (NFR-S96, R-002)
**Then** heartbeat continua cada 30s mientras conexión activa (NFR-P3)

**Given** conexión SSE establecida
**When** una OT es actualizada por otro usuario
**Then** evento 'work-order-updated' recibido en <1s (NFR-S96, R-002)
**Then** payload contiene: workOrderId, numero, estado, updatedAt, actualizadoPor
**Then** UI actualizada automáticamente sin recargar página
**Then** toast notification: "OT #{numero} actualizada por {usuario}"

**Given** evento de actualización recibido
**When** es la misma OT que estoy viendo en mi pantalla
**Then** cambios reflejados inmediatamente en UI
**Then** si estoy viendo el modal de esa OT, modal actualizado
**Then** si la OT está en Kanban, tarjeta movida a nueva columna
**Then** si estoy en vista de listado, fila actualizada

**Given** dos dispositivos conectados
**When** ambos editan la misma OT simultáneamente (R-002)
**Then** conflict strategy aplicada: last-write-wins + merge (NFR-BLK-003)
**Then** último cambio en persistirse (basado en timestamp)
**Then** si hay conflicto de campos diferentes, ambos cambios preservados (merge)
**Then** notificación mostrada: "Esta OT fue actualizada por otro usuario. Refrescando..."

**Given** conexión perdida temporal (<30s)
**When** cliente detecta desconexión
**Then** intento de reconexión automática en <5s (NFR-R4)
**Then** si reconexión exitosa en <30s
**Then** eventos perdidos reenviados desde última desconexión (replay buffer)
**Then** UI actualizada con cambios perdidos

**Given** reconexión fallida después de 30s
**Then** mensaje visible: "Conexión perdida. Reintentando..."
**Then** indicador de loading o spinner visible
**Then** intentos de reconexión continúan en background
**Then** cuando reconexión exitosa, mensaje: "Conexión restablecida"

**Given** que estoy en /dashboard
**When** KPIs son recalculados
**Then** evento 'kpis-updated' recibido dentro de los próximos 30s (próximo heartbeat, NFR-S96)
**Then** nuevos valores de MTTR, MTBF, OTs Abiertas, Disponibilidad mostrados
**Then** actualización suave (fade o transition)

**Testability:**
- P0-051: E2E test con 2 dispositivos editando misma OT simultáneamente
- P0-096: Sincronización OTs <1s entre dispositivos
- P0-096: Sincronización KPIs <30s entre dispositivos
- E2E test: Conexión perdida → reconexión automática <30s → replay de eventos
- Test de replay buffer: Perder conexión durante 3 actualizaciones → reconectar → verificar 3 eventos recibidos

---

### Story 8.3: Notificaciones Push y Preferencias

Como usuario del sistema,
quiero recibir notificaciones push en mi dispositivo cuando hay cambios relevantes,
y poder configurar qué tipo de notificaciones quiero recibir.

**Acceptance Criteria:**

**Given** que estoy autenticado
**When** se crea un nuevo reporte de avería
**Then** usuarios con capability can_view_all_ots reciben notificación push (NFR-S4, NFR-S100)
**Then** notificación recibida en <30s del cambio (NFR-S4, R-002)
**Then** notificación contiene: "Nueva Avería #{numero} - {equipo} - {reportero}"
**Then** click en notificación abre la app en /averias/triage

**Given** que estoy asignado a una OT
**When** hay cambios de estado
**Then** recibo notificación push en <30s (NFR-S19, NFR-S100)
**Then** cambios notificados: Asignada, En Progreso, Pausada, Completada
**Then** notificación: "OT #{numero} - {nuevoEstado} - {equipo}"

**Given** que tengo capability can_manage_stock
**When** un repuesto alcanza stock mínimo
**Then** recibo notificación push (NFR-S50, NFR-S89)
**Then** notificación: "Stock Crítico - {repuesto}: {stock} unidades (Mínimo: {minimo})"

**Given** que tengo capability can_view_kpis
**When** MTTR alcanza 150% del promedio últimos 30 días
**Then** recibo notificación push (NFR-S89)
**Then** notificación: "Alerta MTTR - MTTR actual: {valor} (150% del promedio)"

**Given** que tengo rutinas asignadas
**When** una rutina vence (3 alertas: 1h antes, al vencer, 24h después)
**Then** recibo notificación push en cada momento (NFR-S84)
**Then** notificaciones contienen countdown de urgencia

**Given** que recibo notificaciones
**When** accedo a /configurar/notificaciones (NFR-S105)
**Then** formulario visible para configurar preferencias por tipo
**Then** checkboxes para cada tipo de notificación:
  - Recibido (para mis averías)
  - Autorizado (para mis averías convertidas a OT)
  - En Progreso (para mis OTs)
  - Completado (para mis OTs)
  - Stock Mínimo (si tengo can_manage_stock)
  - MTTR Alto (si tengo can_view_kpis)
  - Rutinas No Completadas (si tengo rutinas asignadas)
**Then** data-testid="configurar-notificaciones-form"

**Given** formulario de preferencias visible
**When** desmarco un tipo de notificación
**Then** dejo de recibir notificaciones de ese tipo
**Then** otras notificaciones continúan llegando normalmente
**Then** preferencia guardada por usuario

**Given** que estoy en navegador desktop
**When** recibo notificación push
**Then** notificación mostrada como toast/notification en esquina superior derecha
**Then** notificación tiene botón "X" para cerrar
**Then** notificaciones se auto-cierran después de 5 segundos
**Then** puedo ver historial de notificaciones recientes en /notificaciones

**Given** que estoy en móvil con PWA instalada
**When** app está en background
**Then** notificaciones push mostradas como notificaciones nativas del sistema
**Then** notificación en shade/lock screen si teléfono bloqueado
**Then** vibration opcional si configurada

**Testability:**
- P0-004: Notificaciones push recibidas en <30s de cambio de estado
- E2E test: Crear avería → verificar usuario con can_view_all_ots recibe notificación
- E2E test: Asignar OT → verificar técnico recibe notificación
- Test de preferencias: Desmarcar "En Progreso" → crear OT → verificar no llega notificación

---

