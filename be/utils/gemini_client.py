import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def summarize_chunk(chunk_text: str) -> str:
    prompt = f"Summarize this document chunk in 3–4 sentences:\n\n{chunk_text}"
    response = model.generate_content(prompt)
    return response.text
