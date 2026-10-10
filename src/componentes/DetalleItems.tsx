import { formatearSoles } from '../lib/dinero'
import type { ItemPedido } from '../tipos'

export function DetalleItems({
  items,
  etiquetaSin,
  etiquetaNota,
  mostrarPrecios = true,
  claro = false,
}: {
  items: ItemPedido[]
  etiquetaSin: string
  etiquetaNota: string
  mostrarPrecios?: boolean
  claro?: boolean
}) {
  const texto = claro ? 'text-[#f6efe4]' : 'text-tinta'
  const suave = claro ? 'text-[#e7d3bf]' : 'text-suave'

  return (
    <ul className="space-y-3">
      {items.map((item, indice) => (
        <li key={`${item.productoId}-${indice}`} className={texto}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">
              <span className="mr-2 tabular-nums">{item.cantidad}×</span>
              {item.nombre}
            </p>
            {mostrarPrecios && <span className="shrink-0 tabular-nums">{formatearSoles(item.subtotal)}</span>}
          </div>
          {item.adicionales.length > 0 && (
            <p className={`mt-1 text-sm ${suave}`}>
              +{' '}
              {item.adicionales
                .map((extra) =>
                  mostrarPrecios ? `${extra.nombre} (${formatearSoles(extra.precioExtra)})` : extra.nombre,
                )
                .join(', ')}
            </p>
          )}
          {item.sinIngredientes.length > 0 && (
            <p className={`mt-1 text-sm ${suave}`}>
              {etiquetaSin}: {item.sinIngredientes.map((ingrediente) => ingrediente.nombre).join(', ')}
            </p>
          )}
          {item.nota && (
            <p className={`mt-1 rounded-xl px-2 py-1 text-sm ${claro ? 'bg-white/10' : 'bg-miel/20'}`}>
              <span className="font-semibold">{etiquetaNota}: </span>
              {item.nota}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
