import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot import router as chatbot_router
from routes.sample_get import router as sample_get
from routes.upload import router as upload_router
from routes.learn import router as learn_router
from routes.ask import router as ask_router
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
app.include_router(sample_get)
app.include_router(upload_router, prefix="/upload")
app.include_router(learn_router, prefix="/learn")
app.include_router(ask_router, prefix="/ask")
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)