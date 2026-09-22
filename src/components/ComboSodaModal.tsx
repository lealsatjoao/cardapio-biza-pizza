import { useState } from 'react'
import { localizePrice, refrigerantes, type ComboEsfiha } from '../data/menu'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'

export function ComboSodaModal({ combo, lang, onClose }: { combo: ComboEsfiha; lang: Lang; onClose: () => void }) {
  const { requestAdd } = useCart()
  const tc = translations[lang].comboSoda
  const [picks, setPicks] = useState<string[]>([])

  const sodaOptions = refrigerantes.find((r) => r.key === combo.sodaType)!.sabores.map((s) => s.nome)
  const comboName = lang === 'en' ? combo.nomeEn : combo.nome
  const comboSubtitle = lang === 'en' ? combo.subtituloEn : combo.subtitulo

  const title =
    combo.sodaQty <= 1
      ? tc.titleSingle
      : tc.titleMulti.replace('{n}', String(picks.length + 1)).replace('{total}', String(combo.sodaQty))

  const pick = (flavor: string) => {
    const next = [...picks, flavor]
    if (next.length >= combo.sodaQty) {
      const sodaLabel = lang === 'pt' ? (next.length > 1 ? 'Refrigerantes' : 'Refrigerante') : next.length > 1 ? 'Sodas' : 'Soda'
      const note = `${comboSubtitle} · ${sodaLabel}: ${next.join(', ')}`
      requestAdd({ name: comboName, note, priceLabel: localizePrice(combo.preco, lang) })
      onClose()
    } else {
      setPicks(next)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={tc.back}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-sm flex-col rounded-t-2xl bg-neutral-950 p-4 shadow-2xl ring-1 ring-white/10 sm:rounded-2xl animate-[slideUp_0.2s_ease-out]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{comboName}</p>
            <p className="text-base font-bold text-white">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tc.back}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sodaOptions.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => pick(flavor)}
              className="flex w-full items-center justify-between gap-2.5 border-b border-white/10 py-2.5 text-left last:border-0 hover:bg-white/5"
            >
              <span className="text-sm font-semibold text-white">{flavor}</span>
              <span className="rounded-full bg-green-600/80 px-2 py-0.5 text-[11px] font-bold text-white">
                {lang === 'pt' ? 'Grátis' : 'Free'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
