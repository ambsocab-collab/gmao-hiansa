# Non-Functional Requirements

Esta sección define **LOS ATRIBUTOS DE CALIDAD** del sistema: QUÉ BIEN debe performar (no QUÉ debe hacer).

Solo se documentan NFRs relevantes para este producto específico. Cada requerimiento es específico y medible.

## Performance

**¿Por qué importa:** Los operarios y técnicos necesitan respuestas rápidas en ambiente de fábrica. Las demoras causan frustración y abandonment del sistema.

- **NFR-P1:** La búsqueda predictiva de equipos (principal criterio de búsqueda) debe devolver resultados en menos de 200ms. La búsqueda universal (equipos, componentes, repuestos, OTs, técnicos, usuarios) puede extenderse hasta 500ms para consultas complejas multi-campo.
- **NFR-P2:** La carga inicial (first paint) de la aplicación debe completarse en menos de 3 segundos en conexión WiFi industrial estándar
- **NFR-P3:** Las actualizaciones en tiempo real via Server-Sent Events (SSE) deben reflejarse en todos los clientes conectados cada 30 segundos (heartbeat). Nota: SSE es más simple y compatible con Vercel serverless que WebSockets, y cumple los requisitos del producto con actualizaciones cada 30 segundos.
- **NFR-P4:** El dashboard de KPIs debe cargar y mostrar datos en menos de 2 segundos
- **NFR-P5:** Las transiciones entre vistas (p.ej. Kanban ↔ Listado) deben completarse en menos de 100ms
- **NFR-P6:** El sistema debe soportar 50 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta)
- **NFR-P7:** La importación masiva de 10,000 activos debe completarse en menos de 5 minutos

## Security

**¿Por qué importa:** Es una aplicación empresarial interna con datos sensibles de producción, inventario, proveedores, y control de acceso granular.

- **NFR-S1:** Todos los usuarios deben autenticarse antes de acceder al sistema
- **NFR-S2:** Las contraseñas deben almacenarse hasheadas (bcrypt/argon2) nunca en texto plano
- **NFR-S3:** Todas las comunicaciones entre cliente y servidor deben usar HTTPS/TLS 1.3
- **NFR-S4:** El sistema debe implementar control de acceso basado en capacidades (ACL) para restringir acceso a módulos
- **NFR-S5:** El sistema debe registrar logs de auditoría para acciones críticas (cambio de capabilities, ajustes de stock, cambio de estados de equipos)
- **NFR-S6:** Las sesiones de usuario deben expirar después de 8 horas de inactividad
- **NFR-S7:** El sistema debe sanitizar todas las entradas de usuario para prevenir inyección SQL/XSS
- **NFR-S8:** Los datos sensibles (contraseñas, tokens) nunca deben aparecer en logs o errores expuestos al cliente
- **NFR-S9:** El sistema debe implementar Rate Limiting para prevenir ataques de fuerza bruta en login (máx. 5 intentos fallidos por IP en 15 minutos)

## Scalability

**¿Por qué importa:** Single-tenant para una empresa específica, pero necesita soportar crecimiento de activos y usuarios.

- **NFR-SC1:** El sistema debe soportar hasta 10,000 activos sin degradación de performance. Método de medición: Prueba de carga con JMeter simulando 10,000 activos con consultas concurrentes, verificando tiempos de respuesta <200ms en búsqueda predictiva (NFR-P1)
- **NFR-SC2:** El sistema debe soportar hasta 100 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta). Método de medición: Prueba de carga con 100 usuarios simultáneos durante 1 hora usando JMeter o herramienta similar, verificando degradación <10% en NFR-P1 a NFR-P6
- **NFR-SC3:** La base de datos debe estar optimizada con índices para consultas frecuentes (búsqueda de equipos, filtrado de OTs, KPIs). Método de medición: Análisis EXPLAIN query en consultas frecuentes de búsqueda y listado, verificando uso de índices y tiempos de ejecución <50ms para queries críticas
- **NFR-SC4:** El sistema debe implementar paginación para listados grandes (p.ej. más de 100 items por vista). Método de medición: Testing de carga con listados de 100, 500, 1000 items, verificando tiempo de carga <500ms independientemente del tamaño del listado (siempre con paginación)
- **NFR-SC5:** El sistema debe soportar crecimiento a 20,000 activos con ajustes de infraestructura sin cambios de arquitectura. Método de medición: Proyección lineal basada en pruebas de carga con 10,000 activos, certificando que la arquitectura actual permite escalar a 20,000 activos con ajustes de hardware solamente (vertical scaling)

## Accessibility

**¿Por qué importa:** Ambiente industrial con usuarios variados (operarios de línea, técnicos, supervisores, admin). No es público general.

- **NFR-A1:** La interfaz debe cumplir con nivel WCAG AA de contraste (mínimo 4.5:1 para texto normal)
- **NFR-A2:** El tamaño de texto base debe ser mínimo 16px con títulos de 20px o más
- **NFR-A3:** Los elementos interactivos (botones, links) deben tener un tamaño mínimo de 44x44px para facilitar toque en tablets/móviles
- **NFR-A4:** La interfaz debe ser legible en condiciones de iluminación de fábrica (alto contraste, sin dependencia de color solo)
- **NFR-A5:** La aplicación debe ser navegable usando teclado (Tab, Enter, Esc) en desktop y mediante touch targets (44x44px mínimo) en tablets/móviles
- **NFR-A6:** La interfaz debe soportar zoom hasta 200% sin romper el layout

## Reliability

**¿Por qué importa:** El downtime del sistema afecta la operación de fábrica. Si los operarios no pueden reportar averías, se pierden datos críticos.

- **NFR-R1:** El sistema debe tener un uptime objetivo del 99% durante horarios de operación de fábrica (día laboral)
- **NFR-R2:** El sistema debe realizar backups automáticos diarios de la base de datos
- **NFR-R3:** El sistema debe tener un proceso de restore validado con recovery time objetivo (RTO) de 4 horas
- **NFR-R4:** Las conexiones SSE (Server-Sent Events) deben reconectarse automáticamente si se pierde conexión temporal (<30 segundos)
- **NFR-R5:** El sistema debe mostrar mensajes claros de error cuando un servicio no está disponible
- **NFR-R6:** Las operaciones críticas (completar OT, ajustes de stock) deben tener confirmación de éxito antes de considerarlas completadas

## Integration

**¿Por qué importa:** El sistema necesita interactuar con proveedores externos y eventualmente con ERP/producción.

- **NFR-I1:** El sistema debe soportar importación masiva de datos mediante archivos CSV con formato validado
- **NFR-I2:** El sistema debe exportar reportes de KPIs en formato Excel compatible con Microsoft Excel 2016+
- **NFR-I3:** La arquitectura debe permitir futura integración con sistemas ERP mediante API REST (Phase 3+). Método de medición: Revisión arquitectónica verificando que endpoints REST estén documentados con OpenAPI/Swagger y capacidades de autenticación (OAuth2/JWT) para integración de terceros
- **NFR-I4:** La arquitectura debe permitir futura integración con sistemas de producción (IoT) para lectura de datos de equipos (Phase 4). Método de medición: Revisión arquitectónica verificando capacidades de ingesta de datos externos vía API REST o webhooks, con autenticación y validación de datos

---

**Total: 37 Requerimientos No Funcionales** organizados en 6 categorías relevantes

**Resumen de Categorías:**

| Categoría | ¿Relevante? | # de NFRs | Justificación |
|-----------|-------------|-----------|---------------|
| **Performance** | ✅ Sí | 7 | Usuarios necesitan respuestas rápidas en fábrica |
| **Security** | ✅ Sí | 9 | Datos empresariales sensibles, roles/capacidades |
| **Scalability** | ⚠️ Parcial | 5 | Single-tenant, pero crecimiento a 10K+ activos |
| **Accessibility** | ⚠️ Parcial | 6 | Ambiente industrial, no público general |
| **Reliability** | ✅ Sí | 6 | Downtime afecta operación de fábrica |
| **Integration** | ⚠️ Parcial | 4 | CSV/Excel ahora, ERP/IoT futuro |



