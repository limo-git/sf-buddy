import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot import router as chatbot_router
from pydantic import BaseModel
from typing import List
    
app = FastAPI(debug=True)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add routes here
app.include_router(chatbot_router)
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)