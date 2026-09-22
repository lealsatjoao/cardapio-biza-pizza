import type { CartItem } from '../types/cart'
import type { DeliveryQuote } from './delivery'
import { calculateTax, parsePriceLabel } from './price'
import { sortForReceipt } from './cartOrder'

export type OrderDelivery = { mode: 'pickup' } | { mode: 'delivery'; quote: DeliveryQuote; aptUnit?: string }

export type PaymentMethod = 'cash' | 'zelle' | 'venmo' | 'card'

export interface OrderPayment {
  method: PaymentMethod
  changeFor?: string
}

// A notinha imprimível imita a notinha física da loja (foto de referência, 22/09/2026) — por
// isso os rótulos ficam sempre em português, igual o sistema de caixa deles, mesmo que o
// cliente tenha navegado o cardápio em inglês (quem lê essa notinha é a equipe da loja).
const paymentLabels: Record<PaymentMethod, string> = {
  cash: 'Dinheiro',
  zelle: 'Zelle',
  venmo: 'Venmo',
  card: 'Cartão',
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatOrderDateTime(): string {
  const now = new Date()
  const d = pad2(now.getDate())
  const m = pad2(now.getMonth() + 1)
  const y = now.getFullYear()
  const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`
  return `${d}/${m}/${y} ${time}`
}

// Valor sem "$" e com vírgula decimal — igual à notinha impressa (ela não usa símbolo de moeda).
function money(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

function padEnd(s: string, w: number): string {
  return s.length >= w ? s : s + ' '.repeat(w - s.length)
}
function padStart(s: string, w: number): string {
  return s.length >= w ? s : ' '.repeat(w - s.length) + s
}

// Linha "Rótulo ......... valor" alinhada numa largura fixa (bloco de totais/pagamento).
function totalsLine(label: string, value: string, width = 32): string {
  const gap = Math.max(1, width - label.length - value.length)
  return label + ' '.repeat(gap) + value
}

const COL_ITEM = 5
const COL_CODE = 9
const COL_QTY = 5
const COL_UNIT = 9
const COL_TOTAL = 9

export interface OrderTotals {
  itemsBaseTotal: number
  addonsTotal: number
  deliveryFee: number
  taxAmount: number
  grandTotal: number
}

// Monta o texto da notinha (pro balcão ver/imprimir) e os totais calculados (pra guardar no
// pedido). Cada item/adicional/borda/refrigerante já vem em linha própria no note do item.
export function buildReceipt(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  payment: OrderPayment,
  delivery: OrderDelivery,
  controle: number | null,
): { text: string; totals: OrderTotals } {
  const lines: string[] = []

  lines.push('BIZA PIZZAS')
  lines.push('NORTH EAST')
  lines.push('2677487163')
  lines.push('')
  lines.push(formatOrderDateTime())
  lines.push('Atendente: SITE')
  lines.push(`Controle: ${controle !== null ? controle : '-'} - Site`)
  lines.push(`Cliente: ${customerName}`)
  lines.push('')

  if (delivery.mode === 'delivery') {
    lines.push('Endereço')
    lines.push(delivery.quote.address)
    if (delivery.aptUnit?.trim()) {
      lines.push(`Apto/Unidade: ${delivery.aptUnit.trim()}`)
    }
    lines.push('')
    lines.push('')
    const neighbourhood = delivery.quote.neighbourhood ?? ''
    const city = delivery.quote.cityLabel ?? ''
    if (neighbourhood || city) {
      lines.push(`${padEnd(neighbourhood, 28)}${city}`)
    }
    lines.push(`Fone: ${customerPhone} -`)
    lines.push('Observação')
  } else {
    lines.push('Retirada no local')
    lines.push(`Fone: ${customerPhone} -`)
    lines.push('Observação')
  }

  lines.push('')
  lines.push(
    padEnd('Item', COL_ITEM) +
      padEnd('Código', COL_CODE) +
      padStart('Qtde', COL_QTY) +
      padStart('Unit', COL_UNIT) +
      padStart('Total', COL_TOTAL),
  )
  lines.push('Und  Descrição')
  lines.push('')

  const sortedItems = sortForReceipt(items)

  let itemsBaseTotal = 0
  let addonsTotal = 0
  let hasUnknown = false

  sortedItems.forEach((item, idx) => {
    const unit = parsePriceLabel(item.priceLabel)
    const addonsPerUnit = item.extraAddonsTotal ?? 0
    const seq = padEnd(String(idx + 1).padStart(3, '0'), COL_ITEM)
    const codeCol = padEnd('', COL_CODE)
    const qtyCol = padStart(String(item.qty), COL_QTY)

    if (unit !== undefined) {
      const baseUnit = unit - addonsPerUnit
      itemsBaseTotal += baseUnit * item.qty
      addonsTotal += addonsPerUnit * item.qty
      const unitCol = padStart(money(baseUnit), COL_UNIT)
      const totalCol = padStart(money(baseUnit * item.qty), COL_TOTAL)
      lines.push(seq + codeCol + qtyCol + unitCol + totalCol)
    } else {
      hasUnknown = true
      lines.push(seq + codeCol + qtyCol + padStart('-', COL_UNIT) + padStart(item.priceLabel ?? '-', COL_TOTAL))
    }

    lines.push(`UN   ${(item.receiptLabel ?? item.name).toUpperCase()}`)
    if (item.note) {
      for (const noteLine of item.note.split('\n')) {
        lines.push(noteLine ? `    ${noteLine}` : '')
      }
    }
    if (item.observation) {
      lines.push(`    Obs: ${item.observation}`)
    }
    lines.push('')
  })

  const deliveryFee = delivery.mode === 'delivery' ? delivery.quote.fee : 0
  const taxAmount = calculateTax(itemsBaseTotal + addonsTotal + deliveryFee)
  const grandTotal = itemsBaseTotal + addonsTotal + deliveryFee + taxAmount
  const totalAdicional = addonsTotal + taxAmount
  const unknownSuffix = hasUnknown ? ' (+ itens sem preço fixo)' : ''

  lines.push(totalsLine('Total Itens', money(itemsBaseTotal) + unknownSuffix))
  lines.push(totalsLine('Total Adicional', money(totalAdicional)))
  if (delivery.mode === 'delivery') {
    lines.push(totalsLine('Taxa Entrega', money(deliveryFee)))
  }
  lines.push(totalsLine('Total', money(grandTotal) + unknownSuffix))
  lines.push('')
  lines.push(totalsLine(paymentLabels[payment.method], money(grandTotal)))
  if (payment.method === 'cash' && payment.changeFor?.trim()) {
    lines.push(`Troco para: $${payment.changeFor.trim()}`)
  }
  lines.push('')
  lines.push('Volte Sempre!!')

  return {
    text: lines.join('\n'),
    totals: { itemsBaseTotal, addonsTotal, deliveryFee, taxAmount, grandTotal },
  }
}
