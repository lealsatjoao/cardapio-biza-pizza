import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { CounterScreen } from './components/CounterScreen.tsx'

// Tela do balcão: .../#balcao — separada do cardápio do cliente, pede login da loja.
const isCounterScreen = window.location.hash === '#balcao'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCounterScreen ? (
      <CounterScreen />
    ) : (
      <CartProvider>
        <App />
      </CartProvider>
    )}
  </StrictMode>,
)
