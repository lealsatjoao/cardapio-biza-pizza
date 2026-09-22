import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { isEsfihaFlavorName } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { calculateTax, formatCurrency, parsePriceLabel } from '../utils/price'
import { buildOrderMessage, buildWhatsAppUrl, type OrderDelivery, type PaymentMethod } from '../utils/whatsapp'
import { nextControleNumber } from '../utils/orderCounter'
import { sortForReceipt } from '../utils/cartOrder'
import {
  calculateDeliveryFee,
  searchAddressSuggestions,
  staticMapUrl,
  type AddressSuggestion,
  type DeliveryQuote,
} from '../utils/delivery'
import { ConfirmDialog } from './ConfirmDialog'

type DeliveryErrorStatus = 'out_of_range' | 'error'

export function CartDrawer({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const { items, removeItem, changeQty, clear, totalKnown, hasUnknownPriceItems } = useCart()
  const t = translations[lang].cart
  const td = translations[lang].delivery
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [changeFor, setChangeFor] = useState('')
  const [sending, setSending] = useState(false)

  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [aptUnit, setAptUnit] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [searchUnavailable, setSearchUnavailable] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<AddressSuggestion | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [deliveryError, setDeliveryError] = useState<DeliveryErrorStatus | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addressStale = selectedSuggestion !== null && address.trim() !== selectedSuggestion.label

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!addressStale && selectedSuggestion) {
      setSuggestions([])
      return
    }
    if (address.trim().length < 4) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const query = zip.trim() ? `${address.trim()}, ${zip.trim()}` : address.trim()
      const result = await searchAddressSuggestions(query)
      setSearching(false)
      if (result.status === 'ok') {
        setSearchUnavailable(false)
        setSuggestions(result.suggestions)
      } else {
        setSearchUnavailable(true)
        setSuggestions([])
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, zip])

  if (!open) return null

  const deliveryFee = mode === 'delivery' && quote && !addressStale ? quote.fee : 0
  const taxAmount = calculateTax(totalKnown + deliveryFee)
  const grandTotal = totalKnown + deliveryFee + taxAmount
  const esfihaQty = items
    .filter((it) => it.category === 'esfiha' || isEsfihaFlavorName(it.name))
    .reduce((sum, it) => sum + it.qty, 0)
  const esfihaBelowMin = esfihaQty > 0 && esfihaQty < 5
  const canSend =
    customerName.trim().length > 0 &&
    customerPhone.trim().length > 0 &&
    paymentMethod !== null &&
    !sending &&
    !esfihaBelowMin &&
    (mode === 'pickup' || (quote !== null && !addressStale))

  const pickSuggestion = async (suggestion: AddressSuggestion) => {
    setAddress(suggestion.label)
    setSelectedSuggestion(suggestion)
    // Se a pessoa não digitou o ZIP code, preenche sozinho com o que veio no endereço escolhido.
    if (!zip.trim() && suggestion.postcode) setZip(suggestion.postcode)
    setSuggestions([])
    setQuote(null)
    setDeliveryError(null)
    setCalculating(true)
    const result = await calculateDeliveryFee(suggestion)
    setCalculating(false)
    if (result.status === 'ok') {
      setQuote(result.quote)
    } else {
      setDeliveryError(result.status === 'not_configured' ? 'error' : result.status)
    }
  }

  const handleSend = async () => {
    if (!paymentMethod || sending) return
    setSending(true)
    // Abre a aba em branco já na hora do clique (gesto do usuário) pra não cair no
    // bloqueador de pop-up do navegador — só navega pra URL do WhatsApp depois que o
    // número de Controle chegar (evita "window.open" tardio, que alguns navegadores bloqueiam).
    const whatsappWindow = window.open('', '_blank')
    const controle = await nextControleNumber()
    const delivery: OrderDelivery =
      mode === 'delivery' && quote && !addressStale
        ? { mode: 'delivery', quote, aptUnit: aptUnit.trim() || undefined }
        : { mode: 'pickup' }
    const message = buildOrderMessage(
      items,
      customerName.trim(),
      customerPhone.trim(),
      { method: paymentMethod, changeFor },
      delivery,
      controle,
    )
    const url = buildWhatsAppUrl(message)
    if (whatsappWindow) {
      whatsappWindow.location.href = url
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setSending(false)
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

        <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          {items.length === 0 ? (
            <div className="mt-10 text-center text-white/60">
              <p className="text-sm font-semibold">{t.empty}</p>
              <p className="mt-1 text-xs">{t.emptyHint}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortForReceipt(items).map((item) => {
                const unit = parsePriceLabel(item.priceLabel)
                return (
                  <div key={item.id} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        {item.note && <p className="whitespace-pre-line text-xs text-white/60">{item.note}</p>}
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
            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">{td.title}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('pickup')}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                    mode === 'pickup' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {td.pickup}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('delivery')
                    // Cartão só é aceito na retirada — sem maquininha pro entregador.
                    if (paymentMethod === 'card') setPaymentMethod(null)
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                    mode === 'delivery' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {td.delivery}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">{t.paymentTitle}</p>
              <div className="grid grid-cols-2 gap-2">
                {(mode === 'delivery'
                  ? (['cash', 'zelle', 'venmo'] as PaymentMethod[])
                  : (['cash', 'zelle', 'venmo', 'card'] as PaymentMethod[])
                ).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                      paymentMethod === method ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {method === 'cash'
                      ? t.paymentCash
                      : method === 'zelle'
                        ? t.paymentZelle
                        : method === 'venmo'
                          ? t.paymentVenmo
                          : t.paymentCard}
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="mt-2">
                  <label className="mb-1 block text-[11px] font-semibold text-white/50">{t.changeFor}</label>
                  <input
                    type="text"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    placeholder={t.changeForPlaceholder}
                    className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-white/50">
                {t.customerName}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.customerNamePlaceholder}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-white/50">
                {t.customerPhone}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.customerPhonePlaceholder}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {mode === 'delivery' && (
              <div className="mb-3 flex flex-col gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-white/50">{td.zipLabel}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value)
                      setQuote(null)
                      setDeliveryError(null)
                      if (selectedSuggestion) setSelectedSuggestion(null)
                    }}
                    placeholder={td.zipPlaceholder}
                    className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                <div className="relative">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    {td.addressLabel}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      setQuote(null)
                      setDeliveryError(null)
                      if (selectedSuggestion && e.target.value.trim() !== selectedSuggestion.label) {
                        setSelectedSuggestion(null)
                      }
                    }}
                    placeholder={td.addressPlaceholder}
                    className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-lg bg-neutral-900 shadow-xl ring-1 ring-white/15">
                      {suggestions.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => pickSuggestion(s)}
                          className="block w-full border-b border-white/5 px-3 py-2 text-left text-xs text-white last:border-0 hover:bg-white/10"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-white/50">{td.aptLabel}</label>
                  <input
                    type="text"
                    value={aptUnit}
                    onChange={(e) => setAptUnit(e.target.value)}
                    placeholder={td.aptPlaceholder}
                    className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                {searching && <p className="text-[11px] text-white/50">{td.searching}</p>}
                {calculating && <p className="text-[11px] text-white/50">{td.calculating}</p>}

                {!searching && !calculating && address.trim().length >= 4 && suggestions.length === 0 && (!selectedSuggestion || addressStale) && (
                  <p className="text-[11px] text-red-400">{searchUnavailable ? td.searchUnavailable : td.notFound}</p>
                )}

                {quote && !addressStale && selectedSuggestion && (
                  <>
                    <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
                      <img
                        src={staticMapUrl(selectedSuggestion.coords) ?? ''}
                        alt={td.mapAlt}
                        className="block h-auto w-full"
                        loading="lazy"
                      />
                      <p className="bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60">{td.mapConfirm}</p>
                    </div>

                    <div className="rounded-lg bg-white/5 p-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">{td.distanceLabel}</span>
                        <span className="font-semibold text-white">{quote.distanceMi.toFixed(1)} mi</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-white/60">{td.feeLabel}</span>
                        <span className="font-semibold text-orange-300">{formatCurrency(quote.fee)}</span>
                      </div>
                      {quote.isNewJersey && <p className="mt-1.5 text-[11px] text-white/50">{td.njToll}</p>}
                    </div>
                  </>
                )}

                {deliveryError && (
                  <p className="text-[11px] text-red-400">{deliveryError === 'out_of_range' ? td.outOfRange : td.error}</p>
                )}
              </div>
            )}

            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-white/60">{t.subtotal}</span>
              <span className="text-xs text-white/80">{formatCurrency(totalKnown)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-white/60">{td.feeLabel}</span>
                <span className="text-xs text-white/80">{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-white/60">{t.salesTax}</span>
              <span className="text-xs text-white/80">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">{t.total}</span>
              <span className="text-base font-bold text-orange-300">{formatCurrency(grandTotal)}</span>
            </div>
            {hasUnknownPriceItems && <p className="mb-2 text-[11px] text-white/50">{t.taxNotice}</p>}
            {esfihaBelowMin && (
              <p className="mb-2 text-[11px] font-semibold text-red-400">
                {t.esfihaMinWarning.replace('{n}', String(5 - esfihaQty))}
              </p>
            )}
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="mb-2 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-green-500 disabled:opacity-40 disabled:active:scale-100"
            >
              {sending ? t.sending : t.sendWhatsapp}
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
