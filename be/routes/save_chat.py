from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime

router = APIRouter()

class Message(BaseModel):
    sender: str
    content: str
    timestamp: Optional[str] = None

class SaveChatRequest(BaseModel):
    doc_name: str
    messages: List[Message]

@router.post("/save")
async def save_chat(data: SaveChatRequest):
    folder = "data"
    if not os.path.exists(folder):
        os.makedirs(folder)

    filename = os.path.join(folder, f"{data.doc_name}.json")

    # Prepare data to write
    chat_data = {
        "doc_name": data.doc_name,
        "messages": [msg.dict() for msg in data.messages],
        "saved_at": datetime.utcnow().isoformat()
    }

    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(chat_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chat: {e}")

    return {"status": "success", "message": f"Chat saved to {filename}"}
