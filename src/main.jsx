import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TotemApp from './TotemApp.jsx'
import { CadastroPage, PontosPage, CatalogoPage } from './pages.jsx'

// cinco páginas, sem router
const ROTAS = {
  '/totem': TotemApp,
  '/cadastro': CadastroPage,
  '/pontos': PontosPage,
  '/catalogo': CatalogoPage,
}
const Page = ROTAS[window.location.pathname.replace(/\/+$/, '')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
