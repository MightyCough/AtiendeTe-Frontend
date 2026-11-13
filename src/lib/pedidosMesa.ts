import type { Pedido } from '../tipos'

/** El pedido más nuevo primero; a igual hora, el de mayor id. */
export function ordenarRecientes(pedidos: Pedido[]): Pedido[] {
  return [...pedidos].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn) || b.id - a.id)
}

/** Pedidos que todavía no llegaron a la mesa. */
export function contarActivos(pedidos: Pedido[]): number {
  return pedidos.filter((pedido) => pedido.estado !== 'ENTREGADO').length
}

export function cantidadProductos(pedido: Pedido): number {
  return pedido.items.reduce((suma, item) => suma + item.cantidad, 0)
}
