import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { LoginForm } from '@/components/mobile-upload/LoginForm'
import { UploadForm } from '@/components/mobile-upload/UploadForm'

export default async function SubirFotosPage() {
  const payload = await getPayloadClient()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  return (
    <div className="container-fluid py-4 px-3" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="text-center mb-4">
        <h1 className="h4 mb-1">Reserva Oeste</h1>
        <p className="text-muted mb-0">Subir foto desde el celu</p>
      </div>

      {user ? <UploadForm /> : <LoginForm />}
    </div>
  )
}
