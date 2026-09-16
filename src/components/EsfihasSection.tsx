import { useState } from 'react'
import {
  combosEsfihas,
  esfihasAvisoVendaMinima,
  esfihasDoces,
  esfihasDocesPreco,
  esfihasSalgadas,
  esfihasSalgadasPrecoBase,
} from '../data/menu'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

const SUBTABS = [
  { id: 'combos', label: 'Combos' },
  { id: 'salgadas', label: 'Esfihas Salgadas' },
  { id: 'doces', label: 'Esfihas Doces' },
]

export function EsfihasSection() {
  const [sub, setSub] = useState('combos')

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'combos' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {combosEsfihas.map((combo) => (
            <SectionCard key={combo.nome}>
              <div className="mb-2 flex items-start justify-between gap-2 border-b border-white/15 pb-2">
                <div>
                  <p className="text-sm font-bold text-orange-400">{combo.nome}</p>
                  <p className="text-[11px] text-white/60">{combo.subtitulo}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                  {combo.preco}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-white/80">
                {combo.composicao.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      )}

      {sub === 'salgadas' && (
        <SectionCard>
          <GroupTitle price={`${esfihasSalgadasPrecoBase} (01–11)`}>Salgadas</GroupTitle>
          <div>
            {esfihasSalgadas.map((item) => (
              <MenuItemRow key={item.numero} item={item} />
            ))}
          </div>
        </SectionCard>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle price={esfihasDocesPreco}>Doces</GroupTitle>
          <div>
            {esfihasDoces.map((item) => (
              <MenuItemRow key={item.numero} item={item} />
            ))}
          </div>
        </SectionCard>
      )}

      <Notice>{esfihasAvisoVendaMinima}</Notice>
    </div>
  )
}
