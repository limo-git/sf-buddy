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

def answer_question(question: str, context_chunks: list[str], language: str) -> str:
    context = "\n---\n".join(context_chunks)
    prompt = f"""
        Context: {context}
        
        Answer the question: "{question}"
        Please provide the answer in {language}.
    """
    response = model.generate_content(prompt)
    return response.text


async def call_gemini_api(prompt: str) -> str:

    response = model.generate_content(prompt)
    return response.text
