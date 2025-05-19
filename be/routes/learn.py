from fastapi import APIRouter, Query
from utils.faiss_store import load_faiss_index
from utils.gemini_client import summarize_chunk

router = APIRouter()

@router.get("/")
async def learn_step(doc_name: str = Query(...), step: int = Query(...)):
    index, chunks = load_faiss_index(doc_name)

    if step < 0 or step >= len(chunks):
        return {"error": "Invalid step index"}

    chunk = chunks[step]
    summary = summarize_chunk(chunk)

    return {
        "step": step,
        "summary": summary
    }
