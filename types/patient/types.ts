export const FORM_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUBMITTED: "submitted",
} as const

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS]

export const CHANNEL = "patient-channel"
