export function formatearHora(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha)
}

/** Texto corto para la cocina: "hace 4 min". Siempre en español. */
export function haceCuanto(iso: string, ahora = Date.now()): string {
  const fecha = new Date(iso).getTime()
  if (Number.isNaN(fecha)) return ''
  const minutos = Math.floor((ahora - fecha) / 60000)
  if (minutos < 1) return 'ahora'
  if (minutos === 1) return 'hace 1 min'
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas === 1) return 'hace 1 h'
  return `hace ${horas} h`
}

/** YYYY-MM-DD en America/Lima. El filtro `fecha` y el reporte de hoy del backend usan ese huso, no UTC ni el reloj del navegador. */
export function diaLocal(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(fecha)
  const tomar = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? ''
  return `${tomar('year')}-${tomar('month')}-${tomar('day')}`
}

export function fechaHoyLocal(): string {
  return diaLocal(new Date().toISOString())
}
