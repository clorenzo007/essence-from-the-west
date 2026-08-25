'use client'

import type { CSSProperties, FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

type OtpStatus = { required: boolean; verified: boolean }

/**
 * Verificación en dos pasos por email (2FA). Al iniciar sesión se envía un
 * código de 6 dígitos por email; hasta que se ingrese acá, las escrituras
 * (crear/editar/borrar) quedan bloqueadas por `isLoggedIn` en
 * `shared/access.ts` — el panel se puede seguir viendo con normalidad.
 *
 * Se muestra en `admin.components.beforeNavLinks`, igual que StatusBar.
 */
export function OtpGate() {
  const [status, setStatus] = useState<OtpStatus | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/users/otp-status', { credentials: 'include', cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as OtpStatus
      setStatus(data)
    } catch {
      // Si falla la verificación, no mostramos nada — no queremos bloquear
      // el panel por un problema de red al cargar la página.
    }
  }, [])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const submitCode = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setInfo(null)
    try {
      const res = await fetch('/api/users/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data?.error || 'No se pudo verificar el código.')
        return
      }
      setStatus({ required: true, verified: true })
      setCode('')
    } catch {
      setError('No se pudo verificar el código. Revisá tu conexión.')
    } finally {
      setSubmitting(false)
    }
  }

  const resendCode = async () => {
    setResending(true)
    setError(null)
    setInfo(null)
    try {
      const res = await fetch('/api/users/resend-otp', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data?.error || 'No se pudo reenviar el código.')
        return
      }
      setInfo('Te enviamos un nuevo código por email.')
    } catch {
      setError('No se pudo reenviar el código. Revisá tu conexión.')
    } finally {
      setResending(false)
    }
  }

  if (!status || !status.required || status.verified) return null

  return (
    <div style={wrapStyle} role="alert">
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#B14679' }}>
        Confirmá tu identidad
      </div>
      <p style={{ margin: '0 0 10px' }}>
        Te enviamos un código de 6 dígitos por email. Ingresalo para poder guardar cambios.
      </p>
      <form onSubmit={submitCode} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          style={inputStyle}
        />
        <button type="submit" disabled={submitting || code.length !== 6} style={buttonStyle}>
          {submitting ? 'Verificando…' : 'Confirmar'}
        </button>
      </form>
      <button
        type="button"
        onClick={resendCode}
        disabled={resending}
        style={{ ...linkStyle, marginTop: 8 }}
      >
        {resending ? 'Enviando…' : 'Reenviar código'}
      </button>
      {error && <p style={{ color: '#B14679', margin: '8px 0 0' }}>{error}</p>}
      {info && <p style={{ color: '#5D6A4D', margin: '8px 0 0' }}>{info}</p>}
    </div>
  )
}

const wrapStyle: CSSProperties = {
  margin: '8px 20px 16px',
  padding: '12px',
  fontSize: 11,
  lineHeight: 1.5,
  color: '#1F1F1F',
  background: '#FCFBF8',
  border: '1px solid #B14679',
  borderRadius: 4,
}

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 90,
  padding: '6px 8px',
  fontSize: 14,
  letterSpacing: '0.2em',
  textAlign: 'center',
  border: '1px solid rgb(31 31 31 / 20%)',
  borderRadius: 4,
}

const buttonStyle: CSSProperties = {
  padding: '6px 12px',
  fontSize: 11,
  fontWeight: 600,
  color: '#fff',
  backgroundColor: '#2b2620',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
}

const linkStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#8a6d3b',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 11,
}
