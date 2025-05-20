import os
import asyncio
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

app = FastAPI()
router = APIRouter()

DATA_FOLDER = "data"
ANALYSIS_FOLDER = "analysis"

if not os.path.exists(ANALYSIS_FOLDER):
    os.makedirs(ANALYSIS_FOLDER)

def call_gemini_api(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text

async def analyze_single_chat(doc_name: str):
    chat_file = os.path.join(DATA_FOLDER, f"{doc_name}.txt")
    if not os.path.exists(chat_file):
        return

    with open(chat_file, "r") as f:
        chat_text = f.read()

    prompt = f"""
    Based on the following chat transcript, identify the user's strengths and weaknesses in learning or communication. Provide them in a clear list format.

    Chat transcript:
    {chat_text}
    """

    analysis = await asyncio.to_thread(call_gemini_api, prompt)

    # Save the analysis to a file
    analysis_file = os.path.join(ANALYSIS_FOLDER, f"{doc_name}_analysis.txt")
    with open(analysis_file, "w") as f:
        f.write(analysis)

async def periodic_analysis_task():
    while True:
        doc_names = []
        if os.path.exists(DATA_FOLDER):
            for f in os.listdir(DATA_FOLDER):
                if f.endswith(".txt"):
                    doc_names.append(f.replace(".txt", ""))

        for doc_name in doc_names:
            await analyze_single_chat(doc_name)

        await asyncio.sleep(100)  # wait 5 minutes before next run

@app.on_event("startup")
async def startup_event():
    # Run periodic analysis in the background
    asyncio.create_task(periodic_analysis_task())

@router.get("/analysis/{doc_name}")
async def get_analysis(doc_name: str):
    analysis_file = os.path.join(ANALYSIS_FOLDER, f"{doc_name}_analysis.txt")
    if not os.path.exists(analysis_file):
        return {"error": "Analysis not found yet, please wait for the background task to run."}
    with open(analysis_file, "r") as f:
        analysis = f.read()
    return {
        "document": doc_name,
        "analysis": analysis,
    }

app.include_router(router)
