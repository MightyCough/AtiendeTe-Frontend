import { useState } from 'react'
import { varianteDe } from '../datos/catalogo'
import { ArtePlato } from './ArtePlato'

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
      <img
        src={imagenUrl}
        alt=""
        className="h-full w-full object-cover"
        onError={() => setRota(true)}
      />
    )
  }
  return <ArtePlato variante={varianteDe(productoId)} />
}
