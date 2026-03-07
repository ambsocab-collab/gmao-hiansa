# Success Criteria

## User Success

**Para Operarios de Línea (Carlos):**
- **Outcome:** Sentirse escuchado y ver que sus averías se atienden
- **Métricas:**
  - Tasa de reporte de averías por operario/semana (meta: aumentar vs línea base actual)
  - Tiempo desde detección hasta reporte en app (meta: <5 minutos)
  - Tasa de conversión de avisos a OTs autorizadas (meta: >70% - indica reportes válidos)
  - Feedback recibido: % de avisos con notificación de estado (meta: 100%)
- **Comportamiento de éxito:** Operarios reportan sistemáticamente en app en lugar de WhatsApp, dejan de quejarse de "nadie hace caso", recomiendan la app entre pares

**Para Técnicos de Mantenimiento (María):**
- **Outcome:** Trabajo organizado con clara visibilidad de tareas
- **Métricas:**
  - Adopción: % de técnicos que abren la app diariamente (meta: 100% primer mes)
  - OTs completadas por técnico/semana (línea base a establecer)
  - Tiempo de primera OT desde llegada (meta: <15 minutos - no pierden tiempo preguntando)
  - Actualización de estado en tiempo real (meta: >90%)
  - Usuarios con capability `can_update_own_ot`: % que actualizan OTs asignadas (meta: >95%)
- **Comportamiento de éxito:** Técnicos con capability `can_update_own_ot` abren la app cada mañana como primera acción, actualizan OTs en campo, dicen "¿cómo hacíamos antes sin esto?"

**Para Supervisores (Javier):**
- **Outcome:** Control de carga de trabajo del equipo
- **Métricas:**
  - Frecuencia de acceso a tablero Kanban (meta: múltiples veces por turno)
  - Balanceo de carga: desviación estándar de OTs por técnico (meta: <2 OTs)
  - Triage time: tiempo promedio desde aviso hasta decisión (meta: <2 horas)
  - Asignación visual: % de OTs asignadas vía drag-and-drop (meta: >80%)
  - Usuarios con capability `can_assign_technicians`: % que asignan técnicos visualmente (meta: >90%)
  - Usuarios con capability `can_view_all_ots`: % que usan Kanban diariamente (meta: 100%)
- **Comportamiento de éxito:** Usuarios con capability `can_view_all_ots` gestionan visualmente sin llamar técnicos, reciben alertas de desbalance y actúan proactivamente

**Para Administrador (Elena):**
- **Outcome:** Datos para toma de decisiones y reporte a dirección
- **Métricas:**
  - Frecuencia de revisión de KPIs (meta: semanal)
  - Reportes generados para dirección (meta: mensual)
  - Reportes automáticos recibidos: % de usuarios con capability `can_receive_reports` que los reciben (meta: >80%)
  - Alertas accionables: % que resultan en acción correctiva (meta: >70%)
  - Sentimiento de control (cualitativo)
  - Usuarios con capability `can_view_kpis`: % que revisan dashboard semanalmente (meta: >90%)
  - Usuarios con capability `can_manage_users`: % que gestionan capacidades activamente (meta: 100% de admins)
  - Usuarios con capability `can_manage_assets`: % que gestionan activos correctamente (meta: 100% de admins)
- **Comportamiento de éxito:** Usuarios con capability `can_view_kpis` revisan dashboard semanalmente para identificar tendencias, reportan a dirección con datos concretos, toman decisiones basadas en métricas. Usuarios con capability `can_manage_users` gestionan flexiblemente las 15 capacidades del sistema. Usuarios con capability `can_receive_reports` reciben reportes automáticos configurados según sus preferencias. Usuarios con capability `can_manage_assets` gestionan jerarquía de activos y estados de equipos correctamente

## Business Success

**Corto Plazo (3 meses post-lanzamiento MVP):**
- **Adopción del sistema:** 100% de usuarios registrados y activos (sistema se usa rutinariamente)
- **Migración desde canales antiguos:** 90% de averías reportadas por app, no WhatsApp
- **Establecimiento de línea base:** Primeros datos históricos de MTTR y MTBF capturados (mínimo 50 OTs completadas)

**Mediano Plazo (6-12 meses post-lanzamiento):**
- **Profesionalización del departamento:** Imagen transformada de "caótico" a "profesional" (percepción cualitativa de otros departamentos)
- **Transición a mantenimiento proactivo:** Aumento de rutinas preventivas vs correctivas (% de OTs preventivas vs correctivas, línea base a establecer)
- **Mejora continua basada en datos:** Decisiones de mantenimiento fundamentadas en métricas (número de decisiones con referencia a KPIs)

**Largo Plazo (12+ meses):**
- **Reducción de costos:** Mantener o reducir costo de mantenimiento/producción (tendencia decreciente o estable)
- **Reducción de downtime:** Horas de parada por fallas/mes (tendencia decreciente)

**Gate de Decisión (3 meses):**
- Si se cumplen criterios → Continuar a Phase 2
- Si no → Reevaluar y ajustar antes de expandir

## Technical Success

**Performance:**
- Búsqueda predictiva devuelve resultados en <200ms
- Dashboard refresca KPIs cada 30-60 segundos (websockets, no polling)
- PWA funciona offline parcialmente (sincroniza cuando reconecta)

**Confiabilidad:**
- Sistema sincroniza multi-dispositivo en tiempo real (tablet, móvil, desktop, TV)
- Estados de OT se actualizan automáticamente (ej: "Pendiente Repuesto" → "En Progreso" cuando llega material)

**Escalabilidad:**
- Soporta jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto) con 10,000+ activos
- Maneja relaciones muchos-a-muchos (componentes multi-equipos) sin degradación de performance

## Measurable Outcomes

**KPIs Core de Mantenimiento:**
- **MTTR (Mean Time To Repair):** Tiempo promedio desde reporte hasta completada. Meta: reducción 20% a 6 meses, 35% a 12 meses (vs línea base)
- **MTBF (Mean Time Between Failures):** Tiempo promedio entre fallos. Meta: aumento 15% a 6 meses, 30% a 12 meses (vs línea base)

**KPIs Complementarios:**
- Productividad de técnicos: OTs completadas/técnico/semana (meta: aumento 10% en 6 meses)
- Calidad de triage: % de avisos convertidos a OTs (meta: >70%)
- Stock de repuestos: % de OTs retrasadas por falta de material (meta: <5%)
- Costo de mantenimiento: costo total/unidades producidas (meta: mantener o reducir ratio)
- Carga de trabajo: balanceo entre técnicos (desviación estándar <2 OTs)

**Métricas de Adopción:**
- Usuarios activos: % registrados que hicieron login última semana (meta: >90%)
- Reportes vía app: % de averías por app vs WhatsApp (meta: >90% a 3 meses)
- Tiempo de reporte: tiempo desde detección hasta app (meta: <5 minutos)

---
