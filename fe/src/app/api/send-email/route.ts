import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer"; // adjust path as needed

export async function POST(req: Request) {
  try {
    const { subject, html } = await req.json();

    if (!subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sendMail({ subject, html });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
