import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from compare import compare_items, add_item, add_attribute
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

class AddItemRequest(BaseModel):
    item: str
    attributes: list[str]
    category: str | None = None

class AddAttributeRequest(BaseModel):
    items: list[str]
    attribute: str
    category: str | None = None

@app.post("/compare")
def compare(request: CompareRequest):
    try:
        result = compare_items(request.items, request.category)
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="The AI returned an invalid response. Please try again.")
    except Exception:
        raise HTTPException(status_code=502, detail="Something went wrong while comparing. Please try again.")

@app.post("/discover")
def discover(request: DiscoverRequest):
    try:
        result = discover_items(request.category, request.count or 5)
        return result
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="The AI returned an invalid response. Please try again.")
    except Exception:
        raise HTTPException(status_code=502, detail="Search failed. Please try again in a moment.")
    
@app.post("/compare/add-item")
def compare_add_item(request: AddItemRequest):
    try:
        return add_item(request.item, request.attributes, request.category)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="The AI returned an invalid response. Please try again.")
    except Exception:
        raise HTTPException(status_code=502, detail="Could not add that item. Please try again.")

@app.post("/compare/add-attribute")
def compare_add_attribute(request: AddAttributeRequest):
    try:
        return add_attribute(request.items, request.attribute, request.category)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="The AI returned an invalid response. Please try again.")
    except Exception:
        raise HTTPException(status_code=502, detail="Could not add that attribute. Please try again.")