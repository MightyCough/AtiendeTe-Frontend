import { describe, expect, it } from 'vitest'
import { VIGENCIA_MS, buscarPropio, registrar, vigentes, type PedidoPropio } from '../lib/pedidosPropios'

const T0 = 1_700_000_000_000

function propio(id: number, mesa: number, numero: number, creadoEn: number): PedidoPropio {
  return { id, mesa, numero, creadoEn }
}

describe('pedidos propios del celular', () => {
  it('el primer pedido es el 1, aunque el id de la base sea alto', () => {
    const lista = registrar([], 481, 2, T0)
    expect(lista).toEqual([propio(481, 2, 1, T0)])
  })

  it('el siguiente pedido de la misma mesa es el 2 y luego el 3', () => {
    let lista = registrar([], 10, 2, T0)
    lista = registrar(lista, 15, 2, T0 + 60_000)
    lista = registrar(lista, 21, 2, T0 + 120_000)
    expect(lista.map((pedido) => pedido.numero)).toEqual([1, 2, 3])
  })

  it('cada mesa lleva su propia cuenta', () => {
    let lista = registrar([], 10, 2, T0)
    lista = registrar(lista, 11, 3, T0 + 1000)
    expect(buscarPropio(lista, 11)?.numero).toBe(1)
  })

  it('registrar dos veces el mismo pedido no lo duplica', () => {
    const una = registrar([], 10, 2, T0)
    expect(registrar(una, 10, 2, T0 + 1000)).toEqual(una)
  })

  it('olvida lo que pasó de las 4 horas', () => {
    const lista = [propio(1, 2, 1, T0), propio(2, 2, 2, T0 + 3 * 60 * 60 * 1000)]
    const luego = T0 + VIGENCIA_MS + 1
    expect(vigentes(lista, luego).map((pedido) => pedido.id)).toEqual([2])
    expect(vigentes(lista, T0 + VIGENCIA_MS - 1).map((pedido) => pedido.id)).toEqual([1, 2])
  })

  it('si el primero caduca, el segundo conserva su número y el nuevo sigue con 3', () => {
    const lista = [propio(1, 2, 1, T0), propio(2, 2, 2, T0 + 3 * 60 * 60 * 1000)]
    const luego = T0 + VIGENCIA_MS + 1000
    const nueva = registrar(lista, 9, 2, luego)
    expect(nueva.map((pedido) => [pedido.id, pedido.numero])).toEqual([
      [2, 2],
      [9, 3],
    ])
  })

  it('si todo caducó, la numeración vuelve a 1', () => {
    const lista = [propio(1, 2, 1, T0), propio(2, 2, 2, T0 + 1000)]
    const nueva = registrar(lista, 50, 2, T0 + VIGENCIA_MS + 5000)
    expect(nueva).toEqual([propio(50, 2, 1, T0 + VIGENCIA_MS + 5000)])
  })

  it('un pedido que no se registró en este celular no aparece', () => {
    const lista = registrar([], 10, 2, T0)
    expect(buscarPropio(lista, 99)).toBeUndefined()
  })
})
