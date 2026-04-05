<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.129-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/ChromaDB-RAG-FF6F00?style=for-the-badge" alt="ChromaDB" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F54E42?style=for-the-badge" alt="Groq"/>
</p>

<h1 align="center">💸 FinCoach AI</h1>

<p align="center">
  <b>Your personal AI-powered finance coach that actually knows your spending.</b><br/>
  Upload your bank statement. Get instant insights. Chat with an AI that gives advice based on <i>your real numbers</i> — not generic tips.
</p>

<p align="center">
  <a href="https://ai-finance-coach-ten.vercel.app"><img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_App-7c3aed?style=for-the-badge" alt="Live Demo" /></a>
</p>

---

## ✨ What Makes This Different?

Most finance apps show you charts. FinCoach AI **talks to you about your money**. It uses a RAG (Retrieval-Augmented Generation) pipeline that combines:

- 📊 **Your actual transaction data** — parsed and categorized from your bank CSV
- 📚 **A curated financial knowledge base** — 50/30/20 rule, emergency fund strategies, debt management, Indian-specific investment advice
- 🧠 **LLaMA 3.3 70B via Groq** — blazing fast AI responses grounded in your real spending patterns

> _"You spent ₹8,400 on food delivery — 28% above your average. Cutting to 3 orders/week saves ₹3,200 monthly."_  
> — Actual FinCoach AI response based on user data

---

## 🎯 Features

| Feature | Description |
|---|---|
| 📤 **CSV Upload** | Drop your bank statement CSV — HDFC, SBI, ICICI, Axis & more. Auto-parsed instantly. |
| 📊 **Smart Dashboard** | Pie charts, bar graphs, daily spending patterns, top transactions — all auto-generated. |
| 🤖 **AI Chat Coach** | Ask anything in plain language. Get advice referencing your real ₹ numbers. |
| 🔍 **RAG Pipeline** | ChromaDB vector store + SentenceTransformers embeddings for relevant financial knowledge retrieval. |
| ⚡ **Streaming Responses** | Real-time token streaming via Server-Sent Events — see the AI "type" its response live. |
| 🏷️ **Auto-Categorization** | Swiggy, Uber, Netflix, Amazon auto-detected across 10+ spending categories. |
| 💬 **Chat History** | Full conversation persistence with context — the AI remembers what you discussed. |
| 🔐 **Secure Auth** | JWT tokens + bcrypt password hashing. Your data stays private. |
| 🇮🇳 **Built for India** | Indian bank formats, ₹ currency, UPI-aware categorization, Hinglish support. |

---

## 🖥️ Screenshots

### Landing Page
> A premium dark-themed landing page with glassmorphism effects, gradient CTAs, and social proof sections.

### Dashboard
> Interactive charts powered by Recharts — pie charts for category breakdown, bar charts for monthly trends, line charts for daily patterns, and a top transactions list.

### AI Chat
> A real-time streaming chat interface with typing indicators, suggested prompts, and conversation history.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                     │
│              React 19 + Vite + TailwindCSS              │
│                                                         │
│  Landing ─→ Login/Register ─→ Dashboard ─→ AI Chat      │
│                         │              │                 │
│                    axios + JWT    fetch + SSE             │
└────────────────────────┬──────────────┬──────────────────┘
                         │              │
                    REST API      Streaming API
                         │              │
┌────────────────────────┴──────────────┴──────────────────┐
│                   BACKEND (Railway)                       │
│                   FastAPI + Python                        │
│                                                          │
│  /auth/*          JWT Auth (bcrypt + python-jose)         │
│  /transactions/*  CSV Upload, Summary, Charts            │
│  /chat/*          RAG + Groq LLM Streaming               │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ PostgreSQL  │  │   ChromaDB   │  │   Groq Cloud    │ │
│  │  (Railway)  │  │ Vector Store │  │ LLaMA 3.3 70B   │ │
│  │             │  │              │  │                  │ │
│  │ Users       │  │ 12 Finance   │  │ Streaming Chat   │ │
│  │ Transactions│  │ Knowledge    │  │ Completions      │ │
│  │ ChatMessages│  │ Documents    │  │                  │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- [Groq API Key](https://console.groq.com) (free tier available)

### 1. Clone & Setup Backend

```bash
git clone https://github.com/Siddharth-iang/AI-Finance-Coach.git
cd AI-Finance-Coach/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/finance_coach
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 3. Initialize Database & Run Backend

```bash
# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

The API will be live at `http://localhost:8000`

### 4. Setup & Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`

---

## 📁 Project Structure

```
ai-finance-coach/
├── backend/
│   ├── app/
│   │   ├── auth/              # JWT authentication (register, login)
│   │   ├── chat/              # AI chat with RAG + Groq streaming
│   │   ├── rag/
│   │   │   ├── documents.py   # 12 curated Indian finance knowledge docs
│   │   │   └── pipeline.py    # ChromaDB + SentenceTransformer embeddings
│   │   ├── transactions/      # CSV upload, summary, charts endpoints
│   │   ├── database.py        # SQLAlchemy + PostgreSQL connection
│   │   ├── models.py          # User, Transaction, ChatMessage models
│   │   └── main.py            # FastAPI app + CORS + startup events
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── Procfile               # Production server command
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with JWT interceptors
│   │   ├── context/           # React auth context
│   │   ├── components/        # ProtectedRoute, Spinner
│   │   └── pages/
│   │       ├── Landing.jsx    # Marketing landing page
│   │       ├── Login.jsx      # Authentication
│   │       ├── Register.jsx   # User registration
│   │       ├── Dashboard.jsx  # Charts + transaction analytics
│   │       └── Chat.jsx       # Streaming AI chat interface
│   ├── vercel.json            # SPA routing config
│   └── package.json
│
└── README.md
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login & receive JWT token |
| `POST` | `/transactions/upload` | Upload bank statement CSV |
| `GET` | `/transactions/summary` | Get income, spending, savings rate, category breakdown |
| `GET` | `/transactions/charts` | Get monthly trends, daily patterns, top transactions |
| `POST` | `/chat/` | Send message & receive streaming AI response (SSE) |
| `GET` | `/chat/history` | Retrieve full chat history |
| `DELETE` | `/chat/history` | Clear chat history |

---

## 🧠 RAG Knowledge Base

The AI coach is grounded in **12 curated financial documents** covering:

- 50/30/20 Budgeting Rule
- Emergency Fund Guidelines
- Food Delivery Spending Control
- Subscription Audit Strategy
- Savings Strategies for Young Professionals
- Transport Cost Reduction
- Impulse Purchase Control
- Debt Management (Avalanche Method)
- Investment Basics (Index Funds, SIP, PPF)
- Budget Templates (₹30K–₹60K income)
- How to Read Bank Statements
- SMART Financial Goal Setting

These are embedded using **SentenceTransformers (all-MiniLM-L6-v2)** and stored in **ChromaDB** for semantic retrieval at query time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS 4, Recharts, Lucide Icons |
| **Backend** | FastAPI, SQLAlchemy, Alembic, Pandas |
| **Database** | PostgreSQL (Railway) |
| **Vector Store** | ChromaDB + SentenceTransformers |
| **LLM** | LLaMA 3.3 70B via Groq API |
| **Auth** | JWT (python-jose) + bcrypt |
| **Hosting** | Vercel (Frontend) + Railway (Backend + DB) |

---

## 🌐 Deployment

The app is deployed and live:

- **Frontend**: [Vercel](https://ai-finance-coach-ten.vercel.app) — Auto-deploys on push to `main`
- **Backend**: [Railway](https://railway.app) — Python service + PostgreSQL database
- **LLM**: [Groq Cloud](https://groq.com) — Ultra-fast inference for LLaMA 3.3 70B

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Indians who want to actually save money<br/>
  <b>Stop guessing where your money goes.</b>
</p>
