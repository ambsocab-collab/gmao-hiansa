/**
 * Providers Component
 *
 * Wraps the application with necessary context providers
 * Includes SessionProvider for next-auth
 *
 * @component
 */

'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Providers wrapper component
 * Adds SessionProvider for next-auth to work with useSession hook
 */
export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}
