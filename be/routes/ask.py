from fastapi import APIRouter
from pydantic import BaseModel
from utils.embedding import embed_chunks
from utils.faiss_store import search_similar_chunks
from utils.gemini_client import answer_question

router = APIRouter()


class AskInput(BaseModel):
    question: str
    doc_name: str


@router.post("/")
async def ask(input: AskInput):
    query_vector = embed_chunks(input.question)
    top_chunks = search_similar_chunks(query_vector, input.doc_name)

    if not top_chunks:
        return {"answer": "No relevant content found."}

    answer = answer_question(input.question, top_chunks)
    return {"answer": answer}
