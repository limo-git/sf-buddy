def build_learning_path_prompt(full_text: str, strengths: str, weaknesses: str,
                               available_days: str, hours_per_day: int, total_days: int) -> str:
    return f"""
You are an educational assistant.

--- PDF CONTENT START ---
{full_text}
--- PDF CONTENT END ---

User strengths: {strengths}
User weaknesses: {weaknesses}

User availability:
- Days: {available_days}
- Hours per day: {hours_per_day}
- Complete in {total_days} days

Create a personalized, academic learning schedule:
- Categorize content by topics
- Prioritize weaknesses, leverage strengths
- Distribute study hours across available days
- Ensure full coverage by deadline
Respond ONLY with the schedule and topics.
"""
