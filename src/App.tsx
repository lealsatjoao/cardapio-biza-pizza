import { useState } from 'react'
import { EsfihasSection } from './components/EsfihasSection'
import { EsfihaIcon, PastelIcon, PizzaIcon, PorcaoIcon } from './components/CategoryIcons'
import { PasteisSection } from './components/PasteisSection'
import { PizzasSection } from './components/PizzasSection'
import { PorcoesSection } from './components/PorcoesSection'
import { Tabs } from './components/Tabs'

const MAIN_TABS = [
  { id: 'pasteis', label: 'Pastéis', icon: <PastelIcon /> },
  { id: 'pizzas', label: 'Pizzas', icon: <PizzaIcon /> },
  { id: 'esfihas', label: 'Esfihas', icon: <EsfihaIcon /> },
  { id: 'porcoes', label: 'Porções', icon: <PorcaoIcon /> },
]

function App() {
  const [tab, setTab] = useState('pasteis')

  return (
    <>
      <div
        className="fixed inset-0 z-0 h-full w-full bg-black bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-biza.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 pb-8 pt-6">
        <header className="text-center">
          <h1 className="text-3xl font-black tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Biza Pizzas
          </h1>
          <p className="mt-1 text-sm font-medium text-white/80">Cardápio do Salão · Dine-in Menu</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-orange-300">Preços em Dólar Americano ($) + Tax</p>
        </header>

        <Tabs options={MAIN_TABS} active={tab} onChange={setTab} variant="primary" />

        <main className="flex-1">
          {tab === 'pasteis' && <PasteisSection />}
          {tab === 'pizzas' && <PizzasSection />}
          {tab === 'esfihas' && <EsfihasSection />}
          {tab === 'porcoes' && <PorcoesSection />}
        </main>
      </div>
    </>
  )
}

export default App
