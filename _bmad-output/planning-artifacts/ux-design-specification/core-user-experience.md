# Core User Experience

## Defining Experience

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

## Platform Strategy

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

## Effortless Interactions

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

## Critical Success Moments

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

## Experience Principles

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
