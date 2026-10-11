let audio: AudioContext | null = null

function contexto(): AudioContext | null {
  const Ctor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audio) audio = new Ctor()
  return audio
}

/** Hay que llamarlo desde un clic: el navegador bloquea el audio hasta un gesto. */
export async function activarSonido(): Promise<boolean> {
  const ctx = contexto()
  if (!ctx) return false
  if (ctx.state === 'suspended') await ctx.resume()
  return ctx.state === 'running'
}

/** Campana corta de dos notas cuando entra un pedido a cocina. */
export function reproducirCampana(): void {
  const ctx = contexto()
  if (!ctx || ctx.state !== 'running') return
  const ahora = ctx.currentTime
  const notas = [784, 1046]
  notas.forEach((frecuencia, indice) => {
    const inicio = ahora + indice * 0.14
    const osc = ctx.createOscillator()
    const ganancia = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(frecuencia, inicio)
    ganancia.gain.setValueAtTime(0.0001, inicio)
    ganancia.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02)
    ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.28)
    osc.connect(ganancia)
    ganancia.connect(ctx.destination)
    osc.start(inicio)
    osc.stop(inicio + 0.3)
  })
}
