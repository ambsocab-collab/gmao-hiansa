# Domain-Specific Requirements

## Mantenimiento Reglamentario y Certificaciones Obligatorias

**Contexto:** La empresa metalúrgica tiene equipos e instalaciones sujetos a normativa legal que requiere inspecciones periódicas obligatorias realizadas por empresas certificadas externas.

### Categorías de Equipos con Mantenimiento Reglamentario

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

### Niveles de Inspección (A, B, C)

**Concepto:** Un mismo equipo puede tener MÚLTIPLES inspecciones con diferentes niveles y frecuencias.

**Ejemplo: Caldera de Vapor**
- **Nivel A (Básica):** Anual - Operación y mantenimiento básico
- **Nivel B (Intermedia):** Trienal - Pruebas intermedias
- **Nivel C (Exhaustiva):** Quinquenal - Inspección completa por OCA

Cada nivel tiene: certificado independiente, fecha de vencimiento propia, alertas independientes.

### Requisitos del Sistema

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
