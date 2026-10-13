import { describe, expect, it } from 'vitest'
import { leerMenu, leerReporte } from '../api/forma'
import { localizarMenu } from '../datos/catalogo'
import { diaLocal } from '../lib/formato'

describe('contrato con el backend', () => {
  it('GET /api/menu es un arreglo, no un objeto con categorias', () => {
    const menu = localizarMenu()
    expect(leerMenu(menu)[0]?.productos[0]?.ingredientes).toEqual(expect.any(Array))
    expect(() => leerMenu({ categorias: menu })).toThrow()
  })

  it('el reporte de hoy cuenta pedidos', () => {
    expect(leerReporte({ pedidos: 2, totalVendido: 10, topProductos: [] }).pedidos).toBe(2)
    expect(() => leerReporte({ pedidos: [], totalVendido: 0, topProductos: [] })).toThrow()
  })

  it('el día del filtro fecha es el de Lima, no el UTC', () => {
    expect(diaLocal('2026-10-11T02:30:00.000Z')).toBe('2026-10-10')
  })
})
