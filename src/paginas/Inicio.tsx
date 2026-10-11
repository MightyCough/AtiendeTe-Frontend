import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Marca } from '../componentes/Marca'
import { usarMock } from '../config'

export function InicioPagina() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = 'AtiendeTe'
  }, [])

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-5 py-8 md:px-10">
      <header className="flex items-center justify-between gap-4">
        <Marca />
        <p className="text-right text-sm text-suave">{t('inicio.kicker')}</p>
      </header>
      <div className="grid flex-1 content-end gap-10 py-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <h1 className="max-w-xl font-serif text-6xl leading-[0.95] text-balance md:text-8xl">{t('inicio.titulo')}</h1>
        <div>
          <p className="max-w-md text-lg leading-relaxed text-suave">{t('inicio.subtitulo')}</p>
          <Link
            to="/cocina"
            className="mt-6 block rounded-3xl bg-terracota px-6 py-6 text-white transition hover:bg-terracota-oscuro"
          >
            <span className="font-serif text-5xl leading-none">{t('inicio.cocina')}</span>
            <span className="mt-2 block text-sm text-white">{t('inicio.cocinaAyuda')}</span>
          </Link>
          <Link
            to="/admin"
            className="mt-3 block rounded-3xl px-6 py-5 ring-1 ring-linea/70 transition hover:bg-pizarra"
          >
            <span className="font-serif text-4xl leading-none">{t('inicio.admin')}</span>
            <span className="mt-2 block text-sm text-suave">{t('inicio.adminAyuda')}</span>
          </Link>
          {usarMock && (
            <div className="mt-5">
              <p className="font-serif text-2xl">{t('inicio.prueba')}</p>
              <p className="mt-1 text-sm text-suave">{t('inicio.pruebaAyuda', { numero: 1 })}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3].map((numero) => (
                  <Link
                    key={numero}
                    to={`/menu?mesa=${numero}`}
                    className="rounded-full bg-miel px-4 py-2 text-sm font-semibold text-tinta-oscura"
                  >
                    {t('menu.mesa', { numero })}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 max-w-md text-sm text-suave">
            <span className="font-semibold text-tinta">{t('inicio.cliente')} </span>
            {t('inicio.clienteAyuda')}
          </p>
        </div>
      </div>
    </main>
  )
}
