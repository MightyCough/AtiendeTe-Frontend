import { describe, expect, it } from 'vitest'
import i18n from '../i18n'

describe('cambio de idioma', () => {
  it('arranca en español', async () => {
    await i18n.changeLanguage('es')
    expect(i18n.t('menu.eligeIdioma')).toBe('Elige tu idioma')
    expect(i18n.t('pedido.estados.LISTO')).toBe('Listo')
    expect(i18n.t('menu.confirmar')).toBe('Confirmar pedido')
  })

  it('pasa a inglés y vuelve a español', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.resolvedLanguage).toBe('en')
    expect(i18n.t('menu.eligeIdioma')).toBe('Choose your language')
    expect(i18n.t('pedido.estados.LISTO')).toBe('Ready')
    expect(i18n.t('menu.confirmar')).toBe('Place order')
    expect(i18n.t('pedido.mensajes.ENTREGADO')).toBe('Order delivered. Enjoy your meal!')

    await i18n.changeLanguage('es')
    expect(i18n.resolvedLanguage).toBe('es')
    expect(i18n.t('menu.eligeIdioma')).toBe('Elige tu idioma')
    expect(i18n.t('menu.confirmar')).toBe('Confirmar pedido')
    expect(i18n.t('admin.totalVendido')).toBe('Total vendido')
  })
})
