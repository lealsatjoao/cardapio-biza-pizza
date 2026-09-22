// Número de "Controle" sequencial da notinha (1, 2, 3...), igual ao caixa físico da loja.
// Usa a Abacus (abacus.jasoncameron.dev), um contador gratuito e sem cadastro: cada chamada
// em /hit incrementa e devolve o próximo número — funciona como um contador compartilhado
// entre todos os clientes que fazem pedido pelo site (não daria pra ser sequencial de verdade
// sem isso, já que o site não tem servidor/banco de dados próprio).
const COUNTER_NAMESPACE = 'biza-pizzas-north-east-philadelphia'
// "-v2": os testes desse recurso (22/09/2026) já consumiram números tanto da chave antiga
// "controle-pedidos" quanto de "controle-pedidos-v1" (Abacus não tem endpoint de reset sem
// login). Confirmado via /get que "controle-pedidos-v2" nunca foi usada — a partir daqui, só
// pedidos reais devem chamar essa chave, pra manter Controle 1 = primeiro pedido real do site.
const COUNTER_KEY = 'controle-pedidos-v2'

export async function nextControleNumber(): Promise<number | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.value === 'number' ? data.value : null
  } catch {
    return null
  }
}
