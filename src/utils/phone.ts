// A pessoa digita só o DDD/área + número (sem código de país) e escolhe o país num botão —
// aqui a gente monta o telefone completo, usado pra gravar o pedido e pro link do WhatsApp.
// A busca de cadastro salvo continua sendo só pelo número local (ver customersService.ts),
// então funciona igual pros dois países.
export type PhoneCountry = 'US' | 'BR'

const COUNTRY_CODES: Record<PhoneCountry, string> = { US: '1', BR: '55' }

export function fullPhoneDigits(country: PhoneCountry, typedDigits: string): string {
  return `${COUNTRY_CODES[country]}${typedDigits.replace(/\D/g, '')}`
}

// Só pra mostrar/imprimir, com o "+" na frente do código do país.
export function formatPhoneDisplay(country: PhoneCountry, typedDigits: string): string {
  return `+${COUNTRY_CODES[country]} ${typedDigits.replace(/\D/g, '')}`
}
