import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './frontend/App'
import { ThemeProvider } from './frontend/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
