---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['brainstorming-session-2026-02-25.md', 'brainstorming-session-2026-02-25-ideas-detalladas.md']
date: 2026-02-26
author: Bernardo
workflowType: 'product-brief'
---

# Product Brief: gmao-hiansa

## Executive Summary

**gmao-hiansa** es un GMAO (Gestión de Mantenimiento Asistido por Ordenador) personalizado single-tenant diseñado específicamente para una empresa del sector metal con dos plantas especializadas (acero perfilado y panel sandwich).

La solución transforma un departamento de mantenimiento puramente reactivo que opera con Excel, notas de WhatsApp y una pizarra Kanban física, en una organización profesional, controlada y basada en datos, mediante una aplicación web progresiva (PWA) completamente amoldada a las necesidades reales del negocio.

El MVP establece las bases funcionales fundamentales (aviso de averías, control de activos, generación de OT, control de repuestos, tablero Kanban digital e indicadores de mantenimiento) sobre una arquitectura diseñada para crecimiento progresivo, permitiendo integrar las 35 funcionalidades innovadoras identificadas en el proceso de brainstorming según las necesidades evolutivas del departamento.

---

## Core Vision

### Problem Statement

El departamento de mantenimiento de una empresa del sector metal con dos plantas (acero perfilado y panel sandwich) opera de manera puramente reactiva utilizando herramientas dispersas y no integradas:

- **Excel**: Múltiples versiones sin una "fuente única de verdad"
- **Notas de WhatsApp**: Información fragmentada en celulares personales, difícil de rastrear y que se pierde cuando los colaboradores están ausentes
- **Pizarra Kanban física**: Visibilidad limitada a quienes están físicamente presentes en la planta
- **Falta de historial**: Sin registro estructurado de intervenciones pasadas
- **Sin indicadores**: Imposibilidad de medir y mejorar el desempeño del departamento

### Problem Impact

Este enfoque reactivo genera múltiples costos ocultos:

- **Pérdida de tiempo productivo**: Técnicos buscando información dispersa en lugar de realizar mantenimiento
- **Paradas de producción**: Riesgo de detener la línea por falta de repuestos que se creía tener en stock
- **Fallas recurrentes**: Mismo equipo rompiéndose repetidamente por falta de seguimiento y análisis de causas raíz
- **Dependencia de personas**: Información crítica atrapada en WhatsApp personal de colaboradores
- **Imposibilidad de mejora continua**: Sin datos, no hay métricas; sin métricas, no hay mejora
- **Imagen poco profesional**: Departamento percibido como "caótico" en lugar de organizado y controlado

### Why Existing Solutions Fall Short

**GMAOs del mercado (IBM Maximo, SAP PM, Infraspeak, Fracttal):**

- **Exceso de funcionalidades (bloatware)**: 500+ características que nunca se usarán, pagando por complejidad innecesaria
- **Modelo SaaS multi-tenant**: Diseñados para servir a miles de empresas, no para personalizarse profundamente a UN caso específico
- **Curva de aprendizaje alta**: Requieren semanas de formación y manuales extensos
- **Costo prohibitivo**: Licencias caras con funcionalidades innecesarias para una empresa de metal específica
- **Rigidez**: "Adáptate a nuestro flujo" en lugar de "nosotros nos adaptamos a tu flujo"
- **Desconexión con la realidad**: Diseñados por consultores que nunca han trabajado en mantenimiento de planta metalúrgica

### Proposed Solution

**gmao-hiansa** es un GMAO **personalizado, single-tenant y progresivo** diseñado específicamente para una empresa del sector metal con dos plantas especializadas:

**Arquitectura:**
- **Single-tenant optimizado**: Instalación dedicada para una sola empresa, permite personalización profunda
- **PWA (Progressive Web App)**: Misma base de código para desktop y móvil, responsive, instalable en cualquier dispositivo
- **Progresivo**: MVP con bases sólidas → integración incremental de funcionalidades según necesidad

**MVP - Funcionalidades Fundamentales:**
1. **Generación de aviso de averías**: Sistema estructurado para reporte de fallas (reemplaza notas de WhatsApp)
2. **Control de activos**: Gestión jerárquica de equipos de ambas plantas (acero perfilado + panel sandwich)
3. **Generación de OT**: Creación rápida y eficiente de órdenes de trabajo
4. **Control de repuestos**: Inventario de materiales con trazabilidad
5. **Tablero Kanban digital**: Reemplazo de la pizarra física con asignación visual de trabajos
6. **Indicadores de mantenimiento**: Métricas para medir y mejorar el desempeño del departamento

**Hoja de Ruta Progresiva:**
El MVP establece las fundamentales sobre las cuales se integrarán las 35 ideas innovadoras del brainstorming (SCAMPER, First Principles, Reverse Brainstorming, Six Thinking Hats) en fases posteriores, incluyendo: dashboards avanzados, predicción sin IoT, stock de equipos reparables, gestión de proveedores externos, y más.

### Key Differentiators

**1. Personalización Total**
- **No adaptables, sino amoldables**: La herramienta se adapta completamente al flujo real de la empresa, no al revés
- **Hecho para la realidad**: Diseñado para 2 plantas metalúrgicas específicas (acero perfilado + panel sandwich), no para un mercado genérico

**2. Progresividad Inteligente**
- **MVP enfocado**: Bases sólidas sin complejidad innecesaria desde el inicio
- **Crecimiento orgánico**: Nuevas funcionalidades se añaden según las necesidades reales del departamento, no según un roadmap de producto genérico
- **Sin sobrecarga inicial**: Usuarios no se abruman con 50 funcionalidades que no usarán

**3. Arquitectura Single-Tenant Optimizada**
- **Sin multi-tenant**: No pagas por infraestructura escalable para miles de empresas
- **Personalización profunda**: Posibilidad de adaptar estructura, flujos, y campos a necesidades específicas
- **Control total**: La empresa posee su instancia, su datos y su configuración

**4. Enfoque PWA**
- **Una sola app**: Desktop y móvil con el mismo código base
- **Ahorro de desarrollo**: No requiere desarrollar dos apps separadas (web + nativa)
- **Accesibilidad**: Funciona en cualquier navegador, instalable en cualquier dispositivo

**5. Diseñado por quien entiende el problema**
- **No teoría de escritorio**: Solución basada en la experiencia real de operación con Excel + WhatsApp + pizarra
- **Conexión con el usuario**: Desarrollado en colaboración directa con el departamento que lo usará
- **Validación continua**: Feedback constante con los usuarios reales del sistema

**6. Profesionalización del Departamento**
- **De reactivo a proactivo**: Sistema que permite planificar, no solo apagar fuegos
- **Cultura de datos**: Métricas e indicadores que fundamentan decisiones
- **Imagen organizada**: Herramientas profesionales que proyectan seriedad y control

---

## Target Users

### Primary Users

#### 1. Operarios de Línea / Producción (Ej: "Carlos" - 25 años)

**Perfil:**
- Trabajadores jóvenes en planta (acero perfilado + panel sandwich)
- Conocimientos básicos de tecnología (usan redes sociales, WhatsApp, apps simples)
- Tienen desktop en su puesto y smartphone personal
- Realizan tareas de producción y rutinas básicas de mantenimiento (orden, limpieza, engrasado)

**Rol en el sistema:**
- Reportan averías cuando algo falla en su puesto de trabajo
- Tienen asignadas rutinas de mantenimiento sencillas según su puesto (ej: perfiladora)
- Necesitan visibilidad del estado de sus reportes
- Vinculados a equipos específicos de su línea de producción

**Problema actual:**
- Reportan fallas por WhatsApp y nunca saben si alguien leyó el mensaje
- Sienten frustration: "Reporto lo mismo cada semana y nunca se arregla de verdad"
- No tienen visibilidad de cuándo vendrán a arreglar su equipo
- Se sienten ignorados: "¿Para qué reporto si no hacen caso?"

**Éxito con gmao-hiansa:**
- Reportan avería desde móvil en segundos con búsqueda predictiva de equipos
- Reciben notificación inmediata: "Aviso recibido - Evaluando prioridad"
- Pueden ver estado de su aviso en tiempo real (Pendiente → Autorizado → En Proceso → Resuelto)
- Al solucionarse, reciben confirmación y pueden validar que el equipo funciona bien
- **"Siento que me escuchan y que mi trabajo importa"**

**Necesidades clave:**
- Interfaz muy simple (conocimientos tech básicos)
- Rapidez (reportar en <30 segundos)
- Feedback inmediato (notificaciones)
- Visibilidad de estado

---

#### 2. Técnicos de Mantenimiento (Ej: "María" - 28 años)

**Perfil:**
- Técnicos con experiencia en ambas plantas
- Conocimientos tech medios (usan apps de trabajo sin problema)
- Usan móvil en campo, tablet para ver detalles de OT, desktop por la mañana para planificar
- Conocen bien los equipos y procesos de mantenimiento

**Rol en el sistema:**
- Ejecutan órdenes de trabajo (OTs)
- Tienen asignadas rutinas semanales de mantenimiento
- Actualizan estado de OTs en tiempo real
- Registran repuestos utilizados en cada intervención
- Pueden crear OTs manualmente si tienen capacidad

**Problema actual:**
- Llegan la mañana sin saber claro qué tienen que hacer
- Tiene que preguntar al supervisor: "¿Qué tengo hoy?"
- A veces llegan a un equipo y ya está arreglado por otro técnico (duplicación)
- No saben qué repuestos necesitan antes de ir al equipo
- Se sienten desorganizados: "Voy corriendo de un lado a otro sin plan"

**Éxito con gmao-hiansa:**
- Abren la app por la mañana: ven su lista de OTs priorizada
- Cada OT tiene: equipo, problema, repuestos necesarios, ubicación, tiempo estimado
- Pueden ver historial del equipo: "Esto ya falló la semana pasada, cambié rodamiento"
- Al completar OT, marcan completado y sistema actualiza stock automáticamente
- **"Trabajo de forma profesional, organizada y eficiente"**

**Necesidades clave:**
- Vista clara de trabajo asignado (lista diaria)
- Detalles completos de cada OT (qué, dónde, cómo, con qué)
- Historial de equipos para aprender de intervenciones previas
- Actualización rápida de estado (móvil en campo)

---

#### 3. Supervisores de Mantenimiento (Ej: "Javier" - 32 años)

**Perfil:**
- Supervisores de turno que gestionan equipo de técnicos
- Conocimientos tech buenos
- Usan desktop principalmente, móvil para urgencias
- Necesitan visión clara de carga de trabajo de su equipo

**Rol en el sistema:**
- Reciben y evalúan avisos de avería
- Deciden qué avisos se convierten en OTs (triage)
- Asignan OTs a técnicos según carga y especialidad
- Controlan progreso de trabajos en tiempo real
- Gestionan el día a día del departamento

**Problema actual:**
- Reciben WhatsApps de 10 personas con info desordenada
- No saben qué técnico está libre u ocupado en tiempo real
- Tienen que llamar a cada uno para asignar trabajo
- A veces sobrecargan a un técnico mientras otro está ocioso
- Se sienten abrumados: "Voy apagando fuegos todo el día, no puedo planificar"

**Éxito con gmao-hiansa:**
- Tablero Kanban digital: columnas (Avisos Pendientes → Triage → OTs Pendientes → En Progreso → Completadas)
- Arrastran OT al técnico adecuado según carga de trabajo visible
- Reciben alertas: "Técnico Pedro tiene 8 OTs, Laura solo 2 - reasignar"
- Pueden ver aviso de avería, evaluar prioridad y convertir en OT con 2 clics
- Ven dashboard de carga de trabajo de todo su equipo
- **"Tengo control de mi equipo y distribuyo el trabajo eficientemente"**

**Necesidades clave:**
- Visibilidad total de carga de trabajo del equipo
- Capacidad de triage rápido (evaluar y decidir)
- Asignación visual y fácil (drag-and-drop)
- Alertas de desbalance de carga

---

#### 4. Administrador / Jefe de Mantenimiento (Ej: "Elena" - 38 años)

**Perfil:**
- Jefa del departamento de mantenimiento
- Conocimientos tech buenos, no experta en datos
- Usa desktop en su oficina
- Necesita reportar a dirección

**Rol en el sistema:**
- Gestión total del sistema
- Configura capacidades y permisos de usuarios
- Autoriza qué personas gestionan stock de repuestos
- Ve indicadores/KPIs para toma de decisiones
- Genera reportes para dirección

**Problema actual:**
- No tiene indicadores reales: dirección pregunta "¿Cómo estamos?" y no sabe
- Tiene que buscar en 3 Excel diferentes para obtener información
- No sabe cuánto cuesta el mantenimiento mensual
- No puede predecir: ¿Necesitaremos más técnicos el próximo mes?
- Se siente insegura: "No tengo datos para fundamentar decisiones"

**Éxito con gmao-hiansa:**
- Dashboard principal con KPIs en tiempo real (MTTR, MTBF, OTs abiertas/completadas, técnicos activos, costos)
- Compara métricas: mes actual vs mes anterior, tendencia
- Dashboard público en la fábrica: todos ven KPIs (transparencia → profesionalización)
- Alertas automáticas: "Stock repuesto crítico", "MTTR subió 20% este mes"
- Autoriza gestores de stock con un clic
- **"Tengo todo bajo control y tomo decisiones basadas en datos"**

**Necesidades clave:**
- Dashboard ejecutivo con KPIs clave
- Comparativas y tendencias
- Alertas automáticas de desviaciones
- Reportes listos para dirección
- Control de permisos y autorizaciones

---

### Secondary Users

#### 5. Gestores de Stock de Repuestos (Ej: "Pedro" - 35 años)

**Perfil:**
- Administrativos autorizados por admin para gestionar stock
- Responsables de almacén de repuestos
- Usan desktop y tablet para inventario

**Rol en el sistema:**
- Gestionan inventario de repuestos
- Actualizan stock (entradas/salidas)
- Reciben alertas de stock mínimo
- Generan órdenes de reordenamiento

**Problema actual:**
- No saben qué repuestos hay en stock (Excel desactualizado)
- A veces piden repuesto que ya tenían (duplicación de compra)
- Técnicos les piden cosas por WhatsApp y se pierden mensajes
- No hay alertas de stock mínimo

**Éxito con gmao-hiansa:**
- Ven stock en tiempo real de cada repuesto
- Alertas automáticas: "Stock mínimo: 3 unidades - reordenar"
- Cuando técnico usa repuesto en OT, sistema descuenta automáticamente
- Pueden ver histórico: "Este repuesto se usa 5 veces por mes"
- **"Tengo control total del inventario y nunca me quedo sin lo necesario"**

---

#### 6. Público General (Toda la Fábrica)

**Perfil:**
- Todos los trabajadores de la fábrica (producción, administración, dirección)
- No interactúan con el sistema, solo consumen información

**Rol en el sistema:**
- Ven dashboard público tipo "escaparate" en área común
- Acceden a KPIs del departamento de mantenimiento

**Impacto:**
- Transparencia: todos ven el trabajo de mantenimiento
- Profesionalización: imagen organizada vs caótica
- Confianza: ven que problemas se atienden
- Cultura de datos: métricas visibles generan consciencia de mejora continua

---

### User Journey

#### Journey de Carlos - Operario de Línea (25 años)

**Descubrimiento:**
- Llega al trabajo, Elena anuncia: "Tenemos nueva app de mantenimiento"
- Recibe breve demo de 3 minutos en su puesto
- Escanea QR o sigue enlace para instalar PWA en su móvil

**Onboarding:**
- Abre app por primera vez
- Tutorial simple de 30 segundos: "Reporta avería en 3 pasos"
  1. Selecciona equipo (búsqueda predictiva)
  2. Describe problema
  3. Enviar
- Prueba reportando avería de prueba para familiarizarse

**Core Usage - Día típico:**
- **09:00** - Su perfiladora falla (deja de avanzar, hace ruido extraño)
- **09:01** - Saca móvil, abre app gmao-hiansa
- **09:02** - Toca "Reportar Avería", escribe "perfiladora" en búsqueda predictiva
- **09:02** - Sistema sugiere "Perfiladora P-201" (la selecciona)
- **09:03** - Describe: "No avanza, hace ruido extraño, vibración rara"
- **09:03** - Toca "Enviar" → App confirma: "✓ Aviso #AV-234 recibido - Evaluando prioridad"

**El momento "¡Aha!" (Valor percibido):**
- **10:15** - Recibe notificación push: "Tu aviso #AV-234 fue autorizado - OT #OT-567 asignada a María"
- Carlos piensa: "¡Wow! Esto funciona de verdad. Me escucharon. No es como WhatsApp que nadie contesta."
- **11:30** - Recibe notificación: "OT #OT-567 en progreso - María está trabajando en tu equipo"
- **12:15** - Recibe notificación: "OT #OT-567 completada - ¿Confirma que su perfiladora funciona bien?"
- Carlos toca "Sí, funciona bien" → App: "Gracias por tu reporte. Ayudas a mejorar la planta."

**Long-term (Uso continuado):**
- App se vuelve parte de su rutina diaria
- Reporta averías sin pensar, es natural y rápido
- Ve que sus reportes se atienden rápidamente
- Siente que su voz importa en la organización
- Cuando compañeros se quejan de otros sistemas, Carlos dice: "Con la app de mantenimiento es súper rápido, te lo arreglan enseguida"

---

#### Journey de María - Técnica de Mantenimiento (28 años)

**Descubrimiento:**
- Asiste a reunión de equipo donde Elena presenta la app
- Recibe demo de características principales
- Instala PWA en su móvil y tablet

**Onboarding:**
- Primer login: ve tutorial de 1 minuto
- Configura su perfil: habilidades, especialidades
- Recibe primeras OTs de prueba para familiarizarse

**Core Usage - Día típico:**
- **07:45** - Llega 15 min antes, abre app en desktop
- Ve su lista del día: 5 OTs asignadas, 2 rutinas
- Cada OT muestra: equipo, ubicación (planta acero/perfil), problema, repuestos necesarios
- **08:00** - Inicia primera OT, marca "En progreso" en su tablet
- Trabajando en campo, necesita repuesto: abre app, ve stock disponible
- **10:30** - Completa OT, registra repuestos usados, marca "Completado"
- Sistema actualiza stock automáticamente, supervisor ve OT completada
- **14:00** - Recibe nueva OT asignada por supervisor (notificación push)

**Momento "¡Aha!":**
- Después de 2 semanas: "¿Cómo hacíamos antes sin esto? Todo es tan organised. Llego y ya sé qué tengo que hacer. No corro de un lado a otro preguntando."

**Long-term:**
- App es indispensable para su trabajo
- Siente que trabaja de forma profesional
- Ve su productividad aumentar
- Puede demostrar su trabajo (OTs completadas, tiempo promedio)

---

## Success Metrics

### User Success Metrics

Las métricas de éxito del usuario se enfocan en **comportamientos observables** y **resultados medibles**, no solo en satisfacción subjetiva.

#### Para Operarios de Línea (Carlos)

**Outcome deseado:** Sentirse escuchado y ver que sus averías se atienden

**Métricas de éxito:**
- **Tasa de reporte de averías:** Número de averías reportadas por operario/semana (meta: aumentar vs línea base actual)
- **Tiempo de reporte:** Tiempo promedio desde que detectan falla hasta que reportan en app (meta: <5 minutos)
- **Tasa de conversión a OT:** % de avisos que se convierten en OTs autorizadas (meta: >70% - indica que reportes son válidos)
- **Feedback recibido:** % de avisos que reciben notificación de estado (meta: 100% - transparencia total)

**Comportamiento que indica éxito:**
- Operarios reportan averías sistemáticamente en la app en lugar de WhatsApp
- Dejan de quejarse de "nadie hace caso a mis reportes"
- Recomendación entre pares: "Usa la app, así sí te hacen caso"

#### Para Técnicos de Mantenimiento (María)

**Outcome deseado:** Trabajo organizado, clara visibilidad de tareas

**Métricas de éxito:**
- **Adopción de app:** % de técnicos que abren la app diariamente (meta: 100% en primer mes)
- **OTs completadas:** Número de OTs completadas por técnico/semana (línea base a establecer)
- **Tiempo de primera OT:** Tiempo desde que llegan hasta que inician primera OT (meta: <15 minutos - no pierden tiempo preguntando)
- **Actualización de estado:** % de OTs con estado actualizado en tiempo real (meta: >90%)

**Comportamiento que indica éxito:**
- Técnicos abren la app cada mañana como primer acción
- Actualizan OTs en campo desde móvil/tablet
- Dicen: "¿Cómo hacíamos antes sin esto?"

#### Para Supervisores (Javier)

**Outcome deseado:** Control de carga de trabajo de equipo

**Métricas de éxito:**
- **Uso de tablero Kanban:** Frecuencia de acceso al tablero (meta: múltiples veces por turno)
- **Balanceo de carga:** Desviación estándar de OTs por técnico (meta: <2 OTs de diferencia - equipo equilibrado)
- **Triage time:** Tiempo promedio desde aviso hasta decisión (autorizar/desestimar) (meta: <2 horas)
- **Asignación visual:** % de OTs asignadas vía drag-and-drop en tablero (meta: >80%)

**Comportamiento que indica éxito:**
- Supervisores gestionan visualmente, no llaman a técnicos para asignar trabajo
- Reciben alertas de desbalance y actúan proactivamente
- Tienen visión clara de "qué está pasando" en tiempo real

#### Para Administrador (Elena)

**Outcome deseado:** Datos para toma de decisiones y reporte a dirección

**Métricas de éxito:**
- **Revisión de KPIs:** Frecuencia de acceso a dashboard de indicadores (meta: semanal)
- **Generación de reportes:** Número de reportes generados para dirección (meta: mensual)
- **Alertas accionables:** % de alertas que resultan en acción correctiva (meta: >70% - alertas útiles, no ruido)
- **Sentimiento de control:** Cualitativo - "Tengo datos para responder a dirección"

**Comportamiento que indica éxito:**
- Revisa dashboard semanalmente para identificar tendencias
- Reporta a dirección con datos concretos, no estimaciones
- Toma decisiones basadas en métricas, no intuición

---

### Business Objectives

#### Corto Plazo (3 meses post-lanzamiento MVP)

**Adopción del sistema:**
- **Meta:** 100% de usuarios registrados y activos en el sistema
- **Métrica:** % de usuarios que han hecho login y completado onboarding
- **Éxito:** Sistema se usa rutinariamente, no es "otra app que nadie usa"

**Migración desde canales antiguos:**
- **Meta:** 90% de averías reportadas via app, no WhatsApp
- **Métrica:** % de averías reportadas por app vs canales informales
- **Éxito:** App es el canal único y confiable para reportes

**Establecimiento de línea base:**
- **Meta:** Primeros datos históricos de MTTR y MTBF capturados
- **Métrica:** Número de OTs completadas con datos suficientes para calcular KPIs
- **Éxito:** "Por primera vez, TENEMOS DATOS"

#### Mediano Plazo (6-12 meses post-lanzamiento)

**Profesionalización del departamento:**
- **Meta:** Imagen del departamento transformada de "caótico" a "profesional"
- **Métrica:** Percepción cualitativa de otros departamentos (encuesta informal)
- **Éxito:** Dashboard público genera transparencia y confianza

**Transición a mantenimiento proactivo:**
- **Meta:** Aumento de rutinas preventivas vs correctivas
- **Métrica:** % de OTs preventivas vs correctivas (línea base a establecer)
- **Éxito:** Menos apagar fuegos, más prevenir fallos

**Mejora continua basada en datos:**
- **Meta:** Decisiones de mantenimiento fundamentadas en métricas
- **Métrica:** Número de decisiones con referencia a KPIs (ej: "Este equipo tiene MTBF bajo, programamos mantenimiento específico")
- **Éxito:** Cultura de datos establecida

#### Largo Plazo (12+ meses)

**Reducción de costos:**
- **Meta:** Mantener o reducir costo de mantenimiento con mejor cobertura
- **Métrica:** Costo de mantenimiento/producción (tendencia decreciente o estable)
- **Éxito:** Eficiencia mejorada

**Reducción de downtime:**
- **Meta:** Menos paradas de producción por fallas de equipos
- **Métrica:** Horas de parada por fallas/mes (tendencia decreciente)
- **Éxito:** Producción más confiable

---

### Key Performance Indicators

#### KPIs Core de Mantenimiento

**1. MTTR (Mean Time To Repair - Tiempo Promedio de Reparación)**

*Definición:* Tiempo promedio desde que se reporta avería hasta que la OT está completada y validada.

**Cálculo:** Σ(Tiempo total de cada OT resuelta) / Número de OTs resueltas

**Desglose por nivel:**
- **Global:** Toda la empresa (ambas plantas)
- **Por planta:** Planta Acero Perfilado vs Planta Panel Sandwich
- **Por línea:** Cada línea de producción dentro de cada planta
- **Por equipo:** Cada equipo individual (ej: Perfiladora P-201)

**Objetivo:**
- **Línea base:** Por establecer (datos no disponibles pre-sistema)
- **Meta a 6 meses:** Reducción del 20% vs línea base (una vez establecida)
- **Meta a 12 meses:** Reducción del 35% vs línea base

**Frecuencia de reporte:** Mensual (dashboard muestra tiempo real)

**Responsable:** Administrador - reporta a dirección

---

**2. MTBF (Mean Time Between Failures - Tiempo Promedio Entre Fallos)**

*Definición:* Tiempo promedio entre fallos de un equipo específico.

**Cálculo:** Σ(Tiempo entre fallos consecutivos) / Número de fallos

**Desglose por nivel:**
- **Global:** Toda la empresa
- **Por planta:** Planta Acero Perfilado vs Planta Panel Sandwich
- **Por línea:** Cada línea de producción
- **Por equipo:** Cada equipo individual (crítico para identificar equipos problemáticos)

**Objetivo:**
- **Línea base:** Por establecer
- **Meta a 6 meses:** Aumento del 15% vs línea base (equipos más confiables)
- **Meta a 12 meses:** Aumento del 30% vs línea base

**Frecuencia de reporte:** Mensual

**Responsable:** Administrador - identifica equipos con MTBF bajo para intervención

---

#### KPIs Complementarios

**3. Productividad de Técnicos**

- **Métrica:** OTs completadas por técnico por semana
- **Desglose:** Por técnico, por planta, por especialidad
- **Objetivo:** Línea base a establecer, meta aumentar 10% en 6 meses

**4. Calidad de Triage**

- **Métrica:** % de avisos que se convierten en OTs autorizadas
- **Desglose:** Por planta, por línea, por tipo de avería
- **Objetivo:** >70% (indica que reportes son válidos y útiles)

**5. Stock de Repuestos**

- **Métrica:** % de OTs retrasadas por falta de repuestos
- **Desglose:** Por tipo de repuesto, por planta
- **Objetivo:** <5% (stock bien gestionado)

**6. Costo de Mantenimiento**

- **Métrica:** Costo total de mantenimiento / Unidades producidas
- **Desglose:** Por planta, por línea
- **Objetivo:** Mantener o reducir ratio (eficiencia)

**7. Carga de Trabajo del Equipo**

- **Métrica:** OTs abiertas vs OTs en progreso vs OTs completadas
- **Desglose:** Por técnico, por planta
- **Objetivo:** Balanceo: desviación estándar <2 OTs entre técnicos

---

#### Métricas de Adopción del Sistema

**8. Usuarios Activos**

- **Métrica:** % de usuarios registrados que han hecho login en última semana
- **Objetivo:** >90% de usuarios activos semanalmente

**9. Reportes vía App**

- **Métrica:** % de averías reportadas por app vs canales informales (WhatsApp, verbal)
- **Objetivo:** >90% vía app a los 3 meses

**10. Tiempo de Reporte**

- **Métrica:** Tiempo promedio desde detección de falla hasta reporte en app
- **Objetivo:** <5 minutos (rapidez = datos completos)

---

## MVP Scope

### Core Features

El MVP de gmao-hiansa establece las bases funcionales fundamentales sobre una arquitectura diseñada para crecimiento progresivo. Las 12 funcionalidades del MVP se integran para crear un sistema completo de gestión de mantenimiento.

---

#### 1. Generación de Aviso de Averías

**Objetivo:** Sistema estructurado para reporte de fallas que reemplaza notas de WhatsApp.

**Funcionalidades MVP:**
- ✅ Búsqueda predictiva de equipos (autocompletado mientras escribe)
- ✅ Campo de texto libre para describir problema
- ✅ Confirmación inmediata con número de aviso
- ✅ Estados del aviso: Triage → Pendiente de Asignar → (Convertido en OT o Desestimado)

**Flujo:**
1. Usuario selecciona equipo (búsqueda predictiva sugiere coincidencias)
2. Describe problema en texto libre
3. Envía aviso
4. Recibe confirmación: "Aviso #AV-XXX recibido - Evaluando"

**Fuera del MVP (post-MVP):**
- ❌ Subir fotos de avería
- ❌ Seleccionar urgencia (supervisor hace triage)
- ❌ Categoría de avería (eléctrica/mecánica/hidráulica)
- ❌ Geolocalización (GPS)

---

#### 2. Control de Activos

**Objetivo:** Gestión jerárquica de equipos de ambas plantas con historial completo.

**Funcionalidades MVP:**
- ✅ **Jerarquía 5 niveles:** Planta → Línea → Equipo → Componente → Repuesto
  - Planta: Acero Perfilado / Panel Sandwich
  - Línea: Línea 1, Línea 2, etc.
  - Equipo: Perfiladora P-201, Prensa PH-500, etc.
  - Componente: Motor, Rodamiento, Bomba, etc.
  - Repuesto: Rodamiento SKF-6208, Bobina, etc.

- ✅ **Datos básicos del equipo:**
  - Nombre
  - Código único
  - Ubicación (Planta + Línea)
  - Estado (Activo / Inactivo)
  - **Familia de equipo** (Bombas, Motores, Compresores, Prensas, Perfiladoras...)
  - **Manuales/planos adjuntos** (PDF, imágenes)

- ✅ **Historial de OTs por equipo:**
  - Lista completa de todas las OTs asociadas
  - Fecha y descripción de cada intervención
  - Permite aprender de fallas previas

**Fuera del MVP (post-MVP):**
- ❌ Atributos personalizados por equipo (potencia, voltaje, presión)
- ❌ Foto del equipo
- ❌ Plantillas de equipos (para crear múltiples equipos iguales)

---

#### 3. Generación de Órdenes de Trabajo (OT)

**Objetivo:** Creación y gestión de órdenes de trabajo que ejecutan los técnicos.

**Tipos de OT:**
- ✅ **Correctivas:** Respuesta a averías (flujo completo en MVP)
- ✅ **Preventivas:** Marcador básico en MVP (desarrollo completo post-MVP)

**Estados del Ciclo de Vida (8 estados):**
1. **Triage** - Aviso recibido, evaluando prioridad
2. **Pendiente de Asignar** - OT creada, sin técnico asignado
3. **En Progreso** - Técnico asignado, reparación se realizará en breve
4. **Pendiente de Repuesto** - Esperando material
5. **Pendiente de Parada de Línea** - Necesita ventana de mantenimiento
6. **Esperando Reparación Externa** - Enviada a proveedor externo
7. **Completada** - Trabajo terminado y validado
8. **Desestimada** - Aviso descartado (no procede)

**Prioridades:**
- 🔴 Urgente
- 🟡 Media
- 🟢 Baja

**Funcionalidades MVP:**
- ✅ Crear OT desde aviso de avería (conversión)
- ✅ Crear OT manualmente (por técnico/supervisor)
- ✅ Asignar a técnico
- ✅ Descripción del trabajo
- ✅ **Repuestos usados en OT** (actualiza stock automáticamente)
- ✅ **Tipo de OT:** Correctiva / Preventiva (marcador básico)
- ✅ Transiciones entre estados (manuales y automáticas)

**Transición automática:**
- Cuando OT está en "Pendiente de Repuesto" y se da entrada al repuesto → Cambia automáticamente a "En Progreso"
- Aparece icono **⚠️** en esquina de tarjeta hasta que alguien hace acknowledge (toca el icono)

**Fuera del MVP (post-MVP):**
- ❌ Planificación automática de preventivas por calendario
- ❌ Generación de preventivas desde historial de fallas
- ❌ Tiempo estimado / Fecha límite

---

#### 4. Control de Repuestos

**Objetivo:** Gestión completa de inventario de repuestos con proveedores y pedidos.

**Funcionalidades MVP:**

**Catálogo de Repuestos:**
- ✅ Nombre
- ✅ Código único
- ✅ Stock actual (cantidad)
- ✅ Ubicación en almacén
- ✅ Unidad de medida
- ✅ **Costo unitario**
- ✅ **Stock mínimo** (umbral para alertas)

**Gestión de Proveedores de Repuestos:**
- ✅ Nombre del proveedor
- ✅ Contacto (teléfono, email)
- ✅ **Más de un contacto por proveedor**
- ✅ Especialidad (qué tipo de repuestos suministra)
- ✅ **Tiempo de entrega promedio**

**Pedidos a Proveedores:**
- ✅ **Crear pedido:**
  - Seleccionar proveedor
  - Seleccionar múltiples repuestos en un mismo pedido
  - Cantidad solicitada
  - Fecha de pedido

- ✅ **Estados del pedido:**
  - Pendiente (pedido realizado, esperando entrega)
  - Parcialmente Recibido (recibí algunos items)
  - Recibido (material completo llegado)

- ✅ **Entrada de pedido:**
  - Marcar pedido como recibido
  - Validar cantidad recibida vs solicitada
  - Justificación por diferencias (más o menos cantidad)
  - Stock actualiza automáticamente

**Actualización de Stock:**
- ✅ Entradas: compras, devoluciones, ajustes
- ✅ Salidas: uso en OT, ajustes
- ✅ **Validación:** Si stock es 0, permite marcar pero envía alerta y deja stock en negativo

**Alertas:**
- ✅ Alerta de stock mínimo (visual)
- ✅ Alerta automática si técnico marca repuesto usado pero stock insuficiente

**Fuera del MVP (post-MVP):**
- ❌ Historial completo de movimientos (quién, cuándo, por qué)
- ❌ Stock máximo (solo mínimo en MVP)

---

#### 5. Tablero Kanban Digital

**Objetivo:** Visualización y gestión en tiempo real de todas las OTs y avisos.

**Sistema Multi-Dispositivo Sincronizado:**
- ✅ **Tablet/Móvil:** Supervisor/admin/usuarios con capacidad "organizar OT" mueven tarjetas
- ✅ **TV (Usuario especial "modo reunión"):** Solo visualización
  - Muestra KPIs en modo normal
  - Muestra Kanban en "modo reunión"
- ✅ Sincronización en tiempo real (websockets, refresco 30-60 segundos)

**Columnas del Kanban (8 total):**

| # | Columna | Estado | Descripción |
|---|---------|--------|-------------|
| 1 | Pendientes de Triage | Triage | Avisos nuevos + OTs manuales sin evaluar |
| 2 | En Progreso | En Progreso | Técnico asignado, reparación próxima |
| 3 | Esperando Repuesto | Pendiente Repuesto | Bloqueadas por material |
| 4 | Esperando Parada de Línea | Pendiente Parada | Necesitan ventana de mantenimiento |
| 5 | Reparación Externa (Equipos) | Reparación Externa | Equipos completos en proveedor externo |
| 6 | Reparación de Repuestos | Reparación Repuesto | Repuestos en reparación (int/externo) |
| 7 | Completadas | Completada | Trabajo terminado |
| 8 | Descartadas | Desestimada | Avisos no procedentes |

**Marcas Visuales en Tarjetas:**
- ✅ **Marcador de color por prioridad:** 🔴 Urgente / 🟡 Media / 🟢 Baja
- ✅ **Marca de agua "EX"** para reparaciones externas (equipos y repuestos)
- ✅ **Icono ⚠️** cuando llega repuesto esperado (permanece hasta acknowledge)
- ✅ Información en tarjeta:
  - Prioridad (marcador de color)
  - Equipo a reparar
  - Técnico asignado
  - Número de OT
  - Fecha de creación (antigüedad)
  - Descripción breve del problema
  - Marca EX si es externo

**Transiciones:**
- ✅ Usuarios con capacidad "organizar OT" pueden mover tarjetas
- ✅ Transición automática: "Esperando Repuesto" → "En Progreso" cuando llega repuesto
- ✅ Técnico puede mover sus OTs a "Completada"

---

#### 6. Indicadores de Mantenimiento (KPIs)

**Objetivo:** Dashboards con MTTR, MTBF y métricas clave para toma de decisiones.

**KPIs Core:**
- ✅ **MTTR (Mean Time To Repair)** con drill-down: Global → Planta → Línea → Equipo
- ✅ **MTBF (Mean Time Between Failures)** con drill-down: Global → Planta → Línea → Equipo

**Refresco automático:**
- ✅ Cada 30-60 segundos
- ✅ Sin polling (websockets para actualización push)

**Dashboard Público (TV - Modo Reunión):**
*Público: Toda la fábrica (transparencia)*
- ✅ MTTR global (este mes)
- ✅ MTBF global (este mes)
- ✅ OTs abiertas hoy
- ✅ Técnicos activos ahora
- ✅ Avisos pendientes de triage
- ✅ **KPIs de Rutinas:** % de rutinas completadas hoy

**Dashboard Privado (Admin):**
*Público: Administrador/Elena*
- ✅ MTTR/MTBF con drill-down completo
- ✅ OTs por estado (conteo: pendientes, en progreso, completadas)
- ✅ Productividad por técnico (OTs completadas/semana)
- ✅ Costo de mantenimiento mensual
- ✅ Stock crítico de repuestos (debajo del mínimo)
- ✅ KPIs de rutinas (detalle por usuario)
- ✅ **Exportar a Excel** (todos los KPIs)

**Visualización:**
- ✅ Números grandes con etiquetas claras
- ✅ Código de color para estados críticos (rojo si MTTR sube, verde si baja)
- ✅ Tendencias (flecha ↑↓ vs mes anterior)

---

#### 7. PWA (Progressive Web App)

**Objetivo:** Misma base de código para desktop, tablet y móvil.

**Funcionalidades MVP:**
- ✅ **Responsive design** (se adapta a cualquier pantalla)
- ✅ **Instalable** en cualquier dispositivo
- ✅ **Una sola app** (no desarrollar app nativa separada)
- ✅ **Notificaciones push** (avisos de averías, cambios en OT, alertas)
- ✅ Funciona offline (parcialmente)

**Fuera del MVP:**
- ❌ Cámara
- ❌ Geolocalización

---

#### 8. Stock de Equippos Completos Reutilizables

**Objetivo:** Gestión de inventario de equipos completos (bombas, motores) que se instalan/retiran/reparan.

**Estados del Equipo:**
- ✅ Disponible (en stock, listo para instalar)
- ✅ En Uso (instalado y operando)
- ✅ En Taller Interno (retirado, reparación interna)
- ✅ En Taller Externo (enviado a proveedor)
- ✅ Reparado (reparado, vuelve a disponible)

**Flujo Circular:**
```
Disponible → Se instala → En Uso → Falla → Se retira
→ Taller (Interno/Externo) → Reparado → Disponible
```

**Doble Inventario:**
- ✅ **Equipos Sustituibles:** Equipos completos (bombas, motores) que se reutilizan
- ✅ **Repuestos Específicos:** Componentes (rodamientos, bobinas) que se consumen

**Funcionalidades MVP:**
- ✅ Registro de cuándo se instala un equipo
- ✅ Registro de cuándo se retira un equipo
- ✅ Listado de equipos en taller (estado intermedio)
- ✅ Decisión: OT interna o enviar a proveedor externo
- ✅ Recepción de material reparado (externo): cambia estado "En Taller Externo" → "Disponible"

---

#### 9. Ciclo de Reparación Dual Interna/Externa

**Objetivo:** Equipos reparables pueden ir a taller interno o proveedor externo.

**Opciones cuando se retira equipo:**
1. ✅ **Reparación interna:** Crear OT interna → Taller propio
2. ✅ **Reparación externa:** Enviar a proveedor externo

**Decisión:**
- ✅ Admin o Supervisor decide (internas vs externas)

**Registro de Recepción:**
- ✅ Cuando proveedor externo termina reparación
- ✅ Admin registra: "Recepción de material reparado confirmado"
- ✅ Cambia estado: "En Taller Externo" → "Disponible"

---

#### 10. Proveedores Externos de Mantenimiento

**Objetivo:** Gestión de talleres externos que reparan equipos.

**Dos Listas de Proveedores:**
- ✅ **Proveedores de mantenimiento** (talleres que reparan equipos) - NUEVO
- ✅ **Proveedores de repuestos** (venden componentes) - Ya definido en funcionalidad 4

**Información del Proveedor de Mantenimiento:**
- ✅ Nombre
- ✅ Contacto
- ✅ **Tipo de reparación** (especialidad: eléctrica, mecánica, hidráulica)
- ✅ Tiempos de entrega
- ✅ Costos (opcional - para trackear)

**Asignación de OT Externa:**
- ✅ Al crear OT externa, seleccionar proveedor asignado

---

#### 11. Componentes Multi-Equipos (Grafo vs Árbol)

**Objetivo:** Un componente puede pertenecer a múltiples equipos simultáneamente.

**Ejemplos:**
- Rodamiento SKF-6208 está en: Bomba A, Motor B, Compresor C
- Tubería de aire comprimido atraviesa múltiples equipos

**Estructura NO es árbol jerárquico, es GRAFO:**
- ✅ Relación muchos-a-muchos entre componentes y equipos
- ✅ Un componente sirve a múltiples equipos
- ✅ Un equipo contiene componentes que también están en otros equipos

**Navegación Bidireccional:**
1. ✅ **Top-Down:** Seleccionar equipo → Ver componentes que lo componen
2. ✅ **Bottom-Up:** Seleccionar componente → Ver todos los equipos a los que sirve

**Stock de Componentes:**
- ✅ Se gestiona en el inventario de repuestos (funcionalidad 4)

---

#### 12. Rutinas de Mantenimiento

**Objetivo:** Tareas repetitivas asignadas a usuarios/grupos con frecuencia diaria/semanal/mensual.

**Estructura de Rutinas:**

**Un usuario puede tener múltiples rutinas, cada una en su propia pestaña:**

| Pestaña | Rutina | Frecuencia | Configuración |
|---------|--------|-----------|---------------|
| 📋 Orden y Limpieza | Orden y Limpieza Diaria | Diaria | 3 turnos: 6-14, 14-22, 22-6 |
| 🔍 Inspección Visual | Inspección Semanal | Semanal | Día de la semana (ej: Lunes) |
| 🛢️ Engrase | Engrase Semanal | Semanal | Día configurable (ej: Viernes) |
| ⚙️ Revisión Mensual | Mantenimiento Mensual | Mensual | Día del mes (ej: Día 1) |

**Cada pestaña tiene:**
- ✅ **Icono de progreso** (ej: 3/5 tareas completadas 🔵🔵🟢🟢🟢)
- ✅ Lista de tareas de esa rutina específica
- ✅ Checkbox para marcar cada tarea
- ✅ **Campo de comentarios por rutina completa** (no por tarea)
- ✅ **Botón "Reportar Avería"** (si detectan algo durante tarea)

**Administración de Rutinas (Admin):**

**1. Crear Rutina:**
- Nombre (ej: "Orden y Limpieza - Diaria")
- Frecuencia: Diaria / Semanal / Mensual
  - **Diaria:** Se genera para los 3 turnos (6-14, 14-22, 22-6)
  - **Semanal:** Día de la semana (Lunes/Domingo, primer día configurable)
  - **Mensual:** Día del mes (1-31)
- Lista de tareas (sin límite, las que el programador crea oportunas)

**2. Asignar Rutina:**
- ✅ A **usuario individual** (ej: Carlos)
- ✅ O a **grupo de usuarios** (ej: "Operarios de Perfiladora")
- Fecha de inicio de la rutina

**3. Gestión de Grupos:**
- ✅ Un usuario puede pertenecer a múltiples grupos
- Ej: Carlos está en "Operarios de Perfiladora" Y "Equipo de Mantenimiento Básico"

**KPIs de Rutinas:**
- ✅ Se muestran en **Dashboard Público** (toda la fábrica)
- ✅ Se muestran en **Dashboard Privado** (admin)
- ✅ % de rutinas completadas (hoy / esta semana / este mes)
- ✅ Tareas pendientes vs completadas
- ✅ Usuarios con rutinas atrasadas

**Alertas:**
- ✅ Si rutina diaria no se completa → Notificación a Admin y Supervisor

---

### Out of Scope for MVP

Las siguientes funcionalidades identificadas en las 35 ideas del brainstorming se dejan para fases posteriores para mantener el MVP enfocado y manejable:

**Post-MVP - Phase 2 (Estructura Completa):**
- ❌ Plantillas de equipos (para crear múltiples equipos iguales rápidamente)
- ❌ Búsqueda predictiva universal (expande a todos los campos, no solo equipos)
- ❌ Avisos desestimados con histórico detallado (ahora solo se guardan)

**Post-MVP - Phase 3 (Stock y Reparación Avanzada):**
- ❌ Etiquetado QR de equipos para tracking físico
- ❌ Cadena de custodia digital con QR
- ❌ Mapa en tiempo real de ubicación de equipos

**Post-MVP - Phase 4 (Optimización):**
- ❌ Dashboards avanzados progresivos (empiezan simples, sugieren habilitar KPIs complejos)
- ❌ Predicción inteligente sin IoT (aprende de datos históricos)
- ❌ Tutorial integrado y contextual (tooltips, videos de 30 segundos)
- ❌ Modo TV/Kiosco específico (usamos usuario especial "modo reunión")

**Desarrollo Completo de Preventivas (Post-MVP):**
- ❌ Planificación automática de preventivas por calendario
- ❌ Generación de preventivas desde historial de fallas
- ❌ Análisis de MTBF para sugerir preventivas

---

### MVP Success Criteria

**Criterios de Éxito del MVP:**

**Adopción del Sistema:**
- ✅ 90% de usuarios activos en primer mes
- ✅ 90% de averías reportadas por app (no WhatsApp)

**Uso de Funcionalidades Core:**
- ✅ 100% de supervisores usan tablero Kanban diariamente
- ✅ 100% de técnicos abren app cada mañana
- ✅ Rutinas diarias tienen >95% de completación

**Captura de Datos:**
- ✅ Primeros datos históricos de MTTR y MTBF capturados
- ✅ Mínimo 50 OTs completadas con datos suficientes para calcular KPIs

**Gate de Decisión:**
- Si estos criterios se cumplen a los 3 meses → **Continuar a Phase 2**
- Si no → Reevaluar y ajustar antes de expandir

---

### Future Vision

**Evolución Progresiva del Producto:**

**Phase 1 (MVP - Ahora):** Las 12 funcionalidades base
- Establecer fundamentos: aviso → OT → ejecución → KPIs
- Sentar bases de datos: activos, repuestos, proveedores
- Transición cultural: de WhatsApp/Excel → sistema estructurado

**Phase 2 (6 meses):** Estructura Completa
- Búsqueda predictiva universal (todos los campos)
- Plantillas de equipos (crear múltiples iguales)
- Avisos desestimados con histórico detallado
- Análisis avanzado de causas raíz

**Phase 3 (12 meses):** Stock y Reparación Avanzada
- Etiquetado QR de equipos para tracking físico
- Cadena de custodia digital con QR
- Mapa en tiempo real de ubicación de equipos
- Integración IoT (opcional)

**Phase 4 (18 meses):** Optimización y Predicción
- Dashboards progresivos (simples → avanzados)
- Predicción inteligente sin IoT
- Tutorial integrado y contextual
- Desarrollo completo de preventivas automáticas

**Visión a 2-3 años:**
- Sistema completamente integrado de mantenimiento
- Cultura de datos establecida en la organización
- Departamento de mantenimiento reconocido como profesional y eficiente
- Capacidad de predecir fallas antes de que ocurran
- Integración con otros sistemas empresariales (ERP, producción)

---
