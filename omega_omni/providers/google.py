"""Google Gemini native adapter over httpx.

Uses generateContent:
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
"""

from __future__ import annotations

from typing import Any, Optional

from omega_omni.providers.base import Provider, ProviderError, ProviderResponse


class GeminiProvider(Provider):
    name = "gemini"
    label = "Gemini (Google)"

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        model: str = "gemini-1.5-flash",
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
        env_var: str = "GOOGLE_API_KEY",
        timeout: float = 60.0,
        max_retries: int = 2,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            api_key=api_key, model=model, base_url=base_url,
            timeout=timeout, max_retries=max_retries, extra=extra,
        )
        self.env_var = env_var

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        if not self.api_key:
            raise ProviderError(f"{self.name}: no api key ({self.env_var})")
        url = f"{self.base_url.rstrip('/')}/models/{self.model}:generateContent"
        payload = {
            "system_instruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {
                "temperature": kwargs.pop("temperature", 0.7),
                "maxOutputTokens": kwargs.pop("max_tokens", 2048),
            },
        }
        with self._client() as client:
            r = client.post(url, json=payload, params={"key": self.api_key})
        if r.status_code >= 400:
            raise ProviderError(f"{self.name} HTTP {r.status_code}: {r.text[:400]}")
        data = r.json()
        text = ""
        cands = data.get("candidates", [])
        if cands:
            parts = cands[0].get("content", {}).get("parts", [])
            for p in parts:
                if isinstance(p, dict) and "text" in p:
                    text += p["text"]
        if not text:
            raise ProviderError(f"{self.name}: empty content: {data}")
        usage = data.get("usageMetadata", {}) or {}
        return ProviderResponse(
            provider=self.name,
            text=text,
            model=self.model or self.name,
            elapsed_ms=0,
            raw=data,
            usage={k: int(v) for k, v in usage.items() if isinstance(v, (int, float))},
        )
