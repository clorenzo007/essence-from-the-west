import type { CollectionConfig } from 'payload'

import { DIFFICULTY_OPTIONS } from '@/lib/constants'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'species', 'price', 'stock', 'featured', 'updatedAt'],
    description: 'Orchid inventory — pricing, stock, and growing requirements',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'species',
              type: 'text',
              required: true,
            },
            {
              name: 'hybrid',
              type: 'text',
              admin: {
                description: 'Grex or hybrid designation, if applicable',
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'published',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Commerce',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Price in USD',
              },
            },
            {
              name: 'stock',
              type: 'number',
              required: true,
              min: 0,
              defaultValue: 0,
              admin: {
                description: 'Available units',
              },
            },
            {
              name: 'lowStockThreshold',
              type: 'number',
              defaultValue: 2,
              min: 0,
              admin: {
                description: 'Alert when stock falls at or below this number',
              },
            },
          ],
        },
        {
          label: 'Growing',
          fields: [
            {
              name: 'floweringSeason',
              type: 'text',
              admin: {
                description: 'e.g. Spring–Summer',
              },
            },
            {
              name: 'fragrance',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Light', value: 'light' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Strong', value: 'strong' },
              ],
            },
            {
              name: 'humidity',
              type: 'text',
              admin: {
                description: 'e.g. 60–80%',
              },
            },
            {
              name: 'temperature',
              type: 'text',
              admin: {
                description: 'e.g. 65–75°F day / 55–62°F night',
              },
            },
            {
              name: 'lighting',
              type: 'text',
            },
            {
              name: 'difficulty',
              type: 'select',
              options: [...DIFFICULTY_OPTIONS],
            },
            {
              name: 'careSheet',
              type: 'relationship',
              relationTo: 'care-sheets',
              admin: {
                description: 'Linked detailed care guide',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
