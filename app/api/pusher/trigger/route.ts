import { pusherServer } from "@/lib/pusher/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { data, status, channel = "patient-channel" } = body

  await pusherServer.trigger(channel, "form-update", {
    data,
    status,
    timestamp: Date.now(),
  })

  return NextResponse.json({ ok: true })
}
