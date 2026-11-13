/**
 * Pedidos que hizo ESTE celular. El cliente solo ve y numera los suyos ("Tu pedido 1", "Tu pedido 2");
 * el id real de la base de datos queda para la cocina y la administración.
 */

export interface PedidoPropio {
  id: number
  mesa: number
  /** Número que ve el cliente: 1 para su primer pedido en la mesa, 2 para el segundo… */
  numero: number
  /** Milisegundos desde 1970 en que este celular hizo el pedido. */
  creadoEn: number
}

/** Lo que dura una comida. Pasado ese tiempo el celular olvida el pedido y la numeración vuelve a 1. */
export const VIGENCIA_MS = 4 * 60 * 60 * 1000

const CLAVE = 'atiendete-pedidos-propios'

export function vigentes(lista: PedidoPropio[], ahora: number): PedidoPropio[] {
  return lista.filter((pedido) => ahora - pedido.creadoEn < VIGENCIA_MS)
}

/**
 * Suma un pedido nuevo. El número sigue al mayor vigente de esa mesa, así que si el primero caduca
 * el segundo no se vuelve "1". Si no queda ninguno vigente, empieza otra vez en 1.
 */
export function registrar(lista: PedidoPropio[], id: number, mesa: number, ahora: number): PedidoPropio[] {
  const vivos = vigentes(lista, ahora)
  if (vivos.some((pedido) => pedido.id === id)) return vivos
  const mayor = vivos.filter((pedido) => pedido.mesa === mesa).reduce((max, pedido) => Math.max(max, pedido.numero), 0)
  return [...vivos, { id, mesa, numero: mayor + 1, creadoEn: ahora }]
}

export function buscarPropio(lista: PedidoPropio[], id: number): PedidoPropio | undefined {
  return lista.find((pedido) => pedido.id === id)
}

function esPropio(valor: unknown): valor is PedidoPropio {
  if (typeof valor !== 'object' || valor === null) return false
  const candidato = valor as Record<string, unknown>
  return (
    Number.isInteger(candidato.id) &&
    Number.isInteger(candidato.mesa) &&
    Number.isInteger(candidato.numero) &&
    typeof candidato.creadoEn === 'number'
  )
}

// Si el navegador bloquea localStorage (modo privado), los pedidos viven en memoria mientras la pestaña siga abierta.
let respaldo: PedidoPropio[] = []

export function leerPropios(ahora: number = Date.now()): PedidoPropio[] {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return vigentes(respaldo, ahora)
    const datos: unknown = JSON.parse(crudo)
    return vigentes(Array.isArray(datos) ? datos.filter(esPropio) : [], ahora)
  } catch {
    return vigentes(respaldo, ahora)
  }
}

/** Se llama al confirmar un pedido, antes de pasar a su seguimiento. */
export function guardarPropio(id: number, mesa: number, ahora: number = Date.now()): PedidoPropio {
  const lista = registrar(leerPropios(ahora), id, mesa, ahora)
  respaldo = lista
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    // Sin almacenamiento: queda el respaldo en memoria.
  }
  return buscarPropio(lista, id) as PedidoPropio
}
