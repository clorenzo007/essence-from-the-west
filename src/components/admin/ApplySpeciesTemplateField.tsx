'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { useState } from 'react'

import { getTemplateFieldUpdates, relationValueToId, type SpeciesTemplateDoc } from '@/lib/species-template-fields'

/**
 * "Aplicar plantilla" — vive en la pestaña Cultivo, justo debajo del campo
 * "Species Template". Copia los valores de la plantilla de especie/género
 * elegida (luz, temperatura, riego, humedad, fertilización, floración,
 * origen, género, short description, description, guía de cuidados, etc.)
 * a este producto.
 *
 * Es un campo `type: 'ui'` — no guarda nada por sí mismo, solo autocompleta
 * los demás campos. Todo sigue siendo editable después: esto no vincula ni
 * bloquea nada, solo ahorra tener que tipear todo de nuevo en cada orquídea
 * nueva de la misma especie.
 *
 * A diferencia del autocompletado automático al elegir Categoría (ver
 * AutoApplyTemplateOnCategory.tsx), este botón es una acción explícita del
 * usuario — por eso SIEMPRE sobreescribe los campos con datos en la
 * plantilla, incluso si ya tenían algo cargado.
 */

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

      for (const { path, value } of getTemplateFieldUpdates(doc)) {
        dispatchFields({ type: 'UPDATE', path, value })
      }

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
            ? 'Copia luz, temperatura, riego, humedad, fertilización, short description, description y otros datos a este producto (sobreescribe lo que ya esté cargado). Podés editarlo después.'
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
          Aplicado ✓ ({appliedName}) — revisá los campos de abajo (y Género/Origen/Short
          Description/Description en Resumen) y ajustalos si hace falta.
        </p>
      )}
    </div>
  )
}
