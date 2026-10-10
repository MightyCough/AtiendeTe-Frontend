import i18n from '../i18n'
import type { Idioma } from '../tipos'

const CLAVE = 'atiendete-idioma'

export function idiomaActivo(codigo: string | undefined): Idioma {
  return codigo?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function leerIdioma(): Idioma | null {
  try {
    const valor = sessionStorage.getItem(CLAVE)
    return valor === 'es' || valor === 'en' ? valor : null
  } catch {
    return null
  }
}

export function guardarIdioma(idioma: Idioma): Promise<unknown> {
  try {
    sessionStorage.setItem(CLAVE, idioma)
  } catch {
    // Sesión privada sin almacenamiento: el idioma vive solo en memoria.
  }
  document.documentElement.lang = idioma
  return i18n.changeLanguage(idioma)
}
