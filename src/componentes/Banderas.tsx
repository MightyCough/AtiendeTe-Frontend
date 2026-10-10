import { useTranslation } from 'react-i18next'
import { guardarIdioma, idiomaActivo } from '../lib/idioma'
import type { Idioma } from '../tipos'

const OPCIONES: Array<{ idioma: Idioma; bandera: string }> = [
  { idioma: 'es', bandera: '🇵🇪' },
  { idioma: 'en', bandera: '🇬🇧' },
]

export function Banderas({ grande = false }: { grande?: boolean }) {
  const { t, i18n } = useTranslation()
  const actual = idiomaActivo(i18n.language)

  return (
    <div className="flex gap-2" role="group" aria-label={t('menu.eligeIdioma')}>
      {OPCIONES.map((opcion) => {
        const activo = actual === opcion.idioma
        return (
          <button
            key={opcion.idioma}
            type="button"
            aria-pressed={activo}
            onClick={() => {
              void guardarIdioma(opcion.idioma)
            }}
            className={`inline-flex items-center gap-2 rounded-full border font-semibold transition ${
              grande ? 'px-4 py-3 text-base' : 'px-3 py-1.5 text-sm'
            } ${activo ? 'border-oliva bg-oliva text-papel' : 'border-linea bg-papel text-tinta'}`}
          >
            <span aria-hidden className={grande ? 'text-2xl' : 'text-base'}>
              {opcion.bandera}
            </span>
            {t(`idioma.${opcion.idioma}`)}
          </button>
        )
      })}
    </div>
  )
}
