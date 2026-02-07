"""
Product Manager Agent using a local Ollama model.
Responds to whatever the user prompts and remembers the conversation.
"""
from __future__ import annotations

import asyncio
from typing import Any, Dict, List, Optional, Tuple

import requests

from app.core.config import settings


_SYSTEM_PROMPT = """You are a senior Product Manager. Respond to whatever the user says. Remember the conversation and reply accordingly."""


def _format_history(history: List[Tuple[str, str]]) -> str:
    if not history:
        return ""
    lines = []
    for user_msg, agent_msg in history:
        lines.append(f"User: {user_msg}")
        lines.append(f"PM: {agent_msg}")
    return "\n\n".join(lines) + "\n\n"


def _call_ollama(prompt: str) -> Dict[str, Any]:
    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": prompt,
        "system": _SYSTEM_PROMPT,
        "stream": False,
        "options": {"temperature": 0.5, "num_predict": 2048},
    }
    response = requests.post(
        f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate",
        json=payload,
        timeout=settings.OLLAMA_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()


async def generate_pm_agent_response(
    user_prompt: str,
    conversation_history: Optional[List[Tuple[str, str]]] = None,
) -> Tuple[str, str]:
    """
    Generate response. Remembers conversation history.
    """
    history = conversation_history or []
    ctx = _format_history(history)
    prompt = f"{ctx}User: {user_prompt}\n\nPM:" if ctx else f"User: {user_prompt}\n\nPM:"

    def _run() -> str:
        data = _call_ollama(prompt)
        return str(data.get("response", "")).strip()

    response_text = await asyncio.to_thread(_run)
    return response_text, "discovery"
