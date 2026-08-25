/**
 * Plantillas de email en español para el flujo de invitación (crear
 * contraseña) y el código de acceso (2FA) del panel de administración.
 */

const WRAPPER_STYLE =
  'font-family: Georgia, \'Times New Roman\', serif; background-color: #f7f4ee; padding: 40px 16px;'
const CARD_STYLE =
  'max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 40px 32px; border: 1px solid #e5ddd0;'
const TITLE_STYLE = 'color: #2b2620; font-size: 22px; margin: 0 0 16px;'
const BODY_STYLE = 'color: #4a453d; font-size: 15px; line-height: 1.6; margin: 0 0 24px;'
const BUTTON_STYLE =
  'display: inline-block; background-color: #2b2620; color: #f7f4ee; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;'
const FOOTER_STYLE = 'color: #9a9184; font-size: 12px; margin-top: 32px;'

export function inviteUserEmailHTML({ setPasswordUrl, isReset = false }: { setPasswordUrl: string; isReset?: boolean }) {
  const heading = isReset ? 'Restablecer tu contraseña' : 'Bienvenido/a a Reserva Oeste'
  const intro = isReset
    ? 'Recibimos una solicitud para restablecer tu contraseña de acceso al panel de administración.'
    : 'Se creó una cuenta para vos en el panel de administración de Reserva Oeste. Para activarla, configurá tu contraseña.'

  return `
    <div style="${WRAPPER_STYLE}">
      <div style="${CARD_STYLE}">
        <h1 style="${TITLE_STYLE}">${heading}</h1>
        <p style="${BODY_STYLE}">${intro}</p>
        <p style="${BODY_STYLE}">Hacé clic en el siguiente botón para crear tu contraseña. El enlace vence en 7 días.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${setPasswordUrl}" style="${BUTTON_STYLE}">Crear contraseña</a>
        </p>
        <p style="${BODY_STYLE}; font-size: 13px;">
          Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br />
          <a href="${setPasswordUrl}" style="color: #8a6d3b;">${setPasswordUrl}</a>
        </p>
        <p style="${FOOTER_STYLE}">
          Si no esperabas este email, podés ignorarlo con tranquilidad.
        </p>
      </div>
    </div>
  `
}

export function inviteUserEmailSubject({ isReset = false }: { isReset?: boolean } = {}) {
  return isReset ? 'Restablecer tu contraseña — Reserva Oeste' : 'Creá tu contraseña — Reserva Oeste'
}

export function otpEmailHTML({ code }: { code: string }) {
  return `
    <div style="${WRAPPER_STYLE}">
      <div style="${CARD_STYLE}">
        <h1 style="${TITLE_STYLE}">Tu código de acceso</h1>
        <p style="${BODY_STYLE}">Usá este código para completar el inicio de sesión en el panel de administración de Reserva Oeste. Vence en 10 minutos.</p>
        <p style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 32px; letter-spacing: 0.3em; font-weight: bold; color: #2b2620; background: #f2ede2; padding: 16px 24px; border-radius: 6px;">${code}</span>
        </p>
        <p style="${FOOTER_STYLE}">
          Si no intentaste iniciar sesión, ignorá este email y considerá cambiar tu contraseña.
        </p>
      </div>
    </div>
  `
}

export function otpEmailSubject() {
  return 'Tu código de acceso — Reserva Oeste'
}
