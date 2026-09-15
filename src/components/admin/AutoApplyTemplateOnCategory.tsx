'use client'

import { useAllFormFields } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

import {
  getTemplateFieldUpdates,
  isBlankFieldValue,
  relationValueToId,
  type SpeciesTemplateDoc,
} from '@/lib/species-template-fields'

/**
 * Vive en la pestaña Resumen, justo debajo de "Categories". Cuando elegís
 * una categoría (Paphiopedilum, Cattleya, etc.) busca la plantilla de esa
 * especie/género y autocompleta TODOS los campos vacíos que la plantilla
 * puede aportar: Origen, Short Description y Description acá en Resumen, y
 * luz, temperatura, riego, humedad, fertilización, etc. en Cultivo — sin
 * que haga falta ir a la pestaña Cultivo y tocar "Aplicar plantilla" a mano.
 *
 * A propósito NUNCA pisa un campo que ya tiene contenido (a diferencia del
 * botón manual de Cultivo, que sí sobreescribe cuando lo tocás vos). Así
 * podés cambiar de categoría sin perder texto que ya hayas escrito.
 *
 * Nota técnica sobre "Description": es un campo richText (editor Lexical) y,
 * a diferencia de los campos de texto simples, ese editor solo lee su valor
 * inicial en el momento exacto en que se monta — no reacciona a cambios
 * posteriores del formulario. Como este componente vive en la misma pestaña
 * (Resumen) que el campo Description, completarlo acá no lo refresca
 * visualmente aunque el dato ya haya quedado bien guardado en el formulario
 * (se puede confirmar guardando: el texto se persiste correctamente incluso
 * si el recuadro sigue mostrando el placeholder). Para evitar esa confusión,
 * `bounceTabsToRefreshRichTextDisplay` simula un cambio de pestaña (ida y
 * vuelta) apenas después de aplicar la plantilla, lo que fuerza que el
 * editor se vuelva a montar y muestre el texto ya cargado. Si por lo que sea
 * no encuentra los botones de pestaña, no hace nada — es puramente
 * cosmético, el dato ya está guardado de todos modos.
 */

// Claves de categoría para las que ya se disparó el "rebote" de pestañas en
// esta carga de página — evita que un remount post-rebote intente rebotar
// de nuevo (y con eso, cualquier chance de bucle).
const bouncedCategoryKeys = new Set<string>()

const bounceTabsToRefreshRichTextDisplay = () => {
  try {
    const tabButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.tabs-field__tab-button'),
    )
    const activeButton = tabButtons.find((btn) =>
      btn.classList.contains('tabs-field__tab-button--active'),
    )
    const otherButton = tabButtons.find((btn) => btn !== activeButton)
    if (!activeButton || !otherButton) return

    otherButton.click()
    setTimeout(() => {
      activeButton.click()
    }, 60)
  } catch {
    // Cosmético — si falla, el dato ya quedó guardado en el formulario igual.
  }
}

export const AutoApplyTemplateOnCategory = () => {
  const [allFields, dispatchFields] = useAllFormFields()
  const [appliedName, setAppliedName] = useState<string | null>(null)
  const lastKeyRef = useRef<string | null>(null)

  const categoriesValue = allFields?.['categories']?.value as unknown

  useEffect(() => {
    const ids = (Array.isArray(categoriesValue) ? categoriesValue : [])
      .map(relationValueToId)
      .filter((id): id is string => Boolean(id))

    const key = ids.join(',')
    if (!ids.length || key === lastKeyRef.current) return
    lastKeyRef.current = key

    let cancelled = false

    const run = async () => {
      for (const categoryId of ids) {
        try {
          const catRes = await fetch(`/api/categories/${categoryId}?depth=0`, {
            credentials: 'include',
          })
          if (!catRes.ok) continue
          const category = await catRes.json()
          const genusName = category?.name
          if (!genusName) continue

          const tplRes = await fetch(
            `/api/species-templates?where[genus][equals]=${encodeURIComponent(genusName)}&limit=1&depth=0`,
            { credentials: 'include' },
          )
          if (!tplRes.ok) continue
          const tplJson = await tplRes.json()
          const doc: SpeciesTemplateDoc | undefined = tplJson?.docs?.[0]
          if (!doc || cancelled) continue

          const updates = [...getTemplateFieldUpdates(doc), { path: 'speciesTemplate', value: doc.id }]

          let appliedAny = false
          let descriptionWasApplied = false
          for (const { path, value } of updates) {
            const current = allFields?.[path]?.value
            if (!isBlankFieldValue(current)) continue
            dispatchFields({ type: 'UPDATE', path, value })
            appliedAny = true
            if (path === 'description') descriptionWasApplied = true
          }

          if (!cancelled && appliedAny) setAppliedName(doc.name || genusName)

          if (!cancelled && descriptionWasApplied && !bouncedCategoryKeys.has(key)) {
            bouncedCategoryKeys.add(key)
            setTimeout(() => bounceTabsToRefreshRichTextDisplay(), 60)
          }

          return
        } catch {
          // Autocompletado de conveniencia — si falla, no bloquea nada; el
          // usuario sigue pudiendo cargar todo a mano como siempre.
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
    // Solo nos importa reaccionar a cambios en 'categories'; allFields/dispatchFields
    // cambian en cada tecla tipeada en cualquier campo del form y no deben re-disparar esto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesValue])

  if (!appliedName) return null

  return (
    <p
      style={{
        fontSize: '0.8rem',
        color: 'var(--theme-elevation-500)',
        marginTop: '-0.75rem',
        marginBottom: '1.5rem',
      }}
    >
      Plantilla de {appliedName} aplicada automáticamente ✓ — se completaron los campos que estaban
      vacíos (Origen, Short Description y Description acá, y luz/temperatura/riego/humedad/fertilización
      en la pestaña Cultivo). Todo sigue siendo editable.
    </p>
  )
}
