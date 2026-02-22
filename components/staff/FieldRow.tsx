type FieldRowProps = {
  label: string
  value?: string
}

export function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-400 sm:w-48 shrink-0">{label}</span>
      <span
        className={`text-sm font-medium whitespace-pre-wrap ${value ? "text-slate-800" : "text-slate-300"}`}
      >
        {value || "—"}
      </span>
    </div>
  )
}
