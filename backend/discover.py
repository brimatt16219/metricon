import anthropic
import os
from dotenv import load_dotenv
from tavily import TavilyClient
from utils import parse_claude_json

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def discover_items(category: str, count: int = 5) -> dict:
    # 1. Search the web for popular items in this category
    search = tavily.search(
        query=f"most popular {category} to compare in 2025",
        max_results=5,
    )

    # 2. Collect the search result snippets as context for Claude
    context = "\n".join(
        f"- {r['title']}: {r['content']}" for r in search["results"]
    )

    # 3. Ask Claude to extract a clean list of comparable item names
    prompt = f"""Based on the following web search results about "{category}", extract a list of {count} specific, popular, and comparable items in this category.

Search results:
{context}

Return ONLY a valid JSON object with this structure:
{{
  "items": ["item 1", "item 2", "item 3"]
}}

Rules:
- Each item must be a specific named product/entity, not a generic term
- Items must be directly comparable to each other
- Return exactly {count} items if possible
- Do not include any text outside the JSON object"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )

    parsed = parse_claude_json(message.content[0].text)

    return {"category": category, "items": parsed["items"]}