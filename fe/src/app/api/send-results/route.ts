import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { score, total, feedback } = await req.json();

    if (score === undefined || total === undefined || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <h2>Assessment Results</h2>
      <p><strong>Score:</strong> ${score} / ${total}</p>
      <p><strong>Feedback:</strong></p>
      <div>${feedback.replace(/\n/g, "<br>")}</div>
    `;

    await sendMail({
      subject: "Your Assessment Results",
      html,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
  