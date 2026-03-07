# Epic 5: Control de Stock y Repuestos

Permitir a gestores como Pedro controlar stock de repuestos en tiempo real con ubicación física visible, actualizaciones silenciosas, alertas solo por stock mínimo.

**FRs:** FR16, FR44-FR56 (14 FRs)
**Usuario:** Pedro (can_manage_stock), María (usa repuestos)

## Story 5.1: Modelo de Datos de Repuestos de Stock

Crear tabla RepuestoStock con campos: stockActual, stockMinimo, ubicacionAlmacen, proveedorId.

## Story 5.2: Vista de Stock en Tiempo Real

Todos los usuarios ven stock actualizado en tiempo real (1s, silencioso).

## Story 5.3: Actualización Silenciosa de Stock

Cuando María usa repuestos en OT, stock actualiza sin notificar a Pedro.

## Story 5.4: Alertas de Stock Mínimo

Pedro recibe alertas solo al alcanzar stock mínimo (no spam por cada uso).

## Story 5.5: Gestión de Stock y Ajustes Manuales

Pedro gestiona stock, hace ajustes manuales con motivo obligatorio.

## Story 5.6: Generación de Pedidos a Proveedores

Pedro genera pedidos desde alertas de stock mínimo.

## Story 5.7: Importación Masiva CSV de Repuestos

Importar repuestos masivamente desde CSV con validación.

---
