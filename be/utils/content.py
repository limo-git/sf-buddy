import fitz  # PyMuPDF
import os

def extract_pdf_text(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"PDF file not found: {path}")

    doc = fitz.open(path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text
