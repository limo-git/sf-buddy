import { NextResponse } from "next/server"
import { sendDailyMotivationEmail } from "@/lib/daily"

export async function POST() {
  try {
    await sendDailyMotivationEmail()
    return NextResponse.json({ message: "Daily motivation sent!" })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ message: "Use POST to send motivation" }, { status: 405 })
}
