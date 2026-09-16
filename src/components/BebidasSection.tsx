import { useState } from 'react'
import { refrigerantes, sucos, type Bebida } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

function BebidaRow({ item, lang }: { item: Bebida; lang: Lang }) {
  const nome = lang === 'en' && item.nomeEn ? item.nomeEn : item.nome
  return (
    <div className="flex items-center border-b border-white/10 py-2 last:border-0">
      <p className="text-sm font-semibold text-white">{nome}</p>
    </div>
  )
}

export function BebidasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('refrigerantes')

  const SUBTABS = [
    { id: 'refrigerantes', label: t.subtabs.refrigerantes },
    { id: 'sucos', label: t.subtabs.sucos },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'refrigerantes' && (
        <>
          <SectionCard>
            <div>
              {refrigerantes.map((item) => (
                <BebidaRow key={item.nome} item={item} lang={lang} />
              ))}
            </div>
          </SectionCard>
          <Notice>{t.notices.sodaSizes}</Notice>
        </>
      )}

      {sub === 'sucos' && (
        <>
          <Notice>{t.notices.naturalJuice}</Notice>
          <SectionCard>
            <div>
              {sucos.map((item) => (
                <BebidaRow key={item.nome} item={item} lang={lang} />
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
