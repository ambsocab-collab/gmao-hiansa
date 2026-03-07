# Executive Summary

## Project Vision

**gmao-hiansa** es un GMAO (Gestión de Mantenimiento Asistido por Ordenador) **single-tenant optimizado** diseñado para transformar un departamento de mantenimiento reactivo en una organización profesional basada en datos. Es una Web App Responsiva (PWA) para una empresa metalúrgica con dos plantas especializadas (acero perfilado y panel sandwich).

**El Problema que Resuelve:**

El departamento opera con información fragmentada en herramientas dispersas:
- WhatsApp en celulares personales (sin "fuente única de verdad")
- Múltiples versiones de Excel sin sincronización
- Pizarra Kanban física con visibilidad limitada
- Pérdida de tiempo productivo, paradas por falta de repuestos, fallas recurrentes
- Incapacidad de medir y mejorar el desempeño
- Departamento percibido como "caótico" que necesita transición a proactivo

**La Solución:**

MVP con 13 funcionalidades base diseñadas para establecer cultura de datos desde el día 1:
- Aviso de averías <30 segundos con búsqueda predictiva
- Control de activos con jerarquía de 5 niveles
- Generación de Órdenes de Trabajo (OTs) con 8 estados
- Control de repuestos con stock en tiempo real
- Kanban digital de 8 columnas con código de colores
- KPIs en tiempo real (MTTR, MTBF) con drill-down
- Gestión de usuarios con 15 capacidades PBAC (Permission-Based Access Control)
- Gestión de proveedores (mantenimiento y repuestos)
- Componentes multi-equipos (relaciones muchos-a-muchos)
- Rutinas de mantenimiento (diario/semanal/mensual)
- PWA (Progressive Web App) responsive
- Reparación dual (interna/externa)
- Reportes automáticos por email

**Arquitectura de Crecimiento Progresivo:**

Fase 1.5 (3 meses): Mantenimiento Reglamentario y Certificaciones (PCI, eléctrico, presión)
Fase 2 (6 meses): Estructura completa, búsqueda universal, plantillas
Fase 3 (12 meses): QR tracking, IoT opcional
Fase 4 (18 meses): Optimización y predicción

**Diferenciadores Fundamentales:**

1. **Single-tenant optimizado** (no SaaS genérico) → personalización profunda imposible en soluciones genéricas
2. **Reporte de avería en <30 segundos** vs 2-5 minutos actuales
3. **Notificaciones push transparencia**: "recibido", "autorizado", "en progreso", "completado" → operario siente "mi voz importa"
4. **Dashboard público** genera transparencia total → profesionalización y confianza
5. **Búsqueda predictiva** en <200ms vs búsquedas manuales en Excel

## Target Users

**1. Carlos - Operario de Línea (25 años)**

- **Contexto:** Reporta averías en el piso de fábrica
- **Necesidad:** Sentirse escuchado y ver que sus averías se atienden
- **Comportamiento actual:** Usa WhatsApp personal, siente que "nadie hace caso"
- **Comportamiento deseado:** Reporta en app <30 segundos, recibe notificaciones de estado, confirma reparación → siente "mi voz importa"
- **Device:** Móvil (Android/iOS)
- **Capabilities clave:** `can_create_failure_report` (PREDETERMINADA)

**2. María - Técnica de Mantenimiento (28 años)**

- **Contexto:** Ejecuta Órdenes de Trabajo en el piso de fábrica y taller
- **Necesidad:** Trabajo organizado con clara visibilidad de tareas y stock de repuestos
- **Comportamiento actual:** Pregunta repetitivamente por asignaciones, busca repuestos sin saber ubicación
- **Comportamiento deseado:** Abre app cada mañana, ve OTs del día, actualiza en tiempo real, selecciona repuestos con stock/ubicación → "¿cómo hacíamos antes sin esto?"
- **Devices:** Tablet (trabajo en campo) + Móvil (notificaciones)
- **Capabilities clave:** `can_update_own_ot`, `can_complete_ot`, `can_view_own_ots`

**3. Javier - Supervisor de Mantenimiento (32 años)**

- **Contexto:** Gestiona carga de trabajo del equipo, triage de averías, asignación de técnicos/proveedores
- **Necesidad:** Control visual de carga de equipo sin llamar técnicos
- **Comportamiento actual:** Busca información en múltiples sistemas, llama técnicos para saber estado
- **Comportamiento deseado:** Tablero Kanban con código de colores, drag-and-drop assignment, modal ℹ️ con detalles completos → control total en 1 clic
- **Devices:** Desktop (trabajo de oficina) + Tablet (piso de fábrica)
- **Capabilities clave:** `can_view_all_ots`, `can_assign_technicians`

**4. Elena - Administrador / Jefa de Mantenimiento (38 años)**

- **Contexto:** Toma decisiones basadas en datos, gestiona usuarios y capacidades, reporta a dirección
- **Necesidad:** Datos concretos (MTTR, MTBF) para toma de decisiones y reportes
- **Comportamiento actual:** Busca en 3 Excels diferentes, no tiene datos históricos, decisiones basadas en intuición
- **Comportamiento deseado:** Dashboard con KPIs drill-down, gestión flexible de 15 capacidades por usuario, reportes automáticos configurables → "Por primera vez, tengo datos. No adivino."
- **Devices:** Desktop (trabajo de oficina)
- **Capabilities clave:** `can_view_kpis`, `can_manage_users`, `can_manage_assets`, `can_receive_reports`

**5. Pedro - Usuario con Capacidad de Gestión de Stock (35 años)**

- **Contexto:** Controla stock de repuestos sin spam continuo
- **Necesidad:** Control total sin interrupciones constantes
- **Comportamiento actual:** 10+ llamadas/día preguntando stock y ubicación
- **Comportamiento deseado:** Ve stock mínimo, recibe alerta solo al alcanzar mínimo, genera pedidos → "Qué paz. Sin spam. Solo me avisan cuando necesito actuar."
- **Devices:** Desktop (trabajo de oficina)
- **Capabilities clave:** `can_manage_stock`

**Nota:** Todos los usuarios comparten el **Dashboard Común** con KPIs básicos de la planta (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login. Elena y otros usuarios con `can_view_kpis` pueden hacer drill-down (Global → Planta → Línea → Equipo) y ver análisis avanzado.

## Key Design Challenges

**1. Resistencia al Cambio Cultural**

- **Descripción:** Operarios acostumbrados a WhatsApp/pizarra física pueden resistir la app
- **Impacto crítico:** Si Carlos no usa la app, todo el sistema se rompe (sin datos → sin KPIs)
- **Consideración UX:** Onboarding ultra-simplificado (30 segundos tutorial), feedback inmediato, notificaciones push que demuestran valor instantáneo ("Tu aviso fue autorizado", "María está trabajando en tu OT")
- **Métrica de éxito:** 90% de averías reportadas por app (no WhatsApp) a 3 meses

**2. Búsqueda Predictiva <200ms con Grandes Volúmenes**

- **Descripción:** 10,000+ activos con jerarquía de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto)
- **Impacto crítico:** Si la búsqueda es lenta, Carlos no reportará (volverá a WhatsApp)
- **Consideración UX:** Debouncing (300ms), caché de búsquedas frecuentes, suggestions inmediatas, autocomplete jerárquico, highlighting de término buscado
- **Métrica de éxito:** Tiempo desde detección hasta reporte en app <5 minutos

**3. Kanban de 8 Columnas en Móvil vs Tablet vs Desktop**

- **Descripción:** Pantallas pequeñas (<768px) no pueden mostrar 8 columnas horizontalmente
- **Impacto crítico:** Javier no puede gestionar visualmente en el suelo de fábrica
- **Consideración UX:**
  - Desktop (>1200px): 8 columnas visibles
  - Tablet (768-1200px): 2 columnas (Pendiente y En Progreso), Completada como modal
  - Móvil (<768px): 1 columna, swipe horizontal para cambiar columnas
- **Métrica de éxito:** 100% supervisores usan tablero Kanban diariamente

**4. Código de Colores Complejo con 7 Tipos de OT**

- **Descripción:** 7 tipos visuales + Púrpura (Reglamentario Phase 1.5)
  - 🌸 Rosa - Avisos de avería en Triage
  - ⚪ Blanco - Avisos de reparación en Triage
  - 🟢 Verde - Mantenimiento preventivo
  - 🔴 Rojizo - Correctivo normal (técnico propio)
  - 🔴📏 Rojo con línea blanca - Correctivo externo (proveedor viene)
  - 🟠 Naranja - Reparación interna (taller propio)
  - 🔵 Azul claro - Reparación externa (enviado a proveedor)
  - 🟣 Púrpura - Mantenimiento Reglamentario (Phase 1.5)
- **Impacto crítico:** Si no se distinguen claramente, Javier asignará mal técnicos/proveedores
- **Consideración UX:** Paleta WCAG AA compliance (4.5:1 mínimo), labels textuales redundantes (icon + color + texto), tooltip ℹ️ con detalles completos
- **Métrica de éxito:** Asignación correcta de técnicos/proveedores >95%

**5. Sistema PBAC con 15 Capacidades (No Roles)**

- **Descripción:** Elena necesita gestionar 15 capacidades individualmente por usuario, no por roles predefinidos
- **Impacto crítico:** Si la UI de gestión de capacidades es confusa, Elena asignará mal permisos → usuarios frustrados
- **Consideración UX:** Checkboxes con etiquetas legibles en castellano ("✅ Reportar averías", no `can_create_failure_report`), capacidad de edición en lote, vista de todas las capacidades en una sola pantalla
- **Métrica de éxito:** 100% de admins gestionan capacidades correctamente

## Design Opportunities

**1. "Momento ¡Aha!" para Operarios**

- **Oportunidad:** Diseñar notificaciones push que generen el momento mágico: "¡Wow! Esto funciona. Me escucharon."
- **Innovación UX:**
  - Confirmación inmediata tras reporte (dentro de 3 segundos con número de aviso)
  - Actualizaciones de estado en tiempo real (recibido → autorizado → en progreso → completado)
  - Mensaje de gratitude tras confirmación de operario ("Gracias por tu reporte. Tu aviso #123 ha contribuido a mantener la operación.")
- **Impacto:** Cambio cultural de "¿para qué reporto si no hacen caso?" a "siento que me escuchan"

**2. Dashboard de Transparencia Pública**

- **Oportunidad:** Dashboard en TV área común visible para toda la fábrica
- **Innovación UX:**
  - KPIs simplificados (MTTR, MTBF, OTs abiertas/completadas, técnicos activos)
  - Código de colores (verde = mejora, rojo = problema)
  - Sin datos sensibles (sin nombres de técnicos, sin costos)
  - Genera cultura de transparencia → profesionalización → confianza
- **Impacto:** Departamento transformado de "caótico" a "profesional"

**3. Modal ℹ️ con Trazabilidad Completa en 1 Clic**

- **Oportunidad:** Javier accede a toda la historia de una OT en un clic
- **Innovación UX:**
  - Modal scrollable con timeline visual
  - Fechas (creación, autorización, inicio, completado)
  - Origen (operario que reportó)
  - Técnicos/proveedores asignados con contacto telefónico
  - Repuestos usados con stock actualizado
  - Sin navegar a múltiples pantallas
- **Impacto:** Reduce tiempo de respuesta gerencial ("¿Qué pasa con la Prensa?" → 1 clic)

**4. Búsqueda Predictiva con Contexto Jerárquico**

- **Oportunidad:** Carlos escribe "prensa" → sistema sugiere con contexto
- **Innovación UX:**
  - Suggestions con ubicación en planta ("Prensa PH-500 (Panel Sandwich, Línea 2)")
  - Historial reciente ("Última avería: hace 3 días")
  - Estado actual ("Estado: Operativo / Averiado / En Reparación")
  - Reducir errores de selección
- **Impacto:** Reporte de avería en <30 segundos vs 2-5 minutos actuales

**5. Stock sin Spam: Alertas Solo cuando Importa**

- **Oportunidad:** Pedro recibe 1 llamada al día en lugar de 10+
- **Innovación UX:**
  - Técnicos ven stock y ubicación solos (Estante A3, Cajón 3)
  - Pedro solo recibe alerta cuando alcanza mínimo
  - Notificación silenciosa cuando María usa repuesto (sin spam)
  - Ahorra 2+ horas diarias
- **Impacto:** Control total sin interrupciones constantes
