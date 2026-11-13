import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatearSoles } from '../lib/dinero'
import { formatearHora } from '../lib/formato'
import { cantidadProductos } from '../lib/pedidosMesa'
import type { EstadoPedido, Pedido } from '../tipos'

/** Cada estado tiene su color: miel espera, terracota se cocina, verde está listo, gris ya llegó. */
const COLOR_ESTADO: Record<EstadoPedido, string> = {
  RECIBIDO: 'bg-miel text-tinta-oscura',
  EN_PREPARACION: 'bg-terracota text-white',
  LISTO: 'bg-salvia text-tinta-oscura',
  ENTREGADO: 'text-suave ring-1 ring-linea/50',
}

/** Pedidos de la mesa. Cada fila lleva al seguimiento de ese pedido. */
export function ListaPedidosMesa({
  pedidos,
  numeros,
  error,
  vacio,
  onReintentar,
  onElegir,
}: {
  pedidos: Pedido[] | null
  /** Id del pedido → número que ve el cliente ("Tu pedido 2"). */
  numeros: Record<number, number>
  error: boolean
  vacio: string
  onReintentar: () => void
  /** Se llama al tocar un pedido, por ejemplo para cerrar el panel que contiene la lista. */
  onElegir?: () => void
}) {
  const { t } = useTranslation()

  if (!pedidos) {
    if (error) {
      return (
        <div>
          <p className="text-sm text-suave">{t('pedido.errorLista')}</p>
          <button type="button" onClick={onReintentar} className="mt-2 text-sm font-semibold text-miel">
            {t('comun.reintentar')}
          </button>
        </div>
      )
    }
    return <div className="h-16 animate-pulse rounded-2xl bg-linea" aria-busy="true" />
  }

  if (pedidos.length === 0) return <p className="text-sm text-suave">{vacio}</p>

  return (
    <ul className="space-y-3">
      {pedidos.map((pedido) => {
        const unidades = cantidadProductos(pedido)
        return (
          <li key={pedido.id}>
            <Link
              to={`/pedido/${pedido.id}`}
              onClick={onElegir}
              className="block rounded-2xl bg-crema px-4 py-3 ring-1 ring-linea/50 transition active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{t('pedido.tuPedido', { numero: numeros[pedido.id] ?? '' })}</p>
                  <p className="mt-0.5 text-sm text-suave">
                    {formatearHora(pedido.creadoEn)} · {unidades === 1 ? t('pedido.unProducto') : t('pedido.productos', { count: unidades })}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${COLOR_ESTADO[pedido.estado]}`}>
                  {t(`pedido.estados.${pedido.estado}`)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-miel">{t('pedido.verSeguimiento')}</span>
                <span className="font-semibold tabular-nums">{formatearSoles(pedido.total)}</span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
