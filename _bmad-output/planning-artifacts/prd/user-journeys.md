# User Journeys

## Journey de Carlos - Operario de Línea (25 años)

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

## Journey de María - Técnica de Mantenimiento (28 años)

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

## Journey de Javier - Supervisor de Mantenimiento (32 años)

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

## Journey de Elena - Administrador / Jefa de Mantenimiento (38 años)

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

## Journey de Pedro - Usuario con Capacidad de Gestión de Stock (35 años)

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
