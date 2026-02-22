"use client"

import { useEffect, useState } from "react"
import { PatientFormValues } from "@/types/patient/patient.schema"
import { CHANNEL, FORM_STATUS, FormStatus } from "@/types/patient/types"
import { pusherClient } from "@/lib/pusher/client"
import { StatusBadge } from "@/components/staff/StatusBadge"
import { FieldRow } from "@/components/staff/FieldRow"

type PusherPayload = {
  data: Partial<PatientFormValues>
  status: FormStatus
}
export default function StaffView() {
  const [patientData, setPatientData] = useState<Partial<PatientFormValues>>({})
  const [status, setStatus] = useState<FormStatus>(FORM_STATUS.INACTIVE)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const channel = pusherClient.subscribe(CHANNEL)

    channel.bind("form-update", (payload: PusherPayload) => {
      setStatus(payload.status)
      setLastUpdated(new Date())

      if (payload.status !== FORM_STATUS.INACTIVE) {
        setPatientData(payload.data)
      }

      if (payload.status === FORM_STATUS.ACTIVE) {
        const hasNewData = Object.values(payload.data).some(Boolean)
        if (!hasNewData) setPatientData({})
      }
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(CHANNEL)
    }
  }, [])

  const hasData = Object.values(patientData).some(Boolean)
  const isInactive = status === FORM_STATUS.INACTIVE

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Staff View</h1>
            <p className="text-sm text-slate-400">Real-time patient form monitor</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div
          className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-opacity ${
            isInactive ? "opacity-50 border-slate-100" : "opacity-100 border-slate-100"
          }`}
        >
          <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Patient Information</h2>
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          {!hasData ? (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-300 text-sm">
                {isInactive
                  ? "No patient currently in the form."
                  : "Waiting for patient to start filling..."}
              </p>
            </div>
          ) : (
            <div className="px-4 md:px-6 py-2">
              <p className="text-sm font-semibold uppercase tracking-wider mt-4 mb-1">Personal</p>
              <FieldRow label="First Name" value={patientData.firstName} />
              <FieldRow label="Middle Name" value={patientData.middleName} />
              <FieldRow label="Last Name" value={patientData.lastName} />
              <FieldRow label="Date of Birth" value={patientData.dateOfBirth} />
              <FieldRow label="Gender" value={patientData.gender} />
              <FieldRow label="Nationality" value={patientData.nationality} />
              <FieldRow label="Religion" value={patientData.religion} />

              <p className="text-sm font-semibold uppercase tracking-wider mt-6 mb-1">Contact</p>
              <FieldRow label="Phone Number" value={patientData.phoneNumber} />
              <FieldRow label="Email" value={patientData.email} />
              <FieldRow label="Address" value={patientData.address} />
              <FieldRow label="Preferred Language" value={patientData.preferredLanguage} />

              <p className="text-sm font-semibold uppercase tracking-wider mt-6 mb-1">
                Emergency Contact
              </p>
              <FieldRow label="Contact Name" value={patientData.emergencyContact?.name} />
              <FieldRow label="Relationship" value={patientData.emergencyContact?.relationship} />
            </div>
          )}
          {status === FORM_STATUS.SUBMITTED && (
            <div className="mx-6 mb-6 mt-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium text-center">
              Patient has submitted the form
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
