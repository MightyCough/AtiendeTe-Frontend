import type { Idioma } from '../../tipos'

export function Bienvenida({ numero, onElegir }: { numero: number; onElegir: (idioma: Idioma) => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-5 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-oro">Universidad de Huánuco</p>
      <div className="entrada">
        <h1 className="font-serif text-5xl leading-[1.05]">Bienvenido a tu mesa</h1>
        <p className="mt-2 text-lg text-suave">Welcome to your table</p>
        <p className="mt-6 inline-flex rounded-full bg-oliva px-4 py-2 text-sm font-semibold text-papel">
          Mesa {numero}
        </p>
        <p className="mt-10 text-sm font-semibold">Elige tu idioma</p>
        <p className="text-sm text-suave">Choose your language</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onElegir('es')}
            className="rounded-3xl bg-papel px-4 py-6 text-left shadow-sm ring-1 ring-linea transition active:scale-[0.98]"
          >
            <span className="text-4xl" aria-hidden>
              🇵🇪
            </span>
            <span className="mt-3 block font-serif text-2xl">Español</span>
          </button>
          <button
            type="button"
            onClick={() => onElegir('en')}
            className="rounded-3xl bg-papel px-4 py-6 text-left shadow-sm ring-1 ring-linea transition active:scale-[0.98]"
          >
            <span className="text-4xl" aria-hidden>
              🇬🇧
            </span>
            <span className="mt-3 block font-serif text-2xl">English</span>
          </button>
        </div>
      </div>
      <p className="text-sm text-suave">AtiendeTe</p>
    </main>
  )
}
