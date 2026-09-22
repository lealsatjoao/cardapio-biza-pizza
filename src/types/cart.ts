export interface CartItem {
  id: string
  name: string
  note?: string
  observation?: string
  priceLabel?: string
  qty: number
  /** Marca refrigerantes avulsos (sempre vão por último na comanda/notinha), esfihas
   * individuais (usado pra checar a venda mínima de 5 no checkout) e pastéis (mostra a
   * lista de adicionais no modal de adicionar ao carrinho). */
  category?: 'refrigerante' | 'esfiha' | 'pastel'
  /** Nome que aparece na notinha do WhatsApp no lugar do sabor (ex: "Pastel 24") — a loja
   * registra esses itens por número do cardápio físico, não pelo nome do recheio. */
  receiptLabel?: string
  /** Valor (por unidade) já embutido no priceLabel que veio de adicionais de pizza ($1 cada) —
   * usado só pra separar "Total Itens" de "Total Adicional" na notinha do WhatsApp. */
  extraAddonsTotal?: number
}

export type AddCartInput = Omit<CartItem, 'id' | 'qty' | 'observation'>
