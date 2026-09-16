import { useState } from 'react'
import {
  pizzaBordaDestaque,
  pizzaSalgadaAcompanha,
  pizzasDoces,
  pizzasSalgadasEspeciais,
  pizzasSalgadasTradicionais,
  tamanhosPizza,
} from '../data/menu'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

const SUBTABS = [
  { id: 'salgadas', label: 'Pizzas Salgadas' },
  { id: 'doces', label: 'Pizzas Doces' },
]

export function PizzasSection() {
  const [sub, setSub] = useState('salgadas')

  return (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <GroupTitle>Tamanhos</GroupTitle>
        <div className="flex flex-col gap-2">
          {tamanhosPizza.map((t) => (
            <div key={t.nome} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
              <div>
                <p className="text-sm font-bold text-white">
                  {t.nome} · {t.fatias} fatias
                </p>
                <p className="text-xs text-white/60">{t.descricao}</p>
              </div>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {t.preco}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-semibold text-orange-200">{pizzaBordaDestaque}</p>
      </SectionCard>

      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'salgadas' && (
        <>
          <SectionCard>
            <GroupTitle>Sabores Tradicionais</GroupTitle>
            <div>
              {pizzasSalgadasTradicionais.map((item) => (
                <MenuItemRow key={item.numero} item={item} />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle>Sabores Especiais</GroupTitle>
            <div>
              {pizzasSalgadasEspeciais.map((item) => (
                <MenuItemRow key={item.numero} item={item} />
              ))}
            </div>
          </SectionCard>

          <Notice>{pizzaSalgadaAcompanha}</Notice>
        </>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle>Sabores Doces</GroupTitle>
          <div>
            {pizzasDoces.map((item) => (
              <MenuItemRow key={item.numero} item={item} />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
