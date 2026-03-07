# Project Context Analysis

## Requirements Overview

**Functional Requirements:**

El sistema implementa un GMAO (Gestión de Mantenimiento Asistido por Ordenador) completo con 123 requerimientos funcionales organizados en 10 áreas de capacidad:

1. **Gestión de Averías (FR1-FR10):** Reporte por operarios con búsqueda predictiva, notificaciones push en tiempo real, confirmación de operario
2. **Gestión de Órdenes de Trabajo (FR11-FR31):** 8 estados de ciclo de vida, Kanban digital de 8 columnas, vista de listado con filtros, asignación múltiple (1-3 técnicos o proveedores)
3. **Gestión de Activos (FR32-FR43):** Jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto), relaciones muchos-a-muchos, 5 estados de equipos, importación masiva CSV
4. **Gestión de Repuestos (FR44-FR56):** Stock en tiempo real visible para todos, actualizaciones silenciosas, alertas solo por stock mínimo, ubicación física en almacén
5. **Gestión de Usuarios y Capacidades (FR58-FR76):** Modelo PBAC con 15 capacidades granulares (no roles predefinidos), etiquetas de clasificación visual, onboarding con cambio de contraseña obligatorio
6. **Gestión de Proveedores (FR77-FR80):** Proveedores de mantenimiento y repuestos, catálogo de 6 tipos de servicio
7. **Gestión de Rutinas (FR81-FR84):** Rutinas diarias/semanales/mensuales, generación automática de OTs preventivas 24h antes, alertas de vencimiento
8. **Análisis y Reportes (FR85-FR95):** KPIs MTTR/MTBF con drill-down, reportes automáticos PDF por email (diario/semanal/mensual), exportación Excel
9. **Sincronización Multi-Dispositivo (FR96-FR100):** WebSockets para real-time <1s, responsive design con 3 breakpoints, PWA instalable
10. **Funcionalidades Adicionales (FR101-FR108):** Rechazo de reparación, búsqueda predictiva global, comentarios con fotos, QR codes

**Non-Functional Requirements:**

37 requerimientos no funcionales que impulsarán decisiones arquitectónicas críticas:

- **Performance (7 NFRs):** Búsqueda predictiva <200ms, carga inicial <3s, websockets <1s, KPIs <2s, transiciones <100ms, 50 usuarios concurrentes sin degradación, importación 10K activos <5min
- **Security (9 NFRs):** Autenticación obligatoria, contraseñas hasheadas (bcrypt/argon2), HTTPS/TLS 1.3, ACL por capacidades, auditoría de acciones críticas, sesiones 8h, sanitización inputs, rate limiting login (5 intentos/15min)
- **Scalability (5 NFRs):** 10,000 activos sin degradación, 100 usuarios concurrentes, índices DB optimizados, paginación listados, crecimiento a 20K con vertical scaling
- **Accessibility (6 NFRs):** WCAG AA (contraste 4.5:1), texto mínimo 16px, touch targets 44x44px, legible en iluminación de fábrica, navegación por teclado, zoom 200%
- **Reliability (6 NFRs):** 99% uptime horario laboral, backups diarios, RTO 4 horas, reconexión automática websockets <30s, mensajes error claros, confirmación operaciones críticas
- **Integration (4 NFRs):** Importación CSV validada, exportación Excel compatible, API REST para futura integración ERP, capacidades para IoT futuro

**Scale & Complexity:**

**Complejidad del proyecto:** Media-Alta

- **Dominio técnico principal:** Full-stack Web Application con real-time features (WebSockets, PWA, responsive design)
- **Componentes arquitectónicos estimados:** 12-15 componentes principales
  - Frontend: 6-8 (Dashboard, Kanban, Formularios, Listados, KPIs, Configuración)
  - Backend: 6-7 (API REST, WebSocket Server, Auth/PBAC, Business Logic, Data Access, Reporting, Background Jobs)

## Technical Constraints & Dependencies

**Restricciones técnicas conocidas:**

- **Single-tenant optimizado:** No es SaaS multi-tenant, permite personalización profunda sin necesidad de aislamiento entre organizaciones
- **Navegadores soportados:** Chrome y Edge únicamente (motores Chromium) - NO Firefox, Safari, IE
- **Ambiente industrial:** Requiere WiFi estable, tablets Android industriales, desktops Windows, TVs 4K con Chrome
- **Always online:** NO requiere modo offline (PWA para instalación y notificaciones, pero siempre conectada)
- **Fases de desarrollo:** MVP sin mantenimiento reglamentario (Phase 1.5), requiere arquitectura extensible para módulos futuros
- **Performance estricta:** Búsqueda <200ms con 10,000+ activos requiere optimización de índices y caché

**Dependencias externas:**

- Proveedores de mantenimiento externo (requieren coordinación para OTs asignadas)
- Servicio de email para reportes automáticos PDF
- Futura integración ERP (Phase 3+) - requiere API REST documentada
- Futura integración IoT (Phase 4) - requiere capacidades de ingesta de datos

## Cross-Cutting Concerns Identified

**Preocupaciones transversales que afectarán múltiples componentes:**

1. **Autorización y Control de Acceso (PBAC):**
   - 15 capacidades granulares sin roles predefinidos
   - Requiere middleware de autorización en toda la API
   - UI adaptativa según capacidades asignadas
   - Auditoría de cambios de capacidades

2. **Sincronización en Tiempo Real:**
   - WebSockets para 100 usuarios concurrentes
   - Actualizaciones <1s en todos los dispositivos conectados
   - Estados de OT sincronizados (ej: "Pendiente Repuesto" → "En Progreso")
   - Heartbeat de 30 segundos para conexiones
   - Reconexión automática <30s

3. **Performance de Búsqueda:**
   - Búsqueda predictiva <200ms con jerarquía de 5 niveles
   - Búsqueda global (equipos, componentes, repuestos, OTs, técnicos, usuarios)
   - Debouncing 300ms para optimización
   - Índices de base de datos optimizados
   - Caché de búsquedas frecuentes

4. **Accesibilidad Industrial (WCAG AA):**
   - Contraste 4.5:1 mínimo en toda la UI
   - Texto mínimo 16px, touch targets 44x44px
   - Navegación por teclado (desktop) y touch (tablet/móvil)
   - Zoom 200% sin romper layout
   - Lectura en iluminación de fábrica

5. **Seguridad Empresarial:**
   - Autenticación obligatoria para todos los endpoints
   - Contraseñas hasheadas nunca en texto plano
   - HTTPS/TLS 1.3 obligatorio
   - ACL por capacidades en backend y frontend
   - Auditoría de acciones críticas (cambios de capacidades, stock, estados)
   - Rate limiting contra fuerza bruta
   - Sanitización de inputs contra XSS/SQL injection

6. **Responsive Design Multi-Dispositivo:**
   - 3 breakpoints: >1200px (desktop), 768-1200px (tablet), <768px (móvil)
   - Componentes adaptativos (Kanban: 3 columnas → 2 → 1 con swipe)
   - Touch targets 44x44px mínimo
   - PWA instalable en dispositivos

7. **Gestión de Datos Masivos:**
   - Importación 10,000 activos en <5 minutos
   - Jerarquía de 5 niveles validada
   - Paginación para listados grandes
   - Optimización de queries con índices

8. **Notificaciones y Comunicaciones:**
   - Notificaciones push para cambios de estado OT
   - Email PDF programado (diario/semanal/mensual)
   - Alertas accionables (stock mínimo, MTFR alto, rutinas vencidas)
   - Silencio selectivo (actualizaciones de stock sin spam a gestores)

9. **Reporting y Analítica:**
   - KPIs MTTR/MTBF con drill-down 4 niveles
   - Exportación Excel compatible Microsoft 2016+
   - Generación PDF con programación cron
   - Cálculos en tiempo real (datos actualizados cada 30s)
