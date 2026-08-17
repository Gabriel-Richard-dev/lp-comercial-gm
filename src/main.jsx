import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// quatro páginas, sem router. As outras três entram por import dinâmico: quem
// abre a landing não baixa o three.js do mapa do totem (uns 700 kB).
const ROTAS = {
  '/totem': lazy(() => import('./TotemApp.jsx')),
  '/cadastro': lazy(() => import('./pages.jsx').then((m) => ({ default: m.CadastroPage }))),
  '/pontos': lazy(() => import('./pages.jsx').then((m) => ({ default: m.PontosPage }))),
}
const Page = ROTAS[window.location.pathname.replace(/\/+$/, '')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>,
)
