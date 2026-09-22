import { endAt, equalTo, get, onValue, orderByChild, push, query, ref, remove, set } from 'firebase/database'
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
  /** "AAAA-MM-DD" (fuso do navegador que gerou o pedido) — usado pra achar os pedidos de um dia. */
  dayKey: string
}

function dayKeyFor(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Grava o pedido em "orders" (pedidos ativos/novos) — qualquer pessoa pode gravar (".write":
// true nas Regras), só quem estiver logado como a loja consegue ler depois.
export async function submitOrder(order: Omit<StoredOrder, 'id' | 'dayKey'>): Promise<void> {
  await push(ref(db, 'orders'), { ...order, dayKey: dayKeyFor(order.createdAt) })
}

// Escuta a lista de pedidos ATIVOS em tempo real (tela do balcão) — só os que ainda não
// foram arquivados. Fica pequena de propósito, pra não baixar o histórico inteiro toda vez.
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

// "Remover" na tela do balcão não apaga de vez — move o pedido pra "archive" (histórico),
// que fica fora da escuta em tempo real, mas continua salvo pra conferir depois.
export async function archiveOrder(order: StoredOrder): Promise<void> {
  const { id, ...data } = order
  await set(ref(db, `archive/${id}`), data)
  await remove(ref(db, `orders/${id}`))
}

// Busca só os pedidos arquivados de um dia específico (AAAA-MM-DD) — consulta única, não fica
// escutando em tempo real, então não pesa mesmo com meses de histórico guardado.
export async function fetchArchivedOrdersForDay(dayKey: string): Promise<StoredOrder[]> {
  const dayQuery = query(ref(db, 'archive'), orderByChild('dayKey'), equalTo(dayKey))
  const snapshot = await get(dayQuery)
  const value = snapshot.val() as Record<string, Omit<StoredOrder, 'id'>> | null
  const list: StoredOrder[] = value ? Object.entries(value).map(([id, data]) => ({ id, ...data })) : []
  list.sort((a, b) => b.createdAt - a.createdAt)
  return list
}

function dayKeyOneYearAgo(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return dayKeyFor(d.getTime())
}

// Apaga do histórico os pedidos com mais de 12 meses — roda toda vez que alguém abre a tela
// do balcão. O Firebase gratuito não tem faxina automática agendada (isso só existe no plano
// pago), então esse é o jeito de manter só os últimos 12 meses sem gerar nenhum custo: como a
// tela é aberta várias vezes por dia, na prática já vai "reciclando" sozinho (guarda 12 meses,
// aí quando começa o 13º mês, apaga o mais antigo).
export async function pruneOldArchivedOrders(): Promise<void> {
  const cutoff = dayKeyOneYearAgo()
  const oldQuery = query(ref(db, 'archive'), orderByChild('dayKey'), endAt(cutoff))
  try {
    const snapshot = await get(oldQuery)
    const value = snapshot.val() as Record<string, unknown> | null
    if (!value) return
    await Promise.all(Object.keys(value).map((id) => remove(ref(db, `archive/${id}`))))
  } catch {
    // sem internet ou sem permissão — tenta de novo na próxima vez que a tela abrir
  }
}

export { dayKeyFor }
