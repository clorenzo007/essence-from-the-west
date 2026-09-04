'use client'

import { useAllFormFields, useFormFields } from '@payloadcms/ui'
import { useRef, useState } from 'react'

/**
 * "Identificar planta" — botón en el formulario de Orquídeas que manda una
 * foto al backend (src/app/(payload)/api/admin/identify-plant/route.ts,
 * que a su vez llama a la API de Pl@ntNet) y ofrece los géneros/especies
 * candidatos para completar los campos Género y Especie con un clic.
 *
 * Es un campo `type: 'ui'` — no se guarda nada acá, solo ayuda a completar
 * otros campos del mismo formulario. Funciona en creación y edición.
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

export const IdentifyPlantField = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  const nameValue = useFormFields(([fields]) => fields.name)
  const [, dispatchFields] = useAllFormFields()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setError(null)
    setCandidates(null)
    setAppliedIndex(null)

    if (!selected) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleIdentify = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setCandidates(null)
    setAppliedIndex(null)

    try {
      const body = new FormData()
      body.append('image', file, file.name)

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
        setError('No se encontraron coincidencias para esta foto. Probá con otra imagen (flor o flor + hoja suelen dar mejor resultado).')
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
      <p style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--theme-elevation-600)' }}>
        Subí una foto (idealmente de la flor) y buscamos el género y la especie automáticamente.
        Esto no reemplaza tu criterio — revisá los resultados antes de usarlos.
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
          disabled={!file || loading}
          onClick={handleIdentify}
        >
          {loading ? 'Identificando…' : 'Identificar'}
        </button>

        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Vista previa"
            style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4 }}
          />
        )}
      </div>

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
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-elevation-400)', marginTop: '0.5rem', marginBottom: 0 }}>
              Identificaciones gratuitas restantes hoy: {remaining}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
