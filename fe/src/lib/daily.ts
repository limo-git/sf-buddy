import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const motivationQuotes = [
  "Believe in yourself!",
  "Keep pushing forward!",
  "Small daily progress leads to big results!",
  "Your potential is endless.",
  "Stay positive and work hard.",
]

function getRandomQuote() {
  return motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]
}

export async function sendDailyMotivationEmail() {
  const { EMAIL_USER, EMAIL } = process.env

  if (!EMAIL_USER || !EMAIL) {
    throw new Error("Missing EMAIL_USER or EMAIL in environment variables")
  }

  const quote = getRandomQuote()

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL,
    subject: "Your Daily Motivation",
    text: quote,
  })
}
