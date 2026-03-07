# Web App Specific Requirements

## Project-Type Overview

**gmao-hiansa** es una **Web App Responsiva** construida como aplicación web interactiva moderna, diseñada para funcionar en entornos industriales (fábricas metalúrgicas). Es una aplicación de interfaz única empresarial interna que combina capacidades de escritorio y móvil en una sola base de código, optimizada para dispositivos táctiles y accesible exclusivamente desde navegadores Chrome y Edge.

**Características clave:**
- **Carga dinámica de contenido:** Client Components para interactividad (no necesita SEO al ser app interna)
- **Always online:** Requiere conexión a internet (NO hay modo offline)
- **Navegadores soportados:** Chrome y Edge (motores Chromium) solamente
- **Uso interno:** Aplicación empresarial interna, accesible desde red corporativa

## Responsive Design

- **Desktop (>1200px):** Dashboard completo, Kanban expandido
- **Tablet (768px-1200px):** Kanban 2 columnas, dashboard adaptado
- **Móvil (<768px):** 1 columna, navegación hamburguesa, botones 44x44px

## Performance Targets

- **Búsqueda predictiva:** <200ms
- **Carga inicial SPA:** <3s (first paint)
- **Transiciones vistas:** <100ms
- **Websocket heartbeat:** 30 segundos

## Browser Support

- ✅ Chrome (últimas 2 versiones)
- ✅ Edge (últimas 2 versiones, Chromium)
- ❌ Firefox, Safari, IE: NO soportados

## SEO Strategy

**NO aplica SEO** - Aplicación web interna, no pública, no indexada por buscadores.

## Accessibility Level

**Accesibilidad básica industrial:**

- Contraste WCAG AA (4.5:1) para luz de fábrica
- Texto: 16px cuerpo, 20px títulos
- Touch targets: 44x44px mínimo
- Zoom: 200% sin romper layout

## Implementation Considerations

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
