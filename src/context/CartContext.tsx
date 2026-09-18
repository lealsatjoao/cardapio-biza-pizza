import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AddCartInput, CartItem } from '../types/cart'
import { parsePriceLabel } from '../utils/price'

const STORAGE_KEY = 'biza-cart'

function lineKey(item: { name: string; note?: string; observation?: string; priceLabel?: string }) {
  return `${item.name}|${item.note ?? ''}|${item.observation ?? ''}|${item.priceLabel ?? ''}`
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface CartContextValue {
  items: CartItem[]
  removeItem: (id: string) => void
  changeQty: (id: string, delta: number) => void
  clear: () => void
  totalCount: number
  totalKnown: number
  hasUnknownPriceItems: boolean
  // Fluxo de adicionar: abre um modal para escolher quantidade/observação antes de confirmar.
  promptItem: AddCartInput | null
  requestAdd: (item: AddCartInput) => void
  confirmAdd: (qty: number, observation: string) => void
  cancelAdd: () => void
  // Feedback rápido (toast) após adicionar.
  toastMessage: string | null
  bumpTick: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart)
  const [promptItem, setPromptItem] = useState<AddCartInput | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [bumpTick, setBumpTick] = useState(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage indisponível (modo privado etc.) — carrinho segue funcionando em memória
    }
  }, [items])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
    setBumpTick((t) => t + 1)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMessage(null), 1800)
  }

  const requestAdd = (item: AddCartInput) => setPromptItem(item)
  const cancelAdd = () => setPromptItem(null)

  const confirmAdd = (qty: number, observation: string) => {
    if (!promptItem) return
    const trimmedObs = observation.trim() || undefined
    const input = { ...promptItem, observation: trimmedObs }
    const safeQty = Math.max(1, qty)

    setItems((prev) => {
      const key = lineKey(input)
      const existing = prev.find((it) => lineKey(it) === key)
      if (existing) {
        return prev.map((it) => (it.id === existing.id ? { ...it, qty: it.qty + safeQty } : it))
      }
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
      return [...prev, { ...input, id, qty: safeQty }]
    })

    setPromptItem(null)
    showToast(promptItem.name)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const changeQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: it.qty + delta } : it))
        .filter((it) => it.qty > 0),
    )
  }

  const clear = () => setItems([])

  const { totalCount, totalKnown, hasUnknownPriceItems } = useMemo(() => {
    let count = 0
    let known = 0
    let hasUnknown = false
    for (const it of items) {
      count += it.qty
      const unit = parsePriceLabel(it.priceLabel)
      if (unit === undefined) {
        hasUnknown = true
      } else {
        known += unit * it.qty
      }
    }
    return { totalCount: count, totalKnown: known, hasUnknownPriceItems: hasUnknown }
  }, [items])

  const value: CartContextValue = {
    items,
    removeItem,
    changeQty,
    clear,
    totalCount,
    totalKnown,
    hasUnknownPriceItems,
    promptItem,
    requestAdd,
    confirmAdd,
    cancelAdd,
    toastMessage,
    bumpTick,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return ctx
}
