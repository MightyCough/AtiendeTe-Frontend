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
  it('mantiene los mismos productos en español e inglés', () => {
    const es = localizarMenu('es')
    const en = localizarMenu('en')
    const ids = (menu: typeof es) => menu.categorias.flatMap((categoria) => categoria.productos.map((producto) => producto.id))
    expect(ids(es)).toEqual(ids(en))
    expect(es.categorias[0]?.nombre).not.toBe(en.categorias[0]?.nombre)
    const lomo = es.categorias.flatMap((categoria) => categoria.productos).find((producto) => producto.id === 5)
    expect(lomo?.adicionales.length).toBeGreaterThan(0)
    expect(lomo?.ingredientesRemovibles.length).toBeGreaterThan(0)
  })
})
