import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'

// cinco páginas, sem router. Tudo entra por import dinâmico: quem abre a
// landing não baixa o three.js do mapa do totem.
const loaders = {
  '/totem': () => import('./TotemApp.jsx'),
  '/cadastro': () => import('./pages.jsx').then((m) => ({ default: m.CadastroPage })),
  '/pontos': () => import('./pages.jsx').then((m) => ({ default: m.PontosPage })),
  '/catalogo': () => import('./CatalogoPage.jsx').then((m) => ({ default: m.CatalogoPage })),
}

const Page = lazy(loaders[path] ?? (() => import('./App.jsx')))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
      <Page />
    </Suspense>
  </StrictMode>,
)
