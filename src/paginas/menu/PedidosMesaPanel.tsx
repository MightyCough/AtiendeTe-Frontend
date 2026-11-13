import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconoCerrar } from '../../componentes/Iconos'
import { ListaPedidosMesa } from '../../componentes/ListaPedidosMesa'
import type { Pedido } from '../../tipos'

export function PedidosMesaPanel({
  pedidos,
  numeros,
  error,
  onReintentar,
  onCerrar,
}: {
  pedidos: Pedido[] | null
  numeros: Record<number, number>
  error: boolean
  onReintentar: () => void
  onCerrar: () => void
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
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-pedidos-mesa"
        className="entrada flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-pizarra shadow-2xl sm:rounded-3xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 id="titulo-pedidos-mesa" className="font-serif text-3xl">
            {t('pedido.pedidosMesa')}
          </h2>
          <button type="button" onClick={onCerrar} aria-label={t('comun.cerrar')} className="grid h-10 w-10 place-items-center rounded-full bg-crema">
            <IconoCerrar />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <ListaPedidosMesa
            pedidos={pedidos}
            numeros={numeros}
            error={error}
            vacio={t('pedido.sinPedidos')}
            onReintentar={onReintentar}
            onElegir={onCerrar}
          />
        </div>
      </div>
    </div>
  )
}
