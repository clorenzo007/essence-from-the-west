# Registro de ejemplares (Specimens)

Bitácora de cultivo **interna y privada** — un registro por cada planta individual de tu colección personal,
separado del catálogo de venta (`Orchids` / `Products`). Nunca se muestra en el sitio público: solo es visible en
`/admin` para usuarios logueados (Admin o Editor).

## Para qué sirve

Pensada para llevar el seguimiento de una planta a lo largo del tiempo, incluso si nunca se pone a la venta:

- De dónde salió (vivero, feria, otro coleccionista, regalo) y cuánto costó.
- Identificación botánica (género, especie, subespecie/variedad, híbrido o clon).
- Historial completo de floraciones: fechas, cantidad de flores, notas y fotos por cada floración.
- Bitácora de cuidados: riego, fertilización, fumigación/control de plagas, trasplantes, podas.
- Galería de fotos de la planta en el tiempo (no solo de las flores).
- Vínculo opcional a un producto del catálogo, si ese mismo ejemplar también está a la venta.

## Dónde está

**Panel → Cultivation → Specimens → Create New**

## Barra lateral

| Campo | Uso |
|-------|-----|
| **Name** | Identificador interno o apodo (ej. *"Cattleya walkeriana #3"*). Es el título que ves en los listados; nunca aparece en la web pública. |
| **Lifecycle status** | Activo / Vendido / Regalado / Fallecido / Archivado — para saber de un vistazo si la planta sigue en tu colección. |
| **Related product** | Opcional. Si este ejemplar también está publicado en `Orchids`, vinculalo acá — no duplica datos, solo cruza referencias. |
| **Currently blooming** | Casillero rápido para filtrar de un vistazo qué está floreciendo ahora. |
| **Current flower count** | Cantidad de flores abiertas en este momento (actualización manual y rápida; el historial detallado va en la pestaña **Bloom History**). |

## Pestañas

### Identity

Género, especie, subespecie/variedad, híbrido o clon, nombre común, origen/linaje y notas libres.

### Acquisition

Fecha de compra, de dónde/quién la obtuviste (`source`, texto libre: vivero, feria, otro coleccionista, regalo,
intercambio), precio pagado y moneda, y notas sobre el estado al llegar.

### Growing Conditions

Luz, tipo de montaje/maceta, humedad, temperatura, ubicación física (ej. *"Invernadero A, estante 3"*) y dificultad
de cultivo — mismos valores que ya usás en `Orchids` y `Care Sheets`, para mantener el vocabulario consistente.

### Bloom History

Lista repetible de **floraciones**. Cada vez que la planta vuelve a florecer, agregás un nuevo registro con:

- Fecha de inicio (obligatoria) y fecha de fin (dejar vacía mientras sigue floreciendo).
- Cantidad de flores.
- Notas (color, tamaño, fragancia, cantidad de varas, lo que quieras recordar).
- Fotos propias de esa floración.

Esto arma automáticamente el historial floral completo de la planta a lo largo de los años, floración por floración.

### Care Log

Bitácora repetible de cuidados. Cada entrada tiene fecha, tipo (Riego, Fertilización, Fumigación/control de plagas,
Trasplante, Poda, División, Otro), producto usado, dosis/dilución y notas. Sirve tanto para fertilización como para
fumigación/control de plagas — usá el campo **Type** para diferenciarlas.

### Gallery

Foto principal (se usa como portada del ejemplar en el listado del panel) y una galería libre de fotos de la planta
completa a lo largo del tiempo, cada una con fecha y leyenda opcional — para ver la evolución de la planta más allá
de sus flores.

## Relación con el resto del sitio

- **No es pública.** No genera ninguna página ni ruta en el sitio; es una herramienta de trabajo interno.
- **No reemplaza a `Orchids`.** Si una planta está en venta, seguís cargando su ficha comercial (precio, stock,
  galería de catálogo) en `Orchids` como siempre; acá solo agregás el seguimiento personal y, si querés, la
  vinculás con `Related product`.
- **Reutiliza `Media`.** Las fotos de floraciones y de galería se suben a la misma biblioteca de `Media` que usa el
  resto del sitio.

## Ideas para más adelante (no implementadas)

- Vista de calendario o timeline de floraciones por género, para planificar exposiciones o ventas de temporada.
- Recordatorios automáticos de fertilización/fumigación según una frecuencia definida.
- Exportar el historial de una planta a PDF (ficha de coleccionista).

## Referencia técnica

| Qué | Dónde en el código |
|-----|--------------------|
| Modelo de datos | `src/collections/Specimens.ts` |
| Opciones (enums) | `src/collections/specimens/options.ts` |
| Permisos | `isLoggedIn` en `src/collections/shared/access.ts` (mismo helper que usa `Customers` y `Media`) |
| Registro en Payload | `src/payload.config.ts` |

Tras incorporar estos archivos, regenerar tipos e import map antes de desplegar:

```bash
npm run generate:types
npm run generate:importmap
```
