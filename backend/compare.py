import anthropic
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def compare_items(items: list[str], category: str | None = None) -> dict:
    category_hint = f" in the category: {category}" if category else ""
    items_list = ", ".join(items)

    prompt = f"""You are a comparison analysis assistant. Compare the following items{category_hint}: {items_list}.

Return ONLY a valid JSON object with this exact structure:
{{
  "attributes": ["attr1", "attr2", ...],
  "data": [
    {{
      "name": "item name",
      "attr1": "value",
      "attr2": "value"
    }}
  ],
  "recommendation": "A short paragraph recommending which item suits different user needs."
}}

Rules:
- Choose 5-8 attributes that are most relevant and comparable across all items
- For numerical attributes (price, score, etc.) use numbers only, no units in the value — put the unit in the attribute name (e.g. "Price (USD)", "Weight (lbs)")
- For non-numerical attributes use short descriptive strings
- Do not include any text outside the JSON object"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    parsed = json.loads(raw.strip())

    return {
        "items": items,
        "attributes": parsed["attributes"],
        "data": parsed["data"],
        "recommendation": parsed["recommendation"]
    }