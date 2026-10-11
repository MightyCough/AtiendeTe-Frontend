import { useTranslation } from 'react-i18next'
import { ESTADOS, type EstadoPedido } from '../tipos'

export function PasoPedido({ estado }: { estado: EstadoPedido }) {
  const { t } = useTranslation()
  const indice = ESTADOS.indexOf(estado)
  const terminado = estado === 'ENTREGADO'

  return (
    <ol className="grid grid-cols-4">
      {ESTADOS.map((paso, i) => {
        const hecho = terminado || i < indice
        const actual = !terminado && i === indice
        const marcado = hecho || actual
        return (
          <li key={paso} className="relative min-w-0 text-center" aria-current={actual ? 'step' : undefined}>
            {i > 0 && (
              <span
                className={`absolute left-0 right-1/2 top-4 h-0.5 ${i <= indice ? 'bg-terracota' : 'bg-linea'}`}
                aria-hidden
              />
            )}
            {i < ESTADOS.length - 1 && (
              <span
                className={`absolute left-1/2 right-0 top-4 h-0.5 ${i < indice ? 'bg-terracota' : 'bg-linea'}`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${
                marcado ? 'bg-terracota text-white' : 'bg-linea text-suave'
              } ${actual ? 'paso-actual' : ''}`}
            >
              {hecho && !actual ? '✓' : i + 1}
            </span>
            <p className={`mt-2 text-[11px] font-semibold leading-tight ${marcado ? 'text-tinta' : 'text-suave'}`}>
              {t(`pedido.estados.${paso}`)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
