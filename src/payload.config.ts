import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { getTrustedOrigins } from './lib/auth-cookies'
import { getCloudinaryConfig, isCloudinaryEnabled } from './lib/cloudinary'
import { getServerURL } from './lib/env'
import { cloudinaryAdapter } from './storage/cloudinaryAdapter'

import { BlogPosts } from './collections/BlogPosts'
import { CareSheets } from './collections/CareSheets'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Specimens } from './collections/Specimens'
import { Supplies } from './collections/Supplies'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useCloudinary = isCloudinaryEnabled()
const useVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !useCloudinary

const storagePlugins = useCloudinary
  ? [
      cloudStoragePlugin({
        collections: {
          media: {
            adapter: cloudinaryAdapter,
            disableLocalStorage: true,
            disablePayloadAccessControl: true,
            prefix: getCloudinaryConfig().folder,
          },
        },
      }),
    ]
  : useVercelBlob
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN || '',
        }),
      ]
    : []

// DIAGNOSTIC BUILD: resendAdapter/email temporarily removed to isolate
// whether it is the cause of the current Vercel build failure.
export default buildConfig({
  serverURL: getServerURL(),
  csrf: getTrustedOrigins(),
  cors: getTrustedOrigins(),
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: '— Reserva Oeste',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminIcon#AdminIcon',
      },
      beforeNavLinks: [
        '@/components/admin/OtpGate#OtpGate',
        '@/components/admin/StatusBar#StatusBar',
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Supplies,
    Specimens,
    BlogPosts,
    CareSheets,
    Customers,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: storagePlugins,
  sharp,
})
