from fastapi import APIRouter, Query
from utils.faiss_store import load_faiss_index

router = APIRouter()

@router.get("/steps_count")
async def get_steps_count(doc_name: str = Query(...)):
    try:
        _, chunks = load_faiss_index(doc_name)
        return {"doc_name": doc_name, "total_steps": len(chunks)}
    except Exception as e:
        return {"error": str(e)}

@router.get("/chunks_preview")
async def get_chunk_previews(doc_name: str = Query(...)):
    try:
        _, chunks = load_faiss_index(doc_name)
        labels = [chunk.strip().split("\n")[0][:60] for chunk in chunks]
        return {"doc_name": doc_name, "labels": labels}
    except Exception as e:
        return {"error": str(e)}
