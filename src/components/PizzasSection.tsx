import { useEffect, useState } from 'react'
import {
  itemName,
  localizePrice,
  pizzaSizeConfig,
  pizzaSizePrices,
  pizzasDoces,
  pizzasSalgadasEspeciais,
  pizzasSalgadasTradicionais,
  type MenuItem,
} from '../data/menu'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'
import { formatCurrency, parsePriceLabel } from '../utils/price'
import { PizzaFlavorRow } from './PizzaFlavorRow'
import { GroupTitle, Notice, SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

export function PizzasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const { requestAdd } = useCart()
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

  const [size, setSize] = useState<keyof typeof pizzaSizePrices>('grande')
  const [selected, setSelected] = useState<MenuItem[]>([])

  const selectedSize = sizes.find((s) => s.key === size)!
  const config = pizzaSizeConfig[size]
  const maxSabores = config.maxSabores

  // Sabores escolhidos não fazem sentido ao trocar tamanho (limite muda) ou aba (doce/salgada não se misturam).
  useEffect(() => {
    setSelected([])
  }, [size, sub])

  const toggleFlavor = (item: MenuItem) => {
    setSelected((prev) => {
      const exists = prev.some((f) => f.numero === item.numero)
      if (exists) return prev.filter((f) => f.numero !== item.numero)
      if (prev.length >= maxSabores) return prev
      return [...prev, item]
    })
  }

  const basePrice = parsePriceLabel(selectedSize.preco) ?? 0
  const extraPerFlavor = selected.length > 0 ? config.fatias / selected.length : 0
  const extraTotal = selected.reduce((sum, item) => {
    const perFatia = parsePriceLabel(item.precoOverride)
    return perFatia ? sum + perFatia * extraPerFlavor : sum
  }, 0)
  const totalPriceLabel = `${formatCurrency(basePrice + extraTotal)} +Tax`

  const handleAdd = () => {
    if (selected.length === 0) return
    const flavorNames = selected.map((item) => itemName(item, lang)).join(' + ')
    requestAdd({ name: flavorNames, note: selectedSize.label, priceLabel: totalPriceLabel })
    setSelected([])
  }

  const chooseUpToText = t.pizzaBuilder.chooseUpTo.replace('{max}', String(maxSabores))
  const selectedCountText = t.pizzaBuilder.selectedCount
    .replace('{count}', String(selected.length))
    .replace('{max}', String(maxSabores))

  function FlavorPicker() {
    return (
      <div className="sticky bottom-3 z-10 mt-1 flex items-center justify-between gap-3 rounded-xl bg-neutral-950/95 p-3 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <div>
          <p className="text-xs font-semibold text-white/60">{chooseUpToText}</p>
          <p className="text-sm font-bold text-white">
            {selectedCountText} {selected.length > 0 && `— ${localizePrice(totalPriceLabel, lang)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={selected.length === 0}
          className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-400 disabled:opacity-40"
        >
          {t.pizzaBuilder.addPizza}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <GroupTitle>{t.sizes.title}</GroupTitle>
        <div className="flex flex-col gap-2">
          {sizes.map((s) => {
            const isSelected = s.key === size
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSize(s.key as keyof typeof pizzaSizePrices)}
                className={[
                  'flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-all',
                  isSelected ? 'bg-orange-500/20 ring-2 ring-orange-400' : 'bg-white/5 hover:bg-white/10',
                ].join(' ')}
              >
                <p className="text-sm font-bold text-white">{s.label}</p>
                <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                  {localizePrice(s.preco, lang)}
                </span>
              </button>
            )
          })}
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
                <PizzaFlavorRow
                  key={item.numero}
                  item={item}
                  lang={lang}
                  selected={selected.some((f) => f.numero === item.numero)}
                  disabled={selected.length >= maxSabores && !selected.some((f) => f.numero === item.numero)}
                  onToggle={() => toggleFlavor(item)}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <GroupTitle>
              {t.flavors} {t.subtabs.especiais}
            </GroupTitle>
            <div>
              {pizzasSalgadasEspeciais.map((item) => (
                <PizzaFlavorRow
                  key={item.numero}
                  item={item}
                  lang={lang}
                  selected={selected.some((f) => f.numero === item.numero)}
                  disabled={selected.length >= maxSabores && !selected.some((f) => f.numero === item.numero)}
                  onToggle={() => toggleFlavor(item)}
                />
              ))}
            </div>
          </SectionCard>

          <Notice>{t.notices.pizzaToppings}</Notice>

          <FlavorPicker />
        </>
      )}

      {sub === 'doces' && (
        <>
          <SectionCard>
            <GroupTitle>
              {t.flavors} {t.subtabs.doces}
            </GroupTitle>
            <div>
              {pizzasDoces.map((item) => (
                <PizzaFlavorRow
                  key={item.numero}
                  item={item}
                  lang={lang}
                  selected={selected.some((f) => f.numero === item.numero)}
                  disabled={selected.length >= maxSabores && !selected.some((f) => f.numero === item.numero)}
                  onToggle={() => toggleFlavor(item)}
                />
              ))}
            </div>
          </SectionCard>

          <FlavorPicker />
        </>
      )}
    </div>
  )
}
