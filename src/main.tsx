import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { prepararMock } from './api/mock'
import { App } from './App'
import { usarMock } from './config'
import './i18n'
import './index.css'

if (usarMock) prepararMock()

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No se encontró #root')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
