import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/cliente'
import { ErrorApi } from '../api/errores'
import { DetalleItems } from '../componentes/DetalleItems'
import { ListaPedidosMesa } from '../componentes/ListaPedidosMesa'
import { Marca } from '../componentes/Marca'
import { PasoPedido } from '../componentes/PasoPedido'
import { useEvento } from '../hooks/useEvento'
import { usePedidosMesa } from '../hooks/usePedidosMesa'
import { formatearSoles } from '../lib/dinero'
import { buscarPropio, leerPropios } from '../lib/pedidosPropios'
import type { Pedido } from '../tipos'

function OtrosPedidos({ mesa, actual }: { mesa: number; actual: number }) {
  const { t } = useTranslation()
  const { pedidos, numeros, error, recargar } = usePedidosMesa(mesa)
  const otros = pedidos ? pedidos.filter((item) => item.id !== actual) : null

  return (
    <section className="mt-6 rounded-3xl bg-miel/15 px-4 py-5 ring-2 ring-miel/70">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-miel">{t('pedido.otrosPedidos')}</h2>
        {otros && otros.length > 0 && (
          <span className="grid min-w-7 place-items-center rounded-full bg-miel px-2 text-sm font-bold leading-7 text-tinta-oscura">
            {otros.length}
          </span>
        )}
      </div>
      <div className="mt-4">
        <ListaPedidosMesa
          pedidos={otros}
          numeros={numeros}
          error={error}
          vacio={t('pedido.sinOtros')}
          onReintentar={recargar}
        />
      </div>
    </section>
  )
}

export function PedidoPagina() {
  const { t } = useTranslation()
  const params = useParams()
  const id = Number(params.id)
  const valido = Number.isInteger(id) && id > 0
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [ausente, setAusente] = useState(!valido)
  const [errorRed, setErrorRed] = useState(false)
  const [intento, setIntento] = useState(0)
  // Solo se ve el pedido que hizo este celular. Se decide una vez al abrir la pantalla.
  const [propio] = useState(() => (valido ? buscarPropio(leerPropios(), id) : undefined))

  const cargar = useCallback(
    (silencioso: boolean) => {
      if (!valido || !propio) return
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
    [id, valido, propio],
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

  if (valido && !propio) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
        <Marca />
        <h1 className="mt-6 font-serif text-4xl">{t('pedido.noEsTuyo')}</h1>
        <p className="mt-3 text-suave">{t('pedido.noEsTuyoTexto')}</p>
        <Link to="/" className="mt-6 w-fit rounded-full bg-terracota px-5 py-3 font-semibold text-white">
          {t('comun.inicio')}
        </Link>
      </main>
    )
  }

  if (ausente) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
        <Marca />
        <h1 className="mt-6 font-serif text-4xl">{t('pedido.noEncontrado')}</h1>
        <p className="mt-3 text-suave">{t('pedido.noEncontradoTexto')}</p>
        <Link to="/" className="mt-6 w-fit rounded-full bg-terracota px-5 py-3 font-semibold text-white">
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
              className="mt-4 w-fit rounded-full bg-terracota px-5 py-3 font-semibold text-white"
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
    <main className="mx-auto min-h-dvh max-w-lg px-5 py-6 pb-28">
      <Marca />
      <h1 className="mt-6 font-serif text-5xl leading-none">
        {t('menu.mesa', { numero: pedido.mesa })}
      </h1>
      <p className="mt-2 text-lg text-suave">{propio ? t('pedido.tuPedido', { numero: propio.numero }) : t('pedido.tuPedidoSolo')}</p>
      <div className="mt-8 rounded-3xl bg-pizarra px-4 py-5 ring-1 ring-linea">
        <PasoPedido estado={pedido.estado} />
        <p className="mt-5 text-center text-lg" aria-live="polite">
          {t(`pedido.mensajes.${pedido.estado}`)}
        </p>
        <p className="mt-2 text-center text-sm text-suave">{t('pedido.luz')}</p>
      </div>
      <section className="mt-6 rounded-3xl bg-pizarra px-4 py-5 ring-1 ring-linea">
        <h2 className="font-serif text-2xl">{t('pedido.resumen')}</h2>
        <div className="mt-4">
          <DetalleItems items={pedido.items} etiquetaSin={t('pedido.sin')} etiquetaNota={t('pedido.nota')} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-linea pt-3">
          <span className="font-semibold">{t('menu.total')}</span>
          <span className="font-serif text-2xl">{formatearSoles(pedido.total)}</span>
        </div>
      </section>
      <OtrosPedidos mesa={pedido.mesa} actual={pedido.id} />
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-lg px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          to={`/menu?mesa=${pedido.mesa}`}
          className="flex w-full items-center justify-center rounded-full bg-terracota px-5 py-3.5 font-semibold text-white shadow-xl ring-2 ring-papel/30"
        >
          {t('pedido.pedirMas')}
        </Link>
      </div>
    </main>
  )
}
