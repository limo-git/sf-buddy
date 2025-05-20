from fastapi import APIRouter, Form, HTTPException
import os
from utils.content import extract_pdf_text
from utils.learning_prompt import build_learning_path_prompt

# Gemini integration import
from utils.gemini_client import call_gemini_api

router = APIRouter()

@router.post("/generate_learning_path")
async def generate_learning_path(
    filename: str = Form(...),
    strengths: str = Form(...),
    weaknesses: str = Form(...),
    available_days: str = Form(...), 
    hours_per_day: int = Form(...),
    total_days: int = Form(...)
):
    try:
        path = os.path.join("documents", filename)
        if not os.path.isfile(path):
            raise HTTPException(status_code=404, detail="File not found")

        full_text = extract_pdf_text(path)

        prompt = build_learning_path_prompt(
            full_text=full_text,
            strengths=strengths,
            weaknesses=weaknesses,
            available_days=available_days,
            hours_per_day=hours_per_day,
            total_days=total_days,
        )

        # Call Gemini API with prompt
        generated_learning_path = await call_gemini_api(prompt)

        return {
            "status": "success",
            "learning_path": generated_learning_path,
            "prompt_preview": prompt[:2000] + "..."
        }

    except HTTPException:
        raise

    except Exception as e:
        return {"status": "error", "message": str(e)}
