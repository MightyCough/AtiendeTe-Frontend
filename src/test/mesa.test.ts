import { describe, expect, it } from 'vitest'
import { localizarMenu } from '../datos/catalogo'
import { interpretarMesa } from '../lib/mesa'

describe('número de mesa del QR', () => {
  it('acepta un entero entre 1 y 999', () => {
    expect(interpretarMesa('1')).toEqual({ ok: true, numero: 1 })
    expect(interpretarMesa(' 04 ')).toEqual({ ok: true, numero: 4 })
  })

  it('rechaza un enlace sin mesa o con un valor imposible', () => {
    expect(interpretarMesa(null)).toEqual({ ok: false, motivo: 'ausente' })
    expect(interpretarMesa('')).toEqual({ ok: false, motivo: 'ausente' })
    expect(interpretarMesa('abc')).toEqual({ ok: false, motivo: 'invalida' })
    expect(interpretarMesa('1.5')).toEqual({ ok: false, motivo: 'invalida' })
    expect(interpretarMesa('0')).toEqual({ ok: false, motivo: 'invalida' })
  })
})

describe('carta localizada', () => {
  it('arma la carta en español', () => {
    const menu = localizarMenu()
    expect(menu[0]?.nombre).toBe('Entradas')
    const lomo = menu.flatMap((categoria) => categoria.productos).find((producto) => producto.id === 5)
    expect(lomo?.nombre).toBe('Lomo saltado')
    expect(lomo?.adicionales.length).toBeGreaterThan(0)
    expect(lomo?.ingredientes.length).toBeGreaterThan(0)
  })
})
