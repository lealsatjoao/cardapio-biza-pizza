// Calcula a taxa de entrega com base na distância de carro até o endereço do cliente,
// usando a Autocomplete API + Matrix API da LocationIQ (locationiq.com).

const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY as string | undefined

// 6339 Rising Sun Ave, Philadelphia, PA 19111 (fixo — evita geocodificar a origem a cada cálculo)
const PIZZERIA_COORDS: [number, number] = [-75.0957232, 40.0491468]

// Caixa de ~35 milhas ao redor da pizzaria — mantém a busca de endereço local (evita
// resultados de outros estados) sem cortar nenhum endereço dentro do raio de entrega (15mi).
const SEARCH_BOX = {
  left: PIZZERIA_COORDS[0] - 0.5,
  top: PIZZERIA_COORDS[1] + 0.5,
  right: PIZZERIA_COORDS[0] + 0.5,
  bottom: PIZZERIA_COORDS[1] - 0.5,
}

const METERS_PER_MILE = 1609.344

const NJ_TOLL_FEE = 4
const MAX_DELIVERY_MILES = 15

// Faixas de distância -> taxa. Acima de 8mi soma $1 por milha inteira excedente (ver feeForDistance).
const FEE_TIERS: { maxMi: number; fee: number }[] = [
  { maxMi: 1.3, fee: 0 },
  { maxMi: 2, fee: 4 },
  { maxMi: 3, fee: 5 },
  { maxMi: 4, fee: 6 },
  { maxMi: 5, fee: 7 },
  { maxMi: 6, fee: 8 },
  { maxMi: 7, fee: 10 },
  { maxMi: 8, fee: 12 },
]

function feeForDistance(distanceMi: number): number | undefined {
  if (distanceMi > MAX_DELIVERY_MILES) return undefined
  const tier = FEE_TIERS.find((t) => distanceMi <= t.maxMi)
  if (tier) return tier.fee
  const extraMiles = Math.ceil(distanceMi - 8)
  return 12 + extraMiles
}

export interface AddressSuggestion {
  label: string
  coords: [number, number]
  isNewJersey: boolean
}

export type AddressSearchResult =
  | { status: 'ok'; suggestions: AddressSuggestion[] }
  | { status: 'unavailable' }

// Busca sugestões de endereço conforme a pessoa digita (autocompletar, igual ao Google).
// viewbox+bounded=1 restringe a busca a uma caixa perto da pizzaria — sem isso, "123 Main St"
// pode trazer resultados de qualquer estado dos EUA na frente do endereço local que a pessoa quer.
// Só aceita resultados com número de casa (house_number) — evita cair num ponto central de
// cidade/bairro, que daria uma distância errada sem avisar o cliente.
export async function searchAddressSuggestions(text: string): Promise<AddressSearchResult> {
  if (!LOCATIONIQ_API_KEY) return { status: 'unavailable' }
  if (text.trim().length < 4) return { status: 'ok', suggestions: [] }

  try {
    const { left, top, right, bottom } = SEARCH_BOX
    const res = await fetch(
      `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(text)}&countrycodes=us&limit=6&viewbox=${left},${top},${right},${bottom}&bounded=1&format=json`,
    )
    if (!res.ok) return { status: 'unavailable' }
    const data = await res.json()
    if (!Array.isArray(data)) return { status: 'ok', suggestions: [] }

    const suggestions = data
      .filter((f: any) => f.address?.house_number)
      .map((f: any) => ({
        label: f.display_name as string,
        coords: [Number(f.lon), Number(f.lat)] as [number, number],
        isNewJersey: f.address?.state === 'New Jersey',
      }))
    return { status: 'ok', suggestions }
  } catch {
    return { status: 'unavailable' }
  }
}

export interface DeliveryQuote {
  address: string
  distanceMi: number
  isNewJersey: boolean
  fee: number
}

export type DeliveryResult =
  | { status: 'ok'; quote: DeliveryQuote }
  | { status: 'out_of_range' }
  | { status: 'error' }
  | { status: 'not_configured' }

// Calcula a taxa a partir de um endereço já escolhido na lista de sugestões (coordenadas conhecidas).
export async function calculateDeliveryFee(suggestion: AddressSuggestion): Promise<DeliveryResult> {
  if (!LOCATIONIQ_API_KEY) return { status: 'not_configured' }

  try {
    const [originLon, originLat] = PIZZERIA_COORDS
    const [destLon, destLat] = suggestion.coords
    const res = await fetch(
      `https://us1.locationiq.com/v1/matrix/driving/${originLon},${originLat};${destLon},${destLat}?key=${LOCATIONIQ_API_KEY}&annotations=distance`,
    )
    if (!res.ok) return { status: 'error' }
    const data = await res.json()
    const distanceMeters: number | undefined = data.distances?.[0]?.[1]
    if (distanceMeters == null) return { status: 'error' }
    const distanceMi = distanceMeters / METERS_PER_MILE

    const baseFee = feeForDistance(distanceMi)
    if (baseFee === undefined) return { status: 'out_of_range' }

    const fee = baseFee + (suggestion.isNewJersey ? NJ_TOLL_FEE : 0)

    return {
      status: 'ok',
      quote: { address: suggestion.label, distanceMi, isNewJersey: suggestion.isNewJersey, fee },
    }
  } catch {
    return { status: 'error' }
  }
}
