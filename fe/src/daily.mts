import cron from "node-cron"
import fetch from "node-fetch"
cron.schedule("25 16 * * *", async () => {


  try {
    const res = await fetch("http://localhost:3000/api/sendDailyMotivation", {
      method: "POST",
    })
    if (!res.ok) throw new Error(`Failed with status ${res.status}`)
    console.log("Daily motivation email sent successfully.")
  } catch (err) {
    console.error("Error sending daily motivation:", err)
  }
})
