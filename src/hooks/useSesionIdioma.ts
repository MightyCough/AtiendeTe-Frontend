import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { leerIdioma } from '../lib/idioma'

/** Aplica el idioma guardado en la sesión antes de pintar las rutas. */
export function useSesionIdioma(): boolean {
  const { i18n } = useTranslation()
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const guardado = leerIdioma()
    let vivo = true
    void i18n.changeLanguage(guardado ?? 'es').finally(() => {
      if (!vivo) return
      document.documentElement.lang = guardado ?? 'es'
      setListo(true)
    })
    return () => {
      vivo = false
    }
  }, [i18n])

  return listo
}
