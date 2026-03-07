# Executive Summary

**gmao-hiansa** es un GMAO (Gestión de Mantenimiento Asistido por Ordenador) **single-tenant optimizado** diseñado específicamente para una empresa del sector metal con dos plantas especializadas (acero perfilado y panel sandwich). La solución transforma un departamento de mantenimiento puramente reactivo que opera con herramientas dispersas (Excel, WhatsApp, pizarra Kanban física) en una organización profesional, controlada y basada en datos mediante una PWA (Progressive Web App) completamente amoldada a las necesidades reales del negocio.

**Problema resuelto:** El departamento opera con información fragmentada en celulares personales (WhatsApp), múltiples versiones de Excel sin "fuente única de verdad", y visibilidad limitada a quienes están físicamente presentes. Esto genera pérdida de tiempo productivo, paradas de producción por falta de repuestos, fallas recurrentes, dependencia crítica de personas, e incapacidad de medir y mejorar el desempeño. El problema profundo no es tecnológico sino cultural: un departamento percibido como "caótico" que necesita transicionar de reactivo a proactivo.

**Usuarios objetivo:** Operarios de línea (reportan averías en segundos, reciben feedback inmediato), técnicos de mantenimiento (trabajo organizado con visibilidad clara de tareas), supervisores (control visual de carga de equipo), y administradores (toma de decisiones basada en KPIs). Público general consume dashboards transparencia en área común.

**Solución:** MVP con 13 funcionalidades base (aviso de averías, control de activos, generación de OT, control de repuestos, Kanban digital, KPIs, gestión de usuarios con 15 capacidades PBAC, proveedores, componentes multi-equipos, rutinas, PWA, reparación dual, reportes automáticos por email) sobre arquitectura diseñada para crecimiento progresivo. El sistema integra las 35 funcionalidades innovadoras del brainstorming en fases posteriores según necesidad evolutiva.

**Modelo de Autorización:** Sistema PBAC (Permission-Based Access Control) con 15 capacidades granulares que permiten flexibilidad completa en la asignación de permisos. Las capacidades se asignan individualmente a usuarios. El sistema permite gestión dinámica de permisos sin necesidad de roles o estructuras predefinidas.

**Visión de éxito:** Departamento transformado de "caótico" a "profesional" con cultura de datos establecida. Operarios sienten "mi voz importa" al reportar y recibir confirmación. Técnicos preguntan "¿cómo hacíamos antes sin esto?". Dashboard público genera transparencia total. Decisión de mantenimiento fundamentada en MTTR/MTBF, no intuición.

## What Makes This Special

**Diferenciación fundamental:** Arquitectura **single-tenant optimizada** (no SaaS multi-tenant) permite personalización profunda imposible en soluciones genéricas. La herramienta se amolda completamente al flujo real de la empresa, no al revés. Incluye 35 ideas de innovación (SCAMPER, First Principles, Reverse Brainstorming, Six Thinking Hats) para integración progresiva según necesidad real del departamento, no según roadmap de producto genérico.

**Core insight:** GMAOs del mercado (IBM Maximo, SAP PM, Infraspeak, Fracttal) son exceso de funcionalidades (bloatware) con 500+ características que nunca se usarán, diseñados para servir a miles de empresas no para personalizarse profundamente, curva de aprendizaje alta, costo prohibitivo, y rigidez de "adáptate a nuestro flujo". **gmao-hiansa** es lo opuesto: MVP enfocado con bases sólidas, sin sobrecarga inicial, crecimiento orgánico, y diseñado por quien experimentó el problema real (Excel + WhatsApp + pizarra).

**Enfoque progresivo inteligente:** MVP establece fundamentales (aviso → OT → ejecución → KPIs). Fase 2 (6 meses): estructura completa, búsqueda predictiva universal, plantillas de equipos. Fase 3 (12 meses): stock y reparación avanzada, QR tracking. Fase 4 (18 meses): optimización, predicción sin IoT, dashboards progresivos. Usuarios no se abruman con funcionalidades que no usarán; sistema crece con ellos.

**Diferenciador UX:** Reporte de avería en <30 segundos con búsqueda predictiva (vs 2-5 minutos actuales). Notificaciones push transparencia estado: "recibido", "autorizado", "en progreso", "completado". Operario pasa de "¿para qué reporto si no hacen caso?" a "siento que me escuchan". Supervisor gestiona visualmente sin llamar técnicos. Admin tiene dashboard ejecutivo sin buscar en 3 Excels diferentes.

**Transformación cultural no solo tecnológica:** Sistema crea cultura de datos mediante dashboards públicos (MTTR, MTBF, OTs abiertas/completadas, técnicos activos) visibles en toda la fábrica. Genera transparencia → profesionalización → confianza. Métricas establecen mejora continua (MTBF bajo → mantenimiento específico). Proactividad reemplaza "apagar fuegos".

**Clasificación del Proyecto:** Web App Responsiva de complejidad media, greenfield (desde cero), single-tenant optimizado para una empresa metalúrgica específica.

---

Con esta visión clara, pasamos a definir los criterios de éxito que validarán que estamos construyendo el producto correcto.
