import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../utils/firebase'
import { archiveOrder, dayKeyFor, fetchArchivedOrdersForDay, watchOrders, type StoredOrder } from '../utils/ordersService'

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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
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
      <form onSubmit={handleLogin} className="relative z-10 w-full max-w-xs rounded-2xl bg-neutral-950/80 p-6 ring-1 ring-white/10">
        <h1 className="mb-1 text-lg font-bold text-white">Biza Pizzas — Balcão</h1>
        <p className="mb-4 text-xs text-white/50">Login da loja pra ver os pedidos.</p>
        <label className="mb-1 block text-[11px] font-semibold text-white/50">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
          autoComplete="username"
        />
        <label className="mb-1 block text-[11px] font-semibold text-white/50">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
          autoComplete="current-password"
        />
        {error && <p className="mb-3 text-[11px] font-semibold text-red-400">{error}</p>}
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
    <pre className="overflow-x-auto whitespace-pre rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-snug text-white/90">
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
    <div className="rounded-xl bg-neutral-950/80 ring-1 ring-white/10">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-bold text-white">
            Controle {order.controle ?? '-'} — {order.customerName}
          </p>
          <p className="text-xs text-white/50">
            {order.mode === 'delivery' ? 'Entrega' : 'Retirada'} · ${order.grandTotal.toFixed(2)} ·{' '}
            {formatTime(order.createdAt)}
          </p>
        </div>
        <span className="text-white/40">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-4">
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
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/20"
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
        <label className="text-xs font-semibold text-white/50">Dia:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          // O campo de data mostra fundo branco em vários navegadores (Safari inclusive),
          // não dá pra estilizar isso — por isso a letra fica preta, não branca.
          className="rounded-lg bg-white px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Carregando...</p>
      ) : !orders || orders.length === 0 ? (
        <p className="text-sm text-white/50">Nenhum pedido arquivado nesse dia.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-white/50">
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
      <div className="relative flex min-h-screen items-center justify-center text-white/50">
        <Background />
        <span className="relative z-10">Carregando...</span>
      </div>
    )
  }

  if (!user) return <LoginForm />

  return (
    <div className="relative min-h-screen px-4 py-6">
      <Background />
      <div className="print:hidden relative z-10 mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${ICON_BASE}pizza.png`} alt="" className="h-7 w-7" />
            <h1 className="text-lg font-bold text-white">Biza Pizzas — Balcão</h1>
          </div>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/20"
          >
            Sair
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('pedidos')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              tab === 'pedidos' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Pedidos novos
          </button>
          <button
            type="button"
            onClick={() => setTab('historico')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              tab === 'historico' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Histórico
          </button>
        </div>

        {tab === 'pedidos' ? (
          orders.length === 0 ? (
            <p className="text-sm text-white/50">Nenhum pedido novo.</p>
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
