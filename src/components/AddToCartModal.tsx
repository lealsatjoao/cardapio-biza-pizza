import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { pizzaAdicionais, type PizzaAdicional } from '../data/menu'
import { formatCurrency } from '../utils/price'
import { translations, type Lang } from '../utils/translations'

// Tira o valor de um rótulo tipo "$8,00 +Tax" (PT) ou "$8.00 +Tax" (EN) — trata os últimos 2
// dígitos como centavos não importa o separador usado, pra funcionar nos dois idiomas.
function unitPriceFromLabel(label?: string): number {
  if (!label) return 0
  const raw = label.match(/\$\s*([\d.,]+)/)?.[1]
  if (!raw || raw.length < 3) return 0
  const normalized = `${raw.slice(0, -3).replace(/[.,]/g, '')}.${raw.slice(-2)}`
  const value = Number(normalized)
  return Number.isFinite(value) ? value : 0
}

export function AddToCartModal({ lang }: { lang: Lang }) {
  const { promptItem, confirmAdd, cancelAdd } = useCart()
  const t = translations[lang].cart
  const tw = translations[lang].pizzaWizard
  const [qty, setQty] = useState(1)
  const [observation, setObservation] = useState('')
  // Só usado quando o item é um pastel — mesma lista e regra de $1 cada da pizza.
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<PizzaAdicional[]>([])

  useEffect(() => {
    if (promptItem) {
      setQty(1)
      setObservation('')
      setAdicionaisSelecionados([])
    }
  }, [promptItem])

  useEffect(() => {
    if (!promptItem) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelAdd()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [promptItem, cancelAdd])

  if (!promptItem) return null

  const isPastel = promptItem.category === 'pastel'
  const adicionaisTotal = isPastel ? adicionaisSelecionados.length : 0
  const finalPriceLabel =
    adicionaisTotal > 0 ? `${formatCurrency(unitPriceFromLabel(promptItem.priceLabel) + adicionaisTotal)} +Tax` : promptItem.priceLabel

  const toggleAdicional = (ad: PizzaAdicional) => {
    setAdicionaisSelecionados((prev) =>
      prev.some((a) => a.nome === ad.nome) ? prev.filter((a) => a.nome !== ad.nome) : [...prev, ad],
    )
  }

  const handleConfirm = () => {
    if (!isPastel || adicionaisSelecionados.length === 0) {
      confirmAdd(qty, observation)
      return
    }
    const adicionaisNote = adicionaisSelecionados
      .map((ad) => `${lang === 'pt' ? 'Adicional' : 'Extra'}: ${lang === 'pt' ? ad.nome : ad.nomeEn}`)
      .join('\n')
    confirmAdd(qty, observation, {
      note: [promptItem.note, adicionaisNote].filter(Boolean).join('\n'),
      priceLabel: finalPriceLabel,
      extraAddonsTotal: adicionaisTotal,
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.cancel}
        onClick={cancelAdd}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-t-2xl bg-neutral-950 p-4 shadow-2xl ring-1 ring-white/10 sm:rounded-2xl animate-[slideUp_0.2s_ease-out]">
        <div className="mb-3">
          <p className="text-base font-bold text-white">{promptItem.name}</p>
          {promptItem.note && <p className="mt-0.5 whitespace-pre-line text-xs text-white/60">{promptItem.note}</p>}
          {finalPriceLabel && <p className="mt-1 text-sm font-bold text-orange-300">{finalPriceLabel}</p>}
        </div>

        {isPastel && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{tw.adicionaisTitle}</p>
            <div className="grid grid-cols-2 gap-2">
              {pizzaAdicionais.map((ad) => {
                const isSelected = adicionaisSelecionados.some((a) => a.nome === ad.nome)
                return (
                  <button
                    key={ad.nome}
                    type="button"
                    onClick={() => toggleAdicional(ad)}
                    className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'en' ? ad.nomeEn : ad.nome}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">{t.quantity}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white hover:bg-white/20 active:scale-90"
            >
              −
            </button>
            <span className="w-8 text-center text-lg font-bold text-white">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white hover:bg-white/20 active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/50" htmlFor="cart-observation">
            {t.observation}
          </label>
          <textarea
            id="cart-observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder={t.observationPlaceholder}
            rows={2}
            maxLength={200}
            className="w-full resize-none rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancelAdd}
            className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-[2] rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-400"
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
