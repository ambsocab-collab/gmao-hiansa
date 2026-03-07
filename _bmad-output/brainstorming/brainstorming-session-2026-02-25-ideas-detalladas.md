# Ideas Detalladas - Sesión de Brainstorming GMAO
# Generado: 2026-02-25

## RESUMEN EJECUTIVO

- **Total de Ideas Generadas:** 35
- **Técnicas Utilizadas:** SCAMPER, First Principles, Reverse Brainstorming, Six Thinking Hats
- **Ideas Críticas Evaluadas:** 5 (todas aprobadas)
- **Estado:** Sesión completada exitosamente

---

## 1. SCAMPER METHOD (23 ideas)

### SUSTITUIR (2 ideas)

**[SCAMPER-S #1] SuperAdmin vs Master Admin**
- Eliminar Master Admin (gestiona múltiples empresas)
- Nuevo: SuperAdmin = Bernardo (owner de single-company)
- Acceso total y control completo
- Designa administradores de la aplicación
- Cambio de paradigma: multi-tenant → single-company

**[SCAMPER-S #2] Autenticación Inicial del SuperAdmin**
- Login inicial vía archivo .env (no en git)
- Cambio de contraseña obligatorio en primer acceso
- Si .env no existe → setup inicial
- Seguridad + conveniencia
- Recuperación de emergencia posible

### COMBINAR (3 ideas)

**[SCAMPER-C #1] Dashboards Avanzados Progresivos**
- Inicio: 3 métricas básicas (OTs abiertas, completadas, técnicos activos)
- Progresivamente: sugiere habilitar KPIs complejos (MTTR, MTBF, OEE, costos)
- Curva de aprendizaje guiada
- No sobrecarga desde día 1
- Inspirado en: IBM Maximo dashboards

**[SCAMPER-C #2] PWA - Experiencia Unificada Desktop/Móvil**
- Progressive Web App (no app nativa separada)
- Mismo código base para desktop + móvil
- Responsive design automático
- Instalable en cualquier dispositivo
- Ahorra desarrollo/mantenimiento de 2 apps

**[SCAMPER-C #3] Sistema de Predicción Inteligente Sin IoT**
- Aprende de datos históricos de OTs
- Progresivo: promedios → patrones estacionales → estadística avanzada
- Feedback del usuario: marca alertas como útiles/ruido
- Predice: fallas de activos, consumo de repuestos, carga de trabajo
- Presentación: alertas dashboard, sugerencias OTs, reporte "Activos en Riesgo"
- Inspirado en: IBM Maximo predictivo pero SIN IoT/IA compleja

### ADAPTAR (3 ideas)

**[SCAMPER-A #1] Estructura Multi-Grupo de Activos**
- Sistema organizado en grupos: Contra Incendio, Eléctrico, Producción, Flota, Edificios
- Cada grupo tiene propias familias y atributos personalizables
- No es estructura plana única
- Equipos Contra Incendio ≠ Producción (atributos completamente diferentes)
- Múltiples ecosistemas dentro del mismo GMAO

**[SCAMPER-A #2] Jerarquía de 5 Niveles para Producción**
- Planta → Línea de Producción → Equipo → Componente → Repuesto
- Navegación y análisis granular (toda la planta → pieza individual)
- Expande de 2 niveles (GMAO v2.0) a 5 niveles
- Refleja realidad de plantas manufactureras complejas
- Fallo en rodamiento (nivel 5) impacta toda la línea (nivel 2)

**[SCAMPER-A #3] Plantillas Opcionales de Equipos**
- Crear plantillas: estructura predefinida de componentes + repuestos
- Al crear múltiples equipos iguales: seleccionar plantilla + asignar ubicación
- Ejemplo: 10 bombas en línea = misma plantilla
- Ahorra tiempo masivo en setup inicial
- Garantiza consistencia (10 bombas tienen exactamente mismos componentes)
- Plantillas son OPCIONALES (puedes crear equipos a mano)

### MODIFY (7 ideas)

**[SCAMPER-M #1] Reparación Dual (Interna/Externa) con Listado de Taller**
- Equipos reparables: dos flujos posibles
- (1) Reparación interna: taller propio, OT interna
- (2) Reparación externa: proveedor externo
- Equipo retirado pasa a "Listado de Taller" (estado intermedio)
- Desde Listado: decide OT interna o enviar a proveedor externo
- GMAO v2.0 solo tenía flujo simple (A Reparar → OT → Reintegrado/Baja)

**[SCAMPER-M #2] Gestión de Proveedores Externos**
- Dos listas de proveedores:
  1. Proveedores de mantenimiento (talleres que reparan equipos)
  2. Proveedores de repuestos (venden componentes)
- Cada proveedor: contacto, especialidad, tiempos, costos
- Al crear OT externa: seleccionar proveedor asignado
- Añade dimensión de gestión de terceros (GMAO v2.0 no tenía)

**[SCAMPER-M #3] Stock de Equipos Completos (No Solo Repuestos)**
- Stock de equipos completos: bombas, motores, etc.
- Estados: Disponible, En Uso, En Taller (Interno), En Taller (Externo), Reparado
- Flujo circular: disponible → se instala → falla → sustituye → retirado va a taller → reparado → vuelve a disponible
- GMAO v2.0 solo manejaba stock de repuestos (componentes)
- Permite sustitución inmediata para minimizar downtime (crítico para producción continua)

**[SCAMPER-M #4] Registro de Recepción de Material Reparado (Externo)**
- Cuando proveedor externo termina reparación
- Admin registra: "Recepción de material reparado confirmado"
- Este acto cambia estado: "En Taller Externo" → "Disponible"
- Devuelve equipo al stock de equipos
- Checkpoint de control de inventario externo

**[SCAMPER-M #5] Doble Inventario - Equipos Sustituibles y Repuestos Específicos**
- Dos inventarios distintos:
  1. Equipos Sustituibles: equipos completos (bombas, motores) que se instalan/retiran/reparan
  2. Repuestos Específicos: componentes (rodamientos, bobinas) que se consumen al usar
- Cada inventario tiene propios estados, flujos, lógica de gestión
- GMAO v2.0 solo manejaba repuestos
- Permite tracking de equipos como activos reutilizables (no consumibles) + repuestos consumibles

**[SCAMPER-M #6] Consumo de Repuestos en Reparación de Equipos**
- Cuando reparas equipo reparable (taller interno/externo)
- Reparación CONSUME repuestos del inventario de repuestos
- Ejemplo: Bomba B-002 en taller → necesita rodamiento SKF-6208 → sistema descuenta 1 unidad
- Bomba se marca "Reparada" y vuelve a inventario de equipos
- Conecta lógicamente los dos inventarios: equipos se reutilizan pero requieren repuestos consumibles

**[SCAMPER-M #7] Registro de Repuestos en OT de Reparación de Equipos**
- Técnico crea/actualiza OT de reparación
- Incluye repuestos consumidos (igual que OT de mantenimiento normal)
- Al validar/cerrar OT: sistema descuenta automáticamente del inventario
- Mismo flujo de usuario, diferente contexto (reparación taller vs mantenimiento campo)
- Mantiene consistencia de UX (técnico ya sabe cómo agregar repuestos)

---

## 2. FIRST PRINCIPLES THINKING (8 ideas)

**[FP #1] Flujo Aviso de Avería con Triage y Autorización Admin**
- Reemplazo de NL por "Aviso de Avería"
- Flujo: Abierto → Triage → Admin decide [Autorizar OT] o [Desestimar]
- Si autoriza: se crea OT y se asigna
- Cada Aviso registra origen (quién reportó, cuándo, dónde)
- Creación de OT = AUTORIZACIÓN ADMIN (no decisión de supervisor como GMAO v2.0)
- Añade checkpoint de control + estado intermedio de evaluación

**[FP #2] Creación Universal basada en Capacidades**
- Cualquier usuario puede crear OT si tiene capacidad can_create_manual_ot
- Cualquier usuario puede crear Avisos de Avería (sin restricción)
- No hay flujo rígido "rol X crea Y, rol Y convierte a Z"
- Más orgánico: quién tiene capacidad hace la acción directa
- Múltiples caminos: Aviso → Clasificación → OT, OT directa, Aviso → Desestimación
- GMAO v2.0 tenía flujo rígido: Operario → NL → Supervisor → OT

**[FP #3] Avisos Desestimados con Registro Histórico**
- Aviso desestimado NO se elimina
- Se guarda como "Histórico" con: fecha, motivo, quién desestimó, aviso original
- Permite análisis: "¿Cuántos avisos se desestiman?", "¿Qué operarios reportan falsas alarmas?"
- Avisos desestimados = datos para entender patrones y mejorar proceso
- No son "basura", son aprendizaje

**[FP #4] Componentes Multi-Equipos (Grafo, no Árbol)**
- Componentes pueden pertenecer a múltiples equipos simultáneamente
- Ejemplo: Rodamiento SKF-6208 está en Bomba A, Motor B, Compresor C
- Tubería de aire comprimido atraviesa múltiples equipos
- Estructura NO es árbol jerárquico estricto, es GRAFO o RED de relaciones
- GMAO v2.0 usaba jerarquía padre-hijo (1 solo padre)
- Permite relaciones muchos-a-muchos: componente en múltiples equipos, equipo contiene componentes que también están en otros

**[FP #5] Búsqueda Predictiva en Aviso de Avería**
- Campo de búsqueda de equipos tiene autocompletado predictivo
- Mientras usuario escribe, sistema sugiere coincidencias en tiempo real
- Permite encontrar equipo rápidamente sin conocer nombre exacto o código
- Ejemplo: escribe "prensa" → sugiere "Prensa Hidráulica PH-500", "Prensa Mecánica P-200"
- Mejora UX significativa sobre listas desplegables largas
- Reduce tiempo de reporte y errores de selección

**[FP #6] Relación Bidireccional Componentes ↔ Equipos**
- Navegación en ambas direcciones:
  1. Top-Down: Seleccionar equipo → ver/listar componentes que lo componen
  2. Bottom-Up: Seleccionar componente/repuesto → ver/listar todos los equipos a los que sirve
- Relación muchos-a-muchos accesible desde ambos extremos
- GMAO v2.0 solo tenía vista unidireccional (equipo → componentes)
- Permite "¿qué tiene este equipo?" + "¿qué equipos usan este componente?"
- Crítico para gestión de stock y sustituciones

**[FP #7] Búsqueda Predictiva Universal**
- Búsqueda predictiva con autocompletado en TODOS los campos donde usuario escribe/selecciona
- No solo equipos: también usuarios, repuestos, proveedores, familias, etc.
- Mientras usuario escribe, sistema sugiere coincidencias en tiempo real
- Estandariza UX en toda la aplicación
- Reduce significativamente tiempo de entrada de datos y errores

**[FP #8] Rama Independiente de Equipos Auxiliares/Generales**
- "Equipos Auxiliares" (compresores, calderas, tuberías, infraestructura) = rama independiente
- Estructura diferente a Producción
- No siguen jerarquía Planta→Línea→Equipo
- Estructura más plana o adaptada: equipo auxiliar → componentes
- Reconoce que no todos los activos encajan en mismo modelo estructural
- Equipos auxiliares sirven a múltiples líneas/áreas

---

## 3. REVERSE BRAINSTORMING (5 ideas invertidas = soluciones)

**Anti-Pattern #1: Demasiados Pasos para Generar OT**
- Problema: 10+ clics, 5 pantallas, confirmaciones interminables
- SOLUCIÓN INVERTIDA: OT en 3 pasos o menos
  1. Seleccionar equipo (búsqueda predictiva)
  2. Describir problema
  3. Crear OT
  - LISTO. 15 segundos máximo.

**Anti-Pattern #2: Flujos Liosos y No Claros**
- Problema: No se entiende qué viene después de qué. Usuario perdido.
- SOLUCIÓN INVERTIDA: Flujos guiados con indicadores visuales
  - Barra de progreso visual muestra estado actual
  - Flechas indican "Siguiente paso"
  - Botones grandes y claros

**Anti-Pattern #3: Curva de Aprendizaje Alta**
- Problema: Manual de 100 páginas, curso de 2 semanas. Terminología críptica.
- SOLUCIÓN INVERTIDA: Tutorial integrado y contextual
  - Primer login: tour guiado de 3 minutos
  - Tooltips contextuales en cada pantalla
  - Vídeos de 30 segundos por funcionalidad
  - Modal "¿Necesitas ayuda?" siempre disponible

**Anti-Pattern #4: Problema de Cold Start (Sistema Vacío)**
- Problema: Primer día, sistema VACÍO. Pantalla en blanco intimida.
- SOLUCIÓN INVERTIDA: Sistema pre-poblado con opciones
  1. Con datos de ejemplo (demo: 10 activos, 5 OTs, 2 técnicos)
  2. Importar mis datos (CSV/Excel)
  3. Empezar desde cero (configuración manual)

**Anti-Pattern #5: Difícil Ver la Situación Actual**
- Problema: Para saber "¿qué está pasando?" navegas 5 pantallas, generas reportes.
- SOLUCIÓN INVERTIDA: Dashboard tipo "Mission Control"
  - Resumen HOY: OTs abiertas, Técnicos activos, Avisos pendientes, Críticos
  - Alertas: Avisos en triage hace tiempo, Técnicos sobrecargados, Stock mínimo
  - Acciones rápidas: [Ver detalles] [Crear OT] [Asignar técnicos]

---

## 4. SIX THINKING HATS - Evaluación de Ideas Críticas

### Idea #1: Estructura Multi-Grupo + Jerarquía 5 Niveles

**White Hat (Datos):**
- GMAO v2.0: 2 niveles. Plantas reales: 4-6.
- Requiere breadcrumb, búsqueda predictiva, testing con 10,000+ activos

**Red Hat (Emociones):**
- Usuarios nuevos: abrumados
- Supervisores experimentados: potentes

**Yellow Hat (Beneficios):**
- Fidelidad a la realidad
- Reporting poderoso
- Escalabilidad
- Flexibilidad

**Black Hat (Riesgos):**
- Configuración compleja
- Performance de consultas anidadas
- UX abrumadora

**Green Hat (Creatividad):**
- "Quick Create" inteligente
- Vistas alternativas (plana con filtros)
- "Favoritos" de combinaciones frecuentes

**Blue Hat (Proceso):**
- Decisión: ✅ SÍ - Prioridad ALTA
- Next: Definir schema DB → Prototipar UX → Performance testing → Validar con usuario real

---

### Idea #2: Doble Inventario (Equipos + Repuestos)

**White Hat (Datos):**
- GMAO v2.0 solo manejaba repuestos
- Plantas tienen stock de equipos completos
- Requiere 2 tablas principales

**Red Hat (Emociones):**
- Técnicos: SEGUROS
- Admin: complejidad adicional
- Gerencia: confusión inicial → comprensión → INTELIGENTES

**Yellow Hat (Beneficios):**
- Minimización de downtime
- Visibilidad real
- Costeo preciso
- Optimización de stock
- Separación contable

**Black Hat (Riesgos):**
- Confusión inicial equipo vs repuesto
- Complejidad de UI
- Errores de registro

**Green Hat (Creatividad):**
- Asistente inteligente en creación
- Código de colores/íconos
- Vista "Inventario Físico" con mapa
- "Sugerencia de uso"

**Blue Hat (Proceso):**
- Decisión: ✅ SÍ - Prioridad MÁXIMA
- Next: Definir reglas clasificación → Diseñar UI diferenciada → Prototipar flujo → Test con usuarios

---

### Idea #3: Aviso de Avería con Triage + Autorización

**White Hat (Datos):**
- GMAO v2.0: Supervisor convertía NL
- Nuevo: Aviso → Triage → Admin autoriza
- Estados: Abierto, Triage, OT Creada, Desestimada

**Red Hat (Emociones):**
- Operarios: ESCUCHADOS
- Admin: CARGA (potencial cuello de botella)
- Supervisores: ALIVIADOS o DESPODERADOS

**Yellow Hat (Beneficios):**
- Control presupuestario
- Calidad de avisos
- Trazabilidad total
- Análisis de patrones
- Justificación

**Black Hat (Riesgos):**
- Cuello de botella si Admin ocupado
- Demora en respuesta
- Sobrecarga de Admin
- Burocracia percibida

**Green Hat (Creatividad):**
- Triage colaborativo
- Reglas de auto-autorización
- Triage con IA
- Escalado de urgencia
- Batch approval

**Blue Hat (Proceso):**
- Decisión: ✅ SÍ (modificado) - Prioridad ALTA
- Mitigación: Múltiples autorizadores, auto-autorización, SLAs
- Next: Definir reglas autorización → Diseñar UX Triage → Definir SLAs → Configurar notificaciones

---

### Idea #4: Stock de Equipos con Ciclo Reparación

**White Hat (Datos):**
- Flujo circular: Stock ↔ Uso ↔ Taller ↔ Stock
- Estados: Disponible, En Uso, En Taller Int/Ext, Reparado
- Requiere tracking de ubicación física

**Red Hat (Emociones):**
- Técnicos: PROFESIONALES
- Supervisores: EN CONTROL
- Taller: ORGANIZADO
- Gerencia: TRANSPARENCIA

**Yellow Hat (Beneficios):**
- Minimización downtime (sustitución inmediata)
- Optimización de stock
- Visibilidad total
- Costeo de reparación
- Planificación

**Black Hat (Riesgos):**
- Disciplina de actualización
- Complejidad de tracking
- Errores de asignación
- Costo de implementación (etiquetado)

**Green Hat (Creatividad):**
- Mapa en tiempo real
- Predicción de stock
- Cadena de custodia digital (QR)
- Tareas automáticas
- Marketplace interno

**Blue Hat (Proceso):**
- Decisión: ✅ SÍ - Prioridad ALTA (Fase 2)
- Mitigación: QR codes, validaciones, alertas discrepancias, auditoría periódica
- Next: Definir estados → Diseñar sistema etiquetado → Prototipar flujo → Test con técnicos

---

### Idea #5: OT en <30 Segundos

**White Hat (Datos):**
- GMAO actual: 2-5 min por OT
- Objetivo: <30s (10x más rápido)
- Pasos: 3 máximo
- Campos mínimos: Equipo + Descripción

**Red Hat (Emociones):**
- Técnicos: EMPODERADOS
- Supervisores: ALIVIADOS
- Admin: ESCÉPTICO
- Sistema: LIGERO y ÁGIL

**Yellow Hat (Beneficios):**
- Adopción masiva
- Respuesta rápida
- Menos "yo te avisé"
- Datos de calidad
- Diferenciador competitivo MASIVO

**Black Hat (Riesgos):**
- Datos incompletos
- Mala calidad de reportes
- Sobre-carga de Supervisores
- 30s vs realismo (probablemente 45-60s)

**Green Hat (Creatividad):**
- Plantillas de OT
- Voz a texto
- Crear desde móvil
- Quick actions
- Predictivo de prioridad
- Creación pasiva (botón PANIC)

**Blue Hat (Proceso):**
- Decisión: ✅ SÍ - Prioridad MÁXIMA
- Mitigación: Crear rápido-completar después, smart defaults, validación inteligente
- Next: Definir campos mínimos → Diseñar UI Quick Create → Prototipar y cronometrar → Test con usuarios

---

## RESUMEN DE DECISIONES

| Idea | Decisión | Prioridad | Fase |
|------|----------|-----------|------|
| **#1: Multi-Grupo + Jerarquía 5 niveles** | ✅ SÍ | ALTA | 2 |
| **#2: Doble Inventario (Equipos + Repuestos)** | ✅ SÍ | MÁXIMA | 2 |
| **#3: Aviso de Avería con Triage + Autorización** | ✅ SÍ | ALTA | 1 |
| **#4: Stock de Equipos con Ciclo Reparación** | ✅ SÍ | ALTA | 3 |
| **#5: OT en <30 segundos** | ✅ SÍ | MÁXIMA | 1 |

---

## NEXT STEPS INMEDIATOS

### 1. Arquitectura de Datos
- Definir schema de DB para estructura multi-grupo
- Diseñar tablas: equipos_sustituibles, repuestos, avisos_averia, proveedores
- Implementar relaciones bidireccionales componentes ↔ equipos

### 2. UX/UI Design
- Diseñar pantallas: Quick Create OT (<30s)
- Prototipar navegación jerárquica con breadcrumb
- Diseñar Dashboard Mission Control
- Diseñar flujo de Triage de Avisos

### 3. Prototipado
- Crear prototipo de creación de OT (cronometrar: debe ser <30s)
- Prototipar búsqueda predictiva universal
- Testar onboarding con datos demo

### 4. Configuración
- Definir capacidades granulares (8 permisos GMAO v2.0 se mantienen)
- Configurar sistema de autorización (Admin + delegados)
- Definir SLAs de autorización de avisos

### 5. Implementación por Fases

**Fase 1 (MVP - Crítico para adopción):**
- OT en <30 segundos
- Búsqueda predictiva universal
- Aviso de Avería con Triage
- Dashboard Mission Control básico

**Fase 2 (Estructura completa):**
- Multi-grupo de activos
- Jerarquía 5 niveles producción
- Relaciones bidireccionales
- Doble inventario (equipos + repuestos)

**Fase 3 (Stock y Reparación):**
- Stock de equipos completos
- Ciclo de reparación (interna/externa)
- Gestión de proveedores
- Etiquetado QR de equipos

**Fase 4 (Optimización):**
- Dashboards progresivos
- Predicción sin IoT
- PWA mobile
- Tutoriales interactivos

---

## FIN DE DOCUMENTO

**Fecha:** 2026-02-25
**Facilitador:** Bernardo
**Total Ideas:** 35
**Estado:** ✅ Sesión completada exitosamente
