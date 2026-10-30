import { ESTADOS_MESA, type ActualizacionPedido, type CambioEstadoMesa, type Categoria, type Mesa, type Pedido, type ReporteHoy } from '../tipos'
import { ErrorApi } from './errores'

function inesperado(): never {
  throw new ErrorApi(0, 'Respuesta inesperada del servidor')
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null
}

export function leerMenu(datos: unknown): Categoria[] {
  if (!Array.isArray(datos)) inesperado()
  for (const categoria of datos) {
    if (!esObjeto(categoria) || typeof categoria.id !== 'number' || !Array.isArray(categoria.productos)) inesperado()
    for (const producto of categoria.productos) {
      if (
        !esObjeto(producto) ||
        typeof producto.id !== 'number' ||
        !Array.isArray(producto.adicionales) ||
        !Array.isArray(producto.ingredientes)
      ) {
        inesperado()
      }
    }
  }
  return datos as Categoria[]
}

export function leerMesas(datos: unknown): Mesa[] {
  if (!Array.isArray(datos)) inesperado()
  return datos as Mesa[]
}

export function leerMesa(datos: unknown): Mesa {
  if (!esObjeto(datos) || typeof datos.numero !== 'number') inesperado()
  return datos as unknown as Mesa
}

export function leerCambioMesa(datos: unknown): CambioEstadoMesa {
  if (
    !esObjeto(datos) ||
    typeof datos.numero !== 'number' ||
    typeof datos.estado !== 'string' ||
    !(ESTADOS_MESA as string[]).includes(datos.estado)
  ) {
    inesperado()
  }
  return datos as unknown as CambioEstadoMesa
}

function leerItems(items: unknown): void {
  if (!Array.isArray(items)) inesperado()
  for (const item of items) {
    if (
      !esObjeto(item) ||
      typeof item.id !== 'number' ||
      !Array.isArray(item.adicionales) ||
      !Array.isArray(item.sinIngredientes)
    ) {
      inesperado()
    }
  }
}

export function leerPedido(datos: unknown): Pedido {
  if (!esObjeto(datos) || typeof datos.id !== 'number') inesperado()
  leerItems(datos.items)
  return datos as unknown as Pedido
}

export function leerPedidos(datos: unknown): Pedido[] {
  if (!Array.isArray(datos)) inesperado()
  for (const pedido of datos) leerPedido(pedido)
  return datos as Pedido[]
}

export function leerActualizacion(datos: unknown): ActualizacionPedido {
  if (!esObjeto(datos) || typeof datos.id !== 'number' || typeof datos.mesa !== 'number' || typeof datos.estado !== 'string') {
    inesperado()
  }
  return datos as unknown as ActualizacionPedido
}

export function leerReporte(datos: unknown): ReporteHoy {
  if (!esObjeto(datos) || typeof datos.pedidos !== 'number' || typeof datos.totalVendido !== 'number' || !Array.isArray(datos.topProductos)) {
    inesperado()
  }
  return datos as unknown as ReporteHoy
}
