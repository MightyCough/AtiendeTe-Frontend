/** Precios en soles, calculados en céntimos para no acumular error binario. */

export function aCentimos(soles: number): number {
  return Math.round(soles * 100)
}

export function desdeCentimos(centimos: number): number {
  return centimos / 100
}

/** (precio del plato + extras de una unidad) × cantidad. */
export function precioLinea(precioUnitario: number, preciosExtra: number[], cantidad: number): number {
  const extras = preciosExtra.reduce((suma, precio) => suma + aCentimos(precio), 0)
  return desdeCentimos((aCentimos(precioUnitario) + extras) * cantidad)
}

export function formatearSoles(valor: number): string {
  const negativo = valor < 0
  const centimos = aCentimos(Math.abs(valor))
  const soles = Math.floor(centimos / 100)
  const resto = String(centimos % 100).padStart(2, '0')
  return `${negativo ? '-' : ''}S/ ${soles}.${resto}`
}
