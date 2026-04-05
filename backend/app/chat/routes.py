from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Transaction, ChatMessage
from app.auth.routes import get_current_user
from app.rag.pipeline import retrieve, load_knowledge_base
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/chat", tags=["chat"])
security = HTTPBearer()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    return get_current_user(credentials.credentials, db)

class ChatRequest(BaseModel):
    message: str

def get_transaction_context(user_id: int, db: Session) -> str:
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    if not transactions:
        return "No transactions uploaded yet."

    total_income = sum(t.amount for t in transactions if t.amount > 0)
    total_spent = abs(sum(t.amount for t in transactions if t.amount < 0))
    savings_rate = round(((total_income - total_spent) / total_income) * 100, 1) if total_income > 0 else 0

    by_category = {}
    for t in transactions:
        if t.amount < 0:
            cat = t.category
            by_category[cat] = by_category.get(cat, 0) + abs(t.amount)

    category_breakdown = "\n".join([f"  - {k}: ₹{round(v, 2)}" for k, v in sorted(by_category.items(), key=lambda x: -x[1])])

    return f"""Total Income: ₹{round(total_income, 2)}
Total Spent: ₹{round(total_spent, 2)}
Savings Rate: {savings_rate}%
Spending by Category:
{category_breakdown}"""

@router.post("/")
async def chat(
    request: ChatRequest,
    user: User = Depends(get_user),
    db: Session = Depends(get_db)
):
    load_knowledge_base()

    # Get RAG context
    rag_context = retrieve(request.message)

    # Get transaction context
    transaction_context = get_transaction_context(user.id, db)

    # Get chat history (last 6 messages)
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at.desc()).limit(6).all()
    history = list(reversed(history))

    messages = [
        {
            "role": "system",
            "content": f"""You are a personal finance coach. Give specific, actionable advice based on the user's actual spending data. Always reference their real numbers, never give generic advice.

Financial Knowledge (use this to ground your advice):
{rag_context}

User's Spending Summary:
{transaction_context}

Rules:
- Always reference specific numbers from their spending
- Be direct and actionable
- Keep responses under 200 words
- Use ₹ for Indian rupees
- If no transactions uploaded, ask them to upload their bank statement first"""
        }
    ]

    # Add chat history
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})

    # Add current message
    messages.append({"role": "user", "content": request.message})

    # Save user message
    db.add(ChatMessage(user_id=user.id, role="user", content=request.message))
    db.commit()

    # Stream response from Groq
    def generate():
        full_response = ""
        try:    
            stream = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                stream=True,
                max_tokens=300
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    full_response += delta
                    yield f"data: {json.dumps({'content': delta})}\n\n"

        except Exception as e:
            error_msg = "I'm having trouble connecting right now. Please try again in a moment."
            yield f"data: {json.dumps({'content': error_msg})}\n\n"
            full_response = error_msg

        # Save assistant response
        try:
            db_session = next(get_db())
            db_session.add(ChatMessage(user_id=user.id, role="assistant", content=full_response))
            db_session.commit()
        except Exception as e:
            pass
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

@router.get("/history")
def get_history(
    user: User = Depends(get_user),
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at.asc()).all()

    return [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]

@router.delete("/history")
def clear_history(
    user: User = Depends(get_user),
    db: Session = Depends(get_db)
):
    db.query(ChatMessage).filter(ChatMessage.user_id == user.id).delete()
    db.commit()
    return {"message": "Chat history cleared"}