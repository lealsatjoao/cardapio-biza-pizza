import { useState } from 'react'
import { massas, porcoes, type PorcaoItem } from '../data/menu'
import { SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

const SUBTABS = [
  { id: 'porcoes', label: 'Porções' },
  { id: 'massas', label: 'Massas' },
]

function PorcaoCard({ item }: { item: PorcaoItem }) {
  return (
    <SectionCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{item.nome}</p>
          {item.nomeEn && <p className="text-xs italic text-white/50">{item.nomeEn}</p>}
        </div>
        <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
          {item.preco}
        </span>
      </div>
      {item.descricao && <p className="mt-2 text-xs leading-relaxed text-white/70">{item.descricao}</p>}
      {item.descricaoEn && <p className="mt-1 text-xs italic leading-relaxed text-white/50">{item.descricaoEn}</p>}
    </SectionCard>
  )
}

export function PorcoesSection() {
  const [sub, setSub] = useState('porcoes')

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      <div className="flex flex-col gap-3">
        {(sub === 'porcoes' ? porcoes : massas).map((item) => (
          <PorcaoCard key={item.nome} item={item} />
        ))}
      </div>
    </div>
  )
}
