import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'

export function AddToCartModal({ lang }: { lang: Lang }) {
  const { promptItem, confirmAdd, cancelAdd } = useCart()
  const t = translations[lang].cart
  const [qty, setQty] = useState(1)
  const [observation, setObservation] = useState('')

  useEffect(() => {
    if (promptItem) {
      setQty(1)
      setObservation('')
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
          {promptItem.priceLabel && <p className="mt-1 text-sm font-bold text-orange-300">{promptItem.priceLabel}</p>}
        </div>

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
            onClick={() => confirmAdd(qty, observation)}
            className="flex-[2] rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-400"
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
