from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from rag_engine import RAGService
from translator import TerjmanService
from security_agent import SecurityAgent

app = FastAPI(title="Marrakech AI API")

# Allow Frontend to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
rag_service = RAGService()
translator = TerjmanService()
security_agent = SecurityAgent()

# --- Models ---
class ChatRequest(BaseModel):
    query: str

class TranslateRequest(BaseModel):
    text: str
    target: str # 'darija' or 'english'

class SecurityRequest(BaseModel):
    location: str

class SocialPost(BaseModel):
    username: str
    content: str
    image_url: Optional[str] = "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80"

# --- In-Memory DB for MVP ---
social_feed = []

# --- Endpoints ---

@app.post("/api/chat")
async def chat(request: ChatRequest):
    result = rag_service.get_answer(request.query)
    return {"response": result['result']}

@app.post("/api/translate")
async def translate(request: TranslateRequest):
    result = translator.translate(request.text, request.target)
    return {"translation": result}

@app.post("/api/security")
async def check_security(request: SecurityRequest):
    return security_agent.check_safety(request.location)

@app.get("/api/social")
async def get_social():
    return social_feed

@app.post("/api/social")
async def post_social(post: SocialPost):
    social_feed.insert(0, post) # Add to top
    return {"status": "success"}
