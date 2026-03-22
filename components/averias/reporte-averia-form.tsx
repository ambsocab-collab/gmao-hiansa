'use client'

/**
 * Reporte Avería Form Component
 * Story 2.2: Formulario Reporte de Avería (Mobile First)
 *
 * Client Component para reportar averías
 * - React Hook Form + Zod validation
 * - Integración con EquipoSearch (Story 2.1)
 * - Textarea para descripción con altura 80-200px
 * - File upload para foto con preview
 * - Mobile First layout (single column <768px, two columns >1200px)
 * - Toast notifications (shadcn/ui)
 * - CTA: "+ Reportar Avería" (#7D1220, 56px height)
 */

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EquipoSearch, type EquipoWithHierarchy } from '@/components/equipos/equipo-search'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createFailureReport } from '@/app/actions/averias'
import { reporteAveriaSchema, type ReporteAveriaInput } from '@/lib/utils/validations/averias'
import { uploadImageToBlob } from '@/lib/storage/image-upload'

interface ReporteAveriaFormProps {
  userId: string // User ID from session
}

export function ReporteAveriaForm({ userId }: ReporteAveriaFormProps) {
  const [selectedEquipo, setSelectedEquipo] = useState<EquipoWithHierarchy | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  // React Hook Form con Zod validation
  const methods = useForm<ReporteAveriaInput>({
    resolver: zodResolver(reporteAveriaSchema),
    defaultValues: {
      equipoId: '',
      descripcion: '',
      reportadoPor: userId,
      fotoUrl: undefined, // undefined para que optional funcione correctamente
    },
    mode: 'onSubmit', // Validate all fields on submit for E2E tests
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = methods

  /**
   * Handle equipo selection from EquipoSearch
   * Updates form value when equipo is selected
   */
  const handleEquipoSelect = (equipo: EquipoWithHierarchy | null) => {
    setSelectedEquipo(equipo)
    if (equipo) {
      setValue('equipoId', equipo.id)
      clearErrors('equipoId')
    } else {
      setValue('equipoId', '')
    }
  }

  /**
   * Handle photo upload
   * Uploads to Vercel Blob Storage and shows preview
   */
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setFotoPreview(null)
      setValue('fotoUrl', '')
      return
    }

    try {
      // Upload to Vercel Blob Storage
      const result = await uploadImageToBlob(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'],
      })

      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Store URL in form
      setValue('fotoUrl', result.url)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al subir la foto',
        variant: 'destructive',
      })
      // Reset file input
      e.target.value = ''
    }
  }

  /**
   * Handle form submission
   * Validates equipo is selected, submits to Server Action
   * Redirects to /mis-avisos on success
   */
  const onSubmit = async (data: ReporteAveriaInput) => {
    // Validate equipo is selected (even though it's required by Zod)
    if (!selectedEquipo) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un equipo',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      try {
        // Call Server Action
        const result = await createFailureReport({
          ...data,
          equipoId: selectedEquipo.id,
          reportadoPor: userId,
        })

        // Show success toast
        if (result?.numero) {
          toast({
            title: 'Avería reportada',
            description: `Avería #${result.numero} reportada exitosamente`,
          })

          // Redirect to dashboard (mis-avisos route doesn't exist yet)
          router.push('/dashboard')
        }
      } catch (error) {
        // Show error toast
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Ocurrió un error al reportar la avería',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Desktop Layout: Two columns (>1200px) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Equipo + Descripción */}
        <div className="space-y-6">
          {/* Equipo Search - Reutilizar de Story 2.1 */}
          <div>
            <label htmlFor="equipo-search" className="block text-sm font-medium text-gray-900 mb-2">
              Equipo <span className="text-red-500">*</span>
            </label>
            <EquipoSearch
              value={selectedEquipo}
              onChange={handleEquipoSelect}
              data-testid="equipo-search"
            />
            {errors.equipoId && (
              <p className="text-red-500 text-sm mt-1">{errors.equipoId.message}</p>
            )}
          </div>

          {/* Descripción del problema */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-900 mb-2">
              Descripción del problema <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              data-testid="averia-descripcion"
              placeholder="Describe brevemente la falla..."
              className={`w-full px-3 py-2 border rounded-lg resize-y min-h-[80px] max-h-[200px] focus:outline-none focus:ring-2 ${
                errors.descripcion
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-transparent focus:ring-red-800'
              }`}
              {...register('descripcion')}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.descripcion.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Foto + Preview */}
        <div>
          {/* Foto Upload */}
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-900 mb-2">
              Adjuntar foto <span className="text-gray-500">(opcional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <input
                id="foto"
                type="file"
                accept="image/jpeg,image/png"
                data-testid="averia-foto-upload"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                onChange={handleFotoChange}
              />
              <p className="text-xs text-gray-500 mt-2">JPEG, PNG máx. 5MB</p>
            </div>

            {/* Foto Preview */}
            {fotoPreview && (
              <div className="mt-3 relative inline-block">
                <img src={fotoPreview} alt="Preview" className="max-w-xs rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={() => {
                    setFotoPreview(null)
                    setValue('fotoUrl', '')
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA - "+ Reportar Avería" */}
      <Button
        type="submit"
        data-testid="averia-submit"
        className="w-full bg-[#7D1220] hover:bg-[#6A0E1B] text-white py-4 px-4 h-14 text-base font-semibold"
        disabled={isPending}
      >
        {isPending ? 'Reportando...' : '+ Reportar Avería'}
      </Button>
    </form>
  )
}
