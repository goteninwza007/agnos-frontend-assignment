import PatientForm from "@/scenes/patient/PatientForm"

export default function PatientPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-4 md:py-16 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-200">
            Patient Registration
          </h1>
          <PatientForm />
        </div>
      </div>
    </div>
  )
}
