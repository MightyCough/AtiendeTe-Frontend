import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Marca } from '../../componentes/Marca'

export function ErrorMesa({
  motivo,
  numero,
}: {
  motivo: 'ausente' | 'invalida' | 'desconocida'
  numero?: number
}) {
  const { t } = useTranslation()
  const titulo =
    motivo === 'ausente'
      ? t('mesa.ausenteTitulo')
      : motivo === 'invalida'
        ? t('mesa.invalidaTitulo')
        : t('mesa.desconocidaTitulo', { numero })
  const texto =
    motivo === 'ausente'
      ? t('mesa.ausenteTexto')
      : motivo === 'invalida'
        ? t('mesa.invalidaTexto')
        : t('mesa.desconocidaTexto')

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <Marca />
      <div className="entrada my-auto rounded-3xl bg-pizarra px-6 py-8 shadow-sm ring-1 ring-linea">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oro">AtiendeTe</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">{titulo}</h1>
        <p className="mt-4 text-base leading-relaxed text-suave">{texto}</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-oliva px-5 py-3 text-sm font-semibold text-papel"
        >
          {t('mesa.inicio')}
        </Link>
      </div>
    </main>
  )
}
