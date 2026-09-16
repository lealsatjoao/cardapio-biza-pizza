interface TabOption {
  id: string
  label: string
  icon?: string
}

interface TabsProps {
  options: TabOption[]
  active: string
  onChange: (id: string) => void
  variant?: 'primary' | 'secondary'
}

export function Tabs({ options, active, onChange, variant = 'primary' }: TabsProps) {
  const isPrimary = variant === 'primary'

  return (
    <div
      className={
        isPrimary
          ? 'grid grid-cols-4 gap-1.5 rounded-2xl bg-black/40 p-1.5 backdrop-blur-md ring-1 ring-white/10'
          : 'flex gap-2 overflow-x-auto rounded-xl bg-black/30 p-1 backdrop-blur-md ring-1 ring-white/10'
      }
    >
      {options.map((opt) => {
        const isActive = opt.id === active
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={[
              'shrink-0 rounded-xl font-semibold transition-all duration-200',
              isPrimary ? 'flex flex-col items-center px-2 py-2.5 text-[11px]' : 'px-3.5 py-2 text-xs whitespace-nowrap',
              isActive
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {isPrimary && opt.icon && (
              <img src={opt.icon} alt={opt.label} className="mx-auto mb-1 h-8 w-8 object-contain drop-shadow-md" />
            )}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
