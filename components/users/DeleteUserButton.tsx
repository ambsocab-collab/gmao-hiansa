'use client'

/**
 * DeleteUserButton Component
 * Story 1.1: Login, Registro y Perfil de Usuario
 *
 * Client component for deleting users with confirmation modal
 * Implements soft delete with confirmation dialog
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface DeleteUserButtonProps {
  userId: string
  userName: string
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // Call the deleteUser Server Action
      const response = await fetch('/api/v1/users/' + userId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar usuario')
      }

      // Close modal and redirect to users list
      setIsOpen(false)
      router.push('/usuarios')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        data-testid="delete-user-button"
        onClick={() => setIsOpen(true)}
      >
        Eliminar Usuario
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent data-testid="delete-confirmation-modal">
          <DialogHeader>
            <DialogTitle>¿Estás seguro de eliminar {userName}?</DialogTitle>
            <DialogDescription>
              Esta acción marcará al usuario como eliminado (soft delete). El usuario no podrá iniciar sesión
              después de la eliminación. Esta acción se puede deshacer por un administrador.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
