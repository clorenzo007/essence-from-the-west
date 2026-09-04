'use client'

import { useAllFormFields, useFormFields, useListDrawer } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

/**
 * "Identificar planta" — vive en la pestaña Multimedia, justo debajo de la
 * galería. Usa la primera foto ya subida a la galería (sin volver a
 * subirla) y la manda a src/app/(payload)/api/admin/identify-plant/route.ts,
 * que a su vez llama a la API de Pl@ntNet.
 *
 * Si todavía no hay ninguna foto en la galería, ofrece dos formas de
 * conseguir una foto para identificar:
 *  - Elegir una ya subida antes (biblioteca de medios — Cloudinary), sin
 *    tener que volver a subirla desde la computadora.
 *  - Subir una foto nueva desde la computadora, solo para identificar (no
 *    se guarda en la galería).
 *
 * Es un campo `type: 'ui'` — no se guarda nada acá, solo ayuda a completar
 * Género y Especie (y Nombre, si está vacío) en la pestaña Resumen.
 */

type Candidate = {
  scientificName: string
  genus: string
  species: string
  family: string
  commonNames: string[]
  score: number
}

type IdentifyResponse = {
  error?: string
  candidates?: Candidate[]
  remainingIdentificationRequests?: number
}

type MediaPreview = { id: string; url?: string; filename?: string }

export const IdentifyPlantField = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manualFile, setManualFile] = useState<File | null>(null)
  const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null)
  const [galleryImage, setGalleryImage] = useState<MediaPreview | null>(null)
  const [pickedExisting, setPickedExisting] = useState<MediaPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  const nameValue = useFormFields(([fields]) => fields.name)
  const [allFields, dispatchFields] = useAllFormFields()

  const [MediaListDrawer, MediaListToggler, { closeDrawer: closeMediaDrawer }] = useListDrawer({
    collectionSlugs: ['media'],
  })

  // Primera imagen ya cargada en la galería del producto (gallery.0.image).
  const firstGalleryImageId = (() => {
    const field = allFields?.['gallery.0.image']
    const value = field?.value
    return typeof value === 'string' && value ? value : null
  })()

  useEffect(() => {
    if (!firstGalleryImageId) {
      setGalleryImage(null)
      return
    }

    let cancelled = false
    fetch(`/api/media/${firstGalleryImageId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (cancelled || !doc) return
        setGalleryImage({ id: firstGalleryImageId, url: doc.url, filename: doc.filename })
      })
      .catch(() => {
        if (!cancelled) setGalleryImage({ id: firstGalleryImageId })
      })

    return () => {
      cancelled = true
    }
  }, [firstGalleryImageId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setError(null)
    setCandidates(null)
    setAppliedIndex(null)

    if (!selected) {
      setManualFile(null)
      setManualPreviewUrl(null)
      return
    }

    setPickedExisting(null)
    setManualFile(selected)
    setManualPreviewUrl(URL.createObjectURL(selected))
  }

  const handleExistingSelect = ({ docID }: { docID: string }) => {
    closeMediaDrawer()
    setError(null)
    setCandidates(null)
    setAppliedIndex(null)
    setManualFile(null)
    setManualPreviewUrl(null)
    setPickedExisting({ id: docID })

    fetch(`/api/media/${docID}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!doc) return
        setPickedExisting({ id: docID, url: doc.url, filename: doc.filename })
      })
      .catch(() => {
        // La foto igual se puede identificar aunque falle la vista previa.
      })
  }

  const runIdentify = async (body: FormData) => {
    setLoading(true)
    setError(null)
    setCandidates(null)
    setAppliedIndex(null)

    try {
      const res = await fetch('/api/admin/identify-plant', {
        method: 'POST',
        body,
      })
      const data: IdentifyResponse = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'No se pudo identificar la foto.')
        return
      }

      if (!data.candidates || data.candidates.length === 0) {
        setError(
          'No se encontraron coincidencias para esta foto. Probá con otra imagen (flor o flor + hoja suelen dar mejor resultado).',
        )
        return
      }

      setCandidates(data.candidates)
      setRemaining(data.remainingIdentificationRequests ?? null)
    } catch {
      setError('No se pudo contactar al servicio de identificación. Probá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const identifyFromMediaId = (mediaId: string) => {
    const body = new FormData()
    body.append('mediaId', mediaId)
    runIdentify(body)
  }

  const identifyFromManualFile = () => {
    if (!manualFile) return
    const body = new FormData()
    body.append('image', manualFile, manualFile.name)
    runIdentify(body)
  }

  const applyCandidate = (candidate: Candidate, index: number) => {
    dispatchFields({ type: 'UPDATE', path: 'genus', value: candidate.genus })
    dispatchFields({ type: 'UPDATE', path: 'species', value: candidate.species })

    if (!nameValue?.value) {
      const suggestedName = candidate.commonNames[0] || candidate.scientificName
      dispatchFields({ type: 'UPDATE', path: 'name', value: suggestedName })
    }

    setAppliedIndex(index)
  }

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 4,
        padding: '1rem',
        marginBottom: '1.5rem',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <p style={{ fontWeight: 600, marginTop: 0, marginBottom: '0.25rem' }}>
        Identificar planta por foto
      </p>
      <p
        style={{
          marginTop: 0,
          marginBottom: '0.75rem',
          fontSize: '0.85rem',
          color: 'var(--theme-elevation-600)',
        }}
      >
        Sugiere género y especie a partir de una foto (idealmente de la flor). Revisá el resultado
        antes de usarlo — esto no reemplaza tu criterio.
      </p>

      {firstGalleryImageId ? (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {galleryImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={galleryImage.url}
              alt="Primera imagen de la galería"
              style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <button
            type="button"
            className="btn btn--style-primary"
            disabled={loading}
            onClick={() => identifyFromMediaId(firstGalleryImageId)}
          >
            {loading ? 'Identificando…' : 'Identificar con esta foto'}
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-500)' }}>
            (primera imagen de la galería, arriba)
          </span>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Todavía no hay ninguna foto en la galería. Elegí una que ya subiste antes (Cloudinary),
            o subí una nueva desde tu computadora solo para identificar:
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {pickedExisting?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pickedExisting.url}
                alt="Foto elegida de la biblioteca"
                style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
            <MediaListToggler className="btn btn--style-secondary btn--size-small" disabled={loading}>
              {pickedExisting ? 'Elegir otra foto ya subida' : 'Elegir una foto ya subida'}
            </MediaListToggler>
            {pickedExisting && (
              <button
                type="button"
                className="btn btn--style-primary"
                disabled={loading}
                onClick={() => identifyFromMediaId(pickedExisting.id)}
              >
                {loading ? 'Identificando…' : 'Identificar con esta foto'}
              </button>
            )}
          </div>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--theme-elevation-500)',
              margin: '0.75rem 0 0.5rem',
            }}
          >
            — o —
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ maxWidth: 260 }}
            />
            <button
              type="button"
              className="btn btn--style-primary"
              disabled={!manualFile || loading}
              onClick={identifyFromManualFile}
            >
              {loading ? 'Identificando…' : 'Identificar'}
            </button>
            {manualPreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={manualPreviewUrl}
                alt="Vista previa"
                style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
          </div>

          <MediaListDrawer onSelect={handleExistingSelect} />
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--theme-error-500)', marginTop: '0.75rem', marginBottom: 0 }}>
          {error}
        </p>
      )}

      {candidates && (
        <div style={{ marginTop: '1rem' }}>
          {candidates.map((candidate, index) => (
            <div
              key={`${candidate.scientificName}-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0',
                borderTop: index === 0 ? undefined : '1px solid var(--theme-elevation-100)',
              }}
            >
              <div>
                <div>
                  <em>{candidate.scientificName}</em>{' '}
                  <span style={{ color: 'var(--theme-elevation-500)', fontSize: '0.8rem' }}>
                    ({Math.round(candidate.score * 100)}% de coincidencia)
                  </span>
                </div>
                {(candidate.commonNames.length > 0 || candidate.family) && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-600)' }}>
                    {candidate.commonNames.slice(0, 2).join(', ')}
                    {candidate.commonNames.length > 0 && candidate.family ? ' · ' : ''}
                    {candidate.family && `familia ${candidate.family}`}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn--style-secondary btn--size-small"
                onClick={() => applyCandidate(candidate, index)}
              >
                {appliedIndex === index ? 'Aplicado ✓' : 'Usar este'}
              </button>
            </div>
          ))}
          {remaining !== null && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--theme-elevation-400)',
                marginTop: '0.5rem',
                marginBottom: 0,
              }}
            >
              Identificaciones gratuitas restantes hoy: {remaining}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
