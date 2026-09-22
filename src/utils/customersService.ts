import { get, ref, set } from 'firebase/database'
import { db } from './firebase'
import type { SavedCustomerInfo } from './savedCustomer'

// Guarda o mesmo dado do cliente (nome, endereço, ZIP...) no Firebase, buscável pelo telefone —
// funciona em qualquer aparelho, não só no que a pessoa usou da última vez. Decisão do João
// (22/09/2026): ele sabe que qualquer pessoa que souber o telefone de um cliente consegue ver
// o endereço dele digitando esse telefone no site, e topou esse risco pra ganhar a comodidade.
// Ver Regras do Realtime Database: nó "customers" com leitura e gravação abertas de propósito.
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export async function saveCustomerRecord(phone: string, info: SavedCustomerInfo): Promise<void> {
  const digits = normalizePhone(phone)
  if (digits.length < 10) return
  // O Firebase recusa gravar (lança erro) se o objeto tiver algum campo "undefined" (ex:
  // endereço vazio numa retirada) — precisa tirar esses campos antes, senão o set() falha
  // silenciosamente (o catch engole o erro) e nada é salvo.
  const clean = Object.fromEntries(Object.entries(info).filter(([, value]) => value !== undefined))
  try {
    await set(ref(db, `customers/${digits}`), clean)
  } catch {
    // Sem internet ou Firebase fora do ar — segue sem salvar, não trava o pedido.
  }
}

export async function lookupCustomerRecord(phone: string): Promise<SavedCustomerInfo | null> {
  const digits = normalizePhone(phone)
  if (digits.length < 10) return null
  try {
    const snapshot = await get(ref(db, `customers/${digits}`))
    return snapshot.exists() ? (snapshot.val() as SavedCustomerInfo) : null
  } catch {
    return null
  }
}
