import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'

export function CartToast({ lang }: { lang: Lang }) {
  const { toastMessage } = useCart()
  const t = translations[lang].cart

  if (!toastMessage) return null

  return (
    <div
      key={toastMessage}
      className="fixed left-1/2 bottom-24 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-neutral-900/95 px-4 py-2.5 text-sm font-semibold text-white shadow-xl ring-1 ring-white/15 animate-[toastIn_0.2s_ease-out]"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">✓</span>
      <span className="max-w-[220px] truncate">{toastMessage}</span>
      <span className="text-white/60">{t.itemAdded}</span>
    </div>
  )
}
