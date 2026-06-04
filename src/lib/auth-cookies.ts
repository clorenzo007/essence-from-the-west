import { getServerURL } from '@/lib/env'

const COOKIE_PREFIX = 'payload'

/** Shared cookie domain for www + apex (e.g. .reservaoeste.com.ar) */
export function getAuthCookieDomain(): string | undefined {
  if (process.env.PAYLOAD_COOKIE_DOMAIN) {
    return process.env.PAYLOAD_COOKIE_DOMAIN
  }

  const serverUrl = getServerURL()
  if (!serverUrl || serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1')) {
    return undefined
  }

  try {
    const hostname = new URL(serverUrl).hostname
    if (hostname.startsWith('www.')) {
      return `.${hostname.slice(4)}`
    }
    return `.${hostname}`
  } catch {
    return undefined
  }
}

export function getTrustedOrigins(): string[] {
  const origins = new Set<string>(['http://localhost:3000', 'http://127.0.0.1:3000'])

  const serverUrl = getServerURL()
  if (serverUrl) {
    origins.add(serverUrl)
    try {
      const url = new URL(serverUrl)
      if (url.hostname.startsWith('www.')) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}`)
      } else {
        origins.add(`${url.protocol}//www.${url.hostname}`)
      }
    } catch {
      // ignore invalid URL
    }
  }

  return [...origins]
}

export function buildClearAuthCookieHeaders(): string[] {
  const secure = process.env.NODE_ENV === 'production'
  const base = `${COOKIE_PREFIX}-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  const securePart = secure ? '; Secure' : ''

  const headers = [`${base}${securePart}`]

  const domain = getAuthCookieDomain()
  if (domain) {
    headers.push(`${base}; Domain=${domain}${securePart}`)
  }

  return headers
}
