import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Marca } from '../componentes/Marca'

export function NoEncontrada() {
  const { t } = useTranslation()
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
      <Marca />
      <h1 className="mt-6 font-serif text-4xl">{t('noEncontrada.titulo')}</h1>
      <p className="mt-3 text-suave">{t('noEncontrada.texto')}</p>
      <Link to="/" className="mt-6 w-fit rounded-full bg-oliva px-5 py-3 font-semibold text-papel">
        {t('noEncontrada.volver')}
      </Link>
    </main>
  )
}
