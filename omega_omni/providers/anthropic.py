"""Anthropic (Claude) native adapter over httpx.

Uses the Messages API: https://api.anthropic.com/v1/messages
"""

from __future__ import annotations

from typing import Any, Optional

from omega_omni.providers.base import Provider, ProviderError, ProviderResponse


class AnthropicProvider(Provider):
    name = "claude"
    label = "Claude (Anthropic)"

    def __init__(
        self,
        *,
        api_key: Optional[str] = None,
        model: str = "claude-3-5-sonnet-20241022",
        base_url: str = "https://api.anthropic.com/v1",
        env_var: str = "ANTHROPIC_API_KEY",
        timeout: float = 60.0,
        max_retries: int = 2,
        anthropic_version: str = "2023-06-01",
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            api_key=api_key, model=model, base_url=base_url,
            timeout=timeout, max_retries=max_retries, extra=extra,
        )
        self.env_var = env_var
        self.anthropic_version = anthropic_version

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def _complete(self, system: str, user: str, **kwargs: Any) -> ProviderResponse:
        if not self.api_key:
            raise ProviderError(f"{self.name}: no api key ({self.env_var})")
        url = f"{self.base_url.rstrip('/')}/messages"
        max_tokens = kwargs.pop("max_tokens", 2048)
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": system,
            "messages": [{"role": "user", "content": user}],
            "temperature": kwargs.pop("temperature", 0.7),
        }
        payload.update(kwargs)
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": self.anthropic_version,
            "Content-Type": "application/json",
        }
        with self._client() as client:
            r = client.post(url, json=payload, headers=headers)
        if r.status_code >= 400:
            raise ProviderError(f"{self.name} HTTP {r.status_code}: {r.text[:400]}")
        data = r.json()
        # content is a list of blocks
        blocks = data.get("content", [])
        text = ""
        for b in blocks:
            if isinstance(b, dict) and b.get("type") == "text":
                text += b.get("text", "")
        if not text:
            raise ProviderError(f"{self.name}: empty content: {data}")
        usage = data.get("usage", {}) or {}
        return ProviderResponse(
            provider=self.name,
            text=text,
            model=data.get("model", self.model),
            elapsed_ms=0,
            raw=data,
            usage={k: int(v) for k, v in usage.items() if isinstance(v, (int, float))},
        )
