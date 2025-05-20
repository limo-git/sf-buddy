from fastapi import APIRouter, UploadFile, File
import os
from utils.chunker import chunk_pdf
from utils.embedding import embed_chunks
from utils.faiss_store import save_faiss_index
from datetime import datetime

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs("documents", exist_ok=True)
    timestamp = int(datetime.utcnow().timestamp() * 1000)
    unique_filename = f"{timestamp}_{file.filename}"
    path = f"documents/{unique_filename}"

    with open(path, "wb") as f:
        content = await file.read()
        f.write(content)

    chunks = chunk_pdf(path)
    embeddings = embed_chunks(chunks)
    save_faiss_index(unique_filename, embeddings, chunks)

    return {"message": "Uploaded and embedded", "filename": unique_filename}
