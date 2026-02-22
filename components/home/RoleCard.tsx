import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

type RoleCardProps = {
  href: string
  title: string
  description: string
  icon: ReactNode
  color: "blue" | "emerald"
}

export default function RoleCard({ href, title, description, icon, color }: RoleCardProps) {
  const colorStyles = {
    blue: {
      border: "hover:border-blue-300",
      shadow: "hover:shadow-md",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
      iconText: "text-blue-500",
      titleHover: "group-hover:text-blue-600",
      arrow: "group-hover:text-blue-400",
    },
    emerald: {
      border: "hover:border-emerald-300",
      shadow: "hover:shadow-md",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      iconText: "text-emerald-500",
      titleHover: "group-hover:text-emerald-600",
      arrow: "group-hover:text-emerald-400",
    },
  }

  const styles = colorStyles[color]

  return (
    <Link href={href}>
      <div
        className={`group bg-white border border-slate-200 rounded-2xl p-4 md:p-6 transition-all cursor-pointer ${styles.border} ${styles.shadow}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${styles.iconBg}`}
          >
            <div className={styles.iconText}>{icon}</div>
          </div>

          <div className="flex-1">
            <h2 className={`font-semibold transition-colors ${styles.titleHover}`}>{title}</h2>
            <p className="text-sm text-slate-400">{description}</p>
          </div>

          <ChevronRight
            className={`w-5 h-5 text-slate-300 transition-all group-hover:translate-x-1 ${styles.arrow}`}
          />
        </div>
      </div>
    </Link>
  )
}
