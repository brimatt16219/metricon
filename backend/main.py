from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.post("/compare")
def compare(request: CompareRequest):
    return {
        "items": request.items,
        "result": "comparison coming soon"
    }