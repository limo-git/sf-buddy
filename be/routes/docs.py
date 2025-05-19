from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/")
async def list_documents():
    folder = "faiss_data"
    docs = []
    if os.path.exists(folder):
        for f in os.listdir(folder):
            if f.endswith(".index"):
                name = f.replace(".index", "")
                docs.append(name)
    return {"documents": docs}
