import json


def parse_claude_json(text: str) -> dict:
    """Strip optional markdown code fences from a Claude response and parse JSON."""
    raw = text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())