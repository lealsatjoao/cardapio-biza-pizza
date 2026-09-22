import type { CartItem } from '../types/cart'
import type { DeliveryQuote } from './delivery'
import type { Lang } from './translations'
import { formatCurrency, parsePriceLabel } from './price'

// Número da Biza Pizza (DDI 55 + DDD + número) usado para receber os pedidos via WhatsApp.
export const WHATSAPP_NUMBER = '5511958776672'

export type OrderDelivery = { mode: 'pickup' } | { mode: 'delivery'; quote: DeliveryQuote }

export function buildOrderMessage(items: CartItem[], lang: Lang, delivery?: OrderDelivery): string {
  const isPt = lang === 'pt'
  const lines: string[] = []

  lines.push(isPt ? 'Olá! Gostaria de fazer o seguinte pedido:' : 'Hi! I would like to place the following order:')
  lines.push('')

  let total = 0
  let hasUnknown = false

  for (const item of items) {
    const unit = parsePriceLabel(item.priceLabel)
    const parts = [`• ${item.qty}x ${item.name}`]
    if (item.note) parts.push(`(${item.note})`)
    if (unit !== undefined) {
      total += unit * item.qty
      parts.push(`— ${formatCurrency(unit * item.qty)}`)
    } else if (item.priceLabel) {
      parts.push(`— ${item.priceLabel}`)
    } else {
      hasUnknown = true
    }
    lines.push(parts.join(' '))
    if (item.observation) {
      lines.push(isPt ? `   Obs: ${item.observation}` : `   Note: ${item.observation}`)
    }
  }

  const deliveryFee = delivery?.mode === 'delivery' ? delivery.quote.fee : 0
  const grandTotal = total + deliveryFee

  lines.push('')
  lines.push(
    isPt
      ? `Subtotal: ${formatCurrency(total)}${hasUnknown ? ' (+ itens sem preço fixo)' : ''}`
      : `Subtotal: ${formatCurrency(total)}${hasUnknown ? ' (+ items without fixed price)' : ''}`,
  )

  if (delivery?.mode === 'delivery') {
    lines.push(isPt ? `Entrega para: ${delivery.quote.address}` : `Delivering to: ${delivery.quote.address}`)
    lines.push(
      isPt
        ? `Distância: ${delivery.quote.distanceMi.toFixed(1)} mi`
        : `Distance: ${delivery.quote.distanceMi.toFixed(1)} mi`,
    )
    lines.push(isPt ? `Taxa de entrega: ${formatCurrency(deliveryFee)}` : `Delivery fee: ${formatCurrency(deliveryFee)}`)
    lines.push(
      isPt
        ? `Total: ${formatCurrency(grandTotal)}${hasUnknown ? ' (+ itens sem preço fixo)' : ''} — impostos não incluídos`
        : `Total: ${formatCurrency(grandTotal)}${hasUnknown ? ' (+ items without fixed price)' : ''} — taxes not included`,
    )
  } else {
    lines.push(isPt ? 'Retirada no local' : 'Pickup')
    lines.push(
      isPt
        ? `Total: ${formatCurrency(grandTotal)}${hasUnknown ? ' (+ itens sem preço fixo)' : ''} — impostos não incluídos`
        : `Total: ${formatCurrency(grandTotal)}${hasUnknown ? ' (+ items without fixed price)' : ''} — taxes not included`,
    )
  }

  lines.push('')
  lines.push(isPt ? 'Nome: ' : 'Name: ')

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
