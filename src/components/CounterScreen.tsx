import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../utils/firebase'
import {
  archiveOrder,
  dayKeyFor,
  fetchArchivedOrdersForDay,
  pruneOldArchivedOrders,
  watchOrders,
  type StoredOrder,
} from '../utils/ordersService'

const ICON_BASE = `${import.meta.env.BASE_URL}icons/`

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('pt-BR')
}

function Background() {
  return (
    <div
      className="fixed inset-0 z-0 h-full w-full bg-black bg-cover bg-center bg-no-repeat pointer-events-none"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-biza-horizontal.jpg)` }}
    >
      <div className="absolute inset-0 bg-black/35" />
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch {
      setError('E-mail ou senha errados.')
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Background />
      <form onSubmit={handleLogin} className="relative z-10 w-full max-w-xs rounded-2xl bg-white/95 p-6 shadow-xl ring-1 ring-black/10">
        <h1 className="mb-1 text-lg font-bold text-black">Biza Pizzas — Balcão</h1>
        <p className="mb-4 text-xs text-black/60">Login da loja pra ver os pedidos.</p>
        <label className="mb-1 block text-[11px] font-semibold text-black/60">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
          autoComplete="username"
        />
        <label className="mb-1 block text-[11px] font-semibold text-black/60">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
          autoComplete="current-password"
        />
        {error && <p className="mb-3 text-[11px] font-semibold text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

function ReceiptBlock({ order }: { order: StoredOrder }) {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-lg bg-neutral-100 p-3 font-mono text-[11px] leading-snug text-black">
      {order.receiptText}
    </pre>
  )
}

function printReceipt(setPrintText: (t: string | null) => void, text: string) {
  setPrintText(text)
}

function OrderCard({
  order,
  onArchive,
  onPrint,
  archivable,
}: {
  order: StoredOrder
  onArchive?: (order: StoredOrder) => void
  onPrint: (order: StoredOrder) => void
  archivable: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmingArchive, setConfirmingArchive] = useState(false)

  return (
    <div className="rounded-xl bg-white/95 shadow ring-1 ring-black/10">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-bold text-black">
            Controle {order.controle ?? '-'} — {order.customerName}
          </p>
          <p className="text-xs text-black/60">
            {order.mode === 'delivery' ? 'Entrega' : 'Retirada'} · ${order.grandTotal.toFixed(2)} ·{' '}
            {formatTime(order.createdAt)}
          </p>
        </div>
        <span className="text-black/40">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-black/10 p-4">
          <ReceiptBlock order={order} />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onPrint(order)}
              className="flex-1 rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-400"
            >
              Imprimir
            </button>
            {archivable &&
              (confirmingArchive ? (
                <button
                  type="button"
                  onClick={() => onArchive?.(order)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                >
                  Confirmar remoção
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingArchive(true)}
                  className="rounded-lg bg-black/5 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/10"
                >
                  Remover
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function todayDayKey(): string {
  return dayKeyFor(Date.now())
}

function HistoryTab({ onPrint }: { onPrint: (order: StoredOrder) => void }) {
  const [date, setDate] = useState(todayDayKey())
  const [orders, setOrders] = useState<StoredOrder[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchArchivedOrdersForDay(date).then((list) => {
      if (!cancelled) {
        setOrders(list)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [date])

  const dayTotal = orders?.reduce((sum, o) => sum + o.grandTotal, 0) ?? 0

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-black">Dia:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg bg-white px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {loading ? (
        <p className="text-sm text-black/70">Carregando...</p>
      ) : !orders || orders.length === 0 ? (
        <p className="text-sm text-black/70">Nenhum pedido arquivado nesse dia.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-black/70">
            {orders.length} pedido{orders.length > 1 ? 's' : ''} · total ${dayTotal.toFixed(2)}
          </p>
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onPrint={onPrint} archivable={false} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function CounterScreen() {
  const [user, setUser] = useState<User | null | 'loading'>('loading')
  const [tab, setTab] = useState<'pedidos' | 'historico'>('pedidos')
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [printText, setPrintText] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Biza Pizzas — Balcão'
  }, [])

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  useEffect(() => {
    if (!user || user === 'loading') return
    pruneOldArchivedOrders()
    return watchOrders(setOrders)
  }, [user])

  useEffect(() => {
    if (printText === null) return
    const timer = setTimeout(() => {
      window.print()
      setPrintText(null)
    }, 50)
    return () => clearTimeout(timer)
  }, [printText])

  if (user === 'loading') {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <Background />
        <span className="relative z-10 rounded-lg bg-white/90 px-4 py-2 text-sm text-black">Carregando...</span>
      </div>
    )
  }

  if (!user) return <LoginForm />

  return (
    <div className="relative min-h-screen px-4 py-6">
      <Background />
      <div className="print:hidden relative z-10 mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white/95 px-4 py-3 shadow ring-1 ring-black/10">
          <div className="flex items-center gap-2">
            <img src={`${ICON_BASE}pizza.png`} alt="" className="h-7 w-7" />
            <h1 className="text-lg font-bold text-black">Biza Pizzas — Balcão</h1>
          </div>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/60 hover:bg-black/10"
          >
            Sair
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('pedidos')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              tab === 'pedidos' ? 'bg-orange-500 text-white' : 'bg-white/90 text-black/70 hover:bg-white'
            }`}
          >
            Pedidos novos
          </button>
          <button
            type="button"
            onClick={() => setTab('historico')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              tab === 'historico' ? 'bg-orange-500 text-white' : 'bg-white/90 text-black/70 hover:bg-white'
            }`}
          >
            Histórico
          </button>
        </div>

        {tab === 'pedidos' ? (
          orders.length === 0 ? (
            <p className="rounded-lg bg-white/90 px-4 py-3 text-sm text-black/70">Nenhum pedido novo.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  archivable
                  onArchive={(o) => archiveOrder(o)}
                  onPrint={(o) => printReceipt(setPrintText, o.receiptText)}
                />
              ))}
            </div>
          )
        ) : (
          <HistoryTab onPrint={(o) => printReceipt(setPrintText, o.receiptText)} />
        )}
      </div>

      {printText !== null && <pre className="hidden whitespace-pre font-mono text-xs print:block">{printText}</pre>}
    </div>
  )
}
