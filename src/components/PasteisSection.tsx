import { useState } from 'react'
import { localizePrice, pasteisDoces, pasteisPrecos, pasteisSalgadosEspeciais, pasteisSalgadosTradicionais } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { MenuItemRow } from './MenuItemRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

export function PasteisSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('salgados')

  const SUBTABS = [
    { id: 'salgados', label: t.subtabs.salgados },
    { id: 'doces', label: t.subtabs.doces },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      <Notice>{t.notices.pastelFresh}</Notice>

      {sub === 'salgados' && (
        <>
          <SectionCard>
            <GroupTitle price={localizePrice(pasteisPrecos.tradicionais, lang)}>{t.subtabs.tradicionais}</GroupTitle>
            <div>
              {pasteisSalgadosTradicionais.map((item) => (
                <MenuItemRow
                  key={item.numero}
                  item={item}
                  lang={lang}
                  priceLabel={localizePrice(pasteisPrecos.tradicionais, lang)}
                  numberedAs="Pastel"
                  cartCategory="pastel"
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle price={localizePrice(pasteisPrecos.especiais, lang)}>{t.subtabs.especiais}</GroupTitle>
            <div>
              {pasteisSalgadosEspeciais.map((item) => (
                <MenuItemRow
                  key={item.numero}
                  item={item}
                  lang={lang}
                  priceLabel={localizePrice(pasteisPrecos.especiais, lang)}
                  numberedAs="Pastel"
                  cartCategory="pastel"
                />
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {sub === 'doces' && (
        <SectionCard>
          <GroupTitle price={localizePrice(pasteisPrecos.doces, lang)}>{t.anyFlavor}</GroupTitle>
          <div>
            {pasteisDoces.map((item) => (
              <MenuItemRow
                key={item.numero}
                item={item}
                lang={lang}
                priceLabel={localizePrice(pasteisPrecos.doces, lang)}
                numberedAs="Pastel"
                cartCategory="pastel"
              />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
