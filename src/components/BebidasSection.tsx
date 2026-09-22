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

function FlavorPills({
  flavors,
  onAdd,
}: {
  flavors: string[]
  onAdd: (flavor: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {flavors.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onAdd(f)}
          className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 pl-2.5 pr-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
        >
          {flavorName(f)}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500/90 text-[11px] font-bold leading-none text-white">
            +
          </span>
        </button>
      ))}
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
                <FlavorPills
                  flavors={soda2L.sabores}
                  onAdd={(f) => addSoda(f, t.bebidas.soda2L, localizePrice(soda2L.preco, lang))}
                />
              </div>
              {soda2L.saboresZero && (
                <div>
                  <p className="mb-1.5 mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    {t.bebidas.zeroSugar}
                  </p>
                  <FlavorPills
                    flavors={soda2L.saboresZero}
                    onAdd={(f) => addSoda(f, t.bebidas.soda2L, localizePrice(soda2L.preco, lang))}
                  />
                </div>
              )}
            </div>

            {soda2L.excecoes && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-3">
                {soda2L.excecoes.map((ex) => (
                  <div key={ex.nome} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{flavorName(ex.nome)}</span>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white">
                        {localizePrice(ex.preco, lang)}
                      </span>
                      <AddButton
                        label={t.cart.add}
                        onClick={() => addSoda(ex.nome, t.bebidas.soda2L, localizePrice(ex.preco, lang))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.soda600}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(soda600.preco, lang)}
              </span>
            </div>
            <FlavorPills
              flavors={soda600.sabores}
              onAdd={(f) => addSoda(f, t.bebidas.soda600, localizePrice(soda600.preco, lang))}
            />
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.sodaCan}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(sodaLata.preco, lang)}
              </span>
            </div>
            <FlavorPills
              flavors={sodaLata.sabores}
              onAdd={(f) => addSoda(f, t.bebidas.sodaCan, localizePrice(sodaLata.preco, lang))}
            />

            {sodaLata.excecoes && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-3">
                {sodaLata.excecoes.map((ex) => (
                  <div key={ex.nome} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{flavorName(ex.nome)}</span>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white">
                        {localizePrice(ex.preco, lang)}
                      </span>
                      <AddButton
                        label={t.cart.add}
                        onClick={() => addSoda(ex.nome, t.bebidas.sodaCan, localizePrice(ex.preco, lang))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
