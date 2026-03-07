# Epic 4: Órdenes de Trabajo y Kanban Digital

Permitir a técnicos como María y supervisores como Javier gestionar el ciclo de vida completo de Órdenes de Trabajo con 8 estados (Pendiente, Asignada, En Progreso, Pendiente Repuesto, Pendiente Parada, Reparación Externa, Completada, Descartada), Kanban digital de 8 columnas con código de colores (7 tipos visuales), asignación múltiple de 1-3 técnicos o proveedores, vista de listado con filtros, capacidad de agregar repuestos usados, notas internas, comentarios con timestamp y fotos antes/después de la reparación.

**FRs cubiertos:** FR11-FR31 (21 requerimientos funcionales)
**Usuario principal:** María (Técnica), Javier (Supervisor)
**Dependencias:** Epic 1, Epic 2, Epic 3

## Story 4.1: Modelo de Datos de Órdenes de Trabajo

Crear modelo Prisma con 8 estados, tipo mantenimiento, asignación múltiple y relaciones.

## Story 4.2: Creación Manual de OTs

Elena y Javier pueden crear OTs sin aviso previo.

## Story 4.3: Kanban Digital 8 Columnas

Javier gestiona visualmente todas las OTs en tablero Kanban con código de colores.

## Story 4.4: Gestión de Estados por Técnico

María cambia estado de sus OTs (ASIGNADA→EN PROGRESO→COMPLETADA).

## Story 4.5: Asignación Múltiple 1-3 Técnicos/Proveedores

Javier asigna múltiples usuarios a cada OT.

## Story 4.6: Confirmación Recepción Reparación Externa

Confirmar recepción de equipo cuando proveedor lo devuelve.

## Story 4.7: Vista Listado con Filtros Avanzados

Tabla paginada con filtros por 5 criterios y ordenamiento.

## Story 4.8: Comentarios, Fotos y Notas

Documentación con comentarios timestamp, fotos antes/después.

## Story 4.9: Sincronización SSE y Toggle Vistas

Actualizaciones en tiempo real cada 30s via SSE, alternar Kanban/Listado.

---
