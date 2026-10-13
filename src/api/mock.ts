import { buscarProductoFuente, localizarMenu } from '../datos/catalogo'
import { aCentimos, desdeCentimos, precioLinea } from '../lib/dinero'
import { diaLocal, fechaHoyLocal } from '../lib/formato'
import type {
  ConexionMesa,
  CrearPedido,
  EstadoPedido,
  Idioma,
  ItemPedido,
  MenuRespuesta,
  Mesa,
  Pedido,
  ReporteHoy,
} from '../tipos'
import { ErrorApi } from './errores'

const CLAVE_DB = 'atiendete-mock-db-v1'
const CLAVE_SIM = 'atiendete-mock-sim'
const CANAL = 'atiendete-mock'

interface BaseDatos {
  seq: number
  pedidos: Pedido[]
  mesas: Mesa[]
}

type Handler = (datos: unknown) => void

const locales = new Map<string, Set<Handler>>()
let canal: BroadcastChannel | null = null
let preparado = false
const memoria = new Map<string, string>()

function leerClave(clave: string): string | null {
  try {
    if (typeof localStorage === 'undefined') return memoria.get(clave) ?? null
    return localStorage.getItem(clave)
  } catch {
    return memoria.get(clave) ?? null
  }
}

function escribirClave(clave: string, valor: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      memoria.set(clave, valor)
      return
    }
    localStorage.setItem(clave, valor)
  } catch {
    memoria.set(clave, valor)
  }
}

function borrarClave(clave: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      memoria.delete(clave)
      return
    }
    localStorage.removeItem(clave)
  } catch {
    memoria.delete(clave)
  }
}

function mesasIniciales(): Mesa[] {
  const ahora = new Date().toISOString()
  return [
    { numero: 1, online: true, ultimaConexion: ahora },
    { numero: 2, online: true, ultimaConexion: ahora },
    { numero: 3, online: true, ultimaConexion: ahora },
    { numero: 4, online: false, ultimaConexion: new Date(Date.now() - 45 * 60000).toISOString() },
    { numero: 5, online: true, ultimaConexion: ahora },
    { numero: 6, online: true, ultimaConexion: ahora },
    { numero: 7, online: false, ultimaConexion: null },
    { numero: 8, online: true, ultimaConexion: ahora },
  ]
}

function hace(minutos: number): string {
  return new Date(Date.now() - minutos * 60000).toISOString()
}

function semilla(): BaseDatos {
  const pedidos = [
    armarPedido(1, {
      mesa: 3,
      idioma: 'es',
      estado: 'RECIBIDO',
      creadoEn: hace(2),
      items: [{ productoId: 3, cantidad: 1, adicionales: [106], sinIngredientes: [], nota: 'Sin mucha sal' }, { productoId: 11, cantidad: 2, adicionales: [], sinIngredientes: [206] }],
    }),
    armarPedido(2, {
      mesa: 2,
      idioma: 'es',
      estado: 'EN_PREPARACION',
      creadoEn: hace(18),
      items: [{ productoId: 5, cantidad: 1, adicionales: [101], sinIngredientes: [201], nota: 'Término medio' }, { productoId: 10, cantidad: 1, adicionales: [], sinIngredientes: [] }],
    }),
    armarPedido(3, {
      mesa: 5,
      idioma: 'es',
      estado: 'LISTO',
      creadoEn: hace(35),
      items: [{ productoId: 6, cantidad: 1, adicionales: [], sinIngredientes: [204] }],
    }),
    armarPedido(4, {
      mesa: 1,
      idioma: 'es',
      estado: 'ENTREGADO',
      creadoEn: hace(120),
      items: [{ productoId: 14, cantidad: 2, adicionales: [113], sinIngredientes: [] }, { productoId: 13, cantidad: 1, adicionales: [112], sinIngredientes: [206] }],
    }),
  ]
  return { seq: 5, pedidos, mesas: mesasIniciales() }
}

function armarItem(
  productoId: number,
  cantidad: number,
  adicionalesIds: number[],
  sinIds: number[],
  nota?: string,
): ItemPedido {
  const producto = buscarProductoFuente(productoId)
  if (!producto) throw new ErrorApi(400, 'Producto desconocido')
  const adicionales = adicionalesIds.map((id) => {
    const extra = producto.adicionales.find((item) => item.id === id)
    if (!extra) throw new ErrorApi(400, 'Adicional desconocido')
    return { id: extra.id, nombre: extra.nombre, precioExtra: extra.precioExtra }
  })
  const sinIngredientes = sinIds.map((id) => {
    const ingrediente = producto.ingredientesRemovibles.find((item) => item.id === id)
    if (!ingrediente) throw new ErrorApi(400, 'Ingrediente desconocido')
    return { id: ingrediente.id, nombre: ingrediente.nombre }
  })
  const subtotal = precioLinea(
    producto.precio,
    adicionales.map((extra) => extra.precioExtra),
    cantidad,
  )
  return {
    productoId,
    nombre: producto.nombre,
    cantidad,
    precioUnitario: producto.precio,
    adicionales,
    sinIngredientes,
    ...(nota ? { nota } : {}),
    subtotal,
  }
}

function armarPedido(
  id: number,
  datos: {
    mesa: number
    idioma: Idioma
    estado: EstadoPedido
    creadoEn: string
    items: Array<{ productoId: number; cantidad: number; adicionales: number[]; sinIngredientes: number[]; nota?: string }>
  },
): Pedido {
  const items = datos.items.map((item) =>
    armarItem(item.productoId, item.cantidad, item.adicionales, item.sinIngredientes, item.nota),
  )
  const total = desdeCentimos(items.reduce((suma, item) => suma + aCentimos(item.subtotal), 0))
  return {
    id,
    mesa: datos.mesa,
    idioma: datos.idioma,
    estado: datos.estado,
    total,
    items,
    creadoEn: datos.creadoEn,
  }
}

function leerDb(): BaseDatos {
  const crudo = leerClave(CLAVE_DB)
  if (!crudo) {
    const inicial = semilla()
    guardarDb(inicial)
    return inicial
  }
  try {
    const datos = JSON.parse(crudo) as BaseDatos
    if (!datos || !Array.isArray(datos.pedidos) || !Array.isArray(datos.mesas)) throw new Error('forma')
    return datos
  } catch {
    const inicial = semilla()
    guardarDb(inicial)
    return inicial
  }
}

function guardarDb(db: BaseDatos): void {
  escribirClave(CLAVE_DB, JSON.stringify(db))
}

function publicarLocal(evento: string, datos: unknown): void {
  locales.get(evento)?.forEach((handler) => handler(datos))
}

function obtenerCanal(): BroadcastChannel | null {
  if (canal) return canal
  if (typeof BroadcastChannel === 'undefined') return null
  canal = new BroadcastChannel(CANAL)
  canal.onmessage = (evento: MessageEvent<{ evento?: string; datos?: unknown }>) => {
    if (evento.data?.evento === 'mock:reinicio') {
      window.location.reload()
      return
    }
    if (!evento.data?.evento) return
    publicarLocal(evento.data.evento, evento.data.datos)
  }
  return canal
}

function emitir(evento: string, datos: unknown): void {
  publicarLocal(evento, datos)
  obtenerCanal()?.postMessage({ evento, datos })
}

export function alRecibirMock(evento: string, handler: Handler): () => void {
  obtenerCanal()
  const conjunto = locales.get(evento) ?? new Set()
  conjunto.add(handler)
  locales.set(evento, conjunto)
  return () => conjunto.delete(handler)
}

function esperar(ms = 220): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

function simularMesa(): void {
  const ahora = Date.now()
  const ultimo = Number(leerClave(CLAVE_SIM) ?? 0)
  if (ahora - ultimo < 15000) return
  escribirClave(CLAVE_SIM, String(ahora))
  const db = leerDb()
  const mesa = db.mesas.find((item) => item.numero === 8)
  if (!mesa) return
  mesa.online = !mesa.online
  mesa.ultimaConexion = new Date().toISOString()
  guardarDb(db)
  const aviso: ConexionMesa = { numero: mesa.numero, online: mesa.online }
  emitir('mesa:conexion', aviso)
}

/** Arranca la sincronización entre pestañas y el parpadeo de la mesa 8. */
export function prepararMock(): void {
  if (preparado || typeof window === 'undefined') return
  preparado = true
  leerDb()
  escribirClave(CLAVE_SIM, String(Date.now()))
  obtenerCanal()
  window.setInterval(simularMesa, 18000)
}

export function reiniciarMock(): void {
  borrarClave(CLAVE_DB)
  guardarDb(semilla())
  obtenerCanal()?.postMessage({ evento: 'mock:reinicio' })
  window.location.reload()
}

export async function menuMock(): Promise<MenuRespuesta> {
  await esperar()
  return localizarMenu()
}

export async function mesasMock(): Promise<Mesa[]> {
  await esperar(120)
  return leerDb().mesas.map((mesa) => ({ ...mesa }))
}

export async function mesaMock(numero: number): Promise<Mesa> {
  await esperar(120)
  const mesa = leerDb().mesas.find((item) => item.numero === numero)
  if (!mesa) throw new ErrorApi(404, 'Mesa no encontrada')
  return { ...mesa }
}

export async function crearPedidoMock(cuerpo: CrearPedido): Promise<Pedido> {
  await esperar(320)
  if (!Array.isArray(cuerpo.items) || cuerpo.items.length === 0) {
    throw new ErrorApi(400, 'El pedido no tiene productos')
  }
  const db = leerDb()
  if (!db.mesas.some((mesa) => mesa.numero === cuerpo.mesa)) {
    throw new ErrorApi(404, 'Mesa no encontrada')
  }
  const items = cuerpo.items.map((item) => {
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 20) {
      throw new ErrorApi(400, 'Cantidad inválida')
    }
    const producto = buscarProductoFuente(item.productoId)
    if (!producto || !producto.disponible) throw new ErrorApi(400, 'Producto no disponible')
    const nota = item.nota?.trim()
    if (nota && nota.length > 140) throw new ErrorApi(400, 'Nota demasiado larga')
    return armarItem(item.productoId, item.cantidad, item.adicionales ?? [], item.sinIngredientes ?? [], nota || undefined)
  })
  const pedido: Pedido = {
    id: db.seq,
    mesa: cuerpo.mesa,
    idioma: 'es',
    estado: 'RECIBIDO',
    total: desdeCentimos(items.reduce((suma, item) => suma + aCentimos(item.subtotal), 0)),
    items,
    creadoEn: new Date().toISOString(),
  }
  db.seq += 1
  db.pedidos.push(pedido)
  guardarDb(db)
  emitir('pedido:nuevo', pedido)
  return pedido
}

export async function pedidoMock(id: number): Promise<Pedido> {
  await esperar(120)
  const pedido = leerDb().pedidos.find((item) => item.id === id)
  if (!pedido) throw new ErrorApi(404, 'Pedido no encontrado')
  return pedido
}

export async function pedidosMock(params: { estado?: EstadoPedido | ''; fecha?: string }): Promise<Pedido[]> {
  await esperar(160)
  return leerDb()
    .pedidos.filter((pedido) => {
      if (params.estado && pedido.estado !== params.estado) return false
      if (params.fecha && diaLocal(pedido.creadoEn) !== params.fecha) return false
      return true
    })
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
}

export async function cambiarEstadoMock(id: number, estado: EstadoPedido): Promise<Pedido> {
  await esperar(180)
  const db = leerDb()
  const pedido = db.pedidos.find((item) => item.id === id)
  if (!pedido) throw new ErrorApi(404, 'Pedido no encontrado')
  pedido.estado = estado
  guardarDb(db)
  const aviso = { id: pedido.id, mesa: pedido.mesa, estado: pedido.estado }
  emitir('pedido:actualizado', aviso)
  return pedido
}

export async function reporteHoyMock(): Promise<ReporteHoy> {
  await esperar(180)
  const hoy = fechaHoyLocal()
  const pedidos = leerDb()
    .pedidos.filter((pedido) => diaLocal(pedido.creadoEn) === hoy)
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
  const totalVendido = desdeCentimos(pedidos.reduce((suma, pedido) => suma + aCentimos(pedido.total), 0))
  const mapa = new Map<number, { productoId: number; nombre: string; cantidad: number; centimos: number }>()
  for (const pedido of pedidos) {
    for (const item of pedido.items) {
      const previo = mapa.get(item.productoId) ?? {
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: 0,
        centimos: 0,
      }
      previo.cantidad += item.cantidad
      previo.centimos += aCentimos(item.subtotal)
      mapa.set(item.productoId, previo)
    }
  }
  const topProductos = [...mapa.values()]
    .map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      cantidad: item.cantidad,
      total: desdeCentimos(item.centimos),
    }))
    .sort((a, b) => b.cantidad - a.cantidad || b.total - a.total)
    .slice(0, 5)
  return { pedidos: pedidos.length, totalVendido, topProductos }
}
