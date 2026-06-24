import anthropic
import os
from dotenv import load_dotenv
from utils import parse_claude_json

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

    parsed = parse_claude_json(message.content[0].text)

    return {
        "items": items,
        "attributes": parsed["attributes"],
        "data": parsed["data"],
        "recommendation": parsed["recommendation"]
    }

def add_item(item: str, attributes: list[str], category: str | None = None) -> dict:
    category_hint = f" in the category: {category}" if category else ""
    attr_list = ", ".join(attributes)

    prompt = f"""You are a comparison analysis assistant. For the item "{item}"{category_hint}, provide a value for each of these exact attributes: {attr_list}.

Return ONLY a valid JSON object with this exact structure:
{{
  "name": "{item}",
  "attribute name": "value"
}}

Rules:
- Use the EXACT attribute names given above as the JSON keys
- For numerical attributes (those with units like "Price (USD)") use numbers only, no units in the value
- For non-numerical attributes use short descriptive strings
- Include every attribute listed
- Do not include any text outside the JSON object"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    return {"item": parse_claude_json(message.content[0].text)}


def add_attribute(items: list[str], attribute: str, category: str | None = None) -> dict:
    category_hint = f" in the category: {category}" if category else ""
    items_list = ", ".join(items)

    prompt = f"""You are a comparison analysis assistant. For the attribute "{attribute}", provide its value for each of these items{category_hint}: {items_list}.

Return ONLY a valid JSON object with this exact structure:
{{
  "values": {{
    "item name": "value"
  }}
}}

Rules:
- Use the EXACT item names given above as the JSON keys
- If "{attribute}" is numerical (e.g. a price, score, or measurement) use numbers only, no units in the value
- If it is non-numerical use a short descriptive string
- Include every item listed
- Do not include any text outside the JSON object"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    return {"attribute": attribute, "values": parse_claude_json(message.content[0].text)}