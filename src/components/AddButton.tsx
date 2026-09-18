export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/90 text-base font-bold text-white shadow-md transition-transform active:scale-90 hover:bg-orange-500"
    >
      +
    </button>
  )
}
