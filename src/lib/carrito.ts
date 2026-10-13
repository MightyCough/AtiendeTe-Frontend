import { aCentimos, desdeCentimos, precioLinea } from './dinero'
import type { Adicional, Categoria, Ingrediente, LineaCarrito } from '../tipos'

interface EntradaLinea {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  adicionales: Adicional[]
  sinIngredientes: Ingrediente[]
  nota?: string
}

const MAX_CANTIDAD = 20

export function claveLinea(entrada: {
  productoId: number
  adicionales: { id: number }[]
  sinIngredientes: { id: number }[]
  nota?: string
}): string {
  const extras = entrada.adicionales.map((item) => item.id).sort((a, b) => a - b)
  const sin = entrada.sinIngredientes.map((item) => item.id).sort((a, b) => a - b)
  const nota = entrada.nota?.trim() ?? ''
  return `${entrada.productoId}|${extras.join(',')}|${sin.join(',')}|${nota}`
}

export function agregarLinea(lineas: LineaCarrito[], entrada: EntradaLinea): LineaCarrito[] {
  const nota = entrada.nota?.trim() || undefined
  const clave = claveLinea({ ...entrada, nota })
  const existente = lineas.find((linea) => linea.clave === clave)
  if (!existente) {
    return [
      ...lineas,
      {
        ...entrada,
        nota,
        clave,
        cantidad: Math.min(MAX_CANTIDAD, Math.max(1, entrada.cantidad)),
      },
    ]
  }
  return lineas.map((linea) =>
    linea.clave === clave
      ? { ...linea, cantidad: Math.min(MAX_CANTIDAD, linea.cantidad + entrada.cantidad) }
      : linea,
  )
}

export function cambiarCantidad(lineas: LineaCarrito[], clave: string, cantidad: number): LineaCarrito[] {
  if (cantidad <= 0) return lineas.filter((linea) => linea.clave !== clave)
  return lineas.map((linea) =>
    linea.clave === clave ? { ...linea, cantidad: Math.min(MAX_CANTIDAD, cantidad) } : linea,
  )
}

export function quitarLinea(lineas: LineaCarrito[], clave: string): LineaCarrito[] {
  return lineas.filter((linea) => linea.clave !== clave)
}

export function totalCarrito(
  lineas: Array<{ precio: number; cantidad: number; adicionales: Array<{ precioExtra: number }> }>,
): number {
  const centimos = lineas.reduce((suma, linea) => {
    const extras = linea.adicionales.reduce((acumulado, extra) => acumulado + aCentimos(extra.precioExtra), 0)
    return suma + (aCentimos(linea.precio) + extras) * linea.cantidad
  }, 0)
  return desdeCentimos(centimos)
}

export function totalLineaVisible(linea: LineaCarrito): number {
  return precioLinea(
    linea.precio,
    linea.adicionales.map((extra) => extra.precioExtra),
    linea.cantidad,
  )
}

/** Si la carta se vuelve a cargar, los nombres del carrito siguen a esos platos. */
export function sincronizarNombres(lineas: LineaCarrito[], categorias: Categoria[]): LineaCarrito[] {
  const productos = new Map(categorias.flatMap((categoria) => categoria.productos.map((producto) => [producto.id, producto])))
  return lineas.map((linea) => {
    const producto = productos.get(linea.productoId)
    if (!producto) return linea
    return {
      ...linea,
      nombre: producto.nombre,
      precio: producto.precio,
      adicionales: linea.adicionales.map((extra) => {
        const fresco = producto.adicionales.find((item) => item.id === extra.id)
        return fresco ? { ...extra, nombre: fresco.nombre, precioExtra: fresco.precioExtra } : extra
      }),
      sinIngredientes: linea.sinIngredientes.map((ingrediente) => {
        const fresco = producto.ingredientes.find((item) => item.id === ingrediente.id)
        return fresco ? { ...ingrediente, nombre: fresco.nombre } : ingrediente
      }),
    }
  })
}
