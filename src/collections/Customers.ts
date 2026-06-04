import type { CollectionConfig } from 'payload'

import { isLoggedIn } from './shared/access'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    group: 'Commerce',
    defaultColumns: ['firstName', 'lastName', 'email', 'phone', 'updatedAt'],
    description: 'Customer database for inquiries and WhatsApp orders',
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
