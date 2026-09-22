// Calcula a taxa de entrega com base na distância de carro até o endereço do cliente,
// usando a Geocoding Autocomplete API + Matrix API da OpenRouteService (openrouteservice.org).

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY as string | undefined

// 6339 Rising Sun Ave, Philadelphia, PA 19111 (fixo — evita geocodificar a origem a cada cálculo)
const PIZZERIA_COORDS: [number, number] = [-75.0957232, 40.0491468]

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

// Camadas de geocodificação precisas o suficiente pra confiar na distância calculada.
// Endereços que só batem no nível de cidade/bairro (ex: "Philadelphia") caem num ponto central
// da cidade, o que daria uma distância errada sem avisar o cliente — por isso são filtrados aqui.
const ACCEPTABLE_LAYERS = new Set(['address', 'venue', 'street'])

export interface AddressSuggestion {
  label: string
  coords: [number, number]
  isNewJersey: boolean
}

// Busca sugestões de endereço conforme a pessoa digita (autocompletar, igual ao Google).
export async function searchAddressSuggestions(text: string): Promise<AddressSuggestion[]> {
  if (!ORS_API_KEY || text.trim().length < 4) return []

  try {
    const res = await fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(text)}&boundary.country=US&size=6`,
    )
    if (!res.ok) return []
    const data = await res.json()
    const features: any[] = data.features ?? []

    return features
      .filter((f) => ACCEPTABLE_LAYERS.has(f.properties?.layer))
      .map((f) => ({
        label: f.properties.label as string,
        coords: f.geometry.coordinates as [number, number],
        isNewJersey: f.properties?.region_a === 'NJ',
      }))
  } catch {
    return []
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
  if (!ORS_API_KEY) return { status: 'not_configured' }

  try {
    const matrixRes = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
      method: 'POST',
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: [PIZZERIA_COORDS, suggestion.coords],
        metrics: ['distance'],
        units: 'mi',
      }),
    })
    if (!matrixRes.ok) return { status: 'error' }
    const matrixData = await matrixRes.json()
    const distanceMi: number | undefined = matrixData.distances?.[0]?.[1]
    if (distanceMi == null) return { status: 'error' }

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
