export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button type="button" aria-label={cancelLabel} onClick={onCancel} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-xs rounded-2xl bg-neutral-950 p-4 shadow-2xl ring-1 ring-white/10 animate-[slideUp_0.15s_ease-out]">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">{message}</p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-white/5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white shadow-md hover:bg-red-500 active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
