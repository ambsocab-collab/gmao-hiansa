---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation', 'step-05-integrate-test-design']
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
  - test-design/gmao-hiansa-handoff.md
workflowType: 'create-epics-and-stories'
lastStep: 5
status: 'completed'
project_name: 'gmao-hiansa'
user_name: 'Bernardo'
date: '2026-02-27'
---

# gmao-hiansa - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for gmao-hiansa, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Test Design Integration

Este documento incluye información de prueba derivada del análisis TEA (Test Engineering Architecture):
- **Quality Gates por Epic**: Criterios de calidad que deben cumplirse antes de considerar un epic completo
- **P0 Test Scenarios**: Escenarios críticos integrados como acceptance criteria
- **Testability Requirements**: Requisitos de testabilidad (data-testid, seeding APIs) para asegurar que las funcionalidades son testeables

**Fuente**: `test-design/gmao-hiansa-handoff.md` generado por TEA TestArch Test Design workflow

## Requirements Inventory

### Functional Requirements

**1. Gestión de Averías (FR1-FR10):**
- FR1: Los operarios pueden crear avisos de avería seleccionando un equipo de la jerarquía de activos
- FR2: Los operarios pueden agregar una descripción textual del problema al crear un aviso
- FR3: Los operarios pueden adjuntar una foto opcional al reportar una avería
- FR4: Los usuarios reciben notificaciones cuando el estado de su aviso cambia (recibido, autorizado, en progreso, completado)
- FR5: Los operarios pueden confirmar si una reparación funciona correctamente después de completada y reciben confirmación inmediata con número de aviso generado
- FR6: Los usuarios pueden realizar búsqueda predictiva de equipos durante la creación de avisos
- FR7: Los supervisores pueden ver todos los avisos nuevos en una columna de triage
- FR8: Los supervisores pueden convertir avisos en órdenes de trabajo
- FR9: Los supervisores pueden descartar avisos que no son procedentes
- FR10: Los usuarios pueden distinguir visualmente entre avisos de avería (color rosa) y reparación (color blanco)

**2. Gestión de Órdenes de Trabajo (FR11-FR31):**
- FR11: Los usuarios interactúan con 8 estados de ciclo de vida para órdenes de trabajo (Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada)
- FR12: Los técnicos pueden iniciar una orden de trabajo asignada cambiando su estado a "en progreso"
- FR13: Los técnicos pueden agregar repuestos usados durante el cumplimiento de una orden de trabajo
- FR14: Los técnicos pueden completar una orden de trabajo
- FR15: Los técnicos pueden agregar notas internas a una orden de trabajo
- FR16: El stock de repuestos se actualiza automáticamente cuando un técnico registra su uso
- FR17: Los supervisores pueden asignar órdenes de trabajo a técnicos internos
- FR18: Los supervisores pueden asignar órdenes de trabajo a proveedores externos
- FR19: Los supervisores pueden seleccionar técnicos o proveedores según el tipo de orden de trabajo mediante dropdowns condicionales que filtran técnicos disponibles según skills y ubicación
- FR20: Los técnicos pueden ver todas las órdenes asignadas a ellos
- FR21: Los usuarios con capacidad `can_view_all_ots` pueden ver todas las órdenes de trabajo de la organización. Esta capacidad está disponible para roles: Supervisor, Administrador, Director
- FR22: Los usuarios pueden distinguir visualmente entre órdenes de correctivo propio y externo (por código de colores)
- FR23: Los usuarios pueden distinguir visualmente entre órdenes de reparación interna y enviada a proveedor (por código de colores)
- FR24: Los usuarios pueden ver detalles completos de una orden de trabajo (fechas, origen, técnico, repuestos) en modal informativo
- FR25: Los usuarios con capacidad `can_create_manual_ot` pueden crear órdenes de trabajo manuales sin partir de un aviso
- FR26: Los usuarios pueden acceder a una vista de listado de todas las órdenes de trabajo
- FR27: Los usuarios pueden filtrar el listado de órdenes de trabajo por múltiples criterios (estado, técnico, fecha, tipo, equipo)
- FR28: Los usuarios pueden ordenar el listado de órdenes de trabajo por cualquier columna
- FR29: Los usuarios pueden realizar las mismas acciones en la vista de listado que en el Kanban (asignar, iniciar, completar, ver detalles)
- FR30: Los usuarios pueden alternar entre vista Kanban y vista de listado
- FR31: Las vistas Kanban y de listado mantienen sincronización en tiempo real (cambios se reflejan en ambas)

**3. Gestión de Activos (FR32-FR43):**
- FR32: Los usuarios pueden trabajar con una jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto)
- FR33: Los usuarios pueden navegar la jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto) en cualquier dirección
- FR34: Los usuarios pueden asociar un componente a múltiples equipos (relación muchos-a-muchos)
- FR35: Los usuarios pueden ver el historial de órdenes de trabajo de un equipo
- FR36: Los usuarios pueden gestionar 5 estados para equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado)
- FR37: Los administradores pueden cambiar el estado de un equipo
- FR38: Los usuarios pueden ver y gestionar el stock de equipos completos reutilizables con contador de cantidades por estado (Disponible, En Uso, En Reparación, Descartado)
- FR39: Los usuarios pueden rastrear la ubicación actual de equipos reutilizables por área de fábrica asignada, último técnico con custodia, o estado de reserva actual
- FR40: Los usuarios con permisos pueden importar activos masivamente desde un archivo CSV
- FR41: La estructura jerárquica se valida automáticamente durante la importación masiva de activos
- FR42: Los usuarios pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)
- FR43: Los usuarios pueden descargar una plantilla de importación con el formato requerido

**4. Gestión de Repuestos (FR44-FR57):**
- FR44: Los usuarios pueden acceder al catálogo de repuestos consumibles
- FR45: Los usuarios pueden ver el stock actual de cada repuesto en tiempo real
- FR46: Los usuarios pueden ver la ubicación física de cada repuesto en el almacén
- FR47: Los usuarios ven el stock y ubicación al seleccionar un repuesto para uso
- FR48: Los usuarios con permisos pueden realizar ajustes manuales de stock
- FR49: Los usuarios deben agregar un motivo al realizar ajustes manuales de stock
- FR50: Los usuarios con permisos reciben alertas cuando un repuesto alcanza su stock mínimo
- FR51: Los usuarios NO reciben notificaciones por cada uso individual de repuestos (solo alertas de stock mínimo)
- FR52: Los usuarios pueden generar pedidos de repuestos a proveedores
- FR53: Los usuarios con permisos pueden gestionar el stock de repuestos
- FR54: Los usuarios pueden asociar cada repuesto con uno o más proveedores
- FR55: Los usuarios con permisos pueden importar repuestos masivamente desde un archivo CSV
- FR56: Los datos de proveedores y ubicaciones se validan automáticamente durante la importación masiva de repuestos y se reportan errores
- FR57: Los usuarios pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)

**5. Gestión de Usuarios, Roles y Capacidades (FR58-FR76):**
- FR58: Los administradores pueden registrar nuevos usuarios en el sistema
- FR59: Los administradores pueden crear roles personalizados hasta 20 roles personalizados con validación de nombres únicos
- FR60: Los administradores pueden asignar capacidades a roles mediante controles de selección binaria
- FR61: Los administradores pueden eliminar roles personalizados
- FR62: Los usuarios pueden tener asignado uno o más roles simultáneamente
- FR63: Los usuarios heredan todas las capacidades de los roles asignados
- FR64: Los administradores pueden asignar roles a usuarios
- FR65: Los administradores pueden revocar roles de usuarios
- FR66: Todo usuario nuevo tiene la capacidad de crear avisos de avería predeterminada
- FR67: Las capacidades se otorgan a través de roles, no individualmente (excepto la capacidad predeterminada)
- FR68: Las capacidades incluyen: crear OT manual, actualizar propias OTs, ver todas las OTs, completar OTs, gestionar stock, asignar técnicos, ver KPIs
- FR69: Los usuarios pueden acceder a su perfil personal
- FR70: Los usuarios pueden editar su información personal (nombre, email, teléfono)
- FR71: Los usuarios pueden cambiar su contraseña
- FR72: Los administradores pueden ver un historial de actividad del usuario durante los últimos 6 meses (login, cambios de perfil, acciones críticas)
- FR72-A: El propietario de la aplicación crea el usuario administrador inicial con credenciales temporales (usuario y contraseña)
- FR72-B: Cuando un usuario inicia sesión por primera vez, el sistema debe obligarlo a cambiar su contraseña temporal antes de permitirle acceder al resto de la aplicación
- FR72-C: Los administradores pueden registrar nuevos usuarios asignando credenciales temporales (usuario y contraseña) que deberán ser cambiadas en el primer acceso
- FR72-D: El sistema debe identificar si es el primer acceso de un usuario y mostrar forzosamente la pantalla de cambio de contraseña
- FR72-E: El sistema no debe permitir al usuario navegar a ninguna otra sección de la aplicación hasta que haya completado el cambio de contraseña en su primer acceso
- FR73: Los usuarios acceden solo a los módulos para los que tienen capacidades asignadas (control de acceso basado en capacidades)
- FR74: Los usuarios solo ven en la navegación los módulos para los que tienen capacidades asignadas
- FR75: El acceso se deniega automáticamente si un usuario intenta navegar directamente a un módulo no autorizado (URL directa)
- FR76: Los usuarios ven un mensaje explicativo cuando se deniega acceso por falta de capacidades

**6. Gestión de Proveedores (FR77-FR80):**
- FR77: Los administradores pueden mantener un catálogo de proveedores de mantenimiento
- FR78: Los administradores pueden mantener un catálogo de proveedores de repuestos
- FR79: Los usuarios pueden ver datos de contacto de cada proveedor
- FR80: Los usuarios pueden asociar proveedores con tipos de servicio que ofrecen

**7. Gestión de Rutinas de Mantenimiento (FR81-FR84):**
- FR81: Los usuarios pueden configurar rutinas de mantenimiento con múltiples frecuencias (diaria, semanal, mensual)
- FR82: Las órdenes de trabajo se generan automáticamente basadas en rutinas programadas (según frecuencia configurada)
- FR83: Los usuarios pueden ver el porcentaje de rutinas completadas en el dashboard
- FR84: Los usuarios reciben alertas cuando una rutina no se completa en el plazo previsto

**8. Análisis y Reportes (FR85-FR95):**
- FR85: Los usuarios pueden ver el KPI MTTR (Mean Time To Repair) calculado en tiempo real
- FR86: Los usuarios pueden ver el KPI MTBF (Mean Time Between Failures) calculado en tiempo real
- FR87: Los usuarios pueden navegar drill-down de KPIs (Global → Planta → Línea → Equipo)
- FR88: Los usuarios pueden ver métricas adicionales (OTs abiertas, OTs completadas, técnicos activos, stock crítico)
- FR89: Los usuarios reciben alertas accionables (stock mínimo, MTFR alto, rutinas no completadas)
- FR90: Los usuarios pueden exportar reportes de KPIs a Excel en formato .xlsx compatible con Microsoft Excel 2016+, con hojas separadas por KPI (MTTR, MTBF, OTs Abiertas, Stock Crítico)
- FR91: Los usuarios ven un dashboard específico según los roles del usuario al hacer login
- FR92: El dashboard para operarios muestra sus avisos recientes y notificaciones
- FR93: El dashboard para técnicos muestra sus órdenes asignadas y rutinas del día
- FR94: El dashboard para supervisores muestra el tablero Kanban por defecto
- FR95: El dashboard para administradores muestra KPIs y alertas por defecto

**9. Sincronización y Acceso Multi-Dispositivo (FR96-FR100):**
- FR96: El sistema sincroniza datos entre múltiples dispositivos: <1 segundo para OTs, <30 segundos para KPIs
- FR97: Los usuarios pueden acceder desde dispositivos desktop, tablet y móvil
- FR98: La interfaz se adapta responsivamente al tamaño de pantalla del dispositivo
- FR99: Los usuarios pueden instalar la aplicación en dispositivos móviles como aplicación nativa (PWA)
- FR100: Los usuarios reciben notificaciones push en sus dispositivos

### NonFunctional Requirements

**Performance (NFR-P1 a NFR-P7):**
- NFR-P1: La búsqueda predictiva de equipos debe devolver resultados en menos de 200ms
- NFR-P2: La carga inicial (first paint) de la aplicación debe completarse en menos de 3 segundos en conexión WiFi industrial estándar
- NFR-P3: Las actualizaciones en tiempo real via WebSockets deben reflejarse en todos los clientes conectados en menos de 1 segundo
- NFR-P4: El dashboard de KPIs debe cargar y mostrar datos en menos de 2 segundos
- NFR-P5: Las transiciones entre vistas (p.ej. Kanban ↔ Listado) deben completarse en menos de 100ms
- NFR-P6: El sistema debe soportar 50 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta)
- NFR-P7: La importación masiva de 10,000 activos debe completarse en menos de 5 minutos

**Security (NFR-S1 a NFR-S9):**
- NFR-S1: Todos los usuarios deben autenticarse antes de acceder al sistema
- NFR-S2: Las contraseñas deben almacenarse hasheadas (bcrypt/argon2) nunca en texto plano
- NFR-S3: Todas las comunicaciones entre cliente y servidor deben usar HTTPS/TLS 1.3
- NFR-S4: El sistema debe implementar control de acceso basado en capacidades (ACL) para restringir acceso a módulos
- NFR-S5: El sistema debe registrar logs de auditoría para acciones críticas (cambio de roles, ajustes de stock, cambio de estados de equipos)
- NFR-S6: Las sesiones de usuario deben expirar después de 8 horas de inactividad
- NFR-S7: El sistema debe sanitizar todas las entradas de usuario para prevenir inyección SQL/XSS
- NFR-S8: Los datos sensibles (contraseñas, tokens) nunca deben aparecer en logs o errores expuestos al cliente
- NFR-S9: El sistema debe implementar Rate Limiting para prevenir ataques de fuerza bruta en login (máx. 5 intentos fallidos por IP en 15 minutos)

**Scalability (NFR-SC1 a NFR-SC5):**
- NFR-SC1: El sistema debe soportar hasta 10,000 activos sin degradación de performance
- NFR-SC2: El sistema debe soportar hasta 100 usuarios concurrentes sin degradación de performance
- NFR-SC3: La base de datos debe estar optimizada con índices para consultas frecuentes
- NFR-SC4: El sistema debe implementar paginación para listados grandes
- NFR-SC5: El sistema debe soportar crecimiento a 20,000 activos con ajustes de infraestructura sin cambios de arquitectura

**Accessibility (NFR-A1 a NFR-A6):**
- NFR-A1: La interfaz debe cumplir con nivel WCAG AA de contraste (mínimo 4.5:1 para texto normal)
- NFR-A2: El tamaño de texto base debe ser mínimo 16px con títulos de 20px o más
- NFR-A3: Los elementos interactivos (botones, links) deben tener un tamaño mínimo de 44x44px
- NFR-A4: La interfaz debe ser legible en condiciones de iluminación de fábrica (alto contraste, sin dependencia de color solo)
- NFR-A5: La aplicación debe ser navegable usando teclado (Tab, Enter, Esc)
- NFR-A6: La interfaz debe soportar zoom hasta 200% sin romper el layout

**Reliability (NFR-R1 a NFR-R6):**
- NFR-R1: El sistema debe tener un uptime objetivo del 99% durante horarios de operación de fábrica
- NFR-R2: El sistema debe realizar backups automáticos diarios de la base de datos
- NFR-R3: El sistema debe tener un proceso de restore validado con recovery time objetivo (RTO) de 4 horas
- NFR-R4: Las conexiones WebSocket deben reconectarse automáticamente si se pierde conexión temporal (<30 segundos)
- NFR-R5: El sistema debe mostrar mensajes claros de error cuando un servicio no está disponible
- NFR-R6: Las operaciones críticas (completar OT, ajustes de stock) deben tener confirmación de éxito antes de considerarlas completadas

**Integration (NFR-I1 a NFR-I4):**
- NFR-I1: El sistema debe soportar importación masiva de datos mediante archivos CSV con formato validado
- NFR-I2: El sistema debe exportar reportes de KPIs en formato Excel compatible con Microsoft Excel 2016+
- NFR-I3: La arquitectura debe permitir futura integración con sistemas ERP mediante API REST
- NFR-I4: La arquitectura debe permitir futura integración con sistemas de producción (IoT) para lectura de datos de equipos

### Additional Requirements

**Requisitos Adicionales del Architecture:**

- **Starter Template:** Next.js 15 (App Router) + Prisma + Neon PostgreSQL como stack inicial. Esto debe ser la primera historia de implementación (Epic 1, Story 1)
- **Sistema de Autenticación:** NextAuth.js v4.24.7 + Custom RBAC con 8 capacidades (can_create_failure_report predeterminada + 7 flexibles)
- **Flujo de cambio de contraseña:** Usuarios nuevos con contraseñas temporales deben cambiarla en el primer acceso obligatoriamente
- **Sincronización en tiempo real:** SSE (Server-Sent Events) para Kanban con endpoint /api/kanban/stream
- **State Management:** TanStack Query 5.90.5 para server state con query keys: [resource, id?, params?]
- **Base de datos:** Prisma 7.3.0 con Neon PostgreSQL, conexión con ?pgbouncer=true para serverless
- **Despliegue:** Vercel con build command: npx prisma generate && npm run build
- **Estructura de proyecto:** Organización feature-based con src/app/, src/components/, src/lib/, src/hooks/, src/types/
- **Patrones de naming:**
  - Database: PascalCase models, camelCase columns, *Id suffix for foreign keys
  - API: Plural RESTful (/api/assets, /api/work-orders)
  - Code: PascalCase components, camelCase functions/variables
- **Formato de respuestas API:** {error: {code, message, details}} para errores, camelCase en JSON
- **Eventos SSE:** Notación dot kanban:ot:created, kanban:ot:updated, kanban:ot:moved
- **Patrones de error:** Throw errores inesperados/auth, retornar errores de validación
- **Seed script:** prisma/seed.ts con 8 capabilities, 4 roles, 1 admin user (admin@gmao-hiansa.com / Admin123!)

**Requisitos Adicionales del UX Design:**

- **Responsive Design Breakpoints:**
  - Desktop (>1200px): Kanban 8 columnas expandido
  - Tablet (768-1200px): Kanban 2 columnas, modal ℹ️
  - Móvil (<768px): 1 columna, swipe horizontal
  - TV (4K): Dashboard público modo reunión
- **Búsqueda Predictiva:** <200ms con debouncing 300ms, autocompletado mientras escribe
- **Touch Targets:** Mínimo 44x44px para todos los elementos interactivos (WCAG AA)
- **PWA Manifest:** Iconos 192x192 y 512x512, manifest.json configurado
- **Service Worker:** Offline parcial con sincronización al reconectar
- **Código de Colores Kanban:**
  - 🌸 Rosa (avería triage), ⚪ Blanco (reparación triage)
  - 🔴 Rojizo (correctivo propio), 🔴📏 Rojo con línea (correctivo externo viene)
  - 🟡 Amarillento (taller propio), 🔵 Azul (enviado a proveedor)
- **Modal ℹ️ con trazabilidad completa:** Fechas, origen, técnico, repuestos, proveedor, teléfono
- **Feedback inmediato:** Confirmación visual en todas las acciones (<100ms)
- **Dashboard por rol:** Cada tipo de usuario ve dashboard específico al login
- **Notificaciones push:** Transiciones de estado, alertas accionables, stock mínimo (sin spam por uso)
- **Paleta de colores:** Primary #0066CC, Success #28A745, Warning #FFC107, Danger #DC3545
- **Typography:** System UI fonts, 16px base, 20px headings
- **Accessibility:** WCAG AA compliance (4.5:1 contraste), keyboard navigation, 200% zoom support

### FR Coverage Map

**Epic 1: Fundación del Sistema - Usuarios y Control de Acceso**
- FR58: Registro de usuarios
- FR59: Creación de roles personalizados (hasta 20)
- FR60: Asignación de capacidades a roles
- FR61: Eliminación de roles personalizados
- FR62: Múltiples roles por usuario
- FR63: Herencia de capacidades
- FR64: Asignación de roles a usuarios
- FR65: Revocación de roles
- FR66: Capacidad can_create_failure_report predeterminada
- FR67: Capacidades otorgadas a través de roles
- FR68: Lista de 7 capacidades flexibles
- FR69: Acceso a perfil personal
- FR70: Edición de información personal
- FR71: Cambio de contraseña
- FR72: Historial de actividad (6 meses)
- FR72-A: Admin inicial con credenciales temporales
- FR72-B: Primer login obliga cambio de contraseña
- FR72-C: Registro con credenciales temporales
- FR72-D: Detección de primer acceso
- FR72-E: Bloqueo de navegación hasta cambio de contraseña
- FR73: Control de acceso por módulos
- FR74: Navegación filtrada por capacidades
- FR75: Denegación de acceso por URL directa
- FR76: Mensaje explicativo en denegación

**Epic 2: Gestión de Activos y Jerarquía de Equipos**
- FR32: Jerarquía 5 niveles
- FR33: Navegación bidireccional
- FR34: Componentes multi-equipos (muchos-a-muchos)
- FR35: Historial de OTs por equipo
- FR36: 5 estados de equipos
- FR37: Cambio de estado por admin
- FR38: Stock de equipos reutilizables
- FR39: Tracking de ubicación de equipos
- FR40: Importación CSV de activos
- FR41: Validación de estructura jerárquica
- FR42: Reporte de resultados de importación
- FR43: Descarga de plantilla de importación

**Epic 3: Reporte de Averías con Feedback Transparencia**
- FR1: Creación de avisos de avería
- FR2: Descripción textual del problema
- FR3: Foto opcional
- FR4: Notificaciones de cambios de estado
- FR5: Confirmación de operario
- FR6: Búsqueda predictiva de equipos
- FR7: Columna de triage
- FR8: Conversión a OTs
- FR9: Descarte de avisos
- FR10: Distinción visual avería vs reparación

**Epic 4: Tablero Kanban Digital de Órdenes de Trabajo**
- FR11: 8 estados de ciclo de vida
- FR12: Inicio de OT por técnico
- FR13: Agregar repuestos usados
- FR14: Completar OT
- FR15: Notas internas
- FR16: Auto-actualización de stock
- FR17: Asignación a técnicos internos
- FR18: Asignación a proveedores externos
- FR19: Dropdowns condicionales por tipo OT
- FR20: Ver OTs asignadas
- FR21: Capacidad can_view_all_ots
- FR22: Distinción visual correctivo propio/externo
- FR23: Distinción visual reparación interna/enviada
- FR24: Modal ℹ️ con detalles completos
- FR25: Creación manual de OTs
- FR26: Vista de listado de OTs
- FR27: Filtros múltiples
- FR28: Ordenamiento por columnas
- FR29: Acciones en vista listado
- FR30: Alternar Kanban/Listado
- FR31: Sincronización real-time

**Epic 5: Gestión de Repuestos y Proveedores**
- FR44: Catálogo de repuestos
- FR45: Stock en tiempo real
- FR46: Ubicación física en almacén
- FR47: Stock visible al seleccionar
- FR48: Ajustes manuales de stock
- FR49: Motivo obligatorio en ajustes
- FR50: Alertas de stock mínimo
- FR51: Sin spam por uso individual
- FR52: Pedidos a proveedores
- FR53: Gestión de stock
- FR54: Asociación con proveedores
- FR55: Importación CSV de repuestos
- FR56: Validación de proveedores
- FR57: Reporte de resultados de importación
- FR77: Catálogo proveedores mantenimiento
- FR78: Catálogo proveedores repuestos
- FR79: Datos de contacto
- FR80: Asociación con tipos de servicio

**Epic 6: Rutinas de Mantenimiento Preventivo**
- FR81: Configuración de rutinas (diaria/semanal/mensual)
- FR82: Generación automática de OTs
- FR83: Porcentaje de rutinas completadas
- FR84: Alertas de rutinas no completadas

**Epic 7: Dashboard de KPIs y Análisis de Mantenimiento**
- FR85: KPI MTTR
- FR86: KPI MTBF
- FR87: Drill-down 4 niveles
- FR88: Métricas adicionales
- FR89: Alertas accionables
- FR90: Exportación Excel .xlsx
- FR91: Dashboard específico por rol
- FR92: Dashboard operarios
- FR93: Dashboard técnicos
- FR94: Dashboard supervisores
- FR95: Dashboard administradores

**Epic 8: PWA Multi-Dispositivo con Sincronización Real-Time**
- FR96: Sincronización <1s OTs, <30s KPIs
- FR97: Acceso desktop/tablet/móvil
- FR98: Responsive design
- FR99: PWA instalable
- FR100: Notificaciones push

## Epic List

### Epic 1: Fundación del Sistema - Usuarios y Control de Acceso

Los administradores pueden registrar usuarios, crear roles personalizados con capacidades específicas, y controlar el acceso a los módulos del sistema mediante un sistema de permisos granular. Los usuarios gestionan sus perfiles, cambian contraseñas y el sistema fuerza el cambio de contraseña temporal en el primer acceso.

**FRs cubiertos:** FR58-FR76 (19 FRs)

**Valor entregado:** Sistema completo de autenticación y autorización que permite controlar quién puede hacer qué en la aplicación.

**Notas de implementación:**
- Inicialización del proyecto con Next.js 15 + Prisma + Neon (Story 1)
- NextAuth.js v4.24.7 + Custom RBAC con 8 capacidades
- Seed script: 4 roles (Operario, Técnico, Supervisor, Admin) + 1 admin user
- Flujo obligatorio de cambio de contraseña en primer login
- Middleware para ACL basado en capacidades

#### Quality Gates (Epic 1)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **RBAC Security** | 64 tests pasan (8 roles × 8 capacidades) | SÍ | P0 |
| **Rate Limiting** | Rate limiting implementado y testeado (429 validado) | SÍ | P0 |
| **Password Security** | Contraseñas hasheadas (bcrypt/argon2), texto plano nunca almacenado | SÍ | P0 |
| **Session Management** | Sesiones expiran después de 8h inactividad | SÍ | P0 |
| **First Login Flow** | Cambio de contraseña obligatorio en primer acceso | SÍ | P0 |

**Riesgos Asociados (del Test Design):**
- **R-SEC-001** (Score 6): RBAC bypass vulnerabilities - Mitigación: Test matrix completo antes de GA
- **R-SEC-004** (Score 6): Rate limiting no implementado - Mitigación: Test endpoint `/api/test-rate-limit`
- **R-SEC-005** (Score 3): Password hashing no validado - Mitigación: Unit tests para hashing

#### Testability Requirements (Epic 1)

**Requisitos Previos a la Implementación:**
- Seeding API `/api/test-data` para crear usuarios de prueba con roles específicos
- Mock endpoint para rate limiting: `/api/test-rate-limit` con configuración forzada

**data-testid Attributes Requeridos:**
```html
<!-- Login -->
<input data-testid="email-input" />
<input data-testid="password-input" />
<button data-testid="login-button" />
<div data-testid="error-message" />

<!-- Roles y Capacidades -->
<div data-testid="role-checkbox-{capability}" />
<button data-testid="assign-role-button" />
<div data-testid="capability-indicator-{capability}" />

<!-- Perfil -->
<input data-testid="current-password-input" />
<input data-testid="new-password-input" />
<button data-testid="change-password-button" />
```

---

### Epic 2: Gestión de Activos y Jerarquía de Equipos

Los usuarios pueden navegar y gestionar la jerarquía completa de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), ver el historial de mantenimiento de cada equipo, gestionar el stock de equipos reutilizables y realizar importaciones masivas desde archivos CSV validados.

**FRs cubiertos:** FR32-FR43 (12 FRs)

**Valor entregado:** Estructura jerárquica completa de activos que soporta todos los módulos del sistema (averías, OTs, repuestos, KPIs).

**Notas de implementación:**
- Modelo Prisma con self-reference para jerarquía 5 niveles
- Tabla many-to-many ComponentAsset para componentes multi-equipos
- Búsqueda predictiva <200ms con debouncing 300ms
- CSV parser con validación de estructura jerárquica
- 5 estados de equipo con tracking de ubicación

---

### Epic 3: Reporte de Averías con Feedback Transparencia

Los operarios pueden reportar averías en menos de 30 segundos usando búsqueda predictiva, describir el problema y adjuntar fotos. Reciben notificaciones push de cada cambio de estado (recibido, autorizado, en progreso, completado) y confirman si la reparación funciona correctamente. Los supervisores ven los avisos en columna de triage y los convierten en OTs o los descartan.

**FRs cubiertos:** FR1-FR10 (10 FRs)

**Valor entregado:** Flujo completo de reporte de averías con feedback transparencia que genera "momento ¡Aha!" en operarios ("¡Me escucharon!").

**Notas de implementación:**
- Búsqueda predictiva global con debouncing 300ms
- Formulario simple para operarios (equipo + descripción + foto)
- Notificaciones push transparencia en cada transición
- Código de colores: 🌸 Rosa (avería), ⚪ Blanco (reparación)
- Confirmación de operario al completar OT

---

### Epic 4: Tablero Kanban Digital de Órdenes de Trabajo

Supervisores y técnicos gestionan órdenes de trabajo en un tablero Kanban digital con 8 estados, asignación visual drag-and-drop, y modal ℹ️ con trazabilidad completa. Incluye vista de listado con filtros, sincronización en tiempo real entre vistas, y soporte para reparaciones internas y externas con código de colores.

**FRs cubiertos:** FR11-FR31 (21 FRs)

**Valor entregado:** Gestión visual completa de OTs que reemplaza pizarra Kanban física y WhatsApp con trazabilidad total y sincronización multi-dispositivo.

**Notas de implementación:**
- Kanban 8 columnas: Pendiente Triage → Asignaciones (dividida) → En Progreso → Pendiente Repuesto → Pendiente Parada → Reparación Externa → Completadas → Descartadas
- SSE endpoint /api/kanban/stream para real-time sync <1s
- Modal ℹ️ con fechas, origen, técnico, repuestos, proveedor, teléfono
- Código de colores: 🔴 Rojizo (propio), 🔴📏 (externo viene), 🟡 (taller), 🔵 (enviado)
- Dropdowns condicionales que filtran técnicos por skills y ubicación
- TanStack Query para state management con cache invalidation

---

### Epic 5: Gestión de Repuestos y Proveedores

Los técnicos ven stock y ubicación de repuestos al seleccionarlos durante una OT, el stock se actualiza automáticamente al usar repuestos, y el gestor de inventario recibe alertas solo de stock mínimo (sin spam por cada uso). Incluye catálogos de proveedores de mantenimiento y repuestos, generación de pedidos, e importación masiva CSV.

**FRs cubiertos:** FR44-FR57 + FR77-FR80 (18 FRs)

**Valor entregado:** Control total de inventario sin interrupciones constantes (de 10+ llamadas/día a 1 llamada en toda la mañana).

**Notas de implementación:**
- Stock visible al seleccionar repuesto (sin página separada)
- Alertas únicamente de stock mínimo (NO spam por uso individual)
- Ubicación física en formato "Estante A3, Cajón 3"
- Auto-actualización de stock al registrar uso en OT
- Catálogos separados: proveedores mantenimiento vs repuestos
- Validación de proveedores durante importación CSV

---

### Epic 6: Rutinas de Mantenimiento Preventivo

Los usuarios configuran rutinas de mantenimiento con frecuencias diarias, semanales o mensuales. El sistema genera automáticamente órdenes de trabajo basadas en las rutinas programadas, muestra el porcentaje de rutinas completadas en el dashboard y envía alertas cuando una rutina no se completa en el plazo previsto.

**FRs cubiertos:** FR81-FR84 (4 FRs)

**Valor entregado:** Automatización de mantenimiento preventivo que reduce averías correctivas y mejora MTBF.

**Notas de implementación:**
- Job scheduler para generación automática de OTs
- Frecuencias: daily, weekly, monthly
- KPI de rutinas en dashboard (% completadas)
- Alertas de rutinas vencidas

---

### Epic 7: Dashboard de KPIs y Análisis de Mantenimiento

Administradores y directores ven KPIs MTTR y MTBF calculados en tiempo real con drill-down de 4 niveles (Global → Planta → Línea → Equipo), reciben alertas accionables (stock mínimo, MTFR alto, rutinas no completadas) y exportan reportes a Excel .xlsx con múltiples hojas. Cada rol ve un dashboard específico al hacer login.

**FRs cubiertos:** FR85-FR95 (11 FRs)

**Valor entregado:** Datos para toma de decisiones fundamentadas en métricas en lugar de intuición ("Por primera vez tengo datos para reportar a dirección").

**Notas de implementación:**
- KPIs: MTTR, MTBF calculados en tiempo real
- Drill-down 4 niveles con agregaciones
- Métricas adicionales: OTs abiertas, técnicos activos, stock crítico
- Exportación Excel .xlsx con librería xlsx, múltiples hojas
- Dashboard role-based (operario, técnico, supervisor, admin)
- Caching 30-60s para KPIs (NFR-P5)

---

### Epic 8: PWA Multi-Dispositivo con Sincronización Real-Time

Los usuarios instalan la aplicación como nativa en dispositivos móviles y tablets, reciben notificaciones push, y la interfaz se adapta responsivamente a desktop (>1200px), tablet (768-1200px), móvil (<768px) y TV 4K. La sincronización multi-dispositivo es <1 segundo para OTs y <30 segundos para KPIs.

**FRs cubiertos:** FR96-FR100 (5 FRs)

**Valor entregado:** Accesibilidad total desde cualquier dispositivo con experiencia nativa y sincronización automática.

**Notas de implementación:**
- PWA manifest.json con iconos 192x192 y 512x512
- Service worker para offline parcial con sync al reconectar
- SSE para real-time sync <1s OTs, <30s KPIs
- Responsive breakpoints: Desktop (>1200px), Tablet (768-1200px), Mobile (<768px), TV (4K)
- Touch targets mínimos 44x44px (WCAG AA)
- Notificaciones push transparencia

---

## Epic 1: Fundación del Sistema - Usuarios y Control de Acceso

Los administradores pueden registrar usuarios, crear roles personalizados con capacidades específicas, y controlar el acceso a los módulos del sistema mediante un sistema de permisos granular. Los usuarios gestionan sus perfiles, cambian contraseñas y el sistema fuerza el cambio de contraseña temporal en el primer acceso.

**FRs cubiertos:** FR58-FR76 (19 FRs)

### Story 1.1: Inicialización del Proyecto con Next.js y Configuración de Base de Datos

Como **desarrollador**, quiero **inicializar el proyecto Next.js 15 con Prisma y Neon PostgreSQL**, para **tener la base técnica sobre la cual construir todas las funcionalidades del sistema**.

**Acceptance Criteria:**

**Given** que el proyecto se inicializa con Next.js 15 App Router
**When** se ejecuta el comando de inicialización con TypeScript, Tailwind, ESLint, src directory
**Then** el proyecto se crea exitosamente con la estructura de carpetas src/app, src/components, src/lib, src/hooks, src/types
**And** Prisma se inicializa con conexión a Neon PostgreSQL usando ?pgbouncer=true
**And** se crean las migraciones iniciales para las tablas User, Role, Capability, UserRole, RoleCapability
**And** se configura el seed script con 4 roles (Operario, Técnico, Supervisor, Admin) y 8 capacidades
**And** se crea el usuario admin inicial (admin@gmao-hiansa.com / Admin123!) con isFirstLogin=true

---

### Story 1.2: Sistema de Autenticación con NextAuth y Login de Usuario

Como **usuario del sistema**, quiero **iniciar sesión con mi email y contraseña**, para **acceder a las funcionalidades del sistema según mis permisos**.

**Acceptance Criteria:**

**Given** que el usuario tiene credenciales válidas registradas en el sistema
**When** ingresa su email y contraseña en el formulario de login
**Then** el sistema valida las credenciales usando bcrypt con 10 rounds
**And** si las credenciales son correctas, crea una sesión JWT con 8 horas de expiración
**And** redirige al usuario a su dashboard correspondiente según sus roles
**And** si isFirstLogin=true, redirige obligatoriamente a la pantalla de cambio de contraseña
**And** si las credenciales son incorrectas, muestra mensaje de error sin revelar si el usuario existe
**And** implementa rate limiting de 5 intentos por IP cada 15 minutos (NFR-S9)

**P0 Test Scenarios (TS-AUTH-001, TS-AUTH-002):**
- **TS-AUTH-001**: Usuario ingresa credenciales válidas → redirigido a dashboard correspondiente a su rol
- **TS-AUTH-002**: Usuario ingresa credenciales inválidas → mensaje de error visible; no hay redirección
- **TS-SEC-005**: Contraseña hasheada en base de datos (bcrypt/argon2); texto plano nunca almacenado
- **TS-SEC-003**: Rate limiting retorna 429 después de 5 intentos fallidos por IP en 15 minutos

**Testability Requirements:**
- Implementar `data-testid="email-input"`, `data-testid="password-input"`, `data-testid="login-button"`, `data-testid="error-message"`
- Mock endpoint para rate limiting: `/api/test-rate-limit` (reset contador on-demand)

---

### Story 1.3: Cambio Obligatorio de Contraseña en Primer Acceso

Como **usuario con contraseña temporal**, quiero **ser obligado a cambiar mi contraseña en el primer acceso**, para **garantizar la seguridad de mi cuenta**.

**Acceptance Criteria:**

**Given** que un usuario inicia sesión con isFirstLogin=true
**When** intenta navegar a cualquier ruta del sistema
**Then** el middleware redirige automáticamente a /change-password
**And** muestra un formulario con campos: contraseña actual, nueva contraseña, confirmación
**When** completa el formulario con una contraseña válida (mínimo 8 caracteres)
**Then** el sistema hashea la nueva contraseña con bcrypt
**And** actualiza isFirstLogin=false y lastPasswordChange=now
**And** redirige al usuario al dashboard correspondiente
**And** registra la acción en el historial de actividad (FR72)

---

### Story 1.4: Gestión de Roles y Capacidades por Administrador

**⚠️ REESCRITA según Sprint Change Proposal (2026-03-01) - Transición RBAC → PBAC**

Como **administrador**, quiero **crear roles personalizados que actúen como etiquetas de clasificación de usuarios (sin herencia de capacidades)**, para **organizar usuarios por categorías (Operario, Técnico, Supervisor) sin que los roles otorguen capacidades automáticamente**.

**Acceptance Criteria:**

**Given** que el administrador tiene la capacidad can_assign_technicians
**When** accede a la sección de gestión de roles
**Then** ve listado de roles existentes (4 roles del sistema + roles personalizados)
**When** crea un nuevo rol con nombre único
**Then** el rol se crea SIN asignación de capacidades (roles son solo etiquetas)
**And** el sistema valida que no exista otro rol con el mismo nombre
**And** el sistema valida que no exceda el límite de 20 roles personalizados (FR59)
**And** puede editar roles existentes modificando solo su nombre
**And** puede eliminar roles personalizados (no los 4 roles del sistema: Operario, Técnico de Mantenimiento, Supervisor de Mantenimiento, Administrador)

**CAMBIOS CRÍTICOS DESDE RBAC → PBAC:**
- ❌ **ELIMINADO:** "Las capacidades se asignan a roles"
- ❌ **ELIMINADO:** Herencia automática de capacidades desde roles
- ✅ **NUEVO:** "Los roles son solo etiquetas de clasificación"
- ✅ **NUEVO:** "Un rol NO otorga capacidades automáticamente"
- ✅ **NUEVO:** "El admin puede crear roles personalizados (máx. 20)"

**P0 Test Scenarios:**
- **TS-AUTH-005**: Admin crea rol personalizado → rol creado como etiqueta; sin capacidades asociadas
- **TS-AUTH-006**: Admin edita nombre de rol → nombre actualizado; usuarios con rol mantienen sus capacidades individuales
- **TS-AUTH-007**: Admin intenta crear rol duplicado → mensaje de error; no se crea rol
- **TS-AUTH-008**: Admin intenta eliminar rol del sistema → error; solo roles personalizados pueden eliminarse

**Testability Requirements:**
- Seeding API `/api/test-data` para crear roles de prueba
- `data-testid="role-name-input"` para input de nombre de rol
- `data-testid="create-role-button"` para botón de crear rol
- `data-testid="role-list-item-{role-name}"` para cada rol en la lista

---

### Story 1.5: Registro de Usuarios y Asignación de Roles

**⚠️ REESCRITA según Sprint Change Proposal (2026-03-01) - Transición RBAC → PBAC**

Como **administrador**, quiero **registrar nuevos usuarios asignando un rol (etiqueta) y capacidades individuales mediante checkboxes**, para **incorporar personas al sistema con permisos granulares y flexibles**.

**Acceptance Criteria:**

**Given** que el administrador tiene la capacidad can_assign_technicians
**When** accede al formulario de registro de usuarios
**Then** completa campos obligatorios: nombre, email, contraseña temporal
**When** selecciona un rol del dropdown (predefinido o personalizado)
**Then** el rol es solo una etiqueta de clasificación (no otorga capacidades)
**When** marca checkboxes de las 9 capacidades individuales
**Then** `can_create_failure_report` está marcada por defecto (predeterminada)
**And** puede seleccionar/deseleccionar cualquier otra capability
**When** completa el registro
**Then** el sistema crea el usuario con password hash (bcrypt, 10 rounds)
**And** el usuario tiene `can_create_failure_report` asignada (siempre)
**And** el usuario tiene las capabilities seleccionadas individualmente
**And** `isFirstLogin` se establece en `true`
**And** el sistema registra la acción en el log de auditoría (FR72)

**CAMBIOS CRÍTICOS DESDE RBAC → PBAC:**
- ❌ **ELIMINADO:** "El usuario hereda todas las capacidades del rol asignado"
- ✅ **NUEVO:** "El admin selecciona un rol del dropdown (predefinido o personalizado)"
- ✅ **NUEVO:** "El rol es solo una etiqueta, no otorga capacidades"
- ✅ **NUEVO:** "El admin marca checkboxes de 9 capacidades individuales"
- ✅ **MANTENIDO:** "Todo usuario nuevo tiene `can_create_failure_report` predeterminada"

**9 Capabilities del Sistema:**
1. `can_create_failure_report` (PREDETERMINADA - siempre marcada)
2. `can_create_manual_ot`
3. `can_update_own_ot`
4. `can_view_own_ots` ← NUEVA
5. `can_view_all_ots`
6. `can_complete_ot`
7. `can_manage_stock`
8. `can_assign_technicians`
9. `can_view_kpis`

---

### Story 1.6: Perfil de Usuario y Gestión de Credenciales

**⚠️ REESCRITA según Sprint Change Proposal (2026-03-01) - Transición RBAC → PBAC**

Como **usuario del sistema**, quiero **acceder a mi perfil para ver mi rol (etiqueta) y mis capacidades individuales**, para **entender qué puedo hacer en el sistema según mis permisos asignados**.

**Acceptance Criteria:**

**Given** que el usuario está autenticado
**When** accede a la sección de perfil (/profile)
**Then** ve su información personal: nombre, email, teléfono
**And** ve su rol actual (ej: "Técnico de Mantenimiento") como etiqueta
**And** ve la lista completa de sus capacidades asignadas individualmente
**And** las capaciciones se muestran con nombre descriptivo (ej: 'Ver todas las OTs', 'Gestionar stock')
**When** edita su información personal (nombre, teléfono)
**Then** los cambios se guardan y se registran en el historial de actividad (FR72)
**When** solicita cambiar su contraseña
**Then** debe ingresar su contraseña actual para confirmar identidad
**And** ingresa la nueva contraseña dos veces para confirmar
**And** el sistema hashea la nueva contraseña (bcrypt, 10 rounds)
**And** actualiza `lastPasswordChange` y `isFirstLogin=false`
**And** muestra mensaje de éxito y cierra sesión por seguridad

**CAMBIOS CRÍTICOS DESDE RBAC → PBAC:**
- ✅ **NUEVO:** "El usuario ve su rol actual (ej: Técnico de Mantenimiento)"
- ✅ **NUEVO:** "El usuario ve la lista completa de sus 9 capacidades"
- ✅ **NUEVO:** "Las capaciciones se muestran con nombre descriptivo"

---

### Story 1.7: Control de Acceso por Módulos Basado en Capacidades

Como **usuario del sistema**, quiero **ver solo los módulos de navegación para los cuales tengo capacidades**, para **no acceder a secciones que no corresponden a mis funciones**.

**Acceptance Criteria:**

**Given** que un usuario tiene ciertas capacidades asignadas
**When** accede al sistema
**Then** la navegación lateral muestra solo los módulos correspondientes a sus capacidades (FR74)
**When** intenta acceder a una URL directa de un módulo no autorizado
**Then** el middleware deniega el acceso automáticamente (FR75)
**And** muestra un mensaje explicativo: "No tienes permisos para acceder a este módulo" (FR76)
**And** la acción se registra en el log de auditoría
**And** el sistema implementa ACL checks usando helper functions hasCapability() y requireCapability()

---

### Story 1.8: Historial de Actividad del Usuario

Como **administrador**, quiero **ver el historial de actividad de un usuario durante los últimos 6 meses**, para **auditar acciones críticas y detectar comportamientos inusuales**.

**Acceptance Criteria:**

**Given** que el administrador accede al perfil de un usuario
**When** hace clic en "Ver historial de actividad"
**Then** ve una lista de acciones críticas con timestamps:
- Login/Logout con IP y timestamp
- Cambios de perfil (nombre, email, teléfono)
- Cambios de roles asignados
- Cambios de contraseña
**And** el historial muestra solo los últimos 6 meses (FR72)
**And** las acciones están paginadas (20 por página) con filtros por tipo de acción y rango de fechas
**And** cada entrada muestra: fecha, hora, acción, IP address, detalles adicionales

---

### Story 1.9: Migración Completa a shadcn/ui - Estandarización de Componentes UI

**⚠️ NUEVA STORY - Creada via Sprint Change Proposal (2026-03-03)**

Como **desarrollador del sistema**, quiero **migrar TODAS las páginas y componentes a shadcn/ui**, para **garantizar consistencia visual, accesibilidad WCAG AA y mantenimiento simplificado del código**.

**Contexto:**
El proyecto adoptó shadcn/ui el 2026-03-02 según architecture.md, estableciendo la regla crítica: **"ALL NEW pages MUST use shadcn/ui components"**. Sin embargo, un análisis exhaustivo reveló que 16 archivos violan esta regla, usando HTML nativo con clases Tailwind en lugar de componentes shadcn/ui (Card, Input, Button, Alert, Badge).

**Acceptance Criteria:**

**Given** que un componente/página usa HTML nativo con clases Tailwind
**When** se migra a componentes shadcn/ui
**Then** NO existen clases CSS personalizadas para UI estándar (cards, buttons, inputs, alerts)
**And** Todos los `data-testid` se preservan para compatibilidad con tests
**And** Los componentes importan desde `@/components/ui/*`
**And** La funcionalidad es idéntica (no breaking changes)
**And** Los tests E2E continúan pasando sin modificaciones

**Fase 1: Páginas Críticas (Prioridad ALTA)**

**1.9.1 Login Page Migration**
- **Archivo:** `src/app/(auth)/login/page.tsx`
- **Migrar:**
  - Línea 103: `<div className="bg-white p-8 rounded shadow">` → `<Card>` + `<CardContent>`
  - Línea 104: `<h1>` → `<CardTitle>`
  - Líneas 106-113: `<div className="bg-red-50 text-red-600">` → `<Alert variant="destructive">`
  - Líneas 115-126: `<label>` → `<Label>`, `<input className="...">` → `<Input>`
  - Líneas 128-139: `<label>` → `<Label>`, `<input className="...">` → `<Input>`
  - Líneas 141-148: `<button className="bg-blue-600">` → `<Button variant="default">`
- **Preservar:** `data-testid="email-input"`, `data-testid="password-input"`, `data-testid="login-button"`, `data-testid="error-message"`
- **Validar:** Tests E2E de login pasan sin cambios

**1.9.2 Change-Password Page Migration**
- **Archivo:** `src/app/change-password/page.tsx`
- **Migrar a:** `<Card>`, `<Input>`, `<Label>`, `<Button>`, `<Alert>`
- **Preservar:** Todos los `data-testid`

**1.9.3 Kanban Page Migration**
- **Archivo:** `src/app/(dashboard)/kanban/page.tsx`
- **Migrar:** `<div className="mt-8 bg-white p-6">` → `<Card>`

**1.9.4 KPIs Page Migration**
- **Archivo:** `src/app/(dashboard)/kpis/page.tsx`
- **Migrar:** `<div className="mt-8 bg-white p-6">` → `<Card>`

**1.9.5 Work-Orders Page Migration**
- **Archivo:** `src/app/(dashboard)/work-orders/page.tsx`
- **Migrar:** `<div className="mt-8 bg-white p-6">` → `<Card>`

**Fase 2: Páginas Secundarias (Prioridad MEDIA)**

**1.9.6 Failures/New Page**
- **Archivo:** `src/app/failures/new/page.tsx` → `<Card>`

**1.9.7 Access-Denied Page**
- **Archivo:** `src/app/access-denied/page.tsx` → `<Card>`, `<Alert>`

**1.9.8 Unauthorized Page**
- **Archivo:** `src/app/(dashboard)/unauthorized/page.tsx` → Eliminar clases CSS custom, usar `<Card>`, `<Alert>`, `<Button>`

**1.9.9 Profile Page**
- **Archivo:** `src/app/(dashboard)/profile/page.tsx` → Layout review

**1.9.10 Roles Page**
- **Archivo:** `src/app/(dashboard)/roles/page.tsx` → `<Card>`, `<Alert>`

**Fase 3: Componentes (Prioridad MEDIA)**

**1.9.11 RoleBadge Component**
- **Archivo:** `src/components/roles/RoleBadge.tsx` → `<Badge>`

**1.9.12 RoleList Component**
- **Archivo:** `src/components/roles/RoleList.tsx` → `<Button>`, `<Input>`, `<Card>`

**1.9.13 RoleForm Component**
- **Archivo:** `src/components/roles/RoleForm.tsx` → `<Label>`, `<Input>`, `<Alert>`, `<Button>`, `<Card>`

**P0 Test Scenarios:**

- **TS-UI-001:** Login page usa Card, Input, Label, Button, Alert de shadcn/ui
- **TS-UI-002:** Change-password page usa Card, Input, Label, Button, Alert de shadcn/ui
- **TS-UI-003:** NO existen elementos con clases `bg-white p-6 rounded` o `bg-blue-600`
- **TS-UI-004:** Todos los botones usan `<Button variant="default|outline|destructive">`
- **TS-UI-005:** Tests E2E pasan sin modificar selectores (data-testid preserved)

**Testability Requirements:**

- Preservar todos los `data-testid` existentes
- NO agregar tests nuevos (validación visual es suficiente)
- Verificar que tests E2E existentes pasen sin cambios

**Quality Gates:**

- [ ] Todas las páginas críticas migradas a shadcn/ui
- [ ] Todos los `data-testid` preservados
- [ ] Tests E2E pasan sin modificaciones
- [ ] NO existen clases CSS custom para UI estándar
- [ ] Documentación SHADCN-PATTERNS.md actualizada si es necesario

**Definition of Done:**

- [ ] Código implementado según acceptance criteria
- [ ] Tests E2E pasan (login, change-password, etc.)
- [ ] Code review aprobado
- [ ] Merge a branch `main`
- [ ] Sprint Change Proposal archivada como "approved"

**Estimación:** 2-3 días (Fase 1: 1 día, Fase 2: 1 día, Fase 3: 0.5 día, buffer: 0.5 día)
**Prioridad:** ALTA (bloquea consistencia de UI en todo el proyecto)
**Riesgos:** BAJOS (refactorización UI, no lógica de negocio, tests existentes preservados)
**Dependencies:** Componentes shadcn/ui YA instalados (12 paquetes según architecture.md)

**Referencias:**
- Sprint Change Proposal: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-03.md`
- Patrones: `docs/SHADCN-PATTERNS.md`
- Reglas: `docs/project-context.md` (líneas 42-71)

---

## Epic 2: Gestión de Activos y Jerarquía de Equipos

Los usuarios pueden navegar y gestionar la jerarquía completa de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), ver el historial de mantenimiento de cada equipo, gestionar el stock de equipos reutilizables y realizar importaciones masivas desde archivos CSV validados.

**FRs cubiertos:** FR32-FR43 (12 FRs)

#### Quality Gates (Epic 2)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **Search Performance** | Búsqueda predictiva P95 <200ms con 10K+ activos | SÍ | P0 |
| **CSV Validation** | Validación de estructura jerárquica con 10K+ casos de prueba | SÍ | P0 |
| **Full-Text Search** | PostgreSQL FTS implementado y benchmarked | SÍ | P0 |

**Riesgos Asociados (del Test Design):**
- **R-TECH-002** (Score 6): CSV import validation edge cases - Mitigación: Test harness con 10K+ casos
- **R-TECH-004** (Score 6): Predictive search performance con 10K+ activos - Mitigación: PostgreSQL FTS + benchmark
- **R-PERF-002** (Score 6): Búsqueda predictiva <200ms - Mitigación: Performance tests con dataset de 10K+ activos

#### Testability Requirements (Epic 2)

**Requisitos Previos a la Implementación:**
- Seeding API `/api/test-data/assets` para crear 10K+ activos de prueba
- Full-Text Search (PostgreSQL FTS) implementado antes de empezar epic
- CSV validation test harness con edge cases (duplicados, referencias rotas, profundidad >5)

**data-testid Attributes Requeridos:**
```html
<!-- Asset Management -->
<input data-testid="asset-code-input" />
<input data-testid="asset-name-input" />
<select data-testid="asset-category-select" />
<button data-testid="create-asset-button" />
<div data-testid="asset-list" />

<!-- CSV Import -->
<input data-testid="csv-upload-input" />
<div data-testid="progress-bar" />
<div data-testid="validation-summary" />

<!-- Search -->
<input data-testid="asset-search-input" />
<div data-testid="search-results-dropdown" />
```

### Story 2.1: Gestión de Activos con Jerarquía de 5 Niveles

Como **administrador**, quiero **crear y editar activos en la jerarquía de 5 niveles**, para **construir la estructura completa de activos de la fábrica desde Planta hasta Repuesto**.

**Acceptance Criteria:**

**Given** que el administrador accede al módulo de Activos por primera vez
**When** el sistema inicializa el módulo
**Then** crea automáticamente el modelo de datos Prisma Asset con campos: id, name, code (unique), status, parentId (nullable)
**And** parentId implementa self-reference para jerarquía de 5 niveles
**And** status enum: OPERATIONAL, FAULTED, IN_REPAIR, RETIRED, BLOCKED (FR36)
**And** se crea la relación many-to-many ComponentAsset para componentes multi-equipos (FR34)
**And** se agregan índices para optimizar búsquedas: @@index([code]), @@index([parentId])
**And** se implementa relación bidireccional: parent (Asset?) y children (Asset[])
**And** se crea relación workOrders (WorkOrder[])

**Given** que el administrador crea un nuevo activo
**When** completa el formulario
**Then** ingresa: nombre, código único, estado (por defecto OPERATIONAL)
**And** selecciona el activo padre en la jerarquía usando dropdown predictivo
**And** el sistema valida que el código no exista (error si ya existe)
**And** el sistema valida que no exceda los 5 niveles de profundidad
**When** edita un activo existente
**Then** puede modificar: nombre, estado, activo padre
**And** el sistema valida que al cambiar de padre no se rompa la regla de 5 niveles
**And** registra la acción en el log de auditoría (cambio de estado es acción crítica)

**P0 Test Scenarios (TS-ASM-001, TS-ASM-002):**
- **TS-ASM-001**: Usuario crea activo con campos requeridos → modelo Asset creado automáticamente; activo creado; redirect a lista de activos
- **TS-ASM-002**: Búsqueda predictiva con 10K+ activos en DB → respuesta <200ms (P95)

---

### Story 2.2: Navegación Jerárquica de Activos

Como **usuario**, quiero **navegar la jerarquía de activos en cualquier dirección**, para **explorar la estructura desde Planta hasta Repuesto y viceversa**.

**Acceptance Criteria:**

**Given** que el usuario accede al módulo de Activos
**When** selecciona un activo en la jerarquía
**Then** ve información del activo: nombre, código, estado, nivel en jerarquía
**And** ve navegación hacia arriba: breadcrumb "Planta > Línea > Equipo > Componente"
**And** ve navegación hacia abajo: lista de activos hijos (si existen)
**And** puede hacer clic en cualquier nivel del breadcrumb para navegar
**When** visualiza un componente que pertenece a múltiples equipos
**Then** ve la sección "Equipos que usan este componente" con lista de activos relacionados
**And** puede hacer clic en cualquier equipo para navegar a ese activo

---

### Story 2.3: Componentes Multi-Equipos (Relación Muchos-a-Muchos)

Como **administrador**, quiero **asociar un componente a múltiples equipos**, para **representar situaciones donde un componente se reutiliza en diferentes equipos**.

**Acceptance Criteria:**

**Given** que se edita un activo de tipo Componente
**When** accede a la sección "Equipos relacionados"
**Then** ve un campo de búsqueda predictiva para agregar equipos
**And** puede seleccionar múltiples equipos de la lista
**When** guarda las relaciones
**Then** el sistema crea registros en la tabla ComponentAsset (many-to-many)
**And** desde la vista de cualquier Equipo relacionado, ve el componente listado
**And** puede eliminar relaciones desde cualquiera de los dos lados
**And** la relación es completamente bidireccional y navegable

---

### Story 2.4: Historial de Órdenes de Trabajo por Activo

Como **técnico**, quiero **ver el historial de órdenes de trabajo de un equipo específico**, para **conocer su historial de mantenimiento e intervenir de forma más informada**.

**Acceptance Criteria:**

**Given** que el técnico accede al detalle de un Activo
**When** hace clic en "Ver historial de mantenimiento"
**Then** ve una lista de todas las OTs asociadas a ese activo
**And** cada OT muestra: código, estado, fechas, técnico asignado, descripción del problema
**And** las OTs están ordenadas por fecha descendente (más recientes primero)
**And** puede filtrar por: estado, rango de fechas, técnico
**And** puede hacer clic en cualquier OT para ver detalles completos (modal ℹ️)
**And** el historial incluye OTs de rutinas, correctivos y reparaciones

---

### Story 2.5: Gestión de Estados de Equipos

Como **administrador**, quiero **cambiar el estado de un equipo (Operativo, Averiado, En Reparación, Retirado, Bloqueado)**, para **reflejar su condición actual en el sistema**.

**Acceptance Criteria:**

**Given** que el administrador edita un Activo
**When** cambia el campo de estado
**Then** puede seleccionar entre: OPERATIONAL, FAULTED, IN_REPAIR, RETIRED, BLOCKED
**And** el sistema muestra un indicador visual del estado actual (badge con color)
**When** selecciona BLOCKED
**Then** el sistema solicita confirmación obligatoria con motivo del bloqueo
**And** una vez bloqueado, no se pueden asignar nuevas OTs a ese equipo
**And** solo administradores pueden desbloquear el equipo
**And** el cambio de estado se registra en el log de auditoría (acción crítica)

---

### Story 2.6: Importación Masiva CSV de Activos

Como **administrador**, quiero **importar activos masivamente desde un archivo CSV**, para **cargar miles de activos rápidamente sin ingreso manual**.

**Acceptance Criteria:**

**Given** que el administrador accede al módulo de Activos
**When** hace clic en "Importar CSV"
**Then** puede descargar una plantilla CSV con el formato requerido (FR43)
**And** la plantilla incluye columnas: código, nombre, código_padre, estado
**When** sube un archivo CSV
**Then** el sistema valida la estructura jerárquica nivel por nivel (FR41)
**And** valida que todos los códigos de padre existan previamente
**And** valida que no haya códigos duplicados
**When** la validación es exitosa
**Then** crea los activos en lote usando transacciones de Prisma
**And** muestra un reporte de resultados: éxitos, errores, advertencias (FR42)
**And** si hay errores críticos, hace rollback completo de la importación (NFR-I4)

**P0 Test Scenarios (TS-ASM-008, TS-ASM-010):**
- **TS-ASM-008**: CSV con 1000+ filas → indicador de progreso mostrado; resumen de validación displayed
- **TS-ASM-010**: CSV con conflictos (códigos duplicados, categorías inválidas) → conflictos reportados; filas válidas procesadas

**Testability Requirements:**
- Mock endpoint `/api/test-csv-validate` para inyectar CSVs con edge cases
- Progress bar con `data-testid="progress-bar"`
- Validation summary con `data-testid="validation-summary"`

---


## Epic 3: Reporte de Averías con Feedback Transparencia

Los operarios pueden reportar averías en menos de 30 segundos usando búsqueda predictiva, describir el problema y adjuntar fotos. Reciben notificaciones push de cada cambio de estado (recibido, autorizado, en progreso, completado) y confirman si la reparación funciona correctamente. Los supervisores ven los avisos en columna de triage y los convierten en OTs o los descartan.

**FRs cubiertos:** FR1-FR10 (10 FRs)

#### Quality Gates (Epic 3)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **Predictive Search** | Búsqueda <200ms (P95) con debouncing 300ms | SÍ | P0 |
| **Push Notifications** | Notificaciones push entregadas en <1s | NO (P1) | P1 |
| **Photo Upload** | Upload de fotos <5s en WiFi industrial | NO (P1) | P1 |

**Riesgos Asociados (del Test Design):**
- **R-PERF-002** (Score 6): Predictive search performance - Mitigación: Benchmark con 10K+ activos
- **R-PERF-001** (Score 6): SSE scalability para notificaciones - Mitigación: Load test con 50 usuarios concurrentes

#### Testability Requirements (Epic 3)

**Requisitos Previos a la Implementación:**
- SSE Mock Endpoint con fault injection para testing de reconexión
- Dataset de prueba con 10K+ activos para performance testing

**data-testid Attributes Requeridos:**
```html
<!-- Failure Report Form -->
<input data-testid="asset-search-input" />
<textarea data-testid="description-input" />
<input data-testid="photo-upload-input" />
<button data-testid="submit-report-button" />

<!-- Triage Column -->
<div data-testid="triage-column" />
<div data-testid="report-card-{code}" />
<div data-testid="convert-to-ot-button" />
```

### Story 3.1: Búsqueda Predictiva de Equipos en Tiempo Real

Como **operario**, quiero **buscar equipos usando autocompletado predictivo mientras escribo**, para **encontrar el equipo en menos de 200ms sin necesidad de navegar toda la jerarquía**.

**Acceptance Criteria:**

**Given** que el operario está en el formulario de reporte de avería
**When** empieza a escribir en el campo "Equipo" (mínimo 2 caracteres)
**Then** el sistema activa la búsqueda predictiva con debouncing de 300ms
**And** busca en los campos: código, nombre, nombre del padre
**And** devuelve resultados en menos de 200ms (NFR-P1)
**And** muestra máximo 5 sugerencias en dropdown
**And** cada sugerencia muestra: código, nombre, ruta jerárquica completa
**When** selecciona una sugerencia
**Then** el campo se completa automáticamente con el equipo seleccionado

---

### Story 3.2: Formulario de Reporte de Avería Simplificado

Como **operario**, quiero **reportar una avería llenando un formulario simple con equipo, descripción y foto opcional**, para **comunicar problemas en menos de 30 segundos**.

**Acceptance Criteria:**

**Given** que el operario accede al módulo de Averías
**When** hace clic en "Reportar nueva avería"
**Then** ve un formulario con campos:
- Campo "Equipo" con búsqueda predictiva (obligatorio)
- Campo "Descripción del problema" (obligatorio, mínimo 20 caracteres)
- Campo "Adjuntar foto" (opcional, máximo 5 fotos)
- Campo "Tipo de avería": Eléctrica, Mecánica, Neumática, Otra
- Campo "Urgencia": Baja, Media, Alta, Crítica
**When** completa los campos obligatorios
**Then** puede hacer clic en "Enviar avería"
**And** el sistema valida que la descripción tenga al menos 20 caracteres
**And** las fotos se suben a almacenamiento y se asocian al aviso

---

### Story 3.3: Creación de Aviso de Avería con Confirmación Inmediata

Como **operario**, quiero **recibir confirmación inmediata con número de aviso generado al reportar una avería**, para **saber que mi reporte fue recibido correctamente**.

**Acceptance Criteria:**

**Given** que el operario completa el formulario de avería
**When** hace clic en "Enviar avería"
**Then** el sistema crea el registro de Aviso en estado TRIAGE
**And** genera un código único de aviso (ej: AV-234)
**And** registra timestamp de creación
**And** asocia el aviso al equipo seleccionado
**And** muestra confirmación inmediata: "✓ Aviso #AV-234 recibido - Evaluando"
**And** envía notificación push al supervisor de turno
**And** el color del aviso se establece como ROSA (avería) o BLANCO (reparación) según selección (FR10)

---

### Story 3.4: Columna de Triage para Supervisores

Como **supervisor**, quiero **ver todos los avisos nuevos en una columna de triage**, para **evaluarlos rápidamente y decidir si convertirlas en OTs o descartarlas**.

**Acceptance Criteria:**

**Given** que el supervisor accede al tablero Kanban
**When** ve la columna "Pendiente Triage"
**Then** ve todos los avisos en estado TRIAGE como tarjetas
**And** cada tarjeta muestra: código de aviso, equipo, tipo de avería, urgencia, timestamp, operario
**And** las tarjetas tienen colores: 🌸 Rosa (avería), ⚪ Blanco (reparación) (FR10)
**And** las tarjetas con urgencia Alta/Crítica tienen borde rojo
**When** hace clic en una tarjeta
**Then** se abre modal ℹ️ con detalles completos: fechas, operario, equipo, descripción, fotos

---

### Story 3.5: Conversión de Aviso a Orden de Trabajo

Como **supervisor**, quiero **convertir un aviso de avería en una orden de trabajo**, para **iniciar el flujo de gestión de mantenimiento**.

**Acceptance Criteria:**

**Given** que el supervisor está en modal ℹ️ de un aviso
**When** hace clic en "Convertir en OT"
**Then** el sistema crea una nueva OT con estado PENDING_ASSIGNMENT
**And** genera código único de OT (ej: OT-567)
**And** copia información del aviso: equipo, descripción, fotos, urgencia
**And** asocia la OT al aviso original (relación padre-hijo)
**And** cambia el estado del aviso de TRIAGE a CONVERTIDO
**And** la tarjeta del aviso desaparece de columna "Pendiente Triage"
**And** aparece nueva tarjeta OT en columna "Asignaciones"
**And** la tarjeta OT tiene color 🔴 Rojizo (correctivo) por defecto (FR22)

---

### Story 3.6: Descarte de Avisos No Procedentes

Como **supervisor**, quiero **descartar avisos que no son procedentes**, para **mantener el tablero limpio de averías falsas o duplicadas**.

**Acceptance Criteria:**

**Given** que el supervisor está en modal ℹ️ de un aviso
**When** hace clic en "Descartar aviso"
**Then** el sistema solicita motivo obligatorio del descarte
**And** presenta opciones predefinidas: "Falso reporte", "Duplicado", "Fuera de alcance", "Otro"
**When** el supervisor completa el motivo
**Then** cambia el estado del aviso de TRIAGE a DISMISSED
**And** registra el motivo del descarte y el supervisor que lo realizó
**And** la tarjeta desaparece de columna "Pendiente Triage"
**And** el operario que reportó recibe notificación: "Tu aviso #AV-234 fue descartado. Motivo: [motivo]"
**And** la acción se registra en el log de auditoría

---

### Story 3.7: Notificaciones Push de Cambios de Estado

Como **operario**, quiero **recibir notificaciones push cuando mi aviso cambia de estado**, para **tener transparencia total sobre el progreso de mi reporte**.

**Acceptance Criteria:**

**Given** que un operario reportó una avería
**When** el supervisor convierte el aviso en OT
**Then** el operario recibe notificación push: "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a [Técnico]"
**When** el técnico inicia la OT
**Then** recibe notificación: "OT #OT-567 en progreso - [Técnico] está trabajando"
**When** el técnico completa la OT
**Then** recibe notificación: "OT #OT-567 completada - ¿Confirma que funciona bien?"
**When** el operario confirma
**Then** recibe notificación: "Gracias por tu reporte - Aviso #AV-234 cerrado"
**And** todas las notificaciones tienen timestamp y link a la OT/aviso

---

### Story 3.8: Confirmación de Operario "¿Funciona?"

Como **operario**, quiero **confirmar si una reparación funciona correctamente después de completada**, para **cerrar el ciclo del reporte y validar la calidad del trabajo**.

**Acceptance Criteria:**

**Given** que un técnico completó una OT
**When** el operario recibe notificación push
**Then** la notificación dice: "OT #OT-567 completada - ¿Confirma que su [equipo] funciona bien?"
**And** presenta dos botones: "Sí, funciona bien", "No, tiene problemas"
**When** el operario toca "Sí, funciona bien"
**Then** la OT se marca como CONFIRMED_BY_OPERATOR
**And** el sistema envía mensaje: "Gracias por tu reporte"
**And** registra timestamp de confirmación
**When** el operario toca "No, tiene problemas"
**Then** la OT vuelve a estado IN_PROGRESS
**And** el técnico y supervisor reciben notificación: "Operario reportó problemas - OT #OT-567 requiere atención"
**And** se inicia un nuevo ciclo de reparación

---
## Epic 4: Tablero Kanban Digital de Órdenes de Trabajo

Supervisores y técnicos gestionan órdenes de trabajo en un tablero Kanban digital con 8 estados, asignación visual drag-and-drop, y modal ℹ️ con trazabilidad completa. Incluye vista de listado con filtros, sincronización en tiempo real entre vistas, y soporte para reparaciones internas y externas con código de colores.

**FRs cubiertos:** FR11-FR31 (21 FRs)

#### Quality Gates (Epic 4)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **SSE Scalability** | Sync <1s across 50 concurrent users | SÍ | P0 |
| **Kanban Performance** | Carga inicial <3s con 100+ OTs concurrentes | SÍ | P0 |
| **Concurrent Edits** | Optimistic locking implementado; tests de concurrencia pasan | SÍ | P0 |
| **Drag-and-Drop** | Drag & drop funcional en todas las columnas | SÍ | P0 |
| **Priority Scheduling** | Algoritmo de prioridad unit testeado con edge cases | NO (P1) | P1 |

**Riesgos Asociados (del Test Design):**
- **R-PERF-001** (Score 6): SSE scalability bottleneck - Mitigación: Load test con 50 usuarios concurrentes
- **R-DATA-001** (Score 6): Work order state corruption (SSE race conditions) - Mitigación: Optimistic locking + concurrency tests
- **R-BUS-001** (Score 6): Priority scheduling algorithm errors - Mitigación: Unit tests con edge cases
- **R-TECH-001** (Score 6): SSE reconnection not handled - Mitigación: Mock SSE endpoint con fault injection

#### Testability Requirements (Epic 4)

**Requisitos Previos a la Implementación:**
- SSE Mock Endpoint `/api/test-sse` con fault injection (disconnect, delay, duplicate)
- Test tenant isolation para parallel test execution (`x-test-tenant` header)
- Optimistic locking implementado antes de empezar epic

**data-testid Attributes Requeridos:**
```html
<!-- Kanban Board -->
<div data-testid="kanban-board" />
<div data-testid="wo-card-{code}" />
<div data-testid="column-backlog" />
<div data-testid="column-in-progress" />
<div data-testid="column-completed" />

<!-- Work Order Form -->
<input data-testid="wo-title-input" />
<select data-testid="wo-priority-select" />

<!-- Modal Info -->
<div data-testid="modal-dialog" />
<button data-testid="confirm-button" />
<button data-testid="cancel-button" />
```

### Story 4.1: Tablero Kanban con 8 Columnas y Sincronización Real-Time

Como **supervisor**, quiero **ver todas las OTs organizadas en un tablero Kanban con 8 columnas**, para **tener visibilidad instantánea del estado de todas las órdenes de trabajo**.

**Acceptance Criteria:**

**Given** que el supervisor accede al módulo de Órdenes de Trabajo por primera vez
**When** el sistema inicializa el módulo
**Then** crea automáticamente el modelo de datos Prisma WorkOrder con campos: id, code (unique), status, priority, assetId, assignedTo, failureReportId
**And** status enum con 8 estados: TRIAGE, PENDING_ASSIGNMENT, IN_PROGRESS, PENDING_SPARE_PART, PENDING_LINE_STOP, EXTERNAL_REPAIR, COMPLETED, DISMISSED (FR11)
**And** priority enum: LOW, MEDIUM, HIGH, CRITICAL
**And** relaciones: asset (Asset), assignedTo (User?), failureReport (FailureReport?), repuestos (RepuestoUsed[])
**And** timestamps: createdAt, updatedAt, completedAt
**And** índices para optimizar: @@index([status, assetId]), @@index([assignedTo])

**Given** que el supervisor accede al tablero Kanban
**Then** ve 8 columnas en este orden:
1. Pendiente Triage (avisos por evaluar)
2. Asignaciones (dividida horizontalmente: Pendiente de Asignar / Programada)
3. En Progreso (técnico trabajando)
4. Pendiente Repuesto (esperando material)
5. Pendiente Parada (requiere parar línea)
6. Reparación Externa (enviado a proveedor)
7. Completadas (finalizadas)
8. Descartadas (canceladas)
**And** cada columna muestra las tarjetas OT correspondientes
**And** las tarjetas tienen código de colores según tipo:
- 🔴 Rojizo: correctivo propio (técnico interno)
- 🔴📏 Rojo con línea blanca: correctivo externo (proveedor viene)
- 🟡 Amarillento: reparación interna (taller propio)
- 🔵 Azul claro: reparación externa (enviado a proveedor)

**P0 Test Scenarios (TS-WO-002, TS-WO-003, TS-WO-004):**
- **TS-WO-002**: Kanban carga <3s con 100+ OTs concurrentes (P95)
- **TS-WO-003**: SSE sync actualiza estado OT <1s across 50 concurrent users
- **TS-WO-004**: Usuario drag & drop OT entre columnas → OT movida; evento SSE enviado; log de auditoría creado

**Testability Requirements:**
- Kanban board con `data-testid="kanban-board"`
- Column con `data-testid="column-backlog"`, `data-testid="column-in-progress"`, `data-testid="column-completed"`
- WO card con `data-testid="wo-card-{code}"`

---

### Story 4.2: Asignación de OTs a Técnicos con Dropdowns Condicionales

Como **supervisor**, quiero **asignar una OT a un técnico usando dropdowns condicionales según el tipo de OT**, para **filtrar técnicos disponibles por skills y ubicación**.

**Acceptance Criteria:**

**Given** que el supervisor quiere asignar una OT
**When** arrastra la tarjeta OT a la subcolumna "Pendiente de Asignar"
**Then** se abre modal de asignación con:
- Dropdown "Asignar a técnico interno" si OT es correctivo propio
- Dropdown "Asignar a proveedor externo" si OT es reparación externa
- Ambas opciones disponibles si OT puede ser ambas
**When** selecciona "Asignar a técnico interno"
**Then** el dropdown filtra técnicos que tienen la capability can_update_own_ot
**And** filtra por ubicación (misma planta que el equipo)
**And** filtra por skills si la OT requiere habilidades especiales
**And** muestra carga actual de trabajo del técnico (número de OTs asignadas)
**When** selecciona un técnico
**Then** la OT se mueve a subcolumna "Programada"
**And** el técnico recibe notificación push

---

### Story 4.3: Inicio de OT por Técnico

Como **técnico**, quiero **iniciar una OT asignada cambiando su estado a "En Progreso"**, para **comenzar a trabajar en la reparación**.

**Acceptance Criteria:**

**Given** que un técnico tiene una OT asignada en estado "Programada"
**When** hace clic en el botón "▶️ Iniciar" de la tarjeta OT
**Then** el estado cambia a IN_PROGRESS
**And** la tarjeta se mueve automáticamente a columna "En Progreso"
**And** registra timestamp de inicio (startedAt)
**And** el sistema actualiza assignedTo con el ID del técnico actual
**And** todos los usuarios conectados ven la actualización en tiempo real vía SSE (<1s, FR96)
**And** el supervisor y operario reciben notificación push

**P0 Test Scenarios (TS-WO-001):**
- **TS-WO-001**: Usuario crea OT con campos requeridos → OT creada; redirect a Kanban

---

### Story 4.4: Agregar Repuestos Usados Durante una OT

Como **técnico**, quiero **registrar repuestos usados mientras trabajo en una OT**, para **actualizar el stock automáticamente y mantener registro de materiales utilizados**.

**Acceptance Criteria:**

**Given** que el técnico está trabajando en una OT en estado IN_PROGRESS
**When** hace clic en "Agregar Repuesto"
**Then** abre modal con campo de búsqueda predictiva de repuestos
**When** escribe el nombre del repuesto (ej: "skf")
**Then** el dropdown muestra sugerencias con: nombre, código, stock actual, ubicación
**And** muestra: "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
**When** selecciona un repuesto
**Then** puede especificar cantidad usada (por defecto 1)
**When** hace clic en "Agregar"
**Then** el sistema crea un registro RepuestoUsed asociado a la OT
**And** actualiza stock del repuesto restando la cantidad usada (FR16)
**And** muestra confirmación: "✓ Agregado. Stock actualizado: 11"
**And** NO envía notificación push al gestor de stock (sin spam, FR51)

---

### Story 4.5: Completación de OT con Notas y Repuestos

Como **técnico**, quiero **completar una OT agregando notas internas y repuestos usados**, para **documentar el trabajo realizado y cerrar la orden**.

**Acceptance Criteria:**

**Given** que el técnico está trabajando en una OT en estado IN_PROGRESS
**When** hace clic en "Completar OT"
**Then** abre modal de completación con:
- Lista de repuestos usados (puede agregar más)
- Campo "Notas internas" (opcional, visible solo para técnicos/supervisores)
- Campo "Descripción del trabajo realizado" (obligatorio)
**When** completa los campos y hace clic en "Completar"
**Then** el estado cambia a COMPLETED
**And** registra timestamp completedAt
**And** la tarjeta se mueve a columna "Completadas"
**And** el operario que reportó la avería original recibe notificación push
**And** envía notificación al operario: "OT #OT-567 completada - ¿Confirma que funciona bien?"

**P0 Test Scenarios (TS-WO-005, TS-WO-006, TS-WO-007):**
- **TS-WO-005**: Priority scheduling algorithm prioriza correctamente → casos test (high SLA + low criticality, etc.) → priority calculated correctly
- **TS-WO-006**: Concurrent edits a la misma OT → 2 users editing → last write wins; first user gets conflict error (optimistic locking)
- **TS-WO-007**: Asignación OT a técnico con availability check → OT + available technician → technician assigned; availability updated

**Testability Requirements:**
- Optimistic locking implementado con version field
- SSE Mock endpoint para test concurrencia
- `data-testid="wo-priority-select"`, `data-testid="modal-dialog"`

---

### Story 4.6: Modal ℹ️ con Trazabilidad Completa

Como **supervisor**, quiero **ver detalles completos de una OT en un modal informativo**, para **tener toda la trazabilidad en un solo lugar sin navegar múltiples pantallas**.

**Acceptance Criteria:**

**Given** que el supervisor hace clic en el icono ℹ️ de una tarjeta OT
**Then** se abre modal con toda la información:
- **Encabezado:** Código OT, estado, urgencia, tipo (propio/externo)
- **Origen:** Aviso padre (si aplica) con código, operario, fecha de reporte
- **Equipo:** Código, nombre, ubicación
- **Fechas:** Creada, asignada, iniciada, completada
- **Asignado a:** Nombre del técnico o proveedor con teléfono
- **Repuestos usados:** Lista con cantidades
- **Notas internas:** Texto completo
- **Descripción del trabajo:** Texto completo
- **Botón de acción:** "Llamar" (click-to-call al técnico/proveedor)
**When** hace clic en "Llamar"
**Then** inicia la llamada telefónica directamente desde el modal

---

### Story 4.7: Sincronización Real-Time entre Vistas Kanban y Listado

Como **usuario**, quiero **ver las actualizaciones reflejadas en tiempo real tanto en la vista Kanban como en la vista de listado**, para **trabajar indistintamente en cualquiera de las dos vistas sin perder sincronización**.

**Acceptance Criteria:**

**Given** que un usuario está viendo el tablero Kanban
**When** otro usuario cambia el estado de una OT en otra vista
**Then** la actualización se refleja en menos de 1 segundo vía SSE (FR96)
**And** la tarjeta se mueve automáticamente a la nueva columna
**And** aparece notificación visual: "OT #OT-567 movida a En Progreso por [Usuario]"
**When** el usuario cambia a vista de listado
**Then** ve las mismas OTs con los mismos estados actualizados
**When** el usuario está en vista de listado y se produce un cambio
**Then** la lista se actualiza automáticamente en tiempo real
**And** aparece indicador visual de OTs modificadas

---

### Story 4.8: Vista de Listado con Filtros y Ordenamiento

Como **técnico**, quiero **ver una lista de todas mis OTs con filtros múltiples**, para **encontrar rápidamente las órdenes que necesito**.

**Acceptance Criteria:**

**Given** que el técnico accede a la vista de listado de OTs
**Then** ve una tabla con columnas: código, equipo, estado, prioridad, fecha creación, asignado a
**And** puede filtrar por:
- Estado (dropdown con 8 estados)
- Técnico asignado
- Rango de fechas (desde/hasta)
- Tipo (correctivo/externo)
- Equipo (búsqueda predictiva)
**When** aplica filtros
**Then** la lista se actualiza mostrando solo las OTs que cumplen todos los criterios
**And** puede ordenar por cualquier columna haciendo clic en el encabezado
**And** puede invertir el orden haciendo clic nuevamente
**And** la paginación muestra 20 OTs por página

---

### Story 4.9: Creación Manual de OTs

Como **supervisor**, quiero **crear una OT manualmente sin partir de un aviso**, para **generar órdenes de trabajo para mantenimiento preventivo o mejoras**.

**Acceptance Criteria:**

**Given** que el supervisor tiene la capability can_create_manual_ot
**When** hace clic en "Nueva OT manual"
**Then** abre formulario con campos:
- Equipo (búsqueda predictiva, obligatorio)
- Tipo: Correctivo / Preventivo / Mejora (dropdown)
- Descripción del trabajo (obligatorio)
- Prioridad: Baja / Media / Alta / Crítica
- Asignar a: Técnico / Proveedor / Dejar sin asignar
**When** completa el formulario y guarda
**Then** crea una OT con estado PENDING_ASSIGNMENT
**And** no tiene aviso padre asociado (failureReportId = null)
**And** genera código único de OT
**And** si asignó a técnico, va a "Programada"
**And** si dejó sin asignar, va a "Pendiente de Asignar"
**And** el técnico asignado recibe notificación push

---

## Epic 5: Gestión de Repuestos y Proveedores

Los técnicos ven stock y ubicación de repuestos al seleccionarlos durante una OT, el stock se actualiza automáticamente al usar repuestos, y el gestor de inventario recibe alertas solo de stock mínimo (sin spam por cada uso). Incluye catálogos de proveedores de mantenimiento y repuestos, generación de pedidos, e importación masiva CSV.

**FRs cubiertos:** FR44-FR57 + FR77-FR80 (18 FRs)

#### Quality Gates (Epic 5)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **CSV Validation** | 10,000+ test cases validados (duplicados, referencias rotas) | SÍ | P0 |
| **Stock Integrity** | Concurrencia en stock adjustments manejada correctamente | SÍ | P0 |
| **Insufficient Stock** | Sistema previene deducción si stock insuficiente | SÍ | P0 |

**Riesgos Asociados (del Test Design):**
- **R-TECH-002** (Score 6): CSV import validation edge cases - Mitigación: Test harness con 10K+ casos
- **R-DATA-002** (Score 4): Stock conflicts en adjustments concurrentes - Mitigación: Optimistic locking para stock
- **R-PERF-002** (Score 6): Búsqueda predictiva <200ms con 5K+ items - Mitigación: Benchmark con dataset completo

#### Testability Requirements (Epic 5)

**Requisitos Previos a la Implementación:**
- CSV validation test harness para edge cases (SKUs duplicados, cantidades negativas)
- Concurrency test setup para stock adjustments (múltiples usuarios simultáneos)
- Dataset de prueba con 5K+ items de inventario

**data-testid Attributes Requeridos:**
```html
<!-- Inventory Management -->
<input data-testid="inventory-sku-input" />
<input data-testid="inventory-quantity-input" />
<button data-testid="update-stock-button" />
<div data-testid="stock-level-indicator" />

<!-- CSV Import -->
<input data-testid="csv-upload-input" />
<div data-testid="progress-bar" />
<div data-testid="validation-summary" />
```

### Story 5.1: Catálogo de Repuestos con Stock y Ubicación

Como **técnico**, quiero **ver el catálogo de repuestos con stock actual y ubicación física**, para **saber si hay disponibilidad y dónde encontrar el material**.

**Acceptance Criteria:**

**Given** que el técnico accede al módulo de Repuestos por primera vez
**When** el sistema inicializa el módulo
**Then** crea automáticamente los modelos de datos Prisma SparePart y Provider
**And** SparePart tiene campos: id, name, code (unique), description, currentStock, minStockAlert, location
**And** currentStock y minStockAlert son integers
**And** location es string (formato: "Estante A3, Cajón 3")
**And** relaciones: providers (SparePartProvider[]), usedIn (RepuestoUsed[])
**And** Provider tiene campos: id, name, contactPerson, phone, email, providerType
**And** providerType enum: MAINTENANCE, SPARE_PARTS
**And** relaciones: spareParts (SparePartProvider[])
**And** tabla many-to-many SparePartProvider permite asociar un repuesto con múltiples proveedores

**Given** que el técnico accede al catálogo de Repuestos
**Then** ve una lista de todos los repuestos
**And** cada repuesto muestra: código, nombre, stock actual, ubicación, estado de stock
**When** el stock está por encima del mínimo
**Then** muestra indicador verde 🟢
**When** el stock está en el mínimo
**Then** muestra indicador rojo 🔴 (stock crítico)
**When** hace clic en un repuesto
**Then** abre detalle con: nombre completo, código, descripción, stock actual, stock mínimo, ubicación, proveedores
**And** muestra ubicación en formato legible: "Estante A3, Cajón 3"

---

### Story 5.2: Ajustes Manuales de Stock con Motivo

Como **gestor de stock**, quiero **realizar ajustes manuales de stock especificando un motivo**, para **corregir discrepancias físicas en el inventario**.

**Acceptance Criteria:**

**Given** que el gestor tiene la capability can_manage_stock
**When** edita un repuesto
**Then** puede hacer clic en "Ajustar stock"
**And** abre modal con:
- Campo "Cantidad a ajustar" (puede ser positivo o negativo)
- Campo "Motivo del ajuste" (obligatorio, texto libre)
**When** ingresa cantidad -1 (restar una unidad)
**Then** el sistema resta del stock actual
**And** registra el motivo en el log de auditoría (FR72)
**And** calcula el nuevo stock: currentStock - 1
**And** actualiza timestamp del último ajuste
**When** el stock nuevo es menor o igual al mínimo
**Then** envía alerta al gestor: "⚠️ [Repuesto] alcanzó stock mínimo ([cantidad])"

**P0 Test Scenarios (TS-INV-003, TS-INV-010, TS-INV-011):**
- **TS-INV-003**: Sistema deduce cantidad de repuesto cuando se agrega a OT → Inventory item + WO → quantity deducted; transaction logged
- **TS-INV-010**: Sistema previene deducción si stock insuficiente → Item quantity 5, try to deduct 10 → error shown; deduction blocked
- **TS-INV-011**: Concurrent stock adjustments manejados correctamente → 2 users deducting → one succeeds; one gets conflict error

**Testability Requirements:**
- Concurrency test setup para stock adjustments (múltiples usuarios simultáneos)
- Stock level indicator con `data-testid="stock-level-indicator"`

---

### Story 5.3: Alertas de Stock Mínimo (Sin Spam por Uso)

Como **gestor de stock**, quiero **recibir alertas solo cuando un repuesto alcanza su stock mínimo**, para **no recibir notificaciones por cada uso individual de repuestos**.

**Acceptance Criteria:**

**Given** que un repuesto tiene minStockAlert definido
**When** un técnico usa un repuesto durante una OT
**Then** el stock se actualiza automáticamente (resta cantidad usada)
**And** el gestor de stock NO recibe notificación (FR51)
**When** el stock actual <= minStockAlert
**Then** el gestor recibe alerta push: "⚠️ Filtro F-205 alcanzó mínimo (6 unidades, mínimo: 5)"
**And** la alerta incluye botón "Generar pedido"
**And** el sistema verifica que no haya alertas duplicadas en las últimas 24 horas
**And** solo gestores con capability can_manage_stock reciben estas alertas

---

### Story 5.4: Pedidos de Repuestos a Proveedores

Como **gestor de stock**, quiero **generar pedidos de repuestos a proveedores**, para **reponer el inventario cuando alcanza stock mínimo**.

**Acceptance Criteria:**

**Given** que el gestor recibe alerta de stock mínimo
**When** hace clic en "Generar pedido"
**Then** abre modal con:
- Repuesto a pedir (pre-llenado)
- Cantidad a pedir (sugerencia: minStockAlert * 2)
- Dropdown de proveedores de este repuesto
- Campo "Notas adicionales"
**When** completa y envía el pedido
**Then** crea un registro PurchaseOrder asociado al proveedor
**And** estado del pedido: PENDING
**And** envía email al proveedor con detalles del pedido
**And** registra la acción en el log de auditoría
**When** el pedido se recibe
**Then** el gestor puede marcarlo como RECEIVED
**And** el stock se actualiza automáticamente sumando la cantidad recibida

---

### Story 5.5: Importación Masiva CSV de Repuestos

Como **administrador**, quiero **importar repuestos masivamente desde CSV**, para **cargar el catálogo inicial de inventario rápidamente**.

**Acceptance Criteria:**

**Given** que el administrador accede al módulo de Repuestos
**When** hace clic en "Importar CSV"
**Then** puede descargar plantilla CSV con columnas: código, nombre, descripción, stock inicial, stock mínimo, ubicación, proveedor
**When** sube el archivo CSV
**Then** el sistema valida cada fila:
- Código único (error si duplicado)
- Stock inicial y mínimo son números válidos
- Proveedor existe en catálogo (error si no existe) (FR56)
**When** la validación pasa
**Then** crea los repuestos en lote usando transacciones
**And** crea relaciones con proveedores especificados
**And** muestra reporte de resultados: éxitos, errores, advertencias (FR57)
**And** si hay errores, hace rollback completo (NFR-I4)

**P0 Test Scenarios (TS-INV-007, TS-INV-008):**
- **TS-INV-007**: CSV bulk upload (1000+ rows) valida constraints → Progress indicator shown; validation summary displayed
- **TS-INV-008**: CSV import maneja conflictos (SKUs duplicados, cantidades negativas) → Conflictos reportados; filas válidas procesadas

**Testability Requirements:**
- CSV validation test harness para edge cases
- Mock endpoint `/api/test-csv-validate` para inyectar CSVs con edge cases
- Progress bar con `data-testid="progress-bar"`

---
---

### Story 5.6: Gestión de Proveedores de Mantenimiento y Repuestos

Como **administrador**, quiero **mantener catálogos separados de proveedores de mantenimiento y repuestos**, para **gestionar contactos según el tipo de servicio**.

**Acceptance Criteria:**

**Given** que el administrador accede al módulo de Proveedores
**Then** ve dos secciones: "Proveedores de Mantenimiento" y "Proveedores de Repuestos"
**When** crea un nuevo proveedor
**Then** completa formulario:
- Nombre de la empresa (obligatorio)
- Tipo: Mantenimiento / Repuestos / Ambos (dropdown)
- Persona de contacto
- Teléfono
- Email
- Dirección
**When** guarda el proveedor
**Then** el sistema crea el registro con providerType especificado
**And** el proveedor aparece en la sección correspondiente
**When** se crea un repuesto nuevo
**Then** puede asociar proveedores del tipo SPARE_PARTS
**When** se asigna reparación externa
**Then** puede seleccionar proveedores del tipo MAINTENANCE

---

## Epic 6: Rutinas de Mantenimiento Preventivo

Los usuarios configuran rutinas de mantenimiento con frecuencias diarias, semanales o mensuales. El sistema genera automáticamente órdenes de trabajo basadas en las rutinas programadas, muestra el porcentaje de rutinas completadas en el dashboard y envía alertas cuando una rutina no se completa en el plazo previsto.

**FRs cubiertos:** FR81-FR84 (4 FRs)

#### Quality Gates (Epic 6)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **Scheduling Accuracy** | Priority algorithm unit testeado con edge cases | NO (P1) | P1 |
| **Auto-Generation** | Job scheduler genera OTs correctamente según frecuencia | SÍ | P0 |

**Riesgos Asociados (del Test Design):**
- **R-BUS-001** (Score 6): Priority scheduling algorithm errors - Mitigación: Unit tests con edge cases
- **R-BUS-002** (Score 4): Cost calculation errors - Mitigación: Unit tests para cálculos

### Story 6.1: Configuración de Rutinas con Múltiples Frecuencias y Generación Automática de OTs

Como **administrador**, quiero **configurar rutinas de mantenimiento con frecuencias diarias, semanales o mensuales**, para **automatizar el mantenimiento preventivo**.

**Acceptance Criteria:**

**Given** que el administrador accede al módulo de Rutinas por primera vez
**When** el sistema inicializa el módulo
**Then** crea automáticamente el modelo de datos Prisma Routine con campos: id, name, description, assetId, frequency, lastGenerated, nextGeneration
**And** frequency enum: DAILY, WEEKLY, MONTHLY
**And** relaciones: asset (Asset), generatedOTs (WorkOrder[])
**And** RoutineConfig tiene campos: routineId, dayOfWeek (1-7 para WEEKLY), dayOfMonth (1-31 para MONTHLY)
**And** permite configurar rutinas diarias, semanales (ej: "todos los lunes"), mensuales (ej: "día 15 de cada mes")

**Given** que el administrador crea una nueva rutina
**When** completa el formulario
**Then** ingresa: nombre de la rutina (ej: "Lubricación mensual perfiladora"), descripción de las tareas, equipo (búsqueda predictiva)
**And** selecciona frecuencia: Diaria / Semanal / Mensual
**And** si selecciona "Semanal": día de la semana (Lun-Dom)
**And** si selecciona "Mensual": día del mes (1-31)
**When** guarda la rutina
**Then** el sistema calcula nextGeneration según la frecuencia
**And** la rutina aparece en el listado de rutinas activas
**And** muestra próxima fecha de generación

---

### Story 6.2: Generación Automática de OTs desde Rutinas

Como **sistema**, quiero **generar automáticamente OTs basadas en rutinas programadas**, para **crear órdenes de trabajo preventivo sin intervención manual**.

**Acceptance Criteria:**

**Given** que existe una rutina configurada
**When** el job scheduler se ejecuta (cada hora)
**Then** verifica todas las rutinas donde nextGeneration <= now
**For each** rutina que debe generar
**Then** crea una nueva OT con estado PENDING_ASSIGNMENT
**And** asocia la OT a la rutina (routineId)
**And** copia la descripción de la rutina a la OT
**And** asocia la OT al equipo especificado
**And** actualiza lastGenerated = now
**And** calcula nextGeneration según la frecuencia:
- DAILY: now + 1 día
- WEEKLY: próximo día especificado de la semana
- MONTHLY: próximo día especificado del mes
**And** registra en el log: "OT #[code] generada desde rutina [nombre]"

---

### Story 6.3: KPI de Rutinas Completadas y Alertas de Vencimiento

Como **supervisor**, quiero **ver el porcentaje de rutinas completadas en el dashboard y recibir alertas de vencimiento**, para **asegurar que el mantenimiento preventivo se cumpla**.

**Acceptance Criteria:**

**Given** que el supervisor accede al dashboard
**Then** ve tarjeta KPI: "Rutinas Completadas" con porcentaje
**And** muestra formato: "85% (17/20 rutinas este mes)"
**When** una rutina no se completa en el plazo previsto
**Then** el supervisor recibe alerta: "⚠️ Rutina '[nombre]' vencida - No se generó OT"
**And** la alerta incluye: nombre de rutina, equipo, fecha prevista, fecha actual
**When** hace clic en la alerta
**Then** navega al detalle de la rutina para tomar acción manual
**And** puede generar manualmente la OT omitida
**And** el KPI de rutinas se actualiza cada vez que se completa una OT generada desde rutina

---

## Epic 7: Dashboard de KPIs y Análisis de Mantenimiento

Administradores y directores ven KPIs MTTR y MTBF calculados en tiempo real con drill-down de 4 niveles (Global → Planta → Línea → Equipo), reciben alertas accionables (stock mínimo, MTFR alto, rutinas no completadas) y exportan reportes a Excel .xlsx con múltiples hojas. Cada rol ve un dashboard específico al hacer login.

**FRs cubiertos:** FR85-FR95 (11 FRs)

#### Quality Gates (Epic 7)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **Real-time KPIs** | SSE updates <1s para KPIs | NO (P1) | P1 |
| **KPI Accuracy** | KPIs calculados correctamente (MTTR, MTBF, asset utilization) | SÍ | P0 |
| **Export Functionality** | Exportación Excel .xlsx con múltiples hojas | NO (P1) | P1 |

**Riesgos Asociados (del Test Design):**
- **R-PERF-001** (Score 6): SSE scalability para KPIs - Mitigación: Load test con 50 usuarios concurrentes
- **TS-SEC-009** (P0): Report permissions - Viewer no puede ver cost reports

#### Testability Requirements (Epic 7)

**Requisitos Previos a la Implementación:**
- SSE endpoint `/api/kpis/stream` para real-time updates
- Test cases para KPI calculations con diversos OT histories

### Story 7.1: Cálculo de MTTR y MTBF en Tiempo Real

Como **analista**, quiero **calcular los KPIs MTTR (Mean Time To Repair) y MTBF (Mean Time Between Failures) en tiempo real**, para **medir el desempeño del mantenimiento**.

**Acceptance Criteria:**

**Given** que existen OTs completadas en el sistema
**When** se calcula MTTR
**Then** MTTR = suma(tiempo_total_reparación) / cantidad_OTs_completadas
**And** tiempo_total_reparación = completedAt - createdAt para cada OT COMPLETED
**And** el resultado se muestra en horas con 1 decimal (ej: "4.2h")
**When** se calcula MTBF
**Then** MTBF = tiempo_total_operación / cantidad_fallos
**And** tiempo_total_operación = suma de periodos entre fallos consecutivos
**And** cantidad_fallos = cantidad de OTs completadas
**And** el resultado se muestra en horas (ej: "127h")
**And** los KPIs se calculan bajo demanda con caching de 30-60s (NFR-P5)

**P0 Test Scenarios (TS-RPT-002):**
- **TS-RPT-002**: KPIs calculados correctamente (MTBF, MTTR, asset utilization) → Test cases con varios WO histories → KPIs accurate a 2 decimals

---

### Story 7.2: Drill-down de KPIs en 4 Niveles

Como **director**, quiero **navegar desde KPIs globales hasta específicos por equipo**, para **identificar equipos problemáticos y tomar decisiones fundamentadas**.

**Acceptance Criteria:**

**Given** que el director accede al dashboard de KPIs
**When** ve MTTR global
**Then** muestra: "MTTR: 4.2h ↓15% vs mes anterior"
**When** hace clic en MTTR
**Then** navega al drill-down nivel 1: desglose por Planta
**And** ve lista de plantas con sus MTTR
**When** hace clic en una Planta
**Then** navega al drill-down nivel 2: desglose por Línea
**When** hace clic en una Línea
**Then** navega al drill-down nivel 3: desglose por Equipo
**And** ve tabla: Equipo | MTTR | Cantidad Fallos | Ranking
**When** hace clic en un Equipo específico
**Then** abre modal con detalle: lista de todas las OTs de ese equipo
**And** puede ver histórico de intervenciones

---

### Story 7.3: Métricas Adicionales y Alertas Accionables

Como **administrador**, quiero **ver métricas adicionales y recibir alertas accionables**, para **tener visibilidad completa del estado del mantenimiento**.

**Acceptance Criteria:**

**Given** que el administrador accede al dashboard
**Then** ve tarjetas de métricas adicionales:
- OTs Abiertas: 23 (desglose por estado)
- Técnicos Activos: 5 (lista de nombres)
- Stock Crítico: 8 items (lista de repuestos bajo mínimo)
- Rutinas Completadas: 85% (17/20 este mes)
**When** una métrica requiere acción
**Then** recibe alerta accionable (FR89):
- "⚠️ Filtro F-205 alcanzó stock mínimo (6 unidades, mínimo: 5)" - Botón "Generar pedido"
- "🚨 MTTR aumentó 20% vs mes anterior" - Botón "Ver detalle"
- "⚠️ 3 rutinas no completadas esta semana" - Botón "Ver rutinas"
**When** hace clic en una alerta
**Then** navega a la sección correspondiente para tomar acción

---

### Story 7.4: Dashboard Común con Navegación por Capabilities

**⚠️ REESCRITA según Sprint Change Proposal (2026-03-01) - Reemplazo de dashboards por rol**

Como **usuario del sistema**, quiero **ver un dashboard general con KPIs de la planta al hacer login, y acceder solo a los módulos para los que tengo capacidades**, para **tener una visión unificada del estado de la planta con navegación adaptada a mis permisos**.

**Acceptance Criteria:**

**Given** que cualquier usuario del sistema inicia sesión
**When** es redirigido al dashboard después del login
**Then** ve el mismo dashboard general independientemente de su rol
**And** el dashboard muestra KPIs de la planta:
- MTTR (Mean Time To Repair)
- MTBF (Mean Time Between Failures)
- OTs Abiertas (cantidad)
- Stock Crítico (cantidad)
- Técnicos Activos (cantidad)
**When** el usuario ve la sección de "Acceso Rápido"
**Then** solo ve botones de acceso a módulos para los que tiene capacidades asignadas
**And** los botones se muestran/ocultan dinámicamente según sus capabilities
**And** los usuarios sin `can_view_kpis` ven los KPIs básicos pero no pueden hacer drill-down

**CAMBIOS CRÍTICOS DESDE RBAC → PBAC:**
- ❌ **ANTES:** "Los usuarios ven un dashboard específico según los roles del usuario al hacer login"
- ❌ **ANTES:** 4 dashboards diferentes (Operario, Técnico, Supervisor, Admin)
- ✅ **AHORA:** "Todos los usuarios acceden al mismo dashboard general con KPIs de la planta"
- ✅ **AHORA:** "Navegación muestra solo módulos según capabilities"

**Botones de Acceso Rápido y su Capability:**
- [📋 Reportar Avería] → `can_create_failure_report` (todos los usuarios)
- [🔧 Mis OTs] → `can_view_own_ots` (vista propia del usuario)
- [🔧 Ver Kanban] → `can_view_all_ots` (vista de supervisor)
- [📦 Gestión Stock] → `can_manage_stock`
- [📊 KPIs Avanzados] → `can_view_kpis`
- [👥 Gestión Usuarios] → `can_assign_technicians`
- Sus rutinas del día
- Botón突出 "Ver mis OTs"
**Supervisor** (FR94):
- Tablero Kanban por defecto
- Resumen de carga de equipo
- Alertas de desbalance
**Administrador** (FR95):
- KPIs MTTR/MTBF con tendencias
- Alertas accionables
- Métricas adicionales
- Botones突出 "Ver KPIs", "Gestión de usuarios"

---

### Story 7.5: Exportación de Reportes a Excel

Como **director**, quiero **exportar reportes de KPIs a Excel con múltiples hojas**, para **presentar informes a la dirección con datos formateados**.

**Acceptance Criteria:**

**Given** que el director accede al dashboard de KPIs
**When** hace clic en "Exportar Excel"
**Then** el sistema genera un archivo .xlsx (FR90)
**And** el archivo tiene múltiples hojas separadas:
- Hoja "MTTR": tabla con MTTR por nivel (Global, Planta, Línea, Equipo)
- Hoja "MTBF": tabla con MTBF por nivel
- Hoja "OTs Abiertas": listado de OTs con filtros aplicados
- Hoja "Stock Crítico": listado de repuestos bajo mínimo
**And** cada hoja tiene:
- Encabezados con nombre de columna
- Formato de números adecuado (decimales para horas)
- Filtros habilitados en primera fila
- Colores para destacar valores críticos (rojo para MTTR alto)
**When** la exportación está lista
**Then** el navegador descarga el archivo: "kpi-report-YYYY-MM-DD.xlsx"

---

## Epic 8: PWA Multi-Dispositivo con Sincronización Real-Time

Los usuarios instalan la aplicación como nativa en dispositivos móviles y tablets, reciben notificaciones push, y la interfaz se adapta responsivamente a desktop (>1200px), tablet (768-1200px), móvil (<768px) y TV 4K. La sincronización multi-dispositivo es <1 segundo para OTs y <30 segundos para KPIs.

**FRs cubiertos:** FR96-FR100 (5 FRs)

#### Quality Gates (Epic 8)

| Quality Gate | Success Criteria | Blocker If Failed | Prioridad |
|--------------|------------------|-------------------|-----------|
| **Concurrent Users** | 100 concurrent users sin degradación | SÍ | P0 |
| **API Performance** | API response P95 <100ms | SÍ | P0 |
| **Monitoring** | /metrics endpoint expuesto | SÍ | P0 |
| **Input Validation** | SQL injection y XSS attacks sanitizados | SÍ | P0 |

**Riesgos Asociados (del Test Design):**
- **R-SEC-001** (Score 6): SQL/XSS injection vulnerabilities - Mitigación: Input validation tests + OWASP ZAP scan
- **TS-INF-004** (P0): 100 concurrent users - Load test con 100 usuarios
- **TS-INF-005** (P0): API response time <100ms P95
- **R-OPS-002** (Score 4): Monitoring no implementado - Mitigación: Exponer `/api/metrics`

#### Testability Requirements (Epic 8)

**Requisitos Previos a la Implementación:**
- Metrics endpoint `/api/metrics` para monitoring
- OWASP ZAP integration para security scanning
- Load testing setup con k6 o similar

**data-testid Attributes Comunes:**
```html
<div data-testid="notification-toast" />
<div data-testid="modal-dialog" />
<button data-testid="confirm-button" />
<button data-testid="cancel-button" />
```

### Story 8.1: Configuración PWA con Manifest y Service Worker

Como **desarrollador**, quiero **configurar la aplicación como PWA con manifest.json y service worker**, para **permitir instalación en dispositivos móviles y acceso offline parcial**.

**Acceptance Criteria:**

**Given** que se configura la PWA
**When** se crea manifest.json en /public
**Then** contiene:
- name: "GMAO Hiansa"
- short_name: "GMAO"
- icons: 192x192.png y 512x512.png
- start_url: "/"
- display: "standalone"
- background_color: "#ffffff"
- theme_color: "#0066CC"
**When** se crea service-worker.js
**Then** implementa caching de activos estáticos
**And** permite acceso offline parcial
**And** sincroniza datos al reconexión (<30s, NFR-R4)
**And** muestra indicador de conexión: online / offline

---

### Story 8.2: Responsive Design para Desktop, Tablet, Móvil y TV

Como **usuario**, quiero **la interfaz se adapte automáticamente al tamaño de mi pantalla**, para **usar la aplicación en cualquier dispositivo**.

**Acceptance Criteria:**

**Given** que el usuario accede desde diferentes dispositivos
**When** pantalla > 1200px (Desktop)
**Then** Kanban muestra 8 columnas completas
**And** Dashboard expandido con todos los KPIs
**When** pantalla 768-1200px (Tablet)
**Then** Kanban muestra 2 columnas (En Progreso + Completadas)
**And** Otras columnas en modal al hacer clic
**And** Modal ℹ️ optimizado para tablet
**When** pantalla < 768px (Móvil)
**Then** Kanban muestra 1 columna con swipe horizontal
**And** Navegación hamburguesa colapsada
**And** Botones de 44x44px mínimo (NFR-A3)
**When** pantalla TV 4K
**Then** Dashboard público modo "reunión"
**And** Fuentes y elementos aumentados para visibilidad a distancia

---

### Story 8.3: Instalación PWA en Dispositivos Móviles

Como **usuario móvil**, quiero **instalar la aplicación como nativa en mi dispositivo**, para **acceder directamente desde home screen sin abrir el navegador**.

**Acceptance Criteria:**

**Given** que el usuario accede desde móvil (Chrome/Edge)
**When** la app detecta que no está instalada
**Then** muestra banner o prompt: "Instalar GMAO Hiansa"
**When** el usuario hace clic en "Instalar"
**Then** la app se agrega a home screen del dispositivo
**And** crea icono con logo de la app (192x192)
**When** el usuario abre la app desde home screen
**Then** se lanza en modo standalone (sin barra de direcciones del navegador)
**And** tiene pantalla de splash con logo
**And** se comporta como app nativa

---

### Story 8.4: Sincronización Real-Time via SSE

Como **usuario**, quiero **ver actualizaciones en tiempo real sin refrescar la página**, para **trabajar colaborativamente con otros usuarios**.

**Acceptance Criteria:**

**Given** que el usuario está viendo el tablero Kanban
**When** otro usuario cambia el estado de una OT
**Then** el cliente recibe evento SSE del servidor
**And** la actualización se refleja en menos de 1 segundo (FR96)
**And** la tarjeta OT se mueve a la nueva columna suavemente
**And** aparece notificación visual: "OT #OT-567 movida por [Usuario]"
**When** el usuario está viendo el dashboard de KPIs
**Then** los KPIs se actualizan cada 30-60 segundos automáticamente (FR96)
**And** no necesita refrescar la página
**And** muestra indicador de "última actualización: hace X segundos"

---

### Story 8.5: Notificaciones Push Transparencia

Como **usuario**, quiero **recibir notificaciones push para eventos importantes**, para **estar informado sin estar activamente usando la app**.

**Acceptance Criteria:**

**Given** que el usuario ha otorgado permiso de notificaciones
**When** se genera un evento relevante
**Then** el usuario recibe notificación push:
**Para operarios:**
- "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- "OT #OT-567 en progreso - María está trabajando"
- "OT #OT-567 completada - ¿Confirma que funciona bien?"
**Para técnicos:**
- "Nueva OT asignada: #OT-568 - Equipo P-201"
**Para gestores de stock:**
- "⚠️ Filtro F-205 alcanzó stock mínimo (6 unidades)"
**When** el usuario hace clic en la notificación
**Then** la app se abre y navega directamente a la OT/aviso relevante
**And** las notificaciones tienen el logo de la app

**P0 Test Scenarios (TS-INF-004, TS-INF-005):**
- **TS-INF-004**: Sistema maneja 100 concurrent users sin degradación → Load test con 100 users → response times within SLA; no errors
- **TS-INF-005**: API response time <100ms P95 → 1000+ API requests → P95 <100ms; P99 <200ms

**Testability Requirements:**
- Load testing setup con k6 o similar
- Performance benchmark suite para API endpoints

---

## Test Design Integration Summary

Este documento ha sido actualizado con información de prueba derivada del análisis TEA TestArch Test Design. A continuación se presenta un resumen de las adiciones:

### Quality Gates por Epic

| Epic | Quality Gates Críticos | Blocker | Pre-Implementation Effort |
|------|------------------------|---------|---------------------------|
| **Epic 1: Auth** | RBAC (64 tests), Rate Limiting, Password Hashing | SÍ | ~3-4 días |
| **Epic 2: Assets** | Search <200ms, CSV Validation, FTS | SÍ | ~5-7 días (FTS) |
| **Epic 3: Failure Reports** | Predictive Search <200ms | SÍ | Dataset 10K+ assets |
| **Epic 4: Work Orders** | SSE <1s (50 users), Concurrent Edits, Kanban <3s | SÍ | ~4-5 días (SSE mock) |
| **Epic 5: Inventory** | CSV Validation, Stock Integrity, Insufficient Stock | SÍ | ~3-4 días |
| **Epic 6: PM** | Scheduling Accuracy, Auto-Generation | Parcial | ~2-3 días |
| **Epic 7: Reporting** | KPI Accuracy, Real-time updates | Parcial | ~2-3 días |
| **Epic 8: Infrastructure** | 100 concurrent users, API <100ms, /metrics, Security | SÍ | ~3-4 días |

### P0 Test Scenarios Integrados (40 tests)

Los siguientes 40 escenarios P0 del test design han sido integrados como acceptance criteria en las historias correspondientes:

**Authentication & Authorization (6 tests):**
- TS-AUTH-001, TS-AUTH-002: Login válido/inválido → Stories 1.2
- TS-AUTH-004: RBAC bypass → Story 1.4
- TS-AUTH-005, TS-AUTH-006: Role management → Story 1.4
- TS-SEC-003: Rate limiting → Story 1.2
- TS-SEC-005: Password hashing → Story 1.2

**Asset Management (5 tests):**
- TS-ASM-001, TS-ASM-002: Create asset, Search performance → Stories 2.1, 2.2
- TS-ASM-008, TS-ASM-010: CSV import → Story 2.7

**Work Orders (7 tests):**
- TS-WO-001, TS-WO-002: Create OT, Kanban load → Stories 4.1, 4.2
- TS-WO-003, TS-WO-004: SSE sync, Drag & drop → Story 4.2
- TS-WO-005, TS-WO-006, TS-WO-007: Priority, Concurrent edits, Assignment → Stories 4.3, 4.6

**Inventory (6 tests):**
- TS-INV-003, TS-INV-010, TS-INV-011: Stock deduction, Insufficient stock, Concurrency → Story 5.3
- TS-INV-007, TS-INV-008: CSV import → Story 5.6

**Security (5 tests):**
- TS-SEC-001: SQL injection sanitization → Epic 1 (middleware)
- TS-SEC-002: XSS escaping → Epic 1 (input validation)
- TS-SEC-009: Report permissions (Viewer no ve costos) → Story 7.4

**Infrastructure (3 tests):**
- TS-INF-004, TS-INF-005: Concurrent users, API performance → Story 8.4
- TS-RPT-002: KPI accuracy → Story 7.1

### Testability Requirements

**Requisitos Previos a la Implementación (bloqueadores):**

| ID | Requisito | Epic | Effort | Target |
|----|-----------|------|--------|--------|
| **TC-001** | Seeding API `/api/test-data` | All | 2-3 días | Sprint 1 |
| **TC-002** | SSE Mock Endpoint con fault injection | 4, 8 | 2-3 días | Sprint 1 |
| **TC-004** | Database Fixture Auto-Cleanup | All | 1-2 días | Sprint 1 |
| **TC-007** | Metrics Endpoint `/api/metrics` | 8 | 1 día | Sprint 2 |
| **TC-010** | Test Tenant Isolation (`x-test-tenant` header) | All | 1-2 días | Sprint 1 |
| **R-PERF-002** | Full-Text Search (PostgreSQL FTS) | 2, 5 | 3-5 días | Sprint 2 |
| **R-DATA-001** | Optimistic Locking para WOs | 4 | 2-3 días | Sprint 2 |
| **R-SEC-004** | Rate Limiting con test endpoint | 1 | 2-3 días | Sprint 2 |

**Total Pre-Implementation Effort:** ~14-22 días (~3-4 semanas)

### data-testid Attributes

Los siguientes atributos `data-testid` son requeridos para Playwright testing:

**Common:**
- `notification-toast`, `modal-dialog`, `confirm-button`, `cancel-button`

**Authentication:**
- `email-input`, `password-input`, `login-button`, `error-message`

**Assets:**
- `asset-code-input`, `asset-name-input`, `create-asset-button`, `asset-list`
- `csv-upload-input`, `progress-bar`, `validation-summary`

**Work Orders:**
- `kanban-board`, `wo-card-{code}`, `column-backlog`, `column-in-progress`, `column-completed`
- `wo-title-input`, `wo-priority-select`

**Inventory:**
- `inventory-sku-input`, `inventory-quantity-input`, `update-stock-button`, `stock-level-indicator`

### Risk Mitigation

**9 High-Priority Risks (Score ≥6) con mitigación documentada:**

| Risk ID | Category | Score | Epic | Mitigation |
|---------|----------|-------|------|------------|
| R-TECH-001 | TECH | 6 | 4 | SSE Mock Endpoint + fault injection |
| R-TECH-002 | TECH | 6 | 2, 5 | CSV validation test harness (10K+ cases) |
| R-TECH-004 | TECH | 6 | 2, 5 | PostgreSQL FTS + benchmark |
| R-SEC-001 | SEC | 6 | 1 | RBAC test matrix (8×8=64 tests) |
| R-SEC-004 | SEC | 6 | 1 | Rate limiting test endpoint |
| R-PERF-001 | PERF | 6 | 4, 7 | SSE load test (50 concurrent users) |
| R-PERF-002 | PERF | 6 | 2, 5 | Search benchmark (10K+ assets) |
| R-DATA-001 | DATA | 6 | 4 | Optimistic locking + concurrency tests |
| R-BUS-001 | BUS | 6 | 4, 6 | Priority algorithm unit tests |

### Próximos Pasos Recomendados

1. **Revisar Quality Gates** con Architecture/Dev/QA teams
2. **Address pre-implementation blockers** (8 items, ~3-4 semanas)
3. **Setup QA infrastructure** (Playwright, k6, OWASP ZAP)
4. **Run BMAD `create-epics-and-stories` workflow** (usar handoff document)
5. **Allocate resources**: 1 QA + 1 Backend Dev para 10-14 semanas

### Workflows TEA Siguientes

1. ✅ **TEA System-Level Test Design** (`testarch-test-design`) - COMPLETADO
2. ✅ **BMAD Create Epics & Stories** (este documento) - COMPLETADO
3. **TEA Framework Setup** (`testarch-framework`) - Configurar Playwright
4. **TEA ATDD** (`testarch-atdd`) - Por story, Test-First
5. **TEA Automate** (`testarch-automate`) - Expandir cobertura
6. **TEA Trace** (`testarch-trace`) - Validar cobertura completa

---

**Document Version:** 2.0 (Test Design Integrated)
**Last Updated:** 2026-02-27
**Integration Source:** `_bmad-output/test-artifacts/test-design/gmao-hiansa-handoff.md`
**TEA Workflow:** `testarch-test-design` (System-Level)

**End of Document**
