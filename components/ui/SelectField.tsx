type SelectFieldProps = {
  label: string
  error?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

export function SelectField({ label, error, children, ...props }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-600">{label}</label>
      <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white transition ${
          error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-blue-500"
        }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
