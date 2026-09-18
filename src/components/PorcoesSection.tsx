import { useState } from 'react'
import { localizePrice, massas, porcoes, type PorcaoItem } from '../data/menu'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'
import { AddButton } from './AddButton'
import { SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

function PorcaoCard({ item, lang }: { item: PorcaoItem; lang: Lang }) {
  const { requestAdd } = useCart()
  const t = translations[lang].cart
  const nome = lang === 'en' && item.nomeEn ? item.nomeEn : item.nome
  const descricao = lang === 'en' ? item.descricaoEn ?? item.descricao : item.descricao
  const precoLabel = localizePrice(item.preco, lang)
  return (
    <SectionCard>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-white">{nome}</p>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
            {precoLabel}
          </span>
          <AddButton label={t.add} onClick={() => requestAdd({ name: nome, priceLabel: precoLabel })} />
        </div>
      </div>
      {descricao && <p className="mt-2 text-xs leading-relaxed text-white/70">{descricao}</p>}
    </SectionCard>
  )
}

export function PorcoesSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('porcoes')

  const SUBTABS = [
    { id: 'porcoes', label: t.subtabs.porcoes },
    { id: 'massas', label: t.subtabs.massas },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      <div className="flex flex-col gap-3">
        {(sub === 'porcoes' ? porcoes : massas).map((item) => (
          <PorcaoCard key={item.nome} item={item} lang={lang} />
        ))}
      </div>
    </div>
  )
}
