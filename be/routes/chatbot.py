from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.gemini_client import answer_question_in_language
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str

@router.post("/chatbot")
async def chat_with_gemini(payload: ChatRequest):
    try:
        response = answer_question_in_language(payload.message, payload.language)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
  