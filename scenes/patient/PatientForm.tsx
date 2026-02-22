"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { patientSchema, PatientFormValues } from "@/types/patient/patient.schema"
import { InputField } from "@/components/ui/InputField"
import { SelectField } from "@/components/ui/SelectField"
import { TextAreaField } from "@/components/ui/TextAreaField"
import toast from "react-hot-toast"
import { FORM_STATUS } from "@/types/patient/types"
import { triggerPatientEvent } from "@/lib/pusher/trigger"
import { PATIENT_CHANNEL } from "@/types/patient/pusher"

export default function PatientForm() {
  const isSubmittedRef = useRef(false)
  const watchedFieldsRef = useRef<Partial<PatientFormValues>>({})
  const [isLocked, setIsLocked] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      address: "",
      preferredLanguage: "",
      nationality: "",
      religion: "",
      emergencyContact: undefined,
    },
  })

  const watchedFields = useWatch({ control })

  async function onSubmit(data: PatientFormValues) {
    isSubmittedRef.current = true
    setIsLocked(true)
    await triggerPatientEvent(data, FORM_STATUS.SUBMITTED)
    toast.success("Form submitted successfully.")
  }

  useEffect(() => {
    watchedFieldsRef.current = watchedFields
  }, [watchedFields])

  useEffect(() => {
    triggerPatientEvent({}, FORM_STATUS.ACTIVE)

    function handleUnload() {
      if (isSubmittedRef.current) return
      navigator.sendBeacon(
        "/api/pusher/trigger",
        new Blob(
          [
            JSON.stringify({
              data: watchedFieldsRef.current,
              status: FORM_STATUS.INACTIVE,
              channel: PATIENT_CHANNEL,
            }),
          ],
          { type: "application/json" }
        )
      )
    }

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      if (!isSubmittedRef.current) {
        triggerPatientEvent(watchedFieldsRef.current, FORM_STATUS.INACTIVE)
      }
    }
  }, [])

  useEffect(() => {
    if (isSubmittedRef.current || isLocked) return

    const hasValue = Object.values(watchedFields).some(Boolean)
    if (!hasValue) return

    triggerPatientEvent(watchedFields, FORM_STATUS.ACTIVE)
  }, [watchedFields, isLocked])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset
        disabled={isLocked}
        className={isLocked ? "opacity-60 pointer-events-none space-y-4" : "space-y-4"}
      >
        <section>
          <h2 className="text-base font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <InputField
              label="Middle Name (optional)"
              error={errors.middleName?.message}
              {...register("middleName")}
            />
            <InputField
              label="Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
            <InputField
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
            <SelectField label="Gender" error={errors.gender?.message} {...register("gender")}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </SelectField>
            <InputField
              label="Phone Number"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
            <InputField
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <InputField
              label="Preferred Language"
              error={errors.preferredLanguage?.message}
              {...register("preferredLanguage")}
            />
            <InputField
              label="Nationality"
              error={errors.nationality?.message}
              {...register("nationality")}
            />
            <InputField
              label="Religion (optional)"
              error={errors.religion?.message}
              {...register("religion")}
            />
          </div>
        </section>
        <TextAreaField label="Address" error={errors.address?.message} {...register("address")} />
        <section>
          <h2 className="text-base font-semibold text-slate-700">
            Emergency Contact <span className="text-slate-400 font-normal">(Optional)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contact Name"
              error={errors.emergencyContact?.name?.message}
              {...register("emergencyContact.name")}
            />
            <InputField
              label="Relationship"
              error={errors.emergencyContact?.relationship?.message}
              {...register("emergencyContact.relationship")}
            />
          </div>
        </section>
      </fieldset>
      <button
        type="submit"
        disabled={isSubmitting || isLocked}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}
