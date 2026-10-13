import { Component, type ReactNode } from 'react'
import i18n from '../i18n'

interface Estado {
  fallo: boolean
  clave: number
}

function esRechazoDeRed(razon: unknown): boolean {
  if (!razon || typeof razon !== 'object' || !('name' in razon)) return false
  const nombre = String((razon as { name: unknown }).name)
  return nombre === 'FetchError' || nombre === 'ErrorApi'
}

function PantallaFallo({ onReintentar }: { onReintentar: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5">
      <p className="text-lg">{i18n.t('comun.errorPantalla')}</p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-4 w-fit rounded-full bg-oliva px-5 py-3 font-semibold text-papel"
      >
        {i18n.t('comun.reintentar')}
      </button>
    </main>
  )
}

/** Atrapa un fallo de render o una petición que nadie capturó y muestra un mensaje en vez de la pantalla en blanco. */
export class ErrorBoundary extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { fallo: false, clave: 0 }

  static getDerivedStateFromError(): Partial<Estado> {
    return { fallo: true }
  }

  componentDidMount(): void {
    window.addEventListener('unhandledrejection', this.alRechazar)
  }

  componentWillUnmount(): void {
    window.removeEventListener('unhandledrejection', this.alRechazar)
  }

  alRechazar = (evento: PromiseRejectionEvent): void => {
    if (!esRechazoDeRed(evento.reason)) return
    evento.preventDefault()
    this.setState({ fallo: true })
  }

  reintentar = (): void => {
    this.setState((estado) => ({ fallo: false, clave: estado.clave + 1 }))
  }

  render(): ReactNode {
    if (this.state.fallo) return <PantallaFallo onReintentar={this.reintentar} />
    return <div key={this.state.clave}>{this.props.children}</div>
  }
}
