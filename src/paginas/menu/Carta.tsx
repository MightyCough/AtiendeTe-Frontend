import { useTranslation } from 'react-i18next'
import { Banderas } from '../../componentes/Banderas'
import { FotoProducto } from '../../componentes/FotoProducto'
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
}: {
  mesa: Mesa
  categorias: Categoria[]
  categoriaActiva: number
  onCategoria: (id: number) => void
  unidades: number
  total: number
  onAbrir: (producto: Producto) => void
  onCarrito: () => void
}) {
  const { t } = useTranslation()
  const categoria = categorias.find((item) => item.id === categoriaActiva) ?? categorias[0]

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-28">
      <header className="sticky top-0 z-20 border-b border-linea/80 bg-crema/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <Marca />
          <Banderas />
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
                  activa ? 'bg-oliva text-papel' : 'bg-papel text-tinta ring-1 ring-linea'
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
            className={`w-full overflow-hidden rounded-3xl bg-papel text-left shadow-[0_10px_30px_rgba(36,28,22,0.06)] ring-1 ring-linea transition active:scale-[0.99] ${
              producto.disponible ? '' : 'opacity-75'
            }`}
          >
            <div className="relative aspect-[16/10]">
              <FotoProducto productoId={producto.id} imagenUrl={producto.imagenUrl} />
              {!producto.disponible && (
                <span className="absolute left-3 top-3 rounded-full bg-tinta/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-papel">
                  {t('menu.agotado')}
                </span>
              )}
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl leading-tight">{producto.nombre}</h2>
                <span className="shrink-0 font-semibold text-terracota">{formatearSoles(producto.precio)}</span>
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
            className="flex w-full items-center justify-between rounded-full bg-oliva px-5 py-3.5 text-papel shadow-lg"
          >
            <span className="font-semibold">{t('menu.verPedido')}</span>
            <span className="text-sm">
              {unidades === 1 ? t('menu.unProducto') : t('menu.variosProductos', { count: unidades })}
              {' · '}
              {formatearSoles(total)}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
