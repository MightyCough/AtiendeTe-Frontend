import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/cliente'
import { ErrorApi } from '../api/errores'
import { useEvento } from '../hooks/useEvento'
import { agregarLinea, cambiarCantidad, quitarLinea, sincronizarNombres, totalCarrito } from '../lib/carrito'
import { interpretarMesa } from '../lib/mesa'
import type { Categoria, LineaCarrito, Mesa, Producto } from '../tipos'
import { CarritoPanel } from './menu/CarritoPanel'
import { Carta } from './menu/Carta'
import { DetalleProducto } from './menu/DetalleProducto'
import { ErrorMesa } from './menu/ErrorMesa'

function claveCarrito(mesa: number): string {
  return `atiendete-carrito-${mesa}`
}

function leerCarrito(mesa: number): LineaCarrito[] {
  try {
    const crudo = sessionStorage.getItem(claveCarrito(mesa))
    if (!crudo) return []
    const datos = JSON.parse(crudo) as LineaCarrito[]
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

export function MenuPagina() {
  const [params] = useSearchParams()
  const mesa = interpretarMesa(params.get('mesa'))
  if (!mesa.ok) return <ErrorMesa motivo={mesa.motivo} />
  return <ExperienciaMesa key={mesa.numero} numero={mesa.numero} />
}

function ExperienciaMesa({ numero }: { numero: number }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [ausente, setAusente] = useState(false)
  const [categorias, setCategorias] = useState<Categoria[] | null>(null)
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [errorMesa, setErrorMesa] = useState(false)
  const [errorMenu, setErrorMenu] = useState(false)
  const [intento, setIntento] = useState(0)
  const [lineas, setLineas] = useState<LineaCarrito[]>(() => leerCarrito(numero))
  const [producto, setProducto] = useState<Producto | null>(null)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(false)

  useEffect(() => {
    document.title = `${t('menu.carta')} · AtiendeTe`
  }, [t])

  useEffect(() => {
    sessionStorage.setItem(claveCarrito(numero), JSON.stringify(lineas))
  }, [lineas, numero])

  useEffect(() => {
    let vivo = true
    setErrorMesa(false)
    api
      .mesa(numero)
      .then((datos) => {
        if (!vivo) return
        setMesa(datos)
        setAusente(false)
      })
      .catch((error: unknown) => {
        if (!vivo) return
        if (error instanceof ErrorApi && error.estado === 404) setAusente(true)
        else {
          setMesa(null)
          setErrorMesa(true)
        }
      })
    return () => {
      vivo = false
    }
  }, [numero, intento])

  useEffect(() => {
    let vivo = true
    setErrorMenu(false)
    api
      .menu()
      .then((datos) => {
        if (!vivo) return
        if (!Array.isArray(datos)) {
          setCategorias(null)
          setErrorMenu(true)
          return
        }
        setCategorias(datos)
        setCategoriaId((actual) =>
          datos.some((categoria) => categoria.id === actual) ? actual : (datos[0]?.id ?? null),
        )
        setLineas((previas) => sincronizarNombres(previas, datos))
        setErrorMenu(false)
      })
      .catch(() => {
        if (!vivo) return
        setCategorias(null)
        setErrorMenu(true)
      })
    return () => {
      vivo = false
    }
  }, [intento])

  useEvento('mesa:conexion', (dato) => {
    if (dato.numero !== numero) return
    setMesa((previa) =>
      previa ? { ...previa, online: dato.online, ultimaConexion: new Date().toISOString() } : previa,
    )
  })

  const errorRed = errorMesa || errorMenu
  const total = useMemo(() => totalCarrito(lineas), [lineas])
  const unidades = lineas.reduce((suma, linea) => suma + linea.cantidad, 0)

  if (ausente) return <ErrorMesa motivo="desconocida" numero={numero} />

  if (!mesa || !categorias || categoriaId == null) {
    if (errorRed) {
      return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
          <p className="text-lg">{t('comun.errorRed')}</p>
          <button
            type="button"
            onClick={() => setIntento((valor) => valor + 1)}
            className="mt-4 w-fit rounded-full bg-oliva px-5 py-3 font-semibold text-papel"
          >
            {t('comun.reintentar')}
          </button>
        </main>
      )
    }
    return (
      <main className="mx-auto max-w-lg space-y-3 px-4 py-8" aria-busy="true">
        <p className="text-sm text-suave">{t('comun.cargando')}</p>
        <div className="h-10 w-48 animate-pulse rounded-full bg-linea" />
        <div className="h-52 animate-pulse rounded-3xl bg-linea" />
        <div className="h-52 animate-pulse rounded-3xl bg-linea" />
      </main>
    )
  }

  return (
    <>
      <Carta
        mesa={mesa}
        categorias={categorias}
        categoriaActiva={categoriaId}
        onCategoria={setCategoriaId}
        unidades={unidades}
        total={total}
        onAbrir={setProducto}
        onCarrito={() => setCarritoAbierto(true)}
      />
      {producto && (
        <DetalleProducto
          producto={producto}
          onCerrar={() => setProducto(null)}
          onAgregar={(datos) => {
            setLineas((previas) =>
              agregarLinea(previas, {
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: datos.cantidad,
                adicionales: datos.adicionales,
                sinIngredientes: datos.sinIngredientes,
                nota: datos.nota,
              }),
            )
            setProducto(null)
          }}
        />
      )}
      {carritoAbierto && (
        <CarritoPanel
          lineas={lineas}
          total={total}
          enviando={enviando}
          error={errorEnvio}
          onCerrar={() => setCarritoAbierto(false)}
          onCantidad={(clave, cantidad) => setLineas((previas) => cambiarCantidad(previas, clave, cantidad))}
          onQuitar={(clave) => setLineas((previas) => quitarLinea(previas, clave))}
          onConfirmar={() => {
            setEnviando(true)
            setErrorEnvio(false)
            void api
              .crearPedido({
                mesa: numero,
                idioma: 'es',
                items: lineas.map((linea) => ({
                  productoId: linea.productoId,
                  cantidad: linea.cantidad,
                  adicionales: linea.adicionales.map((extra) => extra.id),
                  sinIngredientes: linea.sinIngredientes.map((item) => item.id),
                  ...(linea.nota ? { nota: linea.nota } : {}),
                })),
              })
              .then((pedido) => {
                sessionStorage.removeItem(claveCarrito(numero))
                setLineas([])
                navigate(`/pedido/${pedido.id}`)
              })
              .catch(() => setErrorEnvio(true))
              .finally(() => setEnviando(false))
          }}
        />
      )}
    </>
  )
}
