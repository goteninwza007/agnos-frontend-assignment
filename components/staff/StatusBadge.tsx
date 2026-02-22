import { FORM_STATUS, FormStatus } from "@/types/patient/types"

const STATUS_CONFIG: Record<FormStatus, { label: string; class: string; dot: string }> = {
  [FORM_STATUS.ACTIVE]: {
    label: "Active",
    class: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  [FORM_STATUS.SUBMITTED]: {
    label: "Submitted",
    class: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  [FORM_STATUS.INACTIVE]: {
    label: "Inactive",
    class: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
}

type StatusBadgeProps = {
  status: FormStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, class: cls, dot } = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${cls}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
