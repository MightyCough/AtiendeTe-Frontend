import { useState } from 'react'
import { varianteDe } from '../datos/catalogo'
import { ArtePlato } from './ArtePlato'

/**
 * Foto del plato. El contenedor que la usa debe ser `relative` y tener su proporción (aspect-ratio).
 * El nombre del plato va escrito junto a la foto, por eso la imagen es decorativa (alt vacío).
 * Si la foto falta o no carga, se dibuja la ilustración del plato.
 */
export function FotoProducto({
  productoId,
  imagenUrl,
}: {
  productoId: number
  imagenUrl: string | null
}) {
  const [rota, setRota] = useState(false)
  if (imagenUrl && !rota) {
    return (
      <>
        <img
          src={imagenUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full bg-crema object-cover"
          onError={() => setRota(true)}
        />
        {/* Oscurece un poco la parte baja para que el "+" y el cierre se vean sobre cualquier foto. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      </>
    )
  }
  return <ArtePlato variante={varianteDe(productoId)} />
}
