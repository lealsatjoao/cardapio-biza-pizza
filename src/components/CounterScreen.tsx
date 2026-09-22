import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../utils/firebase'
import { deleteOrder, watchOrders, type StoredOrder } from '../utils/ordersService'

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('pt-BR')
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-xs rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
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

function OrderCard({ order, onPrint }: { order: StoredOrder; onPrint: (order: StoredOrder) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10">
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
          <pre className="overflow-x-auto whitespace-pre rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-snug text-white/90">
            {order.receiptText}
          </pre>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onPrint(order)}
              className="flex-1 rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-400"
            >
              Imprimir
            </button>
            {confirmingRemove ? (
              <button
                type="button"
                onClick={() => deleteOrder(order.id)}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Confirmar remoção
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingRemove(true)}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:bg-white/20"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function CounterScreen() {
  const [user, setUser] = useState<User | null | 'loading'>('loading')
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [printText, setPrintText] = useState<string | null>(null)

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
    return <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white/50">Carregando...</div>
  }

  if (!user) return <LoginForm />

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6">
      <div className="print:hidden mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Pedidos — Balcão</h1>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/20"
          >
            Sair
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-white/50">Nenhum pedido ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onPrint={(o) => setPrintText(o.receiptText)} />
            ))}
          </div>
        )}
      </div>

      {printText !== null && (
        <pre className="hidden whitespace-pre font-mono text-xs print:block">{printText}</pre>
      )}
    </div>
  )
}
