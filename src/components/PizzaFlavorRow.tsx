import { itemDescription, itemName, localizePrice, type MenuItem } from '../data/menu'
import type { Lang } from '../utils/translations'

export function PizzaFlavorRow({
  item,
  lang,
  selected,
  disabled,
  onToggle,
}: {
  item: MenuItem
  lang: Lang
  selected: boolean
  /** true quando o limite de sabores do tamanho já foi atingido e este não está selecionado */
  disabled: boolean
  onToggle: () => void
}) {
  const nome = itemName(item, lang)
  const descricao = itemDescription(item, lang)

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={[
        'flex w-full items-start gap-2.5 border-b border-white/10 py-2 text-left last:border-0 transition-colors',
        disabled ? 'opacity-40' : '',
      ].join(' ')}
    >
      <span
        className={[
          'mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold',
          selected ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70',
        ].join(' ')}
      >
        {selected ? '✓' : item.numero.toString().padStart(2, '0')}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{nome}</p>
        {descricao && <p className="mt-0.5 text-xs leading-snug text-white/60">{descricao}</p>}
      </div>
      {item.precoOverride && (
        <span className="whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-orange-300">
          {localizePrice(item.precoOverride, lang)}
        </span>
      )}
    </button>
  )
}
