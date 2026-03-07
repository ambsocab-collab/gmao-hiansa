# Project Scoping & Phased Development

## MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP con foco en eliminar el caos operativo inmediato (Excel + WhatsApp + pizarra física) y establecer cultura de datos desde el principio.

**Filosofía:**
- Resolver el dolor principal del día a día
- Establecer cultura de datos desde el día 1 (KPIs desde el principio)
- Crear bases sólidas para crecimiento progresivo
- **Mantenimiento Reglamentario** será la primera adición post-deploy (Phase 1.5)

**Resource Requirements:**
- **Team size mínimo:** 1 developer full-stack (web app moderna)
- **Skills requeridos:** Frontend (interfaz web interactiva), Backend (API REST/GraphQL), Server-Sent Events (SSE), UI/UX básico
- **Timeline estimado MVP:** 3-4 meses

## MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- ✅ **Carlos (Operario):** Aviso de averías <30 segundos, notificaciones de estado
- ✅ **María (Técnica):** OTs organizadas, repuestos con stock/ubicación, actualización en tiempo real
- ✅ **Javier (Supervisor):** Kanban digital 8 columnas, código de colores, asignación visual
- ✅ **Elena (Admin):** Dashboard KPIs (MTTR/MTBF), gestión de usuarios/capacidades, stock mínimo alerts
- ✅ **Pedro (Stock):** Control de repuestos sin spam (alertas solo stock mínimo)

**Must-Have Capabilities (13 funcionalidades base):**

**1. Módulo de Averías:**
- Búsqueda predictiva de equipos (<200ms)
- Formulario simplificado (equipo + descripción + foto opcional)
- Notificaciones push de estado (recibido, autorizado, en progreso, completado)
- Confirmación de operario (¿funciona?)

**2. Módulo de Órdenes de Trabajo (OTs):**
- 8 estados de ciclo de vida
- Triage de avisos → conversión a OTs
- Asignación a técnicos/proveedores (dropdown por tipo OT)
- Repuestos usados (selección desde OT con stock + ubicación)
- Actualización de estado en tiempo real (botón ▶️ Iniciar)

**3. Tablero Kanban Digital:**
- 8 columnas: Pendientes Triage, Asignaciones (dividida), En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completadas, Descartadas
- Columna "Asignaciones" dividida horizontalmente (Pendiente de Asignar / Programada)
- Código de colores de tarjetas:
  - 🌸 Rosa (avería triage), ⚪ Blanco (reparación triage)
  - 🔴 Rojizo (correctivo propio), 🔴📏 Rojo con línea (correctivo externo viene)
  - 🟠 Naranja (taller propio), 🔵 Azul (enviado fuera)
- Modal ℹ️ con detalles completos (fechas, origen, técnico/proveedor, repuestos)

**4. Control de Activos:**
- Jerarquía 5 niveles: Planta → Línea → Equipo → Componente → Repuesto
- Historial de OTs por equipo
- 5 estados de equipos: Operativo, Averiado, En Reparación, Retirado, Bloqueado
- Stock de equipos completos reutilizables (flujo circular)
- Capacidad requerida: `can_manage_assets` para editar, `can_view_repair_history` para consultar historial (solo lectura)

**5. Control de Repuestos (CONSUMIBLES):**
- Catálogo de repuestos con proveedores
- Stock en tiempo real
- Ubicación en almacén visible al seleccionar (Estante A3, Cajón 3)
- Actualización automática cuando técnico usa repuesto en OT
- Alertas solo al alcanzar stock mínimo (NO spam por cada uso)
- Ajustes manuales con motivo
- Pedidos a proveedores

**6. Dashboard de KPIs:**
- **KPIs core:** MTTR, MTBF
- **Drill-down:** Global → Planta → Línea → Equipo
- **Métricas adicionales:** OTs abiertas/completadas, técnicos activos, stock crítico
- **Alertas accionables:** Stock mínimo, MTFR aumento, rutinas no completadas
- Exportar a Excel

**7. Gestión de Usuarios y Capacidades:**
- Registro de usuarios por admin
- `can_create_failure_report` PREDETERMINADA
- 15 capacidades flexibles: `can_create_manual_ot`, `can_update_own_ot`, `can_view_own_ots`, `can_view_all_ots`, `can_complete_ot`, `can_manage_stock`, `can_assign_technicians`, `can_view_kpis`, `can_manage_assets`, `can_view_repair_history`, `can_manage_providers`, `can_manage_routines`, `can_manage_users`, `can_receive_reports`
- Admin puede cambiar capacidades en cualquier momento

**8. Proveedores Externos:**
- Gestión de proveedores de mantenimiento
- Gestión de proveedores de repuestos
- Datos de contacto
- Capacidades requeridas: `can_manage_providers` para gestionar

**9. Reportes Automáticos:**
- Reportes diarios, semanales y mensuales en PDF enviados por email
- KPIs configurables: MTTR, MTBF, OTs abiertas/completadas, stock crítico, técnicos activos, rutinas completadas
- Capacidad requerida: `can_receive_reports` para configurar y recibir reportes

**10. Componentes Multi-Equipos:**
- Relaciones muchos-a-muchos (grafo vs árbol)
- Navegación bidireccional

**11. Rutinas de Mantenimiento:**
- Rutinas diarias/semanales/mensuales
- Generación automática de OTs
- KPIs de rutinas (% completadas)
- Capacidad requerida: `can_manage_routines` para gestionar

**12. Reparación Dual:**
- Reparación interna (taller propio) 🟠
- Reparación externa (enviado a proveedor) 🔵

**13. PWA (Progressive Web App):**
- Responsive design (desktop/tablet/móvil)
- Instalable en dispositivos
- Notificaciones push
- Sincronización multi-dispositivo real-time (Server-Sent Events - SSE) con heartbeat de 30 segundos

**14. Reportes Automáticos por Email:**
- Reportes diarios (8:00 AM), semanales (lunes 8:00 AM), mensuales (primer lunes 9:00 AM)
- Formato PDF enviado por email + descarga manual desde dashboard
- KPIs configurables según usuario
- Capacidad requerida: `can_receive_reports`

NOTA: Las funcionalidades 1-14 constituyen el MVP completo con 15 capacidades PBAC

**Criterios de Éxito MVP:**
- 90% usuarios activos primer mes
- 90% averías reportadas por app (no WhatsApp)
- 100% supervisores usan tablero Kanban diariamente
- 100% técnicos abren app cada mañana
- >95% rutinas diarias completadas
- Mínimo 50 OTs completadas con datos suficientes para KPIs

## Post-MVP Features

### Phase 1.5 (Primer módulo post-deploy - Gate 3 meses)

**Mantenimiento Reglamentario y Certificaciones:**
- Nuevo tipo de OT: "Mantenimiento Reglamentario" 🟣
- Categorías: PCI, Baja Tensión, Alta Tensión, Presión
- Niveles de inspección A/B/C con frecuencias independientes
- Proveedores certificados (nº certificación)
- Certificados con archivos PDF
- Resultados: Favorable/Con observaciones/Desfavorable
- OTs de corrección hijas cuando desfavorable
- Bloqueo de equipos críticos
- Alertas de vencimiento (30 días, 7 días, VENCIDO)
- Dashboard de cumplimiento legal

**Gate de Decisión (3 meses):**
- ✅ 90% usuarios activos → Continuar a Phase 1.5
- ✅ 90% averías por app (no WhatsApp) → Implementar Reglamentario
- ✅ Mínimo 50 OTs completadas con datos KPIs → Sistema válido

### Phase 2 (6 meses - Post-MVP)

**Estructura Completa:**
- Búsqueda predictiva universal (todos los campos, no solo equipos)
- Plantillas de equipos (crear múltiples iguales rápidamente)
- Avisos desestimados con histórico detallado
- Análisis avanzado de causas raíz (5 Whys, Fishbone)

**Enfoque:** Profundizar funcionalidades base, no añadir nuevas áreas

### Phase 3 (12 meses - Expansion)

**Stock y Reparación Avanzada:**
- Etiquetado QR de equipos para tracking físico
- Cadena de custodia digital con QR
- Mapa en tiempo real de ubicación de equipos
- Integración IoT (opcional, solo si hay demanda real)

### Phase 4 (18 meses - Optimización)

**Optimización y Predicción:**
- Dashboards progresivos (simples → avanzados)
- Predicción inteligente sin IoT (aprende de históricos)
- Tutorial integrado contextual (tooltips, videos 30s)
- Preventivas automáticas inteligentes

**Visión a 2-3 años:**
- Sistema completamente integrado de mantenimiento
- Cultura de datos establecida en la organización
- Departamento reconocido como profesional y eficiente
- Capacidad de predecir fallas antes de que ocurran
- Integración con otros sistemas empresariales (ERP, producción)

## Risk Mitigation Strategy

### Technical Risks

**Riesgo 1: Escalabilidad de tiempo real a 10,000+ activos**
- **Mitigación:** Implementar heartbeat optimizado (30s) usando Server-Sent Events (SSE), más simple y compatible con Vercel serverless. SSE es suficiente para actualizaciones cada 30 segundos (cumple NFR del producto).
- **Simplificación inicial:** Actualizaciones cada 30s para OTs y KPIs via SSE (compatible con hosting serverless, sin necesidad de infraestructura compleja de WebSockets)

**Riesgo 2: Búsqueda predictiva <200ms con muchos datos**
- **Mitigación:** Implementar debouncing (300ms), usar índices de base de datos optimizados, caché de búsquedas frecuentes, empezar con búsqueda simple y optimizar después
- **Simplificación inicial:** Búsqueda por los 3 campos más usados (equipo, componente, repuesto)

### Market Risks

**Riesgo 1: Resistencia al cambio (operarios siguen usando WhatsApp)**
- **Mitigación:** Onboarding simplificado (30 segundos tutorial), feedback inmediato (notificaciones push), involucrar a operarios en beta testing, hacer app más rápida que WhatsApp
- **Validación:** Medir % de averías por app vs WhatsApp semanalmente

**Riesgo 2: Sistema percibido como "vigilancia" no "ayuda"**
- **Mitigación:** Enfatizar beneficios para técnicos (trabajo organizado, no preguntas repetitivas), dashboard público transparencia (todos ven mismos datos), no micro-management individual
- **Validación:** Entrevistas con técnicos a 1 mes y 3 meses

### Resource Risks

**Riesgo 1: Solo 1 developer - qué pasa si se enferma o abandona?**
- **Mitigación:** Código bien documentado, arquitectura modular simple, repositorio Git con commits claros, usando Next.js (framework estándar con comunidad grande)
- **Contingencia:** MVP funcional con 1 developer es posible, pero esponjar timeline a 4-5 meses

**Riesgo 2: Timeline 3-4 meses es muy agresivo**
- **Mitigación:** Priorizar funcionalidades core MVP, eliminar "nice-to-haves" (plantillas de equipos, búsqueda universal), lanzar con 80% de features y completar 20% restante en primeras semanas post-deploy
- **Contingencia:** MVP mínimo viable puede ser: Averías + Kanban + OTs básicas (sin repuestos, sin KPIs) → lanzar en 2 meses, luego agregar repuestos y KPIs

## Phased Development Summary

| Phase | Timeline | Features Core | Gate de Decisión |
|-------|----------|---------------|------------------|
| **MVP (Phase 1)** | Meses 0-3 | 13 funcionalidades base (sin reglamentario) | 90% adopción, 50+ OTs |
| **Phase 1.5** | Meses 3-4 | Mantenimiento Reglamentario (PCI, eléctrico, presión) - Primer módulo post-deploy | Certificados al día |
| **Phase 2** | Meses 4-6 | Estructura completa, búsqueda universal, plantillas | Adopción mantenida |
| **Phase 3** | Meses 6-12 | QR tracking, IoT opcional | ROI positivo |
| **Phase 4** | Meses 12-18 | Predicción, dashboards progresivos | Cultura de datos establecida |

---

Con el alcance y fases claramente definidos, pasamos a especificar los Requerimientos Funcionales que constituyen el contrato de capacidades del producto. Esta sección es vinculante para todo el trabajo downstream (UX, arquitectura, desarrollo).
