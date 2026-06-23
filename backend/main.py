from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from compare import compare_items
from discover import discover_items

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

class CompareRequest(BaseModel):
    items: list[str]
    category: str | None = None

class DiscoverRequest(BaseModel):
    category: str
    count: int | None = 5

@app.post("/compare")
def compare(request: CompareRequest):
    result = compare_items(request.items, request.category)
    return result

@app.post("/discover")
def discover(request: DiscoverRequest):
    result = discover_items(request.category, request.count or 5)
    return result