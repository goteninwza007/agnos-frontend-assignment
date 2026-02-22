type TextAreaFieldProps = {
  label: string
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaField({ label, error, ...props }: TextAreaFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-600">{label}</label>
      <textarea
        {...props}
        rows={3}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none transition ${
          error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
