export type MesaParseada =
  | { ok: true; numero: number }
  | { ok: false; motivo: 'ausente' | 'invalida' }

/** El QR trae ?mesa=N. Acepta 1–999; rechaza vacío, decimales y texto. */
export function interpretarMesa(valor: string | null): MesaParseada {
  if (valor == null) return { ok: false, motivo: 'ausente' }
  const limpio = valor.trim()
  if (limpio === '') return { ok: false, motivo: 'ausente' }
  if (!/^\d+$/.test(limpio)) return { ok: false, motivo: 'invalida' }
  const numero = Number(limpio)
  if (!Number.isInteger(numero) || numero < 1 || numero > 999) {
    return { ok: false, motivo: 'invalida' }
  }
  return { ok: true, numero }
}
