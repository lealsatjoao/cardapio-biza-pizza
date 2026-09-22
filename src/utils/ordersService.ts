import { onValue, push, ref, remove } from 'firebase/database'
import { db } from './firebase'

export interface StoredOrder {
  id: string
  controle: number | null
  createdAt: number
  customerName: string
  customerPhone: string
  mode: 'pickup' | 'delivery'
  grandTotal: number
  receiptText: string
}

// Grava o pedido no Firebase — qualquer pessoa pode gravar (".write": true nas Regras), só
// quem estiver logado como a loja consegue ler a lista depois (tela do balcão).
export async function submitOrder(order: Omit<StoredOrder, 'id'>): Promise<void> {
  await push(ref(db, 'orders'), order)
}

// Escuta a lista de pedidos em tempo real — só funciona se estiver autenticado (ver Regras).
export function watchOrders(onChange: (orders: StoredOrder[]) => void): () => void {
  const ordersRef = ref(db, 'orders')
  const unsubscribe = onValue(ordersRef, (snapshot) => {
    const value = snapshot.val() as Record<string, Omit<StoredOrder, 'id'>> | null
    const list: StoredOrder[] = value
      ? Object.entries(value).map(([id, data]) => ({ id, ...data }))
      : []
    list.sort((a, b) => b.createdAt - a.createdAt)
    onChange(list)
  })
  return unsubscribe
}

export async function deleteOrder(id: string): Promise<void> {
  await remove(ref(db, `orders/${id}`))
}
