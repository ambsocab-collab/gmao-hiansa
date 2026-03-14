import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

// Configuración de fuente Inter con escala completa (12px a 36px)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GMAO Hiansa - Gestión de Mantenimiento Asistido por Ordenador',
  description: 'Sistema de gestión de mantenimiento industrial con reporte de averías en segundos, kanban digital de órdenes de trabajo y control de stock en tiempo real.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Detectar si estamos en la landing page (/)
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'

  const isLandingPage = pathname === '/'

  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          {/* Header - NO mostrar en landing page */}
          {!isLandingPage && (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center">
                <h1 className="text-xl font-bold">GMAO Hiansa</h1>
              </div>
            </header>
          )}

          {/* Main content */}
          <main className={isLandingPage ? '' : 'flex-1 container py-6'}>
            {children}
          </main>

          {/* Footer - NO mostrar en landing page */}
          {!isLandingPage && (
            <footer className="border-t py-6">
              <div className="container text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} GMAO Hiansa. Todos los derechos reservados.
              </div>
            </footer>
          )}
        </div>

        {/* Toast notification container */}
        <Toaster />
      </body>
    </html>
  )
}
