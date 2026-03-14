'use client'

/**
 * Users Client Component
 * Story 1.3: Etiquetas de Clasificación y Organización
 *
 * Client component for user list with filtering and sorting by tags
 * - Filter users by tag (AC3)
 * - Sort users by tag (AC3)
 * - Shows tags in user list (AC3)
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Tag {
  id: string
  name: string
  color: string
}

interface UserCapability {
  capability: {
    label: string
  }
}

interface UserTag {
  tag: Tag
}

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  forcePasswordReset: boolean
  createdAt: Date
  lastLogin: Date | null
  userCapabilities: UserCapability[]
  userTags: UserTag[]
}

interface UsersClientProps {
  users: User[]
  tags: Tag[]
}

export function UsersClient({ users, tags }: UsersClientProps) {
  const [selectedTagId, setSelectedTagId] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'tagName'>('createdAt')

  // Filter users by selected tag
  const filteredUsers = useMemo(() => {
    if (selectedTagId === 'all') {
      return users
    }

    return users.filter((user) =>
      user.userTags.some((ut) => ut.tag.id === selectedTagId)
    )
  }, [users, selectedTagId])

  // Sort users by selected criteria
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers]

    if (sortBy === 'createdAt') {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortBy === 'tagName') {
      sorted.sort((a, b) => {
        const aTags = a.userTags.map((ut) => ut.tag.name).join(', ')
        const bTags = b.userTags.map((ut) => ut.tag.name).join(', ')

        if (aTags === '' && bTags === '') return 0
        if (aTags === '') return 1
        if (bTags === '') return -1

        return aTags.localeCompare(bTags)
      })
    }

    return sorted
  }, [filteredUsers, sortBy])

  const selectedTag = tags.find((t) => t.id === selectedTagId)

  return (
    <>
      {/* Filter and Sort Controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter by Tag */}
          <div className="flex-1">
            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por etiqueta
            </label>
            <select
              id="tag-filter"
              data-testid="tag-filter"
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los usuarios</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort by */}
          <div className="flex-1">
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              id="sort-by"
              data-testid="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'tagName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">Fecha de creación</option>
              <option value="tagName">Etiqueta</option>
            </select>
          </div>
        </div>

        {/* Active Filter Display */}
        {selectedTagId !== 'all' && selectedTag && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtro activo:</span>
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: selectedTag.color }}
            >
              {selectedTag.name}
            </span>
            <button
              onClick={() => setSelectedTagId('all')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar filtro
            </button>
            <span className="text-sm text-gray-500">
              ({sortedUsers.length} {sortedUsers.length === 1 ? 'usuario' : 'usuarios'}
              )
            </span>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200" role="list" data-testid="user-list">
          {sortedUsers.map((user) => {
            const capabilities = user.userCapabilities.map(
              (uc) => uc.capability.label
            )

            return (
              <li key={user.id}>
                <Link
                  href={`/usuarios/${user.id}`}
                  className="block hover:bg-gray-50 transition"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {user.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {user.phone}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-2">
                        {/* Tags */}
                        {user.userTags.length > 0 && (
                          <div
                            className="flex flex-wrap gap-1 justify-end"
                            data-testid="usuario-etiquetas"
                          >
                            {user.userTags.map((userTag) => (
                              <span
                                key={userTag.tag.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: userTag.tag.color }}
                              >
                                {userTag.tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Capabilities count */}
                        <p className="text-xs text-gray-500">
                          {capabilities.length} capabilities
                        </p>

                        {/* Force password reset badge */}
                        {user.forcePasswordReset && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Contraseña temporal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}

          {sortedUsers.length === 0 && (
            <li className="px-4 py-12 text-center">
              <p className="text-sm text-gray-500">
                {selectedTagId !== 'all'
                  ? `No hay usuarios con la etiqueta seleccionada`
                  : 'No hay usuarios en el sistema'}
              </p>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
