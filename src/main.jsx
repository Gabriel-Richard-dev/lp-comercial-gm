import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// cinco páginas, sem router. As outras quatro entram por import dinâmico: quem
// abre a landing não baixa o three.js do mapa do totem (uns 600 kB).
const ROTAS = {
  '/totem': lazy(() => import('./TotemApp.jsx')),
  '/cadastro': lazy(() => import('./pages.jsx').then((m) => ({ default: m.CadastroPage }))),
  '/pontos': lazy(() => import('./pages.jsx').then((m) => ({ default: m.PontosPage }))),
  '/catalogo': lazy(() => import('./pages.jsx').then((m) => ({ default: m.CatalogoPage }))),
}
const Page = ROTAS[window.location.pathname.replace(/\/+$/, '')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>,
)
