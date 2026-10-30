import { io, type Socket } from 'socket.io-client'
import { URL_API, usarMock } from '../config'
import type { ActualizacionPedido, CambioEstadoMesa, ConexionMesa, Pedido } from '../tipos'
import { alRecibirMock } from './mock'

export interface EventosSocket {
  'pedido:nuevo': Pedido
  'pedido:actualizado': ActualizacionPedido
  'mesa:conexion': ConexionMesa
  'mesa:estado': CambioEstadoMesa
}

type NombreEvento = keyof EventosSocket

let socket: Socket | null = null

function obtenerSocket(): Socket {
  if (!socket) {
    socket = io(URL_API, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export function suscribir<E extends NombreEvento>(
  evento: E,
  handler: (datos: EventosSocket[E]) => void,
): () => void {
  if (usarMock) {
    return alRecibirMock(evento, (datos) => handler(datos as EventosSocket[E]))
  }
  return escuchar(evento, (datos) => handler(datos as EventosSocket[E]))
}

/** El cliente de socket.io no acepta un nombre de evento genérico sin perder el tipo. */
function escuchar(evento: NombreEvento, handler: (datos: unknown) => void): () => void {
  const conexion = obtenerSocket()
  const on = conexion.on.bind(conexion) as (nombre: string, fn: (datos: unknown) => void) => void
  const off = conexion.off.bind(conexion) as (nombre: string, fn: (datos: unknown) => void) => void
  on(evento, handler)
  return () => off(evento, handler)
}

export function observarConexion(handler: (conectado: boolean) => void): () => void {
  if (usarMock) {
    handler(true)
    return () => {}
  }
  const conexion = obtenerSocket()
  const alConectar = () => handler(true)
  const alCortar = () => handler(false)
  conexion.on('connect', alConectar)
  conexion.on('disconnect', alCortar)
  handler(conexion.connected)
  return () => {
    conexion.off('connect', alConectar)
    conexion.off('disconnect', alCortar)
  }
}
