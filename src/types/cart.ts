export interface CartItem {
  id: string
  name: string
  note?: string
  observation?: string
  priceLabel?: string
  qty: number
}

export type AddCartInput = Omit<CartItem, 'id' | 'qty' | 'observation'>
