import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSesionIdioma } from './hooks/useSesionIdioma'
import { AdminPagina } from './paginas/Admin'
import { CocinaPagina } from './paginas/Cocina'
import { InicioPagina } from './paginas/Inicio'
import { MenuPagina } from './paginas/Menu'
import { NoEncontrada } from './paginas/NoEncontrada'
import { PedidoPagina } from './paginas/Pedido'
import { QrPagina } from './paginas/QrMesas'

export function App() {
  const listo = useSesionIdioma()
  if (!listo) return <div className="min-h-dvh" />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPagina />} />
        <Route path="/menu" element={<MenuPagina />} />
        <Route path="/pedido/:id" element={<PedidoPagina />} />
        <Route path="/cocina" element={<CocinaPagina />} />
        <Route path="/admin" element={<AdminPagina />} />
        <Route path="/admin/qr" element={<QrPagina />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  )
}
