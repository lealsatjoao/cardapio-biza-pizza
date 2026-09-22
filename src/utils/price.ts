// Extrai o valor numérico de rótulos como "$32,00 +Tax" ou "+$1,00 por fatia".
// Retorna undefined quando o rótulo não representa um preço fechado (ex: "sob consulta").
export function parsePriceLabel(label?: string): number | undefined {
  if (!label) return undefined
  const match = label.match(/\$\s*([\d.]+),(\d{2})/)
  if (!match) return undefined
  const intPart = match[1].replace(/\./g, '')
  const cents = match[2]
  const value = Number(`${intPart}.${cents}`)
  return Number.isFinite(value) ? value : undefined
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2).replace('.', ',')}`
}
