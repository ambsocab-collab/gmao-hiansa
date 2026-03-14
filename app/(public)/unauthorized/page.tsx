import Link from 'next/link';

/**
 * Unauthorized Page - SSR-safe with Link components
 */

export const metadata = {
  title: 'Acceso Denegado',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.532-3L16.836 4.5c-.96-1.682-1.186-3.71-1.186-5.71 0-4.143 2.686-7.65 6.316-8.596C12.19 2.099 14 5.169 14 8.5c0 3.866-1.81 7.401-4.684 8.596M8 4a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="unauthorized-title">
          Acceso Denegado
        </h1>

        <p className="text-gray-700 mb-2" data-testid="unauthorized-message">
          No tienes permiso para acceder a esta página.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            No tienes las capacidades necesarias para acceder a esta sección.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-center inline-block"
            data-testid="back-button"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
