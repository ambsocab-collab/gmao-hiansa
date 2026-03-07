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
 * @deprecated Esta función se implementará completamente en Story 1.4
 * @returns null temporalmente
 */
export async function getSession() {
  // Helper para obtener sesión en server components
  // Se implementará completamente en Story 1.4
  return null
}
