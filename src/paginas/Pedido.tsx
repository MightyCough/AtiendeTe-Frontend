import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/cliente'
import { ErrorApi } from '../api/errores'
import { DetalleItems } from '../componentes/DetalleItems'
import { Marca } from '../componentes/Marca'
import { PasoPedido } from '../componentes/PasoPedido'
import { useEvento } from '../hooks/useEvento'
import { formatearSoles } from '../lib/dinero'
import type { Pedido } from '../tipos'

export function PedidoPagina() {
  const { t } = useTranslation()
  const params = useParams()
  const id = Number(params.id)
  const valido = Number.isInteger(id) && id > 0
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [ausente, setAusente] = useState(!valido)
  const [errorRed, setErrorRed] = useState(false)
  const [intento, setIntento] = useState(0)

  const cargar = useCallback(
    (silencioso: boolean) => {
      if (!valido) return
      if (!silencioso) setErrorRed(false)
      api
        .pedido(id)
        .then((datos) => {
          setPedido(datos)
          setAusente(false)
          setErrorRed(false)
        })
        .catch((error: unknown) => {
          if (error instanceof ErrorApi && error.estado === 404) setAusente(true)
          else if (!silencioso) setErrorRed(true)
        })
    },
    [id, valido],
  )

  useEffect(() => {
    document.title = `${t('pedido.titulo')} · AtiendeTe`
  }, [t])

  useEffect(() => {
    cargar(false)
  }, [cargar, intento])

  useEffect(() => {
    const temporizador = window.setInterval(() => {
      if (document.visibilityState === 'visible') cargar(true)
    }, 8000)
    return () => window.clearInterval(temporizador)
  }, [cargar])

  useEvento('pedido:actualizado', (dato) => {
    if (dato.id !== id) return
    setPedido((previo) => (previo ? { ...previo, estado: dato.estado, mesa: dato.mesa } : previo))
    cargar(true)
  })

  if (ausente) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
        <Marca />
        <h1 className="mt-6 font-serif text-4xl">{t('pedido.noEncontrado')}</h1>
        <p className="mt-3 text-suave">{t('pedido.noEncontradoTexto')}</p>
        <Link to="/" className="mt-6 w-fit rounded-full bg-oliva px-5 py-3 font-semibold text-papel">
          {t('comun.inicio')}
        </Link>
      </main>
    )
  }

  if (errorRed || !pedido) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
        {errorRed ? (
          <>
            <p>{t('comun.errorRed')}</p>
            <button
              type="button"
              onClick={() => setIntento((valor) => valor + 1)}
              className="mt-4 w-fit rounded-full bg-oliva px-5 py-3 font-semibold text-papel"
            >
              {t('comun.reintentar')}
            </button>
          </>
        ) : (
          <p className="text-suave">{t('comun.cargando')}</p>
        )}
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 py-6">
      <Marca />
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-oro">
        {t('menu.mesa', { numero: pedido.mesa })}
      </p>
      <h1 className="mt-2 font-serif text-4xl">{t('pedido.numero', { id: pedido.id })}</h1>
      <div className="mt-8 rounded-3xl bg-papel px-4 py-5 ring-1 ring-linea">
        <PasoPedido estado={pedido.estado} />
        <p className="mt-5 text-center text-lg" aria-live="polite">
          {t(`pedido.mensajes.${pedido.estado}`)}
        </p>
        <p className="mt-2 text-center text-sm text-suave">{t('pedido.luz')}</p>
      </div>
      <section className="mt-6 rounded-3xl bg-papel px-4 py-5 ring-1 ring-linea">
        <h2 className="font-serif text-2xl">{t('pedido.resumen')}</h2>
        <div className="mt-4">
          <DetalleItems items={pedido.items} etiquetaSin={t('pedido.sin')} etiquetaNota={t('pedido.nota')} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-linea pt-3">
          <span className="font-semibold">{t('menu.total')}</span>
          <span className="font-serif text-2xl">{formatearSoles(pedido.total)}</span>
        </div>
      </section>
      <Link to={`/menu?mesa=${pedido.mesa}`} className="mt-6 inline-block text-sm font-semibold text-terracota">
        {t('pedido.volverCarta')}
      </Link>
    </main>
  )
}
