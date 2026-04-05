import chromadb
from chromadb.utils import embedding_functions
from app.rag.documents import documents
import os

from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

chroma_client = chromadb.PersistentClient(path="./chroma_db")

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = chroma_client.get_or_create_collection(
    name="finance_knowledge",
    embedding_function=embedding_fn
)

def load_knowledge_base():
    if collection.count() > 0:
        return
    collection.add(
        documents=[d["content"] for d in documents],
        metadatas=[{"title": d["title"]} for d in documents],
        ids=[f"doc_{i}" for i in range(len(documents))]
    )
    print(f"Loaded {len(documents)} documents into ChromaDB")

# Retrive the top 3 most relevent articles
def retrieve(query: str, n_results: int = 3) -> str:
    results = collection.query(query_texts=[query], n_results=n_results)
    chunks = results["documents"][0]
    titles = [m["title"] for m in results["metadatas"][0]]
    return "\n\n".join([f"[{titles[i]}]\n{chunks[i]}" for i in range(len(chunks))])