import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconoCerrar, IconoMas, IconoMenos } from '../../componentes/Iconos'
import { totalLineaVisible } from '../../lib/carrito'
import { formatearSoles } from '../../lib/dinero'
import type { LineaCarrito } from '../../tipos'

export function CarritoPanel({
  lineas,
  total,
  enviando,
  error,
  onCerrar,
  onCantidad,
  onQuitar,
  onConfirmar,
}: {
  lineas: LineaCarrito[]
  total: number
  enviando: boolean
  error: boolean
  onCerrar: () => void
  onCantidad: (clave: string, cantidad: number) => void
  onQuitar: (clave: string) => void
  onConfirmar: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function tecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', tecla)
    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', tecla)
    }
  }, [onCerrar])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/45 sm:items-center" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
        className="entrada flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-pizarra shadow-2xl sm:rounded-3xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 id="titulo-carrito" className="font-serif text-3xl">
            {t('menu.carrito')}
          </h2>
          <button type="button" onClick={onCerrar} aria-label={t('comun.cerrar')} className="grid h-10 w-10 place-items-center rounded-full bg-crema">
            <IconoCerrar />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
          {lineas.length === 0 && <p className="text-suave">{t('menu.vacio')}</p>}
          {lineas.map((linea) => (
            <article key={linea.clave} className="rounded-2xl bg-crema px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{linea.nombre}</h3>
                <p className="shrink-0 font-semibold tabular-nums">{formatearSoles(totalLineaVisible(linea))}</p>
              </div>
              {linea.adicionales.length > 0 && (
                <p className="mt-1 text-sm text-suave">
                  + {linea.adicionales.map((extra) => `${extra.nombre} (${formatearSoles(extra.precioExtra)})`).join(', ')}
                </p>
              )}
              {linea.sinIngredientes.length > 0 && (
                <p className="mt-1 text-sm text-suave">
                  {t('pedido.sin')}: {linea.sinIngredientes.map((item) => item.nombre).join(', ')}
                </p>
              )}
              {linea.nota && (
                <p className="mt-1 text-sm">
                  <span className="font-semibold">{t('pedido.nota')}: </span>
                  {linea.nota}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={t('menu.disminuir')}
                    onClick={() => onCantidad(linea.clave, linea.cantidad - 1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-pizarra"
                  >
                    <IconoMenos />
                  </button>
                  <span className="w-5 text-center tabular-nums">{linea.cantidad}</span>
                  <button
                    type="button"
                    aria-label={t('menu.aumentar')}
                    onClick={() => onCantidad(linea.clave, linea.cantidad + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-pizarra"
                  >
                    <IconoMas />
                  </button>
                </div>
                <button type="button" onClick={() => onQuitar(linea.clave)} className="text-sm font-semibold text-miel">
                  {t('menu.quitar')}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="border-t border-linea px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">{t('menu.total')}</span>
            <span className="font-serif text-2xl tabular-nums">{formatearSoles(total)}</span>
          </div>
          {error && <p className="mb-3 text-sm text-arcilla">{t('menu.errorEnvio')}</p>}
          <button
            type="button"
            disabled={lineas.length === 0 || enviando}
            onClick={onConfirmar}
            className="w-full rounded-full bg-terracota px-5 py-3.5 text-base font-semibold text-white disabled:opacity-50"
          >
            {enviando ? t('menu.enviando') : t('menu.confirmar')}
          </button>
          <button type="button" onClick={onCerrar} className="mt-2 w-full py-2 text-sm font-semibold text-suave">
            {t('menu.seguir')}
          </button>
        </div>
      </div>
    </div>
  )
}
