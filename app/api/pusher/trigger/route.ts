import { pusherServer } from "@/lib/pusher/server"
import { PATIENT_CHANNEL, FORM_UPDATE_EVENT } from "@/types/patient/pusher"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { data, status, channel = PATIENT_CHANNEL } = body

  await pusherServer.trigger(channel, FORM_UPDATE_EVENT, {
    data,
    status,
    timestamp: Date.now(),
  })

  return NextResponse.json({ ok: true })
}
