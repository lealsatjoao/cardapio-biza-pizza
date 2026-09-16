import type { MenuItem } from '../data/menu'

export function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start gap-2.5 border-b border-white/10 py-2 last:border-0">
      <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1 text-[10px] font-bold text-white/70">
        {item.numero.toString().padStart(2, '0')}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{item.nome}</p>
        {item.descricao && <p className="mt-0.5 text-xs leading-snug text-white/60">{item.descricao}</p>}
      </div>
      {item.precoOverride && (
        <span className="whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-orange-300">
          {item.precoOverride}
        </span>
      )}
    </div>
  )
}
