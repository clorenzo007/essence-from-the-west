'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { useState } from 'react'

/**
 * "Aplicar plantilla" — vive en la pestaña Cultivo, justo debajo del campo
 * "Species Template". Copia los valores de la plantilla de especie/género
 * elegida (luz, temperatura, riego, humedad, fertilización, floración,
 * origen, género, guía de cuidados, etc.) a este producto.
 *
 * Es un campo `type: 'ui'` — no guarda nada por sí mismo, solo autocompleta
 * los demás campos. Todo sigue siendo editable después: esto no vincula ni
 * bloquea nada, solo ahorra tener que tipear todo de nuevo en cada orquídea
 * nueva de la misma especie.
 */

type SpeciesTemplateDoc = {
  id: string
  name?: string
  genus?: string
  origin?: string
  fragrance?: string
  difficulty?: string
  humidity?: string
  temperature?: string
  lighting?: string
  floweringSeason?: string[]
  bloomSize?: string
  wateringNotes?: string
  fertilizerNotes?: string
  careSheet?: string | { id: string }
}

const relationValueToId = (value: unknown): string | null => {
  if (typeof value === 'string' && value) return value
  if (value && typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    const id = (value as Record<string, unknown>).id
    return typeof id === 'string' ? id : null
  }
  return null
}

export const ApplySpeciesTemplateField = () => {
  const [allFields, dispatchFields] = useAllFormFields()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appliedName, setAppliedName] = useState<string | null>(null)

  const templateId = relationValueToId(allFields?.['speciesTemplate']?.value)

  const applyTemplate = async () => {
    if (!templateId) return
    setLoading(true)
    setError(null)
    setAppliedName(null)

    try {
      const res = await fetch(`/api/species-templates/${templateId}`)
      if (!res.ok) throw new Error('not-ok')
      const doc: SpeciesTemplateDoc = await res.json()

      const setIfPresent = (path: string, value: unknown) => {
        if (value === undefined || value === null || value === '') return
        if (Array.isArray(value) && value.length === 0) return
        dispatchFields({ type: 'UPDATE', path, value })
      }

      setIfPresent('genus', doc.genus)
      setIfPresent('origin', doc.origin)
      setIfPresent('fragrance', doc.fragrance)
      setIfPresent('difficulty', doc.difficulty)
      setIfPresent('humidity', doc.humidity)
      setIfPresent('temperature', doc.temperature)
      setIfPresent('lighting', doc.lighting)
      setIfPresent('floweringSeason', doc.floweringSeason)
      setIfPresent('bloomSize', doc.bloomSize)
      setIfPresent('wateringNotes', doc.wateringNotes)
      setIfPresent('fertilizerNotes', doc.fertilizerNotes)
      setIfPresent('careSheet', relationValueToId(doc.careSheet))

      setAppliedName(doc.name || 'la plantilla')
    } catch {
      setError('No se pudo aplicar la plantilla. Probá de nuevo.')
    } finally {
      setLoading(false)
    }
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
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn--style-primary"
          disabled={!templateId || loading}
          onClick={applyTemplate}
        >
          {loading ? 'Aplicando…' : 'Aplicar plantilla'}
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-500)' }}>
          {templateId
            ? 'Copia luz, temperatura, riego, humedad, fertilización y otros datos de cultivo a este producto. Podés editarlos después.'
            : 'Elegí una plantilla arriba para poder aplicarla.'}
        </span>
      </div>

      {error && (
        <p
          style={{
            color: 'var(--theme-error-500)',
            marginTop: '0.75rem',
            marginBottom: 0,
            fontSize: '0.85rem',
          }}
        >
          {error}
        </p>
      )}

      {appliedName && !error && (
        <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.85rem' }}>
          Aplicado ✓ ({appliedName}) — revisá los campos de abajo (y Género/Origen en Resumen) y
          ajustalos si hace falta.
        </p>
      )}
    </div>
  )
}
