import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api/cliente'
import { ordenarRecientes } from '../lib/pedidosMesa'
import { leerPropios } from '../lib/pedidosPropios'
import type { Pedido } from '../tipos'
import { useEvento } from './useEvento'

/**
 * Pedidos que hizo ESTE celular en la mesa, con el número que ve el cliente (1, 2, 3…).
 * Se recargan solos cuando la cocina cambia un estado o entra un pedido de la mesa.
 */
export function usePedidosMesa(numero: number) {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null)
  const [numeros, setNumeros] = useState<Record<number, number>>({})
  const [error, setError] = useState(false)
  const vivo = useRef(true)

  const cargar = useCallback(() => {
    api
      .pedidosMesa(numero)
      .then((datos) => {
        if (!vivo.current) return
        const propios = leerPropios().filter((propio) => propio.mesa === numero)
        const ids = new Set(propios.map((propio) => propio.id))
        setNumeros(Object.fromEntries(propios.map((propio) => [propio.id, propio.numero])))
        setPedidos(ordenarRecientes(datos.filter((pedido) => ids.has(pedido.id))))
        setError(false)
      })
      .catch(() => {
        if (vivo.current) setError(true)
      })
  }, [numero])

  useEffect(() => {
    vivo.current = true
    cargar()
    return () => {
      vivo.current = false
    }
  }, [cargar])

  useEvento('pedido:nuevo', (dato) => {
    if (dato.mesa === numero) cargar()
  })
  useEvento('pedido:actualizado', (dato) => {
    if (dato.mesa === numero) cargar()
  })

  return { pedidos, numeros, error, recargar: cargar }
}
