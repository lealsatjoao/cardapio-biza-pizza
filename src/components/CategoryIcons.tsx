// 1. Legítimo Pastel de Feira Brasileiro (com marcas de garfo e bolhinhas crocantes)
export const PastelIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Prato de fundo sutil */}
    <circle cx="32" cy="32" r="28" fill="#FFFFFF" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 3" />
    {/* Pastel retangular dourado */}
    <rect x="14" y="10" width="28" height="44" rx="3" fill="#FBBF24" stroke="#D97706" strokeWidth="2" transform="rotate(-12 28 32)" />
    {/* Borda marcada no garfo */}
    <rect x="16" y="12" width="24" height="40" rx="1" fill="none" stroke="#B45309" strokeWidth="1.5" strokeDasharray="2 3" transform="rotate(-12 28 32)" />
    {/* Bolhas crocantes de fritura */}
    <circle cx="26" cy="24" r="3" fill="#F59E0B" />
    <circle cx="32" cy="36" r="4" fill="#F59E0B" />
    <circle cx="25" cy="42" r="2" fill="#F59E0B" />
  </svg>
)

// 2. Esfiha Aberta Redondinha Tradicional (Borda alta dourada e carne moída com tomate no centro)
export const EsfihaIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Borda de massa alta e dourada */}
    <circle cx="32" cy="32" r="26" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    {/* Centro rebaixado */}
    <circle cx="32" cy="32" r="19" fill="#78350F" stroke="#92400E" strokeWidth="1.5" />
    {/* Textura de carne moída temperada */}
    <circle cx="27" cy="28" r="3" fill="#5A2609" />
    <circle cx="35" cy="27" r="3.5" fill="#451A03" />
    <circle cx="33" cy="36" r="3" fill="#5A2609" />
    <circle cx="26" cy="36" r="2.5" fill="#451A03" />
    {/* Pedaços de tomate picado */}
    <rect x="30" y="29" width="3.5" height="3.5" rx="1" fill="#EF4444" />
    <rect x="23" y="31" width="3" height="3" rx="1" fill="#EF4444" />
    <rect x="35" y="33" width="3" height="3" rx="1" fill="#EF4444" />
    {/* Cheiro verde / tempero */}
    <circle cx="29" cy="24" r="1.5" fill="#22C55E" />
    <circle cx="36" cy="38" r="1.5" fill="#22C55E" />
  </svg>
)

// 3. Porções / Petiscos (Cestinha com batatas fritas servidas no papel)
export const PorcaoIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Palitos de Batata Frita Dourados */}
    <rect x="20" y="10" width="5" height="24" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" transform="rotate(-15 22 22)" />
    <rect x="26" y="8" width="5" height="26" rx="1.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" transform="rotate(-5 28 21)" />
    <rect x="33" y="7" width="5" height="27" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" transform="rotate(6 35 20)" />
    <rect x="40" y="11" width="5" height="23" rx="1.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" transform="rotate(18 42 22)" />
    {/* Papel da porção */}
    <path d="M10 26 L22 34 L42 34 L54 26 Z" fill="#F8FAFC" fillOpacity="0.8" stroke="#94A3B8" strokeWidth="1" />
    {/* Travessa / Cestinha de servir */}
    <path d="M12 32 C12 46 20 52 32 52 C44 52 52 46 52 32 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
    {/* Detalhe da tigela */}
    <path d="M16 36 Q32 42 48 36" stroke="#FB923C" strokeWidth="1.5" fill="none" />
  </svg>
)

// 4. Pizza Suculenta (Fatia puxando queijo no estilo Biza)
export const PizzaIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Fatia de pizza */}
    <path d="M32 52 L12 18 C22 14 42 14 52 18 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    {/* Borda recheada grossa */}
    <path d="M11 18 C22 13 42 13 53 18" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
    {/* Queijo derretido */}
    <path d="M16 22 Q32 26 48 22 L32 50 Z" fill="#FEF08A" />
    {/* Rodelas de Pepperoni / Calabresa */}
    <circle cx="28" cy="27" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
    <circle cx="38" cy="31" r="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
    <circle cx="31" cy="40" r="3.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
  </svg>
)
