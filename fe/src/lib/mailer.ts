import nodemailer from "nodemailer"
import { marked } from "marked"

export async function sendMail({
  subject,
  markdown,
  html,
}: {
  subject: string
  markdown?: string
  html?: string
}) {
  const { EMAIL_USER, EMAIL_PASS, EMAIL } = process.env

  if (!EMAIL || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Missing required environment variables for sending mail")
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  const finalHtml = html || (markdown ? marked(markdown) : "")

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL,
    subject,
    html: finalHtml,
  })
}
