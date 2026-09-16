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
    <div className="rounded-xl bg-orange-500/15 p-3 text-xs leading-relaxed text-orange-100 ring-1 ring-orange-400/30">
      {children}
    </div>
  )
}
