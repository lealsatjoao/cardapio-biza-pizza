import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/price'
import { translations, type Lang } from '../utils/translations'

export function FloatingCartButton({ lang, onClick }: { lang: Lang; onClick: () => void }) {
  const { totalCount, totalKnown, bumpTick } = useCart()
  const t = translations[lang].cart
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (bumpTick === 0) return
    setBump(true)
    const timer = setTimeout(() => setBump(false), 320)
    return () => clearTimeout(timer)
  }, [bumpTick])

  if (totalCount === 0) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.cartFabLabel}
      style={{ bottom: 'max(1.1rem, env(safe-area-inset-bottom))' }}
      className={[
        'fixed right-4 z-40 flex items-center gap-2 rounded-full bg-orange-500 pl-3.5 pr-4 py-3 text-white shadow-2xl shadow-black/50 ring-1 ring-white/20 backdrop-blur-md transition-transform hover:bg-orange-400 active:scale-95',
        bump ? 'animate-[fabBump_0.32s_ease-out]' : '',
      ].join(' ')}
    >
      <span className="relative text-xl leading-none">
        🛒
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-orange-600 shadow">
          {totalCount}
        </span>
      </span>
      <span className="text-sm font-bold">{formatCurrency(totalKnown)}</span>
    </button>
  )
}
