import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FotoProducto } from '../../componentes/FotoProducto'
import { IconoCerrar, IconoMas, IconoMenos } from '../../componentes/Iconos'
import { formatearSoles, precioLinea } from '../../lib/dinero'
import type { Adicional, Ingrediente, Producto } from '../../tipos'

export function DetalleProducto({
  producto,
  onCerrar,
  onAgregar,
}: {
  producto: Producto
  onCerrar: () => void
  onAgregar: (datos: {
    cantidad: number
    adicionales: Adicional[]
    sinIngredientes: Ingrediente[]
    nota?: string
  }) => void
}) {
  const { t } = useTranslation()
  const [cantidad, setCantidad] = useState(1)
  const [extras, setExtras] = useState<number[]>([])
  const [sin, setSin] = useState<number[]>([])
  const [nota, setNota] = useState('')

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

  const elegidos = producto.adicionales.filter((extra) => extras.includes(extra.id))
  const total = useMemo(
    () => precioLinea(producto.precio, elegidos.map((extra) => extra.precioExtra), cantidad),
    [producto.precio, elegidos, cantidad],
  )

  function alternar(lista: number[], id: number, poner: (valor: number[]) => void) {
    poner(lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id])
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/45 sm:items-center" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-producto"
        className="entrada flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-pizarra shadow-2xl sm:rounded-3xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="relative aspect-[16/9] shrink-0">
          <FotoProducto productoId={producto.id} imagenUrl={producto.imagenUrl} />
          <button
            type="button"
            onClick={onCerrar}
            aria-label={t('comun.cerrar')}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-pizarra/95 text-tinta"
          >
            <IconoCerrar />
          </button>
        </div>
        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="titulo-producto" className="font-serif text-3xl leading-tight">
              {producto.nombre}
            </h2>
            <p className="shrink-0 font-semibold text-miel">{formatearSoles(producto.precio)}</p>
          </div>
          <p className="text-sm leading-relaxed text-suave">{producto.descripcion}</p>
          {!producto.disponible && (
            <p className="rounded-2xl bg-tinta px-3 py-2 text-sm font-semibold text-papel">{t('menu.agotado')}</p>
          )}

          <div>
            <p className="text-sm font-semibold">{t('menu.cantidad')}</p>
            <div className="mt-2 inline-flex items-center gap-3 rounded-full bg-crema px-2 py-1">
              <button
                type="button"
                aria-label={t('menu.disminuir')}
                onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
                className="grid h-10 w-10 place-items-center rounded-full bg-pizarra"
              >
                <IconoMenos />
              </button>
              <span className="w-6 text-center font-semibold tabular-nums">{cantidad}</span>
              <button
                type="button"
                aria-label={t('menu.aumentar')}
                onClick={() => setCantidad((valor) => Math.min(20, valor + 1))}
                className="grid h-10 w-10 place-items-center rounded-full bg-pizarra"
              >
                <IconoMas />
              </button>
            </div>
          </div>

          {producto.adicionales.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold">{t('menu.adicionales')}</legend>
              <p className="text-xs text-suave">{t('menu.adicionalesAyuda')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {producto.adicionales.map((extra) => {
                  const activo = extras.includes(extra.id)
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => alternar(extras, extra.id, setExtras)}
                      className={`rounded-full px-3 py-2 text-sm font-medium ${
                        activo ? 'bg-terracota text-white' : 'bg-crema text-tinta'
                      }`}
                    >
                      {extra.nombre} · {formatearSoles(extra.precioExtra)}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {producto.ingredientes.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold">{t('menu.sin')}</legend>
              <p className="text-xs text-suave">{t('menu.sinAyuda')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {producto.ingredientes.map((ingrediente) => {
                  const activo = sin.includes(ingrediente.id)
                  return (
                    <button
                      key={ingrediente.id}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => alternar(sin, ingrediente.id, setSin)}
                      className={`rounded-full px-3 py-2 text-sm font-medium ${
                        activo ? 'bg-oliva text-papel' : 'bg-crema text-tinta'
                      }`}
                    >
                      {t('pedido.sin')} {ingrediente.nombre}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <label className="block">
            <span className="text-sm font-semibold">{t('menu.nota')}</span>
            <textarea
              value={nota}
              maxLength={300}
              rows={3}
              placeholder={t('menu.notaPlaceholder')}
              onChange={(evento) => setNota(evento.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-linea bg-crema px-3 py-3 text-base outline-none"
            />
          </label>
        </div>
        <div className="border-t border-linea px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={!producto.disponible}
            onClick={() =>
              onAgregar({
                cantidad,
                adicionales: elegidos,
                sinIngredientes: producto.ingredientes.filter((item) => sin.includes(item.id)),
                nota,
              })
            }
            className="w-full rounded-full bg-terracota px-5 py-3.5 text-base font-semibold text-white disabled:opacity-50"
          >
            {t('menu.agregarPor', { total: formatearSoles(total) })}
          </button>
        </div>
      </div>
    </div>
  )
}
