import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './shared/access'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Cliente',
    plural: 'Clientes',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Comercio',
    defaultColumns: ['firstName', 'lastName', 'email', 'phone', 'updatedAt'],
    description: 'Base de datos de clientes para consultas y pedidos por WhatsApp',
  },
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Include country code for WhatsApp',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes — preferences, past orders, care level',
      },
    },
    {
      name: 'inquiries',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'message',
          type: 'textarea',
        },
        {
          name: 'date',
          type: 'date',
        },
      ],
    },
  ],
}
