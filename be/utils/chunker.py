import fitz  # PyMuPDF

def chunk_pdf(path, chunk_size=500):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
