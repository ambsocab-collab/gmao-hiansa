# Epic 5: Control de Stock y Repuestos

Permitir a gestores como Pedro controlar el stock de repuestos en tiempo real con ubicación física visible en almacén (ej: "📍 Estante A3, Cajón 3"), actualizaciones silenciosas cuando técnicos usan repuestos en OTs (sin spam de notificaciones), alertas solo al alcanzar stock mínimo, capacidad de realizar ajustes manuales con motivo obligatorio, generar pedidos a proveedores, importar repuestos masivamente desde CSV y asociar cada repuesto con uno o más proveedores. Todos los usuarios pueden ver stock y ubicación al seleccionar repuestos para uso.

**FRs cubiertos:** FR16, FR44-FR56 (14 requerimientos funcionales)
**Usuario principal:** Pedro (Usuario con capability can_manage_stock), María (Técnica que usa repuestos)
**Valor entregado:**
- Todos los usuarios ven stock y ubicación al seleccionar repuestos
- María ve stock actualizado en tiempo real (1s, silencioso)
- Pedro NO recibe spam por cada uso (solo alertas stock mínimo)
- Pedro recibe alerta: "Filtro F-205 alcanzó mínimo (6 unidades, mínimo: 5)"
- Pedro genera pedidos a proveedores desde la alerta
- Pedro hace ajustes manuales con motivo (discrepancia física)
- Importación CSV masiva con validación de proveedores y ubicaciones
- Pedro ahorra 2+ horas diarias (sin interrupciones constantes)

**Dependencias:** Epic 1 (requiere autenticación), Epic 2 (requiere jerarquía de activos para asociar repuestos a componentes)

---

## Story 5.1: Modelo de Datos de Repuestos y Control de Stock

As a developer of the system,
I want to create the Prisma data model for spare parts (Repuestos) with stock tracking, minimum thresholds, physical storage location, and provider associations,
So that the system can accurately track stock levels, locations, and automatically alert when minimum thresholds are reached.

**Acceptance Criteria:**

**Given** that I am defining the Prisma schema in `prisma/schema.prisma`
**When** I create the Repuesto model
**Then** the Repuesto model has fields:
- id (UUID, primary key)
- nombre (String, required, max 200 characters)
- descripcion (String, optional, max 1000 characters)
- codigo (String, optional, unique part number/SKU)
- numeroParte (String, optional, manufacturer part number)
- componenteId (UUID, foreign key → Componente.id, optional)
- stockActual (Int, required, default 0, current quantity in stock)
- stockMinimo (Int, required, default 5, minimum threshold for alerts)
- ubicacionAlmacen (String, required, max 200 characters, e.g., "Estante A3, Cajón 3")
- costoUnitario (Decimal, optional, unit cost in local currency)
- unidadMedida (String, optional, default "unidades", e.g., "unidades", "kg", "metros")
- isActive (Boolean, default true)
- createdAt (DateTime, default now())
- updatedAt (DateTime, updatedAt on)
- @@map for "repuestos" table
- And there is a many-to-one relationship from Repuesto to Componente (componenteId → Componente.id)
- And the codigo field is unique (if provided) to prevent duplicate SKUs

**Given** that the Repuesto model is created
**When** I create the RepuestoProveedor model for many-to-many relationships
**Then** the RepuestoProveedor model has fields:
- id (UUID, primary key)
- repuestoId (UUID, foreign key → Repuesto.id)
- providerId (UUID, foreign key → Provider.id)
- esProveedorPrincipal (Boolean, default false, indicates primary supplier for this part)
- numeroParteProveedor (String, optional, provider's SKU for this part)
- costoUnitario (Decimal, optional, cost from this specific provider)
- tiempoEntregaDias (Int, optional, lead time in days)
- minOrdenCantidad (Int, optional, minimum order quantity)
- ultimaActualizacion (DateTime, optional, last price update)
- createdAt (DateTime, default now())
- @@map for "repuesto_proveedores" table
- And there is a many-to-one relationship from RepuestoProveedor to Repuesto
- And there is a many-to-one relationship from RepuestoProveedor to Provider
- And there is a unique composite index (repuestoId, providerId)

**Given** that the RepuestoProveedor model is created
**When** I create the StockAjuste model for manual adjustments tracking
**Then** the StockAjuste model has fields:
- id (UUID, primary key)
- repuestoId (UUID, foreign key → Repuesto.id, required)
- userId (UUID, foreign key → User.id, required, who made the adjustment)
- ajuste (Int, required, positive for increases, negative for decreases)
- stockAntes (Int, required, stock level before adjustment)
- stockDespues (Int, required, stock level after adjustment)
- motivo (String, required, max 500 characters, reason for adjustment)
- tipoAjuste (Enum TipoAjuste, values: AJUSTE_INVENTARIO, MERMA, PERDIDA, COMPRA, VENTA, ERROR_CORRECCION)
- fechaAjuste (DateTime, default now())
- @@map for "stock_ajustes" table
- And there is a many-to-one relationship from StockAjuste to Repuesto
- And there is a many-to-one relationship from StockAjuste to User
- And stock adjustments create an audit trail

**Given** that the TipoAjuste enum is created
**When** I define its values
**Then** the enum has values:
- AJUSTE_INVENTARIO: Physical count correction
- MERMA: Write-off for damaged/obsolete parts
- PERDIDA: Lost parts documentation
- COMPRA: Stock addition from purchase
- VENTA: Stock deduction for sale
- ERROR_CORRECCION: Correction of data entry error

**Given** that I create the StockAlerta model for tracking minimum alerts
**Then** the StockAlerta model has fields:
- id (UUID, primary key)
- repuestoId (UUID, foreign key → Repuesto.id, required)
- userId (UUID, foreign key → User.id, optional, user who received/dismissed alert)
- nivelAlerta (Enum NivelAlerta, values: INFO, WARNING, CRITICAL)
- stockEnAlerta (Int, required, stock level when alert triggered)
- mensaje (String, required, max 500 characters)
- alertaActiva (Boolean, default true, whether alert is still active)
- fechaAlerta (DateTime, default now())
- fechaResolucion (DateTime, optional, when stock was replenished)
- resolucionNota (String, optional, max 500 characters)
- @@map for "stock_alertas" table
- And there is a many-to-one relationship from StockAlerta to Repuesto
- And there is a many-to-one relationship from StockAlerta to User (optional)

**Given** that the NivelAlerta enum is created
**When** I define its values
**Then** the enum has values:
- INFO: Stock below minimum but not critical
- WARNING: Stock close to minimum (< 120% of minimum)
- CRITICAL: Stock at or below minimum (requires immediate action)

**Given** that all models are defined
**When** I run `npx prisma migrate dev --name init_repuestos_stock`
**Then** the initial migration is created
- And the repuestos, repuesto_proveedores, stock_ajustes, stock_alertas tables are created
- And the enums are created correctly
- And foreign keys are created correctly
- And indexes are created correctly

**Given** that migrations are executed
**When** I run `npx prisma generate`
**Then** the Prisma Client is regenerated with the new models
- And TypeScript types are generated automatically

**Given** that models are generated
**When** I create the `types/repuestos.ts` file
**Then** TypeScript types derived from Prisma are exported for Repuesto, RepuestoProveedor, StockAjuste, StockAlerta
- And a TipoAjuste type is created with the 6 adjustment types
- And a NivelAlerta type is created with the 3 alert levels

**FRs covered:** Base structure for FR44-56 (todos los FRs de stock), FR16 (actualizaciones stock)

---

## Story 5.2: Vista de Stock en Tiempo Real para Todos los Usuarios

As a María (Técnica) or Pedro (Stock Manager) or any user in the system,
I want to view the spare parts catalog with real-time stock levels and physical storage locations visible for all parts without requiring special permissions,
So that I can check part availability and location before using them in maintenance work.

**Acceptance Criteria:**

**Given** that I am logged in as any user (no special capability required)
**When** I access the `/repuestos` route or "Ver Repuestos" button
**Then** I see a catalog/table view of all spare parts with:
- Repuesto name (e.g., "Rodamiento SKF-6208")
- SKU/código (if available): "SKF-6208"
- Stock actual: "12 unidades 🟢" (color-coded: green = healthy, amber = low, red = critical)
- Ubicación física: "📍 Estante A3, Cajón 3"
- Costo unitario: "$1,250.00" (visible only to users with can_manage_stock capability)
- Minimum stock: "Mínimo: 5" (visible only to users with can_manage_stock capability)
- Proveedor(s): "Talleres Eléctricos SA" (if associated)
- Search field: "Buscar repuesto (ej: rodamiento, filtro)"
- Filter controls: Stock level, Location, Provider
- "Ver Detalles" button for each repuesto

**Given** that I use the search field
**When** I type "rodamiento"
**Then** the predictive search shows suggestions in <200ms:
- "**Rodamiento** SKF-6208 (Para Prensa PH-500, Perfiladora P-201)"
- Stock: "12 unidades 🟢"
- Location: "📍 Estante A3, Cajón 3"
- Highlighting of matched term
- And I can tap/select a suggestion to view full details

**Given** that I tap/click on a repuesto row or "Ver Detalles"
**Then** a modal opens with complete repuesto information:
- All repuesto fields (nombre, descripcion, codigo, numeroParte, stockActual, stockMinimo, ubicacionAlmacen, costoUnitario)
- Associated component: "Componente: Rodamiento Principal"
- Associated equipment: "Equipos: Prensa PH-500, Perfiladora P-201"
- Associated providers with contact info:
  - Provider name: "Talleres Eléctricos SA"
  - Service types: "Mantenimiento de Equipos Específicos"
  - Contact: "Tel: +54 11 1234-5678"
  - Lead time: "3 días"
  - Last cost: "$1,250.00"
- Recent usage history: "Usado hace 2 días en OT OT-20260305-0023"
- Stock adjustment history (if user has can_manage_stock):
  - "Ajuste inventario: +5 unidades (2026-03-01 por Pedro) - Motivo: Conteo físico"
  - "Venta: -1 unidad (2026-03-05 por María)"
- Current alerts: "⚠️ Por encima del mínimo" or "🔴 Crítico: 4 unidades (mínimo: 5)"

**Given** that I am María (technician without can_manage_stock)
**When** I view the repuesto catalog
**Then** I see:
- ✅ Repuesto name
- ✅ Stock actual: "12 unidades 🟢"
- ✅ Ubicación: "📍 Estante A3, Cajón 3"
- ✅ Associated providers (names only)
- ❌ Costo unitario (HIDDEN - I cannot see prices)
- ❌ Stock mínimo (HIDDEN - I cannot see thresholds)
- ❌ Ajustes manuales (HIDDEN - I cannot see adjustment history)
- ❌ "Editar" buttons (DISABLED - I cannot modify stock)

**Given** that I am Pedro (stock manager with can_manage_stock capability)
**When** I view the repuesto catalog
**Then** I see additional information:
- ✅ All fields visible to María
- ✅ Costo unitario: "$1,250.00"
- ✅ Stock mínimo: "5 unidades"
- ✅ Diferencia stock vs mínimo: "12 unidades - 5 mínimo = 7 de margen"
- ✅ "Ajustar Stock" button (opens manual adjustment form)
- ✅ "Asociar Proveedor" button (add or remove providers)
- ✅ "Editar Repuesto" button (modify name, location, minimum)
- ✅ Stock adjustment history (audit trail)

**Given** that the catalog is displayed
**When** repuestos are updated (stock changes, new repuestos added)
**Then** the catalog updates in real-time via SSE (every 30 seconds)
- And stock levels update automatically without manual refresh
- And new repuestos appear in the catalog
- And I see a visual indicator: "2 cambios pendientes"

**Given** that I want to filter the catalog
**When** I use filter controls
**Then** I can filter by:
- Stock level: "Todos", "En Stock" (>0), "Agotado" (=0), "Bajo Mínimo" (< stockMinimo)
- Location: "Estante A3", "Estante B1", etc.
- Provider: Multi-select of associated providers
- And the catalog updates to show only filtered repuestos
- And page title reflects filtered count: "Repuestos Filtrados (15 encontrados)"

**Given** that I am on mobile device
**When** I view the repuesto catalog
**Then** the interface is mobile-optimized:
- Cards instead of table for better touch interaction
- Each card shows: Name, Stock, Location (primary info)
- Tap card to view full details in modal
- Large touch targets (44x44px minimum)
- Bottom navigation for quick access

**Performance Validation:**

**Given** that the repuesto catalog can have many parts (1000+)
**When** I load the catalog
**Then** the initial load completes in <2 seconds (NFR-P4)
- And pagination ensures fast loads (50 parts per page by default)
- And search responds in <200ms (NFR-P1)

**Given** that stock updates occur
**When** María uses a repuesto in an OT
**Then** my catalog view updates automatically within 1 second (FR16)
- And the stock level refreshes: "12 unidades → 11 unidades"
- And I see the new stock without manual refresh

**FRs covered:** FR44 (acceso catálogo), FR45 (ver stock actual tiempo real), FR46 (ver ubicación física), FR47 (ver stock y ubicación al seleccionar), NFR-P1 (<200ms búsqueda), NFR-P4 (dashboard <2s)

---

## Story 5.3: Actualización Silenciosa de Stock en Tiempo Real

As a María (Técnica using spare parts in an OT),
I want the stock to update automatically and silently when I add used parts to my work order, without sending notifications to Pedro for each part used,
So that Pedro is not spammed with constant notifications and I can work efficiently without interruptions.

**Acceptance Criteria:**

**Given** that I am María working on OT OT-20260307-0001
**When** I access the "Repuestos Usados" section (see Story 4.5)
**And** I tap "Agregar Repuesto"
**And** I search and select "Rodamiento SKF-6208" with quantity "2"
**And** I tap "Agregar"
**Then** the system:
- Validates stock availability (12 >= 2)
- Deducts 2 units from stockActual: "12 → 10"
- Creates a StockAjuste record:
  - ajuste: -2
  - stockAntes: 12
  - stockDespues: 10
  - motivo: "Usado en OT OT-20260307-0001 por María"
  - tipoAjuste: VENTA
  - userId: María's userId
- Updates the updatedAt timestamp on Repuesto
- Shows success message: "✓ Agregado: Rodamiento SKF-6208 (x2). Stock actual: 10"
- **CRITICAL:** Pedro does NOT receive any push notification
- **CRITICAL:** No email is sent to Pedro
- **CRITICAL:** No alert appears in Pedro's dashboard
- The stock update is completely silent

**Given** that Pedro is viewing the repuesto catalog
**When** María adds parts to her OT
**Then** Pedro's view updates automatically within 1 second via SSE
- And the stock level refreshes: "12 unidades → 10 unidades"
- And the catalog shows the new stock without Pedro taking any action
- And Pedro is not interrupted by notifications

**Given** that multiple technicians use the same repuesto simultaneously
**When** María uses 2 units and Juan uses 1 unit at the same time
**Then** the system handles the updates correctly:
- First update processed: stock 12 → 10
- Second update processed: stock 10 → 9 (assuming both happen within milliseconds)
- Or both updates are serialized to prevent race conditions
- And the final stock is correct: 9 units
- And both technicians see success messages
- And Pedro's catalog shows the correct final stock

**Given** that stock reaches minimum level
**When** María adds the last unit that brings stock from 5 to 4
**Then** the system:
- Updates stock: 5 → 4
- Creates a StockAlerta record automatically:
  - nivelAlerta: CRITICAL
  - stockEnAlerta: 4
  - mensaje: "⚠️ Alerta: Rodamiento SKF-6208 alcanzó mínimo (4 unidades, mínimo: 5)"
  - alertaActiva: true
- **NOW** Pedro receives a push notification: "⚠️ Alerta: Rodamiento SKF-6208 alcanzó mínimo (4 unidades, mínimo: 5)"
- And the notification is actionable: tap to generate purchase order
- And María does NOT receive a notification about the minimum alert (not her concern)

**Given** that stock was at minimum and gets replenished
**When** Pedro receives a shipment and adds 10 units via manual adjustment or purchase
**Then** the system:
- Updates stock: 4 → 14
- Creates a StockAjuste record for the increase
- Resolves the StockAlerta:
  - alertaActiva: false
  - fechaResolucion: set to now()
  - resolucionNota: "Stock repuesto. Añadido 10 unidades."
- Pedro sees success message: "Stock actualizado. Alerta resuelta."

**Given** that I want to see the real-time update in action
**When** I am viewing the repuesto catalog and Pedro adds 5 units via manual adjustment
**Then** within 1 second:
- My catalog view updates automatically
- The stock level refreshes: "10 unidades → 15 unidades"
- And I see the new stock without manual refresh

**Performance Validation:**

**Given** that stock updates must be fast
**When** María adds a part to her OT
**Then** the stock update completes in <1 second (FR16)
- And the UI shows the updated stock immediately
- And Pedro's catalog updates via SSE in <1 second

**Given** that stock updates happen frequently
**When** 20 parts are used across multiple OTs in 1 minute
**Then** the system handles all updates without lag
- And all 20 stock levels are correctly deducted
- And Pedro's catalog remains responsive

**Error Scenarios:**

**Given** that María tries to use more parts than available
**When** she tries to use 15 units when only 12 are in stock
**Then** the system shows error: "Solo 12 disponibles. Solicitaste 15."
- And the stock is NOT updated
- And María must adjust the quantity or select a different part

**Given** that the system is down when stock update is attempted
**When** the API call fails
**Then** the system shows error message: "Error al actualizar stock. Por favor intenta nuevamente."
- And the part addition to OT is retried automatically
- Or the form data is preserved for manual retry

**FRs covered:** FR13 (agregar repuestos durante cumplimiento), FR16 (actualización stock tiempo real 1s, silenciosa), NFR-P3 (SSE 30s)

---

## Story 5.4: Alertas de Stock Mínimo Solo Cuando es Necesario

As a Pedro (Stock Manager with can_manage_stock capability),
I want to receive push notifications only when a spare part reaches its minimum threshold (not for every part used), with actionable alerts that allow me to generate purchase orders directly,
So that I am not spammed with constant notifications and only need to act when replenishment is actually required.

**Acceptance Criteria:**

**Given** that I am Pedro with can_manage_stock capability
**When** a repuesto reaches stock mínimo (stockActual <= stockMinimo)
**Then** I receive a push notification on my device:
- Notification title: "⚠️ Alerta de Stock: Rodamiento SKF-6208"
- Notification body: "Rodamiento SKF-6208 alcanzó mínimo (4 unidades, mínimo: 5). 📍 Estante A3, Cajón 3"
- The notification is actionable (tap to generate purchase order)
- And I receive the notification within 30 seconds of the threshold being reached

**Given** that I tap/click the notification
**Then** the app opens and shows:
- Repuesto details modal with stock info
- "Generar Pedido" button (primary, prominent)
- "Ver Historial" button (to see usage patterns)
- "Descartar" button (if I want to dismiss for now)

**Given** that I tap "Generar Pedido" from the notification or repuesto details
**Then** a purchase order creation form opens pre-filled with:
- Repuesto: "Rodamiento SKF-6208" (auto-selected)
- Proveedor: "Talleres Eléctricos SA" (auto-selected, if it's the primary supplier)
- Cantidad sugerida: Calculate based on (stockMinimo * 3) - stockActual = (5 * 3) - 4 = 11 units suggested
- Or I can enter custom quantity
- "Cancelar" and "Crear Pedido" buttons
**And** the form is optimized for quick order generation

**Given** that I adjust the suggested quantity to "10 unidades"
**When** I tap "Crear Pedido"
**Then** the system:
- Creates a purchase order record (see Story 5.6 for full details)
- Associates the purchase order with the repuesto and provider
- Sends notification to the provider (if configured)
- Shows success message: "Pedido #PO-20260307-0001 creado exitosamente"
- And the StockAlerta is NOT resolved yet (will be resolved when stock is replenished)

**Given** that multiple parts reach minimum at the same time
**When** 5 different repuestos trigger alerts
**Then** I receive a consolidated notification:
- "⚠️ 5 repuestos alcanzaron mínimo:
  1. Rodamiento SKF-6208 (4/5)
  2. Filtro F-205 (6/5)
  3. Empaquetadura E-102 (2/5)
  4. Tornillo T-301 (4/5)
  5. Arandela A-401 (3/5)"
- And tapping the notification opens a list view of all 5 alerts
- And I can generate purchase orders individually or in batch

**Given** that a repuesto was already at minimum
**When** additional parts are used (making stock even lower)
**Then** I do NOT receive another notification for the same repuesto
- And the system tracks: "Alerta ya enviada para este repuesto"
- And I only receive one notification per repuesto when minimum is FIRST reached

**Given** that I want to configure alert thresholds
**When** I edit a repuesto and change stockMinimo from 5 to 10
**Then** future alerts will trigger at the new threshold
- And existing alerts below the new threshold are automatically resolved
- And I see message: "Umbral actualizado. Alertas previas por debajo del nuevo mínimo han sido resueltas."

**Given** that a repuesto is CRITICALLY low (stockActual is 0 or 1, very far below minimum)
**When** the minimum is first reached
**Then** the notification uses NivelAlerta = CRITICAL:
- "🔴 CRÍTICO: Rodamiento SKF-6208 sin stock (0 unidades, mínimo: 5)"
- And the notification is marked as high priority on my device
- And I see this alert highlighted in my dashboard

**Given** that I dismiss an alert without acting
**When** I tap "Descartar" in the alert notification
**Then** the StockAlerta remains active (alertaActiva: true)
- And I will receive reminders daily until resolved:
- "Recordatorio: Rodamiento SKF-6208 aún bajo mínimo (4 unidades, mínimo: 5)"
- And reminders continue every 24 hours until stock is replenished

**Given** that stock is replenished and minimum is resolved
**When** Pedro adds stock via purchase order receipt or manual adjustment
**Then** the StockAlerta is resolved:
- alertaActiva: false
- fechaResolucion: set to now()
- resolucionNota: "Stock repuesto. Añadido 10 unidades."
- I see success message: "Alerta resuelta: Rodamiento SKF-6208 ahora tiene 14 unidades."
- And I no longer receive reminders for this repuesto

**Given** that I am viewing my dashboard
**When** I have active stock alerts
**Then** I see an "Alertas de Stock" section showing:
- List of all repuestos at or below minimum
- Each alert shows: Repuesto name, Stock/Minimum, Location, "Generar Pedido" button
- Color coding: Red (CRÍTICO), Amber (WARNING), Green (INFO)
- And I can see the count: "3 alertas activas"

**Given** that I want to see all historical alerts (not just active)
**When** I access the "Historial de Alertas" section
**Then** I see:
- Paginated list of all stock alerts (active and resolved)
- For each alert: Repuesto, trigger date, stock level when triggered, resolution status
- I can filter by: Active/Resolved, Date Range, Repuesto
- And I can export alert history to CSV for analysis

**Performance Considerations:**

**Given** that stock changes frequently
**When** alerts should be sent
**Then** the system checks stockActual <= stockMinimo after EVERY stock update
- And the check is performed in the same transaction as the stock update
- And alerts are created synchronously if threshold is breached
- And the check has minimal performance overhead (<50ms)

**Given** that I am offline or the app is closed
**When** an alert is triggered
**Then** the notification is queued for delivery
- And I receive it when I come back online
- Or I see the alert when I next open the app

**Accessibility:**

**Given** that I am using a screen reader
**When** I receive an alert notification
**Then** the notification is read aloud: "Alerta de stock. Rodamiento SKF-6208 alcanzó mínimo. 4 unidades disponibles, mínimo 5. Ubicación: Estante A3 Cajón 3."

**FRs covered:** FR50 (alertas stock mínimo), FR51 (generar pedidos), FR56 (reporte de resultados), NFR-P3 (SSE 30s)

---

## Story 5.5: Gestión de Stock y Ajustes Manuales con Motivo Obligatorio

As a Pedro (Stock Manager with can_manage_stock capability),
I want to manually adjust stock levels with a required reason (motivo) for each adjustment, creating an audit trail of all stock changes,
So that I can correct discrepancies from physical counts, document write-offs, or record new purchases, with full traceability of who changed what and why.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_manage_stock capability
**When** I access the stock management interface or edit a repuesto
**Then** I see an "Ajustar Stock" button
- And this button is ONLY visible to users with can_manage_stock capability
- And María (technician without can_manage_stock) does NOT see this button

**Given** that I tap/click "Ajustar Stock"
**Then** an adjustment form opens with:
- Repuesto field (auto-filled if editing, or searchable if new)
- Type of adjustment dropdown: "Aumentar Stock" or "Disminuir Stock"
- Quantity field: Number input (required)
- Reason (motivo) textarea (required, max 500 characters)
- Adjustment type dropdown: "Ajuste de Inventario", "Mermas", "Pérdida", "Compra", "Venta", "Corrección de Error"
- "Cancelar" and "Guardar Ajuste" buttons
- And the form is optimized for desktop/tablet use

**Given** that I select "Aumentar Stock" and enter quantity "10"
**When** I choose "Compra" as the adjustment type
**And** I enter reason: "Compra recibida del proveedor. Factura #12345."
**Then** I tap "Guardar Ajuste"
**And** the system:
- Validates that quantity is positive (+10)
- Validates that reason is not empty
- Creates a StockAjuste record:
  - ajuste: +10
  - stockAntes: 4 (current stock)
  - stockDespues: 14 (after adjustment)
  - motivo: "Compra recibida del proveedor. Factura #12345."
  - tipoAjuste: COMPRA
  - userId: my userId
- Updates Repuesto.stockActual: 4 → 14
- Updates Repuesto.updatedAt: now()
- Shows success message: "Stock ajustado exitosamente: Rodamiento SKF-6208 (10 unidades añadidas). Nuevo stock: 14"
- Resolves any active StockAlerta for this repuesto (see Story 5.4)

**Given** that I select "Disminuir Stock" (write-off)
**When** I enter quantity "-3" and choose "Mermas" as type
**And** I enter reason: "3 unidades dañadas por agua, encontradas durante inspección."
**Then** I tap "Guardar Ajuste"
**And** the system:
- Validates that quantity is negative (-3)
- Validates that reason is not empty
- Creates a StockAjuste record:
  - ajuste: -3
  - stockAntes: 14
  - stockDespues: 11
  - motivo: "3 unidades dañadas por agua, encontradas durante inspección."
  - tipoAjuste: MERMA
- Updates Repuesto.stockActual: 14 → 11
- Shows success message: "Stock ajustado exitosamente: Rodamiento SKF-6208 (3 unidades retiradas por merma). Nuevo stock: 11"
- If this new stock is still above minimum, no alert is triggered
- If this new stock reaches minimum, an alert IS triggered (see Story 5.4)

**Given** that I try to save an adjustment without a reason
**When** I leave the motivo field empty and tap "Guardar Ajuste"
**Then** the system shows inline error: "El motivo es obligatorio. Debes explicar por qué haces este ajuste."
- And the form remains open for correction
- And the "Guardar Ajuste" button is disabled until motivo is provided

**Given** that I try to decrease stock below zero
**When** I enter quantity "-50" when current stock is only 14
**Then** the system shows validation error: "Stock insuficiente. Solo hay 14 unidades disponibles, no puedes retirar 50."
- And the stock is NOT updated
- And I must adjust the quantity to a valid number

**Given** that I want to see the complete adjustment history
**When** I access the "Historial de Ajustes" section for a repuesto
**Then** I see a paginated list of all StockAjuste records:
- For each adjustment:
  - Date and time: "2026-03-07 a las 14:35"
  - User: "Pedro (Gestor de Stock)"
  - Type: "Compra" (color-coded)
  - Adjustment: "+10 unidades" (green for increase, red for decrease)
  - Before/After: "4 → 14"
  - Reason: "Compra recibida del proveedor. Factura #12345."
- And the list is ordered newest first
- And I can filter by: Adjustment type, Date range, User
- And I can export the history to CSV

**Given** that I am viewing a repuesto with many adjustments (50+)
**When** I scroll through the adjustment history
**Then** I see summary statistics at the top:
- Total adjustments: "52 ajustes en total"
- Net change: "Stock actual: 14 unidades (inicial: 10, +28 compras, -24 ventas/mermas)"
- Last adjustment: "Hace 2 horas por Pedro (+10, Compra)"
- And this summary helps me understand the repuesto's movement patterns

**Given** that an audit is required
**When** I need to see who made what changes
**Then** every adjustment has full traceability:
- Who made it (userId, name)
- When (timestamp)
- What (quantity change)
- Why (motivo/reason)
- Type of adjustment
- And this creates a complete audit trail for compliance

**Given** that I am making a correction due to data entry error
**When** I choose type "Corrección de Error"
**And** I enter: "Error en conteo inicial. Stock real es 15, no 5."
**And** I adjust +10 units
**Then** the StockAjuste records:
- tipoAjuste: ERROR_CORRECCION
- This adjustment type is flagged for audit review
- And auditors can easily identify corrections vs actual stock movements

**Error Scenarios:**

**Given** that the system is down when I try to save an adjustment
**When** the API call fails
**Then** the system shows error message: "Error al ajustar stock. Por favor intenta nuevamente."
- And the form data is preserved (not lost) for retry

**Given** that I try to adjust stock without can_manage_stock capability
**When** I am María (technician) and try to access "Ajustar Stock"
**Then** the button is not visible
- Or if I try to access via URL directly, I see: "Acceso denegado. No tienes permiso para ajustar stock."
- (Authorization enforcement per Epic 1)

**FRs covered:** FR48 (ajustes manuales), FR49 (motivo obligatorio), FR52 (gestionar stock), FR56 (reporte de resultados - ajustes)

---

## Story 5.6: Generación de Pedidos a Proveedores desde Alertas

As a Pedro (Stock Manager with can_manage_stock capability),
I want to generate purchase orders for spare parts directly from stock minimum alerts, with the system pre-filling order details based on repuesto information and provider associations,
So that I can quickly replenish stock without manually typing all details and ensure timely supply of critical parts.

**Acceptance Criteria:**

**Given** that I receive a stock minimum alert for "Rodamiento SKF-6208"
**When** I tap/click the notification or "Generar Pedido" button
**Then** a purchase order creation form opens with:
- Repuesto field: "Rodamiento SKF-6208" (auto-selected, read-only)
- Current stock: "4 unidades (mínimo: 5)" (display for context)
- Suggested quantity: "11 unidades" (calculated as: (stockMinimo * 3) - stockActual = (5 * 3) - 4 = 11)
- Or I can enter custom quantity if different
- Proveedor dropdown: Shows all providers associated with this repuesto (see Story 5.1)
- If there's a primary provider (esProveedorPrincipal = true), it's pre-selected
- Priority: "Normal" (default) or "Urgente" (if critically low)
- "Fecha requerida" date picker: Default 7 days from now
- Notas field (optional, max 1000 characters): Internal notes for the order
- Estimated cost: Calculated as (cantidad * costoUnitario) = (11 * $1,250.00) = $13,750.00
- "Cancelar" and "Crear Pedido" buttons

**Given** that the form is pre-filled with suggestions
**When** I review the suggested quantity: "11 unidades"
**Then** I see the calculation breakdown:
- "Sugerido: (Mínimo 5 × 3) - Actual 4 = 11 unidades"
- And I can adjust if needed: "8 unidades" or "20 unidades"

**Given** that I need to select a provider
**When** I view the Proveedor dropdown
**Then** I see:
- "Talleres Eléctricos SA" (primary provider ⭐)
  - Lead time: "3 días"
  - Last cost: "$1,250.00/unidad"
  - Last order: "Hace 2 meses"
- "Imports Rodamientos SRL" (secondary provider)
  - Lead time: "7 días"
  - Last cost: "$1,100.00/unidad"
  - Last order: "Hace 6 meses"
- And I can select the most appropriate provider based on lead time and cost

**Given** that I select "Talleres Eléctricos SA" and quantity "11"
**When** I set Fecha requerida to "2026-03-14" (7 days from now)
**And** I add notes: "Urgente. Necesario para reparación de Prensa PH-500."
**And** I tap "Crear Pedido"
**Then** the system:
- Validates that all required fields are filled (repuesto, proveedor, cantidad, fecha)
- Creates a PurchaseOrder record (separate model or table) with:
  - numeroPedido: "PO-20260307-0001" (auto-generated format)
  - repuestoId: references Rodamiento SKF-6208
  - providerId: references Talleres Eléctricos SA
  - cantidad: 11
  - estado: "PENDIENTE" (default)
  - prioridad: "NORMAL" or "URGENTE"
  - fechaRequerida: 2026-03-14
  - notas: "Urgente. Necesario para reparación de Prensa PH-500."
  - costoEstimado: $13,750.00
  - fechaCreacion: now()
  - creadorId: my userId
- Updates the RepuestoProveedor record with latest order details
- Sends notification to Talleres Eléctricos SA (if they have contact configured):
  - Email: "Nuevo pedido: PO-20260307-0001 - 11 unidades de Rodamiento SKF-6208"
  - Or notification via their portal if integrated
- Shows success message: "Pedido PO-20260307-0001 creado exitosamente."
- Adds the pedido to my "Pedidos Activos" dashboard section
- And the stock alert is NOT resolved yet (will be resolved when pedido is received)

**Given** that I want to see all my purchase orders
**When** I access the "/pedidos" route or "Mis Pedidos" section
**Then** I see a dashboard/table with:
- Active orders (estado PENDIENTE or EN_PROGRESO)
- Each order shows:
  - numeroPedido: "PO-20260307-0001"
  - Repuesto: "Rodamiento SKF-6208"
  - Provider: "Talleres Eléctricos SA"
  - Cantidad: "11 unidades"
  - Estado: "PENDIENTE" (amber) or "EN_PROGRESO" (green) or "RECIBIDO" (blue)
  - Fecha requerida: "2026-03-14"
  - Acciones: "Ver Detalles", "Recibir", "Cancelar" buttons
- And I can sort by fecha, proveedor, repuesto
- And I can filter by estado

**Given** that a purchase order is received from the provider
**When** I access the order details and tap "Recibir"
**Then** a confirmation form opens:
- "¿Confirmar recepción de este pedido?"
- Date picker: "Fecha de recepción" (default today)
- Quantity received field (default matches ordered quantity, editable for partial receipts)
- "Recibir Parcialmente" option (if only part of order arrived)
- Quality check checkboxes: "Sin daños", "Cantidad correcta", "Documentos completos"
- "Cancelar" and "Confirmar Recepción" buttons
**When** I confirm with full quantity
**Then** the system:
- Updates PurchaseOrder estado: "RECIBIDO"
- Sets fechaRecepcion to current date
- Creates a StockAjuste to increase stock:
  - ajuste: +11
  - tipoAjuste: COMPRA
  - motivo: "Recibido de pedido PO-20260307-0001"
- Updates Repuesto.stockActual: adds 11 units
- Resolves the StockAlerta if this was the triggering alert
- Shows success message: "Pedido recibido. Stock actualizado: 4 → 15 unidades."
- Sends notification to Talleres Eléctricos SA: "Recepción confirmada. Gracias por el pedido."
- And the order moves to "Pedidos Completados" section

**Given** that the order was received partially (only 8 of 11 units)
**When** I confirm partial receipt
**Then** the system:
- Updates PurchaseOrder with notes about partial receipt
- Creates a StockAjuste for +8 units
- Updates stock: +8
- Leaves order status as "EN_PROGRESO" (still waiting for remaining 3 units)
- Shows success message: "Recepción parcial registrada. Stock actualizado: +8 unidades. Faltan 3 unidades."
- And I can receive the remaining units later

**Given** that I need to cancel a purchase order
**When** I access an order in PENDIENTE state and tap "Cancelar"
**Then** a confirmation dialog appears: "¿Cancelar este pedido? Esta acción no se puede deshacer."
**And** if I confirm:
- The order estado changes to "CANCELADO"
- A cancellation note is added: "Cancelado por Pedro - Razón: Innecesario"
- Notification is sent to provider: "Pedido PO-20260307-0001 cancelado por el cliente."
- Stock alert remains active (stock still at minimum)
- I see success message: "Pedido cancelado."

**Given** that I want to view order details
**When** I tap/click on a purchase order
**Then** a modal opens with complete order details:
- All order fields (numeroPedido, repuesto, proveedor, cantidad, estado, fechas, notas)
- Line items (if multiple parts in one order)
- Order history timeline:
  - "2026-03-07: Pedido creado"
  - "2026-03-08: Proveedor confirmó fecha de envío"
  - "2026-03-14: Recibido parcialmente (+8 unidades)"
- Associated stock alert (if any)
- Actions: "Recibir", "Cancelar", "Ver Seguimiento" (if provider tracking available)
- Notes from provider or internal communications

**Given** that I want to export purchase orders
**When** I access the pedidos view and tap "Exportar"
**Then** I can export to Excel (.xlsx) or PDF
- The export includes all order details in a professional format
- And I can send this via email to suppliers or keep for records

**Performance:**

**Given** that I need to create multiple orders quickly
**When** 5 alerts trigger at once
**Then** I can generate 5 purchase orders in sequence
- Each form is pre-filled, so creation takes <1 minute each
- Total time: ~5 minutes for 5 orders vs 30+ minutes manually

**FRs covered:** FR51 (generar pedidos a proveedores), FR53 (asociar repuestos con proveedores), FR56 (reporte de resultados), FR48-49 (ajustes manuales - contexto)

---

## Story 5.7: Importación Masiva CSV de Repuestos con Validación

As a Pedro (Stock Manager with can_manage_stock capability),
I want to import spare parts massively from a CSV file with automatic validation of provider existence and location formats, creating all parts in one operation,
So that I can quickly populate the repuesto catalog from existing spreadsheets without manual data entry for hundreds of parts.

**Acceptance Criteria:**

**Given** that I am logged in as a user with can_manage_stock capability
**When** I access the `/repuestos/importar` route or "Importar CSV" button
**Then** I see an import wizard with 3 steps:
- **Step 1:** Upload CSV file
- **Step 2:** Review and validate
- **Step 3:** Confirm and import

**Step 1: Upload CSV File**

**Given** that I am on Step 1 of the import wizard
**When** I view the upload interface
**Then** I see:
- File upload area with drag-and-drop zone: "Arrastra tu archivo CSV aquí o haz clic para seleccionar"
- "Seleccionar Archivo" button
- Download template button: "Descargar Plantilla CSV"
- Format instructions: "El archivo CSV debe tener las siguientes columnas: nombre (requerido), codigo (opcional), descripcion (opcional), stock_actual (requerido, default 0), stock_minimo (requerido, default 5), ubicacion_almacen (requerido, formato: 'Estante X, Cajón Y'), proveedor_nombre (opcional), costo_unitario (opcional)"
- "Validar y Continuar" button

**Given** that I click "Descargar Plantilla CSV"
**When** I download the template
**Then** a CSV file is downloaded with:
- Headers: nombre, codigo, descripcion, stock_actual, stock_minimo, ubicacion_almacen, proveedor_nombre, costo_unitario
- Example rows filled with sample data to show format
- Instructions tab in the file explaining each column

**Given** that I have prepared my CSV file
**When** I drag-and-drop it or select via "Seleccionar Archivo"
**Then** the system:
- Validates the file is a CSV (.csv extension)
- Shows file name: "repuestos_importacion_20260307.csv"
- Shows file size: "245 KB"
- Shows row count preview: "150 repuestos detectados"
- "Validar y Continuar" button is enabled

**Given** that the file is uploaded and validated for CSV format
**When** I tap "Validar y Continuar"
**Then** the system proceeds to Step 2 (Review and Validate)

**Step 2: Review and Validate**

**Given** that I am on Step 2 of the import wizard
**When** the system analyzes the CSV
**Then** it validates each row and shows:
- Total rows detected: "150 repuestos encontrados"
- Valid rows: "145 válidos"
- Invalid rows: "5 con errores"
- Validation summary table with:
  - Row number
  - Status: "✓ Válido" or "❌ Error"
  - Repuesto name
  - Error description (if invalid): "Proveedor 'Talleres XYZ' no encontrado en catálogo"
  - Action needed: "Crear proveedor" or "Corregir ubicación" or "Ignorar fila"

**Validation Rules:**

**Given** that the system validates each row
**When** it checks the required fields
**Then** the following validations are performed:
- nombre: Required, max 200 characters, must not be empty
- codigo: Optional, must be unique if provided (check for duplicates in CSV and existing DB)
- stock_actual: Required, must be >= 0, integer
- stock_minimo: Required, must be >= 0, integer
- ubicacion_almacen: Required, must match pattern "Estante [A-Z], Cajón [0-9]+"
- proveedor_nombre: Optional, if provided, must exist in Provider catalog
- costo_unitario: Optional, if provided, must be >= 0, decimal format

**Given** that a row has validation errors
**When** I view the error summary
**Then** I see for each invalid row:
- Row 15: "Error: Proveedor 'Talleres XYZ' no encontrado. ¿Deseas crear proveedor y continuar?"
- Row 42: "Error: Ubicación 'Estante Z, Cajón 999' formato inválido. Debe ser 'Estante A-Z, Cajón 0-999'."
- Row 87: "Error: Código 'ROD-123' ya existe en base de datos. Código debe ser único."
- Row 103: "Error: stock_actual (-5) no puede ser negativo."
- Row 120: "Error: nombre vacío. Este campo es requerido."

**Given** that I see the validation summary
**When** I review the errors
**Then** I have options for each error row:
- "Ignorar fila" - Skip this repuesto (won't be imported)
- "Corregir en CSV" - Manually fix in CSV file and re-upload
- "Crear proveedor" - For row 15, auto-create provider (if I have can_manage_providers permission)
- "Usar proveedor existente" - Select an alternative provider from dropdown
- "Editar datos" - Manually edit the data in the wizard before import

**Given** that I select "Crear proveedor" for row 15
**When** I confirm
**Then** the system:
- Creates a new Provider record with:
  - name: "Talleres XYZ"
  - providerType: "Repuestos" (detected from context)
  - isActive: true
- Shows success message: "Proveedor Talleres XYZ creado exitosamente."
- Re-validates row 15 as valid now
- Updates validation summary: "145 válidos, 4 con errores"

**Given** that I select "Usar proveedor existente" for row 42
**When** I choose an alternative provider from dropdown
**Then** the system updates the row with the selected provider
- And re-validates the row

**Given** that I click "Editar datos" for row 103
**When** I change stock_actual from -5 to 5
**And** I change codigo from "ROD-123" to "ROD-124"
**Then** the system updates the row
- And re-validates the row
- And the row status changes to "✓ Válido"

**Given** that I have reviewed all errors and made corrections
**When** I have 145 valid rows (5 ignored)
**And** I tap "Continuar a Importación" (Step 3)
**Then** the system proceeds to Step 3 (Confirm and Import)

**Step 3: Confirm and Import**

**Given** that I am on Step 3 of the import wizard
**When** I view the confirmation summary
**Then** I see:
- Import summary: "145 repuestos listos para importar"
- Database impact: "145 nuevos repuestos serán creados"
- Provider associations: "25 repuestos asociados a 5 proveedores diferentes"
- Estimated time: "Aproximadamente 2-5 minutos"
- Progress indicator with steps:
  1. "Creando registros en base de datos"
  2. "Validando restricciones únicas"
  3. "Finalizando importación"
- "Confirmar Importación" button
- "Cancelar" button

**Given** that I tap "Confirmar Importación"
**Then** the system:
- Begins the import process with progress indicator
- Shows step 1 status: "Creando registros en base de datos..."
- Creates 145 Repuesto records in batch (uses Prisma createMany for efficiency)
- Validates unique constraints (codigo) before insertion
- Creates RepuestoProveedor associations for rows with providers
- Shows step 2 status: "Validando restricciones únicas..."
- If duplicate codes are found, shows: "Error: Códigos duplicados encontrados. Por favor revisa." and stops
- Shows step 3 status: "Finalizando importación..."
- Generates a final report:
  - "Importación completada exitosamente"
  - "145 repuestos creados"
  - "25 proveedores asociados"
  - "0 errores"
- Shows a download link: "Descargar Reporte de Importación"
- The report file includes:
  - List of all imported repuestos with their IDs
  - List of provider associations created
  - Any warnings or info messages
  - Timestamp of import

**Given** that the import is successful
**When** I view the repuesto catalog
**Then** I see all 145 newly imported repuestos
- And they are immediately available for use in OTs
- And Pedro and María can see them in their catalogs

**Error Scenarios:**

**Given** that there are duplicate codes in the CSV
**When** the system validates during import
**Then** the import stops with error:
- "Error: 3 códigos duplicados encontrados: ROD-123 (filas 10, 45, 87). Cada código debe ser único."
- And the import is rolled back (no repuestos created)
- And I must fix the duplicates and re-upload

**Given** that a provider is not found and I choose not to create it
**When** I select "Ignorar fila" for those rows
**Then** those repuestos are skipped during import
- And I see summary: "140 repuestos importados, 5 filas ignoradas"

**Given** that the system is down during import
**When** the API call fails mid-process
**Then** the system shows error message: "Error de importación. Por favor intenta nuevamente."
- And any partial import is rolled back to ensure data consistency

**Performance Validation:**

**Given** that I am importing a large file
**When** the CSV has 1,000 repuestos
**Then** the import completes in <5 minutes (NFR-P7)
- And the progress indicator updates every 10%
- And the system remains responsive during import

**Given** that I need to import repuestos regularly
**When** I perform monthly updates
**Then** I can:
- Update existing repuestos (matching by codigo)
- Add new repuestos
- Mark obsolete repuestos as inactive
- And the system handles both creation and updates in one import

**FRs covered:** FR54 (importar CSV), FR55 (validación proveedores y ubicaciones), FR56 (reporte de resultados), FR53 (asociar con proveedores), FR52 (gestionar stock)

---

## Epic 5 Completion Criteria

**Epic 5 is complete when:**
- ✅ All 7 stories are implemented with passing acceptance criteria
- ✅ Pedro can manage stock with full audit trail
- ✅ María can use parts in OTs with silent stock updates
- ✅ All users can see stock and location without special permissions
- ✅ Pedro receives alerts only at minimum threshold (no spam)
- ✅ Purchase orders can be generated from alerts
- ✅ CSV import works with validation
- ✅ All FR44-FR56 are covered and tested
- ✅ Performance NFRs met (<200ms search, <1s stock updates)

**Dependencies Satisfied:**
- Epic 1: Authentication and capabilities (can_manage_stock)
- Epic 2: Asset hierarchy (repuestos asociados a componentes)

**Next Epic Enabled:**
- Epic 4: OTs can now track parts used (Story 4.5)
- Epic 8: KPIs can track stock turnover

**Value Delivered:**
- Pedro: "Qué paz. Solo me avisan cuando necesito actuar."
- María: "Veo stock y ubicación al seleccionar repuestos."
- Pedro ahorra 2+ horas diarias (sin interrupciones)
- Efficient stock management without constant manual counting

**Technical Achievements:**
- Real-time stock updates (1 second) via SSE
- Silent updates (no spam for every part used)
- Audit trail for all stock adjustments
- CSV import with validation and error reporting
- Minimum threshold alerts with actionable notifications
- Multi-provider association support
- Full traceability: who changed what stock and why

---

**Epic 5 Documentation Complete**
- Date: 2026-03-07
- Version: 2.0 (Complete format)
- Stories: 7 (all expanded to full Given/When/Then format)
- Total Estimated Effort: 35-45 story points (approx 4-5 sprints)
- Previous Epic: 4 (Órdenes de Trabajo)
- Next Epic: 6 (Gestión de Proveedores)
