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

// Só PA/NJ importam aqui (área de entrega) — evita nome de estado por extenso repetido
// junto com bairro/cidade no endereço curto.
const STATE_ABBR: Record<string, string> = {
  Pennsylvania: 'PA',
  'New Jersey': 'NJ',
}

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
  /** Bairro e cidade/estado de entrega — usados na notinha do WhatsApp (linha embaixo do endereço). */
  neighbourhood?: string
  cityLabel?: string
  /** ZIP code do endereço escolhido — preenche o campo de ZIP sozinho se a pessoa não digitou. */
  postcode?: string
}

// URL de um mapinha estático com um pin no endereço escolhido — mostra visualmente pra pessoa
// confirmar que é o lugar certo antes de finalizar o pedido.
export function staticMapUrl(coords: [number, number], widthPx = 500, heightPx = 220): string | null {
  if (!LOCATIONIQ_API_KEY) return null
  const [lon, lat] = coords
  return `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${lat},${lon}&zoom=16&size=${widthPx}x${heightPx}&format=png&markers=icon:large-red-cutout|${lat},${lon}`
}

export type AddressSearchResult =
  | { status: 'ok'; suggestions: AddressSuggestion[] }
  | { status: 'unavailable' }

// Extrai o número inicial que a pessoa digitou (ex: "229" em "229 Mecray Ln") — usado pra
// não "sumir" o número da casa quando o resultado só tem a rua (sem house_number no mapa).
function extractLeadingNumber(text: string): string | null {
  const match = text.trim().match(/^(\d+[a-zA-Z]?)\b/)
  return match ? match[1] : null
}

// Busca sugestões de endereço conforme a pessoa digita (autocompletar, igual ao Google).
// viewbox+bounded=1 restringe a busca a uma caixa perto da pizzaria — sem isso, "123 Main St"
// pode trazer resultados de qualquer estado dos EUA na frente do endereço local que a pessoa quer.
// Aceita resultados com número de casa (house_number) OU, quando não tem (comum em ruas
// residenciais de NJ com menos detalhe no mapa), um resultado preciso de rua (class=highway
// com endereço.road) — evita cair num ponto central de cidade/bairro/condado, que daria uma
// distância errada sem avisar o cliente.
export async function searchAddressSuggestions(text: string): Promise<AddressSearchResult> {
  if (!LOCATIONIQ_API_KEY) return { status: 'unavailable' }
  if (text.trim().length < 4) return { status: 'ok', suggestions: [] }

  try {
    const { left, top, right, bottom } = SEARCH_BOX
    const res = await fetch(
      `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(text)}&countrycodes=us&limit=6&viewbox=${left},${top},${right},${bottom}&bounded=1&format=json`,
    )
    // 404 "Unable to geocode" é a API dizendo "não achei nada pra esse texto exato" — não é
    // fora do ar. Só trata como indisponível erros de verdade (cota/limite, servidor caiu etc).
    if (res.status === 404) return { status: 'ok', suggestions: [] }
    if (!res.ok) return { status: 'unavailable' }
    const data = await res.json()
    if (!Array.isArray(data)) return { status: 'ok', suggestions: [] }

    const leadingNumber = extractLeadingNumber(text)

    const suggestions = data
      .filter((f: any) => f.address?.house_number || (f.class === 'highway' && (f.address?.road || f.address?.name)))
      .map((f: any) => {
        // Sem house_number no mapa (comum em ruas de NJ) — mantém o número que a pessoa
        // digitou na frente do nome, pra não sumir com ele na tela.
        const houseNumber = f.address?.house_number as string | undefined
        const road = (f.address?.road ?? f.address?.name) as string | undefined
        const streetPart = road ? `${houseNumber ?? leadingNumber ?? ''} ${road}`.trim() : (f.display_name as string)
        const isNewJersey = f.address?.state === 'New Jersey'
        const cityForLabel: string | undefined = f.address?.city || f.address?.town || f.address?.village
        const neighbourhood: string | undefined =
          f.address?.neighbourhood || f.address?.suburb || f.address?.quarter || f.address?.city_district
        const cityLabel: string | undefined = isNewJersey ? 'New Jersey' : cityForLabel
        const stateAbbr = STATE_ABBR[f.address?.state as string] ?? (f.address?.state as string | undefined)
        const postcode = f.address?.postcode as string | undefined
        // Endereço curto pra mostrar na tela e imprimir na notinha — só rua/número, bairro,
        // cidade e estado+CEP, sem repetir "Philadelphia" três vezes nem mostrar país/condado
        // (o display_name completo da API vem bem verboso).
        const cityStateZip = [cityForLabel, [stateAbbr, postcode].filter(Boolean).join(' ')].filter(Boolean).join(', ')
        const label = [streetPart, neighbourhood && neighbourhood !== cityForLabel ? neighbourhood : undefined, cityStateZip]
          .filter(Boolean)
          .join(', ')
        return {
          label: label || (f.display_name as string),
          coords: [Number(f.lon), Number(f.lat)] as [number, number],
          isNewJersey,
          neighbourhood,
          cityLabel,
          postcode,
        }
      })
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
  neighbourhood?: string
  cityLabel?: string
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
      quote: {
        address: suggestion.label,
        distanceMi,
        isNewJersey: suggestion.isNewJersey,
        fee,
        neighbourhood: suggestion.neighbourhood,
        cityLabel: suggestion.cityLabel,
      },
    }
  } catch {
    return { status: 'error' }
  }
}
