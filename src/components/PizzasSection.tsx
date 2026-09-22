import { useState } from 'react'
import { pizzasDoces, pizzasSalgadasEspeciais, pizzasSalgadasTradicionais, type MenuItem } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { PizzaFlavorRow } from './PizzaFlavorRow'
import { PizzaOrderWizard } from './PizzaOrderWizard'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

export function PizzasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('salgadas')
  const [wizardFlavor, setWizardFlavor] = useState<MenuItem | null>(null)

  const SUBTABS = [
    { id: 'salgadas', label: t.subtabs.salgados },
    { id: 'doces', label: t.subtabs.doces },
  ]

  const salgadas = [...pizzasSalgadasTradicionais, ...pizzasSalgadasEspeciais]
  const candidates = sub === 'doces' ? pizzasDoces : salgadas

  return (
    <div className="flex flex-col gap-4">
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
                <PizzaFlavorRow key={item.numero} item={item} lang={lang} onClick={() => setWizardFlavor(item)} />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle>
              {t.flavors} {t.subtabs.especiais}
            </GroupTitle>
            <div>
              {pizzasSalgadasEspeciais.map((item) => (
                <PizzaFlavorRow key={item.numero} item={item} lang={lang} onClick={() => setWizardFlavor(item)} />
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
              <PizzaFlavorRow key={item.numero} item={item} lang={lang} onClick={() => setWizardFlavor(item)} />
            ))}
          </div>
        </SectionCard>
      )}

      {wizardFlavor && (
        <PizzaOrderWizard
          firstFlavor={wizardFlavor}
          candidates={candidates}
          lang={lang}
          onClose={() => setWizardFlavor(null)}
        />
      )}
    </div>
  )
}
