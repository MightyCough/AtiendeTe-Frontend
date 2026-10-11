import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Marca } from '../componentes/Marca'

function baseValida(valor: string): boolean {
  return /^https?:\/\/.+/i.test(valor.trim())
}

export function QrPagina() {
  const { t } = useTranslation()
  const [base, setBase] = useState(() => window.location.origin)
  const [cantidad, setCantidad] = useState(8)
  const limpia = base.trim().replace(/\/$/, '')
  const valida = baseValida(limpia)
  const mesas = useMemo(() => Array.from({ length: cantidad }, (_, indice) => indice + 1), [cantidad])

  return (
    <div className="min-h-dvh">
      <header className="no-imprimir border-b border-linea/40 bg-[#243228]/92">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-serif text-4xl">{t('qr.titulo')}</h1>
            <p className="mt-1 max-w-xl text-sm text-suave">{t('qr.ayuda')}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="rounded-full bg-crema px-4 py-2 text-sm font-semibold">
              {t('qr.volver')}
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!valida}
              className="rounded-full bg-oliva px-4 py-2 text-sm font-semibold text-papel disabled:opacity-50"
            >
              {t('qr.imprimir')}
            </button>
          </div>
        </div>
        <form className="mx-auto grid max-w-5xl gap-4 px-4 pb-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{t('qr.base')}</span>
            <input
              value={base}
              onChange={(evento) => setBase(evento.target.value)}
              className="mt-1 w-full rounded-2xl border border-linea bg-pizarra px-3 py-3 text-base"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
            />
            <span className="mt-1 block text-xs text-suave">{t('qr.baseAyuda')}</span>
            {!valida && <span className="mt-1 block text-sm text-arcilla">{t('qr.invalida')}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t('qr.cantidad')}</span>
            <input
              type="number"
              min={1}
              max={24}
              value={cantidad}
              onChange={(evento) => {
                const valor = Number(evento.target.value)
                if (!Number.isInteger(valor)) return
                setCantidad(Math.min(24, Math.max(1, valor)))
              }}
              className="mt-1 w-32 rounded-2xl border border-linea bg-pizarra px-3 py-3 text-base"
            />
          </label>
        </form>
      </header>

      {valida && (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 print:grid-cols-2">
          {mesas.map((numero) => {
            const url = `${limpia}/menu?mesa=${numero}`
            return (
              <article key={numero} className="tarjeta-qr flex flex-col items-center rounded-3xl border border-dashed border-linea bg-pizarra px-4 py-6 text-center">
                <Marca />
                <h2 className="mt-3 font-serif text-4xl">{t('qr.mesa', { numero })}</h2>
                <div className="mt-4 rounded-2xl bg-pizarra p-2">
                  <QRCodeSVG
                    value={url}
                    size={176}
                    marginSize={2}
                    level="M"
                    bgColor="#fffaf3"
                    fgColor="#241c16"
                    title={url}
                  />
                </div>
                <p className="mt-4 font-semibold">{t('qr.escanear')}</p>
                <p className="mt-2 break-all text-xs text-suave">{url}</p>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
