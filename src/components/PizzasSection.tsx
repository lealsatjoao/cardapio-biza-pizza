import { useState } from 'react'
import {
  localizePrice,
  pizzaSizePrices,
  pizzasDoces,
  pizzasSalgadasEspeciais,
  pizzasSalgadasTradicionais,
} from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

export function PizzasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('salgadas')

  const SUBTABS = [
    { id: 'salgadas', label: t.subtabs.salgados },
    { id: 'doces', label: t.subtabs.doces },
  ]

  const sizes = [
    { key: 'broto', label: t.sizes.broto, preco: pizzaSizePrices.broto },
    { key: 'grande', label: t.sizes.grande, preco: pizzaSizePrices.grande },
    { key: 'gigante', label: t.sizes.gigante, preco: pizzaSizePrices.gigante },
  ]

  return (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <GroupTitle>{t.sizes.title}</GroupTitle>
        <div className="flex flex-col gap-2">
          {sizes.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
              <p className="text-sm font-bold text-white">{s.label}</p>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(s.preco, lang)}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <Notice>{t.sizes.crustNotice}</Notice>

      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'salgadas' && (
        <>
          <SectionCard>
            <GroupTitle>
              {t.flavors} {t.subtabs.tradicionais}
            </GroupTitle>
            <div>
              {pizzasSalgadasTradicionais.map((item) => (
                <MenuItemRow key={item.numero} item={item} lang={lang} />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle>
              {t.flavors} {t.subtabs.especiais}
            </GroupTitle>
            <div>
              {pizzasSalgadasEspeciais.map((item) => (
                <MenuItemRow key={item.numero} item={item} lang={lang} />
              ))}
            </div>
          </SectionCard>

          <Notice>{t.notices.pizzaToppings}</Notice>
        </>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle>
            {t.flavors} {t.subtabs.doces}
          </GroupTitle>
          <div>
            {pizzasDoces.map((item) => (
              <MenuItemRow key={item.numero} item={item} lang={lang} />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
