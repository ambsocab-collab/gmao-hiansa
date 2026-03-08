---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-core-experience', 'step-04-emotional-response', 'step-05-inspiration', 'step-06-design-system', 'step-07-defining-experience', 'step-08-visual-foundation', 'step-09-design-directions', 'step-10-user-journeys', 'step-11-component-strategy', 'step-12-ux-patterns', 'step-13-responsive-accessibility', 'step-14-complete']
inputDocuments: ['prd.md']
lastStep: 14
workflowCompleted: true
completionDate: 2026-03-07
---

# UX Design Specification gmao-hiansa

**Author:** Bernardo
**Date:** 2026-03-07
**Status**: ✅ COMPLETE

---

## Executive Summary

### Project Vision

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

### Target Users

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

### Key Design Challenges

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

### Design Opportunities

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

## Core User Experience

### Defining Experience

**La Acción Core: Reportar Avería en <30 Segundos**

La experiencia central de **gmao-hiansa** se define por una interacción crítica: **Carlos reportando una avería desde el piso de fábrica**.

Esta acción es el "core loop" del sistema por varias razones fundamentales:

1. **Es el punto de entrada de todos los datos:** Sin reportes de averías, no hay OTs, no hay KPIs, no hay datos históricos
2. **Es la interacción más frecuente:** Cada operario puede reportar múltiples averías por turno
3. **Es el momento de mayor fricción potencial:** Si Carlos tarda >2 minutos o no recibe confirmación, volverá a WhatsApp
4. **Es el make-or-break del sistema:** Si esta interacción falla, todo el sistema se rompe (sin datos → sin KPIs → sin valor)

**El Core Loop Completo:**

```
Carlos detecta falla → Reporta en app <30s → Recibe confirmación <3s
→ Javier ve aviso en Kanban → Convierte a OT → Asigna técnico
→ María recibe notificación → Inicia OT → Completa
→ Carlos recibe "OT completada" → Confirma "Sí, funciona bien"
→ Sistema: "Gracias por tu reporte"
```

Este loop se reparte entre múltiples usuarios, pero **comienza con Carlos reportando en <30 segundos**.

**Por Qué Esta Acción Core Define Todo el Producto:**

- Si Carlos reporta rápido y recibe feedback → Sistema tiene datos → KPIs funcionan → Departamento se profesionaliza
- Si Carlos NO reporta (vuelve a WhatsApp) → Sistema sin datos → KPIs vacíos → Proyecto falla

**Metrica de Éxito del Core Loop:**
- Tiempo desde detección hasta reporte en app: <5 minutos (objetivo)
- Tasa de conversión de avisos a OTs autorizadas: >70% (indica reportes válidos)
- 90% de averías reportadas por app (no WhatsApp) a 3 meses

### Platform Strategy

**Plataforma: PWA (Progressive Web App) Responsiva con WebSockets**

**gmao-hiansa** es una **Web App Responsiva** construida como aplicación web interactiva moderna, diseñada específicamente para funcionar en entornos industriales (fábricas metalúrgicas).

**Decisiones de Plataforma:**

**1. PWA (Progressive Web App) - No App Nativa**

**Razón:**
- Un solo codebase para Desktop, Tablet y Móvil
- Instalable en dispositivos (icono en home screen)
- Actualizaciones automáticas (sin App Store approval)
- Chrome/Edge solamente (motores Chromium) → consistencia garantizada
- Costo de desarrollo menor vs apps nativas iOS + Android

**Trade-off aceptado:** No acceso a hardware nativo (cámara, GPS) - no es crítico para MVP

**2. Responsive Design con 3 Breakpoints**

**Desktop (>1200px):**
- Layout completo con navegación lateral
- Kanban de 8 columnas visible en su totalidad
- Dashboard de KPIs con drill-down
- Ideal para: Elena (Admin), Javier (Supervisor)

**Tablet (768-1200px):**
- Navegación simplificada
- Kanban de 2 columnas (Pendiente y En Progreso), Completada como modal
- Dashboard adaptado
- Ideal para: María (Técnica), Javier (piso de fábrica)

**Móvil (<768px):**
- Navegación inferior (bottom nav)
- Kanban de 1 columna con swipe horizontal
- Botones 44x44px (WCAG AA compliance)
- Ideal para: Carlos (Operario)

**3. Touch-First para Tablets/Móviles**

**Especificaciones:**
- Touch targets mínimos: 44x44px (WCAG AA)
- Gestures soportados: swipe (cambiar columnas Kanban), drag-and-drop (asignación OTs)
- Zoom: 200% sin romper layout
- Input methods: touch principal, keyboard accesible en desktop

**4. WebSockets para Sincronización Real-Time**

**Casos de uso críticos:**
- Notificaciones push de estado: "Tu aviso fue autorizado" → llega en <30 segundos
- Actualización de OTs: Javier asigna técnica → María recibe notificación inmediata
- Stock en tiempo real: María usa repuesto → Pedro ve stock actualizado (sin notificación spam)
- KPIs en dashboard: Actualizados cada 30-60 segundos (websockets, no polling)

**Requerimiento técnico:** Heartbeat optimizado (30 segundos) para soportar 50+ usuarios concurrentes

**5. Always Online - Sin Modo Offline**

**Decisión arquitectónica:** MVP requiere conexión a internet constante

**Razón:**
- Sincronización real-time es crítica (notificaciones push, stock, KPIs)
- Escritura concurrente (múltiples usuarios actualizando mismos datos)
- Complejidad de sync offline > valor para MVP (Phase 1)
- WiFi industrial estable es requerimiento (especificado en NFRs)

**Trade-off:** Si WiFi cae, app no funciona - mitigación con mensajes claros de error y reconexión automática <30 segundos

**6. Navegadores Soportados: Chrome y Edge Solamente**

**Razón:**
- Motores Chromium → comportamiento consistente
- APIs modernas (WebSockets, PWA, Service Workers) bien soportadas
- Depuración más simple
- Base de usuarios empresariales típicamente usa Chrome/Edge

**Excluidos:** Firefox, Safari, IE - no soportados

**Resumen de Dispositivos por Usuario:**

| Usuario | Device Primario | Device Secundario | Contexto de Uso |
|---------|----------------|-------------------|-----------------|
| Carlos (Operario) | Móvil | - | Reporte en campo, notificaciones |
| María (Técnica) | Tablet | Móvil | Trabajo en campo, notificaciones |
| Javier (Supervisor) | Desktop | Tablet | Oficina (Kanban completo), piso de fábrica |
| Elena (Admin) | Desktop | - | Oficina (KPIs, gestión) |
| Pedro (Stock) | Desktop | - | Oficina (gestión de repuestos) |

### Effortless Interactions

**Áreas de Interacción que Deben Sentirse Completamente Naturales:**

**1. Búsqueda Predictiva <200ms con Contexto Jerárquico**

**Lo que hace effortless:**
- Carlos escribe "pren" (3 caracteres) → sistema muestra "Prensa PH-500 (Panel Sandwich, Línea 2)" en <200ms
- No necesita escribir nombre completo ni recordar jerarquía
- Suggestions incluyen: ubicación en planta, estado actual, última avería (ej: "hace 3 días")
- Highlighting del término buscado para confirmar selección correcta

**Implementación UX:**
- Debouncing (300ms) para no saturar con cada tecla
- Caché de búsquedas frecuentes
- Autocomplete jerárquico (Planta → Línea → Equipo)
- Flechas arriba/abajo + Enter para selección rápida (keyboard accesibility)

**Resultado:** Carlos reporta en <30 segundos vs 2-5 minutos actuales

**2. Notificaciones Push de Estado en Tiempo Real**

**Lo que hace effortless:**
- Carlos toca "Enviar" → recibe confirmación en <3 segundos: "Aviso #123 recibido. Gracias por tu reporte."
- 10 minutos después: notificación "Tu aviso #123 fue autorizado. OT asignada a María."
- 30 minutos después: notificación "María está trabajando en tu OT #123."
- 2 horas después: notificación "OT #123 completada. ¿Confirma que funciona?"

**Resultado:** Carlos siente "mi voz importa" sin tener que verificar activamente

**Implementación UX:**
- Push notifications con acción (toca para ver detalles)
- Preferencias configurables (habilitar/deshabilitar tipos)
- Historial de notificaciones (últimas 24 horas)
- Sonoro/vibración opcional por tipo de notificación

**3. Modal ℹ️ con Trazabilidad Completa en 1 Clic**

**Lo que hace effortless:**
- Javier ve tarjeta OT en Kanban → toca ℹ️ → modal con toda la historia:
  - Timeline visual: Creación → Autorización → Inicio → Completado
  - Origen: Carlos (Operario) reportó el 2026-03-07 a las 09:03
  - Asignados: María (Técnica) + Juan (Técnico)
  - Proveedor: Talleres Eléctricos SA - Tel: +54 11 1234-5678
  - Repuestos usados: Rodamiento SKF-6208 (Stock: 11, 📍 Estante A3, Cajón 3)
  - Fotos antes/después (si adjuntadas)
  - Notas internas de técnicos

**Resultado:** Javier responde "¿Qué pasa con la Prensa?" en 10 segundos vs 2-3 minutos de búsqueda

**Implementación UX:**
- Modal scrollable con secciones colapsables
- Timeline vertical con iconos de estado
- Click-to-call para teléfonos
- Links directos a equipos/componentes/repuestos

**4. Stock Visible para Todos Sin Spam**

**Lo que hace effortless:**
- María toca "Agregar Repuesto" → escribe "skf" → ve "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Selecciona, cantidad "1", toca "Guardar" → sistema confirma: "✓ Agregado. Stock actualizado: 11"
- Pedro NO recibe notificación (sin spam)

**Resultado:** María trabaja sin interrupciones, Pedro solo recibe alertas cuando alcanza mínimo

**Implementación UX:**
- Stock visible en catálogo (todos pueden ver)
- Ubicación física siempre visible (Estante + Cajón)
- Solo usuarios con `can_manage_stock` reciben alertas de mínimo
- Ajustes manuales requieren motivo (auditoría)

**5. Drag-and-Drop para Asignación Visual**

**Lo que hace effortless:**
- Javier ve tarjeta en columna "Pendiente" → arrastra a "Asignada" → dropdown "Asignar a:" aparece
- Selecciona "María" → tarjeta baja a "Programada" (parte inferior de Asignaciones)
- María recibe notificación inmediata

**Resultado:** Asignación en 5 segundos vs formulario de 2-3 minutos

**Implementación UX:**
- Visual feedback durante drag (sombra, opacidad)
- Drop zones claras (columnas highlight)
- Alternativa keyboard-accessible (Tab + Enter)
- Undo automático (5 segundos) por si acaso

### Critical Success Moments

**Momentos que Determinan el Éxito o Fracaso del Sistema:**

**Momento 1: Primer Reporte de Carlos (First Run Success)**

**Escenario:**
- Carlos llega a trabajo, Elena anuncia la nueva app
- Recibe demo de 3 minutos, instala PWA en su móvil
- Siente escepticismo: "Otra app más..."

**Interacción Crítica:**
- 09:00 - Su perfiladora falla
- 09:02 - Abre app, búsqueda predictiva sugiere "Perfiladora P-201"
- 09:03 - Describe "No arranca, hace raro ruido", toca "Enviar"
- **<3 segundos después** - Recibe confirmación: "✓ Aviso #456 recibido. Gracias por tu reporte."

**Resultado ÉXITO:** Carlos piensa: "¡Wow! Esto es rápido. Mejor que WhatsApp."

**Resultado FRACASO:** No recibe confirmación o tarda >10 segundos → "Igual que antes, no sirve" → Vuelve a WhatsApp

**Impacto:** Si fallamos aquí, Carlos abandona el sistema y todo el loop se rompe

**Métrica:** Tasa de "first-time success" >95% (confirmación recibida <3 segundos)

---

**Momento 2: "Momento ¡Aha!" con Notificación de Estado**

**Escenario:**
- 09:15 - Carlos ya volvió a trabajar, olvidó del aviso
- De repente, notificación en móvil: "Tu aviso #456 fue autorizado. OT asignada a María"

**Interacción Crítica:**
- Carlos lee notificación → piensa: "¡Me escucharon! No fue en vano"
- Siente confianza en el sistema: "Vale la pena reportar"

**Resultado ÉXITO:** Carlos siente "mi voz importa" → app se vuelve indispensable

**Resultado FRACASO:** No recibe notificación o tarda horas → "Nadie hace caso, igual que siempre" → Deja de reportar

**Impacto:** Este momento genera el cambio cultural de reactivo a proactivo

**Métrica:** % de avisos con notificación de estado = 100% (objetivo)

---

**Momento 3: Primer Acceso de María - "Todo Organizado"**

**Escenario:**
- 07:45 - María llega 15 min antes, como siempre
- Abre app por primera vez, tutorial de 1 minuto
- Ve su lista del día: 5 OTs, 2 rutinas

**Interacción Crítica:**
- María explora pantalla → ve OTs organizadas por prioridad
- Toca primera OT → ve detalles completos: equipo, avería, repuestos necesarios
- Piensa: "Todo está aquí. No tengo que preguntar nada"

**Resultado ÉXITO:** María abre app cada mañana como primera acción → "¿Cómo hacíamos antes sin esto?"

**Resultado FRACASO:** Tiene que buscar en múltiples pantallas → "Igual que antes, solo que digital" → Resistencia

**Impacto:** Determina productividad de técnicos y calidad de datos

**Métrica:** Tiempo de primera OT desde llegada <15 minutos (objetivo)

---

**Momento 4: Javier - "Un Clic y Tengo Toda la Historia"**

**Escenario:**
- 11:00 - Gerente de producción pasa por oficina de mantenimiento
- Pregunta: "¿Qué pasa con la Prensa? ¿Cuándo estará lista?"

**Interacción Crítica:**
- Javier abre Kanban → toca tarjeta ℹ️ de Prensa PH-500
- Modal muestra: Originó Carlos 09:03, autorizado 09:10, asignado María 09:12, en progreso 09:15, repuestos usados (Rodamiento SKF-6208), ETA 12:00
- Javier responde: "La Prensa estará lista a las 12:00. María está cambiando el rodamiento."

**Resultado ÉXITO:** Gerente asiente impresionado → "Excelente, muy organizado" → Validación del sistema

**Resultado FRACASO:** Javier dice: "Déjame buscar... uh... creo que María está trabajando en eso, déjame llamarla" → Percibido como "caótico" de nuevo

**Impacto:** Validación ante dirección genera credibilidad del departamento

**Métrica:** Tiempo de respuesta a consultas gerenciales <30 segundos (objetivo)

---

**Momento 5: Elena - "Por Primera Vez, Tengo Datos"**

**Escenario:**
- 10:00 - Reunión mensual con dirección
- Director pregunta: "¿Cómo va el departamento? ¿Necesitan más presupuesto?"

**Interacción Crítica:**
- Elena proyecta dashboard: "MTTR 4.2h (↓15% vs mes anterior), MTBF 127h (↑8%), OTs abiertas: 23 (↓5 vs mes anterior)"
- Director: "Excelente. Datos claros. Mejorando. Aprobado."

**Resultado ÉXITO:** Elena piensa: "Por primera vez, tengo datos. No adivino. Tengo credibilidad."

**Resultado FRACASO:** Elena dice: "Uh... bueno... tenemos varias órdenes abiertas... creo que vamos bien... déjame ver los Excels..." → Percibido como improvisado

**Impacto:** Datos concretos generan decisiones fundamentadas y presupuesto

**Métrica:** Frecuencia de revisión de KPIs semanal (objetivo: >90% de admins)

---

**Momento 6: Pedro - "Qué Paz. Sin Spam."**

**Escenario:**
- 07:30 - Pedro abre app, como siempre
- Ve SKF-6208: 13 unidades 🟢 (mínimo: 5)
- Piensa: "Todo bien. Hoy tendré un día tranquilo"

**10:45 - María usa repuesto** → Pedro NO recibe notificación (sin spam)

**14:00 - Primera (y única) llamada del día**: Alerta "Filtro F-205 alcanzó mínimo (6 unidades, mínimo: 5)"
- Pedro genera pedido de 10 unidades → vuelve a trabajar tranquilo

**Resultado ÉXITO:** Pedro recibe 1 llamada en todo el día vs 10+ antes → Ahorra 2+ horas diarias → "Qué paz. Solo me avisan cuando necesito actuar."

**Resultado FRACASO:** Pedro recibe notificación por cada uso de repuesto → "Es spam, lo voy a ignorar" → Pierde alertas importantes

**Impacto:** Sin spam = adopción sostenida del módulo de stock

**Métrica:** % de alertas stock mínimo que resultan en acción >80% (objetivo)

### Experience Principles

**Principios Rectores para Todas las Decisiones de UX:**

**1. Velocidad es Confianza**

**Principio:** Las respuestas rápidas generan confianza inmediata en el sistema.

**Aplicación práctica:**
- Búsqueda predictiva <200ms → Usuario piensa: "Este sistema es rápido"
- Confirmación de reporte <3 segundos → Usuario piensa: "Me escucharon"
- Notificaciones push en tiempo real → Usuario piensa: "Está pasando ahora"
- Dashboard KPIs carga <2 segundos → Usuario piensa: "Tengo el control"

**Anti-pattern:** Spinner de carga >5 segundos → Usuario piensa: "Esto es lento como los sistemas viejos" → Abandono

**Validación:** Medir tiempos de respuesta en every user interaction

---

**2. Transparencia Genera Profesionalización**

**Principio:** La visibilidad total de información transforma la percepción de "caótico" a "profesional".

**Aplicación práctica:**
- Dashboard público en TV área común → Todos ven mismos KPIs → Transparencia → Confianza
- Notificaciones push de estado a todos → Operario ve que su aviso avanza → Siente "mi voz importa"
- Stock visible para todos → Técnicos ven stock y ubicación solos → Pedro no recibe 10+ llamadas/día
- Historial completo en modal ℹ️ → Javier tiene toda la info en 1 clic → Percibido como organizado

**Anti-pattern:** Información siloada (solo admins ven X, solo técnicos ven Y) → Percepción de "favoritismo" o "caos"

**Validación:** Encuestas de percepción del departamento (6 meses) → "Profesional" vs "Caótico"

---

**3. Feedback Inmediato Valida al Usuario**

**Principio:** Cada acción del usuario debe recibir confirmación inmediata para generar confianza.

**Aplicación práctica:**
- Carlos toca "Enviar" → Recibe confirmación <3s con número de aviso → "¡Funcionó!"
- María toca "Iniciar OT" → OT pasa a "En Progreso" visualmente → "Vieron que empecé"
- Javier arrastra OT → Tarjeta cambia de columna + María recibe notificación → "Asignación completa"
- Pedro ajusta stock → Sistema confirma "Stock actualizado: 11" → "Quedó registrado"

**Anti-pattern:** Acciones sin feedback visible → Usuario duda "¿Hice clic? ¿Quedó registrado?" → Frustración

**Validación:** % de acciones con feedback visual = 100% (objetivo)

---

**4. Menos Clics = Más Productividad**

**Principio:** Cada clic eliminado ahorra segundos que se multiplican por 100 operaciones/día.

**Aplicación práctica:**
- Modal ℹ️ con toda la info en 1 clic (vs navegar 3-4 pantallas) → Ahorra 10-30 segundos por consulta
- Búsqueda predictiva con suggestions (vs escribir nombre completo) → Ahorra 5-10 segundos por selección
- Drag-and-drop para asignación (vs formulario con dropdowns) → Ahorra 2-3 minutos por asignación
- Stock visible al seleccionar repuesto (vs ir a pantalla separada) → Ahorra 5 segundos por repuesto

**Cálculo de impacto:**
- 100 consultas/día × 20 segundos ahorrados = 33 minutos ahorrados/día
- 20 asignaciones/día × 2 minutos ahorrados = 40 minutos ahorrados/día
- **Total: ~1.3 horas ahorradas/día por técnico**

**Anti-pattern:** "Pero si le agregamos este botón extra..." → Cada clic extra = fricción acumulativa

**Validación:** Medir número de clics en user flows críticos (benchmark vs competencia)

---

**5. Single Source of Truth Elimina Caos**

**Principio:** Un sistema centralizado reemplaza herramientas fragmentadas (WhatsApp + Excel + pizarra física).

**Aplicación práctica:**
- Jerarquía de activos de 5 niveles → "¿A qué línea pertenece esta prensa?" → 1 clic en ℹ️
- Stock en tiempo real → "¿Cuántos rodamientos quedan?" → 1 clic en catálogo
- Historial de OTs por equipo → "¿Cuándo falló la última vez?" → 1 clic en historial
- Estados de OT en tiempo real → "¿En qué estado está la OT?" → Columna Kanban visible

**Anti-pattern:** "Déjame revisar el Excel de... uh... ¿quién tenía la última versión?" → Pérdida de tiempo + errores

**Validación:** % de usuarios que dejan de usar herramientas legacy (WhatsApp, Excel) → >90% a 3 meses (objetivo)

---

**6. Touch-First para Ambientes Industriales**

**Principio:** Diseñar para touch (44x44px) primero, keyboard/mouse después, considerando ambiente de fábrica.

**Aplicación práctica:**
- Botones mínimos 44x44px (WCAG AA compliance) → María con guantes de trabajo puede tocar fácilmente
- Drag-and-drop con feedback visual → Javier en tablet puede asignar sin keyboard
- Swipe gestures para móvil → Carlos puede cambiar columnas Kanban con una mano
- Zoom 200% sin romper layout → Elena con vista cansada puede escalar texto

**Anti-pattern:** Botones pequeños de 32x32px → Imposible tocar con guantes → Frustración

**Validación:** Testing con usuarios reales en ambiente de fábrica (tablets industriales)

---

**7. WCAG AA Compliance es No-Negotiable**

**Principio:** Accesibilidad no es "nice-to-have", es requisito para ambiente industrial con iluminación variable.

**Aplicación práctica:**
- Contraste mínimo 4.5:1 (texto normal sobre fondo) → Legible en luz de fábrica
- Texto base 16px mínimo → Legible sin hacer zoom
- Labels textuales redundantes (icon + color + texto) → Daltónicos pueden distinguir OTs
- Keyboard navigation (Tab, Enter, Esc) → Accessibility sin mouse

**Anti-pattern:** "El rosa se ve bien" → En luz de fábrica con fluorescentes → ilegible

**Validación:** Automated accessibility testing + testing con usuarios con visión limitada

## Desired Emotional Response

### Primary Emotional Goals

**Transformación de Percepción: "Caótico" → "Profesional"**

El objetivo emocional primario de **gmao-hiansa** es hacer que cada usuario sienta que su contribución importa y que tiene el control, transformando colectivamente la percepción del departamento de mantenimiento de "caótico" a "profesional".

**5 Pilares Emocionales Core:**

**1. "Mi Voz Importa" (Validación)**
- **Usuario objetivo:** Carlos (Operario de Línea)
- **Emoción buscada:** Sentirse escuchado y reconocido
- **Anti-emoción a evitar:** "Nadie hace caso, para qué reporto"
- **Diseño UX:** Confirmación <3s con número de aviso, notificaciones push de cada cambio de estado, mensaje de gratitude "Gracias por tu reporte"

**2. "Tengo el Control" (Confianza)**
- **Usuarios objetivo:** Javier (Supervisor), María (Técnica)
- **Emoción buscada:** Sensación de control y dominio de la información
- **Anti-emoción a evitar:** "¿Qué está pasando? ¿Quién sabe?"
- **Diseño UX:** Modal ℹ️ con toda la historia en 1 clic, búsqueda predictiva <200ms, Kanban con código de colores, drag-and-drop

**3. "Tengo Datos" (Credibilidad)**
- **Usuario objetivo:** Elena (Admin)
- **Emoción buscada:** Seguridad en toma de decisiones fundamentada
- **Anti-emoción a evitar:** "Estoy adivinando, espero que esté bien"
- **Diseño UX:** Dashboard con KPIs drill-down (MTTR, MTBF), exportar a Excel, reportes automáticos configurables

**4. "Qué Paz" (Tranquilidad)**
- **Usuario objetivo:** Pedro (Stock)
- **Emoción buscada:** Control sin interrupciones constantes
- **Anti-emoción a evitar:** "Otra llamada más... no puedo concentrarme"
- **Diseño UX:** Stock visible para todos, alertas solo stock mínimo, notificaciones silenciosas (sin spam)

**5. "Somos Profesionales" (Orgullo)**
- **Usuarios objetivo:** Todos los usuarios
- **Emoción buscada:** Pertenencia a un equipo profesional y organizado
- **Anti-emoción a evitar:** "Somos un caos, siempre improvisando"
- **Diseño UX:** Dashboard público transparencia, código de colores consistente, historial completo, notificaciones push a todos

### Emotional Journey Mapping

**Viaje Emocional de Carlos (Operario):**

| Etapa | Emoción Actual | Emoción Deseada | Momento de Transformación |
|-------|----------------|-----------------|---------------------------|
| **Descubrimiento** | "Otra app más..." (Escepticismo) | Curiosidad | Elena anuncia la app con demo 3 min |
| **Primer reporte** | "¿Funcionará?" (Duda) | "¡Wow! Esto es rápido" (Sorpresa positiva) | Confirmación recibida <3s con número de aviso |
| **30 min después** | "Olvidé del aviso" (Indiferencia) | "¡Me escucharon! No fue en vano" (Validación) | Notificación push: "Tu aviso fue autorizado" |
| **2 horas después** | "¿Cómo irá?" (Incertidumbre) | "¡María está trabajando en mi OT!" (Pertenencia) | Notificación: "En progreso - María asignada" |
| **OT completada** | "¿Funcionará?" (Preocupación) | "¡Sí! Mi aporte fue valioso" (Satisfacción) | Confirmación: "Gracias por tu reporte" |
| **1 semana después** | "¿Funciona siempre?" | "Siento que mi voz importa" (Confianza) | 3er reporte con misma velocidad de respuesta |

**Viaje Emocional de María (Técnica):**

| Etapa | Emoción Actual | Emoción Deseada | Momento de Transformación |
|-------|----------------|-----------------|---------------------------|
| **Primer login** | "¿Qué tan difícil será?" (Ansiedad leve) | Interés | Tutorial 1 min, ve 5 OTs del día |
| **Explora pantalla** | "¿Dónde empiezo?" (Confusión inicial) | "Todo está aquí" (Alivio) | Ve OTs organizadas por prioridad |
| **Inicia primera OT** | "¿Quedó registrado?" (Incertidumbre) | "Vieron que empecé" (Confianza) | OT pasa visualmente a "En Progreso" |
| **Agrega repuesto** | "¿Habrá stock?" (Preocupación) | "Qué fluido" (Satisfacción) | Ve stock 12, ubicación A3-Cajón 3 |
| **Completa OT** | "¿Todo bien?" (Duda) | "¡Una más!" (Logro) | Sistema confirma, ve progreso en dashboard |
| **2 semanas después** | "¿Cómo hacía antes?" | "¿Cómo hacíamos antes sin esto?" (Euforia productiva) | Compara con proceso manual anterior |

**Viaje Emocional de Javier (Supervisor):**

| Etapa | Emoción Actual | Emoción Deseada | Momento de Transformación |
|-------|----------------|-----------------|---------------------------|
| **Gerente pregunta** | "¿Qué diré?" (Ansiedad de desempeño) | "Sé la respuesta" (Confianza) | Toca tarjeta ℹ️ en Kanban |
| **Lee modal** | "Espero que sepa..." | "Tengo toda la historia" (Seguridad) | Ve timeline completo: origen, fechas, técnico |
| **Responde** | "Ojalá sepa..." | "La Prensa estará lista a las 12:00" (Certeza) | Responde con precisión en 10 segundos |
| **Gerente asiente** | "¿Estará bien?" (Validación externa pendiente) | "Excelente, muy organizado" (Reconocimiento) | Gerente impresionado con respuesta |
| **Diario** | "¿Qué está pasando hoy?" | "Tengo control total" (Dominio) | Kanban de 8 columnas con código de colores |
| **1 mes después** | "Espero que funcione" | "¿Cómo hacíamos antes?" (Transformación cultural) | Compara con pizarra Kanban física |

**Viaje Emocional de Elena (Admin):**

| Etapa | Emoción Actual | Emoción Deseada | Momento de Transformación |
|-------|----------------|-----------------|---------------------------|
| **Reunión dirección** | "¿Qué diré?" (Ansiedad de credibilidad) | "Tengo la verdad" (Confianza) | Abre dashboard KPIs |
| **Proyecta dashboard** | "¿Será suficiente?" (Duda) | "MTTR ↓15%, MTBF ↑8%" (Certeza) | Datos concretos en pantalla |
| **Director pregunta** | "¿Me creerán?" | "Datos claros. Mejorando." (Fundamentación) | Presenta métricas con drill-down |
| **Director aprueba** | "¿Estará bien?" | "Aprobado" (Validación profesional) | Director asiente con datos |
| **Semanalmente** | "¿Cómo vamos?" | "Tomo decisiones fundamentadas" (Poder) | Revisa KPIs, identifica tendencias |
| **3 meses después** | "¿Funciona?" | "Por primera vez, tengo datos" (Transformación) | Compara con 3 Excels anteriores |

**Viaje Emocional de Pedro (Stock):**

| Etapa | Emoción Actual | Emoción Deseada | Momento de Transformación |
|-------|----------------|-----------------|---------------------------|
| **Antes (proceso anterior)** | "Otra llamada..." (Frustración acumulada) | - | 10+ llamadas/día preguntando stock |
| **Primer acceso** | "¿Será diferente?" (Escepticismo) | "Veo stock en tiempo real" (Sorpresa) | Abre app, ve SKF-6208: 13 🟢 |
| **María usa repuesto** | "Teléfono otra vez..." (Irritación anticipada) | "¡NO recibí notificación!" (Alivio) | Stock actualizado silenciosamente |
| **14:00 - Alerta** | "Otra interrupción..." | "¡Es solo 1 hoy!" (Satisfacción) | "Filtro alcanzó mínimo" - única llamada del día |
| **Genera pedido** | "¿Habrá stock?" | "Sé qué hacer" (Control) | Genera pedido de 10 unidades |
| **Diario** | "¿Cuántas llamadas hoy?" | "Qué paz. Sin spam" (Tranquilidad) | Ahorra 2+ horas diarias |
| **1 semana después** | "¿Funciona siempre?" | "Solo me avisan cuando necesito actuar" (Confianza) | 1-2 llamadas/día vs 10+ antes |

### Micro-Emotions

**Micro-emociones son estados emocionales sutiles pero críticos que ocurren durante interacciones específicas. Si se diseñan correctamente, generan confianza y satisfacción acumulativa. Si se ignoran, generan fricción y abandono.**

**1. Confianza vs Escepticismo**

**Contexto:** Usuario realiza una acción (reportar avería, iniciar OT, actualizar stock)

**Diseño UX que genera confianza:**
- Confirmación visual <3 segundos tras cada acción
- Número de referencia (ej: "Aviso #456 recibido")
- Feedback visible: OT cambia de columna, stock actualizado
- Mensaje claro: "✓ Guardado. Stock actualizado: 11"

**Resultado emocional:** Usuario piensa "Sistema confiable" → Continúa usando

**Anti-pattern (genera escepticismo):**
- Sin confirmación → Usuario duda "¿Hice clic? ¿Quedó registrado?"
- Spinner >5 segundos → Usuario piensa "Se colgó, intentaré de nuevo"
- Error genérico → Usuario piensa "Otra falla más"

**Validación:** % de acciones con feedback visible = 100% (objetivo)

---

**2. Control vs Frustración**

**Contexto:** Usuario busca información (equipo, OT, repuesto)

**Diseño UX que genera control:**
- Búsqueda predictiva <200ms con suggestions inteligentes
- Modal ℹ️ con toda la historia en 1 clic
- Código de colores visible (7 tipos de OT + estados)
- Stock visible con ubicación (Estante A3, Cajón 3)

**Resultado emocional:** Usuario piensa "Tengo el control" → Se siente competente

**Anti-pattern (genera frustración):**
- Búsqueda lenta >1 segundo → Usuario piensa "Esto es lento"
- Información fragmentada en 3-4 pantallas → "¿Dónde está...?"
- Sin ubicación de repuesto → "¿En qué establo está?"

**Validación:** Tiempo de búsqueda <200ms (objetivo), información en 1 clic (objetivo)

---

**3. Validación vs Indiferencia**

**Contexto:** Usuario contribuye (reporta avería, completa OT, ajusta stock)

**Diseño UX que genera validación:**
- Confirmación con número de referencia personalizado ("Aviso #456")
- Notificaciones push de cada estado ("Tu aviso fue autorizado")
- Mensaje de gratitude ("Gracias por tu reporte. Tu aviso #123 ha contribuido a mantener la operación.")
- Historial visible de sus contribuciones

**Resultado emocional:** Usuario piensa "Mi aporte importa" → Se siente valorado

**Anti-pattern (genera indiferencia):**
- Sin confirmación → "Nadie se da cuenta"
- Sin notificaciones → "¿Sirvió para algo mi reporte?"
- Sin gratitude → "Solo estoy haciendo mi trabajo"

**Validación:** % de contribuciones con feedback = 100% (objetivo)

---

**4. Pertenencia vs Aislamiento**

**Contexto:** Usuario trabaja en equipo con otros departamentos

**Diseño UX que genera pertenencia:**
- Dashboard público con mismos KPIs para toda la fábrica
- Notificaciones push a todos (transparencia de estado)
- Código de colores compartido (todos ven mismos tipos de OT)
- Historial completo visible (trazabilidad total)

**Resultado emocional:** Usuario piensa "Somos un equipo profesional" → Se siente parte de algo mayor

**Anti-pattern (genera aislamiento):**
- Información siloada (solo admins ven X) → "¿Por qué ellos sí y yo no?"
- Sin visibilidad del trabajo de otros → "Estoy solo en esto"
- Dashboard opaco → "¿Qué están haciendo los demás?"

**Validación:** Encuesta de percepción 6 meses → "Profesional" vs "Caótico"

---

**5. Eficiencia vs Caos**

**Contexto:** Usuario gestiona múltiples tareas (OTs, repuestos, técnicos)

**Diseño UX que genera eficiencia:**
- Kanban visual con drag-and-drop (asignación en 5 segundos)
- Búsqueda predictiva con autocomplete (reporte en 30 segundos)
- Modal ℹ️ con toda la info (1 clic vs 3-4 pantallas)
- Stock visible al seleccionar repuesto (sin navegación extra)

**Resultado emocional:** Usuario piensa "Todo está organizado" → Se siente productivo

**Anti-pattern (genera caos):**
- Formularios largos → "Esto es una pérdida de tiempo"
- Información dispersa → "¿En qué pantalla estaba...?"
- Sin código de colores → "¿Qué OT es qué?"

**Validación:** Número de clics en user flows (benchmark vs competencia)

---

**6. Calma vs Ansiedad**

**Contexto:** Usuario gestiona situaciones críticas (stock mínimo, OTs vencidas)

**Diseño UX que genera calma:**
- Alertas accionables con acción clara ("Filtro alcanzó mínimo → Generar pedido")
- Código de colores (rojo = crítico, naranja = atención)
- Mensajes claros de error ("Sin conexión" + "Reconectando...")
- Undo automático (5 segundos) por si acaso

**Resultado emocional:** Usuario piensa "Sé qué hacer" → Actúa con confianza

**Anti-pattern (genera ansiedad):**
- Alertas genéricas ("Error en el sistema") → "¿Qué hago ahora?"
- Sin acción clara → "¿A quién llamo?"
- Sin undo → "¡Lo arruiné!"

**Validación:** % de alertas con acción clara = 100% (objetivo)

### Design Implications

**Cómo los objetivos emocionales informan decisiones de diseño UX:**

**Emoción 1: "Mi Voz Importa" (Validación) → Confirmación Inmediata + Notificaciones Push**

**Diseño UX específico:**
- Carlos toca "Enviar" → App responde <3s: "✓ Aviso #456 recibido. Gracias por tu reporte."
- 10 minutos después → Push: "Tu aviso #456 fue autorizado. OT asignada a María."
- 2 horas después → Push: "María está trabajando en tu OT #456."
- OT completada → Push: "OT #456 completada. ¿Confirma que funciona?" + Botón "Sí/No"

**Resultado:** Carlos siente "Mi voz importa" → App se vuelve indispensable

**Métrica de éxito:** Tasa de conversión de avisos a OTs >70% (indica reportes válidos + valor percibido)

---

**Emoción 2: "Tengo el Control" (Confianza) → Modal ℹ️ + Búsqueda Predictiva <200ms**

**Diseño UX específico:**
- Javier ve tarjeta OT en Kanban → Toca ℹ️ → Modal con:
  - Timeline visual: Creación → Autorización → Inicio → Completado
  - Origen: Carlos (Operario) reportó el 2026-03-07 a las 09:03
  - Asignados: María (Técnica) + Juan (Técnico)
  - Proveedor: Talleres Eléctricos SA - Tel: +54 11 1234-5678 (click-to-call)
  - Repuestos usados: Rodamiento SKF-6208 (Stock: 11, 📍 Estante A3, Cajón 3)
  - Fotos antes/después (si adjuntadas)

**Resultado:** Javier responde "¿Qué pasa con la Prensa?" en 10 segundos → Percibido como organizado

**Métrica de éxito:** Tiempo de respuesta a consultas gerenciales <30 segundos (objetivo)

---

**Emoción 3: "Tengo Datos" (Credibilidad) → Dashboard KPIs + Exportar Excel**

**Diseño UX específico:**
- Elena abre dashboard → Ve:
  - MTTR 4.2h (↓15% vs mes anterior) - Icono trending down verde
  - MTBF 127h (↑8% vs mes anterior) - Icono trending up verde
  - OTs abiertas: 23 (↓5 vs mes anterior)
  - Stock crítico: 3 items - Icono de alerta rojo
- Drill-down: Toca MTTR → Planta Panel → Línea 2 → Prensa PH-500 (MTFR 12h, 3 fallos)
- Botón "Exportar Excel" → Descarga .xlsx con hojas separadas por KPI

**Resultado:** Elena piensa "Por primera vez, tengo datos. No adivino." → Credibilidad ante dirección

**Métrica de éxito:** Frecuencia de revisión de KPIs semanal >90% (objetivo)

---

**Emoción 4: "Qué Paz" (Tranquilidad) → Stock Visible + Alertas Solo Mínimo**

**Diseño UX específico:**
- María toca "Agregar Repuesto" → Escribe "skf" → Ve:
  - "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Selecciona, cantidad "1", toca "Guardar" → Sistema: "✓ Agregado. Stock actualizado: 11"
- **PEDRO NO RECIBE NOTIFICACIÓN** (sin spam)
- 14:00 - Stock alcanza mínimo (6 unidades, mínimo: 5) → Pedro recibe **única** alerta del día
- Pedro toca alerta → "Filtro F-205 alcanzó mínimo (6 unidades)" → Botón "Generar pedido"

**Resultado:** Pedro recibe 1 llamada/día vs 10+ antes → "Qué paz. Solo me avisan cuando necesito actuar."

**Métrica de éxito:** % de alertas stock mínimo que resultan en acción >80% (objetivo)

---

**Emoción 5: "Somos Profesionales" (Orgullo) → Dashboard Público + Código de Colores**

**Diseño UX específico:**
- Dashboard en TV área común visible para toda la fábrica:
  - MTTR 4.2h (↓15%)
  - MTBF 127h (↑8%)
  - OTs abiertas: 23
  - Técnicos activos: 5
  - **Sin datos sensibles** (sin nombres, sin costos)
- Código de colores consistente en toda la app:
  - 🟢 Verde = Bueno (OT completada, stock OK)
  - 🟠 Naranja = Atención (OT en progreso, stock bajo)
  - 🔴 Rojo = Crítico (OT vencida, stock crítico)

**Resultado:** Todos ven mismos datos → Transparencia → Confianza → "Somos un equipo profesional"

**Métrica de éxito:** Encuesta de percepción 6 meses → "Profesional" vs "Caótico"

### Emotional Design Principles

**Principios Rectores para Diseño Emocional:**

**1. Velocidad = Confianza**

**Principio:** Respuestas rápidas generan confianza emocional inmediata.

**Aplicación práctica:**
- Búsqueda predictiva <200ms → Usuario siente "Este sistema es rápido"
- Confirmación de reporte <3s → Usuario siente "Me escucharon"
- Dashboard KPIs carga <2s → Usuario siente "Tengo el control"

**Anti-pattern:** Spinner >5s → Usuario siente "Esto es lento como los sistemas viejos" → Abandono

**Validación:** Medir tiempos de respuesta + encuestas de percepción de velocidad

---

**2. Feedback = Validación**

**Principio:** Feedback inmediato y visible valida al usuario emocionalmente.

**Aplicación práctica:**
- Carlos toca "Enviar" → Recibe confirmación <3s con número de aviso → Siente "¡Funcionó!"
- María toca "Iniciar OT" → OT pasa a "En Progreso" visualmente → Siente "Vieron que empecé"
- Pedro ajusta stock → Sistema confirma "Stock actualizado: 11" → Siente "Quedó registrado"

**Anti-pattern:** Acciones sin feedback → Usuario duda "¿Hice clic? ¿Quedó registrado?" → Frustración

**Validación:** % de acciones con feedback visual = 100% (objetivo)

---

**3. Transparencia = Pertenencia**

**Principio:** Visibilidad total de información genera sentido de pertenencia a un equipo profesional.

**Aplicación práctica:**
- Dashboard público → Todos ven mismos KPIs → "Somos un equipo"
- Notificaciones push a todos → Operario ve que su aviso avanza → "Mi contribución importa"
- Código de colores compartido → "Hablamos el mismo idioma visual"

**Anti-pattern:** Información siloada → "¿Por qué ellos sí y yo no?" → Aislamiento

**Validación:** Encuestas de percepción de equipo y colaboración

---

**4. Control = Calma**

**Principio:** Sensación de control reduce ansiedad en situaciones críticas.

**Aplicación práctica:**
- Modal ℹ️ con toda la info en 1 clic → "Sé qué está pasando"
- Búsqueda predictiva con suggestions → "Encuentro lo que busco"
- Alertas accionables → "Sé qué hacer"

**Anti-pattern:** Información dispersa → "No tengo control" → Ansiedad

**Validación:** Tiempo de resolución de tareas + encuestas de estrés percibido

---

**5. Simplicidad = Eficiencia**

**Principio:** Interacciones simples generan sensación de eficiencia y competencia.

**Aplicación práctica:**
- Reporte de avería en 30 segundos (vs 2-5 minutos antes) → "Soy eficiente"
- Asignación con drag-and-drop (vs formulario) → "Fluido"
- Stock visible al seleccionar (vs pantalla separada) → "Intuitivo"

**Anti-pattern:** Interacciones complejas → "Esto es complicado" → Frustración

**Validación:** Número de clics en user flows + encuestas de facilidad de uso

---

**6. Gratitud = Lealtad**

**Principio:** Mensajes de gratitude generan lealtad emocional al sistema.

**Aplicación práctica:**
- "Gracias por tu reporte. Tu aviso #123 ha contribuido a mantener la operación." → Carlos siente "Mi aporte es valioso"
- "¡Excelente trabajo! OT completada en 2 horas (vs 4h promedio)." → María siente "Soy reconocida"

**Anti-pattern:** Sin gratitude → "Solo hago mi trabajo, da igual" → Indiferencia

**Validación:** Tasa de retención de usuarios + Net Promoter Score (NPS)

---

**7. Consistencia = Confianza**

**Principio:** Comportamiento consistente genera confianza emocional a largo plazo.

**Aplicación práctica:**
- Código de colores consistente en toda la app (siempre rojo = crítico)
- Feedback siempre en mismos tiempos (<3s confirmación)
- Navegación predecible (mismo patrón en todas las pantallas)

**Anti-pattern:** Comportamiento errático → "¿Qué hará esta vez?" → Escepticismo

**Validación:** Encuestas de confianza en el sistema + tasa de abandono

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Análisis de Productos Inspiradores para gmao-hiansa**

Basado en el contexto de una aplicación industrial de mantenimiento (GMAO), he identificado productos que los usuarios objetivo ya conocen y aman, cuyos patrones UX podemos adaptar.

---

### 1. WhatsApp / Telegram (Comunicación y Notificaciones)

**Lo que hacen bien:**
- **Confirmación visual inmediata:** Check azul ✓ aparece al enviar mensaje
- **Notificaciones push no intrusivas:** Preview del mensaje sin abrir la app
- **Timestamps claros:** "Hace 5 min", "12:30", "Ayer"
- **Estados de mensaje:** Enviado → Entregado → Leído (dos checks azules)
- **Search predictivo:** Encuentra conversaciones <200ms
- **Feedback de estado:** "Escribiendo...", "En línea", "Visto por última vez..."

**Aplicación a gmao-hiansa:**
- Confirmación <3s tras reportar avería (como check azul ✓)
- Notificaciones push: "Tu aviso #456 fue autorizado. OT asignada a María"
- Estados de OT: Recibido → Autorizado → En Progreso → Completado
- Búsqueda predictiva de equipos <200ms

---

### 2. Trello / Asana (Gestión de Tareas y Kanban)

**Lo que hacen bien:**
- **Kanban visual:** Drag-and-drop entre columnas
- **Código de colores:** Labels y etiquetas visuales
- **Modal ℹ️ con toda la info:** Click en tarjeta → modal con detalles
- **Asignación visual:** Dropdown con avatares de usuarios
- **Filtros rápidos:** Por etiqueta, usuario, fecha
- **Timeline de actividad:** Historial de cambios en la tarjeta

**Aplicación a gmao-hiansa:**
- Kanban de 8 columnas con drag-and-drop
- 7 tipos de OT con código de colores
- Modal ℹ️ con timeline visual de la OT
- Asignación con avatares de técnicos (1-3 técnicos o proveedor)
- Filtros por estado, técnico, fecha, tipo, equipo

---

### 3. Amazon (Búsqueda y Catálogo)

**Lo que hacen bien:**
- **Búsqueda predictiva con suggestions:** "pren" → "Prensa hidráulica industrial..."
- **Autocomplete con contexto:** Muestra categoría, precio, rating
- **Historial de búsqueda:** "Buscasto recientemente: rodamiento SKF"
- **Filtros laterales:** Categoría, precio, marca, rating
- **Reviews y ratings:** Estrellas + número de reseñas
- **Stock visible:** "Quedan 3 unidades" + "Envío gratis"

**Aplicación a gmao-hiansa:**
- Búsqueda predictiva: "pren" → "Prensa PH-500 (Panel Sandwich, Línea 2)"
- Suggestions con: ubicación en planta, estado actual, última avería
- Filtros por planta, línea, tipo de equipo
- Stock visible: "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
- Historial del equipo: "Última avería: hace 3 días"

---

### 4. Google Maps (Search y Ubicación)

**Lo que hacen bien:**
- **Búsqueda predictiva <200ms:** Empieza a escribir → suggestions inmediatas
- **Autocomplete con ubicación:** "Prensa" → "Prensa industrial [Dirección]"
- **Historial reciente:** "Buscasto recientemente: Plaza de Mayo"
- **Modos de transporte:** Auto 🚗, Caminar 🚶, Transporte 🚌
- **Info en modal ℹ️:** Click en lugar → dirección, teléfono, horarios
- **Reviews con fotos:** "4.5 ⭐ (123 reseñas)"

**Aplicación a gmao-hiansa:**
- Búsqueda predictiva <200ms con autocomplete jerárquico
- Suggestions con: ubicación en planta, estado actual, historial
- Modal ℹ️ con: ubicación, teléfono del proveedor, historial de OTs
- Stock con ubicación física: "📍 Estante A3, Cajón 3"

---

### 5. Google Analytics / Strava (Dashboards y KPIs)

**Lo que hacen bien:**
- **Dashboard con trending icons:** MTTR ↓15% (icono flecha verde), MTBF ↑8% (flecha arriba)
- **Drill-down:** Click en métrica → Planta → Línea → Equipo
- **Comparación temporal:** "vs mes anterior", "vs año pasado"
- **Gráficos interactivos:** Hover para ver valores exactos
- **Exportar datos:** Botón "Exportar a Excel/CSV"
- **Alertas:** "MTFR aumentó 20% esta semana"

**Aplicación a gmao-hiansa:**
- Dashboard KPIs: MTTR 4.2h (↓15% vs mes anterior), MTBF 127h (↑8%)
- Drill-down: Global → Planta Panel → Línea 2 → Prensa PH-500
- Gráficos de OTs por semana, tiempos de reparación
- Exportar a Excel: .xlsx con hojas separadas por KPI
- Alertas accionables: Stock mínimo, MTFR alto, rutinas no completadas

### Transferable UX Patterns

**Patrones de Navegación**

**1. Bottom Navigation (Mobile) - De WhatsApp/Telegram**

**Patrón:** Navegación inferior con 4-5 iconos (Chats, Estados, Llamadas, Configuración)

**Aplicación a gmao-hiansa:**
- Móvil <768px → Bottom nav con 5 items: Home, OTs, Activos, Repuestos, KPIs
- Touch targets 44x44px (WCAG AA compliance)
- Icon con label + badge de notificaciones (ej: OTs (5))

**Por qué funciona:** Carlos puede navegar con una mano, touch targets accesibles

---

**2. Lateral Navigation (Desktop) - De Trello/Asana**

**Patrón:** Sidebar izquierdo con navegación principal

**Aplicación a gmao-hiansa:**
- Desktop >1200px → Nav lateral con 7 items: Dashboard, Kanban, Mis OTs, Activos, Stock, KPIs, Usuarios
- Colapsable a iconos solo
- Highlight de módulo activo

**Por qué funciona:** Elena y Javier tienen acceso rápido a todos los módulos

---

**3. Tab Bar with Badges - De Gmail/Slack**

**Patrón:** Pestañas con número de notificaciones (ej: "Chats (3)")

**Aplicación a gmao-hiansa:**
- "Mis OTs" → badge con número de OTs asignadas (ej: "Mis OTs (5)")
- "Kanban" → badge con OTs pendientes de triage (ej: "Kanban (12)")
- "Stock" → badge con ítems críticos (ej: "Stock (3)")

**Por qué funciona:** María ve rápidamente cuántas OTs tiene asignadas

---

**Patrones de Interacción**

**1. Drag-and-Drop con Visual Feedback - De Trello**

**Patrón:** Arrastrar tarjeta → sombra + opacidad → drop zone highlight → soltar

**Aplicación a gmao-hiansa:**
- Javier arrastra OT "Pendiente" → tarjeta se vuelve semitransparente
- Columna "Asignada" se highlight (border + fondo sutil)
- Soltar → dropdown "Asignar a:" aparece
- Undo automático (5 segundos) por si acaso

**Por qué funciona:** Asignación visual en 5 segundos vs formulario de 2-3 minutos

---

**2. Search Predictive con Autocomplete - De Google Maps/Amazon**

**Patrón:** Escribir 3 caracteres → suggestions inmediatas con contexto

**Aplicación a gmao-hiansa:**
- Carlos escribe "pren" (3 caracteres)
- Sistema muestra: "Prensa PH-500 (Panel Sandwich, Línea 2, Última avería: hace 3 días)"
- Highlighting de término buscado: "**Pren**sa PH-500"
- Flechas arriba/abajo + Enter para selección rápida

**Por qué funciona:** Reporte de avería en 30 segundos vs 2-5 minutos actuales

---

**3. Modal ℹ️ con Info Completa - De Trello/Google Maps**

**Patrón:** Click en tarjeta → modal con toda la información en 1 lugar

**Aplicación a gmao-hiansa:**
- Javier ve tarjeta OT en Kanban → toca icono ℹ️
- Modal scrollable con timeline vertical:
  - 09:03 - Carlos reportó avería
  - 09:10 - Javier autorizó OT
  - 09:12 - Asignado a María + Juan
  - 09:15 - María inició OT
  - En progreso - Repuestos usados: Rodamiento SKF-6208 (Stock: 11)
  - ETA: 12:00 - Completado

**Por qué funciona:** Javier responde "¿Qué pasa con la Prensa?" en 10 segundos

---

**4. Push Notifications con Acción - De WhatsApp/Telegram**

**Patrón:** Notificación con preview + acción (responder, marcar como leído)

**Aplicación a gmao-hiansa:**
- Notificación: "Tu aviso #456 fue autorizado. OT asignada a María"
- Carlos toca notificación → App abre directamente en OT #456
- Botones de acción rápida: "Confirmar que funciona" (Sí/No)

**Por qué funciona:** Carlos siente "mi voz importa" sin abrir la app

---

**5. Swipe Gestures - De Gmail/Mailbox**

**Patrón:** Swipe right = archivar, swipe left = borrar

**Aplicación a gmao-hiansa:**
- Móvil <768px: Swipe horizontal para cambiar columnas Kanban
- Swipe right → Siguiente columna (Pendiente → En Progreso)
- Swipe left → Columna anterior (En Progreso → Pendiente)
- Indicador visual: "1/3" (columna 1 de 3)

**Por qué funciona:** Carlos puede navegar Kanban con una mano

---

**Patrones Visuales**

**1. Código de Colores con Labels - De Trello/Asana**

**Patrón:** Colores semánticos + texto redundante (ej: 🔴 Urgente + texto)

**Aplicación a gmao-hiansa:**
- 7 tipos de OT con icon + color + texto:
  - 🌸 Rosa (Avería Triage) + "Avería"
  - ⚪ Blanco (Reparación Triage) + "Reparación"
  - 🟢 Verde (Preventivo) + "Preventivo"
  - 🔴 Rojizo (Correctivo propio) + "Correctivo"
  - 🔴📏 Rojo con línea (Correctivo externo viene) + "Externo"
  - 🟠 Naranja (Taller propio) + "Taller propio"
  - 🔵 Azul (Enviado a proveedor) + "Externo"

**Por qué funciona:** WCAG AA compliance, daltónicos pueden distinguir

---

**2. Avatar Stacks - De Slack/Asana**

**Patrón:** Avatares superpuestos (ej: "👤👤👤+2") para múltiples asignados

**Aplicación a gmao-hiansa:**
- OT con 3 técnicos → avatares superpuestos: [Avatar1][Avatar2][Avatar3]
- Si >3 técnicos → [Avatar1][Avatar2][Avatar3]+2
- Click en avatar stack → dropdown con todos los asignados

**Por qué funciona:** Javier ve rápidamente cuántos técnicos en cada OT

---

**3. Progress Indicators - De Uber/Strava**

**Patrón:** Barra de progreso + porcentaje (ej: "65% completado")

**Aplicación a gmao-hiansa:**
- OT en progreso → barra de progreso basada en tiempo estimado
- "Tiempo transcurrido: 45 min | Tiempo estimado: 2h | 37% completado"
- Color de progreso: Verde (en tiempo), Naranja (atrasado), Rojo (crítico)

**Por qué funciona:** María ve cuánto falta para completar OT

---

**4. Trending Icons - De Google Analytics**

**Patrón:** ⬆️ verde (mejora), ⬇️ rojo (empeor)

**Aplicación a gmao-hiansa:**
- MTTR 4.2h ⬇️ 15% (flecha hacia abajo verde - mejora)
- MTBF 127h ⬆️ 8% (flecha hacia arriba verde - mejora)
- OTs abiertas 23 ⬇️ 5 (flecha hacia abajo verde - mejora)

**Por qué funciona:** Elena ve rápidamente si KPIs mejoran o empeoran

### Anti-Patterns to Avoid

**Basado en el análisis de apps exitosas y el contexto de gmao-hiansa, identifico estos anti-patrones a evitar:**

**1. Formularios Largos con Múltiples Pantallas**

**Anti-patrón:** "Regístrate en 7 pasos" con datos innecesarios

**Por qué evitar:** Carlos abandonará si el reporte de avería toma >2 minutos

**Solución:** Formulario de 1 campo (equipo) + descripción + foto opcional → <30 segundos

**Apps que lo hacen bien:** WhatsApp (registro solo con número), Telegram (nombre opcional)

---

**2. Sin Confirmación Visual de Acciones**

**Anti-patrón:** Usuario toca "Guardar" → no pasa nada visible → "¿Se guardó?"

**Por qué evitar:** Genera escepticismo y duda en el sistema

**Solución:** Confirmación <3s: "✓ Aviso #456 recibido" + número de referencia

**Apps que lo hacen bien:** WhatsApp (check azul ✓), Gmail (Mensaje enviado)

---

**3. Información Fragmentada en Múltiples Pantallas**

**Anti-patrón:** Para ver detalles de OT, navegar 3-4 pantallas diferentes

**Por qué evitar:** Javier pierde tiempo respondiendo "¿Qué pasa con la Prensa?"

**Solución:** Modal ℹ️ con toda la información en 1 clic

**Apps que lo hacen bien:** Trello (modal con toda la info de la tarjeta), Google Maps (modal con lugar)

---

**4. Búsqueda Lenta sin Suggestions**

**Anti-patrón:** Usuario escribe nombre completo + Enter → spinner de carga >1 segundo

**Por qué evitar:** Carlos no reportará si tarda >2 minutos en buscar equipo

**Solución:** Búsqueda predictiva <200ms con autocomplete

**Apps que lo hacen bien:** Google Maps (suggestions inmediatos), Amazon (autocomplete con contexto)

---

**5. Código de Colores sin Texto Redundante**

**Anti-patrón:** Solo colores para diferenciar OTs (rojo, verde, naranja)

**Por qué evitar:** Daltónicos no pueden distinguir + ilegible en luz de fábrica

**Solución:** Icon + color + texto (🔴 Correctivo + "Correctivo")

**Apps que lo hacen bien:** Trello (labels con icon + color + texto), GitHub (labels con texto)

---

**6. Notificaciones Spam**

**Anti-patrón:** Notificación por cada acción de otros usuarios

**Por qué evitar:** Pedro ignorará todas las notificaciones si recibe spam por cada uso de repuesto

**Solución:** Notificaciones silenciosas (stock actualizado) + alertas solo stock mínimo

**Apps que lo hacen bien:** Slack (puedes silenciar canales), Gmail (notificaciones agrupadas)

---

**7. Sin Undo en Acciones Críticas**

**Anti-patrón:** Usuario arrastra OT a columna equivocada → no puede deshacer

**Por qué evitar:** Genera ansiedad y resistencia al uso de drag-and-drop

**Solución:** Undo automático (5 segundos) + botón "Deshacer"

**Apps que lo hacen bien:** Gmail (Undo 5 segundos después de enviar), Trello (undo de acciones)

### Design Inspiration Strategy

**Qué Adoptar:**

**1. Confirmación Visual Inmediata (WhatsApp/Telegram)**
- **Por qué:** Soporta objetivo emocional "Mi voz importa" (Validación)
- **Implementación:** Confirmación <3s con número de aviso tras reportar avería
- **Métrica de éxito:** Tasa de "first-time success" >95%

**2. Kanban Visual con Drag-and-Drop (Trello/Asana)**
- **Por qué:** Soporta objetivo emocional "Tengo el control" (Confianza)
- **Implementación:** 8 columnas con código de colores, asignación en 5 segundos
- **Métrica de éxito:** Tiempo de asignación <5 segundos

**3. Búsqueda Predictiva <200ms (Google Maps/Amazon)**
- **Por qué:** Soporta objetivo emocional "Eficiencia" (Productividad)
- **Implementación:** Autocomplete con contexto (ubicación, estado, historial)
- **Métrica de éxito:** Tiempo de búsqueda <200ms

**4. Modal ℹ️ con Toda la Info (Trello/Google Maps)**
- **Por qué:** Soporta principio "Menos clics = más productividad"
- **Implementación:** Timeline, técnicos, repuestos, proveedor en 1 clic
- **Métrica de éxito:** Tiempo de respuesta a consultas <30 segundos

**5. Código de Colores con Labels (Trello/Asana)**
- **Por qué:** WCAG AA compliance + ambiente industrial
- **Implementación:** Icon + color + texto para cada tipo de OT
- **Métrica de éxito:** Asignación correcta de técnicos >95%

---

**Qué Adaptar:**

**1. Bottom Navigation (WhatsApp) → Simplificar para Gmao**
- **Adaptación:** Solo 5 items (vs 4-5 en WhatsApp)
- **Por qué:** Carlos necesita acceso rápido: Home, OTs, Activos, Repuestos, KPIs
- **Implementación:** Bottom nav con icon + label + badges de notificaciones

**2. Push Notifications (WhatsApp) → Añadir Contexto de Mantenimiento**
- **Adaptación:** No solo "Mensaje recibido" sino "Tu aviso #456 fue autorizado. OT asignada a María."
- **Por qué:** Carlos necesita saber el progreso de su avería, no solo que fue recibida
- **Implementación:** Notificaciones con número de OT + estado + técnicos asignados

**3. Dashboards (Google Analytics) → Simplificar KPIs para Fábrica**
- **Adaptación:** Solo 4 KPIs core (MTTR, MTBF, OTs abiertas, Stock crítico) vs 20+ en Analytics
- **Por qué:** Elena necesita claridad, no sobrecarga de información
- **Implementación:** Dashboard público sin datos sensibles, drill-down para análisis avanzado

---

**Qué Evitar:**

**1. Onboarding Largo (Apps de Banca)**
- **Por qué:** Carlos abandonará si el tutorial toma >30 segundos
- **Solución:** Tutorial de 30 segundos + "Empecemos"
- **Alternativa:** Onboarding contextual (tooltips en primer uso)

**2. Múltiples Pantallas para Ver Detalles (ERPs Legados)**
- **Por qué:** Javier pierde tiempo buscando información
- **Solución:** Modal ℹ️ con toda la info en 1 clic
- **Alternativa:** Vista detallada opcional para casos raros

**3. Notificaciones Spam (Algunas Apps de Social)**
- **Por qué:** Pedro ignorará alertas importantes
- **Solución:** Notificaciones silenciosas + alertas solo stock mínimo
- **Alternativa:** Preferencias configurables por tipo de notificación

## Design System Foundation

### Design System Choice

**shadcn/ui + Tailwind CSS** ⭐

Para **gmao-hiansa**, hemos seleccionado **shadcn/ui + Tailwind CSS** como base del sistema de diseño.

**Shadcn/ui** es una colección de componentes reutilizables construidos con Radix UI y Tailwind CSS, diseñados para ser copiados y pegados directamente en tu proyecto (no es una dependencia npm tradicional).

**Tailwind CSS** es un framework de utility-first CSS que permite construir interfaces personalizadas rapidamente sin abandonar tu HTML.

---

### Rationale for Selection

**1. Velocidad de Desarrollo**

**Problema:** gmao-hiansa necesita MVP rápido para transformar departamento reactivo a proactivo

**Solución:**
- shadcn/ui proporciona 50+ componentes pre-construidos (Button, Input, Card, Dialog, Dropdown Menu, etc.)
- Copiar/pegar código = No requiere configuración compleja
- Desarrollo de componentes directamente en tu codebase = Full control

**Resultado:** Timeline de desarrollo reducido en 40-60% vs construir componentes desde cero

---

**2. Profesionalismo sin "Look Genérico"**

**Problema:** gmao-hiansa no puede parecer "otro template más"

**Solución:**
- shadcn/ui no tiene "look" predeterminado, son componentes base
- Tailwind CSS permite diseño visual único con utility classes
- Customización total de colores, tipografía, espaciado, bordes, sombras

**Resultado:** gmao-hiansa tendrá identidad visual única sin parecer "shadcn/ui default"

---

**3. WCAG AA Compliance Out-of-the-Box**

**Problema:** Ambiente industrial con iluminación variable requiere accesibilidad no-negotiable

**Solución:**
- Radix UI primitives (base de shadcn/ui) = WCAG 2.1 AA compliant por defecto
- Keyboard navigation (Tab, Enter, Esc) en todos los componentes interactivos
- ARIA attributes incluidos en todos los componentes
- Focus management automático

**Resultado:** gmao-hiansa será accesible sin inversión adicional en testing de accesibilidad

---

**4. React-First y Moderno**

**Problema:** gmao-hiansa es una PWA moderna en React

**Solución:**
- shadcn/ui construido específicamente para React (hooks, context, composition)
- Server Components compatible (Next.js 13+)
- TypeScript support incluido
- Integración perfecta con React ecosystem (React Hook Form, Zod, etc.)

**Resultado:** Desarrollo moderno con mejores prácticas de React

---

**5. Comunidad Activa y Documentación Excelente**

**Problema:** Equipo pequeño necesita soporte y recursos

**Solución:**
- Documentación clara con ejemplos de código
- Comunidad creciendo rápidamente (50K+ GitHub stars, 2024)
- Integraciones probadas con React ecosystem (TanStack Table, React Hook Form, etc.)
- Actualizaciones frecuentes con nuevas funcionalidades

**Resultado:** Soporte garantizado a largo plazo

---

**6. Performance Optimizado**

**Problema:** gmao-hiansa requiere carga <2s en dashboard KPIs

**Solución:**
- Tailwind CSS = CSS optimizado con PurgeCSS automático (solo CSS usado en producción)
- Shadcn/ui components = No runtime overhead (copiados a tu codebase)
- Tree-shaking friendly = Bundle size mínimo
- Lazy loading compatible = Carga bajo demanda

**Resultado:** gmao-hiansa cargará rápido incluso en conexiones industriales

---

### Implementation Approach

**Fase 1: Setup Inicial (1-2 días)**

**1.1 Instalación de Dependencias**

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Instalar shadcn/ui CLI
npx shadcn-ui@latest init

# Instalar dependencias de shadcn/ui
npm install class-variance-authority clsx tailwind-merge
```

**1.2 Configuración de Tailwind CSS**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... más colores según PRD design system
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**1.3 Configuración de Design Tokens**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colores según PRD Design System */
    --background: 0 0% 100%; /* Blanco */
    --foreground: 222.2 84% 4.9%; /* Negro suave */

    --primary: 221.2 83.2% 53.3%; /* Azul Hiansa */
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%; /* Gris claro */
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%; /* Gris muy claro */
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%; /* Acento sutil */
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%; /* Rojo error */
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%; /* Borde sutil */
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem; /* 8px border radius */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... modo oscuro si es necesario */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

**Fase 2: Componentes Base (3-5 días)**

**2.1 Instalar Componentes shadcn/ui Necesarios**

```bash
# Componentes core
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
```

**2.2 Estructura de Componentes**

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui (copiados)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── kanban/               # Componentes custom de Kanban
│   │   ├── kanban-board.tsx
│   │   ├── kanban-column.tsx
│   │   ├── kanban-card.tsx
│   │   └── kanban-drag-drop.tsx
│   ├── search/               # Componentes de búsqueda predictiva
│   │   ├── search-predictive.tsx
│   │   ├── search-suggestions.tsx
│   │   └── search-highlighting.tsx
│   ├── dashboard/            # Componentes de dashboard KPIs
│   │   ├── dashboard-kpi-card.tsx
│   │   ├── dashboard-chart.tsx
│   │   └── dashboard-drill-down.tsx
│   └── layout/               # Componentes de layout
│       ├── app-header.tsx
│       ├── bottom-nav.tsx    # Móvil
│       ├── sidebar.tsx       # Desktop
│       └── main-content.tsx
```

---

**Fase 3: Custom Components (5-10 días)**

**3.1 Kanban Board Custom**

- **Basado en:** @dnd-kit/core (drag-and-drop)
- **Componentes shadcn/ui utilizados:** Card, Button, Badge, Avatar, Dialog
- **Customización:**
  - 8 columnas responsive (Desktop 8, Tablet 2, Móvil 1)
  - Drag-and-drop con visual feedback
  - Swipe gestures para móvil
  - Código de colores según tipo de OT

**3.2 Search Predictive Custom**

- **Basado en:** CMDK (command palette) + Debounce
- **Componentes shadcn/ui utilizados:** Input, Popover, Command
- **Customización:**
  - Autocomplete jerárquico (Planta → Línea → Equipo)
  - Highlighting de término buscado
  - Suggestions con contexto (ubicación, estado, historial)
  - Debouncing 300ms + caché

**3.3 Dashboard KPIs Custom**

- **Basado en:** Recharts (gráficos) + TanStack Table (tablas)
- **Componentes shadcn/ui utilizados:** Card, Button, Select, Badge
- **Customización:**
  - KPIs con trending icons (⬆️ verde, ⬇️ rojo)
  - Drill-down interactivo (Global → Planta → Línea → Equipo)
  - Exportar a Excel
  - Actualización real-time (WebSockets)

---

### Customization Strategy

**1. Customización de Colores (Según PRD Design System)**

**Colores Semánticos:**
- 🟢 Verde (#16a34a) - OT completada, stock OK
- 🟠 Naranja (#ea580c) - OT en progreso, stock bajo
- 🔴 Rojo (#dc2626) - OT vencida, stock crítico, error
- 🔵 Azul (#2563eb) - Accent principal (Hiansa blue)
- 🟣 Púrpura (#9333ea) - Mantenimiento reglamentario (Phase 1.5)

**Implementación en Tailwind:**

```javascript
// tailwind.config.js - extend colors
colors: {
  ot: {
    completed: '#16a34a',    // Verde
    inProgress: '#ea580c',   // Naranja
    overdue: '#dc2626',      // Rojo
    preventive: '#22c55e',   // Verde claro
    corrective: '#dc2626',   // Rojo oscuro
    external: '#2563eb',     // Azul
    internal: '#f97316',     // Naranja oscuro
    reglamentary: '#9333ea', // Púrpura
  }
}
```

---

**2. Customización de Tipografía**

**Tipografía Base (según PRD):**
- Font family: Inter (Google Fonts)
- Font size base: 16px (desktop), 14px (tablet), 16px (móvil)
- Line height: 1.5 (WCAG AA compliance)
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Implementación en Tailwind:**

```javascript
// tailwind.config.js - extend fontFamily
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'], // Para datos técnicos
}
```

---

**3. Customización de Espaciado**

**Espaciado Base (8px grid system):**
- 4px = 0.25rem (muy pequeño)
- 8px = 0.5rem (pequeño)
- 12px = 0.75rem (medio-pequeño)
- 16px = 1rem (medio - default)
- 24px = 1.5rem (grande)
- 32px = 2rem (muy grande)

**Implementación:**
- Tailwind ya incluye spacing scale basado en 4px
- No requiere customización

---

**4. Customización de Componentes Shadcn/UI**

**Estrategia:**
- No modificar componentes `src/components/ui/*` directamente
- Crear wrapper components con variantes específicas de gmao-hiansa
- Ejemplo: `Button` de shadcn/ui → `PrimaryButton`, `SecondaryButton`, `DestructiveButton`

**Ejemplo de Wrapper:**

```tsx
// components/button-variants.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PrimaryButton({ children, className, ...props }) {
  return (
    <Button
      className={cn("bg-blue-600 hover:bg-blue-700", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export function DestructiveButton({ children, className, ...props }) {
  return (
    <Button
      variant="destructive"
      className={cn("bg-red-600 hover:bg-red-700", className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

---

**5. Componentes 100% Custom (No en shadcn/ui)**

**5.1 Kanban Board**
- Razón: Requerimiento crítico de gmao-hiansa, no existe en shadcn/ui
- Stack: @dnd-kit/core + shadcn/ui Card + Badge + Avatar
- Customización: 8 columnas, código de colores, drag-and-drop, swipe gestures

**5.2 Search Predictive**
- Razón: Búsqueda <200ms con autocomplete jerárquico es crítico
- Stack: CMDK + Debounce + shadcn/ui Input + Popover
- Customización: Suggestions con contexto, highlighting, caché

**5.3 Timeline de OT**
- Razón: Componente específico de gmao-hiansa para modal ℹ️
- Stack: shadcn/ui Card + Badge + Avatar
- Customización: Timeline vertical con iconos de estado, fechas, usuarios

**5.4 Bottom Navigation (Móvil)**
- Razón: shadcn/ui tiene Navigation Menu pero no Bottom Nav específico
- Stack: shadcn/ui Button + Badge
- Customización: 5 items, touch targets 44x44px, badges de notificaciones

---

**6. Responsiveness Strategy**

**Breakpoints (según PRD):**
- Móvil: <768px (1 columna Kanban, bottom nav)
- Tablet: 768-1200px (2 columnas Kanban, nav simplificada)
- Desktop: >1200px (8 columnas Kanban, nav lateral)

**Implementación en Tailwind:**

```tsx
// Ejemplo de componente responsive
<div className="
  grid grid-cols-1                    /* Móvil: 1 columna */
  md:grid-cols-2                     /* Tablet: 2 columnas */
  lg:grid-cols-4 xl:grid-cols-8      /* Desktop: 8 columnas */
  gap-4                              /* Espaciado entre columnas */
">
  {/* Kanban columns */}
</div>
```

---

**7. Accessibility Strategy**

**WCAG AA Compliance (no-negotiable):**

- **Contraste mínimo 4.5:1** (texto normal sobre fondo)
  - Shadcn/ui + Radix UI = Cumple por defecto
  - Validar con: axe DevTools + Lighthouse

- **Touch targets mínimos 44x44px** (WCAG AA)
  - Shadcn/ui Button = Cumple por defecto
  - Custom components = Aplicar `min-h-[44px] min-w-[44px]`

- **Keyboard navigation (Tab, Enter, Esc)**
  - Shadcn/ui + Radix UI = Cumple por defecto
  - Testing: Navegar toda la app sin mouse

- **Semantic HTML**
  - Shadcn/ui usa elementos semánticos (`<button>`, `<input>`, etc.)
  - Validar con: WAVE browser extension

---

**8. Performance Optimization**

**Estrategia:**

- **PurgeCSS automático** (Tailwind CSS)
  - Solo CSS usado en producción
  - Bundle size reducido de 200KB+ a ~10KB

- **Tree-shaking** (shadcn/ui)
  - Solo componentes utilizados en bundle
  - No overhead de librería completa

- **Code splitting**
  - Carga de componentes bajo demanda (React.lazy)
  - Ejemplo: Dashboard KPIs solo se carga cuando se accede

- **Lazy loading de imágenes**
  - `next/image` (si Next.js) o `lqip` (low quality image placeholder)
  - Placeholder borroso → Imagen completa

---

**9. Maintenance Strategy**

**Actualizaciones:**

- **Shadcn/ui:** Copiar nuevos componentes cuando se necesiten
- **Tailwind CSS:** Actualizar vía npm (breaking changes raros)
- **Custom components:** Mantener en `src/components/` con tests

**Documentación:**

- Storybook para documentar componentes custom (Kanban, Search, Timeline)
- Componentes shadcn/ui = Documentación oficial
- Tailwind CSS = Documentación oficial

---

**10. Timeline Estimado**

- **Fase 1: Setup Inicial:** 1-2 días
- **Fase 2: Componentes Base:** 3-5 días
- **Fase 3: Custom Components:** 5-10 días
- **Fase 4: Testing y Refinamiento:** 3-5 días

**Total:** 12-22 días (3-4 semanas) para sistema de diseño completo + componentes MVP

---

**Conclusión:**

shadcn/ui + Tailwind CSS proporciona el balance perfecto entre **velocidad de desarrollo** y **profesionalismo visual** para gmao-hiansa.

**Ventajas clave:**
- WCAG AA compliance out-of-the-box (crítico para ambiente industrial)
- Customización total (no look genérico)
- Comunidad activa (soporte garantizado)
- Performance optimizado (carga <2s en dashboard KPIs)

**Próximo paso:**
Definir la experiencia core (user flows, información arquitectura, wireframes)

## 2. Core User Experience

### 2.1 Defining Experience

**La Experiencia Definitoria: "Reportar Avería en 30 Segundos"**

La interacción core que define **gmao-hiansa** es **"Reportar avería en 30 segundos y recibir confirmación inmediata que mi voz fue escuchada"**.

Esta experiencia es el make-or-break del sistema:
- Si Carlos reporta rápido → Sistema tiene datos → KPIs funcionan → Departamento se profesionaliza
- Si Carlos NO reporta → Sistema sin datos → KPIs vacíos → Proyecto falla

**Analogías con productos famosos:**
- Tinder: "Swipe para matchear" → gmao-hiansa: "Reportar en 30s"
- Spotify: "Play música instantánea" → gmao-hiansa: "Confirmación instantánea"
- WhatsApp: "Check azul ✓" → gmao-hiansa: "Aviso #456 recibido"

**Por qué esta experiencia es definitoria:**
1. Es el punto de entrada de todos los datos del sistema
2. Es la interacción más frecuente (múltiples reportes por turno)
3. Determina si los usuarios adoptan o resisten el sistema
4. Genera el "momento ¡Aha!" que crea lealtad: "¡Me escucharon!"

### 2.2 User Mental Model

**Mental Model Actual (Proceso Manual):**

Carlos piensa: "Reportar avería = perdida de tiempo, nadie hace caso"

**Proceso actual:**
1. Detecta falla → Siente resistencia
2. Busca a Javier o manda WhatsApp
3. No recibe confirmación → "Igual que siempre"
4. No sabe qué pasó → "¿Valió la pena?"

**Creencias actuales:**
- "Nadie hace caso de todos modos"
- "Es más fácil decirle a Javier en persona"
- "WhatsApp es más rápido que cualquier sistema"

---

**Mental Model Deseado (gmao-hiansa):**

Carlos piensa: "Reportar avería = 30 segundos, rápido y fácil, mi voz importa"

**Proceso deseado:**
1. Detecta falla → Abre app
2. Búsqueda predictiva sugiere equipo en <200ms
3. Describe + envía en <30 segundos
4. Recibe confirmación <3s: "✓ Aviso #456 recibido"
5. 10 min después: "Tu aviso fue autorizado. OT asignada a María"
6. Piensa: "¡Me escucharon! Vale la pena reportar"

**Creencias deseadas:**
- "El sistema me escucha y me da feedback"
- "Es más rápido que WhatsApp"
- "Vale la pena reportar"
- "Mi voz importa"

**Cambio de comportamiento:**
- De: Resistencia → "¿Para qué reportar?"
- A: Entusiasmo → "¡Reporto en 30 segundos y me escuchan!"

### 2.3 Success Criteria

**Criterios de Éxito de la Experiencia Core:**

**1. Confirmación Visual Inmediata**

**Qué dicen los usuarios:** "¡Wow! Esto es rápido. Mejor que WhatsApp."

**Feedback de éxito:**
- <3 segundos recibe: "✓ Aviso #456 recibido. Gracias por tu reporte."
- Número de aviso personalizado → "¡Funcionó!"
- Sistema responde → "Confío en esto"

**Velocidad objetivo:** <3 segundos (instantáneo)

**Automático:**
- Sistema busca equipo predictivamente
- Sistema genera número de aviso único
- Sistema envía confirmación push

---

**2. Notificaciones Push de Progreso**

**Qué dicen los usuarios:** "¡Me escucharon! Mi voz importa."

**Feedback de éxito:**
- 10 min: "Tu aviso #456 fue autorizado. OT asignada a María"
- 30 min: "María inició tu OT"
- 2 horas: "OT completada. ¿Confirma que funciona?"

**Velocidad objetivo:** <30 segundos desde evento

**Automático:**
- Sistema detecta cambio de estado
- Sistema envía notificación push
- Sistema actualiza dashboard KPIs

---

**3. Búsqueda Predictiva con Contexto**

**Qué dicen los usuarios:** "Encontré el equipo en 5 segundos. Increíble."

**Feedback de éxito:**
- Escribe "pren" → "Prensa PH-500 (Panel Sandwich, Línea 2)"
- Highlighting: "**Pren**sa PH-500"
- Contexto: Ubicación, estado actual, última avería

**Velocidad objetivo:** <200ms respuestas

**Automático:**
- Sistema busca en jerarquía de 5 niveles
- Sistema cachea búsquedas frecuentes
- Sistema prioriza equipos recientes del usuario

### 2.4 Novel UX Patterns

**Análisis: Combinación de Patrones Establecidos + Innovación**

**gmao-hiansa combina patrones establecidos de forma innovadora:**

**Patrones Establecidos (que usuarios ya conocen):**

**1. Search Predictive (Google Maps, Amazon)**
- **Lo que conocen:** Autocomplete con suggestions
- **gmao-hiansa innova:** Añade contexto jerárquico (ubicación en planta, estado actual, historial)
- **Resultado:** Búsqueda <200ms con más contexto que Google Maps/Amazon

**2. Push Notifications (WhatsApp, Telegram)**
- **Lo que conocen:** Notificaciones con preview
- **gmao-hiansa innova:** Añade contexto de mantenimiento (número de OT, estado, técnicos)
- **Resultado:** Notificaciones más informativas que WhatsApp

**3. Confirmación Visual (Check Azul ✓ de WhatsApp)**
- **Lo que conocen:** Confirmación inmediata
- **gmao-hiansa innova:** Añade número de referencia + mensaje de gratitude
- **Resultado:** Confirmación más personal que WhatsApp

---

**Patrones Novedosos (que requieren educación mínima):**

**1. Modal ℹ️ con Timeline Visual**
- **Es diferente:** Modal con timeline vertical de toda la historia de la OT
- **Cómo enseñamos:** Tooltip "ℹ️ Ver detalles" + primer uso con walkthrough
- **Metáforas familiares:** Timeline de redes sociales (Twitter, Instagram)
- **Resultado:** Javier tiene toda la info en 1 clic (vs navegar 3-4 pantallas en ERPs)

**2. Kanban de 8 Columnas con Código de Colores**
- **Es diferente:** 8 columnas vs 3-5 en Trello/Asana
- **Cómo enseñamos:** Tutorial de 30 segundos + filtros para simplificar vista
- **Metáforas familiares:** Kanban de Trello + Código de colores de GitHub
- **Resultado:** Control visual de carga de equipo sin llamar técnicos

### 2.5 Experience Mechanics

**Flujo Paso a Paso: "Reportar Avería en 30 Segundos"**

**1. Iniciación (0-5 segundos)**

**Cómo empieza el usuario:**
- Carlos abre app → ve botón prominente "+ Nueva Avería" (bottom center, FAB style)
- **Alternativa:** Carlos arrastra hacia abajo (pull-to-refresh) → "Reportar avería"

**Triggers que inician:**
- Push notification: "Buenos días, Carlos. ¿Necesitas reportar alguna avería?"
- Time-based: "¿Funciona todo bien con tus equipos asignados?"
- Location-based: "Estás cerca de Perfiladora P-201. ¿Algún problema?"

**Design rationale:** Múltiples puntos de entrada para maximizar adopción

---

**2. Interacción (5-25 segundos)**

**Paso 1: Tocar "+ Nueva Avería" (5 segundos)**
- Botón FAB (Floating Action Button) bottom center
- Azul Hiansa (#2563eb) con icono ➕
- Touch target 48x48px (WCAG AA compliance)

**Paso 2: Seleccionar Equipo con Búsqueda Predictiva (10 segundos)**
- Input: "Buscar equipo (ej: prensa, perfiladora)"
- Escribe "pren" → sistema sugiere en <200ms:
  - **Prensa PH-500** (Panel Sandwich, Línea 2)
  - Prensa PH-600 (Panel Sandwich, Línea 3)
- Highlighting de término: "**Pren**sa PH-500"
- Toca suggestion → autocompleta campo

**Paso 3: Describir Falla (10 segundos, opcional)**
- Textarea: "Describe brevemente la falla (opcional)"
- Placeholder: "Ej: No arranca, hace ruido raro, sobretemperatura..."
- Opcional: Botón "Adjuntar foto" (1 toque)

**Paso 4: Enviar (5 segundos)**
- Botón primario "Enviar" (azul Hiansa, derecha)
- Botón secundario "Cancelar" (gris, izquierda)

---

**3. Feedback (<3 segundos)**

**Qué indica éxito:**
- Toast notification aparece: "✓ Aviso #456 recibido. Gracias por tu reporte."
- Toast desaparece después de 5 segundos
- Botón "+ Nueva Avería" → reemplazado por "¡Reportado! #456"

**Cómo saben que funciona:**
- Número de aviso único → "¡Funcionó!"
- Toast con icono ✓ verde
- Dashboard actualiza "Mis Avisos Recientes"

**Errores y recovery:**
- Sin equipo seleccionado → "Selecciona un equipo antes de enviar"
- Sin conexión → "Sin conexión. Reintentando..." + reintenta automáticamente
- Timeout >10s → "Error al enviar. Reintentar?" + botón "Reintentar"

---

**4. Completación (30+ segundos)**

**Cómo saben que terminaron:**
- Toast desaparece → Dashboard muestra nuevo aviso #456 en lista
- Opción: "¿Necesitas reportar otra avería?" (no intrusivo)

**Resultado exitoso:**
- Carlos piensa: "¡Listo! 30 segundos y mi reporte está en el sistema."
- Carlos siente: "Siento que mi voz importa."
- Carlos ve: Número de aviso #456 + Toast con confirmación

**Qué sigue:**
- **Default:** Volver al dashboard
- **Opción A:** Reportar otra avería (botón secundario)
- **Opción B:** Ver detalles del aviso (toca tarjeta en dashboard)

## Visual Design Foundation

### Color System

**Paleta de Colores de la Marca:**

**Colores Principales:**
- **Rojo Burdeos**: `#A51C30` - Color principal de la marca (header del sitio web, fondo del logo)
- **Fondo Blanco**: `#FFFFFF` - Fondo principal de la aplicación
- **Texto Negro**: `#000000` - Texto sobre fondo blanco
- **Texto Blanco**: `#FFFFFF` - Texto sobre fondo rojo burdeos

**Regla de Uso de Colores:**
- **Sobre fondo blanco**: Texto negro `#000000`
- **Sobre fondo rojo burdeos**: Texto blanco `#FFFFFF`

**Colores de División:**
- **HiRock**: `#FFD700` (Amarillo/Dorado) - Para elementos de la división HiRock
- **Ultra**: `#8FBC8F` (Verde Salvia) - Para elementos de la división Ultra

**Colores Semánticos (Estados de OT):**

Estos colores se usan para los 8 estados de las Órdenes de Trabajo en el Kanban:

- `pending-review`: `#6B7280` (Gris) - "Por Revisar"
- `pending-approval`: `#F59E0B` (Ámbar) - "Por Aprobar"
- `approved`: `#3B82F6` (Azul) - "Aprobada"
- `in-progress`: `#8B5CF6` (Púrpura) - "En Progreso"
- `paused`: `#EC4899` (Rosa) - "Pausada"
- `completed`: `#10B981` (Verde) - "Completada"
- `closed`: `#6B7280` (Gris) - "Cerrada"
- `cancelled`: `#EF4444` (Rojo) - "Cancelada"

**Colores de Feedback UI:**
- **Éxito**: `#10B981` (Verde) - Confirmaciones, acciones exitosas
- **Advertencia**: `#F59E0B` (Ámbar) - Requieren atención
- **Error**: `#EF4444` (Rojo) - Errores, acciones destructivas
- **Info**: `#3B82F6` (Azul) - Mensajes informativos

**Guías de Uso:**
- **Rojo Burdeos** se usa para: Header, botones principales, estados activos, fondo del logo
- **Blanco** se usa para: Fondo de la aplicación, tarjetas, modales
- **Negro** se usa para: Texto sobre fondo blanco, bordes, iconos
- **Blanco** se usa para: Texto sobre fondo rojo burdeos
- Colores de división (Amarillo/Verde) se usan para: Etiquetas de activos, indicadores de ubicación
- Colores semánticos se usan para: Badges de estado, notificaciones, validación de formularios

### Typography System

**Fuente:**
- **Principal**: `Inter` (stack de fuentes del sistema: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
  - Elección: Excelente legibilidad, aspecto industrial profesional, soporte completo de español

**Escala de Tamaños:**

```css
--font-size-xs: 0.75rem;    /* 12px - Rótulos, etiquetas */
--font-size-sm: 0.875rem;   /* 14px - Texto secundario, metadatos */
--font-size-base: 1rem;     /* 16px - Texto de cuerpo, inputs */
--font-size-lg: 1.125rem;   /* 18px - Subtítulos */
--font-size-xl: 1.25rem;    /* 20px - Títulos de tarjetas */
--font-size-2xl: 1.5rem;    /* 24px - Títulos de sección */
--font-size-3xl: 1.875rem;  /* 30px - Títulos de página */
--font-size-4xl: 2.25rem;   /* 36px - Hero/landing */
```

**Pesos de Fuente:**
- **Regular (400)**: Texto de cuerpo, descripciones
- **Medium (500)**: Subtítulos, texto enfatizado
- **Semibold (600)**: Títulos, botones, enlaces
- **Bold (700)**: Títulos de página, CTAs importantes

**Altura de Línea:**
- **Texto de cuerpo**: 1.5 (24px de leading para 16px de fuente) - Legibilidad óptima para contenido en español
- **Títulos**: 1.2 - Espaciado más ajustado para jerarquía visual
- **Elementos UI**: 1.25 - Botones, etiquetas, navegación

**Jerarquía Tipográfica:**

```
H1: 30px / Semibold / 1.2 line-height - Títulos de página
H2: 24px / Semibold / 1.2 line-height - Títulos de sección
H3: 20px / Medium / 1.3 line-height - Títulos de tarjetas
H4: 18px / Medium / 1.3 line-height - Subtítulos
Body: 16px / Regular / 1.5 line-height - Párrafos, contenido
Small: 14px / Regular / 1.5 line-height - Metadatos, captions
```

### Spacing & Layout Foundation

**Sistema de Espaciado (Grid de 8px):**

Usando la unidad base de 8px de Tailwind para espaciado consistente:

```css
--spacing-1: 0.25rem;  /* 4px - Espaciado compacto */
--spacing-2: 0.5rem;   /* 8px - Unidad base */
--spacing-3: 0.75rem;  /* 12px - Compacto */
--spacing-4: 1rem;     /* 16px - Por defecto */
--spacing-5: 1.25rem;  /* 20px - Cómodo */
--spacing-6: 1.5rem;   /* 24px - Secciones */
--spacing-8: 2rem;     /* 32px - Secciones grandes */
--spacing-10: 2.5rem;  /* 40px - Divisiones mayores */
--spacing-12: 3rem;    /* 48px - Márgenes de página */
```

**Guías de Uso de Espaciado:**
- **4px**: Padding de iconos, bordes compactos
- **8px**: Elementos relacionados (checkbox + label, icono + texto)
- **12px**: Grupos de formularios compactos, espaciado interno de tarjetas
- **16px**: Inputs de formulario por defecto, padding de botones, items de lista
- **24px**: Espaciado de secciones, márgenes de tarjetas
- **32px**: Secciones mayores, secciones de página
- **48px**: Márgenes superior/inferior de página

**Principios de Layout:**

1. **Jerarquía de Contenido**: Separación visual clara entre header, contenido principal, sidebar
2. **Espacio en Blanco**: Espaciado generoso para "respirar" (profesional, no saturado)
3. **Alineación**: Texto alineado a izquierda, canales de 24px consistentes para columnas
4. **Sistema de Grid**: Grid de 12 columnas para layouts complejos

**Breakpoints Responsivos:**

```css
--breakpoint-sm: 640px;   /* Móvil landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / Desktop pequeño */
--breakpoint-xl: 1200px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

**Estrategia de Contenedor:**
- **Móvil (<768px)**: 100% de ancho, 16px de padding lateral
- **Tablet (768-1200px)**: 90% de ancho máximo, centrado
- **Desktop (>1200px)**: 1280px de ancho máximo, centrado

**Estándares de Espaciado de Componentes:**
- **Inputs de formulario**: 16px de espaciado vertical entre campos
- **Tarjetas**: 16px de padding interno, 24px de márgenes
- **Botones**: 16px de padding (8px arriba/abajo, 16px izquierda/derecha)
- **Modal**: 24px de padding, 32px de espaciado entre secciones
- **Columnas Kanban**: 16px de espacio entre columnas

**Densidad de Layout:**
- **Espacioso y aireado** (vs denso y eficiente)
- Espacio en blanco generoso soporta el objetivo emocional "Qué Paz"
- Estética industrial profesional - no saturado como herramientas legacy

### Accessibility Considerations

**Contraste de Color:**
- Todo el texto cumple con WCAG AA 4.5:1 de contraste mínimo
- Texto grande (18px+) cumple con 3:1 de contraste
- Rojo burdeos #A51C30 sobre blanco = 6.3:1 ✅
- Texto blanco sobre rojo burdeos = 6.3:1 ✅
- Texto negro sobre blanco = 21:1 ✅

**Objetivos Táctiles:**
- Mínimo 44x44px para todos los elementos interactivos
- Botones: 40px de altura mínimo, con padding para touch
- Inputs de formulario: 44px de altura para tapping fácil en móvil
- Items de navegación: Objetivos touch de altura completa

**Navegación por Teclado:**
- Todos los elementos interactivos accesibles por teclado
- Indicadores de foco visibles (2px sólido rojo burdeos #A51C30)
- Orden de tab lógico (arriba a abajo, izquierda a derecha)
- Skip links para contenido principal

**Soporte de Screen Reader:**
- Elementos HTML5 semánticos
- Labels ARIA para botones solo-icono
- Alt text para todas las imágenes
- Regiones live para actualizaciones dinámicas (notificaciones, KPIs)
- Jerarquía de headings apropiada (h1 → h2 → h3)

**Claridad Visual:**
- Nunca usar color solo (icono + color + texto redundante)
- Mensajes de error mostrados inline con iconos
- Confirmaciones de éxito con texto claro + icono
- Badges de estado siempre incluyen etiqueta de texto

**Movimiento y Animación:**
- Respetar configuración `prefers-reduced-motion`
- No contenido parpadeante (>3Hz)
- Transiciones suaves (200-300ms) para cambios de estado
- Indicadores de carga para operaciones asíncronas

**Escalado de Fuente:**
- Soporte de 200% de zoom de texto sin scroll horizontal
- Layouts responsivos adaptan a texto más grande
- No contenedores de ancho fijo que rompan el escalado de texto

## Design Direction Decision

### Design Directions Explored

Se generaron y evaluaron 6 direcciones de diseño en el showcase HTML interactivo (`ux-design-directions.html`):

**Dirección 1: Dashboard Clásico**
- Layout tradicional con sidebar fijo
- KPIs prominentes en dashboard principal
- Acceso rápido a funcionalidades principales
- **Contexto óptimo**: Desktop de Elena/Javier en oficina

**Dirección 2: Kanban First**
- El Kanban de 8 columnas es el protagonista central
- Panel lateral colapsable con KPIs
- Drag & drop visible
- **Contexto óptimo**: Desktop/tablet de Javier para control visual inmediato

**Dirección 3: Mobile First**
- Elementos táctiles grandes (44x44px)
- Navegación por gestos y vistas simplificadas
- Optimizado para tablets/móviles
- **Contexto óptimo**: Móvil de Carlos y tablet de María en piso de fábrica

**Dirección 4: Data Heavy**
- Múltiples gráficos y tablas densas
- Drill-down capabilities
- Métricas detalladas
- **Contexto óptimo**: Desktop de Elena para análisis y reportes a dirección

**Dirección 5: Minimal**
- Mucho whitespace, elementos reducidos
- Focus total en tarea actual
- Apoya objetivo emocional "Qué Paz"
- **Contexto óptimo**: Reducir sobrecarga cognitiva en tareas focales

**Dirección 6: Action Oriented**
- CTAs prominentes
- Flujos simplificados
- Shortcuts visibles
- **Contexto óptimo**: Core experience "Reportar avería en 30 segundos"

### Chosen Direction

**Decisión: Enfoque Multi-Direction por Contexto**

En lugar de elegir una única dirección de diseño, se adopta un enfoque adaptativo donde **cada dirección sirve a un contexto específico de usuario y dispositivo**.

**Justificación:**

Los 5 usuarios principales (Carlos, María, Javier, Elena, Pedro) tienen:
- **Dispositivos diferentes**: Móvil, tablet, desktop
- **Necesidades diferentes**: Reportar rápido, controlar OTs, analizar datos, gestionar stock
- **Contextos diferentes**: Piso de fábrica, oficina, taller
- **Niveles de expertise diferentes**: Operarios, técnicos, supervisores, administradores

Una sola dirección de diseño no puede optimizar la experiencia para todos estos contextos. Por lo tanto, **el sistema adaptará su layout y UX según el dispositivo y rol del usuario**.

### Design Rationale

**Principio de "Cada uno a su pantalla":**

1. **Responsive + Adaptive Design**: El layout se adapta no solo al tamaño de pantalla (responsive), sino también al contexto de uso y rol del usuario (adaptive)

2. **Componentes Compartidos**: Todas las direcciones usan el mismo sistema de diseño (shadcn/ui + Tailwind) con colores y tipografía consistentes, asegurando coherencia visual

3. **Experiencias Optimizadas por Contexto**:
   - **Móvil (<768px)**: Dirección 3 (Mobile First) para Carlos y María
   - **Tablet (768-1200px)**: Híbrido Dirección 2 + 3 (Kanban mobile-optimized)
   - **Desktop (>1200px)**: Dirección 1, 2, 4 o 6 según el rol y tarea actual

4. **User Personas Drive Layout**:
   - **Carlos (Operario)**: Siempre ve versión Mobile First + Action Oriented
   - **María (Técnica)**: Tablet = Kanban First, Móvil = Mobile First
   - **Javier (Supervisor)**: Desktop = Kanban First, Tablet = Dirección 1
   - **Elena (Administrador)**: Desktop = Data Heavy (por defecto), puede cambiar a Minimal
   - **Pedro (Stock)**: Desktop = Dirección 1 con foco en módulo Stock

### Implementation Approach

**Fase 1: Base Responsive (MVP)**

Implementar breakpoints responsivos que mapeen a las direcciones:

```css
/* Mobile: Carlos, María en piso de fábrica */
@media (max-width: 767px) {
  /* Dirección 3: Mobile First + elementos de Action Oriented */
  - Navegación inferior (bottom tabs)
  - Elementos táctiles 44x44px mínimo
  - Formularios simplificados
  - CTAs prominentes para acciones críticas
}

/* Tablet: María en campo, Javier en piso de fábrica */
@media (min-width: 768px) and (max-width: 1199px) {
  /* Híbrido Dirección 2 + 3: Kanban mobile-optimized */
  - Kanban de 8 columnas (2 visibles, swipe horizontal)
  - KPIs en panel lateral colapsable
  - Touch targets grandes
  - Sidebar simplificado
}

/* Desktop: Javier, Elena en oficina */
@media (min-width: 1200px) {
  /* Dirección 1 (default), puede cambiar según rol */
  - Sidebar completo
  - Dashboard con KPIs
  - Kanban de 8 columnas completo
  - Tablas densas con pagination
}
```

**Fase 2: Adaptive por Rol (Post-MVP)**

Detectar rol del usuario y aplicar layout por defecto:

```javascript
const layoutByRole = {
  'operario': 'mobile-first', // Carlos
  'tecnico': 'kanban-first', // María
  'supervisor': 'kanban-first', // Javier
  'admin': 'data-heavy', // Elena
  'stock': 'classic' // Pedro
};

// Permitir al usuario cambiar layout si lo prefiere
// Guardar preferencia en user settings
```

**Fase 3: Adaptive por Tarea (Opcional)**

Detectar contexto de tarea actual y ajustar UI:

```javascript
const layoutByTask = {
  'reportar-averia': 'action-oriented',
  'ver-kanban': 'kanban-first',
  'analizar-kpis': 'data-heavy',
  'gestionar-stock': 'classic'
};
```

**Componentes Compartidos:**

Todas las direcciones usan:
- **Color**: Rojo burdeos `#7D1220`, blanco `#FFFFFF`, negro `#000000`
- **Tipografía**: Inter font family con escala consistente
- **Espaciado**: 8px grid system
- **Componentes**: shadcn/ui + Tailwind CSS
- **Accesibilidad**: WCAG AA compliance en todas las direcciones

**Showcase HTML de Referencia:**

El archivo `ux-design-directions.html` contiene mockups visuales de las 6 direcciones que sirven como referencia durante la implementación. Los desarrolladores pueden consultar cada dirección para entender el layout esperado para cada contexto.


## User Journey Flows

### Journey 1: Reportar Avería en 30 Segundos (Carlos)

**User Persona:** Carlos - Operario de Línea (25 años)
**Contexto:** Piso de fábrica, móvil en mano, necesita reportar rápido
**Meta:** Reportar avería y recibir confirmación en <30 segundos

Los detalles completos del flow con diagramas Mermaid están documentados en el archivo de diseño. Este journey es el **core experience** que hace que Carlos sienta "¡Mi voz importa".

**Optimizaciones clave:**
- Autocomplete predictivo con debouncing de 300ms
- QR code scanning para pre-completar equipo
- Campo descripción opcional
- Toast notification con número único de aviso
- Reintento automático en caso de error

### Journey 2: Ver y Actualizar OTs Asignadas (María)

**User Persona:** María - Técnica de Mantenimiento (28 años)
**Contexto:** Abre app cada mañana en tablet, ve OTs del día
**Meta:** Trabajar en sus OTs asignadas, actualizar estados, ver repuestos

**Optimizaciones clave:**
- Dashboard con "Mis OTs de Hoy" al abrir
- Modal ℹ️ con historia completa de OT
- Actualización de estado en 2 taps
- Stock de repuestos con ubicación visible
- Real-time sync via WebSockets

### Journey 3: Gestionar Kanban de OTs (Javier)

**User Persona:** Javier - Supervisor de Mantenimiento (32 años)
**Contexto:** Desktop en oficina, necesita control visual de carga de equipo
**Meta:** Ver todas las OTs, asignar técnicos, drag-and-drop

**Optimizaciones clave:**
- Kanban de 8 columnas con OT cards
- Drag & drop entre columnas
- Asignar técnico en 2 taps
- Push notifications a técnicos afectados
- Panel lateral con KPIs del día

### Journey 4: Ver KPIs y Drill-Down (Elena)

**User Persona:** Elena - Administrador / Jefa de Mantenimiento (38 años)
**Contexto:** Desktop en oficina, necesita datos para decisiones
**Meta:** Ver KPIs, hacer drill-down, exportar reportes

**Optimizaciones clave:**
- KPIs principales con tendencias
- Drill-down en 3 niveles (División → Equipo → Historia)
- Comparar períodos
- Exportar a PDF/Excel/CSV
- Configurar alertas automáticas

### Journey 5: Gestionar Stock y Alertas Críticas (Pedro)

**User Persona:** Pedro - Usuario con Capacidad de Gestión de Stock (35 años)
**Contexto:** Desktop, necesita ver stock y alertas críticas
**Meta:** Gestionar repuestos, alertas de stock crítico, reposición

**Optimizaciones clave:**
- Panel de alertas con ítems críticos
- Solicitar reposición con cantidad sugerida
- Buscar repuestos por nombre/SKU/proveedor
- Ajustar stock con razones
- Ver stock por ubicación

### Journey Patterns

**Navigation Patterns:**
1. Dashboard como hub: Todos los journeys inician desde dashboard contextual
2. Modal ℹ️ para detalles: Detalles completos sin perder contexto
3. Breadcrumb o Back button: Navegación clara hacia atrás
4. Filtros contextuales: Específicos según pantalla actual

**Decision Patterns:**
1. Confirmación antes de acciones destructivas
2. Autocomplete con sugerencias
3. Smart defaults según contexto
4. Undo/Redo cuando aplica

**Feedback Patterns:**
1. Toast notifications (✓/✗)
2. Push notifications en tiempo real
3. Inline validation
4. Loading states con spinners
5. Progressive disclosure

**Error Recovery Patterns:**
1. Reintentar automáticamente (sin conexión/timeout)
2. Guardar draft local
3. Modo offline con sync posterior
4. Mensajes claros de qué pasó y qué hacer

### Flow Optimization Principles

**Minimizar Steps to Value:**
- Reportar avería: 3 pasos máximo (<30s)
- Ver OTs: 1 tap desde dashboard
- Actualizar estado: 2 taps
- Asignar técnico: 2 taps

**Reducir Cognitive Load:**
- Progressive disclosure
- Smart defaults
- Autocomplete
- Redundancia semántica (icono + color + texto)

**Clear Feedback & Progress:**
- Toast notifications
- Push notifications
- Loading states
- Progress indicators

**Moments of Delight:**
- Aviso #XXX: Número único genera "¡Funcionó!"
- Real-time sync via WebSockets
- Micro-interacciones (200-300ms)

**Graceful Error Handling:**
- Reintentar automáticamente
- Modo offline
- Mensajes claros
- No data loss


## Component Strategy

### Design System Components (shadcn/ui)

**Componentes Disponibles de shadcn/ui:**

shadcn/ui provee componentes accesibles basados en Radix UI y Tailwind CSS. Para gmao-hiansa utilizaremos:

**Foundation Components:**
- Button, Input, Textarea, Select: Para formularios (reportar avería, actualizaciones)
- Checkbox, Radio, Switch: Para filtros y configuraciones
- Label: Para accesibilidad en formularios

**Layout Components:**
- Card: Para agrupar contenido (KPIs, alertas)
- Separator: Para separación visual
- Tabs: Para navegación dentro de páginas
- Collapsible, Accordion: Para contenido expansible

**Navigation Components:**
- Navigation Menu: Para navegación principal
- Sidebar: Para navegación lateral (desktop)
- Breadcrumb: Para navegación jerárquica

**Feedback Components:**
- Toast: Para confirmaciones de acciones (✓/✗)
- Alert: Para alertas de stock crítico, errores
- Dialog/Modal: Para modales y confirmaciones
- Tooltip: Para información contextual
- Progress: Para loading states

**Data Display Components:**
- Table, Data Table: Para listas de OTs, stock, activos
- Badge: Para etiquetas de estado
- Avatar: Para usuarios con iniciales
- Calendar: Para fechas (rutinas, reportes)

**Form Components:**
- Form: Manejo de formularios con validación
- FormField: Para inputs con labels y errores

---

### Custom Components

#### 1. OTCard (Tarjeta de Orden de Trabajo)

**Purpose:** Tarjeta compacta que muestra información esencial de una OT en el Kanban, permitiendo identificación rápida y acceso a detalles.

**Usage:** Kanban board de 8 columnas, dashboard de OTs asignadas

**States:**
- Default: Estado normal de la tarjeta
- Hover: Elevation shadow + cursor pointer
- Dragging: Opacidad reducida + shadow elevation
- Selected: Borde rojo burdeos sólido 2px
- Disabled: Opacidad 50% + cursor not-allowed

**Variants:**
- Compact: Para mobile (altura 80px)
- Default: Para tablet/desktop (altura 120px)
- Detailed: Para view de lista (altura 160px con más info)

**Accessibility:**
- role="button" + tabindex="0" para keyboard navigation
- aria-label: "OT #789: Prensa PH-500 no arranca, estado: En Progreso"
- Enter/Space para activar

**Interaction Behavior:**
- Click/tap: Abrir Modal ℹ️ con detalles completos
- Drag: Mover a otra columna (desktop)
- Long press: Mostrar menú de acciones rápidas (mobile)

---

#### 2. KanbanBoard (Tablero Kanban)

**Purpose:** Tablero de 8 columnas para visualizar y gestionar OTs por estado con drag & drop.

**Usage:** Vista principal de Javier (supervisor), dashboard de María (técnica)

**States:**
- Default: Columnas visibles con OT cards
- Dragging: Columna destino destacada con borde punteado
- Filtered: Solo OTs que coinciden con filtros visibles
- Loading: Skeleton loaders en columnas

**Variants:**
- Desktop: 8 columnas completas
- Tablet: 2-3 columnas visibles con swipe horizontal
- Mobile: 1 columna con swipe + indicador "1/8"

**Accessibility:**
- role="region" + aria-label="Kanban de Órdenes de Trabajo"
- Columnas: role="listbox" + aria-label="[Estado]: [N] OTs"
- Keyboard: Arrow keys para navegar, Enter para seleccionar

**Interaction Behavior:**
- Drag & drop: Arrastrar OT card entre columnas
- Click columna: Filtrar para ver solo esa columna
- Click OT card: Abrir Modal ℹ️

---

#### 3. AssetSearch (Búsqueda Predictiva de Activos)

**Purpose:** Autocomplete jerárquico para buscar activos con suggest inteligente y debouncing.

**Usage:** Reportar avería (Paso 1), buscar activos en gestión

**States:**
- Idle: Input vacío, placeholder visible
- Typing: Usuario escribe, spinner de loading
- Results: Lista de suggestions desplegada
- NoResults: "No se encontraron equipos"
- Selected: Suggestion seleccionada con highlight

**Variants:**
- Default: Con jerarquía completa
- Compact: Sin jerarquía (para mobile)

**Accessibility:**
- role="combobox" + aria-expanded
- aria-autocomplete="list"
- Arrow keys para navegar suggestions
- Enter para seleccionar, Esc para cerrar

**Interaction Behavior:**
- Debouncing: 300ms después del último keystroke
- Click suggestion: Autocompletar input + cerrar dropdown
- Enter: Seleccionar primera suggestion

---

#### 4. KPICard (Tarjeta de KPI)

**Purpose:** Tarjeta compacta para mostrar KPI principal con trend indicator comparativo.

**Usage:** Dashboards de Elena (admin), Javier (supervisor)

**States:**
- Positive: Trend verde (mejora)
- Negative: Trend rojo (empeora)
- Neutral: Trend gris (sin cambio)
- Loading: Skeleton loader

**Variants:**
- Default: Con trend + meta
- Compact: Solo valor + trend (mobile)
- Detailed: Con sparkline mini-gráfico

**Accessibility:**
- role="figure" + aria-label="Mean Time To Repair: 4.2 horas, 15% mejor que el mes anterior"
- Trend icon con aria-label: "Disminución del 15%"

---

#### 5. StatusBadge (Badge de Estado)

**Purpose:** Badge redundante con icono + color + texto para identificar estado de OT (WCAG AA compliance).

**Usage:** OT cards, listas de OTs, detalles de OT

**States (8 estados OT):**
- Por Revisar: Gray + icono ojo
- Por Aprobar: Amber + icono reloj
- Aprobada: Blue + icono check
- En Progreso: Purple + icono wrench
- Pausada: Pink + icono pause
- Completada: Green + icono check-double
- Cerrada: Gray + icono archive
- Cancelada: Red + icono x

**Variants:**
- Default: Icono + color + texto completo
- Compact: Icono + primera palabra (mobile)
- Dot: Solo círculo de color (para indicadores visuales)

**Accessibility:**
- role="status" + aria-label="Estado: En Progreso"
- Icono decorativo: aria-hidden="true"
- Contraste WCAG AA: 4.5:1 mínimo

---

#### 6. ModalInfo (Modal ℹ️ de Detalles)

**Purpose:** Modal con detalles completos de OT sin perder contexto de la vista principal.

**Usage:** Kanban, listas de OTs, dashboard

**States:**
- Opening: Animation fade-in + scale
- Open: Contenido visible
- Loading: Skeleton loader mientras carga data
- Closing: Animation fade-out

**Accessibility:**
- role="dialog" + aria-modal="true"
- aria-labelledby: Título del modal
- Focus trap: Tab permanece dentro del modal
- Escape para cerrar

**Interaction Behavior:**
- Click fuera: Cerrar modal
- Escape: Cerrar modal
- Click [X]: Cerrar modal
- Click actions: Ejecutar acción sin cerrar

---

#### 7. StockAlert (Alerta de Stock Crítico)

**Purpose:** Alerta prominente para ítems de stock por debajo del mínimo.

**Usage:** Dashboard de Pedro, notificaciones push

**States:**
- Critical: 🔴 Rojo (stock < mínimo)
- Warning: 🟡 Amarillo (stock cercano al mínimo, < 120%)
- Resolved: 🟢 Verde (reposición solicitada)

**Variants:**
- Card: Para dashboard
- Toast: Para notificación temporal
- Banner: Para alerta persistente en header

**Accessibility:**
- role="alert" + aria-live="polite"
- Icono con aria-label: "Alerta de stock crítico"

---

#### 8. DivisionTag (Tag de División)

**Purpose:** Tag con color específico para identificar división (HiRock / Ultra).

**Usage:** OT cards, búsqueda de activos, listas

**States:**
- HiRock: Fondo amarillo/dorado (#FFD700), texto negro
- Ultra: Fondo verde salvia (#8FBC8F), texto negro
- Unknown: Fondo gris, texto negro

**Variants:**
- Default: Texto completo
- Compact: Iniciales (HR / UL)

**Accessibility:**
- role="status" + aria-label="División HiRock"
- Contraste WCAG AA: 4.5:1 mínimo

---

### Component Implementation Strategy

**Foundation Components (from shadcn/ui):**

Utilizamos componentes de shadcn/ui como base:
- Button, Input, Textarea, Select
- Card, Dialog, Toast, Alert
- Table, Badge, Avatar, Tabs
- Navigation Menu, Sidebar

**Custom Components Strategy:**

1. **Build on shadcn/ui primitives**: Usar Radix UI primitives como base
2. **Use design tokens**: Colores, tipografía, espaciado del sistema de diseño
3. **Follow shadcn/ui patterns**: Estructura de componentes, props, naming conventions
4. **Ensure accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Create reusable patterns**: Patrones consistentes para variantes, states, sizes

---

### Implementation Roadmap

**Phase 1 - Core Components (MVP Sprint 1-2):**

Componentes críticos para journeys más importantes:

1. **StatusBadge** - Necesario para todos los listados de OTs
2. **OTCard (Compact)** - Necesario para Kanban de 8 columnas
3. **AssetSearch** - Necesario para "Reportar avería en 30 segundos"
4. **KPICard (Default)** - Necesario para dashboards de Elena/Javier

**Target**: Soportar journeys de Carlos (reportar avería) y Javier (ver Kanban)

---

**Phase 2 - Supporting Components (MVP Sprint 3-4):**

Componentes que mejoran la experiencia:

5. **KanbanBoard (Desktop + Tablet)** - Necesario para control visual de Javier
6. **ModalInfo** - Necesario para detalles de OTs
7. **DivisionTag** - Necesario para identificación visual de activos
8. **StockAlert (Card + Toast)** - Necesario para gestión de stock de Pedro

**Target**: Soportar journeys completos de María, Javier, Pedro

---

**Phase 3 - Enhancement Components (Post-MVP):**

Componentes que optimizan UX:

9. **KPICard (Detailed with sparkline)** - Para análisis avanzado de Elena
10. **OTCard (Detailed variant)** - Para view de lista
11. **KanbanBoard (Mobile)** - Versión mobile-optimized con swipe
12. **AssetSearch (Compact)** - Para mobile

**Target**: Optimizar experiencias para todos los usuarios


## UX Consistency Patterns

### Button Hierarchy

**When to Use:**
- **Primary Buttons**: Acciones principales y destructivas (ej: "Reportar Avería", "Eliminar")
- **Secondary Buttons**: Acciones alternativas (ej: "Cancelar", "Ver más")
- **Ghost Buttons**: Acciones terciarias y links (ej: "Cerrar", "Omitir")

**Visual Design:**

Primary (Rojo Burdeos #7D1220):
- Text: White, 16px Semibold
- Padding: 12px (top/bottom), 16px (left/right)
- Height: 44px minimum (touch target)
- Radius: 8px (rounded-lg)

Secondary (Outline Gris):
- Text: Gray-900, 16px Semibold
- Border: 2px solid Gray-300
- Background: White
- Height: 44px minimum

Ghost (Sin fondo):
- Text: Maroon #7D1220, 16px Medium
- Hover: Subrayado

**Behavior:**
- **Primary**: Click → Ejecuta acción, muestra loading state si es async
- **Secondary**: Click → Acción alternativa o cancelar operación
- **Ghost**: Click → Navegación o acción no-destructiva

**Accessibility:**
- `role="button"` + `tabindex="0"` para elementos no-button
- Focus visible: 2px solid #7D1220, offset 2px
- ARIA labels si el texto no es descriptivo
- Enter/Space para activar

**Mobile Considerations:**
- Mínimo 44x44px para touch targets
- Mayor padding en mobile (16px top/bottom)
- Botones full-width en formularios móviles

**Variants:**
- **Primary Disabled**: Opacidad 50%, cursor not-allowed
- **Primary Loading**: Spinner reemplaza texto o se muestra a la derecha
- **Danger**: Primary button con rojo #EF4444 para acciones destructivas
- **Icon Button**: Solo icono para acciones comunes (ej: ℹ️, ⋯, ✕)

---

### Feedback Patterns

**When to Use:**
- **Success**: Confirmación de acción completada exitosamente
- **Error**: Acción falló
- **Warning**: Requiere atención pero no bloquea
- **Info**: Información contextual

**Visual Design:**

**Toast (Temporal, 5 segundos):**

Success (Verde):
- Background: Green-50
- Border-left: 4px solid Green-500
- Icon: ✓ Green-600
- Text: Green-900

Error (Rojo):
- Background: Red-50
- Border-left: 4px solid Red-500
- Icon: ✗ Red-600
- Text: Red-900

Warning (Ámbar):
- Background: Amber-50
- Border-left: 4px solid Amber-500
- Icon: ⚠️ Amber-600
- Text: Amber-900

**Alert (Persistente hasta dismiss):**
- Full-width banner
- Background: Red-100
- Dismissible con botón

**Behavior:**
- **Toast**: Auto-dismiss después de 5 segundos, click en ✕ para cerrar manual
- **Alert**: Persistente hasta que usuario toma acción o descarta
- **Stacking**: Múltiples toasts se apilan verticalmente (máximo 3 visibles)

**Accessibility:**
- Toast: `role="status"` + `aria-live="polite"`
- Alert: `role="alert"` + `aria-live="assertive"`
- Iconos decorativos: `aria-hidden="true"`
- Focus management: Toast no roba focus

**Mobile Considerations:**
- Toast: Full-width en mobile con padding reducido
- Alert: Stack horizontal si son múltiples (swipeable)
- Touch target mínimo 44x44px para botones de acción

---

### Form Patterns

**When to Use:**
- **Crear/Editar**: Formularios para crear/editar entidades
- **Buscar**: Inputs de búsqueda con autocomplete
- **Filtrar**: Controles de filtro en listas

**Visual Design:**

**Form Layout:**
- Title: "Reportar Avería"
- Separator: Divisor visual
- Required fields: Asterisco (*)

**Validation States:**

Valid (Default):
- Border: Gray-300
- ✓ Icon right (optional)

Invalid:
- Border: Red-500
- Error message below
- ✗ Icon

Validating:
- Spinner icon
- Border: Blue-500

**Behavior:**
- **Validation On Blur**: Validar cuando usuario sale del campo
- **Inline Errors**: Mostrar errores debajo del campo afectado
- **Success Indicators**: ✓ opcional cuando campo es válido
- **Required Fields**: Asterisco (*) + mensaje "Todos los campos con * son obligatorios"

**Accessibility:**
- `aria-required="true"` para campos requeridos
- `aria-invalid="true"` + `aria-describedby` para errores
- Labels asociados con `for` attribute
- Error messages: `role="alert"`
- Focus en primer campo al cargar formulario

**Mobile Considerations:**
- Inputs con height 44px mínimo
- Labels encima de inputs (no a la izquierda)
- Numeric inputs con tipo="tel"
- Select con native pickers

---

### Navigation Patterns

**When to Use:**
- **Principal (Desktop)**: Sidebar con navegación principal
- **Principal (Mobile)**: Bottom tabs para acceso rápido
- **Contextual**: Breadcrumbs para navegación jerárquica
- **Filters**: Tabs para filtros en listas

**Visual Design:**

**Desktop Sidebar:**
- Logo + title en header
- Active item: Maroon bg, white text
- Icons + labels para cada item

**Mobile Bottom Tabs:**
- 4 tabs máximo, icons + labels
- Active: Maroon text
- Fixed position bottom

**Breadcrumbs:**
- Format: "Dashboard > Kanban > OT #789"
- Click en cualquier breadcrumb → Navegar a ese nivel

**Behavior:**
- **Active State**: Item actual destacado visualmente
- **Collapse**: Sidebar colapsable a icon-only
- **Hamburger**: Menú hamburguesa en mobile

**Accessibility:**
- `role="navigation"` + `aria-label="Navegación principal"`
- Links: `aria-current="page"` para página actual
- Toggle button con `aria-expanded`

**Mobile Considerations:**
- Bottom tabs: 4 tabs máximo
- Hamburger menu: Para secondary navigation
- Back button: Navigation bar para back

---

### Modal and Overlay Patterns

**When to Use:**
- **Modal ℹ️**: Detalles de OT sin perder contexto
- **Confirm Dialog**: Confirmar acciones destructivas
- **Form Modal**: Formularios contextuales

**Visual Design:**

**Modal ℹ️ (Detalles de OT):**
- Header: [✕] + título + [⋯] (actions)
- Content: Scrollable con timeline, info equipo, repuestos
- Footer: Actions (opcional)
- Backdrop overlay (click outside → close)

**Confirm Dialog:**
- Warning icon + título claro
- Mensaje explicativo
- Warning text (opcional)
- Secondary + Danger buttons

**Behavior:**
- **Open**: Animation fade-in + scale (200-300ms)
- **Close**: Animation fade-out (200-300ms)
- **Focus Trap**: Tab permanece dentro del modal
- **Escape Key**: Cierra modal (no confirm dialogs)
- **Click Outside**: Cierra modal (excepto confirm dialogs)

**Accessibility:**
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby`: ID del título
- Focus en primer elemento al abrir
- Return focus al trigger al cerrar
- `aria-hidden="true"` en backdrop

**Mobile Considerations:**
- Modal width: 95% en mobile (vs 600px max-width desktop)
- Bottom sheet: Slide-up para formularios
- Full-screen: Modales complejos en mobile

---

### Empty States and Loading States

**When to Use:**
- **Empty State**: Lista o dashboard sin contenido
- **Loading State**: Cargando contenido asíncrono
- **Error State**: Error al cargar contenido

**Visual Design:**

**Empty State:**
- Large icon (64px)
- Headline claro
- Description explicativa
- Action button (opcional)

**Loading State (Skeleton):**
- Skeleton cards con shimmer animation
- Minimum 500ms para evitar flicker

**Error State:**
- Error icon
- Headline descriptivo
- Explanation del error
- Action buttons (Reintentar, Volver)

**Behavior:**
- **Empty State**: Mostrar cuando lista está vacía
- **Loading State**: Mostrar skeleton mientras carga
- **Error State**: Mostrar cuando load falla

**Accessibility:**
- `role="status"` para empty/loading states
- `aria-live="polite"` para error states
- `aria-busy="true"` para loading containers

**Mobile Considerations:**
- Empty state: Icon más pequeño (48px) en mobile
- Error state: Botones full-width en mobile

---

### Search and Filtering Patterns

**When to Use:**
- **Search**: Búsqueda global o en lista específica
- **Filter**: Filtrar resultados por atributos
- **Sort**: Ordenar resultados

**Visual Design:**

**Search Bar:**
- Icon + input con placeholder
- Autocomplete dropdown con suggestions

**Filter Bar:**
- Select dropdowns para filtros
- "Limpiar" button para reset
- Count de resultados

**Active Filters (Chips):**
- Chips horizontales con [✕] para remover
- "Limpiar todo" button

**Behavior:**
- **Search**: Debouncing de 300ms
- **Autocomplete**: Mostrar después de 2 caracteres
- **Filter**: Aplicar en tiempo real
- **Sort**: Selector dropdown

**Accessibility:**
- Search: `role="search"` + `aria-label`
- Filters: `aria-label="Filtrar por [atributo]"`
- Active filters: `aria-label="[Filtro] - Click para remover"`

**Mobile Considerations:**
- Search: Input siempre visible
- Filters: Bottom sheet con swipe-up
- Active filters: Chips horizontal scrollable


## Responsive Design & Accessibility

### Responsive Strategy

**Mobile-First + Adaptive by Context:**

gmao-hiansa adopta un enfoque **mobile-first** con layouts **adaptativos** según el dispositivo y rol del usuario.

**Mobile Strategy (<768px):**
- **Core experience**: "Reportar avería en 30 segundos" es la prioridad #1
- **Touch-first**: Todos los elementos son 44x44px minimum
- **Single column layouts**: Una columna para better readability
- **Bottom navigation**: 4 tabs máx para acceso rápido
- **Kanban**: 1 columna visible con swipe horizontal + indicador "1/8"
- **Formularios**: Labels encima de inputs, botones full-width
- **Modals**: Full-screen para contenido complejo

**Tablet Strategy (768px - 1200px):**
- **Híbrido Mobile-Desktop**: Combinación de patrones mobile y desktop
- **Touch-optimized**: Touch targets grandes + gestures soportados
- **Sidebar**: Icon-only, colapsable
- **Kanban**: 2-3 columnas visibles con swipe horizontal
- **Split views**: Content principal + detalles lado a lado

**Desktop Strategy (>1200px):**
- **Productivity**: Máxima información visible
- **Multi-column layouts**: Aprovechar screen real estate
- **Kanban**: 8 columnas completas visibles
- **Sidebar**: Full-width con icons + labels
- **Keyboard shortcuts**: Atajos para power users

---

### Breakpoint Strategy

**Breakpoints de Tailwind CSS (integrados en shadcn/ui):**

- **Mobile (<640px)**: Default styles (no media query)
- **Mobile Landscape (640px - 767px)**: sm breakpoint
- **Tablet Portrait (768px - 1023px)**: md breakpoint - 2-column layouts
- **Tablet Landscape / Small Desktop (1024px - 1279px)**: lg breakpoint
- **Desktop (1280px+)**: xl breakpoint - 4-column layouts, max-width 1280px
- **Large Desktop (1536px+)**: 2xl breakpoint - no max-width constraint

Usamos **breakpoints estándar de Tailwind** porque ya están integrados en shadcn/ui y cubren todos los use cases de los 5 user personas.

---

### Accessibility Strategy

**WCAG AA Compliance:**

gmao-hiansa cumple con **WCAG 2.1 Level AA** (industry standard).

**WCAG AA Requirements:**

**1. Perceivable:**
- **Color Contrast (4.5:1 minimum)**: Rojo burdeos #7D1220 sobre blanco = 7.8:1 ✅
- **Text Alternatives**: Alt text para imágenes, aria-label para iconos
- **Adaptable**: Layouts adaptan a zoom de texto 200%

**2. Operable:**
- **Keyboard Navigation**: Tab order lógico, focus indicators visibles
- **Skip Links**: "Saltar al contenido" para screen readers
- **No Keyboard Traps**: Tab no trapa al usuario
- **No Time Limits**: Reintentos automáticos sin intervención

**3. Understandable:**
- **Language**: Español (`lang="es"`), términos consistentes
- **Predictable**: CTAs descriptivos, focus visible
- **Input Assistance**: Labels, instrucciones, error messages específicos

**4. Robust:**
- **Semantic HTML**: Elementos HTML5 semánticos
- **ARIA**: Roles, labels, states cuando HTML no es suficiente
- **Screen Readers**: Compatibilidad con VoiceOver, NVDA, JAWS

---

### Testing Strategy

**Responsive Testing:**
- **Real Devices**: iPhone, Samsung Galaxy, iPad, Samsung Galaxy Tab
- **Browsers**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Network**: Test en 3G/4G para simular condiciones reales
- **Performance**: Load time <3s en 3G, Lighthouse score >90

**Accessibility Testing:**
- **Automated**: axe DevTools, Lighthouse, WAVE
- **Manual**: Screen readers (VoiceOver, NVDA, JAWS), keyboard-only testing
- **Color Blindness**: Protanopia, Deuteranopia, Tritanopia simulation
- **Focus Group**: Incluir usuarios con discapacidades en user testing

---

### Implementation Guidelines

**Responsive Development:**
- Use relative units (rem, %, vw, vh) over fixed pixels
- Mobile-first media queries
- Touch targets minimum 44x44px
- Optimize images con srcset y loading="lazy"

**Accessibility Development:**
- Semantic HTML structure (header, main, nav, footer)
- ARIA labels y roles
- Keyboard navigation implementation
- Focus management (trap focus en modals, return focus)
- Skip links para saltar al contenido
- High contrast mode support

---

## Workflow Completion

**Status:** ✅ COMPLETE (2026-03-07)

**All Steps Completed:**
1. ✅ Init - Document foundation established
2. ✅ Discovery - Project analysis and user insights
3. ✅ Core Experience - "Reportar avería en 30 segundos" defined
4. ✅ Emotional Response - 5 emotional pillars mapped
5. ✅ Inspiration - UX patterns analyzed
6. ✅ Design System - shadcn/ui + Tailwind CSS selected
7. ✅ Defining Experience - Core interaction mechanics
8. ✅ Visual Foundation - Colors (#7D1220), typography, spacing
9. ✅ Design Directions - 6 mockup variations created
10. ✅ User Journeys - 5 flows with Mermaid diagrams
11. ✅ Component Strategy - 8 custom components specified
12. ✅ UX Patterns - 7 consistency categories defined
13. ✅ Responsive & Accessibility - Mobile-first + WCAG AA
14. ✅ Complete - Workflow finalized

**Ready for Next Phase:**

This UX Design Specification is now ready to guide:
- Visual design implementation (Figma, wireframes)
- Technical architecture decisions
- Epic and story creation for development
- User validation testing with prototypes

**Next Steps Recommended:**

1. **Wireframes**: Create low-fidelity layouts based on UX spec
2. **Interactive Prototype**: Build clickable prototype for user testing
3. **Solution Architecture**: Technical design with UX context
4. **Epic Creation**: Break down requirements for development sprints

---

**🎉 Congratulations on completing the UX Design Specification for gmao-hiansa!**
