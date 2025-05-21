from fastapi import APIRouter, Query
from pydantic import BaseModel

from utils.faiss_store import load_faiss_index
from utils.gemini_client import generate_questions
from utils.gemini_client import assess_user
from typing import List

router = APIRouter()

class QuestionPerformance(BaseModel):
    question: str
    correct_answer: str
    user_answer: str
    time_taken: int

class PerformanceRequest(BaseModel):
    questions: List[QuestionPerformance]

@router.get("/generate_question")
async def get_assessment_questions(doc_name: str = Query(...)):
    try:
        _, chunks = load_faiss_index(doc_name)
        if len(chunks) <= 5:
            selected_chunks = chunks
        else:
            step = len(chunks) // 5
            selected_chunks = [chunks[i] for i in range(0, len(chunks), step)][:5]
        combined_text = "\n\n".join(selected_chunks)
        return generate_questions(combined_text)
    except Exception as e:
        return {"error": str(e)}

@router.post("/analyze_performance")
async def analyze_performance(data: PerformanceRequest):
    try:
        assessment = "\n\n".join([
            f"""Q{i + 1}. {q.question}
            User Answer: {q.user_answer}
            Correct Answer: {q.correct_answer}
            Time Taken: {q.time_taken} seconds""" for i, q in enumerate(data.questions)
        ])
        return assess_user(assessment)
    except Exception as e:
        return {"error": str(e)}