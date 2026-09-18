import { itemDescription, itemName, localizePrice, type MenuItem } from '../data/menu'
import { translations, type Lang } from '../utils/translations'
import { useCart } from '../context/CartContext'
import { AddButton } from './AddButton'

export function MenuItemRow({
  item,
  lang,
  priceLabel,
  note,
}: {
  item: MenuItem
  lang: Lang
  /** Rótulo de preço a ser usado ao adicionar ao carrinho (categoria ou override do item). */
  priceLabel?: string
  /** Contexto extra salvo no carrinho, ex: tamanho da pizza selecionado. */
  note?: string
}) {
  const { requestAdd } = useCart()
  const t = translations[lang].cart
  const descricao = itemDescription(item, lang)
  const nome = itemName(item, lang)
  const overrideLabel = item.precoOverride ? localizePrice(item.precoOverride, lang) : undefined
  // Overrides que começam com "+" são um adicional sobre o preço base (ex: pizzas), não um preço fechado.
  const isAdditive = overrideLabel?.trim().startsWith('+')
  const resolvedPrice = overrideLabel && !isAdditive ? overrideLabel : priceLabel
  const resolvedNote = isAdditive ? [note, overrideLabel].filter(Boolean).join(' · ') : note

  return (
    <div className="flex items-start gap-2.5 border-b border-white/10 py-2 last:border-0">
      <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1 text-[10px] font-bold text-white/70">
        {item.numero.toString().padStart(2, '0')}
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
      <AddButton
        label={t.add}
        onClick={() => requestAdd({ name: nome, note: resolvedNote, priceLabel: resolvedPrice })}
      />
    </div>
  )
}
