/** Dirección del backend. El celular debe usar la IP del portátil, nunca localhost. */
export const URL_API = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export const usarMock = import.meta.env.VITE_USE_MOCK === 'true'
