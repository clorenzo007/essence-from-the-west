'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

/**
 * Aviso "¿querés ver esto en la tienda?" que aparece cada vez que se publica
 * (o actualiza estando publicado) un registro de una colección con vista
 * pública. Funciona observando las respuestas de `window.fetch` a la REST
 * API de Payload (POST /api/<slug> al crear, PATCH /api/<slug>/<id> al
 * editar) — no depende de hooks internos de Payload, para no arriesgar
 * romper el admin con una API que no puedo verificar en este entorno.
 *
 * Registrado en `admin.components.beforeNavLinks`.
 */

type PreviewableDoc = {
  slug?: unknown
  status?: unknown
}

type PendingPreview = {
  label: string
  url: string
}

type CollectionPreviewConfig = {
  label: string
  buildUrl: (doc: PreviewableDoc) => string | null
}

const SITE_URL = 'https://www.reservaoeste.com.ar'

const PREVIEWABLE_COLLECTIONS: Record<string, CollectionPreviewConfig> = {
  products: {
    label: 'la orquídea',
    buildUrl: (doc) => (typeof doc.slug === 'string' && doc.slug ? `/products/${doc.slug}` : null),
  },
  'care-sheets': {
    label: 'la guía de cuidados',
    buildUrl: (doc) => (typeof doc.slug === 'string' && doc.slug ? `/care/${doc.slug}` : null),
  },
  'blog-posts': {
    label: 'la publicación',
    buildUrl: (doc) => (typeof doc.slug === 'string' && doc.slug ? `/blog/${doc.slug}` : null),
  },
  categories: {
    label: 'la categoría',
    buildUrl: (doc) => (typeof doc.slug === 'string' && doc.slug ? `/catalog?category=${doc.slug}` : null),
  },
  supplies: {
    label: 'el insumo',
    buildUrl: () => '/tienda',
  },
}

// Coincide con `/api/<slug>` (crear) o `/api/<slug>/<id>` (editar), sin
// querystring adicional que indique que es una llamada auxiliar (ej. `?depth=`).
const API_PATH_PATTERN = /^\/api\/([a-z-]+)(?:\/([a-zA-Z0-9]+))?\/?$/

function isPreviewableDoc(value: unknown): value is PreviewableDoc {
  return typeof value === 'object' && value !== null
}

function getRequestPath(input: RequestInfo | URL): string | null {
  try {
    if (typeof input === 'string') {
      return new URL(input, window.location.origin).pathname
    }
    if (input instanceof URL) {
      return input.pathname
    }
    if (typeof Request !== 'undefined' && input instanceof Request) {
      return new URL(input.url, window.location.origin).pathname
    }
  } catch {
    return null
  }
  return null
}

let isFetchWrapped = false

export function PublishPreviewPrompt() {
  const [pending, setPending] = useState<PendingPreview | null>(null)

  useEffect(() => {
    if (isFetchWrapped) return
    isFetchWrapped = true

    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init)

      try {
        const method = (init?.method ?? 'GET').toUpperCase()
        if (method === 'POST' || method === 'PATCH') {
          const path = getRequestPath(input)
          const match = path ? path.match(API_PATH_PATTERN) : null
          const slug = match?.[1]

          if (response.ok && slug && slug in PREVIEWABLE_COLLECTIONS) {
            response
              .clone()
              .json()
              .then((json: unknown) => {
                const doc = isPreviewableDoc(json) && 'doc' in json ? (json as { doc?: unknown }).doc : json
                if (!isPreviewableDoc(doc)) return
                if (doc.status !== 'published') return

                const config = PREVIEWABLE_COLLECTIONS[slug]
                const previewPath = config.buildUrl(doc)
                if (!previewPath) return

                setPending({ label: config.label, url: `${SITE_URL}${previewPath}` })
              })
              .catch(() => {
                // Respuesta no era JSON o no tenía la forma esperada — se ignora.
              })
          }
        }
      } catch {
        // Nunca romper la llamada real por un error acá.
      }

      return response
    }
  }, [])

  if (!pending) return null

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Vista previa en la tienda">
      <div style={dialogStyle}>
        <p style={messageStyle}>¡Listo! ¿Querés ver {pending.label} en la tienda?</p>
        <div style={actionsStyle}>
          <button type="button" onClick={() => setPending(null)} style={secondaryButtonStyle}>
            Ahora no
          </button>
          <a
            href={pending.url}
            target="_blank"
            rel="noopener noreferrer"
            style={primaryButtonStyle}
            onClick={() => setPending(null)}
          >
            Ver en la tienda
          </a>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 9999,
}

const dialogStyle: CSSProperties = {
  maxWidth: 320,
  padding: '16px 18px',
  borderRadius: 6,
  border: '1px solid rgb(31 31 31 / 12%)',
  backgroundColor: 'var(--theme-elevation-0, #fff)',
  boxShadow: '0 8px 24px rgb(0 0 0 / 15%)',
}

const messageStyle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: 13,
  lineHeight: 1.5,
}

const actionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
}

const secondaryButtonStyle: CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 4,
  border: '1px solid rgb(31 31 31 / 15%)',
  backgroundColor: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
}

const primaryButtonStyle: CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 4,
  border: '1px solid #8a6d3b',
  backgroundColor: '#8a6d3b',
  color: '#fff',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
}
