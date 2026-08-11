'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

type CheckResult = { ok: boolean; detail: string }
type Status = {
  database: CheckResult
  media: CheckResult
  whatsapp: CheckResult
  checkedAt: string
}

const LABELS: Record<'database' | 'media' | 'whatsapp', string> = {
  database: 'Base de datos',
  media: 'Imágenes',
  whatsapp: 'WhatsApp',
}

const CHECK_INTERVAL_MS = 60_000

/**
 * Admin-only status bar — shows at a glance whether MongoDB, image storage
 * (Cloudinary/Vercel Blob), and the WhatsApp integration are configured and
 * reachable. Rendered in the admin nav (`admin.components.beforeNavLinks`),
 * never on the public site.
 */
export function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null)
  const [fetchFailed, setFetchFailed] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    const check = async () => {
      try {
        const res = await fetch('/api/admin-status', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = (await res.json()) as Status
        if (mounted.current) {
          setStatus(data)
          setFetchFailed(false)
        }
      } catch {
        if (mounted.current) setFetchFailed(true)
      }
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)

    return () => {
      mounted.current = false
      clearInterval(interval)
    }
  }, [])

  if (fetchFailed) {
    return (
      <div style={wrapStyle} role="status">
        <Dot ok={false} />
        <span>No se pudo verificar el estado del sistema.</span>
      </div>
    )
  }

  if (!status) {
    return (
      <div style={wrapStyle} role="status">
        <Dot ok={null} />
        <span>Verificando estado…</span>
      </div>
    )
  }

  const keys: Array<keyof typeof LABELS> = ['database', 'media', 'whatsapp']
  const allOk = keys.every((key) => status[key].ok)

  return (
    <div style={wrapStyle} role="status">
      <div style={{ fontWeight: 600, marginBottom: 4, color: allOk ? '#5D6A4D' : '#B14679' }}>
        {allOk ? 'Todo en orden' : 'Revisar sistema'}
      </div>
      {keys.map((key) => (
        <div key={key} title={status[key].detail} style={itemStyle}>
          <Dot ok={status[key].ok} />
          <span>{LABELS[key]}</span>
        </div>
      ))}
    </div>
  )
}

function Dot({ ok }: { ok: boolean | null }) {
  const color = ok === null ? '#B08A43' : ok ? '#5D6A4D' : '#B14679'
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        borderRadius: '50%',
        marginRight: 6,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  )
}

const wrapStyle: CSSProperties = {
  margin: '8px 20px 16px',
  padding: '10px 12px',
  fontSize: 11,
  lineHeight: 1.5,
  color: '#1F1F1F',
  background: '#FCFBF8',
  border: '1px solid rgb(31 31 31 / 8%)',
  borderRadius: 4,
}

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'default',
}
