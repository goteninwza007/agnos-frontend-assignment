import RoleCard from "@/components/home/RoleCard"
import { User, ClipboardList } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[70dvh] flex justify-center items-start md:items-center p-4 mt-12 md:mt-0">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">Patient Registration System</h1>
          <p className="text-sm md:text-lg text-slate-400">Please select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <RoleCard
            href="/patient"
            title="Patient"
            description="Fill in your personal information"
            color="blue"
            icon={<User className="w-6 h-6" />}
          />

          <RoleCard
            href="/staff"
            title="Staff"
            description="Monitor patient form in real-time"
            color="emerald"
            icon={<ClipboardList className="w-6 h-6" />}
          />
        </div>
      </div>
    </main>
  )
}
