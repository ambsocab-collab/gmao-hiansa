/**
 * Landing Page Minimalista
 * Story 1.4: Landing Page Minimalista
 *
 * Muestra una landing page elegante con la identidad de marca Hiansa
 * - Fondo rojo burdeos #7D1220 con gradiente sutil
 * - Logo SVG Hiansa centrado en blanco y tamaño responsive
 * - Texto "GMAO" elegante y pequeño con tracking amplio
 * - Descripción "sistema de gestión de mantenimiento asistido por ordenador"
 * - Botón "Acceder al Sistema" con sombra sutil
 * - Footer integrado en el cuerpo
 */

import { auth } from '@/lib/auth-adapter'
import { redirect } from 'next/navigation'
import HiansaLogo from '@/components/brand/hiansa-logo'
import Link from 'next/link'

export default async function HomePage() {
  // AC2: Server-side auth redirect
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main
      className="
        min-h-screen flex flex-col items-center justify-center px-4 py-8
        bg-gradient-to-b from-[#7D1220] to-[#6a0e1b]
        animate-in fade-in duration-500 ease-out
        motion-reduce:animate-none
      "
    >
      {/* Logo Hiansa SVG - Responsive para llenar pantalla */}
      <div className="mb-6 text-white drop-shadow-2xl w-full flex justify-center">
        <HiansaLogo
          size="lg"
          className="
            w-[984px]            /* Desktop: grande */
            md:w-[840px]         /* Tablet: mediano */
            w-[90%]             /* Mobile: 90% del ancho disponible */
            max-w-[984px]       /* Máximo tamaño absoluto */
          "
          style={{
            height: 'auto',
            color: 'white',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>

      {/* Texto GMAO - Pequeño, elegante y profesional */}
      <div className="
        text-[30px]            /* Desktop: elegante y pequeño */
        md:text-[26px]         /* Tablet: ligeramente más pequeño */
        text-[20px]            /* Mobile: más compacto */
        font-bold text-white mb-3 text-center
        tracking-[0.3em] uppercase
      ">
        GMAO
      </div>

      {/* Descripción debajo de GMAO - Más sutil */}
      <p className="
        text-sm             /* Desktop: 14px elegante */
        text-xs             /* Mobile/tablet: 12px compacto */
        text-white/60 text-center mb-16 max-w-2xl leading-relaxed
      ">
        sistema de gestión de mantenimiento asistido por ordenador
      </p>

      {/* Botón CTA - Con sombra y mejor espaciado */}
      <Link href="/login" className="w-full md:w-auto mb-16">
        <button
          className="
            bg-white text-[#7D1220]
            px-10 py-4
            rounded-xl font-semibold text-base
            hover:bg-gray-50 hover:scale-105
            hover:shadow-2xl
            transition-all duration-300
            focus:outline-2 focus:outline-white focus:outline-offset-2
            w-full
            md:w-auto
            motion-reduce:hover:scale-100
            shadow-lg
          "
          aria-label="Acceder al sistema de GMAO"
        >
          Acceder al Sistema
        </button>
      </Link>

      {/* Footer integrado en el cuerpo - Más sutil */}
      <div className="text-white/40 text-xs text-center tracking-wide">
        powered by hiansa BSC
      </div>
    </main>
  )
}


