import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def compare_items(items: list[str], category: str | None = None) -> dict:
    category_hint = f" They are in the category: {category}." if category else ""
    items_list = ", ".join(items)

    prompt = f"""You are a helpful product and service comparison assistant.
Compare the following items: {items_list}.{category_hint}

For each item provide:
- A brief overview
- Key strengths
- Key weaknesses

Then provide an overall recommendation based on different user needs.

Respond in clear, structured markdown."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "items": items,
        "analysis": message.content[0].text
    }