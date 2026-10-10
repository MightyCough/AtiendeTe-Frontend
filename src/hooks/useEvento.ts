import { useEffect, useRef } from 'react'
import { observarConexion, suscribir, type EventosSocket } from '../api/socket'

export function useEvento<E extends keyof EventosSocket>(
  evento: E,
  handler: (datos: EventosSocket[E]) => void,
): void {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => suscribir(evento, (datos) => ref.current(datos)), [evento])
}

export function useConexion(handler: (conectado: boolean) => void): void {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => observarConexion((conectado) => ref.current(conectado)), [])
}
