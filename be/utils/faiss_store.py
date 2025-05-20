import os
import faiss
import numpy as np
import pickle

FAISS_DIR = "faiss_data"

def save_faiss_index(doc_name, vectors, texts):
    os.makedirs(FAISS_DIR, exist_ok=True)

    dim = len(vectors[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(vectors, dtype='float32'))

    faiss.write_index(index, os.path.join(FAISS_DIR, f"{doc_name}.index"))

    with open(os.path.join(FAISS_DIR, f"{doc_name}.pkl"), "wb") as f:
        pickle.dump(texts, f)


def load_faiss_index(doc_name):
    index = faiss.read_index(os.path.join(FAISS_DIR, f"{doc_name}.index"))
    with open(os.path.join(FAISS_DIR, f"{doc_name}.pkl"), "rb") as f:
        texts = pickle.load(f)
    return index, texts

def search_similar_chunks(query_vector, doc_name, top_k=3):
    index, texts = load_faiss_index(doc_name)
    D, I = index.search(np.array([query_vector]).astype('float32'), top_k)
    return [texts[i] for i in I[0] if i < len(texts)]

