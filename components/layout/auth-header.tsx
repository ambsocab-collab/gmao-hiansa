/**
 * Auth Header Component
 *
 * Header with Hiansa logo (white on red background), user info, and logout button
 * Displayed on all authenticated pages
 *
 * Story 1.5: Layout Desktop Optimizado y Logo Integrado
 *
 * @component
 */

'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HiansaLogo from '@/components/brand/hiansa-logo'
import HamburgerButton from './hamburger-button'

/**
 * Auth header component displayed on authenticated pages
 * Shows: Logo (white), user greeting, avatar, logout button
 */
export default function AuthHeader() {
  const { data: session } = useSession()

  // Get user's initials for avatar
  const initials = session?.user?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U'

  return (
    <header className="bg-primary shadow-sm border-b border-border sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Botón Hamburguesa - Mobile/Tablet only */}
          <HamburgerButton />

          {/* Story 1.5 AC1: Hiansa Logo in header - WHITE on red background */}
          <div className="flex-shrink-0 text-primary-foreground">
            <HiansaLogo size="md" className="w-48 h-12" data-testid="header-logo" />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Avatar with dropdown trigger - Link to profile */}
            <Link href="/perfil" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-sm text-primary-foreground font-medium">
                Hola, {session?.user?.name}
              </span>
              <div
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-sm font-medium"
                data-testid="user-avatar"
              >
                {initials}
              </div>
            </Link>

            {/* Logout Button */}
            <form action="/api/auth/signout" method="POST">
              <Button type="submit" variant="secondary" size="sm" data-testid="logout-button">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
