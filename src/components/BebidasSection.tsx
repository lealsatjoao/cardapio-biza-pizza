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
import { translations, type Lang } from '../utils/translations'
import { SectionCard } from './SectionCard'
import { Tabs } from './Tabs'

function flavorName(name: string) {
  // Nomes de marca (Coca-Cola, Fanta, Sprite, Pepsi, Guaraná...) permanecem iguais em PT e EN.
  return name
}

function bebidaNome(item: Bebida, lang: Lang) {
  return lang === 'en' && item.nomeEn ? item.nomeEn : item.nome
}

function FlavorPills({ flavors }: { flavors: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {flavors.map((f) => (
        <span key={f} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
          {flavorName(f)}
        </span>
      ))}
    </div>
  )
}

export function BebidasSection({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const [sub, setSub] = useState('refrigerantes')

  const SUBTABS = [
    { id: 'refrigerantes', label: t.subtabs.refrigerantes },
    { id: 'sucos', label: t.subtabs.sucos },
    { id: 'agua', label: t.subtabs.agua },
  ]

  const soda2L = refrigerantes.find((r) => r.key === '2l')!
  const soda600 = refrigerantes.find((r) => r.key === '600ml')!
  const sodaLata = refrigerantes.find((r) => r.key === 'lata')!

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
                <FlavorPills flavors={soda2L.sabores} />
              </div>
              {soda2L.saboresZero && (
                <div>
                  <p className="mb-1.5 mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    {t.bebidas.zeroSugar}
                  </p>
                  <FlavorPills flavors={soda2L.saboresZero} />
                </div>
              )}
            </div>

            {soda2L.excecoes && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-3">
                {soda2L.excecoes.map((ex) => (
                  <div key={ex.nome} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{flavorName(ex.nome)}</span>
                    <span className="whitespace-nowrap rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white">
                      {localizePrice(ex.preco, lang)}
                    </span>
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
            <FlavorPills flavors={soda600.sabores} />
          </SectionCard>

          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/15 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-orange-400">{t.bebidas.sodaCan}</h3>
              <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
                {localizePrice(sodaLata.preco, lang)}
              </span>
            </div>
            <FlavorPills flavors={sodaLata.sabores} />

            {sodaLata.excecoes && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-3">
                {sodaLata.excecoes.map((ex) => (
                  <div key={ex.nome} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{flavorName(ex.nome)}</span>
                    <span className="whitespace-nowrap rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white">
                      {localizePrice(ex.preco, lang)}
                    </span>
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
                <div key={item.nome} className="flex items-center border-b border-white/10 py-2 last:border-0">
                  <p className="text-sm font-semibold text-white">{bebidaNome(item, lang)}</p>
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
                <div key={item.nome} className="flex items-center border-b border-white/10 py-2 last:border-0">
                  <p className="text-sm font-semibold text-white">{bebidaNome(item, lang)}</p>
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
            <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
              {localizePrice(aguaMineral.preco!, lang)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 py-2">
            <p className="text-sm font-semibold text-white">{bebidaNome(aguaComGas, lang)}</p>
            <span className="whitespace-nowrap rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-bold text-white">
              {localizePrice(aguaComGas.preco!, lang)}
            </span>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
