import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { api } from '../api/cliente'
import { reiniciarMock } from '../api/mock'
import { Banderas } from '../componentes/Banderas'
import { DetalleItems } from '../componentes/DetalleItems'
import { Marca } from '../componentes/Marca'
import { usarMock } from '../config'
import { useConexion, useEvento } from '../hooks/useEvento'
import { formatearSoles } from '../lib/dinero'
import { formatearHora } from '../lib/formato'
import { idiomaActivo } from '../lib/idioma'
import type { EstadoPedido, Mesa, ReporteHoy } from '../tipos'

const TONO: Record<EstadoPedido, string> = {
  RECIBIDO: 'bg-[#f4e3c4] text-[#5c4310]',
  EN_PREPARACION: 'bg-[#f6d3c2] text-[#8a3418]',
  LISTO: 'bg-[#d7ead4] text-[#1e5a32]',
  ENTREGADO: 'bg-[#ece7df] text-[#5c534c]',
}

export function AdminPagina() {
  const { t, i18n } = useTranslation()
  const idioma = idiomaActivo(i18n.language)
  const [reporte, setReporte] = useState<ReporteHoy | null>(null)
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [error, setError] = useState(false)
  const [filtro, setFiltro] = useState<EstadoPedido | 'TODOS'>('TODOS')
  const [abierto, setAbierto] = useState<number | null>(null)
  const [enVivo, setEnVivo] = useState(usarMock)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    document.title = `${t('admin.titulo')} · AtiendeTe`
  }, [t])

  const cargar = useCallback(() => {
    return Promise.all([api.reporteHoy(), api.mesas()])
      .then(([datos, lista]) => {
        setReporte(datos)
        setMesas(lista)
        setError(false)
      })
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar, intento])

  useConexion(setEnVivo)
  useEvento('pedido:nuevo', () => void cargar())
  useEvento('pedido:actualizado', () => void cargar())
  useEvento('mesa:conexion', (dato) => {
    setMesas((previas) =>
      previas.map((mesa) =>
        mesa.numero === dato.numero
          ? { ...mesa, online: dato.online, ultimaConexion: new Date().toISOString() }
          : mesa,
      ),
    )
  })

  const pedidos = (reporte?.pedidos ?? []).filter((pedido) => filtro === 'TODOS' || pedido.estado === filtro)
  const enLinea = mesas.filter((mesa) => mesa.online).length

  return (
    <div className="min-h-dvh">
      <header className="border-b border-linea bg-papel/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <Link to="/">
              <Marca />
            </Link>
            <h1 className="mt-2 font-serif text-4xl">{t('admin.titulo')}</h1>
            <p className="text-sm text-suave">{t('admin.subtitulo')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-crema px-3 py-1 text-xs font-semibold">
              <span className={`h-2 w-2 rounded-full ${enVivo ? 'bg-emerald-500 punto-vivo' : 'bg-stone-400'}`} />
              {t('comun.enVivo')}
            </span>
            {usarMock && (
              <span className="rounded-full bg-miel/30 px-3 py-1 text-xs font-semibold">{t('comun.demo')}</span>
            )}
            <Banderas />
            <Link to="/cocina" className="rounded-full bg-crema px-4 py-2 text-sm font-semibold">
              {t('admin.cocina')}
            </Link>
            <Link to="/admin/qr" className="rounded-full bg-oliva px-4 py-2 text-sm font-semibold text-papel">
              {t('admin.imprimir')}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-2xl bg-papel px-4 py-3 ring-1 ring-linea">
            <p>{t('comun.errorRed')}</p>
            <button type="button" onClick={() => setIntento((valor) => valor + 1)} className="mt-2 font-semibold text-terracota">
              {t('comun.reintentar')}
            </button>
          </div>
        )}

        <section className="grid gap-3 md:grid-cols-3">
          <article className="rounded-3xl bg-papel p-5 ring-1 ring-linea">
            <p className="text-sm text-suave">{t('admin.pedidosHoy')}</p>
            <p className="mt-2 font-serif text-4xl">{reporte?.pedidos.length ?? '—'}</p>
          </article>
          <article className="rounded-3xl bg-oliva p-5 text-papel">
            <p className="text-sm text-papel/80">{t('admin.totalVendido')}</p>
            <p className="mt-2 font-serif text-4xl">{reporte ? formatearSoles(reporte.totalVendido) : '—'}</p>
            <p className="mt-2 text-xs text-papel/70">{t('admin.totalAyuda')}</p>
          </article>
          <article className="rounded-3xl bg-papel p-5 ring-1 ring-linea">
            <p className="text-sm text-suave">{t('admin.mesasEnLinea')}</p>
            <p className="mt-2 font-serif text-4xl">
              {mesas.length === 0 ? '—' : `${enLinea} / ${mesas.length}`}
            </p>
          </article>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
          <article className="rounded-3xl bg-papel p-5 ring-1 ring-linea">
            <h2 className="font-serif text-2xl">{t('admin.top')}</h2>
            {reporte && reporte.topProductos.length === 0 && <p className="mt-3 text-sm text-suave">{t('admin.topVacio')}</p>}
            <ol className="mt-4 space-y-3">
              {reporte?.topProductos.map((producto, indice) => (
                <li key={producto.productoId} className="flex items-center justify-between gap-3">
                  <span>
                    <span className="mr-2 font-serif text-xl text-oro">{indice + 1}</span>
                    {producto.nombre}
                  </span>
                  <span className="text-right text-sm">
                    <span className="block font-semibold">{t('admin.cantidad', { count: producto.cantidad })}</span>
                    <span className="text-suave">{formatearSoles(producto.total)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl bg-papel p-5 ring-1 ring-linea">
            <h2 className="font-serif text-2xl">{t('admin.mesas')}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {mesas.map((mesa) => (
                <li key={mesa.numero} className="rounded-2xl bg-crema px-3 py-3">
                  <p className="font-serif text-xl">{t('menu.mesa', { numero: mesa.numero })}</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm">
                    <span className={`h-2.5 w-2.5 rounded-full ${mesa.online ? 'bg-emerald-500 punto-vivo' : 'bg-stone-400'}`} />
                    {mesa.online ? t('admin.enLinea') : t('admin.fueraDeLinea')}
                  </p>
                  <p className="mt-1 text-xs text-suave">
                    {mesa.ultimaConexion ? formatearHora(mesa.ultimaConexion, idioma) : t('admin.sinConexion')}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-6 rounded-3xl bg-papel p-5 ring-1 ring-linea">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl">{t('admin.pedidos')}</h2>
            <div className="flex flex-wrap gap-2">
              <Filtro activo={filtro === 'TODOS'} onClick={() => setFiltro('TODOS')}>
                {t('admin.filtroTodos')}
              </Filtro>
              {(['RECIBIDO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'] as EstadoPedido[]).map((estado) => (
                <Filtro key={estado} activo={filtro === estado} onClick={() => setFiltro(estado)}>
                  {t(`pedido.estados.${estado}`)}
                </Filtro>
              ))}
            </div>
          </div>
          {pedidos.length === 0 && <p className="mt-4 text-sm text-suave">{t('admin.pedidosVacio')}</p>}
          <ul className="mt-4 divide-y divide-linea">
            {pedidos.map((pedido) => {
              const abiertoEste = abierto === pedido.id
              return (
                <li key={pedido.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => setAbierto(abiertoEste ? null : pedido.id)}
                    aria-expanded={abiertoEste}
                    className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                  >
                    <span className="font-semibold">
                      #{pedido.id}
                      <span className="ml-2 font-normal text-suave">{formatearHora(pedido.creadoEn, idioma)}</span>
                    </span>
                    <span>{t('menu.mesa', { numero: pedido.mesa })}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TONO[pedido.estado]}`}>
                      {t(`pedido.estados.${pedido.estado}`)}
                    </span>
                    <span className="font-semibold tabular-nums">{formatearSoles(pedido.total)}</span>
                    <span className="text-xs font-semibold text-terracota">
                      {abiertoEste ? t('admin.ocultarDetalle') : t('admin.verDetalle')}
                    </span>
                  </button>
                  {abiertoEste && (
                    <div className="mt-3 rounded-2xl bg-crema px-4 py-3">
                      <DetalleItems items={pedido.items} etiquetaSin={t('pedido.sin')} etiquetaNota={t('pedido.nota')} />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {usarMock && (
          <button
            type="button"
            onClick={() => reiniciarMock()}
            className="mt-6 text-sm font-semibold text-suave underline"
          >
            {t('admin.reiniciar')}
          </button>
        )}
      </main>
    </div>
  )
}

function Filtro({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${activo ? 'bg-oliva text-papel' : 'bg-crema text-tinta'}`}
    >
      {children}
    </button>
  )
}
