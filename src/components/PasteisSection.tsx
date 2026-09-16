import { useState } from 'react'
import {
  pasteisAviso,
  pasteisDoces,
  pasteisPrecos,
  pasteisSalgadosEspeciais,
  pasteisSalgadosTradicionais,
} from '../data/menu'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

const SUBTABS = [
  { id: 'salgados', label: 'Pastéis Salgados' },
  { id: 'doces', label: 'Pastéis Doces' },
]

export function PasteisSection() {
  const [sub, setSub] = useState('salgados')

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'salgados' && (
        <>
          <SectionCard>
            <GroupTitle price={pasteisPrecos.tradicionais}>Tradicionais</GroupTitle>
            <div>
              {pasteisSalgadosTradicionais.map((item) => (
                <MenuItemRow key={item.numero} item={item} />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle price={pasteisPrecos.especiais}>Especiais</GroupTitle>
            <div>
              {pasteisSalgadosEspeciais.map((item) => (
                <MenuItemRow key={item.numero} item={item} />
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle price={pasteisPrecos.doces}>Qualquer sabor</GroupTitle>
          <div>
            {pasteisDoces.map((item) => (
              <MenuItemRow key={item.numero} item={item} />
            ))}
          </div>
        </SectionCard>
      )}

      <Notice>{pasteisAviso}</Notice>
    </div>
  )
}
