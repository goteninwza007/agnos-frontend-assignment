type InputFieldProps = {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-600">{label}</label>
      <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
          error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
