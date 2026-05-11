from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.routes import router as auth_router
from app.transactions.routes import router as transactions_router
from app.chat.routes import router as chat_router
from app.models import Base
from app.database import engine

app = FastAPI(title="AI Finance Coach")

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(transactions_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "AI Finance coach API is live"}

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    from app.rag.pipeline import load_knowledge_base
    load_knowledge_base()