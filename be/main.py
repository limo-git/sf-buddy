import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot import router as chatbot_router
from routes.sample_get import router as sample_get
from routes.upload import router as upload_router
from routes.learn import router as learn_router
from routes.ask import router as ask_router
from routes.docs import router as docs_router
from routes.steps_count import router as steps_count
from routes.learning_path import router as generate_learning_path
from routes.save_chat import router as save_chat
from pydantic import BaseModel
from typing import List

app = FastAPI(debug=True)

origins = [
    "*",
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
app.include_router(docs_router, prefix="/doc")
app.include_router(steps_count, prefix="/doc/count")
app.include_router(generate_learning_path, prefix="/path")
app.include_router(save_chat, prefix="/save")
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)