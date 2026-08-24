import Link from 'next/link'

/**
 * Banner shown above the Media list pointing to /subir-fotos — a separate,
 * mobile-friendly page for uploading photos quickly from the phone camera
 * without fighting the admin panel's desktop-oriented layout.
 */
export function MobileUploadBanner() {
  return (
    <div
      style={{
        margin: '0 32px 16px',
        padding: '12px 16px',
        borderRadius: 4,
        border: '1px solid rgb(31 31 31 / 12%)',
        backgroundColor: 'var(--theme-elevation-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <span>¿Estás con el celu? Subir fotos es más simple desde acá.</span>
      <Link
        href="/subir-fotos"
        style={{
          padding: '8px 14px',
          borderRadius: 4,
          backgroundColor: '#b08a43',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        📱 Subir desde el celu
      </Link>
    </div>
  )
}
