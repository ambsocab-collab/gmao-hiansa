export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Bienvenido a GMAO Hiansa
        </h2>
        <p className="text-muted-foreground">
          Sistema de gestión de mantenimiento industrial
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Reporte de Averías</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Reporte averías en segundos con notificaciones en tiempo real
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Órdenes de Trabajo</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Kanban digital de 8 columnas con gestión completa de OTs
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Control de Stock</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Control de repuestos en tiempo real con alertas automáticas
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6 bg-muted/50">
        <p className="text-sm text-center text-muted-foreground">
          Estado: Configuración inicial completada. Próximos pasos: Implementación de autenticación y gestión de usuarios.
        </p>
      </div>
    </div>
  )
}
