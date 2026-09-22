import type { CartItem } from '../types/cart'

// Refrigerante avulso sempre por último no pedido/comanda — pedido explícito do João
// (22/09/2026): se a pessoa pedir pastel, esfiha, macarrão e um refri, o refri tem que
// ser o último item, tanto na tela do carrinho quanto na mensagem do WhatsApp.
export function sortForReceipt(items: CartItem[]): CartItem[] {
  const regular = items.filter((it) => it.category !== 'refrigerante')
  const sodas = items.filter((it) => it.category === 'refrigerante')
  return [...regular, ...sodas]
}
