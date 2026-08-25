import type { CollectionConfig, Field } from 'payload'

import { editorCollectionAccess } from './shared/access'
import { createSeoTabFields } from './shared/fields'
import { autoGenerateSupplySlug, syncMetaFromSupply, validatePublishedSupply, validateSlugFormat } from './supplies/hooks'
import { SUPPLY_CATEGORY_OPTIONS } from './supplies/options'

const SUPPLY_CURRENCY_OPTIONS = [
  { label: 'ARS ($)', value: 'ARS' },
  { label: 'USD (US$)', value: 'USD' },
] as const

const sidebarFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    defaultValue: 'draft',
    required: true,
    options: [
      { label: 'Borrador', value: 'draft' },
      { label: 'Publicado', value: 'published' },
      { label: 'Archivado', value: 'archived' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Solo los insumos publicados aparecen en la Tienda.',
    },
  },
  {
    name: 'category',
    type: 'select',
    required: true,
    options: [...SUPPLY_CATEGORY_OPTIONS],
    admin: {
      position: 'sidebar',
      description: 'Categoría dentro del menú Tienda.',
    },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Destacar en la home.',
    },
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Se genera automáticamente a partir del nombre. Editar solo si hace falta.',
    },
    hooks: {
      beforeValidate: [autoGenerateSupplySlug, validateSlugFormat],
    },
  },
  {
    name: 'sku',
    type: 'text',
    unique: true,
    admin: {
      position: 'sidebar',
      description: 'Código interno de inventario (opcional).',
    },
  },
]

export const Supplies: CollectionConfig = {
  slug: 'supplies',
  labels: {
    singular: 'Insumo',
    plural: 'Insumos',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'price', 'stock', 'status', 'featured', 'updatedAt'],
    description: 'Stock de sustratos, fertilizantes, pesticidas, macetas, canastas y otros insumos.',
    listSearchableFields: ['name', 'sku', 'slug'],
    pagination: { defaultLimit: 25 },
  },
  access: editorCollectionAccess,
  hooks: {
    beforeValidate: [validatePublishedSupply, syncMetaFromSupply],
  },
  fields: [
    ...sidebarFields,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'Identidad y texto de cara al cliente.',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              minLength: 2,
              maxLength: 120,
              admin: {
                description: 'Nombre a mostrar en la Tienda.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: {
                description: 'Resumen breve para las tarjetas de la Tienda (máx. 280 caracteres).',
              },
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Detalle completo (opcional).',
              },
            },
          ],
        },
        {
          label: 'Comercio',
          description: 'Precio y stock.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: { width: '50%', step: 1, description: 'Precio de venta.' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'ARS',
                  options: [...SUPPLY_CURRENCY_OPTIONS],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'stock',
                  type: 'number',
                  required: true,
                  min: 0,
                  defaultValue: 0,
                  admin: { width: '50%', step: 1, description: 'Unidades disponibles.' },
                },
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  defaultValue: 2,
                  min: 0,
                  admin: { width: '50%', step: 1, description: 'Aviso de stock bajo en el admin.' },
                },
              ],
            },
            {
              name: 'availabilityNote',
              type: 'text',
              admin: {
                description: 'Nota opcional (ej. "Retiro en 48hs").',
              },
            },
          ],
        },
        {
          label: 'Fotos',
          description: 'Fotos del insumo para la Tienda.',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Foto', plural: 'Fotos' },
              admin: {
                initCollapsed: false,
                description: 'La primera foto es la principal, salvo que marques otra como principal.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: { description: 'Descripción opcional para accesibilidad.' },
                },
                {
                  name: 'isPrimary',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Usar como foto principal.' },
                },
              ],
            },
          ],
        },
        createSeoTabFields(),
      ],
    },
  ],
}
