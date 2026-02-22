import { PatientFormValues } from "@/types/patient/patient.schema"
import { PATIENT_CHANNEL } from "@/types/patient/pusher"
import { FormStatus } from "@/types/patient/types"

export async function triggerPatientEvent(data: Partial<PatientFormValues>, status: FormStatus) {
  try {
    await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, status, channel: PATIENT_CHANNEL }),
    })
  } catch (err) {
    console.error("[Pusher] trigger failed:", err)
  }
}
