from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/sample")
async def chat_with_gemini():
    try:
        return {"Hello": "World"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
