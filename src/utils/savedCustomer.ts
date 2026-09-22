import type { AddressSuggestion, DeliveryQuote } from './delivery'
import type { PhoneCountry } from './phone'

// Guarda os dados do cliente (nome, telefone, endereço) no navegador dele — preenche sozinho
// e na hora, sem esperar rede, da próxima vez que ele pedir pelo mesmo aparelho. Ver também
// customersService.ts, que guarda a mesma info no Firebase pra funcionar em qualquer aparelho.
const STORAGE_KEY = 'biza-customer-info'

export interface SavedCustomerInfo {
  name?: string
  phone?: string
  /** País do telefone (EUA/Brasil) — usado pra montar o número completo (+1/+55) de novo. */
  phoneCountry?: PhoneCountry
  zip?: string
  address?: string
  aptUnit?: string
  // Endereço geocodificado + taxa calculada da última entrega — reaproveitados no mesmo
  // endereço pra não gastar consulta na API de novo (distância não muda pro mesmo lugar).
  lastSuggestion?: AddressSuggestion
  lastQuote?: DeliveryQuote
}

export function loadSavedCustomer(): SavedCustomerInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

export function saveCustomer(info: SavedCustomerInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
  } catch {
    // localStorage indisponível (modo privado etc.) — segue sem salvar
  }
}
