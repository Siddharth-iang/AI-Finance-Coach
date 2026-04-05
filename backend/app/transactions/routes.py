from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Transaction, User
from app.auth.routes import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import pandas as pd
import io
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["transactions"])
security = HTTPBearer()

def get_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    return get_current_user(credentials.credentials, db)

CATEGORIES = {
    "Food Delivery": ["swiggy", "zomato", "dunzo", "foodpanda"],
    "Transport": ["uber", "ola", "rapido", "irctc", "redbus"],
    "Subscriptions": ["netflix", "spotify", "amazon prime", "hotstar", "youtube"],
    "Shopping": ["amazon", "flipkart", "myntra", "meesho", "ajio"],
    "Groceries": ["bigbasket", "blinkit", "zepto", "dmart", "grofers"],
    "Utilities": ["electricity", "water", "gas", "broadband", "airtel", "jio"],
    "Health": ["pharmacy", "apollo", "medplus", "hospital", "clinic"],
    "Education": ["udemy", "coursera", "unacademy", "byju", "college"],
}

def categorize(description: str) -> str:
    desc_lower = description.lower()
    for category, keywords in CATEGORIES.items():
        if any(keyword in desc_lower for keyword in keywords):
            return category
    return "Other"

def parse_csv(file_bytes: bytes) -> pd.DataFrame:
    df = pd.read_csv(io.BytesIO(file_bytes))
    df.columns = df.columns.str.strip().str.lower()

    date_col = next((c for c in df.columns if "date" in c), None)
    if not date_col:
        raise HTTPException(status_code=400, detail="No date column found in CSV")
    desc_col = next((c for c in df.columns if any(x in c for x in ["desc", "narration", "particular", "details", "remark"])), None)
    if not desc_col:
        raise HTTPException(status_code=400, detail="No description column found in CSV")

    if "debit" in df.columns and "credit" in df.columns:
        df["amount"] = df["credit"].fillna(0) - df["debit"].fillna(0)
    elif "amount" in df.columns:
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    else:
        raise HTTPException(status_code=400, detail="No amount column found in CSV")

    df["date"] = pd.to_datetime(df[date_col], dayfirst=True, errors="coerce")
    df["description"] = df[desc_col].astype(str)
    df["category"] = df["description"].apply(categorize)

    return df[["date", "description", "amount", "category"]].dropna(subset=["date"])

@router.post("/upload")
def upload_csv(
    file: UploadFile = File(...),
    user: User = Depends(get_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported. Please export your bank statement as CSV.")

    contents = file.file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The file is empty. Please upload a valid bank statement CSV.")

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

    try:
        df = parse_csv(contents)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV. Make sure it has date, description, and amount columns. Error: {str(e)}")

    # Delete old transactions for this user before inserting new ones
    db.query(Transaction).filter(Transaction.user_id == user.id).delete()

    for _, row in df.iterrows():
        txn = Transaction(
            user_id=user.id,
            date=row["date"],
            description=row["description"],
            amount=float(row["amount"]),
            category=row["category"],
            type="income" if float(row["amount"]) >= 0 else "expense",
            created_at=datetime.utcnow().isoformat()
        )
        db.add(txn)

    db.commit()
    return {"message": f"{len(df)} transactions imported successfully"}

@router.get("/summary")
def get_summary(
    user: User = Depends(get_user),
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).all()

    if not transactions:
        return {"message": "No transactions found"}

    total_income = sum(t.amount for t in transactions if t.amount > 0)
    total_spent = abs(sum(t.amount for t in transactions if t.amount < 0))
    savings_rate = round(((total_income - total_spent) / total_income) * 100, 1) if total_income > 0 else 0

    by_category = {}
    for t in transactions:
        if t.amount < 0:
            cat = t.category
            by_category[cat] = by_category.get(cat,0) + abs(t.amount)  

    return{
        "total_income": round(total_income,2),
        "total_spent": round(total_spent,2),
        "savings_rate": savings_rate,
        "by_category": by_category
    } 

@router.get("/charts")
def get_charts(
    user: User = Depends(get_user),
    db: Session = Depends(get_db) 
):
    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).all()

    if not transactions:
        return {"monthly":[], "daily":[], "category":[]}

    monthly = {}
    for t in transactions:
        key = t.date.strftime("%b %Y")
        if t.amount < 0:
            monthly[key] = monthly.get(key, 0) + abs(t.amount)

    daily = {}
    for t in transactions:
        key = t.date.strftime("%d %b")
        if t.amount < 0:
            daily[key] = daily.get(key, 0) + abs(t.amount)

    top = sorted(
        [t for t in transactions if t.amount < 0],
        key=lambda x: x.amount
    )[:10]

    return {
        "monthly": [{"month": k, "spent": round(v, 2)} for k, v in monthly.items()],
        "daily": [{"day": k, "spent": round(v, 2)} for k, v in daily.items()],
        "top_transactions": [
            {
                "date": t.date.strftime("%d %b %Y"),
                "description": t.description,
                "amount": abs(t.amount),
                "category": t.category
            } for t in top
        ]
    }
    
    