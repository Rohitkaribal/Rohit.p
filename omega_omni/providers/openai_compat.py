"""OpenAI-compatible provider (chat/completions).

This single class covers a large family of providers because many vendors
expose the OpenAI shape:

* OpenAI (chatgpt)
* DeepSeek
* Kimi / Moonshot
* Qwen / DashScope (compatible mode)
* Groq
* Together AI
* OpenRouter (router to many models)
* Mistral
* xAI / Grok
* Z.ai
* Venice
* Minimax (compatible mode)
* Ollama / local
"""

from __future__ import annotations

import json
from typing import Any, Optional

from omega_omni.providers.base import Provider, ProviderError, ProviderResponse


class OpenAICompatProvider(Provider):
    """One POST /chat/completions client, parameterised by base_url + model."""

    def __init__(
        self,
        *,
        name: str,
        label: str,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: str = "https://api.openai.com/v1",
        env_var: str = "OPENAI_API_KEY",
        timeout: float = 60.0,
        max_retries: int = 2,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            api_key=api_key,
            model=model,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
            extra=extra,
        )
        self.name = name
        self.label = label
        self.env_var = env_var

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        if not self.api_key:
            raise ProviderError(f"{self.name}: no api key ({self.env_var})")
        url = f"{self.base_url.rstrip('/')}/chat/completions"
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": kwargs.pop("temperature", 0.7),
        }
        payload.update(kwargs)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        with self._client() as client:
            r = client.post(url, json=payload, headers=headers)
        if r.status_code >= 400:
            raise ProviderError(f"{self.name} HTTP {r.status_code}: {r.text[:400]}")
        data = r.json()
        try:
            text = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise ProviderError(f"{self.name}: malformed response: {data}") from exc
        usage = data.get("usage", {}) or {}
        return ProviderResponse(
            provider=self.name,
            text=text or "",
            model=data.get("model", self.model or self.name),
            elapsed_ms=0,
            raw=data,
            usage={k: int(v) for k, v in usage.items() if isinstance(v, (int, float))},
        )
