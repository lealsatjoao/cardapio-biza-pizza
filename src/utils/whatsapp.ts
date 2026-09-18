import type { CartItem } from '../types/cart'
import type { Lang } from './translations'
import { formatCurrency, parsePriceLabel } from './price'

// Número da Biza Pizza (DDI 55 + DDD + número) usado para receber os pedidos via WhatsApp.
export const WHATSAPP_NUMBER = '5511958776672'

export function buildOrderMessage(items: CartItem[], lang: Lang): string {
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

  lines.push('')
  lines.push(
    isPt
      ? `Total estimado: ${formatCurrency(total)}${hasUnknown ? ' (+ itens sem preço fixo)' : ''} — taxas não incluídas`
      : `Estimated total: ${formatCurrency(total)}${hasUnknown ? ' (+ items without fixed price)' : ''} — taxes not included`,
  )
  lines.push('')
  lines.push(isPt ? 'Nome: ' : 'Name: ')
  lines.push(isPt ? 'Retirada ou entrega? ' : 'Pickup or delivery? ')

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
