// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './utils/providers/AppProviders.tsx'
import { ErrorBoundary } from './utils/errros/errorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
  <AppProvider>
    <App />
  </AppProvider>,
  </ErrorBoundary>
)
