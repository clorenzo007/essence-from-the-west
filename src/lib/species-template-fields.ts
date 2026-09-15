/**
 * Datos compartidos entre los dos puntos donde se aplica una "Plantilla de
 * especie" a un producto:
 *  - el botón manual "Aplicar plantilla" (pestaña Cultivo)
 *  - el autocompletado automático al elegir una Categoría (pestaña Resumen)
 *
 * Vive en src/lib (no en src/components/admin) porque no usa hooks de React
 * ni nada de '@payloadcms/ui' — son funciones puras, así que también podrían
 * testearse o reusarse fuera del admin si hiciera falta.
 */

export type SpeciesTemplateDoc = {
  id: string
  name?: string
  genus?: string
  origin?: string
  shortDescriptionTemplate?: string
  descriptionTemplate?: string
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

export type FieldUpdate = { path: string; value: unknown }

export const relationValueToId = (value: unknown): string | null => {
  if (typeof value === 'string' && value) return value
  if (value && typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    const id = (value as Record<string, unknown>).id
    return typeof id === 'string' ? id : null
  }
  return null
}

/**
 * Convierte texto plano (párrafos separados por línea en blanco) al formato
 * JSON que espera el editor Lexical de Payload para un campo `richText`
 * simple (solo párrafos, sin formato ni nodos custom).
 */
export const textToLexicalState = (text: string): unknown => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const source = paragraphs.length > 0 ? paragraphs : [text]

  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: source.map((paragraph) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: paragraph,
            version: 1,
          },
        ],
      })),
    },
  }
}

/**
 * Lista completa de {path, value} que una plantilla puede aportarle a un
 * producto. No incluye 'name', 'species', 'hybrid' (identidad de cada
 * planta) ni 'categories' (eso es lo que dispara el autocompletado, no algo
 * que la plantilla deba sobreescribir).
 */
export const getTemplateFieldUpdates = (doc: SpeciesTemplateDoc): FieldUpdate[] => {
  const updates: FieldUpdate[] = []

  const add = (path: string, value: unknown) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value) && value.length === 0) return
    updates.push({ path, value })
  }

  add('genus', doc.genus)
  add('origin', doc.origin)
  add('shortDescription', doc.shortDescriptionTemplate)
  if (doc.descriptionTemplate) {
    add('description', textToLexicalState(doc.descriptionTemplate))
  }
  add('fragrance', doc.fragrance)
  add('difficulty', doc.difficulty)
  add('humidity', doc.humidity)
  add('temperature', doc.temperature)
  add('lighting', doc.lighting)
  add('floweringSeason', doc.floweringSeason)
  add('bloomSize', doc.bloomSize)
  add('wateringNotes', doc.wateringNotes)
  add('fertilizerNotes', doc.fertilizerNotes)
  add('careSheet', relationValueToId(doc.careSheet))

  return updates
}

/** true si un valor de campo del form de Payload cuenta como "vacío". */
export const isBlankFieldValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0

  if (typeof value === 'object') {
    const root = (value as Record<string, unknown>).root as
      | { children?: Array<Record<string, unknown>> }
      | undefined
    if (root) {
      const children = root.children || []
      if (children.length === 0) return true
      if (children.length === 1) {
        const firstChildren = (children[0]?.children || []) as Array<Record<string, unknown>>
        const text = firstChildren?.[0]?.text
        if (!text || typeof text !== 'string' || text.trim() === '') return true
      }
      return false
    }
  }

  return false
}
