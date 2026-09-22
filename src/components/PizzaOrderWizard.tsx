import { useState } from 'react'
import {
  itemDescription,
  itemName,
  localizePrice,
  pizzaSizeConfig,
  pizzaSizePrices,
  refrigerantes,
  type MenuItem,
} from '../data/menu'
import { useCart } from '../context/CartContext'
import { formatCurrency, parsePriceLabel } from '../utils/price'
import { translations, type Lang } from '../utils/translations'

type Step = 'size' | 'more' | 'flavors' | 'soda'
type SizeKey = keyof typeof pizzaSizePrices

export function PizzaOrderWizard({
  firstFlavor,
  candidates,
  lang,
  onClose,
}: {
  firstFlavor: MenuItem
  /** Outros sabores da mesma categoria (salgados ou doces) pra escolher em "mais sabores". */
  candidates: MenuItem[]
  lang: Lang
  onClose: () => void
}) {
  const { requestAdd } = useCart()
  const t = translations[lang]
  const tw = t.pizzaWizard

  const [step, setStep] = useState<Step>('size')
  const [size, setSize] = useState<SizeKey | null>(null)
  const [selected, setSelected] = useState<MenuItem[]>([firstFlavor])

  const sizes: { key: SizeKey; label: string; preco: string }[] = [
    { key: 'broto', label: t.sizes.broto, preco: pizzaSizePrices.broto },
    { key: 'grande', label: t.sizes.grande, preco: pizzaSizePrices.grande },
    { key: 'gigante', label: t.sizes.gigante, preco: pizzaSizePrices.gigante },
  ]

  const config = size ? pizzaSizeConfig[size] : null
  const maxSabores = config?.maxSabores ?? 1
  const sodaOptions = refrigerantes.find((r) => r.key === 'lata')!.sabores.map((s) => s.nome)

  const basePrice = size ? (parsePriceLabel(pizzaSizePrices[size]) ?? 0) : 0
  const extraPerFlavor = config ? config.fatias / selected.length : 0
  const extraTotal = selected.reduce((sum, item) => {
    const perFatia = parsePriceLabel(item.precoOverride)
    return perFatia ? sum + perFatia * extraPerFlavor : sum
  }, 0)
  const totalPriceLabel = `${formatCurrency(basePrice + extraTotal)} +Tax`

  const finish = (sodaFlavor: string | null) => {
    const sizeLabel = sizes.find((s) => s.key === size)!.label
    const flavorNames = selected.map((item) => itemName(item, lang)).join(' + ')
    const note = sodaFlavor ? `${sizeLabel} · ${lang === 'pt' ? 'Refrigerante' : 'Soda'}: ${sodaFlavor}` : sizeLabel
    requestAdd({ name: flavorNames, note, priceLabel: totalPriceLabel })
    onClose()
  }

  const pickSize = (key: SizeKey) => {
    setSize(key)
    setStep('more')
  }

  const answerMore = (wantsMore: boolean) => {
    if (!wantsMore) {
      if (size === 'gigante') setStep('soda')
      else finish(null)
      return
    }
    setStep('flavors')
  }

  const toggleFlavor = (item: MenuItem) => {
    setSelected((prev) => {
      const exists = prev.some((f) => f.numero === item.numero)
      if (exists) return prev.filter((f) => f.numero !== item.numero)
      if (prev.length >= maxSabores) return prev
      return [...prev, item]
    })
  }

  const confirmFlavors = () => {
    if (size === 'gigante') setStep('soda')
    else finish(null)
  }

  const stepTitle =
    step === 'size' ? tw.sizeTitle : step === 'more' ? tw.moreTitle : step === 'flavors' ? tw.flavorsTitle : tw.sodaTitle

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={tw.back}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-sm flex-col rounded-t-2xl bg-neutral-950 p-4 shadow-2xl ring-1 ring-white/10 sm:rounded-2xl animate-[slideUp_0.2s_ease-out]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{itemName(firstFlavor, lang)}</p>
            <p className="text-base font-bold text-white">{stepTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tw.back}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'size' && (
            <div className="flex flex-col gap-2">
              {sizes.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => pickSize(s.key)}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                >
                  <p className="text-sm font-bold text-white">{s.label}</p>
                  <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                    {localizePrice(s.preco, lang)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 'more' && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => answerMore(false)}
                className="rounded-xl bg-white/5 px-3 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                {tw.moreNo}
              </button>
              <button
                type="button"
                onClick={() => answerMore(true)}
                className="rounded-xl bg-orange-500/20 px-3 py-3 text-sm font-bold text-white ring-1 ring-orange-400/40 hover:bg-orange-500/30"
              >
                {tw.moreYes}
              </button>
            </div>
          )}

          {step === 'flavors' && (
            <div>
              <p className="mb-2 text-xs text-white/50">{tw.flavorsHelp.replace('{max}', String(maxSabores))}</p>
              {candidates
                .filter((item) => item.numero !== firstFlavor.numero)
                .map((item) => {
                  const isSelected = selected.some((f) => f.numero === item.numero)
                  const disabled = !isSelected && selected.length >= maxSabores
                  const descricao = itemDescription(item, lang)
                  return (
                    <button
                      key={item.numero}
                      type="button"
                      onClick={() => toggleFlavor(item)}
                      disabled={disabled}
                      className={`flex w-full items-start justify-between gap-2.5 border-b border-white/10 py-2 text-left last:border-0 ${
                        disabled ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{itemName(item, lang)}</p>
                        {descricao && <p className="mt-0.5 text-xs leading-snug text-white/60">{descricao}</p>}
                      </div>
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-white/10 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  )
                })}
            </div>
          )}

          {step === 'soda' && (
            <div>
              {sodaOptions.map((flavor) => (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => finish(flavor)}
                  className="flex w-full items-center justify-between gap-2.5 border-b border-white/10 py-2.5 text-left last:border-0 hover:bg-white/5"
                >
                  <span className="text-sm font-semibold text-white">{flavor}</span>
                  <span className="rounded-full bg-green-600/80 px-2 py-0.5 text-[11px] font-bold text-white">
                    {tw.included}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {step === 'flavors' && (
          <button
            type="button"
            onClick={confirmFlavors}
            disabled={selected.length < 2}
            className="mt-3 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-400 disabled:opacity-40"
          >
            {tw.continueLabel} — {localizePrice(totalPriceLabel, lang)}
          </button>
        )}
      </div>
    </div>
  )
}
