import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/cliente'
import { DetalleItems } from '../componentes/DetalleItems'
import { IconoCampana } from '../componentes/Iconos'
import { Marca } from '../componentes/Marca'
import { usarMock } from '../config'
import { useEvento } from '../hooks/useEvento'
import { fechaHoyLocal, haceCuanto } from '../lib/formato'
import { activarSonido, reproducirCampana } from '../lib/sonido'
import { ESTADOS, siguienteEstado, type EstadoPedido, type Pedido } from '../tipos'

const TITULO: Record<EstadoPedido, string> = {
  RECIBIDO: 'Recibido',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
}

const ACCION: Record<EstadoPedido, string | null> = {
  RECIBIDO: 'Preparar',
  EN_PREPARACION: 'Marcar listo',
  LISTO: 'Entregar',
  ENTREGADO: null,
}

const TONO: Record<EstadoPedido, string> = {
  RECIBIDO: 'bg-[#f4e3c4] text-[#5c4310]',
  EN_PREPARACION: 'bg-[#f6d3c2] text-[#8a3418]',
  LISTO: 'bg-[#d7ead4] text-[#1e5a32]',
  ENTREGADO: 'bg-[#ece7df] text-[#5c534c]',
}

export function CocinaPagina() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [sonido, setSonido] = useState(false)
  const [recien, setRecien] = useState<number[]>([])
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    const anterior = document.documentElement.lang
    document.documentElement.lang = 'es'
    document.title = 'Cocina · AtiendeTe'
    return () => {
      document.documentElement.lang = anterior
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setAhora(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])

  async function cargar() {
    try {
      const datos = await api.pedidos({ fecha: fechaHoyLocal() })
      setPedidos(datos)
      setError('')
    } catch {
      setError('No se pudieron cargar los pedidos.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void cargar()
  }, [])

  useEvento('pedido:nuevo', (pedido) => {
    setPedidos((previos) => (previos.some((item) => item.id === pedido.id) ? previos : [pedido, ...previos]))
    setRecien((previos) => [...previos, pedido.id])
    setAviso(`Nuevo pedido en la mesa ${pedido.mesa}`)
    if (sonido) reproducirCampana()
    window.setTimeout(() => {
      setRecien((previos) => previos.filter((id) => id !== pedido.id))
    }, 5000)
  })

  useEvento('pedido:actualizado', (dato) => {
    setPedidos((previos) =>
      previos.map((item) => (item.id === dato.id ? { ...item, estado: dato.estado, mesa: dato.mesa } : item)),
    )
    void cargar()
  })

  async function avanzar(pedido: Pedido) {
    const siguiente = siguienteEstado(pedido.estado)
    if (!siguiente) return
    setOcupado(pedido.id)
    setError('')
    const anterior = pedido.estado
    setPedidos((previos) => previos.map((item) => (item.id === pedido.id ? { ...item, estado: siguiente } : item)))
    try {
      await api.cambiarEstado(pedido.id, siguiente)
    } catch {
      setPedidos((previos) => previos.map((item) => (item.id === pedido.id ? { ...item, estado: anterior } : item)))
      setError('No se pudo cambiar el estado. Inténtalo de nuevo.')
    } finally {
      setOcupado(null)
    }
  }

  return (
    <div className="min-h-dvh bg-[#171412] text-[#f6efe4]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <Marca clara />
            <h1 className="mt-2 font-serif text-3xl">Cocina</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {usarMock && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#e7b15a]">
                Datos de demostración
              </span>
            )}
            <Link to="/admin" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Administración
            </Link>
            {!sonido && (
              <button
                type="button"
                onClick={() => {
                  void activarSonido().then((ok) => {
                    if (!ok) return
                    setSonido(true)
                    reproducirCampana()
                  })
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#e7b15a] px-4 py-2 text-sm font-semibold text-[#241c16]"
              >
                <IconoCampana />
                Activar sonido
              </button>
            )}
          </div>
        </div>
      </header>
      <p className="sr-only" aria-live="assertive">
        {aviso}
      </p>
      {error && <p className="mx-auto max-w-[1400px] px-4 pt-4 text-sm text-[#f0b4a2]">{error}</p>}
      {cargando ? (
        <p className="px-4 py-8 text-[#e7d3bf]">Cargando pedidos…</p>
      ) : (
        <div className="mx-auto grid max-w-[1400px] gap-3 px-4 py-4 xl:h-[calc(100dvh-7.5rem)] xl:grid-cols-4">
          {ESTADOS.map((estado) => {
            const columna = pedidos
              .filter((pedido) => pedido.estado === estado)
              .sort((a, b) => a.creadoEn.localeCompare(b.creadoEn))
            return (
              <section key={estado} className="flex min-h-0 flex-col rounded-3xl bg-[#221e1b] p-3">
                <header className="mb-3 flex items-center justify-between px-1">
                  <h2 className="font-serif text-2xl">{TITULO[estado]}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONO[estado]}`}>{columna.length}</span>
                </header>
                <div className="space-y-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
                  {columna.length === 0 && <p className="px-1 text-sm text-[#b7aa9e]">Sin pedidos</p>}
                  {columna.map((pedido) => (
                    <article
                      key={pedido.id}
                      className={`rounded-2xl bg-[#2c2622] p-4 ${recien.includes(pedido.id) ? 'pedido-nuevo' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-serif text-3xl leading-none">Mesa {pedido.mesa}</p>
                        <p className="text-right text-xs text-[#b7aa9e]">
                          #{pedido.id}
                          <br />
                          {haceCuanto(pedido.creadoEn, ahora)}
                        </p>
                      </div>
                      <div className="mt-3">
                        <DetalleItems
                          items={pedido.items}
                          etiquetaSin="Sin"
                          etiquetaNota="Nota"
                          claro
                          mostrarPrecios={false}
                        />
                      </div>
                      {ACCION[estado] && (
                        <button
                          type="button"
                          disabled={ocupado === pedido.id}
                          onClick={() => void avanzar(pedido)}
                          className="mt-4 min-h-14 w-full rounded-2xl bg-[#f3ecdf] text-lg font-bold text-[#241c16] disabled:opacity-60"
                        >
                          {ocupado === pedido.id ? 'Guardando…' : ACCION[estado]}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
