---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-v-01-discovery', 'step-v-02-format-detection', 'step-v-03-density-validation', 'step-v-04-brief-coverage-validation', 'step-v-05-measurability-validation', 'step-v-06-traceability-validation', 'step-v-07-implementation-leakage-validation', 'step-v-08-domain-compliance-validation', 'step-v-09-project-type-validation', 'step-v-10-smart-validation', 'step-v-11-holistic-quality-validation', 'step-v-12-completeness-validation', 'step-v-13-report-complete', 'step-e-01-discovery', 'step-e-02-review', 'step-e-03-edit']
inputDocuments: [
  'product-brief-gmao-hiansa-2026-02-26.md',
  'brainstorming-session-2026-02-25.md',
  'brainstorming-session-2026-02-25-ideas-detalladas.md'
]
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 2
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: greenfield
workflowType: 'prd'
date: '2026-03-07'
lastValidated: '2026-03-07'
validationRating: 4.5/5 EXCELLENT
validationStatus: PASS
author: Bernardo
project_name: gmao-hiansa
---

## Table of Contents

- [Executive Summary](#executive-summary)
  - [What Makes This Special](#what-makes-this-special)
- [Success Criteria](#success-criteria)
  - [User Success](#user-success)
  - [Business Success](#business-success)
  - [Technical Success](#technical-success)
  - [Measurable Outcomes](#measurable-outcomes)
- [User Journeys](#user-journeys)
  - [Journey de Carlos - Operario de Línea](#journey-de-carlos---operario-de-línea-25-años)
  - [Journey de María - Técnica de Mantenimiento](#journey-de-maría---técnica-de-mantenimiento-28-años)
  - [Journey de Javier - Supervisor de Mantenimiento](#journey-de-javier---supervisor-de-mantenimiento-32-años)
  - [Journey de Elena - Administrador / Jefa de Mantenimiento](#journey-de-elena---administrador--jefa-de-mantenimiento-38-años)
  - [Journey de Pedro - Usuario con Capacidad de Gestión de Stock](#journey-de-pedro---usuario-con-capacidad-de-gestión-de-stock-35-años)
- [Visual Specifications](#visual-specifications)
  - [Design System](#design-system)
  - [Key Screen Specifications](#key-screen-specifications)
  - [Iconography](#iconography)
  - [Accessibility Notes](#accessibility-notes)
- [Domain-Specific Requirements](#domain-specific-requirements)
  - [Mantenimiento Reglamentario y Certificaciones Obligatorias](#mantenimiento-reglamentario-y-certificaciones-obligatorias)
- [Web App Specific Requirements](#web-app-specific-requirements)
  - [Project-Type Overview](#project-type-overview)
  - [Responsive Design](#responsive-design)
  - [Performance Targets](#performance-targets)
  - [Browser Support](#browser-support)
  - [SEO Strategy](#seo-strategy)
  - [Accessibility Level](#accessibility-level)
  - [Implementation Considerations](#implementation-considerations)
- [Project Scoping & Phased Development](#project-scoping--phased-development)
  - [MVP Strategy & Philosophy](#mvp-strategy--philosophy)
  - [MVP Feature Set (Phase 1)](#mvp-feature-set-phase-1)
  - [Post-MVP Features](#post-mvp-features)
  - [Risk Mitigation Strategy](#risk-mitigation-strategy)
  - [Phased Development Summary](#phased-development-summary)
- [Functional Requirements](#functional-requirements)
  - [1. Gestión de Averías](#1-gestión-de-averías)
  - [2. Gestión de Órdenes de Trabajo](#2-gestión-de-órdenes-de-trabajo)
  - [3. Gestión de Activos](#3-gestión-de-activos)
  - [4. Gestión de Repuestos](#4-gestión-de-repuestos)
  - [5. Gestión de Usuarios, Roles y Capacidades](#5-gestión-de-usuarios-roles-y-capacidades)
  - [6. Gestión de Proveedores](#6-gestión-de-proveedores)
  - [7. Gestión de Rutinas de Mantenimiento](#7-gestión-de-rutinas-de-mantenimiento)
  - [8. Análisis y Reportes](#8-análisis-y-reportes)
  - [9. Sincronización y Acceso Multi-Dispositivo](#9-sincronización-y-acceso-multi-dispositivo)
  - [10. Funcionalidades Adicionales](#10-funcionalidades-adicionales)
- [Non-Functional Requirements](#non-functional-requirements)
  - [Performance](#performance)
  - [Security](#security)
  - [Scalability](#scalability)
  - [Accessibility](#accessibility)
  - [Reliability](#reliability)
  - [Integration](#integration)

---

# Product Requirements Document - gmao-hiansa

**Author:** Bernardo
**Date:** 2026-03-07 (última edición: eliminación de can_regulatory_inspection, corrección de roles y numeración MVP)

---

## Executive Summary

**gmao-hiansa** es un GMAO (Gestión de Mantenimiento Asistido por Ordenador) **single-tenant optimizado** diseñado específicamente para una empresa del sector metal con dos plantas especializadas (acero perfilado y panel sandwich). La solución transforma un departamento de mantenimiento puramente reactivo que opera con herramientas dispersas (Excel, WhatsApp, pizarra Kanban física) en una organización profesional, controlada y basada en datos mediante una PWA (Progressive Web App) completamente amoldada a las necesidades reales del negocio.

**Problema resuelto:** El departamento opera con información fragmentada en celulares personales (WhatsApp), múltiples versiones de Excel sin "fuente única de verdad", y visibilidad limitada a quienes están físicamente presentes. Esto genera pérdida de tiempo productivo, paradas de producción por falta de repuestos, fallas recurrentes, dependencia crítica de personas, e incapacidad de medir y mejorar el desempeño. El problema profundo no es tecnológico sino cultural: un departamento percibido como "caótico" que necesita transicionar de reactivo a proactivo.

**Usuarios objetivo:** Operarios de línea (reportan averías en segundos, reciben feedback inmediato), técnicos de mantenimiento (trabajo organizado con visibilidad clara de tareas), supervisores (control visual de carga de equipo), y administradores (toma de decisiones basada en KPIs). Público general consume dashboards transparencia en área común.

**Solución:** MVP con 13 funcionalidades base (aviso de averías, control de activos, generación de OT, control de repuestos, Kanban digital, KPIs, gestión de usuarios con 15 capacidades PBAC, proveedores, componentes multi-equipos, rutinas, PWA, reparación dual, reportes automáticos por email) sobre arquitectura diseñada para crecimiento progresivo. El sistema integra las 35 funcionalidades innovadoras del brainstorming en fases posteriores según necesidad evolutiva.

**Modelo de Autorización:** Sistema PBAC (Permission-Based Access Control) con 15 capacidades granulares que permiten flexibilidad completa en la asignación de permisos. Las capacidades se asignan individualmente a usuarios. El sistema permite gestión dinámica de permisos sin necesidad de roles o estructuras predefinidas.

**Visión de éxito:** Departamento transformado de "caótico" a "profesional" con cultura de datos establecida. Operarios sienten "mi voz importa" al reportar y recibir confirmación. Técnicos preguntan "¿cómo hacíamos antes sin esto?". Dashboard público genera transparencia total. Decisión de mantenimiento fundamentada en MTTR/MTBF, no intuición.

### What Makes This Special

**Diferenciación fundamental:** Arquitectura **single-tenant optimizada** (no SaaS multi-tenant) permite personalización profunda imposible en soluciones genéricas. La herramienta se amolda completamente al flujo real de la empresa, no al revés. Incluye 35 ideas de innovación (SCAMPER, First Principles, Reverse Brainstorming, Six Thinking Hats) para integración progresiva según necesidad real del departamento, no según roadmap de producto genérico.

**Core insight:** GMAOs del mercado (IBM Maximo, SAP PM, Infraspeak, Fracttal) son exceso de funcionalidades (bloatware) con 500+ características que nunca se usarán, diseñados para servir a miles de empresas no para personalizarse profundamente, curva de aprendizaje alta, costo prohibitivo, y rigidez de "adáptate a nuestro flujo". **gmao-hiansa** es lo opuesto: MVP enfocado con bases sólidas, sin sobrecarga inicial, crecimiento orgánico, y diseñado por quien experimentó el problema real (Excel + WhatsApp + pizarra).

**Enfoque progresivo inteligente:** MVP establece fundamentales (aviso → OT → ejecución → KPIs). Fase 2 (6 meses): estructura completa, búsqueda predictiva universal, plantillas de equipos. Fase 3 (12 meses): stock y reparación avanzada, QR tracking. Fase 4 (18 meses): optimización, predicción sin IoT, dashboards progresivos. Usuarios no se abruman con funcionalidades que no usarán; sistema crece con ellos.

**Diferenciador UX:** Reporte de avería en <30 segundos con búsqueda predictiva (vs 2-5 minutos actuales). Notificaciones push transparencia estado: "recibido", "autorizado", "en progreso", "completado". Operario pasa de "¿para qué reporto si no hacen caso?" a "siento que me escuchan". Supervisor gestiona visualmente sin llamar técnicos. Admin tiene dashboard ejecutivo sin buscar en 3 Excels diferentes.

**Transformación cultural no solo tecnológica:** Sistema crea cultura de datos mediante dashboards públicos (MTTR, MTBF, OTs abiertas/completadas, técnicos activos) visibles en toda la fábrica. Genera transparencia → profesionalización → confianza. Métricas establecen mejora continua (MTBF bajo → mantenimiento específico). Proactividad reemplaza "apagar fuegos".

**Clasificación del Proyecto:** Web App Responsiva de complejidad media, greenfield (desde cero), single-tenant optimizado para una empresa metalúrgica específica.

---

Con esta visión clara, pasamos a definir los criterios de éxito que validarán que estamos construyendo el producto correcto.

## Success Criteria

### User Success

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

### Business Success

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

### Technical Success

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

### Measurable Outcomes

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

## User Journeys

### Journey de Carlos - Operario de Línea (25 años)

**Descubrimiento:**
- Llega al trabajo, Elena anuncia la nueva app
- Recibe demo de 3 minutos, instala PWA en su móvil

**Onboarding:**
- Abre app, tutorial simple de 30 segundos
- Aprende que tiene capability `can_create_failure_report` (PREDETERMINADA para todos)
- Prueba reportando avería de prueba

**Core Usage - Día típico:**
- **09:00** - Su perfiladora falla
- **09:02** - Abre app, búsqueda predictiva sugiere "Perfiladora P-201"
- **09:03** - Describe problema, toca "Enviar" → confirmación inmediata (usa capability `can_create_failure_report`)
- **10:15** - Recibe notificación: "Tu aviso fue autorizado - OT asignada a María"
- **11:30** - Notificación: "OT en progreso - María está trabajando"
- **12:15** - Notificación: "OT completada - ¿Confirma que funciona?"
- **12:16** - Toca "Sí, funciona bien" → app: "Gracias por tu reporte"

**Momento "¡Aha!":**
- Piensa: "¡Wow! Esto funciona. Me escucharon. No es como WhatsApp."

**Long-term:**
- App parte de su rutina diaria
- Siente que su voz importa
- Recomienda entre pares

---

### Journey de María - Técnica de Mantenimiento (28 años)

**Descubrimiento:**
- Asiste a reunión donde Elena presenta la app
- Instala PWA en móvil y tablet

**Onboarding:**
- Primer login: tutorial de 1 minuto
- Configura perfil: habilidades, especialidades

**Core Usage - Día típico:**
- **07:45** - Llega 15 min antes, ve su lista del día: 5 OTs, 2 rutinas (requiere capability `can_view_own_ots`)
- **08:00** - Inicia primera OT, marca "En progreso" (requiere capability `can_update_own_ot`)
- **10:25** - Completa OT:
  - Toca "Completar OT" (requiere capability `can_complete_ot`)
  - Sección "Repuestos Usados": toca "Agregar Repuesto"
  - Escribe "skf" → "Rodamiento SKF-6208 (Stock: 12, 📍 Estante A3, Cajón 3)"
  - Selecciona, cantidad "1", toca "Guardar"
  - Sistema confirma: "✓ Agregado. Stock actualizado: 11"
- **14:00** - Recibe nueva OT asignada (notificación push)

**Momento "¡Aha!":**
- Después de 2 semanas: "¿Cómo hacíamos antes sin esto? Todo es tan organizado."

**Long-term:**
- Con capabilities `can_update_own_ot` y `can_complete_ot`, app indispensable para su trabajo
- Siente que trabaja profesionalmente
- Ve productividad aumentar

---

### Journey de Javier - Supervisor de Mantenimiento (32 años)

**Descubrimiento:**
- Elena le muestra el tablero Kanban
- Aprende columnas, código de colores, modal ℹ️

**Onboarding:**
- Tutorial de 2 minutos
- Aprende que requiere capability `can_view_all_ots` para ver tablero Kanban
- Aprende que requiere capability `can_assign_technicians` para asignar técnicos
- Aprende columna "Asignaciones" dividida (Pendiente de Asignar / Programada)
- Aprende código de colores:
  - 🌸 Rosa - Avisos de avería en Triage
  - ⚪ Blanco - Avisos de reparación en Triage
  - 🟢 Verde - Mantenimiento preventivo (generado por rutinas)
  - 🔴 Rojizo - Correctivo normal (técnico propio)
  - 🔴📏 Rojo con línea blanca - Correctivo externo (proveedor viene)
  - 🟠 Naranja - Reparación interna (taller propio)
  - 🔵 Azul claro - Reparación externa (enviado a proveedor)
- Aprende modal ℹ️ con detalles completos

**Core Usage - Día típico:**
- **06:55** - Abre tablero Kanban (requiere capability `can_view_all_ots`)
- **07:00** - Triage de avisos:
  - Toca tarjeta rosa → modal ℹ️: origen Carlos, fecha 6:52 AM, equipo P-201
  - "Convertir en OT" → tarjeta rojiza 🔴
  - Dropdown "Asignar a:" → selecciona Ana (requiere capability `can_assign_technicians`)
  - Tarjeta desciende a "Programada" (parte inferior de Asignaciones)
- **07:05** - Ana toca "▶️ Iniciar" → tarjeta pasa a "En Progreso"
- **NOTA:** La búsqueda predictiva está disponible globalmente y permite filtrar por equipos, estados y urgencias
- **09:30** - Llama proveedor: toca tarjeta azul 🔵 → modal ℹ️ con teléfono de Talleres Eléctricos SA
- **11:15** - María completa OT → tarjeta rojiza a "Completadas"
- **14:00** - Proveedor llega → busca tarjeta 🔴📏 → modal ℹ️ con teléfono del técnico en campo

**Momento "¡Aha!":**
- Gerente pregunta: "¿Qué pasa con la Prensa?"
- Javier toca tarjeta ℹ️: ve origen, fechas, proveedor, teléfono del técnico
- Llama al técnico: responde con precisión
- Piensa: "Un clic y tengo toda la historia. No busco en múltiples sistemas."

**Long-term:**
- Con capability `can_view_all_ots`, tablero Kanban con código de colores = visión instantánea
- Modal ℹ️ = trazabilidad completa
- Con capability `can_assign_technicians`, asigna técnicos/proveedores en 2 segundos
- Siente control total

---

### Journey de Elena - Administrador / Jefa de Mantenimiento (38 años)

**Descubrimiento:**
- Ve dashboard de prueba
- Piensa: "Por fin tendré datos"

**Onboarding:**
- Tutorial de dashboard y gestión de usuarios con 15 capacidades
- Aprende que `can_create_failure_report` es PREDETERMINADA (todos los usuarios nuevos la tienen marcada)
- Aprende que las 15 capacidades son: `can_create_failure_report`, `can_create_manual_ot`, `can_update_own_ot`, `can_view_own_ots`, `can_view_all_ots`, `can_complete_ot`, `can_manage_stock`, `can_assign_technicians`, `can_view_kpis`, `can_manage_assets`, `can_view_repair_history`, `can_manage_providers`, `can_manage_routines`, `can_manage_users`, `can_receive_reports`
- Aprende que `can_manage_users` le permite gestionar usuarios y asignar capacidades individualmente (no hay roles predefinidos, cada usuario tiene sus propias capacidades)

**Core Usage - Día típico:**
- **08:00** - Dashboard: MTTR 4.2h (↓15%), MTBF 127h (↑8%)
- **08:15** - Deep dive: MTTR → Planta Panel → Línea 2 → Prensa PH-500 (MTFR 12h, 3 fallos)
- **09:00** - Registra nuevo técnico Roberto:
  - ✅ can_create_failure_report (PREDETERMINADA)
  - ✅ can_create_manual_ot, can_update_own_ot, can_view_all_ots, can_complete_ot
  - ❌ can_manage_stock, can_assign_technicians, can_view_kpis, can_manage_users, can_manage_assets, can_view_repair_history, can_manage_providers, can_manage_routines, can_receive_reports
- **09:15** - Añade capacidades a Laura: ✅ can_manage_stock, ✅ can_assign_technicians, ✅ can_manage_users, ✅ can_manage_assets
- **09:30** - Configura reporte semanal automático para Laura (requiere capability `can_receive_reports`)
- **10:00** - Actualiza estado de equipo Prensa PH-500 a "En Reparación" (requiere capability `can_manage_assets`)
- **10:30** - Alerta stock mínimo → genera pedido
- **15:00** - Exporta reporte a Excel para Dirección

**Momento "¡Aha!":**
- Director pregunta: "¿Cómo va el departamento?"
- Proyecta dashboard: "MTTR ↓15%, MTBF ↑8%, productividad +10%"
- Director: "Excelente. Datos claros. Aprobado."
- Piensa: "Por primera vez, tengo datos. No adivino."

**Long-term:**
- Dashboard cada mañana
- Gestión flexible de usuarios con las 15 capacidades
- Capacidades según comportamiento
- Reporta con datos concretos

---

### Journey de Pedro - Usuario con Capacidad de Gestión de Stock (35 años)

**Descubrimiento:**
- Elena notifica: "El stock está en la app"
- "Solo recibes alertas de stock mínimo, no spam por cada uso"

**Onboarding:**
- Elena le asigna capability `can_manage_stock`
- Tutorial de 1 minuto sobre módulo de repuestos
- Aprende: stock en tiempo real sin interrupciones, alertas solo stock mínimo

**Core Usage - Día típico:**
- **07:30** - Abre app (requiere capability `can_manage_stock`): ve SKF-6208: 3 unidades 🔴 (mínimo: 5)
- **08:00** - Notificación: "Pedido recibido"
  - Recibe 10 rodamientos, confirma
  - SKF-6208: 3 → 13 unidades 🔴 → 🟢
- **10:45** - María usa repuesto → Pedro NO recibe notificación (sin spam)
- **11:30** - Ajuste manual: Filtro F-205 "-1" (discrepancia física)
- **14:00** - **Alerta:** "Filtro F-205 alcanzó mínimo (6 unidades, mínimo: 5)"
  - Genera pedido de 10 unidades (requiere capability `can_manage_stock`)

**Momento "¡Aha!":**
- Antes: 10+ llamadas/día preguntando stock y ubicación
- Ahora: 1 llamada en toda la mañana (alerta stock mínimo)
- Piensa: "Qué paz. Sin spam. Técnicos ven stock y ubicación solos. Solo me avisan cuando necesito actuar."

**Long-term:**
- Sin interrupciones constantes
- Alertas accionables solo cuando necesario
- Ahorra 2+ horas diarias
- Control total sin spam

---

Los journeys anteriores revelan el flujo core del producto. Ahora definimos las especificaciones visuales que guiarán el diseño de interfaz del sistema.

## Visual Specifications

Esta sección define las especificaciones visuales y de interfaz para el diseño UX del sistema gmao-hiansa.

### Design System

**Color Palette:**
- **Primary Colors:**
  - Main Blue: #0066CC (acciones principales, botones CTAs)
  - Secondary Blue: #004C99 (estados hover, active)
- **Status Colors (semáforo):**
  - Success/Green: #28A745 (OT completada, stock OK)
  - Warning/Orange: #FD7E14 (OT en progreso, stock bajo) - CAMBIADO de amarillo para cumplir WCAG AA
  - Danger/Red: #DC3545 (OT vencida, stock crítico, avería)
  - Info/Blue: #17A2B8 (información general)
- **Neutral Colors:**
  - Text Primary: #212529 (texto principal)
  - Text Secondary: #6C757D (texto secundario, labels)
  - Background: #F8F9FA (fondos, cards)
  - Border: #DEE2E6 (bordes, separadores)

**NOTA:** El color Warning/Orange #FD7E14 reemplaza al amarillo #FFC107 para garantizar contraste WCAG AA (4.5:1 mínimo) con texto blanco sobre fondos de color.

**Typography:**
- **Font Family:** System UI fonts (San Francisco, Segoe UI, Roboto)
- **Font Sizes:**
  - H1: 32px (títulos de páginas)
  - H2: 24px (títulos de secciones)
  - H3: 20px (subtítulos)
  - Body: 16px (texto general, WCAG AA compliance)
  - Small: 14px (texto secundario)
  - X-Small: 12px (metadata, timestamps)

**Components:**
- **Buttons:**
  - Primary: fondo #0066CC, texto blanco, altura 44px, radio 4px
  - Secondary: fondo transparente, borde #0066CC, altura 44px
  - Danger: fondo #DC3545, texto blanco (acciones destructivas)
- **Form Inputs:** altura 44px, borde #DEE2E6, radio 4px, padding 12px
- **Cards:** fondo blanco, sombra sutil, borde radius 8px, padding 20px

### Key Screen Specifications

#### Screen 1: Kanban Dashboard (Supervisor View)

**Layout:**
- **Header (60px):** Logo, título "Tablero Kanban", botón "Nueva OT"
- **Filters Bar (80px):** Filtros por estado, técnico, fecha, urgencia
- **Kanban Columns (3 columnas):**
  - Pendiente: 33% ancho
  - En Progreso: 33% ancho
  - Completada: 34% ancho
- **OT Card Design:**
  - Header: Código OT + badge urgencia (rojo para crítica, amarillo para alta)
  - Body: Título avería, equipo afectado, tiempo transcurrido
  - Footer: Asignado a (avatar + nombre), fecha límite
  - Height: variable según contenido, mínimo 120px
- **Drag & Drop:** Tarjetas arrastrables entre columnas
- **Touch Targets:** 44x44px mínimo (WCAG AA compliance)

**Desktop (>1200px):** 3 columnas visibles
**Tablet (768-1200px):** 2 columnas (Pendiente y En Progreso), Completada como modal
**Mobile (<768px):** 1 columna, swipe horizontal para cambiar columnas

#### Screen 2: Formulario Reportar Avería (Operario View)

**Layout:**
- **Header (60px):** Título "Reportar Avería", botón "Cancelar"
- **Progress Indicator (40px):** Paso 1 de 3 (Datos básicos → Detalles → Confirmación)
- **Form Fields:**
  - **Equipo:** Search input con búsqueda predictiva, dropdown suggestions
  - **Tipo de Avería:** Dropdown con opciones (Eléctrica, Mecánica, Neumática, Otra)
  - **Urgencia:** Radio buttons (Baja, Media, Alta, Crítica)
  - **Descripción:** Textarea con placeholder "Describe el problema observado", mínimo 20 caracteres
  - **Adjuntar Fotos:** Botón "Subir foto" + thumbnail previews (máx 5 fotos)
- **Navigation:**
  - Bottom bar (80px): Botón "Atrás" (secondary), "Continuar" (primary, right-aligned)
- **Validations:** Real-time feedback en cada campo, botón "Continuar" deshabilitado hasta completar campos requeridos

**Mobile (<768px):** Single column, botones stacked verticalmente
**Desktop (>1200px):** Formulario centrado, max-width 600px

#### Screen 3: Dashboard KPIs (Director/Admin View)

**Layout:**
- **Header (60px):** Título "Dashboard de KPIs", selector de período (Mes actual, Trimestre, Año)
- **KPI Cards Row (120px):** 4 cards horizontales
  - Card 1: MTTR (promedio horas), trending icon (↑↓)
  - Card 2: MTBF (promedio días), trending icon
  - Card 3: OTs Abiertas (conteo), color según umbral
  - Card 4: Stock Crítico (conteo items), badge rojo si >0
- **Charts Section:**
  - **Gráfico 1:** OTs por semana (bar chart), altura 300px
  - **Gráfico 2:** Tiempos de reparación (line chart), altura 300px
  - **Gráfico 3:** Top 5 averías recurrentes (horizontal bar chart), altura 250px
- **Drill-down:** Click en KPI card o gráfico abre detalle filtrado
- **Export Button:** Top-right, icono download + "Exportar Excel"

**Responsive:**
- Desktop (>1200px): 4 KPI cards, gráficos en 2 columnas
- Tablet (768-1200px): 2x2 grid KPI cards, gráficos stacked
- Mobile (<768px): 1x4 grid KPI cards, gráficos stacked

### Iconography

**Icon Set:** Material Design Icons o similar
- **Navigation:** Home, Kanban, Activos, Repuestos, KPIs
- **Actions:** Add, Edit, Delete, Search, Filter, Export
- **Status:** CheckCircle, Warning, Error, Clock, Alert
- **Users:** Person, People, Supervisors, Admin

### Accessibility Notes

- **Contrast:** Todos los elementos cumplen WCAG AA (4.5:1 mínimo)
- **Text Resize:** Layout soporta 200% zoom sin romper
- **Keyboard Navigation:** Tab order lógico, focus indicators visibles
- **Screen Reader:** ARIA labels en todos los elementos interactivos

---

Con las especificaciones visuales definidas, exploramos los requerimientos específicos del dominio de mantenimiento reglamentario que añaden complejidad regulatoria al sistema.

## Domain-Specific Requirements

### Mantenimiento Reglamentario y Certificaciones Obligatorias

**Contexto:** La empresa metalúrgica tiene equipos e instalaciones sujetos a normativa legal que requiere inspecciones periódicas obligatorias realizadas por empresas certificadas externas.

#### Categorías de Equipos con Mantenimiento Reglamentario

**1. PCI (Prevención de Incendios) - RD 1942/1993 y RD 532/2017:**
- **Equipos:** Extintores, sistemas de detección de humos, rociadores (sprinklers), alarmas contra incendios, iluminación de emergencia, señalización de seguridad
- **Plazos legales:** Extintores (revisión anual + mantenimiento cada 5 años), Sistemas de detección (semestral), Rociadores (anual)
- **Certificación:** Certificado de inspección PCI emitido por empresa mantenedora autorizada

**2. Instalaciones Eléctricas - REBT (RD 842/2002):**
- **Baja Tensión:** Cuadros eléctricos, instalaciones generales (hasta 1000V AC)
- **Alta Tensión:** Transformadores, centros de transformación, líneas de alta tensión (>1000V AC)
- **Plazos legales:** Baja tensión (inspección periódica según BOE), Alta tensión (bianual/trianual por OCA)
- **Certificación:** Certificado de inspección eléctrica emitido por ingeniero/colegiado u OCA

**3. Equipos a Presión - RD 2060/2008 y RD 709/2015:**
- **Equipos:** Calderas de vapor, recipientes a presión, compresores de aire, depósitos a presión, tuberías a presión
- **Plazos legales:** Calderas (cada 2-3 años por OCA), Recipientes a presión (según categoría), Compresores (periódico)
- **Certificación:** Certificado de inspección de presión emitido por OCA

#### Niveles de Inspección (A, B, C)

**Concepto:** Un mismo equipo puede tener MÚLTIPLES inspecciones con diferentes niveles y frecuencias.

**Ejemplo: Caldera de Vapor**
- **Nivel A (Básica):** Anual - Operación y mantenimiento básico
- **Nivel B (Intermedia):** Trienal - Pruebas intermedias
- **Nivel C (Exhaustiva):** Quinquenal - Inspección completa por OCA

Cada nivel tiene: certificado independiente, fecha de vencimiento propia, alertas independientes.

#### Requisitos del Sistema

**Nuevo Tipo de OT: "Mantenimiento Reglamentario"**

- **Color de tarjeta:** 🟣 Púrpura
- **Campos adicionales:**
  - Tipo de reglamento: PCI / Baja Tensión / Alta Tensión / Presión
  - Nivel de inspección: A / B / C
  - Proveedor certificado con nº de certificación
  - Fecha de inspección y próximo vencimiento
  - Estado del certificado: Vigente / Próximo a vencer / Vencido
  - Archivo de certificado (PDF)
  - Resultado: Favorable / Con observaciones / Desfavorable
  - Lista de deficiencias (si desfavorable)
  - OTs de corrección asociadas
  - Reinspección requerida

**Configuración de Actividades por Equipo:**

Admin puede configurar múltiples actividades por equipo:
- Caldera C-101: Nivel A (anual), Nivel B (trienal), Nivel C (quinquenal)
- Sistema calcula fechas de vencimiento automáticamente por actividad

**Resultado Desfavorable - OTs de Corrección:**

Si inspección es desfavorable:
1. Proveedor emite informe con deficiencias
2. Sistema permite crear OTs de corrección desde el informe
3. OTs hijas (rojizas 🔴) se crean para cada deficiencia
4. Técnicos ejecutan correcciones
5. Admin programa reinspección
6. Reinspección favorable → Certificado actualizado

**Vinculación:** OT Reglamentaria (padre) ↔ OTs de corrección (hijas)

**Bloqueo de Equipo:**

- Resultado desfavorable crítico → Equipo BLOQUEADO
- No se pueden usar ni asignar OTs
- Solo Admin puede desbloquear tras reinspección favorable

**Alertas:**

- 30 días antes: "⚠️ Caldera C-101 - Nivel A vence en 30 días"
- 7 días antes: "🚨 CRÍTICO: Extintor vence en 7 días"
- VENCIDO: "❌ CERTIFICADO VENCIDO: Riesgo legal"

**Dashboard de Cumplimiento:**

- Actividades por nivel (A/B/C) vencidas
- OTs de corrección abiertas/vencidas
- Equipos bloqueados
- Próximas inspecciones (priorizado)

**Gestión de Proveedores Certificados:**

- **Capacidad requerida:** `can_manage_providers` para gestionar proveedores certificados
- **Campos adicionales para proveedores reglamentarios:** Nº certificación, tipos autorizados (PCI/Baja Tensión/Alta Tensión/Presión), vigencia de certificación, archivo de certificado (PDF)
- **Acciones habilitadas con capacidades existentes:**
  - `can_view_all_ots` - Ver todas las OTs reglamentarias en el sistema
  - `can_create_manual_ot` - Crear OTs reglamentarias manualmente
  - `can_manage_providers` - Gestionar proveedores certificados (crear, editar, desactivar)
  - `can_manage_assets` - Bloquear/desbloquear equipos tras inspección desfavorable
  - `can_assign_technicians` - Asignar técnicos o proveedores a OTs reglamentarias

---

Estos requerimientos de dominio se implementarán mediante una Web App Responsiva optimizada para ambientes industriales. A continuación se detallan las características técnicas específicas de la plataforma.

## Web App Specific Requirements

### Project-Type Overview

**gmao-hiansa** es una **Web App Responsiva** construida como aplicación web interactiva moderna, diseñada para funcionar en entornos industriales (fábricas metalúrgicas). Es una aplicación de interfaz única empresarial interna que combina capacidades de escritorio y móvil en una sola base de código, optimizada para dispositivos táctiles y accesible exclusivamente desde navegadores Chrome y Edge.

**Características clave:**
- **Carga dinámica de contenido:** Client Components para interactividad (no necesita SEO al ser app interna)
- **Always online:** Requiere conexión a internet (NO hay modo offline)
- **Navegadores soportados:** Chrome y Edge (motores Chromium) solamente
- **Uso interno:** Aplicación empresarial interna, accesible desde red corporativa

### Responsive Design

- **Desktop (>1200px):** Dashboard completo, Kanban expandido
- **Tablet (768px-1200px):** Kanban 2 columnas, dashboard adaptado
- **Móvil (<768px):** 1 columna, navegación hamburguesa, botones 44x44px

### Performance Targets

- **Búsqueda predictiva:** <200ms
- **Carga inicial SPA:** <3s (first paint)
- **Transiciones vistas:** <100ms
- **Websocket heartbeat:** 30 segundos

### Browser Support

- ✅ Chrome (últimas 2 versiones)
- ✅ Edge (últimas 2 versiones, Chromium)
- ❌ Firefox, Safari, IE: NO soportados

### SEO Strategy

**NO aplica SEO** - Aplicación web interna, no pública, no indexada por buscadores.

### Accessibility Level

**Accesibilidad básica industrial:**

- Contraste WCAG AA (4.5:1) para luz de fábrica
- Texto: 16px cuerpo, 20px títulos
- Touch targets: 44x44px mínimo
- Zoom: 200% sin romper layout

### Implementation Considerations

**Despliegue Web App:**

- Producción: Build optimizado para ambientes de producción
- Hosting: Compatible con entornos Node.js
- HTTPS recomendado (seguridad)

**Ambiente industrial:**

- WiFi estable requerido
- Tablets Android industriales
- Desktops Windows con Chrome/Edge
- TVs 4K con Chrome

---

Con la plataforma técnica definida, pasamos a establecer el scope del proyecto mediante una estrategia de desarrollo progresivo que equilibre entrega de valor temprana con visión a largo plazo.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

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

### MVP Feature Set (Phase 1)

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

### Post-MVP Features

#### Phase 1.5 (Primer módulo post-deploy - Gate 3 meses)

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

#### Phase 2 (6 meses - Post-MVP)

**Estructura Completa:**
- Búsqueda predictiva universal (todos los campos, no solo equipos)
- Plantillas de equipos (crear múltiples iguales rápidamente)
- Avisos desestimados con histórico detallado
- Análisis avanzado de causas raíz (5 Whys, Fishbone)

**Enfoque:** Profundizar funcionalidades base, no añadir nuevas áreas

#### Phase 3 (12 meses - Expansion)

**Stock y Reparación Avanzada:**
- Etiquetado QR de equipos para tracking físico
- Cadena de custodia digital con QR
- Mapa en tiempo real de ubicación de equipos
- Integración IoT (opcional, solo si hay demanda real)

#### Phase 4 (18 meses - Optimización)

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

### Risk Mitigation Strategy

#### Technical Risks

**Riesgo 1: Escalabilidad de tiempo real a 10,000+ activos**
- **Mitigación:** Implementar heartbeat optimizado (30s) usando Server-Sent Events (SSE), más simple y compatible con Vercel serverless. SSE es suficiente para actualizaciones cada 30 segundos (cumple NFR del producto).
- **Simplificación inicial:** Actualizaciones cada 30s para OTs y KPIs via SSE (compatible con hosting serverless, sin necesidad de infraestructura compleja de WebSockets)

**Riesgo 2: Búsqueda predictiva <200ms con muchos datos**
- **Mitigación:** Implementar debouncing (300ms), usar índices de base de datos optimizados, caché de búsquedas frecuentes, empezar con búsqueda simple y optimizar después
- **Simplificación inicial:** Búsqueda por los 3 campos más usados (equipo, componente, repuesto)

#### Market Risks

**Riesgo 1: Resistencia al cambio (operarios siguen usando WhatsApp)**
- **Mitigación:** Onboarding simplificado (30 segundos tutorial), feedback inmediato (notificaciones push), involucrar a operarios en beta testing, hacer app más rápida que WhatsApp
- **Validación:** Medir % de averías por app vs WhatsApp semanalmente

**Riesgo 2: Sistema percibido como "vigilancia" no "ayuda"**
- **Mitigación:** Enfatizar beneficios para técnicos (trabajo organizado, no preguntas repetitivas), dashboard público transparencia (todos ven mismos datos), no micro-management individual
- **Validación:** Entrevistas con técnicos a 1 mes y 3 meses

#### Resource Risks

**Riesgo 1: Solo 1 developer - qué pasa si se enferma o abandona?**
- **Mitigación:** Código bien documentado, arquitectura modular simple, repositorio Git con commits claros, usando Next.js (framework estándar con comunidad grande)
- **Contingencia:** MVP funcional con 1 developer es posible, pero esponjar timeline a 4-5 meses

**Riesgo 2: Timeline 3-4 meses es muy agresivo**
- **Mitigación:** Priorizar funcionalidades core MVP, eliminar "nice-to-haves" (plantillas de equipos, búsqueda universal), lanzar con 80% de features y completar 20% restante en primeras semanas post-deploy
- **Contingencia:** MVP mínimo viable puede ser: Averías + Kanban + OTs básicas (sin repuestos, sin KPIs) → lanzar en 2 meses, luego agregar repuestos y KPIs

### Phased Development Summary

| Phase | Timeline | Features Core | Gate de Decisión |
|-------|----------|---------------|------------------|
| **MVP (Phase 1)** | Meses 0-3 | 13 funcionalidades base (sin reglamentario) | 90% adopción, 50+ OTs |
| **Phase 1.5** | Meses 3-4 | Mantenimiento Reglamentario (PCI, eléctrico, presión) - Primer módulo post-deploy | Certificados al día |
| **Phase 2** | Meses 4-6 | Estructura completa, búsqueda universal, plantillas | Adopción mantenida |
| **Phase 3** | Meses 6-12 | QR tracking, IoT opcional | ROI positivo |
| **Phase 4** | Meses 12-18 | Predicción, dashboards progresivos | Cultura de datos establecida |

---

Con el alcance y fases claramente definidos, pasamos a especificar los Requerimientos Funcionales que constituyen el contrato de capacidades del producto. Esta sección es vinculante para todo el trabajo downstream (UX, arquitectura, desarrollo).

## Functional Requirements

Esta sección define **EL CONTRATO DE CAPACIDADES** para todo el producto. Los diseñadores UX, arquitectos y equipos de desarrollo solo implementarán lo listado aquí.

### 1. Gestión de Averías

- **FR1:** Los usuarios con capability `can_create_failure_report` pueden crear avisos de avería asociados a equipos de la jerarquía de activos
- **FR2:** Los usuarios con capability `can_create_failure_report` pueden agregar una descripción textual del problema al crear un aviso
- **FR3:** Los usuarios con capability `can_create_failure_report` pueden adjuntar una foto opcional al reportar una avería
- **FR4:** Los usuarios reciben notificaciones push dentro de los 30 segundos siguientes al cambio de estado de su aviso (recibido, autorizado, en progreso, completado)
- **FR5:** Los operarios pueden confirmar si una reparación funciona correctamente después de completada y reciben confirmación con número de aviso generado dentro de los 3 segundos
- **FR6:** Los usuarios con capability `can_create_failure_report` pueden realizar búsqueda predictiva de equipos durante la creación de avisos
- **FR7:** Los usuarios con capability `can_view_all_ots` pueden ver todos los avisos nuevos en una columna de triage
- **FR8:** Los usuarios con capability `can_view_all_ots` pueden convertir avisos en órdenes de trabajo
- **FR9:** Los usuarios con capability `can_view_all_ots` pueden descartar avisos que no son procedentes
- **FR10:** Se pueden distinguir visualmente entre avisos de avería (color rosa #FFC0CB) y reparación (color blanco #FFFFFF)

### 2. Gestión de Órdenes de Trabajo

#### Vista Kanban

- **FR11:** Las órdenes de trabajo (tanto preventivas como correctivas) tienen 8 estados posibles: Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada
- **FR11-A:** Las órdenes de trabajo tienen un atributo de "tipo de mantenimiento" que las clasifica como: Preventivo (generadas desde rutinas) o Correctivo (generadas desde reportes de averías). Este tipo es visible tanto en la vista de listado como en las tarjetas Kanban.
- **FR11-B:** Las OTs de mantenimiento preventivo muestran la etiqueta "Preventivo" en tarjetas Kanban y listado. Las OTs de mantenimiento correctivo muestran la etiqueta "Correctivo" en las mismas vistas.
- **FR12:** Los usuarios con capability `can_update_own_ot` pueden iniciar una orden de trabajo asignada cambiando su estado a "En Progreso"
- **FR13:** Los usuarios con capability `can_update_own_ot` pueden agregar repuestos usados y requisitos durante el cumplimiento de una orden de trabajo asignada
- **FR14:** Los usuarios con capability `can_complete_ot` pueden completar (validar) una orden de trabajo
- **FR15:** Los usuarios con capability `can_update_own_ot` pueden agregar notas internas a una orden de trabajo asignada
- **FR16:** El stock de repuestos se actualiza en tiempo real (dentro de 1 segundo) al registrar uso. Las actualizaciones de stock son silenciosas (sin enviar notificaciones a usuarios con `can_manage_stock`) para evitar spam de notificaciones por actualizaciones masivas
- **FR17:** Los usuarios con capability `can_assign_technicians` pueden asignar de 1 a 3 técnicos internos a cada orden de trabajo, todos deben tener la capability `can_update_own_ot`
- **FR18:** Los usuarios con capability `can_assign_technicians` pueden asignar órdenes de trabajo a proveedores externos
- **FR19:** Los usuarios con capability `can_assign_technicians` pueden seleccionar de 1 a 3 técnicos (que tengan `can_update_own_ot`) o proveedores según el tipo de orden de trabajo, filtrando técnicos disponibles por habilidades y ubicación. Todos los usuarios asignados reciben notificaciones de la OT
- **FR19-A:** Cuando una orden de trabajo tiene múltiples usuarios asignados, cualquiera de ellos puede agregar repuestos usados, actualizar estado o completar la OT. Todos los usuarios asignados reciben notificaciones de cambios de estado y actualizaciones de la OT
- **FR20:** Los usuarios con capability `can_update_own_ot` pueden ver todas las órdenes de trabajo donde están asignados en su dashboard personal
- **FR21:** Los usuarios con capability `can_view_all_ots` pueden ver todas las órdenes de trabajo de la organización. La vista de listado incluye una columna "Asignaciones" que muestra la distribución de usuarios asignados (ej: "2 técnicos / 1 proveedor" cuando hay múltiples asignados)
- **FR22:** Se pueden distinguir visualmente entre órdenes de preventivo (color verde #28A745), correctivo propio (color rojizo #DC3545) y correctivo externo (color rojo con línea blanca #DC3545 con borde #FFFFFF)
- **FR23:** Se pueden distinguir visualmente entre órdenes de reparación interna (taller propio, color naranja #FD7E14) y reparación enviada a proveedor (color azul #17A2B8). Las órdenes de preventivo usan color verde #28A745
- **FR24:** Se pueden ver detalles completos de una orden de trabajo (fechas, origen, técnico, repuestos) en modal informativo
- **FR24-A:** Cuando un proveedor marca una orden de reparación como completada, los usuarios con capability `can_assign_technicians` pueden confirmar la recepción del equipo reparado antes de marcar la OT como completada. La confirmación requiere verificación visual del estado del reparado
- **FR25:** Los usuarios con capacidad `can_create_manual_ot` pueden crear órdenes de trabajo manuales sin partir de un aviso

#### Vista de Listado

- **FR26:** Se puede acceder a una vista de listado de todas las órdenes de trabajo
- **FR27:** Se puede filtrar el listado de órdenes de trabajo por 5 criterios: estado, técnico, fecha, tipo, equipo
- **FR28:** Se puede ordenar el listado de órdenes de trabajo por cualquier columna
- **FR29:** Se pueden realizar las mismas acciones en la vista de listado que en el Kanban (asignar, iniciar, completar, ver detalles)
- **FR30:** Se puede alternar entre vista Kanban y vista de listado
- **FR31:** Las vistas Kanban y de listado mantienen sincronización en tiempo real (cambios se reflejan en ambas)

### 3. Gestión de Activos

- **FR32:** El sistema maneja jerarquía de activos de 5 niveles: Planta → Línea → Equipo → Componente → Repuesto
- **FR33:** Los usuarios con capability `can_manage_assets` pueden navegar la jerarquía de activos de 5 niveles (Planta → Línea → Equipo → Componente → Repuesto) en cualquier dirección
- **FR34:** Los usuarios con capability `can_manage_assets` pueden asociar un componente a múltiples equipos
- **FR35:** Los usuarios con capability `can_view_repair_history` pueden ver el historial de reparaciones de un equipo (todas las OTs completadas con fechas, repuestos usados, técnicos asignados)
- **FR36:** Los usuarios con capability `can_manage_assets` pueden gestionar 5 estados para equipos (Operativo, Averiado, En Reparación, Retirado, Bloqueado)
- **FR37:** Los usuarios con capability `can_manage_assets` pueden cambiar el estado de un equipo
- **FR38:** Los usuarios con capability `can_manage_assets` pueden ver el stock de equipos completos reutilizables con contador de cantidades por estado (Disponible, En Uso, En Reparación, Descartado)
- **FR39:** Los usuarios con capability `can_manage_assets` pueden rastrear la ubicación actual de equipos reutilizables por área de fábrica asignada, último técnico con custodia, o estado de reserva actual
- **FR40:** Los usuarios con capability `can_manage_assets` pueden importar activos masivamente desde un archivo CSV
- **FR41:** La estructura jerárquica se valida automáticamente durante la importación masiva de activos
- **FR42:** Los usuarios con capability `can_manage_assets` pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)
- **FR43:** Los usuarios con capability `can_manage_assets` pueden descargar una plantilla de importación con el formato requerido

### 4. Gestión de Repuestos

- **FR44:** Todos los usuarios pueden acceder al catálogo de repuestos consumibles en modo consulta (sin capability específica)
- **FR45:** Todos los usuarios pueden ver el stock actual de cada repuesto en tiempo real (sin capability específica)
- **FR46:** Todos los usuarios pueden ver la ubicación física de cada repuesto en el almacén (sin capability específica)
- **FR47:** Los usuarios ven el stock y ubicación al seleccionar un repuesto para uso
- **FR48:** Los usuarios con capability `can_manage_stock` pueden realizar ajustes manuales de stock
- **FR49:** Los usuarios deben agregar un motivo al realizar ajustes manuales de stock
- **FR50:** Los usuarios con capability `can_manage_stock` reciben alertas cuando un repuesto alcanza su stock mínimo
- **FR51:** Los usuarios con capability `can_manage_stock` pueden generar pedidos de repuestos a proveedores
- **FR52:** Los usuarios con capability `can_manage_stock` pueden gestionar el stock de repuestos
- **FR53:** Los usuarios con capability `can_manage_stock` pueden asociar cada repuesto con uno o más proveedores
- **FR54:** Los usuarios con capability `can_manage_stock` pueden importar repuestos masivamente desde un archivo CSV
- **FR55:** Los datos de proveedores y ubicaciones se validan automáticamente durante la importación masiva de repuestos y se reportan errores
- **FR56:** Los usuarios pueden ver un reporte de resultados de la importación (registros exitosos, errores, advertencias)

### 5. Gestión de Usuarios, Roles y Capacidades

**MODELO DE AUTORIZACIÓN: PBAC (Permission-Based Access Control) con Roles como Etiquetas**

- **FR58:** Los usuarios con capability `can_manage_users` pueden crear nuevos usuarios en el sistema
- **FR59:** Los usuarios con capability `can_manage_users` pueden crear hasta 20 etiquetas de clasificación de usuarios (ej: Operario, Técnico, Supervisor). Estas etiquetas son solo para clasificación visual y NO otorgan capabilities ni afectan el acceso al sistema.
- **FR60:** ❌ **ELIMINADO** (las capacidades ya NO se asignan a roles)
- **FR61:** Los usuarios con capability `can_manage_users` pueden eliminar etiquetas de clasificación personalizadas
- **FR62:** Los usuarios pueden tener asignada una o más etiquetas de clasificación simultáneamente (ej: Operario, Técnico, Supervisor)
- **FR63:** ❌ **ELIMINADO** (los usuarios NO heredan capacidades desde roles)
- **FR64:** Los usuarios con capability `can_manage_users` pueden asignar etiquetas de clasificación a usuarios para organización visual
- **FR65:** Los usuarios con capability `can_manage_users` pueden quitar las etiquetas de clasificación de usuarios
- **FR66:** Todo usuario nuevo (excepto el administrador inicial) tiene ÚNICAMENTE la capability `can_create_failure_report` asignada por defecto. Las otras 14 capabilities deben ser asignadas manualmente por un usuario con capability `can_manage_users`.
- **FR67:** Durante el registro de usuarios, los usuarios con capability `can_manage_users` seleccionan las capabilities asignadas usando checkboxes con etiquetas en castellano legibles (ej: "✅ Reportar averías", "✅ Ver todas las OTs"). Los nombres internos del código permanecen en inglés.
- **FR67-A:** Las etiquetas de clasificación son únicamente para organizar visualmente a los usuarios (ej: Operario, Técnico, Supervisor) y NO tienen ninguna relación con las capabilities. Las etiquetas NO otorgan, NO eliminan, NO modifican, NO afectan de ninguna manera las capabilities asignadas a un usuario. Etiquetas y capabilities son completamente independientes.
- **FR67-B:** Una misma etiqueta de clasificación NO otorga las mismas capacidades a todos los usuarios que la tienen asignada (las capacidades se asignan individualmente a cada usuario)
- **FR68:** Las capacidades del sistema son 15 en total:
  1. `can_create_failure_report` - Reportar averías (PREDETERMINADA para todos)
  2. `can_create_manual_ot` - Crear OTs manuales sin aviso previo
  3. `can_update_own_ot` - Actualizar OTs propias
  4. `can_view_own_ots` - Ver solo OTs asignadas al usuario
  5. `can_view_all_ots` - Ver todas las OTs del equipo
  6. `can_complete_ot` - Completar OTs
  7. `can_manage_stock` - Gestionar stock de repuestos
  8. `can_assign_technicians` - Asignar técnicos a órdenes de trabajo
  9. `can_view_kpis` - Ver KPIs avanzados con drill-down
  10. `can_manage_assets` - Gestionar activos (crear, editar, eliminar equipos de la jerarquía)
  11. `can_view_repair_history` - Consultar historial de reparaciones de equipos
  12. `can_manage_providers` - Gestionar proveedores (mantenimiento y repuestos)
  13. `can_manage_routines` - Gestionar rutinas de mantenimiento (crear, editar, desactivar)
  14. `can_manage_users` - Gestionar usuarios y sus capacidades (crear, editar, eliminar usuarios, asignar capabilities, etiquetar usuarios con clasificaciones)
  15. `can_receive_reports` - Recibir reportes automáticos por email
- **FR68-UI:** Las capabilities se presentan en la interfaz de usuario en castellano con formato legible, sin usar notación técnica. Los nombres internos del código (en inglés) no son visibles para el usuario final.

**Tabla de Presentación de Capabilities:**

| Nombre Interno (Código) | Etiqueta en UI (Castellano) |
|------------------------|---------------------------|
| `can_create_failure_report` | ✅ Reportar averías |
| `can_create_manual_ot` | Crear OTs manuales |
| `can_update_own_ot` | Actualizar OTs propias |
| `can_view_own_ots` | Ver OTs asignadas |
| `can_view_all_ots` | Ver todas las OTs |
| `can_complete_ot` | Completar OTs |
| `can_manage_stock` | Gestionar stock |
| `can_assign_technicians` | Asignar técnicos a órdenes de trabajo |
| `can_view_kpis` | Ver KPIs avanzados |
| `can_manage_assets` | Gestionar activos |
| `can_view_repair_history` | Ver historial de reparaciones |
| `can_manage_providers` | Gestionar proveedores |
| `can_manage_routines` | Gestionar rutinas de mantenimiento |
| `can_manage_users` | Gestionar usuarios y sus capacidades (crear, editar, eliminar usuarios, asignar capabilities, etiquetar con clasificaciones) |
| `can_receive_reports` | Recibir reportes automáticos |
- **FR68-A:** Los usuarios sin la capability `can_manage_assets` solo pueden consultar activos en modo solo lectura (ver jerarquía, historial de OTs, estados), sin poder crear, modificar ni eliminar equipos
- **FR68-B:** Los usuarios sin la capability `can_view_repair_history` no pueden acceder al historial de reparaciones de equipos (ver OTs completadas, patrones de fallas, métricas de confiabilidad por equipo)
- **FR68-C:** El primer usuario creado durante el setup inicial de la aplicación (denominado "administrador inicial") tiene las 15 capabilities del sistema asignadas por defecto. Este usuario especial es el único que recibe capabilities preasignadas además de `can_create_failure_report`. Ningún otro usuario creado posteriormente tiene capabilities preasignadas excepto `can_create_failure_report` que es predeterminada para todos.

#### Perfil de Usuario

- **FR69:** Los usuarios pueden acceder a su perfil personal
- **FR69-A:** Los usuarios con capability `can_manage_users` pueden editar la información personal de cualquier usuario (nombre, email, teléfono)
- **FR70:** Los usuarios pueden editar su información personal (nombre, email, teléfono)
- **FR71:** Los usuarios pueden cambiar su contraseña
- **FR70-A:** Los usuarios con capability `can_manage_users` pueden eliminar usuarios del sistema
- **FR72:** Los usuarios con capability `can_manage_users` pueden ver un historial de actividad del usuario durante los últimos 6 meses (login, cambios de perfil, acciones críticas)

#### Flujo de Onboarding y Primer Acceso

- **FR72-A:** El sistema obliga a los usuarios a cambiar su contraseña temporal en el primer acceso antes de permitirles navegar a cualquier otra sección de la aplicación
- **FR72-B:** Los usuarios con capability `can_manage_users` pueden registrar nuevos usuarios asignando credenciales temporales (usuario y contraseña) que deberán ser cambiadas en el primer acceso
- **FR72-C:** Los usuarios con capability `can_manage_users` pueden ver el historial de trabajos completo de cualquier usuario, incluyendo: OTs completadas, OTs en progreso asignadas, OTs canceladas o reasignadas, tiempo promedio de completación (MTTR por usuario), repuestos usados, y productividad (OTs completadas por semana). El historial permite filtrar por rango de fechas específico. Esta capability es distinta de `can_assign_technicians` que solo permite asignar técnicos a OTs.

#### Control de Acceso por Módulos

- **FR73:** Los usuarios acceden solo a los módulos para los que tienen capacidades asignadas:
  - Órdenes de Trabajo (requiere `can_view_own_ots` o `can_view_all_ots`)
  - Activos (requiere `can_view_own_ots` para consultar, `can_manage_assets` para editar)
  - Repuestos (requiere `can_manage_stock` para gestionar)
  - Proveedores (requiere `can_manage_providers`)
  - Rutinas (requiere `can_view_all_ots` para consultar, `can_manage_routines` para crear/editar)
  - KPIs (requiere `can_view_kpis`)
  - Usuarios (requiere `can_manage_users`)
- **FR74:** Los usuarios solo ven en la navegación los módulos para los que tienen capacidades asignadas
- **FR75:** El acceso se deniega automáticamente si un usuario intenta navegar directamente a un módulo no autorizado (URL directa)
- **FR76:** Los usuarios ven un mensaje explicativo cuando se deniega acceso por falta de capacidades

### 6. Gestión de Proveedores

- **FR77:** Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de mantenimiento (crear, editar, desactivar)
- **FR78:** Los usuarios con capability `can_manage_providers` pueden gestionar el catálogo de proveedores de repuestos (crear, editar, desactivar)
- **FR78-A:** El formulario de proveedores es único para ambos tipos (mantenimiento y repuestos), con un campo de selección "Tipo de proveedor" que permite clasificarlos como "Mantenimiento" o "Repuestos". Un mismo proveedor puede ofrecer ambos tipos de servicio.
- **FR79:** Los usuarios con capability `can_manage_providers` pueden ver datos de contacto de cada proveedor
- **FR80:** Los usuarios con capability `can_manage_providers` pueden asociar proveedores con tipos de servicio que ofrecen. El catálogo de servicios incluye 6 tipos predefinidos: Mantenimiento Correctivo, Mantenimiento Preventivo, Mantenimiento Reglamentario, Suministro de Repuestos, Mantenimiento de Equipos Específicos (soldadura, corte, etc.), y Servicios de Emergencia

### 7. Gestión de Rutinas de Mantenimiento

- **FR81:** Los usuarios con capability `can_manage_routines` pueden gestionar rutinas de mantenimiento (crear, editar, desactivar) con frecuencias diaria, semanal o mensual
- **FR81-A:** Las rutinas de mantenimiento pueden ser de dos modalidades: (1) Por equipo específico - rutinas asociadas a un equipo particular de la jerarquía de activos, o (2) Customizables - rutinas generales como orden y limpieza con campos variables personalizables
- **FR81-B:** Cada rutina de mantenimiento configura: tareas a realizar, técnico responsable, repuestos necesarios y duración estimada. Estos campos aplican tanto a rutinas por equipo como customizables.
- **FR82:** Las órdenes de trabajo de mantenimiento preventivo se generan automáticamente 24 horas antes del vencimiento de rutina, con estado "Pendiente" y etiqueta "Preventivo"
- **FR83:** Los usuarios con capability `can_view_all_ots` pueden ver el porcentaje de rutinas completadas en el dashboard, incluyendo sus propias rutinas asignadas
- **FR84:** El usuario asignado a una rutina recibe alertas cuando la rutina no se completa en el plazo previsto. Las alertas se envían en 3 momentos: 1 hora antes del vencimiento, en el momento del vencimiento, y 24 horas después del vencimiento si permanece incompleta

### 8. Análisis y Reportes

#### KPIs y Métricas

- **FR85:** Los usuarios con capability `can_view_kpis` pueden ver el KPI MTTR (Mean Time To Repair) calculado con datos actualizados cada 30 segundos
- **FR86:** Los usuarios con capability `can_view_kpis` pueden ver el KPI MTBF (Mean Time Between Failures) calculado con datos actualizados cada 30 segundos
- **FR87:** Los usuarios con capability `can_view_kpis` pueden navegar drill-down de KPIs (Global → Planta → Línea → Equipo)
- **FR88:** Los usuarios con capability `can_view_kpis` pueden ver métricas adicionales (OTs abiertas, OTs completadas, técnicos activos, stock crítico)
- **FR89:** Los usuarios con capability `can_view_kpis` reciben alertas de 3 tipos: stock mínimo (requiere `can_manage_stock`), MTFR alto (definido como 150% del promedio de los últimos 30 días), rutinas no completadas
- **FR90:** Los usuarios con capability `can_view_kpis` pueden exportar reportes de KPIs a Excel en formato .xlsx compatible con Microsoft Excel 2016+, con hojas separadas por KPI (MTTR, MTBF, OTs Abiertas, Stock Crítico)
- **FR90-A:** Los usuarios con capability `can_receive_reports` pueden configurar la recepción de reportes automáticos en PDF enviados por email, incluyendo selección de KPIs (MTTR, MTBF, OTs abiertas, OTs completadas, stock crítico, técnicos activos, porcentaje de rutinas completadas, número de usuarios asignados por OT) y frecuencia (diario, semanal, mensual)
- **FR90-B:** Los reportes diarios se generan automáticamente todos los días a las 8:00 AM con datos del día anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-C:** Los reportes semanales se generan automáticamente todos los lunes a las 8:00 AM con datos de la semana anterior (lunes a domingo), en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-D:** Los reportes mensuales se generan automáticamente el primer lunes de cada mes a las 9:00 AM con datos del mes anterior, en formato PDF adjunto enviado por email a los usuarios con capability `can_receive_reports` que lo hayan configurado
- **FR90-E:** Los usuarios con capability `can_receive_reports` pueden descargar manualmente cualquier reporte desde el dashboard en formato PDF, independientemente de la recepción automática por email

#### Dashboard Común con Navegación por Capacidades

- **FR91:** Todos los usuarios acceden al mismo dashboard general con KPIs de la planta (MTTR, MTBF, OTs abiertas, stock crítico) al hacer login, con botones de acceso a módulos según capacidades asignadas. Este dashboard muestra los KPIs básicos visibles para todos.
- **FR91-A:** Los usuarios con capability `can_view_kpis` pueden hacer drill-down (Global → Planta → Línea → Equipo) y ver análisis avanzado. Los usuarios sin esta capability ven los mismos KPIs básicos que FR91 pero no pueden interactuar más allá de la vista general.
- **FR92:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR93:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR94:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)
- **FR95:** ❌ **ELIMINADO** (los dashboards específicos por rol fueron reemplazados por el dashboard común)

#### Diferencia entre "Mis OTs" y "Ver Kanban"

- **"Mis OTs"** (requiere `can_view_own_ots`): Vista propia del usuario con listado de OTs asignadas, con toggle a vista Kanban
- **"Ver Kanban"** (requiere `can_view_all_ots`): Vista de supervisor con todas las OTs del equipo en tablero Kanban de 8 columnas

### 9. Sincronización y Acceso Multi-Dispositivo

- **FR96:** El sistema sincroniza datos entre múltiples dispositivos: <1 segundo para OTs, <30 segundos para KPIs
- **FR97:** Los usuarios pueden acceder desde dispositivos desktop, tablet y móvil
- **FR98:** La interfaz se adapta responsivamente al tamaño de pantalla del dispositivo con 3 breakpoints definidos: >1200px (layout desktop con navegación lateral completa), 768-1200px (layout tablet con navegación simplificada), <768px (layout móvil con navegación inferior y componentes apilados)
- **FR99:** Los usuarios pueden instalar la aplicación en dispositivos móviles como aplicación nativa (PWA)
- **FR100:** Los usuarios reciben notificaciones push en sus dispositivos

### 10. Funcionalidades Adicionales

- **FR101:** Los usuarios con capability `can_create_failure_report` pueden rechazar una reparación si no funciona correctamente después de completada, lo que genera una OT de re-trabajo con prioridad alta
- **FR102:** La búsqueda predictiva está disponible en cualquier campo de búsqueda del sistema (equipos, componentes, repuestos, OTs, técnicos, usuarios) sin requerir capability específica
- **FR103:** ❌ **ELIMINADO** (duplicaba FR91 - dashboard común ya está especificado)
- **FR104:** Los usuarios pueden ver su propio historial de acciones de los últimos 30 días (login, cambios de perfil, acciones críticas). Los usuarios con capability `can_manage_users` pueden ver el historial de acciones de cualquier usuario.
- **FR105:** Cualquier usuario puede configurar sus propias preferencias de notificación por tipo (habilitar/deshabilitar: recibido, autorizado, en progreso, completado)
- **FR106:** Los usuarios con capability `can_update_own_ot` pueden agregar comentarios con timestamp a OTs en progreso asignadas
- **FR107:** Los usuarios con capability `can_update_own_ot` pueden adjuntar fotos antes y después de la reparación en una orden de trabajo asignada
- **FR108:** Los equipos pueden tener código QR asociado para escaneo de identificación (funcionalidad base disponible en MVP; tracking avanzado con cadena de custodia y mapa en tiempo real en Phase 3)

---

**Total: 123 Requerimientos Funcionales** organizados en 10 áreas de capacidad

**NOTA:** El historial completo de ediciones se encuentra en `prd-changelog.md`

**Última edición (2026-03-07):** Validación PRD completada - Rating 4.5/5 EXCELLENT. Aplicando 10 mejoras identificadas en validación.

---

## Non-Functional Requirements

Esta sección define **LOS ATRIBUTOS DE CALIDAD** del sistema: QUÉ BIEN debe performar (no QUÉ debe hacer).

Solo se documentan NFRs relevantes para este producto específico. Cada requerimiento es específico y medible.

### Performance

**¿Por qué importa:** Los operarios y técnicos necesitan respuestas rápidas en ambiente de fábrica. Las demoras causan frustración y abandonment del sistema.

- **NFR-P1:** La búsqueda predictiva de equipos (principal criterio de búsqueda) debe devolver resultados en menos de 200ms. La búsqueda universal (equipos, componentes, repuestos, OTs, técnicos, usuarios) puede extenderse hasta 500ms para consultas complejas multi-campo.
- **NFR-P2:** La carga inicial (first paint) de la aplicación debe completarse en menos de 3 segundos en conexión WiFi industrial estándar
- **NFR-P3:** Las actualizaciones en tiempo real via Server-Sent Events (SSE) deben reflejarse en todos los clientes conectados cada 30 segundos (heartbeat). Nota: SSE es más simple y compatible con Vercel serverless que WebSockets, y cumple los requisitos del producto con actualizaciones cada 30 segundos.
- **NFR-P4:** El dashboard de KPIs debe cargar y mostrar datos en menos de 2 segundos
- **NFR-P5:** Las transiciones entre vistas (p.ej. Kanban ↔ Listado) deben completarse en menos de 100ms
- **NFR-P6:** El sistema debe soportar 50 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta)
- **NFR-P7:** La importación masiva de 10,000 activos debe completarse en menos de 5 minutos

### Security

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

### Scalability

**¿Por qué importa:** Single-tenant para una empresa específica, pero necesita soportar crecimiento de activos y usuarios.

- **NFR-SC1:** El sistema debe soportar hasta 10,000 activos sin degradación de performance. Método de medición: Prueba de carga con JMeter simulando 10,000 activos con consultas concurrentes, verificando tiempos de respuesta <200ms en búsqueda predictiva (NFR-P1)
- **NFR-SC2:** El sistema debe soportar hasta 100 usuarios concurrentes sin degradación de performance (>10% en tiempos de respuesta). Método de medición: Prueba de carga con 100 usuarios simultáneos durante 1 hora usando JMeter o herramienta similar, verificando degradación <10% en NFR-P1 a NFR-P6
- **NFR-SC3:** La base de datos debe estar optimizada con índices para consultas frecuentes (búsqueda de equipos, filtrado de OTs, KPIs). Método de medición: Análisis EXPLAIN query en consultas frecuentes de búsqueda y listado, verificando uso de índices y tiempos de ejecución <50ms para queries críticas
- **NFR-SC4:** El sistema debe implementar paginación para listados grandes (p.ej. más de 100 items por vista). Método de medición: Testing de carga con listados de 100, 500, 1000 items, verificando tiempo de carga <500ms independientemente del tamaño del listado (siempre con paginación)
- **NFR-SC5:** El sistema debe soportar crecimiento a 20,000 activos con ajustes de infraestructura sin cambios de arquitectura. Método de medición: Proyección lineal basada en pruebas de carga con 10,000 activos, certificando que la arquitectura actual permite escalar a 20,000 activos con ajustes de hardware solamente (vertical scaling)

### Accessibility

**¿Por qué importa:** Ambiente industrial con usuarios variados (operarios de línea, técnicos, supervisores, admin). No es público general.

- **NFR-A1:** La interfaz debe cumplir con nivel WCAG AA de contraste (mínimo 4.5:1 para texto normal)
- **NFR-A2:** El tamaño de texto base debe ser mínimo 16px con títulos de 20px o más
- **NFR-A3:** Los elementos interactivos (botones, links) deben tener un tamaño mínimo de 44x44px para facilitar toque en tablets/móviles
- **NFR-A4:** La interfaz debe ser legible en condiciones de iluminación de fábrica (alto contraste, sin dependencia de color solo)
- **NFR-A5:** La aplicación debe ser navegable usando teclado (Tab, Enter, Esc) en desktop y mediante touch targets (44x44px mínimo) en tablets/móviles
- **NFR-A6:** La interfaz debe soportar zoom hasta 200% sin romper el layout

### Reliability

**¿Por qué importa:** El downtime del sistema afecta la operación de fábrica. Si los operarios no pueden reportar averías, se pierden datos críticos.

- **NFR-R1:** El sistema debe tener un uptime objetivo del 99% durante horarios de operación de fábrica (día laboral)
- **NFR-R2:** El sistema debe realizar backups automáticos diarios de la base de datos
- **NFR-R3:** El sistema debe tener un proceso de restore validado con recovery time objetivo (RTO) de 4 horas
- **NFR-R4:** Las conexiones SSE (Server-Sent Events) deben reconectarse automáticamente si se pierde conexión temporal (<30 segundos)
- **NFR-R5:** El sistema debe mostrar mensajes claros de error cuando un servicio no está disponible
- **NFR-R6:** Las operaciones críticas (completar OT, ajustes de stock) deben tener confirmación de éxito antes de considerarlas completadas

### Integration

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



