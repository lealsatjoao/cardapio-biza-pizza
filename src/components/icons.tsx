interface IconProps {
  className?: string
}

export function PastelIcon({ className = 'h-6 w-auto' }: IconProps) {
  return (
    <svg viewBox="0 0 44 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="38" height="16" rx="8" fill="#EFB755" stroke="#A6691E" strokeWidth="1.5" />
      <rect
        x="6.5"
        y="7"
        width="31"
        height="10"
        rx="5"
        fill="none"
        stroke="#A6691E"
        strokeWidth="1"
        strokeDasharray="2 2.2"
        opacity="0.7"
      />
    </svg>
  )
}

export function EsfihaIcon({ className = 'h-6 w-auto' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" fill="#EFB755" stroke="#A6691E" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="8.5" fill="#8B3A2B" />
      <g fill="#6E2B1F">
        <circle cx="13" cy="14" r="1" />
        <circle cx="18.5" cy="13" r="1" />
        <circle cx="15" cy="18.5" r="1" />
        <circle cx="19" cy="18" r="1" />
        <circle cx="12.5" cy="18.5" r="1" />
      </g>
    </svg>
  )
}

export function PorcaoIcon({ className = 'h-6 w-auto' }: IconProps) {
  return (
    <svg viewBox="0 0 36 26" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="18" cy="19.5" rx="15" ry="5" fill="#F5F1E8" stroke="#CFC7B2" strokeWidth="1" />
      <g fill="#D6902F" stroke="#96601B" strokeWidth="0.75">
        <ellipse cx="12" cy="13" rx="5" ry="4" />
        <ellipse cx="20.5" cy="10.5" rx="5.5" ry="4.5" />
        <ellipse cx="25.5" cy="15" rx="4.5" ry="3.5" />
      </g>
      <g fill="#96601B" opacity="0.55">
        <circle cx="10.5" cy="12" r="0.6" />
        <circle cx="13.5" cy="14" r="0.6" />
        <circle cx="19" cy="9.5" r="0.6" />
        <circle cx="22" cy="11.5" r="0.6" />
        <circle cx="24.5" cy="14" r="0.6" />
      </g>
    </svg>
  )
}

export function PizzaSliceIcon({ className = 'h-6 w-auto' }: IconProps) {
  return (
    <svg viewBox="0 0 32 36" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9 Q16 3 28 9 L16.5 30 Z" fill="#F6C453" stroke="#B9791F" strokeWidth="1" />
      <path d="M4 9 Q16 3 28 9" fill="none" stroke="#C98A34" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="13" cy="15" r="2.1" fill="#C0392B" />
      <circle cx="20" cy="17" r="2.1" fill="#C0392B" />
      <circle cx="16" cy="22" r="1.9" fill="#C0392B" />
      <path
        d="M16.5 28 C15.5 31 18.5 31 17.5 34"
        stroke="#FFF3C4"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="17.5" cy="34.5" r="1.4" fill="#FFF3C4" />
    </svg>
  )
}
