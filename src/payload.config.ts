import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
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

// El adapter de Resend solo se registra si hay API key configurada en el
// entorno. Sin esto, `resendAdapter` podía romper el build/arranque en
// Vercel mientras RESEND_API_KEY todavía no está configurada ahí — con esta
// guarda, el sitio funciona igual (los emails de invitación/2FA simplemente
// no se envían hasta que se configure la variable de entorno).
const resendApiKey = process.env.RESEND_API_KEY

export default buildConfig({
  serverURL: getServerURL(),
  csrf: getTrustedOrigins(),
  cors: getTrustedOrigins(),
  email: resendApiKey
    ? resendAdapter({
        defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        defaultFromName: 'Reserva Oeste',
        apiKey: resendApiKey,
      })
    : undefined,
  admin: {
    user: Users.slug,
    // Force light theme: custom.scss only overrides brand colors for light mode,
    // so falling back to dark mode (OS/browser preference) leaves button text
    // illegible against the overridden ivory background.
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
        '@/components/admin/PublishPreviewPrompt#PublishPreviewPrompt',
      ],
    },
    // A partir de Payload 3.78 el Dashboard usa un sistema de "widgets"
    // reordenables por el usuario (con layout guardado en sus preferencias)
    // en lugar del viejo slot `components.beforeDashboard` — ese slot ya no
    // se renderiza en la vista por defecto del Dashboard, así que la guía de
    // inicio se registra acá como un widget más, junto al widget incorporado
    // "collections" (la grilla de colecciones que ya se veía antes).
    dashboard: {
      widgets: [
        {
          slug: 'getting-started',
          Component: '@/components/admin/GettingStartedHub#GettingStartedHub',
          minWidth: 'full',
          maxWidth: 'full',
        },
      ],
      defaultLayout: () => [
        { widgetSlug: 'getting-started', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
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
