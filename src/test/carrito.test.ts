import { describe, expect, it } from 'vitest'
import { agregarLinea, cambiarCantidad, totalCarrito } from '../lib/carrito'
import { formatearSoles } from '../lib/dinero'
import type { LineaCarrito } from '../tipos'

function linea(parcial: {
  productoId: number
  precio: number
  cantidad: number
  adicionales?: LineaCarrito['adicionales']
  nota?: string
}): LineaCarrito {
  return {
    clave: '',
    nombre: 'Plato',
    sinIngredientes: [],
    adicionales: [],
    ...parcial,
  }
}

describe('totales del carrito', () => {
  it('un carrito vacío suma cero', () => {
    expect(totalCarrito([])).toBe(0)
  })

  it('multiplica el precio del plato por la cantidad', () => {
    expect(totalCarrito([{ precio: 14, cantidad: 3, adicionales: [] }])).toBe(42)
  })

  it('suma los adicionales por cada unidad', () => {
    const total = totalCarrito([
      {
        precio: 28,
        cantidad: 2,
        adicionales: [{ precioExtra: 3.5 }, { precioExtra: 1.5 }],
      },
    ])
    expect(total).toBe(66)
  })

  it('suma varias líneas sin arrastrar error decimal', () => {
    const total = totalCarrito([
      { precio: 10.1, cantidad: 1, adicionales: [{ precioExtra: 0.2 }] },
      { precio: 0.1, cantidad: 3, adicionales: [] },
    ])
    expect(total).toBe(10.6)
  })

  it('formatea soles con dos decimales', () => {
    expect(formatearSoles(12)).toBe('S/ 12.00')
    expect(formatearSoles(12.5)).toBe('S/ 12.50')
    expect(formatearSoles(10.6)).toBe('S/ 10.60')
  })

  it('junta la misma combinación y no mezcla notas distintas', () => {
    const primera = agregarLinea([], linea({ productoId: 5, precio: 32, cantidad: 1, nota: 'sin sal' }))
    const misma = agregarLinea(primera, linea({ productoId: 5, precio: 32, cantidad: 2, nota: 'sin sal' }))
    expect(misma).toHaveLength(1)
    expect(misma[0]?.cantidad).toBe(3)

    const distinta = agregarLinea(misma, linea({ productoId: 5, precio: 32, cantidad: 1, nota: 'picante' }))
    expect(distinta).toHaveLength(2)
    expect(totalCarrito(distinta)).toBe(128)
  })

  it('quitar cantidad deja fuera la línea', () => {
    const lineas = agregarLinea([], linea({ productoId: 1, precio: 14, cantidad: 2 }))
    const vacio = cambiarCantidad(lineas, lineas[0]!.clave, 0)
    expect(vacio).toEqual([])
  })
})
