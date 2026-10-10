/** Contrato compartido con el backend. Los nombres de plato en un pedido van siempre en español. */

export type Idioma = 'es' | 'en'

export type EstadoPedido = 'RECIBIDO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO'

export const ESTADOS: EstadoPedido[] = ['RECIBIDO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO']

export interface Adicional {
  id: number
  nombre: string
  precioExtra: number
}

export interface Ingrediente {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  imagenUrl: string | null
  disponible: boolean
  adicionales: Adicional[]
  ingredientesRemovibles: Ingrediente[]
}

export interface Categoria {
  id: number
  nombre: string
  productos: Producto[]
}

export interface MenuRespuesta {
  categorias: Categoria[]
}

export interface Mesa {
  numero: number
  online: boolean
  ultimaConexion: string | null
}

export interface ItemPedido {
  productoId: number
  nombre: string
  cantidad: number
  precioUnitario: number
  adicionales: Adicional[]
  sinIngredientes: Ingrediente[]
  nota?: string
  subtotal: number
}

export interface Pedido {
  id: number
  mesa: number
  idioma: Idioma
  estado: EstadoPedido
  total: number
  items: ItemPedido[]
  creadoEn: string
}

export interface CrearPedidoItem {
  productoId: number
  cantidad: number
  adicionales: number[]
  sinIngredientes: number[]
  nota?: string
}

export interface CrearPedido {
  mesa: number
  idioma: Idioma
  items: CrearPedidoItem[]
}

export interface TopProducto {
  productoId: number
  nombre: string
  cantidad: number
  total: number
}

export interface ReporteHoy {
  pedidos: Pedido[]
  totalVendido: number
  topProductos: TopProducto[]
}

export interface ActualizacionPedido {
  id: number
  mesa: number
  estado: EstadoPedido
}

export interface ConexionMesa {
  numero: number
  online: boolean
}

/** Línea del carrito en el teléfono. Los nombres siguen el idioma de la pantalla. */
export interface LineaCarrito {
  clave: string
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  adicionales: Adicional[]
  sinIngredientes: Ingrediente[]
  nota?: string
}

export function siguienteEstado(estado: EstadoPedido): EstadoPedido | null {
  const indice = ESTADOS.indexOf(estado)
  if (indice < 0 || indice >= ESTADOS.length - 1) return null
  return ESTADOS[indice + 1]
}
