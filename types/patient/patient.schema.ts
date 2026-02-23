import { z } from "zod"

export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name is too long"),
  middleName: z.string().max(100, "Middle name is too long").optional(),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name is too long"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date <= today
    }, "Date of birth cannot be in the future"),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^0[6-9]\d{8}$/, "Invalid phone number"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  address: z.string().min(1, "Address is required").max(255, "Address is too long"),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().max(100, "Religion is too long").optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const hasName = !!data.name
      const hasRelationship = !!data.relationship

      if (hasName !== hasRelationship) {
        if (!hasName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Contact name is required",
            path: ["name"],
          })
        }

        if (!hasRelationship) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Relationship is required",
            path: ["relationship"],
          })
        }
      }
    }),
})

export type PatientFormValues = z.infer<typeof patientSchema>
