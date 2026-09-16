import type { ReactNode } from 'react'

export function SectionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-black/45 p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}

export function GroupTitle({ children, price }: { children: ReactNode; price?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
      <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{children}</h3>
      {price && (
        <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
          {price}
        </span>
      )}
    </div>
  )
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 rounded-lg border border-amber-600/40 bg-amber-950/50 px-3 py-2 text-center text-xs text-amber-200/90 shadow-sm backdrop-blur-sm">
      {children}
    </div>
  )
}
