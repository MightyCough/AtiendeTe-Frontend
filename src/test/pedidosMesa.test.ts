import { describe, expect, it } from 'vitest'
import { cantidadProductos, contarActivos, ordenarRecientes } from '../lib/pedidosMesa'
import type { EstadoPedido, Pedido } from '../tipos'

function pedido(id: number, estado: EstadoPedido, creadoEn: string, cantidades: number[] = [1]): Pedido {
  return {
    id,
    mesa: 1,
    idioma: 'es',
    estado,
    total: 10,
    creadoEn,
    actualizadoEn: creadoEn,
    items: cantidades.map((cantidad, indice) => ({
      id: id * 10 + indice,
      productoId: 1,
      nombre: 'Plato',
      cantidad,
      precioUnitario: 10,
      adicionales: [],
      sinIngredientes: [],
      nota: null,
      notaEs: null,
      subtotal: 10 * cantidad,
    })),
  }
}

describe('pedidos de la mesa', () => {
  it('ordena el más reciente primero y desempata por id', () => {
    const lista = [
      pedido(1, 'ENTREGADO', '2026-11-12T12:00:00.000Z'),
      pedido(3, 'RECIBIDO', '2026-11-12T13:00:00.000Z'),
      pedido(2, 'LISTO', '2026-11-12T13:00:00.000Z'),
    ]
    expect(ordenarRecientes(lista).map((item) => item.id)).toEqual([3, 2, 1])
  })

  it('no modifica la lista original', () => {
    const lista = [pedido(1, 'RECIBIDO', '2026-11-12T12:00:00.000Z'), pedido(2, 'RECIBIDO', '2026-11-12T13:00:00.000Z')]
    ordenarRecientes(lista)
    expect(lista.map((item) => item.id)).toEqual([1, 2])
  })

  it('cuenta como activos los que no están entregados', () => {
    const lista = [
      pedido(1, 'ENTREGADO', '2026-11-12T12:00:00.000Z'),
      pedido(2, 'EN_PREPARACION', '2026-11-12T12:10:00.000Z'),
      pedido(3, 'LISTO', '2026-11-12T12:20:00.000Z'),
    ]
    expect(contarActivos(lista)).toBe(2)
    expect(contarActivos([])).toBe(0)
  })

  it('suma las unidades de todas las líneas', () => {
    expect(cantidadProductos(pedido(1, 'RECIBIDO', '2026-11-12T12:00:00.000Z', [2, 3, 1]))).toBe(6)
  })
})
