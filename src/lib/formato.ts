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

/** Día civil local (YYYY-MM-DD) de un instante ISO. La carta y los reportes usan este día, no el día UTC. */
export function diaLocal(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

export function fechaHoyLocal(): string {
  return diaLocal(new Date().toISOString())
}
