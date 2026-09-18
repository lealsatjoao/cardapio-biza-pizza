import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'
import { formatCurrency, parsePriceLabel } from '../utils/price'
import { buildOrderMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import { ConfirmDialog } from './ConfirmDialog'

export function CartDrawer({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const { items, removeItem, changeQty, clear, totalKnown, hasUnknownPriceItems } = useCart()
  const t = translations[lang].cart
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  if (!open) return null

  const handleSend = () => {
    const message = buildOrderMessage(items, lang)
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }

  const itemToRemove = items.find((it) => it.id === confirmRemoveId)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative flex h-full w-full max-w-sm flex-col bg-neutral-950/95 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-bold text-white">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="mt-10 text-center text-white/60">
              <p className="text-sm font-semibold">{t.empty}</p>
              <p className="mt-1 text-xs">{t.emptyHint}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const unit = parsePriceLabel(item.priceLabel)
                return (
                  <div key={item.id} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        {item.note && <p className="text-xs text-white/60">{item.note}</p>}
                        {item.observation && (
                          <p className="mt-0.5 text-xs italic text-amber-300/80">"{item.observation}"</p>
                        )}
                        <p className="mt-0.5 text-xs text-orange-300">
                          {unit !== undefined ? formatCurrency(unit) : item.priceLabel ?? t.priceOnRequest}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveId(item.id)}
                        aria-label={t.remove}
                        className="text-xs font-semibold text-white/50 hover:text-red-400"
                      >
                        {t.remove}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-bold text-white hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-white">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-bold text-white hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">{t.total}</span>
              <span className="text-base font-bold text-orange-300">{formatCurrency(totalKnown)}</span>
            </div>
            {hasUnknownPriceItems && <p className="mb-2 text-[11px] text-white/50">{t.taxNotice}</p>}
            <button
              type="button"
              onClick={handleSend}
              className="mb-2 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-green-500"
            >
              {t.sendWhatsapp}
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-full rounded-xl bg-white/5 py-2 text-xs font-semibold text-white/60 hover:bg-white/10"
            >
              {t.clear}
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!itemToRemove}
        title={t.confirmRemoveTitle}
        message={itemToRemove ? `${itemToRemove.name} — ${t.confirmRemoveMsg}` : t.confirmRemoveMsg}
        confirmLabel={t.yesRemove}
        cancelLabel={t.cancel}
        onCancel={() => setConfirmRemoveId(null)}
        onConfirm={() => {
          if (confirmRemoveId) removeItem(confirmRemoveId)
          setConfirmRemoveId(null)
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        title={t.confirmClearTitle}
        message={t.confirmClearMsg}
        confirmLabel={t.yesClear}
        cancelLabel={t.cancel}
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clear()
          setConfirmClear(false)
        }}
      />
    </div>
  )
}
