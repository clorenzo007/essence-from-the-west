'use client'

import { useRef, useState } from 'react'

type Status = 'idle' | 'uploading' | 'success' | 'error'

export function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      setPreviewUrl(null)
      setFileName(null)
      return
    }
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function reset() {
    setPreviewUrl(null)
    setFileName(null)
    setAlt('')
    setCaption('')
    setStatus('idle')
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setError('Elegí o sacá una foto primero.')
      return
    }
    if (!alt.trim()) {
      setError('Falta el texto (Alt) — una descripción corta de la foto.')
      return
    }

    setStatus('uploading')

    const form = new FormData()
    form.set('file', file)
    form.set('alt', alt.trim())
    if (caption.trim()) form.set('caption', caption.trim())

    try {
      const res = await fetch('/api/mobile-upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'No se pudo guardar la foto.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError('No se pudo conectar. Probá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="alert alert-success" role="alert">
          Foto guardada ✓
        </div>
        <button type="button" className="btn btn-dark btn-lg w-100" onClick={reset}>
          Subir otra foto
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Vista previa"
            className="img-fluid rounded mb-2"
            style={{ maxHeight: 260, width: '100%', objectFit: 'cover' }}
          />
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="form-control form-control-lg"
          onChange={handleFileChange}
          required
        />
        {fileName && <div className="form-text">{fileName}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="alt" className="form-label">
          Descripción (Alt) *
        </label>
        <input
          id="alt"
          type="text"
          className="form-control form-control-lg"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Ej: Cattleya walkeriana"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="caption" className="form-label">
          Nota (opcional)
        </label>
        <input
          id="caption"
          type="text"
          className="form-control form-control-lg"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-dark btn-lg w-100" disabled={status === 'uploading'}>
        {status === 'uploading' ? 'Guardando…' : 'Guardar foto'}
      </button>

      <p className="text-muted text-center small mt-3 mb-0">
        Se guarda suelta en Media. Después, desde la compu, la asociás a un Producto o Ejemplar si
        querés.
      </p>
    </form>
  )
}
