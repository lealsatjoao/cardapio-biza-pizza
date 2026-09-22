// Guarda os dados do cliente (nome, telefone, endereço) só no navegador dele — preenche
// sozinho da próxima vez que ele pedir pelo mesmo aparelho. Não sai do celular da pessoa,
// então não tem risco de outro cliente ver esse dado (diferente de um banco compartilhado
// buscado por telefone, que o João decidiu não usar por causa da privacidade).
const STORAGE_KEY = 'biza-customer-info'

export interface SavedCustomerInfo {
  name?: string
  phone?: string
  zip?: string
  address?: string
  aptUnit?: string
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
