import { useState } from 'react'
import { EsfihasSection } from './components/EsfihasSection'
import { Header } from './components/Header'
import { PasteisSection } from './components/PasteisSection'
import { PizzasSection } from './components/PizzasSection'
import { PorcoesSection } from './components/PorcoesSection'
import { Tabs } from './components/Tabs'

const ICON_BASE = `${import.meta.env.BASE_URL}icons/`

const MAIN_TABS = [
  { id: 'pasteis', label: 'Pastéis', icon: `${ICON_BASE}pastel.png` },
  { id: 'pizzas', label: 'Pizzas', icon: `${ICON_BASE}pizza.png` },
  { id: 'esfihas', label: 'Esfihas', icon: `${ICON_BASE}esfiha.png` },
  { id: 'porcoes', label: 'Porções', icon: `${ICON_BASE}porcao.png` },
]

function App() {
  const [tab, setTab] = useState('pasteis')
  const [lang, setLang] = useState<'pt' | 'en'>('pt')

  return (
    <>
      <div
        className="fixed inset-0 z-0 h-full w-full bg-black bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-biza.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black/95 via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col gap-4 pb-8">
        <Header lang={lang} setLang={setLang} />

        <div className="flex flex-1 flex-col gap-4 px-4">
          <Tabs options={MAIN_TABS} active={tab} onChange={setTab} variant="primary" />

          <main className="flex-1">
            {tab === 'pasteis' && <PasteisSection />}
            {tab === 'pizzas' && <PizzasSection />}
            {tab === 'esfihas' && <EsfihasSection />}
            {tab === 'porcoes' && <PorcoesSection />}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
