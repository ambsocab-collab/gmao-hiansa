/**
 * Utilidades para Server-Sent Events (SSE)
 * SSE se usa en lugar de WebSockets para compatibilidad con Vercel serverless
 */

export function createSSEStream() {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      // Heartbeat cada 30 segundos para mantener la conexión viva
      const heartbeat = setInterval(() => {
        const data = `event: heartbeat\ndata: {"timestamp":${Date.now()}}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 30000)

      // Cleanup cuando se cierra la conexión
      return () => clearInterval(heartbeat)
    }
  })
}

export function sendSSEEvent(
  controller: ReadableStreamDefaultController,
  event: string,
  data: any
) {
  const encoder = new TextEncoder()
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  controller.enqueue(encoder.encode(message))
}
