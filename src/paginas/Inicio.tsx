import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Banderas } from '../componentes/Banderas'
import { Marca } from '../componentes/Marca'
import { usarMock } from '../config'

export function InicioPagina() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = 'AtiendeTe'
  }, [])

  return (
    <main className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-5 py-10 md:grid-cols-2">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-oro">{t('inicio.kicker')}</p>
        <div className="mt-4">
          <Marca />
        </div>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">{t('inicio.titulo')}</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-suave">{t('inicio.subtitulo')}</p>
        <div className="mt-6">
          <Banderas />
        </div>
      </section>
      <section className="space-y-3">
        <Link to="/cocina" className="block rounded-3xl bg-oliva px-5 py-5 text-papel">
          <span className="font-serif text-3xl">{t('inicio.cocina')}</span>
          <span className="mt-1 block text-sm text-papel/80">{t('inicio.cocinaAyuda')}</span>
        </Link>
        <Link to="/admin" className="block rounded-3xl bg-papel px-5 py-5 ring-1 ring-linea">
          <span className="font-serif text-3xl">{t('inicio.admin')}</span>
          <span className="mt-1 block text-sm text-suave">{t('inicio.adminAyuda')}</span>
        </Link>
        {usarMock && (
          <div className="rounded-3xl bg-papel px-5 py-5 ring-1 ring-linea">
            <p className="font-serif text-2xl">{t('inicio.prueba')}</p>
            <p className="mt-1 text-sm text-suave">{t('inicio.pruebaAyuda', { numero: 1 })}</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((numero) => (
                <Link
                  key={numero}
                  to={`/menu?mesa=${numero}`}
                  className="rounded-full bg-terracota px-4 py-2 text-sm font-semibold text-white"
                >
                  {t('menu.mesa', { numero })}
                </Link>
              ))}
            </div>
          </div>
        )}
        <p className="px-1 text-sm text-suave">
          <span className="font-semibold text-tinta">{t('inicio.cliente')} </span>
          {t('inicio.clienteAyuda')}
        </p>
      </section>
    </main>
  )
}
