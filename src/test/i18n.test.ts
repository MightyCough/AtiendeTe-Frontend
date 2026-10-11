import { describe, expect, it } from 'vitest'
import i18n from '../i18n'

describe('textos en español', () => {
  it('mantiene la interfaz en español', () => {
    expect(i18n.language.startsWith('es')).toBe(true)
    expect(i18n.t('menu.confirmar')).toBe('Confirmar pedido')
    expect(i18n.t('pedido.estados.LISTO')).toBe('Listo')
    expect(i18n.t('pedido.mensajes.ENTREGADO')).toBe('Pedido entregado. ¡Buen provecho!')
    expect(i18n.t('admin.totalVendido')).toBe('Total vendido')
  })
})
