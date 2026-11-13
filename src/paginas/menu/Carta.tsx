import { useTranslation } from 'react-i18next'
import { FotoProducto } from '../../componentes/FotoProducto'
import { IconoMas } from '../../componentes/Iconos'
import { Marca } from '../../componentes/Marca'
import { formatearSoles } from '../../lib/dinero'
import type { Categoria, Mesa, Producto } from '../../tipos'

export function Carta({
  mesa,
  categorias,
  categoriaActiva,
  onCategoria,
  unidades,
  total,
  onAbrir,
  onCarrito,
  pedidosHoy,
  pedidosActivos,
  onPedidos,
}: {
  mesa: Mesa
  categorias: Categoria[]
  categoriaActiva: number
  onCategoria: (id: number) => void
  unidades: number
  total: number
  onAbrir: (producto: Producto) => void
  onCarrito: () => void
  /** Pedidos de hoy de la mesa; null mientras cargan. */
  pedidosHoy: number | null
  pedidosActivos: number
  onPedidos: () => void
}) {
  const { t } = useTranslation()
  const categoria = categorias.find((item) => item.id === categoriaActiva) ?? categorias[0]

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-28">
      <header className="sticky top-0 z-20 border-b border-linea/40 bg-[#243228]/95 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Marca />
          <button
            type="button"
            onClick={onPedidos}
            className="inline-flex items-center gap-2 rounded-full border border-miel/70 px-4 py-2 text-sm font-semibold text-miel"
          >
            {t('menu.misPedidos')}
            {pedidosHoy != null && (
              <span
                className={`grid min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold leading-6 ${
                  pedidosActivos > 0 ? 'bg-terracota text-white' : 'bg-linea text-tinta-oscura'
                }`}
              >
                {pedidosHoy}
              </span>
            )}
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-serif text-2xl">{t('menu.mesa', { numero: mesa.numero })}</p>
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${mesa.online ? 'bg-emerald-500 punto-vivo' : 'bg-stone-400'}`} />
            {mesa.online ? t('menu.conectada') : t('menu.desconectada')}
          </p>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t('menu.carta')}>
          {categorias.map((item) => {
            const activa = item.id === categoria?.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => onCategoria(item.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  activa ? 'bg-miel text-tinta-oscura' : 'text-tinta ring-1 ring-linea/60'
                }`}
              >
                {item.nombre}
              </button>
            )
          })}
        </div>
      </header>

      <div className="space-y-4 px-4 py-2">
        {categoria?.productos.map((producto) => (
          <button
            key={producto.id}
            type="button"
            onClick={() => onAbrir(producto)}
            className={`w-full overflow-hidden rounded-3xl bg-pizarra text-left ring-1 ring-linea/50 transition active:scale-[0.99] ${
              producto.disponible ? '' : 'opacity-75'
            }`}
          >
            <div className="relative aspect-[16/10]">
              <FotoProducto productoId={producto.id} imagenUrl={producto.imagenUrl} />
              {producto.disponible ? (
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-terracota text-white shadow-lg"
                >
                  <IconoMas className="h-6 w-6" />
                </span>
              ) : (
                <span className="absolute left-3 top-3 rounded-full bg-tinta/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-papel">
                  {t('menu.agotado')}
                </span>
              )}
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl leading-tight">{producto.nombre}</h2>
                <span className="shrink-0 font-semibold text-miel">{formatearSoles(producto.precio)}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-suave">{producto.descripcion}</p>
            </div>
          </button>
        ))}
      </div>

      {unidades > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-lg px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onCarrito}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-terracota py-3 pl-3 pr-5 text-white shadow-xl ring-2 ring-papel/30"
          >
            <span className="inline-flex items-center gap-3">
              <span className="grid h-8 min-w-8 place-items-center rounded-full bg-white px-2 text-sm font-bold tabular-nums text-terracota-oscuro">
                {unidades}
              </span>
              <span className="text-base font-semibold">{t('menu.verPedido')}</span>
            </span>
            <span className="font-semibold tabular-nums">{formatearSoles(total)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
