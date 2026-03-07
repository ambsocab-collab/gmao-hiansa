import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hashea una contraseña usando bcryptjs
 * @param password - Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verifica una contraseña contra un hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Contraseña hasheada
 * @returns true si la contraseña es correcta
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Obtiene la sesión actual desde el server
 *
 * ⚠️ TEMPORAL - Función Placeholder
 *
 * Esta función se implementará completamente en Story 1.4.
 * Actualmente retorna null porque NextAuth no está configurado.
 *
 * Story 1.4 implementará:
 * - ✅ Obtener sesión usando auth() de next-auth
 * - ✅ Extraer user ID, email, name, capabilities
 * - ✅ Retornar objeto de sesión type-safe
 *
 * @deprecated Usar hasta Story 1.4, luego reemplazar por implementación real
 * @returns null temporalmente (sesión no disponible hasta Story 1.4)
 */
export async function getSession() {
  // Helper para obtener sesión en server components
  // Se implementará completamente en Story 1.4
  // TODO: Importar auth() de next-auth y retornar sesión real
  return null
}
