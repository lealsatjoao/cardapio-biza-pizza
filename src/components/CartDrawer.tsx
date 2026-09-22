import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'
import { isEsfihaFlavorName } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { calculateTax, formatCurrency, parsePriceLabel } from '../utils/price'
import { buildReceipt, STORE_PHONE, type OrderDelivery, type PaymentMethod } from '../utils/receipt'
import { nextControleNumber } from '../utils/orderCounter'
import { sortForReceipt } from '../utils/cartOrder'
import { loadSavedCustomer, saveCustomer, type SavedCustomerInfo } from '../utils/savedCustomer'
import { lookupCustomerRecord, saveCustomerRecord } from '../utils/customersService'
import { submitOrder } from '../utils/ordersService'
import { fullPhoneDigits, formatPhoneDisplay, type PhoneCountry } from '../utils/phone'
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

  // O carrinho não desmonta quando fecha (só some da tela), então esse estado precisa ser
  // atualizado manualmente depois de cada pedido — senão o app fica "lembrando" só do que
  // tinha no aparelho quando a página abriu, e não reconhece o telefone no pedido seguinte.
  const [savedCustomer, setSavedCustomer] = useState(loadSavedCustomer)
  // Telefone SEMPRE começa vazio, mesmo se já tiver um salvo nesse aparelho — só aparece
  // algo depois que a pessoa digita, nunca sozinho ao abrir o site (pedido do João, 22/09/2026).
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  // EUA por padrão (maioria dos clientes) — a pessoa só troca se o telefone for do Brasil.
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>('US')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [changeFor, setChangeFor] = useState('')
  const [sending, setSending] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{
    controle: number | null
    name: string
    paymentMethod: PaymentMethod
    mode: 'pickup' | 'delivery'
  } | null>(null)
  const [submitError, setSubmitError] = useState(false)

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

  // Preenche nome, ZIP, apto e — se for o mesmo endereço de entrega — o endereço, mapa e taxa
  // já calculada (sem chamar a API de novo), só nos campos que ainda estiverem vazios.
  const applyCustomerInfo = (info: SavedCustomerInfo) => {
    if (!customerName.trim() && info.name) setCustomerName(info.name)
    if (!zip.trim() && info.zip) setZip(info.zip)
    if (!aptUnit.trim() && info.aptUnit) setAptUnit(info.aptUnit)

    if (!address.trim()) {
      if (info.lastSuggestion && info.lastQuote) {
        setAddress(info.lastSuggestion.label)
        setSelectedSuggestion(info.lastSuggestion)
        setQuote(info.lastQuote)
      } else if (info.address) {
        setAddress(info.address)
      }
    }
  }

  // Achado um telefone conhecido (local ou no Firebase), os dados NÃO são preenchidos direto —
  // ficam guardados aqui só como "candidato", pra pessoa ver escrito e confirmar antes de
  // qualquer coisa aparecer nos campos do formulário (pedido do João, 22/09/2026).
  const [pendingMatch, setPendingMatch] = useState<SavedCustomerInfo | null>(null)
  // true = já pode mostrar o formulário completo (telefone confirmado com um cadastro, ou
  // telefone novo sem cadastro nenhum, ou a pessoa disse "não sou eu").
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [checkingPhone, setCheckingPhone] = useState(false)
  // Telefone (só dígitos) já resolvido nesta sessão — evita ficar checando de novo à toa
  // enquanto a pessoa não muda o número.
  const [resolvedDigits, setResolvedDigits] = useState<string | null>(null)

  // Quando o telefone digitado bate com o telefone salvo NESSE aparelho, acha o "candidato"
  // na hora (sem esperar rede) — mas só mostra depois de confirmado.
  useEffect(() => {
    const typedDigits = customerPhone.replace(/\D/g, '')
    if (typedDigits.length < 10) {
      setPendingMatch(null)
      setPhoneVerified(false)
      setResolvedDigits(null)
      return
    }
    if (typedDigits === resolvedDigits) return
    const savedDigits = (savedCustomer.phone ?? '').replace(/\D/g, '')
    if (typedDigits === savedDigits) {
      setPendingMatch(savedCustomer)
      setPhoneVerified(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerPhone])

  // Também busca no Firebase por esse telefone — funciona mesmo em outro aparelho/navegador
  // (decisão do João, 22/09/2026: aceitou o risco de privacidade pra ganhar essa comodidade).
  // Só roda se não achou nada local (senão duplica o candidato à toa).
  useEffect(() => {
    const digits = customerPhone.replace(/\D/g, '')
    const savedDigits = (savedCustomer.phone ?? '').replace(/\D/g, '')
    if (digits.length < 10 || digits === savedDigits || digits === resolvedDigits) return
    let cancelled = false
    setCheckingPhone(true)
    const timer = setTimeout(async () => {
      const record = await lookupCustomerRecord(digits)
      if (cancelled) return
      setCheckingPhone(false)
      if (record) {
        setPendingMatch(record)
        setPhoneVerified(false)
      } else {
        // Telefone sem cadastro em lugar nenhum — é a primeira vez, segue pro formulário
        // vazio de preenchimento manual direto, sem pedir confirmação de nada.
        setPhoneVerified(true)
        setResolvedDigits(digits)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerPhone])

  const confirmPendingMatch = () => {
    if (!pendingMatch) return
    applyCustomerInfo(pendingMatch)
    if (pendingMatch.phoneCountry) setPhoneCountry(pendingMatch.phoneCountry)
    setPendingMatch(null)
    setPhoneVerified(true)
    setResolvedDigits(customerPhone.replace(/\D/g, ''))
  }

  const rejectPendingMatch = () => {
    setPendingMatch(null)
    setPhoneVerified(true)
    setResolvedDigits(customerPhone.replace(/\D/g, ''))
  }

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

  useEffect(() => {
    if (!open) {
      setConfirmedOrder(null)
      setSubmitError(false)
    }
  }, [open])

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
    setSubmitError(false)
    const controle = await nextControleNumber()
    const delivery: OrderDelivery =
      mode === 'delivery' && quote && !addressStale
        ? { mode: 'delivery', quote, aptUnit: aptUnit.trim() || undefined }
        : { mode: 'pickup' }
    // Telefone com código do país (+1/+55) — é o que vai gravado no pedido e usado no botão
    // de WhatsApp da tela do balcão. Na notinha impressa mostra formatado com "+" na frente.
    const fullPhone = fullPhoneDigits(phoneCountry, customerPhone)
    const { text, totals } = buildReceipt(
      items,
      customerName.trim(),
      formatPhoneDisplay(phoneCountry, customerPhone),
      { method: paymentMethod, changeFor },
      delivery,
      controle,
    )
    try {
      await submitOrder({
        controle,
        createdAt: Date.now(),
        customerName: customerName.trim(),
        customerPhone: fullPhone,
        mode,
        grandTotal: totals.grandTotal,
        receiptText: text,
      })
    } catch {
      setSending(false)
      setSubmitError(true)
      return
    }
    // Guarda os dados só neste aparelho — preenche sozinho da próxima vez que a pessoa pedir.
    // Atualiza o localStorage E o estado em memória (o carrinho não recarrega a página entre
    // pedidos, então sem isso o pedido seguinte não reconheceria o telefone digitado).
    const infoToSave = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      phoneCountry,
      zip: zip.trim() || undefined,
      address: mode === 'delivery' ? address.trim() || undefined : undefined,
      aptUnit: aptUnit.trim() || undefined,
      lastSuggestion: mode === 'delivery' && !addressStale ? (selectedSuggestion ?? undefined) : undefined,
      lastQuote: mode === 'delivery' && !addressStale ? (quote ?? undefined) : undefined,
    }
    saveCustomer(infoToSave)
    setSavedCustomer(infoToSave)
    saveCustomerRecord(customerPhone, infoToSave)
    setConfirmedOrder({ controle, name: customerName.trim(), paymentMethod, mode })
    clear()
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

        {confirmedOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 text-3xl">✓</div>
            <h3 className="text-lg font-bold text-white">{t.orderConfirmedTitle}</h3>
            <p className="text-sm text-white/70">
              {t.orderConfirmedMsg.replace('{name}', confirmedOrder.name)}
              {confirmedOrder.controle !== null && (
                <>
                  <br />
                  {t.orderConfirmedControle.replace('{n}', String(confirmedOrder.controle))}
                </>
              )}
            </p>
            {confirmedOrder.paymentMethod === 'zelle' && confirmedOrder.mode === 'delivery' && (
              <div className="w-full rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">{t.zelleNumber.replace('{n}', STORE_PHONE)}</p>
                <p className="mt-1 text-xs text-white/70">{t.zelleInstructions}</p>
                <a
                  href={`https://wa.me/1${STORE_PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block w-full rounded-lg bg-green-600 py-2 text-center text-xs font-bold text-white hover:bg-green-500"
                >
                  {t.zelleWhatsappLink}
                </a>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null)
                onClose()
              }}
              className="mt-3 w-full rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-orange-400"
            >
              {t.close}
            </button>
          </div>
        ) : (
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
                const addonsPerUnit = item.extraAddonsTotal ?? 0
                const baseUnit = unit !== undefined ? unit - addonsPerUnit : undefined
                return (
                  <div key={item.id} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        {item.note && <p className="whitespace-pre-line text-xs text-white/60">{item.note}</p>}
                        {item.observation && (
                          <p className="mt-0.5 text-xs italic text-amber-300/80">"{item.observation}"</p>
                        )}
                        {addonsPerUnit > 0 && baseUnit !== undefined ? (
                          <div className="mt-1.5 text-xs">
                            <p className="text-white/60">
                              {t.itemBaseLabel}: {formatCurrency(baseUnit)}
                            </p>
                            <p className="text-white/60">
                              {t.itemAddonsLabel}: {formatCurrency(addonsPerUnit)}
                            </p>
                            <p className="font-bold text-orange-300">
                              {t.itemTotalLabel}: {formatCurrency(unit!)}
                            </p>
                          </div>
                        ) : (
                          <p className="mt-0.5 text-xs text-orange-300">
                            {unit !== undefined ? formatCurrency(unit) : item.priceLabel ?? t.priceOnRequest}
                          </p>
                        )}
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
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-white/50">
                {t.customerPhone}
              </label>
              <div className="mb-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhoneCountry('US')}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                    phoneCountry === 'US' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t.countryUS}
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneCountry('BR')}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                    phoneCountry === 'BR' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t.countryBR}
                </button>
              </div>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.customerPhonePlaceholder}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              {!phoneVerified && !pendingMatch && (
                <p className="mt-1.5 text-[11px] text-white/50">{checkingPhone ? t.checkingPhone : t.phoneFirstHint}</p>
              )}
            </div>

            {pendingMatch && !phoneVerified && (
              <div className="mb-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="mb-2 text-xs font-semibold text-white/70">{t.confirmDataTitle}</p>
                <div className="space-y-1 text-sm text-white">
                  {pendingMatch.name && (
                    <p>
                      <span className="text-white/50">{t.confirmDataName}: </span>
                      {pendingMatch.name}
                    </p>
                  )}
                  <p>
                    <span className="text-white/50">{t.confirmDataPhone}: </span>
                    {customerPhone}
                  </p>
                  {(pendingMatch.lastSuggestion?.label ?? pendingMatch.address) && (
                    <p>
                      <span className="text-white/50">{t.confirmDataAddress}: </span>
                      {pendingMatch.lastSuggestion?.label ?? pendingMatch.address}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={confirmPendingMatch}
                    className="flex-1 rounded-lg bg-green-600 py-2 text-xs font-bold text-white hover:bg-green-500"
                  >
                    {t.confirmDataYes}
                  </button>
                  <button
                    type="button"
                    onClick={rejectPendingMatch}
                    className="flex-1 rounded-lg bg-white/10 py-2 text-xs font-semibold text-white/70 hover:bg-white/20"
                  >
                    {t.confirmDataNo}
                  </button>
                </div>
              </div>
            )}

            {phoneVerified && (
              <>
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
            {submitError && <p className="mb-2 text-[11px] font-semibold text-red-400">{t.submitError}</p>}
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="mb-2 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95 hover:bg-green-500 disabled:opacity-40 disabled:active:scale-100"
            >
              {sending ? t.sending : t.confirmOrder}
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-full rounded-xl bg-white/5 py-2 text-xs font-semibold text-white/60 hover:bg-white/10"
            >
              {t.clear}
            </button>
              </>
            )}
          </div>
        )}
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
