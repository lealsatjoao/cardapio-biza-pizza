import { useState } from 'react'
import {
  aguaComGas,
  aguaMineral,
  localizePrice,
  refrigerantes,
  sucoNaturalPreco,
  sucosCaixa,
  sucosNaturais,
  type Bebida,
  type Sabor,
} from '../data/menu'
import { useCart } from '../context/CartContext'
import { translations, type Lang } from '../utils/translations'
import { AddButton } from './AddButton'
import { SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

function flavorName(name: string) {
  // Nomes de marca (Coca-Cola, Fanta, Sprite, Pepsi, Guaraná...) permanecem iguais em PT e EN.
  return name
}

function bebidaNome(item: Bebida, lang: Lang) {
  return lang === 'en' && item.nomeEn ? item.nomeEn : item.nome
}

function FlavorList({
  flavors,
  basePrice,
  lang,
  onAdd,
}: {
  flavors: Sabor[]
  basePrice: string
  lang: Lang
  onAdd: (flavor: string, priceLabel: string) => void
}) {
  const t = translations[lang].cart
  return (
    <div>
      {flavors.map((f) => {
        const priceLabel = localizePrice(f.preco ?? basePrice, lang)
        return (
          <div key={f.nome} className="flex items-center justify-between gap-3 border-b border-white/10 py-2 last:border-0">
            <p className="text-sm font-semibold text-white">{flavorName(f.nome)}</p>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-orange-300">
                {priceLabel}
              </span>
              <AddButton label={t.add} onClick={() => onAdd(f.nome, priceLabel)} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function BebidasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const { requestAdd } = useCart()
  const [sub, setSub] = useState('refrigerantes')

  const SUBTABS = [
    { id: 'refrigerantes', label: t.subtabs.refrigerantes },
    { id: 'sucos', label: t.subtabs.sucos },
    { id: 'agua', label: t.subtabs.agua },
  ]

  const soda2L = refrigerantes.find((r) => r.key === '2l')!
  const soda600 = refrigerantes.find((r) => r.key === '600ml')!
  const sodaLata = refrigerantes.find((r) => r.key === 'lata')!

  const addSoda = (flavor: string, sizeLabel: string, priceLabel: string) => {
    requestAdd({ name: flavor, note: sizeLabel, priceLabel })
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs options={SUBTABS} active={sub} onChange={setSub} variant="secondary" />

      {sub === 'refrigerantes' && (
        <>
          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.soda2L}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(soda2L.preco, lang)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                  {t.subtabs.tradicionais}
                </p>
                <FlavorList
                  flavors={soda2L.sabores}
                  basePrice={soda2L.preco}
                  lang={lang}
                  onAdd={(f, priceLabel) => addSoda(f, t.bebidas.soda2L, priceLabel)}
                />
              </div>
              {soda2L.saboresZero && (
                <div>
                  <p className="mb-1.5 mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    {t.bebidas.zeroSugar}
                  </p>
                  <FlavorList
                    flavors={soda2L.saboresZero}
                    basePrice={soda2L.preco}
                    lang={lang}
                    onAdd={(f, priceLabel) => addSoda(f, t.bebidas.soda2L, priceLabel)}
                  />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.soda600}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(soda600.preco, lang)}
              </span>
            </div>
            <FlavorList
              flavors={soda600.sabores}
              basePrice={soda600.preco}
              lang={lang}
              onAdd={(f, priceLabel) => addSoda(f, t.bebidas.soda600, priceLabel)}
            />
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.sodaCan}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(sodaLata.preco, lang)}
              </span>
            </div>
            <FlavorList
              flavors={sodaLata.sabores}
              basePrice={sodaLata.preco}
              lang={lang}
              onAdd={(f, priceLabel) => addSoda(f, t.bebidas.sodaCan, priceLabel)}
            />
          </SectionCard>
        </>
      )}

      {sub === 'sucos' && (
        <>
          <SectionCard>
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.juiceNatural}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(sucoNaturalPreco, lang)}
              </span>
            </div>
            <p className="mb-3 text-xs text-white/60">{t.bebidas.juiceNaturalNotice}</p>
            <div>
              {sucosNaturais.map((item) => (
                <div key={item.nome} className="flex items-center justify-between border-b border-white/10 py-2 last:border-0">
                  <p className="text-sm font-semibold text-white">{bebidaNome(item, lang)}</p>
                  <AddButton
                    label={t.cart.add}
                    onClick={() =>
                      requestAdd({
                        name: bebidaNome(item, lang),
                        note: t.bebidas.juiceNatural,
                        priceLabel: localizePrice(sucoNaturalPreco, lang),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <h3 className="mb-3 border-b border-white/15 pb-2 text-sm font-bold uppercase tracking-wide text-orange-400">
              {t.bebidas.juiceCarton}
            </h3>
            <div>
              {sucosCaixa.map((item) => (
                <div key={item.nome} className="flex items-center justify-between border-b border-white/10 py-2 last:border-0">
                  <p className="text-sm font-semibold text-white">{bebidaNome(item, lang)}</p>
                  <AddButton
                    label={t.cart.add}
                    onClick={() => requestAdd({ name: bebidaNome(item, lang), note: t.bebidas.juiceCarton })}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {sub === 'agua' && (
        <SectionCard>
          <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2">
            <p className="text-sm font-semibold text-white">{bebidaNome(aguaMineral, lang)}</p>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(aguaMineral.preco!, lang)}
              </span>
              <AddButton
                label={t.cart.add}
                onClick={() =>
                  requestAdd({ name: bebidaNome(aguaMineral, lang), priceLabel: localizePrice(aguaMineral.preco!, lang) })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 py-2">
            <p className="text-sm font-semibold text-white">{bebidaNome(aguaComGas, lang)}</p>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(aguaComGas.preco!, lang)}
              </span>
              <AddButton
                label={t.cart.add}
                onClick={() =>
                  requestAdd({ name: bebidaNome(aguaComGas, lang), priceLabel: localizePrice(aguaComGas.preco!, lang) })
                }
              />
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
