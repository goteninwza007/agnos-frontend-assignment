import { PatientFormValues } from "./patient.schema"
import { FormStatus } from "./types"

export const PATIENT_CHANNEL = "patient-channel"
export const FORM_UPDATE_EVENT = "form-update"

export type PusherPayload = {
  data: Partial<PatientFormValues>
  status: FormStatus
}
