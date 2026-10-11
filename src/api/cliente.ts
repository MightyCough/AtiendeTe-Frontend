import { URL_API, usarMock } from '../config'
import type {
  CrearPedido,
  EstadoPedido,
  MenuRespuesta,
  Mesa,
  Pedido,
  ReporteHoy,
} from '../tipos'
import { ErrorApi } from './errores'
import {
  cambiarEstadoMock,
  crearPedidoMock,
  menuMock,
  mesaMock,
  mesasMock,
  pedidoMock,
  pedidosMock,
  reporteHoyMock,
} from './mock'

async function solicitar<T>(ruta: string, init?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ErrorApi(0, 'Sin conexión con el servidor')
  }
  if (!respuesta.ok) {
    let mensaje = respuesta.statusText
    try {
      mensaje = await respuesta.text()
    } catch {
      // El cuerpo vacío no cambia el estado HTTP.
    }
    throw new ErrorApi(respuesta.status, mensaje || 'Error del servidor')
  }
  if (respuesta.status === 204) return undefined as T
  return (await respuesta.json()) as T
}

function query(params: Record<string, string | undefined>): string {
  const busqueda = new URLSearchParams()
  for (const [clave, valor] of Object.entries(params)) {
    if (valor) busqueda.set(clave, valor)
  }
  const texto = busqueda.toString()
  return texto ? `?${texto}` : ''
}

export const api = {
  menu(): Promise<MenuRespuesta> {
    if (usarMock) return menuMock()
    return solicitar('/api/menu?lang=es')
  },
  mesas(): Promise<Mesa[]> {
    if (usarMock) return mesasMock()
    return solicitar('/api/mesas')
  },
  mesa(numero: number): Promise<Mesa> {
    if (usarMock) return mesaMock(numero)
    return solicitar(`/api/mesas/${numero}`)
  },
  crearPedido(cuerpo: CrearPedido): Promise<Pedido> {
    if (usarMock) return crearPedidoMock(cuerpo)
    return solicitar('/api/pedidos', { method: 'POST', body: JSON.stringify(cuerpo) })
  },
  pedido(id: number): Promise<Pedido> {
    if (usarMock) return pedidoMock(id)
    return solicitar(`/api/pedidos/${id}`)
  },
  pedidos(params: { estado?: EstadoPedido | ''; fecha?: string } = {}): Promise<Pedido[]> {
    if (usarMock) return pedidosMock(params)
    return solicitar(`/api/pedidos${query({ estado: params.estado, fecha: params.fecha })}`)
  },
  cambiarEstado(id: number, estado: EstadoPedido): Promise<Pedido> {
    if (usarMock) return cambiarEstadoMock(id, estado)
    return solicitar(`/api/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    })
  },
  reporteHoy(): Promise<ReporteHoy> {
    if (usarMock) return reporteHoyMock()
    return solicitar('/api/reportes/hoy')
  },
}
