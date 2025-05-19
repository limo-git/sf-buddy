from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure the Gemini API with the API key from the environment
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@router.post("/chatbot")
async def chat_with_gemini(payload: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(payload.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
  