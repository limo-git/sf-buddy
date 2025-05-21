import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def summarize_chunk(chunk_text: str, language: str = None) -> str:
    language = language or "en"
    prompt = f"""Summarize this document chunk in 3–4 sentences:\n\n{chunk_text}
    
    Summarise this query in "{language}" language
    """
    response = model.generate_content(prompt)
    return response.text

def answer_question(question: str, context_chunks: list[str], language: str) -> str:
    context = "\n---\n".join(context_chunks)
    prompt = f"""
        Context: {context}
        
        Answer the question: "{question}"
        Please provide the answer in "{language}".
    If the student shows any sign of distress, anxiety, confusion, or frustration in their question, 
    please respond with empathy and provide supportive, reassuring guidance tailored to help the student overcome their difficulties.
    
    """
    response = model.generate_content(prompt)
    return response.text

def answer_question_in_language(question: str, language: str) -> str:
    prompt = f"""
        You are an AI Assistant for educating students,
        this is the question : "{question}"
        
        Please answer it in "{language}" language
    """
    respone = model.generate_content(prompt)
    return respone.text

def generate_questions(content: str):
    prompt = f"""
        You are an expert exam question generator.
    
        Given the following text, generate **20 multiple-choice questions (MCQs)** in JSON format.
    
        Each object should have:
        - "question": the question text
        - "options": a list of 4 strings (answer options)
        - "answer": the correct option text exactly as it appears in "options"
    
        Input Context:
        {content}
    
        Return the result as a JSON array of 20 such objects.
    """
    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text.removeprefix("```json").strip()
    if raw_text.endswith("```"):
        raw_text = raw_text.removesuffix("```").strip()
    parsed = json.loads(raw_text)
    return {"questions": parsed}

def assess_user(assessment: str):
    prompt = f"""
    You are an AI education coach.

    Below is a user's quiz attempt. For each question, their answer, the correct answer, and time taken are provided.

    Based on this, generate:
    - Do not give any introduction in the beginning just tell the performance directly 
    - A summary of their overall performance
    - Areas where the user is strong and weak (by topic or type of question)
    - Suggestions for improvement

    Format the response as clear structured paragraphs.

    User's Quiz Data:
    {assessment}
    """
    response = model.generate_content(prompt)
    return {"analysis": response.text.strip()}

async def call_gemini_api(prompt: str) -> str:

    response = model.generate_content(prompt)
    return response.text
