import type { CartItem } from '../types/cart'
import type { DeliveryQuote } from './delivery'
import type { Lang } from './translations'
import { calculateTax, formatCurrency, parsePriceLabel } from './price'

// Número da Biza Pizza (DDI 55 + DDD + número) usado para receber os pedidos via WhatsApp.
export const WHATSAPP_NUMBER = '5511958776672'

export type OrderDelivery = { mode: 'pickup' } | { mode: 'delivery'; quote: DeliveryQuote }

export type PaymentMethod = 'cash' | 'zelle' | 'venmo' | 'card'

export interface OrderPayment {
  method: PaymentMethod
  changeFor?: string
}

const paymentLabels: Record<PaymentMethod, { pt: string; en: string }> = {
  cash: { pt: 'Dinheiro', en: 'Cash' },
  zelle: { pt: 'Zelle', en: 'Zelle' },
  venmo: { pt: 'Venmo', en: 'Venmo' },
  card: { pt: 'Cartão', en: 'Card' },
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

// Data/hora no mesmo formato da notinha da loja (DD/MM/AAAA HH:mm em pt, MM/DD/AAAA em en).
function formatOrderDateTime(isPt: boolean): string {
  const now = new Date()
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const d = pad(now.getDate())
  const m = pad(now.getMonth() + 1)
  const y = now.getFullYear()
  return isPt ? `${d}/${m}/${y} ${time}` : `${m}/${d}/${y} ${time}`
}

export function buildOrderMessage(
  items: CartItem[],
  lang: Lang,
  customerName: string,
  payment: OrderPayment,
  delivery?: OrderDelivery,
): string {
  const isPt = lang === 'pt'
  const lines: string[] = []

  lines.push('BIZA PIZZAS')
  lines.push(isPt ? 'North East Philadelphia' : 'North East Philadelphia')
  lines.push('')
  lines.push(isPt ? `Pedido via WhatsApp — ${formatOrderDateTime(isPt)}` : `WhatsApp order — ${formatOrderDateTime(isPt)}`)
  lines.push('')
  lines.push(isPt ? `Cliente: ${customerName}` : `Customer: ${customerName}`)

  if (delivery?.mode === 'delivery') {
    lines.push(isPt ? `Endereço: ${delivery.quote.address}` : `Address: ${delivery.quote.address}`)
    lines.push(
      isPt
        ? `Distância: ${delivery.quote.distanceMi.toFixed(1)} mi`
        : `Distance: ${delivery.quote.distanceMi.toFixed(1)} mi`,
    )
  } else {
    lines.push(isPt ? 'Retirada no local' : 'Pickup')
  }

  lines.push(isPt ? `Pagamento: ${paymentLabels[payment.method].pt}` : `Payment: ${paymentLabels[payment.method].en}`)
  if (payment.method === 'cash' && payment.changeFor?.trim()) {
    lines.push(isPt ? `Troco para: $${payment.changeFor.trim()}` : `Change for: $${payment.changeFor.trim()}`)
  }

  lines.push('')

  let total = 0
  let hasUnknown = false

  for (const item of items) {
    const unit = parsePriceLabel(item.priceLabel)
    const parts = [`• ${item.qty}x ${item.name}`]
    if (unit !== undefined) {
      total += unit * item.qty
      parts.push(`— ${formatCurrency(unit * item.qty)}`)
    } else if (item.priceLabel) {
      parts.push(`— ${item.priceLabel}`)
    } else {
      hasUnknown = true
    }
    lines.push(parts.join(' '))
    if (item.note) {
      for (const noteLine of item.note.split('\n')) {
        lines.push(`   ${noteLine}`)
      }
    }
    if (item.observation) {
      lines.push(isPt ? `   Obs: ${item.observation}` : `   Note: ${item.observation}`)
    }
  }

  const deliveryFee = delivery?.mode === 'delivery' ? delivery.quote.fee : 0
  const taxAmount = calculateTax(total + deliveryFee)
  const grandTotal = total + deliveryFee + taxAmount
  const unknownSuffix = hasUnknown ? (isPt ? ' (+ itens sem preço fixo)' : ' (+ items without fixed price)') : ''

  lines.push('')
  lines.push(isPt ? `Total Itens: ${formatCurrency(total)}${unknownSuffix}` : `Items Total: ${formatCurrency(total)}${unknownSuffix}`)
  if (delivery?.mode === 'delivery') {
    lines.push(isPt ? `Taxa Entrega: ${formatCurrency(deliveryFee)}` : `Delivery Fee: ${formatCurrency(deliveryFee)}`)
  }
  lines.push(isPt ? `Taxa (8%): ${formatCurrency(taxAmount)}` : `Tax (8%): ${formatCurrency(taxAmount)}`)
  lines.push(isPt ? `Total: ${formatCurrency(grandTotal)}${unknownSuffix}` : `Total: ${formatCurrency(grandTotal)}${unknownSuffix}`)

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
