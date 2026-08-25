import crypto from 'crypto'

/**
 * Código de acceso (2FA) por email — helpers compartidos entre los hooks
 * de autenticación (Users.ts), los endpoints /verify-otp y /resend-otp, y
 * el control de acceso (shared/access.ts).
 *
 * El código nunca se guarda en texto plano: se guarda un hash (con el
 * PAYLOAD_SECRET como "pepper") junto a una fecha de expiración.
 */

export const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutos

export function generateOtpCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')
}

export function hashOtpCode(code: string, userId: string): string {
  const secret = process.env.PAYLOAD_SECRET || ''
  return crypto.createHash('sha256').update(`${userId}:${code}:${secret}`).digest('hex')
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + OTP_TTL_MS)
}

export function is2FADisabled(): boolean {
  return process.env.DISABLE_2FA === 'true'
}
