import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './shared/access'
import {
  DIFFICULTY_OPTIONS,
  FLOWERING_SEASON_OPTIONS,
  FRAGRANCE_OPTIONS,
  LIGHTING_OPTIONS,
} from './products/options'

export const SpeciesTemplates: CollectionConfig = {
  slug: 'species-templates',
  labels: {
    singular: 'Plantilla de especie',
    plural: 'Plantillas de especie',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catálogo',
    defaultColumns: ['name', 'genus', 'lighting', 'difficulty', 'updatedAt'],
    description:
      'Datos de cultivo comunes por especie/género (Paphiopedilum, Cattleya, etc.). Se usan para autocompletar una orquídea nueva desde la pestaña Cultivo del producto — nunca se muestran en el sitio público.',
    listSearchableFields: ['name', 'genus'],
    pagination: { defaultLimit: 25 },
  },
  // Herramienta interna para cargar productos más rápido — nunca se expone en el sitio público.
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
            description: 'Nombre de la plantilla, ej. "Paphiopedilum" o "Cattleya — especies frías".',
          },
        },
        {
          name: 'genus',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Género (ej. Paphiopedilum, Cattleya). Se copia al campo "Genus" del producto.',
          },
        },
      ],
    },
    {
      name: 'origin',
      type: 'text',
      admin: {
        description: 'Origen geográfico típico de la especie/género.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fragrance',
          type: 'select',
          options: [...FRAGRANCE_OPTIONS],
          admin: { width: '50%' },
        },
        {
          name: 'difficulty',
          type: 'select',
          required: true,
          options: [...DIFFICULTY_OPTIONS],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'humidity',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. 60–80%',
          },
        },
        {
          name: 'temperature',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. 20–28°C day / 12–16°C night. El sitio agrega °F automáticamente.',
          },
        },
      ],
    },
    {
      name: 'lighting',
      type: 'select',
      required: true,
      options: [...LIGHTING_OPTIONS],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'floweringSeason',
          type: 'select',
          hasMany: true,
          options: [...FLOWERING_SEASON_OPTIONS],
          admin: {
            width: '50%',
            description: 'Estaciones típicas de floración para esta especie/género.',
          },
        },
        {
          name: 'bloomSize',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. 3" flowers',
          },
        },
      ],
    },
    {
      name: 'wateringNotes',
      type: 'textarea',
      admin: {
        description: 'Ritmo de riego estacional y períodos de descanso, típico de esta especie/género.',
      },
    },
    {
      name: 'fertilizerNotes',
      type: 'textarea',
      admin: {
        description: 'Esquema de fertilización típico de esta especie/género.',
      },
    },
    {
      name: 'careSheet',
      type: 'relationship',
      relationTo: 'care-sheets',
      admin: {
        description: 'Guía de cuidados pública para esta especie/género (opcional).',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Notas internas para vos — no se copian al producto ni se muestran en ningún lado.',
      },
    },
  ],
}
