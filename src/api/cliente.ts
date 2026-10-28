import { URL_API, usarMock } from '../config'
import type {
  ActualizacionPedido,
  CambioEstadoMesa,
  Categoria,
  CrearPedido,
  EstadoMesa,
  EstadoPedido,
  Mesa,
  Pedido,
  ReporteHoy,
} from '../tipos'
import { ErrorApi } from './errores'
import {
  leerActualizacion,
  leerCambioMesa,
  leerMenu,
  leerMesa,
  leerMesas,
  leerPedido,
  leerPedidos,
  leerReporte,
} from './forma'
import {
  cambiarEstadoMesaMock,
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
  } catch (error) {
    const mensaje = error instanceof Error && error.message ? error.message : 'Sin conexión con el servidor'
    throw new ErrorApi(0, mensaje)
  }
  if (!respuesta.ok) {
    let mensaje = respuesta.statusText
    try {
      const texto = await respuesta.text()
      if (texto) {
        try {
          const cuerpo = JSON.parse(texto) as { error?: unknown }
          mensaje = typeof cuerpo.error === 'string' ? cuerpo.error : texto
        } catch {
          mensaje = texto
        }
      }
    } catch {
      // El cuerpo vacío no cambia el estado HTTP.
    }
    throw new ErrorApi(respuesta.status, mensaje || 'Error del servidor')
  }
  if (respuesta.status === 204) return undefined as T
  try {
    return (await respuesta.json()) as T
  } catch {
    throw new ErrorApi(0, 'Respuesta inválida del servidor')
  }
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
  async menu(): Promise<Categoria[]> {
    const datos = usarMock ? await menuMock() : await solicitar<unknown>('/api/menu?lang=es')
    return leerMenu(datos)
  },
  async mesas(): Promise<Mesa[]> {
    const datos = usarMock ? await mesasMock() : await solicitar<unknown>('/api/mesas')
    return leerMesas(datos)
  },
  async mesa(numero: number): Promise<Mesa> {
    const datos = usarMock ? await mesaMock(numero) : await solicitar<unknown>(`/api/mesas/${numero}`)
    return leerMesa(datos)
  },
  async cambiarEstadoMesa(numero: number, estado: EstadoMesa): Promise<CambioEstadoMesa> {
    const datos = usarMock
      ? await cambiarEstadoMesaMock(numero, estado)
      : await solicitar<unknown>(`/api/mesas/${numero}/estado`, {
          method: 'PATCH',
          body: JSON.stringify({ estado }),
        })
    return leerCambioMesa(datos)
  },
  async crearPedido(cuerpo: CrearPedido): Promise<Pedido> {
    const datos = usarMock
      ? await crearPedidoMock(cuerpo)
      : await solicitar<unknown>('/api/pedidos', { method: 'POST', body: JSON.stringify(cuerpo) })
    return leerPedido(datos)
  },
  async pedido(id: number): Promise<Pedido> {
    const datos = usarMock ? await pedidoMock(id) : await solicitar<unknown>(`/api/pedidos/${id}`)
    return leerPedido(datos)
  },
  async pedidos(params: { estado?: EstadoPedido | ''; fecha?: string } = {}): Promise<Pedido[]> {
    const datos = usarMock
      ? await pedidosMock(params)
      : await solicitar<unknown>(`/api/pedidos${query({ estado: params.estado, fecha: params.fecha })}`)
    return leerPedidos(datos)
  },
  async cambiarEstado(id: number, estado: EstadoPedido): Promise<ActualizacionPedido> {
    const datos = usarMock
      ? await cambiarEstadoMock(id, estado)
      : await solicitar<unknown>(`/api/pedidos/${id}/estado`, {
          method: 'PATCH',
          body: JSON.stringify({ estado }),
        })
    return leerActualizacion(datos)
  },
  async reporteHoy(): Promise<ReporteHoy> {
    const datos = usarMock ? await reporteHoyMock() : await solicitar<unknown>('/api/reportes/hoy')
    return leerReporte(datos)
  },
}
