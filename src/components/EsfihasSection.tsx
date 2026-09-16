import { useState } from 'react'
import {
  combosEsfihas,
  esfihasDoces,
  esfihasDocesPreco,
  esfihasSalgadas,
  esfihasSalgadasPrecoBase,
  localizePrice,
} from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

export function EsfihasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('combos')

  const SUBTABS = [
    { id: 'combos', label: t.subtabs.combos },
    { id: 'salgadas', label: `${t.tabs.esfihas} ${t.subtabs.salgados}` },
    { id: 'doces', label: `${t.tabs.esfihas} ${t.subtabs.doces}` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'combos' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {combosEsfihas.map((combo) => (
            <SectionCard key={combo.nome}>
              <div className="mb-2 flex items-start justify-between gap-2 border-b border-white/15 pb-2">
                <div>
                  <p className="text-sm font-bold text-orange-400">{lang === 'en' ? combo.nomeEn : combo.nome}</p>
                  <p className="text-[11px] text-white/60">{lang === 'en' ? combo.subtituloEn : combo.subtitulo}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                  {localizePrice(combo.preco, lang)}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-white/80">
                {(lang === 'en' ? combo.composicaoEn : combo.composicao).map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      )}

      {sub === 'salgadas' && (
        <SectionCard>
          <GroupTitle price={`${localizePrice(esfihasSalgadasPrecoBase, lang)} (01–11)`}>{t.subtabs.salgados}</GroupTitle>
          <div>
            {esfihasSalgadas.map((item) => (
              <MenuItemRow key={item.numero} item={item} lang={lang} />
            ))}
          </div>
        </SectionCard>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle price={localizePrice(esfihasDocesPreco, lang)}>{t.subtabs.doces}</GroupTitle>
          <div>
            {esfihasDoces.map((item) => (
              <MenuItemRow key={item.numero} item={item} lang={lang} />
            ))}
          </div>
        </SectionCard>
      )}

      <Notice>{t.notices.esfihaMin}</Notice>
    </div>
  )
}
